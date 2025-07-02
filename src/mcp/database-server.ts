import { Server, Resource, Tool } from '@/lib/mcp-mock';
import { 
  getAllProducts, 
  getProductById, 
  searchProducts, 
  filterProducts 
} from '@/models/Product';

/**
 * MCP Server for database access
 * This server provides tools for the AI to query the product database
 */
export function createDatabaseMCPServer() {
  // Create a new MCP server
  const server = new Server({
    name: 'database-server',
    description: 'Provides access to the product database'
  });

  // Add a resource for accessing all products
  server.addResource(
    new Resource({
      name: 'all-products',
      description: 'Get all products in the database',
      async fetch() {
        const products = getAllProducts();
        return {
          content: JSON.stringify(products),
          contentType: 'application/json'
        };
      }
    })
  );

  // Add a tool for searching products
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

  // Add a tool for filtering products
  server.addTool(
    new Tool({
      name: 'filter-products',
      description: 'Filter products by category, brand, and/or price',
      parameters: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            description: 'The product category'
          },
          brand: {
            type: 'string',
            description: 'The product brand'
          },
          maxPrice: {
            type: 'number',
            description: 'The maximum price'
          }
        }
      },
      async execute(params) {
        const filters: any = {};
        
        if (params.category) filters.category = params.category;
        if (params.brand) filters.brand = params.brand;
        if (params.maxPrice) filters.price = params.maxPrice;
        
        const products = filterProducts(filters);
        return {
          products,
          count: products.length
        };
      }
    })
  );

  // Add a tool for getting a product by ID
  server.addTool(
    new Tool({
      name: 'get-product',
      description: 'Get a product by ID',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The product ID'
          }
        },
        required: ['id']
      },
      async execute({ id }) {
        const product = getProductById(id);
        
        if (!product) {
          throw new Error(`Product with ID ${id} not found`);
        }
        
        return product;
      }
    })
  );

  return server;
}