import axios from 'axios';

//** External Product API Service , Integrates with multiple free product APIs to fetch real products , also dummy data for testing
 

// API Sources Configuration
const API_SOURCES = {
  FAKESTORE: 'https://fakestoreapi.com',
  DUMMYJSON: 'https://dummyjson.com',
  PLATZI: 'https://api.escuelajs.co/api/v1',
};

// Category Mapping (External API → Our System)
const CATEGORY_MAPPING = {
  // FakeStore categories
  "men's clothing": 'clothing',
  "women's clothing": 'clothing',
  "jewelery": 'jewelry',
  "electronics": 'electronics',
  
  // DummyJSON categories
  "smartphones": 'electronics',
  "laptops": 'electronics',
  "fragrances": 'beauty',
  "skincare": 'beauty',
  "groceries": 'groceries',
  "home-decoration": 'home',
  "furniture": 'home',
  "tops": 'clothing',
  "womens-dresses": 'clothing',
  "womens-shoes": 'shoes',
  "mens-shirts": 'clothing',
  "mens-shoes": 'shoes',
  "mens-watches": 'accessories',
  "womens-watches": 'accessories',
  "womens-bags": 'accessories',
  "womens-jewellery": 'jewelry',
  "sunglasses": 'accessories',
  "automotive": 'automotive',
  "motorcycle": 'automotive',
  "lighting": 'home',
  
  // Platzi categories
  "clothes": 'clothing',
  "shoes": 'shoes',
  "others": 'misc',
};

/**
 * Fetch products from FakeStore API
 */
export const fetchFromFakeStore = async (category = null, limit = 20) => {
  try {
    let url = `${API_SOURCES.FAKESTORE}/products`;
    
    if (category) {
      url = `${API_SOURCES.FAKESTORE}/products/category/${category}`;
    }
    
    const response = await axios.get(url, { params: { limit } });
    
    return response.data.map(product => ({
      name: product.title,
      description: product.description,
      price: product.price,
      image: product.image,
      category: CATEGORY_MAPPING[product.category] || product.category,
      rating: product.rating?.rate || 0,
      stock: Math.floor(Math.random() * 100) + 10, // Random stock
      source: 'fakestore',
      externalId: `fakestore_${product.id}`,
      brand: 'Various',
    }));
  } catch (error) {
    console.error('Error fetching from FakeStore:', error.message);
    return [];
  }
};

/**
 * Get FakeStore categories
 */
export const getFakeStoreCategories = async () => {
  try {
    const response = await axios.get(`${API_SOURCES.FAKESTORE}/products/categories`);
    return response.data;
  } catch (error) {
    console.error('Error fetching FakeStore categories:', error.message);
    return [];
  }
};

/**
 * Fetch products from DummyJSON API
 */
export const fetchFromDummyJSON = async (category = null, limit = 20, skip = 0) => {
  try {
    let url = `${API_SOURCES.DUMMYJSON}/products`;
    
    if (category) {
      url = `${API_SOURCES.DUMMYJSON}/products/category/${category}`;
    }
    
    const response = await axios.get(url, { 
      params: { limit, skip } 
    });
    
    return response.data.products.map(product => ({
      name: product.title,
      description: product.description,
      price: product.price,
      image: product.thumbnail || product.images?.[0] || '',
      category: CATEGORY_MAPPING[product.category] || product.category,
      rating: product.rating || 0,
      stock: product.stock || 0,
      source: 'dummyjson',
      externalId: `dummyjson_${product.id}`,
      brand: product.brand || 'Various',
      discount: product.discountPercentage || 0,
    }));
  } catch (error) {
    console.error('Error fetching from DummyJSON:', error.message);
    return [];
  }
};

/**
 * Get DummyJSON categories
 */
export const getDummyJSONCategories = async () => {
  try {
    const response = await axios.get(`${API_SOURCES.DUMMYJSON}/products/categories`);
    return response.data;
  } catch (error) {
    console.error('Error fetching DummyJSON categories:', error.message);
    return [];
  }
};

