import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllProducts, 
  getProductById, 
  searchProducts, 
  filterProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct 
} from '@/models/Product';

// GET /api/products - Get all products or search/filter
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const searchQuery = searchParams.get('search');
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const maxPrice = searchParams.get('maxPrice');
    
    // If search query is provided, search products
    if (searchQuery) {
      const results = await searchProducts(searchQuery);
      return NextResponse.json(results);
    }
    
    // If filters are provided, filter products
    if (category || brand || maxPrice) {
      const filters: any = {};
      
      if (category) filters.category = category;
      if (brand) filters.brand = brand;
      if (maxPrice) filters.price = parseFloat(maxPrice);
      
      const results = await filterProducts(filters);
      return NextResponse.json(results);
    }
    
    // Otherwise, return all products
    const products = await getAllProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error getting products:', error);
    return NextResponse.json({ error: 'Failed to get products' }, { status: 500 });
  }
}

// POST /api/products - Add a new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'category', 'brand', 'description', 'price', 'stock', 'specifications'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }
    
    const newProduct = await addProduct(body);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
  }
}