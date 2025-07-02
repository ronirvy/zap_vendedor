# ZapVendedor - Arquitetura e Documentação Técnica

## Visão Geral

ZapVendedor é uma aplicação de chatbot para WhatsApp que utiliza inteligência artificial local (Ollama) e o Protocolo de Contexto de Modelo (MCP) para fornecer recomendações de produtos e responder a perguntas de clientes sobre produtos eletrônicos. A aplicação é construída com Next.js, utilizando a arquitetura App Router, e integra-se com a API do WhatsApp Business para enviar e receber mensagens.

## Arquitetura do Sistema

### Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────────┐
│                        Cliente WhatsApp                          │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API WhatsApp Business                       │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Webhook do WhatsApp                          │
│                 /api/whatsapp-webhook/route.ts                   │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Processador de Mensagens                      │
│                       /lib/whatsapp.ts                           │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Serviço de IA (Ollama)                      │
│                        /lib/ollama.ts                            │
└─────┬─────────────────────────┬───────────────────────────┬─────┘
      │                         │                           │
      ▼                         ▼                           ▼
┌──────────────┐      ┌──────────────────┐      ┌────────────────┐
│  Servidor MCP │      │  Servidor MCP    │      │ Armazenamento  │
│   Database    │      │      Web         │      │ de Conversas   │
└──────────────┘      └──────────────────┘      └────────────────┘
      │                         │                           │
      ▼                         ▼                           ▼
┌──────────────┐      ┌──────────────────┐      ┌────────────────┐
│   Produtos   │      │  Dados da Web    │      │  Conversas     │
└──────────────┘      └──────────────────┘      └────────────────┘
```

### Fluxo de Dados

1. **Recebimento de Mensagens**:
   - O cliente envia uma mensagem via WhatsApp
   - A API do WhatsApp Business encaminha a mensagem para o webhook da aplicação
   - O webhook processa a mensagem e a encaminha para o processador de mensagens

2. **Processamento de Mensagens**:
   - O processador de mensagens extrai o número de telefone e o texto da mensagem
   - A mensagem é enviada para o serviço de IA (Ollama)

3. **Geração de Resposta com IA**:
   - O serviço de IA utiliza o Ollama para processar a mensagem
   - O serviço de IA utiliza os servidores MCP para acessar informações de produtos e dados da web
   - Uma resposta é gerada com base no contexto da conversa e nos dados disponíveis

4. **Envio de Resposta**:
   - A resposta é enviada de volta para o cliente via API do WhatsApp Business
   - A conversa é armazenada para referência futura

5. **Administração**:
   - O painel de administração permite gerenciar produtos, visualizar conversas e configurar a aplicação

## Tecnologias Utilizadas

### Frontend e Backend

- **Next.js 14**: Framework React com App Router para renderização de páginas e API routes
- **React 18**: Biblioteca para construção de interfaces de usuário
- **TypeScript**: Superset tipado de JavaScript para desenvolvimento mais seguro
- **Tailwind CSS**: Framework CSS utilitário para estilização

### Inteligência Artificial

- **Ollama**: Serviço local para execução de modelos de linguagem
- **LLaMA2**: Modelo de linguagem utilizado para processamento de linguagem natural
- **MCP (Model Context Protocol)**: Protocolo para interações estruturadas com IA

### Integração

- **WhatsApp Business API**: API para envio e recebimento de mensagens via WhatsApp
- **Axios**: Cliente HTTP para requisições à API do WhatsApp e Ollama
- **Cheerio**: Biblioteca para web scraping

### Armazenamento de Dados

- **Armazenamento em memória**: Implementação atual para produtos e conversas
- **Preparado para integração com banco de dados**: Estrutura pronta para migração para MongoDB ou outro banco de dados

## Estrutura de Código

### Organização de Diretórios

```
/src
  /app                   # Páginas e rotas da aplicação (Next.js App Router)
    /admin               # Páginas de administração
      /products          # Gerenciamento de produtos
      /conversations     # Visualização de conversas
      /settings          # Configurações da aplicação
    /api                 # Rotas de API
      /whatsapp-webhook  # Webhook para receber mensagens do WhatsApp
      /products          # API para gerenciamento de produtos
      /conversations     # API para gerenciamento de conversas
    /page.tsx            # Página inicial
    /layout.tsx          # Layout principal da aplicação
  /components            # Componentes React reutilizáveis
    /MCPInitializer.tsx  # Componente para inicialização dos servidores MCP
  /lib                   # Bibliotecas e utilitários
    /whatsapp.ts         # Serviço para processamento de mensagens do WhatsApp
    /ollama.ts           # Serviço para interação com a API do Ollama
    /mcp.ts              # Gerenciamento dos servidores MCP
    /mcp-mock.ts         # Implementação mock do protocolo MCP
  /models                # Modelos de dados
    /Product.ts          # Modelo e serviço para produtos
    /Conversation.ts     # Modelo e serviço para conversas
  /mcp                   # Implementações de servidores MCP
    /database-server.ts  # Servidor MCP para acesso ao banco de dados
    /web-server.ts       # Servidor MCP para acesso à web
