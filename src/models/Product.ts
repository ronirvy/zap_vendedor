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

// Sample products for testing
export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    category: 'phone',
    brand: 'Apple',
    description: 'The latest iPhone with A17 Pro chip, 48MP camera, and titanium design.',
    price: 999.99,
    stock: 50,
    specifications: {
      display: '6.1-inch Super Retina XDR',
      processor: 'A17 Pro',
      storage: '256GB',
      camera: '48MP main, 12MP ultra-wide, 12MP telephoto',
      battery: '3,274 mAh',
      os: 'iOS 17'
    },
    imageUrl: 'https://example.com/iphone15pro.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra',
    category: 'phone',
    brand: 'Samsung',
    description: 'Flagship Android phone with S Pen, 200MP camera, and AI features.',
    price: 1199.99,
    stock: 30,
    specifications: {
      display: '6.8-inch Dynamic AMOLED 2X',
      processor: 'Snapdragon 8 Gen 3',
      storage: '512GB',
      camera: '200MP main, 12MP ultra-wide, 10MP telephoto, 10MP periscope',
      battery: '5,000 mAh',
      os: 'Android 14'
    },
    imageUrl: 'https://example.com/s24ultra.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'MacBook Pro 16"',
    category: 'laptop',
    brand: 'Apple',
    description: 'Powerful laptop with M3 Pro chip, 16-inch display, and long battery life.',
    price: 2499.99,
    stock: 20,
    specifications: {
      display: '16-inch Liquid Retina XDR',
      processor: 'M3 Pro',
      memory: '32GB unified memory',
      storage: '1TB SSD',
      graphics: 'M3 Pro GPU',
      battery: 'Up to 22 hours'
    },
    imageUrl: 'https://example.com/macbookpro16.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    name: 'Dell XPS 15',
    category: 'laptop',
    brand: 'Dell',
    description: 'Premium Windows laptop with InfinityEdge display and powerful performance.',
    price: 1899.99,
    stock: 15,
    specifications: {
      display: '15.6-inch 4K OLED',
      processor: 'Intel Core i9-13900H',
      memory: '32GB DDR5',
      storage: '1TB NVMe SSD',
      graphics: 'NVIDIA RTX 4070',
      battery: 'Up to 12 hours'
    },
    imageUrl: 'https://example.com/dellxps15.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '5',
    name: 'AirPods Pro 2',
    category: 'accessory',
    brand: 'Apple',
    description: 'Wireless earbuds with active noise cancellation and spatial audio.',
    price: 249.99,
    stock: 100,
    specifications: {
      type: 'In-ear wireless earbuds',
      features: 'Active noise cancellation, Transparency mode, Spatial audio',
      battery: 'Up to 6 hours (30 hours with case)',
      connectivity: 'Bluetooth 5.3',
      charging: 'USB-C, Wireless'
    },
    imageUrl: 'https://example.com/airpodspro2.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// In-memory product store (replace with database in production)
let products: Product[] = [...sampleProducts];

// Product service functions
export function getAllProducts(): Product[] {
  return products;
}

export function getProductById(id: string): Product | undefined {
  return products.find(product => product.id === id);
}

export function searchProducts(query: string): Product[] {
  const lowercaseQuery = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.brand.toLowerCase().includes(lowercaseQuery) ||
    product.category.toLowerCase().includes(lowercaseQuery)
  );
}

export function filterProducts(filters: Partial<Product>): Product[] {
  return products.filter(product => {
    for (const [key, value] of Object.entries(filters)) {
      if (key === 'price' && typeof value === 'number') {
        if (product.price > value) return false;
      } else if (product[key as keyof Product] !== value) {
        return false;
      }
    }
    return true;
  });
}

export function addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  products.push(newProduct);
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | undefined {
  const index = products.findIndex(product => product.id === id);
  
  if (index === -1) return undefined;
  
  products[index] = {
    ...products[index],
    ...updates,
    updatedAt: new Date()
  };
  
  return products[index];
}

export function deleteProduct(id: string): boolean {
  const initialLength = products.length;
  products = products.filter(product => product.id !== id);
  return products.length < initialLength;
}