/**
 * Fetch products from Platzi API
 */
export const fetchFromPlatzi = async (category = null, limit = 20, offset = 0) => {
  try {
    let url = `${API_SOURCES.PLATZI}/products`;
    const params = { limit, offset };
    
    if (category) {
      params.categoryId = category;
    }
    
    const response = await axios.get(url, { params });
    
    return response.data.map(product => ({
      name: product.title,
      description: product.description,
      price: product.price,
      image: product.images?.[0] || product.category?.image || '',
      category: CATEGORY_MAPPING[product.category?.name.toLowerCase()] || 'misc',
      rating: Math.random() * 2 + 3, // Random rating 3-5
      stock: Math.floor(Math.random() * 100) + 10,
      source: 'platzi',
      externalId: `platzi_${product.id}`,
      brand: 'Various',
    }));
  } catch (error) {
    console.error('Error fetching from Platzi:', error.message);
    return [];
  }
};

/**
 * Get Platzi categories
 */
export const getPlatziCategories = async () => {
  try {
    const response = await axios.get(`${API_SOURCES.PLATZI}/categories`);
    return response.data.map(cat => ({
      id: cat.id,
      name: cat.name,
      image: cat.image,
    }));
  } catch (error) {
    console.error('Error fetching Platzi categories:', error.message);
    return [];
  }
};

/**
 * Fetch products from multiple sources
 */
export const fetchFromAllSources = async (category = null, limit = 60) => {
  try {
    const limitPerSource = Math.floor(limit / 3);
    
    const [fakeStoreProducts, dummyJSONProducts, platziProducts] = await Promise.all([
      fetchFromFakeStore(category, limitPerSource),
      fetchFromDummyJSON(category, limitPerSource),
      fetchFromPlatzi(category, limitPerSource),
    ]);
    
    return [
      ...fakeStoreProducts,
      ...dummyJSONProducts,
      ...platziProducts,
    ];
  } catch (error) {
    console.error('Error fetching from all sources:', error.message);
    return [];
  }
};

/**
 * Get all available categories from all sources
 */
export const getAllCategories = async () => {
  try {
    const [fakeStoreCategories, dummyJSONCategories, platziCategories] = await Promise.all([
      getFakeStoreCategories(),
      getDummyJSONCategories(),
      getPlatziCategories(),
    ]);
    
    // Combine and deduplicate
    const allCategories = new Set();
    
    fakeStoreCategories.forEach(cat => allCategories.add(cat));
    dummyJSONCategories.forEach(cat => allCategories.add(cat));
    platziCategories.forEach(cat => allCategories.add(cat.name));
    
    return Array.from(allCategories);
  } catch (error) {
    console.error('Error fetching all categories:', error.message);
    return [];
  }
};

/**
 * Search products across all APIs
 */
export const searchExternalProducts = async (query, limit = 30) => {
  try {
    // DummyJSON has search functionality
    const searchUrl = `${API_SOURCES.DUMMYJSON}/products/search?q=${encodeURIComponent(query)}&limit=${limit}`;
    const response = await axios.get(searchUrl);
    
    return response.data.products.map(product => ({
      name: product.title,
      description: product.description,
      price: product.price,
      image: product.thumbnail || product.images?.[0] || '',
      category: CATEGORY_MAPPING[product.category] || product.category,
      rating: product.rating || 0,
      stock: product.stock || 0,
      source: 'dummyjson',
      externalId: `dummyjson_${product.id}`,
      brand: product.brand || 'Various',
    }));
  } catch (error) {
    console.error('Error searching external products:', error.message);
    return [];
  }
};

export default {
  fetchFromFakeStore,
  fetchFromDummyJSON,
  fetchFromPlatzi,
  fetchFromAllSources,
  getFakeStoreCategories,
  getDummyJSONCategories,
  getPlatziCategories,
  getAllCategories,
  searchExternalProducts,
};