```

## Componentes Principais

### 1. Webhook do WhatsApp (`/src/app/api/whatsapp-webhook/route.ts`)

Este componente é responsável por receber e processar as mensagens do WhatsApp. Ele implementa dois endpoints:

- **GET**: Para verificação do webhook pelo WhatsApp Business API
- **POST**: Para recebimento de mensagens

```typescript
export async function GET(request: NextRequest) {
  // Verificação do webhook
}

export async function POST(request: NextRequest) {
  // Processamento de mensagens recebidas
}
```

### 2. Processador de Mensagens (`/src/lib/whatsapp.ts`)

Este serviço processa as mensagens recebidas do WhatsApp, obtém respostas da IA e envia respostas de volta para o cliente.

Principais funções:
- `processMessage`: Processa uma mensagem recebida
- `sendWhatsAppMessage`: Envia uma mensagem para um usuário do WhatsApp
- `storeConversation`: Armazena uma conversa no banco de dados

### 3. Serviço de IA (`/src/lib/ollama.ts`)

Este serviço interage com o Ollama para gerar respostas às mensagens dos clientes. Ele mantém o histórico de conversas e utiliza os servidores MCP para acessar informações adicionais.

Principais funções:
- `getAIResponse`: Obtém uma resposta da IA para uma mensagem
- `checkOllamaStatus`: Verifica se o Ollama está em execução e se o modelo está disponível

### 4. Servidores MCP

#### Servidor de Banco de Dados (`/src/mcp/database-server.ts`)

Este servidor MCP fornece ferramentas para a IA acessar o banco de dados de produtos.

Ferramentas:
- `search-products`: Pesquisa produtos por consulta
- `filter-products`: Filtra produtos por categoria, marca e/ou preço
- `get-product`: Obtém um produto por ID

#### Servidor Web (`/src/mcp/web-server.ts`)

Este servidor MCP fornece ferramentas para a IA pesquisar na web e extrair informações.

Ferramentas:
- `web-search`: Pesquisa na web por informações
- `scrape-webpage`: Extrai conteúdo de uma página web
- `compare-prices`: Compara preços de um produto em diferentes sites

### 5. Implementação Mock do MCP (`/src/lib/mcp-mock.ts`)

Esta é uma implementação simplificada do Protocolo de Contexto de Modelo (MCP), criada para substituir o pacote `@anthropic-ai/mcp` que não está disponível publicamente.

Classes:
- `Server`: Cria servidores MCP que fornecem ferramentas e recursos
- `Resource`: Representa fontes de dados que podem ser acessadas pela IA
- `Tool`: Representa funções que podem ser executadas pela IA
- `Client`: Conecta-se a servidores MCP e executa ferramentas ou busca recursos

### 6. Gerenciamento de Servidores MCP (`/src/lib/mcp.ts`)

Este módulo gerencia o ciclo de vida dos servidores MCP.

Funções:
- `initializeMCPServers`: Inicializa os servidores MCP
- `stopMCPServers`: Para os servidores MCP
- `getMCPServerStatus`: Obtém o status dos servidores MCP

### 7. Inicializador de MCP (`/src/components/MCPInitializer.tsx`)

Este componente React inicializa os servidores MCP quando a aplicação é carregada e os para quando a aplicação é fechada.

## Modelos de Dados

### Produto (`/src/models/Product.ts`)

```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  imageUrl?: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}
```

Funções:
- `getAllProducts`: Obtém todos os produtos
- `getProductById`: Obtém um produto por ID
- `searchProducts`: Pesquisa produtos por consulta
- `filterProducts`: Filtra produtos por categoria, marca e/ou preço
- `createProduct`: Cria um novo produto
- `updateProduct`: Atualiza um produto existente
- `deleteProduct`: Exclui um produto

### Conversa (`/src/models/Conversation.ts`)

```typescript
interface Conversation {
  id: string;
  phoneNumber: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}
