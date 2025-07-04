import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';

export interface Product {
  id: string;
  name: string;
  category: 'phone' | 'laptop' | 'accessory' | string;
  brand: string;
  description: string;
  price: number;
  stock: number;
  specifications: Record<string, any>;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Funções de persistência no MongoDB
export async function getAllProducts(): Promise<Product[]> {
  const db = await getDb();
  const products = await db.collection('products').find().toArray();
  return products.map(mapMongoProduct);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const db = await getDb();
  const product = await db.collection('products').findOne({ _id: new ObjectId(id) });
  return product ? mapMongoProduct(product) : undefined;
}

export async function searchProducts(query: string): Promise<Product[]> {
  const db = await getDb();
  const regex = new RegExp(query, 'i');
  const products = await db.collection('products').find({
    $or: [
      { name: regex },
      { description: regex },
      { brand: regex },
      { category: regex }
    ]
  }).toArray();
  return products.map(mapMongoProduct);
}

export async function filterProducts(filters: Partial<Product>): Promise<Product[]> {
  const db = await getDb();
  const mongoFilters: any = {};
  if (filters.category) mongoFilters.category = filters.category;
  if (filters.brand) mongoFilters.brand = filters.brand;
  if (filters.price) mongoFilters.price = { $lte: filters.price };
  const products = await db.collection('products').find(mongoFilters).toArray();
  return products.map(mapMongoProduct);
}

export async function addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
  const db = await getDb();
  const now = new Date();
  const result = await db.collection('products').insertOne({
    ...product,
    createdAt: now,
    updatedAt: now
  });
  return mapMongoProduct({ ...product, _id: result.insertedId, createdAt: now, updatedAt: now });
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined> {
  const db = await getDb();
  const now = new Date();
  const result = await db.collection('products').findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...updates, updatedAt: now } },
    { returnDocument: 'after' }
  );
  return result ? mapMongoProduct(result) : undefined;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const db = await getDb();
  const result = await db.collection('products').deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}

// Utilitário para mapear o _id do Mongo para id string
function mapMongoProduct(doc: any): Product {
  return {
    ...doc,
    id: doc._id.toString(),
    createdAt: new Date(doc.createdAt),
    updatedAt: new Date(doc.updatedAt)
  };
}