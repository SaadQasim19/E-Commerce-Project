# Testing External Products API 🧪

Quick guide to test the new external products API integration.

## 🚀 Starting the Server

```bash
cd E-Commerce-Project
npm start
```

Server should start at: `http://localhost:5000`

## 🧪 Testing with Postman/Browser

### 1. Browse External Products (Public)

**GET** `http://localhost:5000/api/external-products?source=all&limit=20`

**Response:**
```json
{
  "success": true,
  "count": 60,
  "source": "all",
  "products": [
    {
      "name": "Product Name",
      "description": "Description",
      "price": 99.99,
      "image": "https://...",
      "category": "electronics",
      "rating": 4.5,
      "stock": 100,
      "source": "fakestore",
      "externalId": "fakestore_1",
      "brand": "Apple",
      "discount": 10
    }
  ]
}
```

**Test Different Sources:**
- All APIs: `?source=all&limit=30`
- FakeStore: `?source=fakestore&limit=10`
- DummyJSON: `?source=dummyjson&limit=20`
- Platzi: `?source=platzi&limit=15`

**Filter by Category:**
- Electronics: `?source=all&category=electronics&limit=20`
- Clothing: `?source=all&category=clothing&limit=20`
- Shoes: `?source=platzi&category=shoes&limit=10`

### 2. Get All Categories (Public)

**GET** `http://localhost:5000/api/external-products/categories?source=all`

**Response:**
```json
{
  "success": true,
  "count": 45,
  "categories": [
    "electronics",
    "clothing",
    "jewelry",
    "shoes",
    "home",
    "beauty",
    "automotive"
  ]
}
```

**Test Different Sources:**
- All: `?source=all`
- FakeStore: `?source=fakestore`
- DummyJSON: `?source=dummyjson`
- Platzi: `?source=platzi`

### 3. Search Products (Public)

**GET** `http://localhost:5000/api/external-products/search?q=laptop&limit=20`

**Response:**
```json
{
  "success": true,
  "count": 12,
  "query": "laptop",
  "products": [...]
}
```

**Test Queries:**
- `?q=laptop&limit=10`
- `?q=phone&limit=15`
- `?q=shirt&limit=20`
- `?q=shoes&limit=10`

### 4. Get Combined Products (Public)

**GET** `http://localhost:5000/api/external-products/combined?category=electronics&includeExternal=true&limit=50`

**Response:**
```json
{
  "success": true,
  "count": 50,
  "dbCount": 5,
  "products": [...]
}
```

This returns:
- Manual products from your database (dbCount: 5)
- External API products (45 more to reach limit: 50)
- No duplicates

**Test Scenarios:**
- All products: `?includeExternal=true&limit=100`
- Manual only: `?includeExternal=false`
- Electronics: `?category=electronics&includeExternal=true&limit=30`
- Clothing: `?category=clothing&includeExternal=true&limit=40`

### 5. Sync Products to Database (Admin Only)

**POST** `http://localhost:5000/api/external-products/sync`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Body:**
```json
{
  "source": "all",
  "category": "electronics",
  "limit": 50
}
```

**Response:**
```json
{
  "success": true,
  "message": "Synced 48 products, skipped 2",
  "synced": 48,
  "skipped": 2,
  "products": [...]
}
```

**Test Scenarios:**
- Sync all sources: `{"source": "all", "limit": 100}`
- Sync FakeStore: `{"source": "fakestore", "limit": 20}`
- Sync specific category: `{"source": "dummyjson", "category": "smartphones", "limit": 30}`

**Note:** 
- Requires admin authentication token
- Duplicates are automatically skipped using `externalId`
- Admin will receive notification after successful sync

### 6. Clear Synced Products (Admin Only)

**DELETE** `http://localhost:5000/api/external-products/clear/fakestore`

**Headers:**
```
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Response:**
```json
{
  "success": true,
  "message": "Deleted 20 products from fakestore",
  "deletedCount": 20
}
```

**Test Scenarios:**
- Clear FakeStore: `/clear/fakestore`
- Clear DummyJSON: `/clear/dummyjson`
- Clear Platzi: `/clear/platzi`
- Clear all synced: `/clear/all` (keeps manual products)

## 🔐 Getting Admin Token

### Method 1: Login as Admin

**POST** `http://localhost:5000/api/auth/login`

**Body:**
```json
{
  "email": "admin@example.com",
  "password": "your-admin-password"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

Copy the `token` value and use it in Authorization header.

### Method 2: Check Browser LocalStorage

If you're already logged in as admin on frontend:
1. Open browser DevTools (F12)
2. Go to Application > Local Storage
3. Look for `token` key
4. Copy the value

## 🌐 Testing in Frontend

### Update HomePage to Show Combined Products

```javascript
// Frontend/src/Pages/HomePage.jsx
import { useEffect, useState } from 'react';
import ProductStore from '../Store/product';
import ProductCard from '../Components/ProductCard';