```

Funções:
- `getAllConversations`: Obtém todas as conversas
- `getConversationByPhoneNumber`: Obtém uma conversa por número de telefone
- `addMessageToConversation`: Adiciona uma mensagem a uma conversa
- `createConversation`: Cria uma nova conversa
- `deleteConversation`: Exclui uma conversa

## Painel de Administração

### Gerenciamento de Produtos (`/src/app/admin/products/page.tsx`)

Esta página permite aos administradores gerenciar produtos, incluindo:
- Listar todos os produtos
- Adicionar novos produtos
- Editar produtos existentes
- Excluir produtos

### Visualização de Conversas (`/src/app/admin/conversations/page.tsx`)

Esta página permite aos administradores visualizar conversas com clientes, incluindo:
- Listar todas as conversas
- Visualizar mensagens de uma conversa
- Filtrar conversas por número de telefone
- Excluir conversas

### Configurações (`/src/app/admin/settings/page.tsx`)

Esta página permite aos administradores configurar a aplicação, incluindo:
- Configurações do WhatsApp Business API
- Configurações do Ollama
- Configurações dos servidores MCP

## Configuração e Ambiente

### Variáveis de Ambiente

A aplicação utiliza as seguintes variáveis de ambiente, que devem ser definidas no arquivo `.env.local`:

```
# Credenciais da API do WhatsApp Business
WHATSAPP_PHONE_NUMBER_ID=seu_id_de_numero_de_telefone
WHATSAPP_ACCESS_TOKEN=seu_token_de_acesso
WHATSAPP_VERIFY_TOKEN=seu_token_de_verificacao

# Configurações do Ollama
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL=llama2-chat

