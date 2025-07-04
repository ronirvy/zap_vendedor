import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  phoneNumber: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

// Funções de persistência no MongoDB
export async function getConversationByPhoneNumber(phoneNumber: string): Promise<Conversation | undefined> {
  const db = await getDb();
  const conv = await db.collection('conversations').findOne({ phoneNumber });
  return conv ? mapMongoConversation(conv) : undefined;
}

export async function getAllConversations(): Promise<Conversation[]> {
  const db = await getDb();
  const convs = await db.collection('conversations').find().toArray();
  return convs.map(mapMongoConversation);
}

export async function addMessage(phoneNumber: string, role: 'user' | 'assistant', content: string): Promise<Message> {
  const db = await getDb();
  const now = new Date();
  const conversation = await db.collection('conversations').findOne({ phoneNumber });
  const message: Message = {
    id: Date.now().toString(),
    role,
    content,
    timestamp: now
  };
  if (conversation) {
    await db.collection('conversations').updateOne(
      { phoneNumber },
      [
        {
          $set: {
            messages: { $concatArrays: ["$messages", [message]] },
            updatedAt: now
          }
        }
      ]
    );
  } else {
    await db.collection('conversations').insertOne({
      phoneNumber,
      messages: [message],
      createdAt: now,
      updatedAt: now
    });
  }
  return message;
}

export async function getRecentMessages(phoneNumber: string, limit: number = 10): Promise<Message[]> {
  const db = await getDb();
  const conv = await db.collection('conversations').findOne({ phoneNumber });
  if (!conv) return [];
  const messages = conv.messages || [];
  return messages.slice(-limit);
}

export async function deleteConversation(phoneNumber: string): Promise<boolean> {
  const db = await getDb();
  const result = await db.collection('conversations').deleteOne({ phoneNumber });
  return result.deletedCount === 1;
}

export async function clearAllConversations(): Promise<void> {
  const db = await getDb();
  await db.collection('conversations').deleteMany({});
}

function mapMongoConversation(doc: any): Conversation {
  return {
    id: doc._id ? doc._id.toString() : '',
    phoneNumber: doc.phoneNumber,
    messages: (doc.messages || []).map((m: any) => ({
      ...m,
      timestamp: new Date(m.timestamp)
    })),
    createdAt: new Date(doc.createdAt),
    updatedAt: new Date(doc.updatedAt)
  };
}