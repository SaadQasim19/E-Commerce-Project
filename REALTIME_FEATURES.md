# Real-Time & Transaction Features ⚡

## ✨ What's New

Your E-Commerce project now has:

### 🔄 MongoDB Transactions
- **Atomic order creation** - Orders, stock updates, and notifications succeed or fail together
- **Stock management** - Prevents overselling with transactional stock decrements
- **Data consistency** - No partial updates or race conditions

### ⚡ Real-Time Updates via Socket.IO
- **Live notifications** - Instant delivery of order updates, promotions, and alerts
- **Stock alerts** - Real-time low stock and out-of-stock notifications for admins
- **Order tracking** - Users see order status changes immediately
- **Promotion broadcasts** - Push notifications to all users simultaneously

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Backend
npm install

# Frontend
cd Frontend
npm install
```

### 2. Run the Application

```bash
# Terminal 1 - Backend (with Socket.IO)
npm run dev

# Terminal 2 - Frontend
cd Frontend
npm run dev
```

### 3. Test Real-Time Features

1. Open two browser windows
2. Place an order in one window
3. See real-time notification appear in both windows
4. Admin dashboard shows live stock updates

---

## 📡 Real-Time Events

### For Users
- **Order confirmations** - Instant notification when order is placed
- **Order status updates** - Live tracking of processing → shipped → delivered
- **Promotions** - Flash sale and special offer notifications
- **Product updates** - See price/stock changes in real-time

### For Admins
- **New orders** - Immediate alert when customers place orders
- **Low stock warnings** - Get notified when products reach low stock threshold (≤10)
- **Out of stock alerts** - Critical alerts when products are depleted
- **System events** - Monitor all activity in real-time

---

## 💾 Transaction Examples

### Order Creation Flow
```
User places order
  ↓
Transaction starts
  ↓
✓ Validate stock availability
✓ Create order document
✓ Decrement product stock
✓ Create user notification
✓ Create admin notification
  ↓
Transaction commits
  ↓
Real-time events emitted
```

**What happens on error:**
- All changes rolled back
- Stock NOT decremented
- Order NOT created
- User sees clear error message

### Stock Update Flow
```
Admin updates product quantity
  ↓
Transaction starts (if quantity changed)
  ↓
✓ Update product quantity
✓ Check low stock threshold
✓ Create admin notifications if needed
  ↓
Transaction commits
  ↓
Real-time stock update broadcast
```

---

## 🎯 Key Features

### Transactions Ensure
- ✅ Orders never created with insufficient stock
- ✅ Stock counts always accurate
- ✅ Notifications match actual data
- ✅ No race conditions during concurrent updates

### Real-Time Provides
- ✅ Instant user feedback
- ✅ Live admin dashboard
- ✅ Better user experience
- ✅ Reduced page refreshes

---

## 📁 New Files

### Backend
```
Backend/
├── Config/
│   └── socket.js                    # Socket.IO configuration
├── services/
│   └── socket.service.js            # Real-time event helpers
├── Controller/
│   ├── order_controller.js          # ✨ Updated with transactions
│   ├── product_controller.js        # ✨ Updated with transactions
│   ├── notification_controller.js   # ✨ Updated with real-time
│   └── promotion_controller.js      # ✨ Updated with real-time
└── server.js                        # ✨ HTTP server + Socket.IO
```

### Frontend
```
Frontend/src/
├── contexts/
│   └── SocketContext.jsx            # Socket.IO React context
├── hooks/
│   └── useRealtimeEvents.js         # Real-time event hooks
└── App.jsx                          # ✨ Wrapped with SocketProvider
```

### Documentation
```
Documentation/
├── REALTIME_TRANSACTIONS_GUIDE.md   # Comprehensive guide
└── REALTIME_QUICK_REFERENCE.md      # Quick reference
```

---

## 🔧 How to Use

### Frontend - Listen for Real-Time Updates

```javascript
import { useRealtimeNotifications } from '../hooks/useRealtimeEvents';

function MyComponent() {
  useRealtimeNotifications((notification) => {
    // Auto-shows toast notification
    // Refresh your data here
    refetchNotifications();
  });
  
  return <div>Your component</div>;
}
```

### Backend - Emit Real-Time Events

```javascript
import socketService from '../services/socket.service.js';