# Configurações do MCP
MCP_DATABASE_SERVER_PORT=3001
MCP_WEB_SERVER_PORT=3002
```

## Integração com WhatsApp Business API

### Configuração do Webhook

Para receber mensagens do WhatsApp, é necessário configurar um webhook na Meta Developer Portal:

1. Criar uma conta de desenvolvedor Meta e configurar um aplicativo WhatsApp Business
2. Configurar a URL do webhook para apontar para o endpoint `/api/whatsapp-webhook` da aplicação
3. Definir o token de verificação no arquivo `.env.local` para corresponder ao configurado no Meta Developer Portal
4. Adicionar o ID do número de telefone do WhatsApp Business e o token de acesso ao arquivo `.env.local`

### Envio de Mensagens

A aplicação envia mensagens para o WhatsApp utilizando a API do WhatsApp Business:

```typescript
async function sendWhatsAppMessage(phoneNumber: string, message: string): Promise<void> {
  const url = `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`;
  
  await axios.post(
    url,
    {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: phoneNumber,
      type: 'text',
      text: {
        body: message,
        preview_url: false
      }
    },
    {
      headers: {
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }
  );
}
```

## Integração com Ollama

### Configuração do Ollama

Para utilizar o Ollama, é necessário:

1. Instalar o Ollama localmente (https://ollama.ai/)
2. Iniciar o servidor Ollama: `ollama serve`
3. Baixar o modelo LLaMA2: `ollama pull llama2-chat`
4. Configurar a URL da API e o modelo no arquivo `.env.local`

### Geração de Respostas

A aplicação gera respostas utilizando o Ollama:

```typescript
async function getAIResponse(phoneNumber: string, message: string): Promise<string> {
  // Preparar o prompt do sistema com informações dos servidores MCP
  const systemPrompt = `...`;
  
  // Obter informações relevantes de produtos com base na mensagem
  const productContext = await getProductContext(message);
  
  // Fazer requisição à API do Ollama com contexto aprimorado
  const response = await axios.post(`${OLLAMA_API_URL}/api/chat`, {
    model: OLLAMA_MODEL,
    messages: [
      {
        role: 'system',
        content: systemPrompt + productContext
      },
      ...conversationHistory[phoneNumber]
    ],
    stream: false
  });
  
  return response.data.message.content;
}
```

## Implementação do MCP

### Protocolo de Contexto de Modelo

O Protocolo de Contexto de Modelo (MCP) permite que a IA interaja com fontes de dados externas de forma estruturada. A implementação mock fornece:

- **Servidores**: Fornecem ferramentas e recursos para a IA
- **Recursos**: Representam fontes de dados que podem ser acessadas pela IA
- **Ferramentas**: Representam funções que podem ser executadas pela IA
- **Cliente**: Conecta-se a servidores MCP e executa ferramentas ou busca recursos

### Exemplo de Uso do MCP

```typescript
// Criar um servidor MCP
const server = new Server({
  name: 'database-server',
  description: 'Provides access to the product database'
});

// Adicionar uma ferramenta ao servidor
server.addTool(
  new Tool({
    name: 'search-products',
    description: 'Search for products by query',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The search query'
        }
      },
      required: ['query']
    },
    async execute({ query }) {
      const products = searchProducts(query);
      return {
        products,
        count: products.length
      };
    }
  })
);

// Conectar um cliente ao servidor
const client = new Client();
client.connectToServer(server);