function HomePage() {
  const { oldProduct, fetchCombinedProducts } = ProductStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      await fetchCombinedProducts('', true, 100);
      setLoading(false);
    };
    
    loadProducts();
  }, []);

  if (loading) return <div>Loading products...</div>;

  return (
    <div>
      <h1>All Products ({oldProduct.length})</h1>
      <div className="products-grid">
        {oldProduct.map(product => (
          <ProductCard 
            key={product._id || product.externalId} 
            product={product}
          />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
```

### Add Product Source Badge

```javascript
// Frontend/src/Components/ProductCard.jsx
function ProductCard({ product }) {
  const isExternal = product.source !== 'manual';
  
  return (
    <div className="product-card">
      {isExternal && (
        <span className="badge badge-api">
          API: {product.source}
        </span>
      )}
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="price">${product.price}</p>
      {product.rating && (
        <p className="rating">⭐ {product.rating}/5</p>
      )}
    </div>
  );
}
```

## ✅ Expected Results

### Successful Responses:

1. **Browse External Products:**
   - Status: 200 OK
   - Returns 20-60 products depending on limit
   - Products have all required fields
   - Different sources have different products

2. **Get Categories:**
   - Status: 200 OK
   - Returns 10-45 categories
   - Category names are normalized

3. **Search:**
   - Status: 200 OK
   - Returns relevant products
   - Empty array if no matches

4. **Combined Products:**
   - Status: 200 OK
   - Shows DB products + API products
   - No duplicate externalIds
   - dbCount shows manual products

5. **Sync (Admin):**
   - Status: 200 OK
   - Products saved to database
   - Duplicates are skipped
   - Admin gets notification

6. **Clear (Admin):**
   - Status: 200 OK
   - Products deleted from database
   - Manual products are preserved

### Error Responses:

1. **Missing Query Parameter:**
```json
{
  "success": false,
  "message": "Please provide a search query"
}
```

2. **Invalid Source:**
```json
{
  "success": false,
  "message": "Invalid source"
}
```

3. **Unauthorized (Non-admin trying to sync):**
```json
{
  "success": false,
  "message": "Not authorized - Admin only"
}
```

4. **API Failure:**
```json
{
  "success": false,
  "message": "Error fetching external products",
  "error": "Network timeout"
}
```

## 🐛 Common Issues

### Issue 1: Empty Products Array
**Cause:** API might be down or category doesn't exist
**Solution:** 
- Test API directly in browser (e.g., https://fakestoreapi.com/products)
- Check category name spelling
- Try different source

### Issue 2: Duplicate Products After Sync
**Cause:** externalId not set or null
**Solution:**
- Check product model has externalId field
- Clear database: DELETE `/clear/all`
- Re-sync

### Issue 3: 401 Unauthorized on Sync
**Cause:** Not logged in as admin
**Solution:**
- Login as admin user
- Copy token from response
- Add to Authorization header

### Issue 4: Server Won't Start
**Cause:** Missing dependencies
**Solution:**
```bash
cd E-Commerce-Project
npm install axios
npm start
```

## 📊 Performance Testing

### Test Load Times:

```bash
# Using curl to measure response time

# FakeStore (should be ~500ms)
time curl "http://localhost:5000/api/external-products?source=fakestore&limit=20"

# DummyJSON (should be ~300ms)
time curl "http://localhost:5000/api/external-products?source=dummyjson&limit=20"

# Platzi (should be ~700ms)
time curl "http://localhost:5000/api/external-products?source=platzi&limit=20"

# All combined (should be ~1.5-2s)
time curl "http://localhost:5000/api/external-products?source=all&limit=60"
```

### Expected Performance:
- Single API: < 1 second
- All APIs: 1.5-2 seconds
- Sync 50 products: 3-5 seconds
- Clear products: < 500ms

## 🎉 Success Checklist

- [ ] Server starts without errors
- [ ] GET /api/external-products returns products
- [ ] GET /categories returns category list
- [ ] GET /search finds products
- [ ] GET /combined shows both sources
- [ ] POST /sync saves products to DB (admin)
- [ ] DELETE /clear removes synced products (admin)
- [ ] Frontend displays combined products
- [ ] Product cards show source badge
- [ ] No duplicate products
- [ ] Performance is acceptable (< 2s for all APIs)

## 🚀 Next Steps

Once testing is complete:
1. Update HomePage to use `fetchCombinedProducts()`
2. Add category filter dropdown
3. Add "Show API Products" toggle
4. Create Admin sync panel
5. Add product source badges
6. Implement search functionality

Happy testing! 🎉