export const myController = async (req, res) => {
  // Your business logic
  
  // Emit real-time event
  socketService.notifyUser(userId, notification);
  
  res.json({ success: true });
};
```

---

## 📊 Event Reference

| Event | When | Who Receives | Data |
|-------|------|--------------|------|
| `notification:new` | New notification | Specific user | Full notification |
| `order:created` | Order placed | User + Admins | Order summary |
| `order:status_changed` | Status updated | User + Admins | Order ID, status |
| `product:updated` | Product changed | All clients | Product info |
| `product:low_stock` | Stock ≤ 10 | Admins | Product info |
| `product:out_of_stock` | Stock = 0 | Admins | Product info |
| `promotion:created` | New promotion | All clients | Promotion details |

---

## 🧪 Testing

### Test Transactions
```bash
# Create order with insufficient stock - should fail gracefully
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"productId": "...", "quantity": 9999}],
    "shippingInfo": {...},
    "paymentInfo": {...},
    "totalAmount": 100
  }'
```

### Test Real-Time
1. Open browser console
2. Watch for Socket.IO connection: `✓ Socket.IO connected`
3. Place an order
4. See real-time notification appear
5. Check admin dashboard for live updates

---

## 🔒 Security

### Socket.IO
- JWT authentication on connection
- User-specific rooms (users can't see others' events)
- Admin room restricted to admin users
- CORS configured for your frontend URL

### Transactions
- Automatic rollback on errors
- Session cleanup guaranteed
- Stock validation before operations
- Proper error messages

---

## 📚 Documentation

- **Full Guide:** `Documentation/REALTIME_TRANSACTIONS_GUIDE.md`
- **Quick Reference:** `Documentation/REALTIME_QUICK_REFERENCE.md`
- **Socket.IO Docs:** https://socket.io/docs/
- **Mongoose Transactions:** https://mongoosejs.com/docs/transactions.html

---

## ⚙️ Configuration

### Environment Variables (Backend/.env)

```env
# Existing variables...

# Socket.IO
FRONTEND_URL=http://localhost:5173

# MongoDB (must support transactions - replica set required)
MONGO_URI=mongodb://localhost:27017/ecommerce?replicaSet=rs0
```

### MongoDB Replica Set Setup (for local development)

```bash
# Start MongoDB with replica set
mongod --replSet rs0

# Initialize replica set (first time only)
mongosh
> rs.initiate()
```

---

## 🎨 User Experience Improvements

### Before
- ❌ Users refresh to see order updates
- ❌ Admins miss critical stock alerts
- ❌ Race conditions in stock management
- ❌ Possible overselling during high traffic

### After
- ✅ Instant notifications appear
- ✅ Real-time admin alerts
- ✅ Guaranteed data consistency
- ✅ No overselling even with concurrent orders

---

## 📈 Performance

- **Transactions:** Only used for critical operations (orders, stock updates)
- **Socket.IO:** Efficient room-based targeting (no broadcast spam)
- **Reconnection:** Automatic with exponential backoff
- **Cleanup:** Proper session and connection management

---

## 🚨 Important Notes

1. **MongoDB Replica Set Required** for transactions to work
2. **Socket.IO auto-connects** when frontend loads
3. **JWT token** passed automatically from localStorage
4. **Real-time hooks** can be used in any component
5. **Transactions** auto-rollback on errors

---

## ✅ What to Test

- [ ] Place an order - see real-time notification
- [ ] Update order status - see live status change
- [ ] Update product stock to ≤10 - see admin alert
- [ ] Set stock to 0 - see out of stock alert
- [ ] Create promotion - all users notified
- [ ] Try ordering with insufficient stock - order fails, stock unchanged
- [ ] Multiple concurrent stock updates - no race conditions

---

## 🎉 Ready to Use!

Your application now has enterprise-grade real-time features and data consistency. Start the servers and experience the difference!

```bash
# Start everything
npm run dev
cd Frontend && npm run dev
```

Open http://localhost:5173 and enjoy real-time updates! 🚀