// Executar uma ferramenta
const result = await client.executeTool('database-server', 'search-products', {
  query: 'smartphone'
});
```

## Considerações de Segurança

### Autenticação e Autorização

- A API do WhatsApp é protegida por tokens de acesso
- O painel de administração deve ser protegido por autenticação (a ser implementado)
- As rotas de API devem validar solicitações para evitar acesso não autorizado

### Validação de Entrada

- Todas as entradas do usuário devem ser validadas antes do processamento
- As mensagens do WhatsApp devem ser verificadas quanto à autenticidade
- As solicitações de API devem ser validadas quanto à estrutura e conteúdo

### Proteção de Dados

- Informações sensíveis devem ser armazenadas de forma segura
- Tokens de acesso e chaves de API devem ser protegidos
- Dados de conversas devem ser tratados com confidencialidade

## Escalabilidade e Desempenho

### Considerações de Escalabilidade

- A implementação atual utiliza armazenamento em memória, que deve ser substituído por um banco de dados real para produção
- O processamento de mensagens pode ser movido para uma fila para lidar com alto volume
- Os servidores MCP podem ser distribuídos para melhorar o desempenho

### Otimizações de Desempenho

- Implementar cache para respostas comuns
- Otimizar consultas ao banco de dados
- Utilizar técnicas de pré-processamento para melhorar o tempo de resposta da IA

## Implementação Mock do WhatsApp

Para facilitar o desenvolvimento e testes sem depender de credenciais reais da API do WhatsApp Business, a aplicação inclui uma implementação mock que simula o comportamento da API do WhatsApp.

### Componentes do Mock

#### 1. Biblioteca Mock do WhatsApp (`/src/lib/whatsapp-mock.ts`)

Esta biblioteca fornece implementações simuladas das funções principais do WhatsApp:

- `processMessage`: Processa mensagens recebidas e gera respostas usando a IA
- `sendWhatsAppMessage`: Simula o envio de mensagens para o WhatsApp
- `simulateIncomingMessage`: Permite simular o recebimento de mensagens para testes
- `getAllMockMessages`: Retorna todas as mensagens mock armazenadas
- `clearMockMessages`: Limpa todas as mensagens mock

As mensagens são armazenadas em memória e podem ser acessadas para fins de teste e depuração.

#### 2. API de Teste do WhatsApp (`/src/app/api/test-whatsapp/route.ts`)

Esta API fornece endpoints para testar a integração com o WhatsApp:

- **POST**: Simula o recebimento de uma mensagem do WhatsApp
- **GET**: Retorna todas as mensagens mock armazenadas
- **GET com action=clear**: Limpa todas as mensagens mock

#### 3. Interface de Teste do WhatsApp (`/src/app/test-whatsapp/page.tsx`)

Esta página web permite testar a integração com o WhatsApp através de uma interface gráfica:

- Enviar mensagens de teste para o chatbot
- Visualizar o histórico de conversas
- Limpar todas as mensagens

### Fluxo de Dados com o Mock

1. **Simulação de Mensagem Recebida**:
   - O usuário envia uma mensagem através da interface de teste
   - A API de teste simula o recebimento de uma mensagem do WhatsApp
   - A mensagem é processada pelo processador de mensagens mock

2. **Processamento de Mensagem**:
   - O processador de mensagens mock extrai o número de telefone e o texto da mensagem
   - A mensagem é enviada para o serviço de IA (Ollama)
   - A resposta da IA é armazenada no histórico de mensagens mock

3. **Visualização de Respostas**:
   - A interface de teste atualiza automaticamente para mostrar a resposta da IA
   - O usuário pode continuar a conversa enviando mais mensagens

### Alternância entre Mock e Implementação Real

A aplicação detecta automaticamente se as credenciais reais do WhatsApp estão configuradas:

- Se `WHATSAPP_ACCESS_TOKEN` não estiver definido ou for igual ao valor padrão, a implementação mock é usada
- Se `WHATSAPP_ACCESS_TOKEN` estiver definido com um valor real, a implementação real é usada

Isso permite uma transição suave do desenvolvimento para a produção quando as credenciais reais estiverem disponíveis.

## Próximos Passos

### Melhorias Planejadas

1. **Integração com WhatsApp Business API Real**:
   - Substituir a implementação mock pela integração real quando as credenciais estiverem disponíveis

2. **Integração com Banco de Dados Real**:
   - Substituir o armazenamento em memória por MongoDB ou outro banco de dados

3. **Autenticação e Autorização**:
   - Implementar sistema de autenticação para o painel de administração
   - Adicionar controle de acesso baseado em funções

4. **Melhorias na IA**:
   - Implementar fine-tuning do modelo para melhorar as respostas
   - Adicionar suporte a múltiplos idiomas

5. **Expansão de Recursos**:
   - Adicionar suporte a mensagens multimídia (imagens, áudio, vídeo)
   - Implementar fluxos de conversação estruturados

6. **Monitoramento e Análise**:
   - Adicionar métricas e logs para monitoramento
   - Implementar análise de sentimento e satisfação do cliente

## Conclusão

ZapVendedor é uma aplicação robusta e flexível para atendimento ao cliente via WhatsApp, utilizando inteligência artificial local e o Protocolo de Contexto de Modelo para fornecer respostas personalizadas e relevantes. A arquitetura modular e a implementação em Next.js permitem fácil extensão e manutenção, enquanto a integração com Ollama proporciona processamento de linguagem natural avançado sem dependência de serviços externos de IA.