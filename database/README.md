# Burger3000 Supabase Integration Guide

## 🚀 Step-by-Step Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### 2. Set Up Database Schema
1. Open your Supabase project
2. Go to SQL Editor
3. Copy and run the entire `schema.sql` file
4. This will create all tables, indexes, RLS policies, and triggers

### 3. Configure Environment Variables
1. Copy `env.example` to `.env` (in your project root)
2. Update with your Supabase credentials:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 4. Set Up Storage Buckets
1. In Supabase, go to Storage
2. Create these buckets:
   - `avatars` (for user profile pictures)
   - `products` (for product images)
   - `stores` (for store logos and covers)
3. Set up appropriate RLS policies for each bucket

### 5. Test the Integration
Run the test script to verify everything works:
```bash
npm run test:supabase
```

## 📊 Database Structure

### Tables Created:
- **profiles** - User profiles and roles
- **stores** - Store/restaurant information
- **products** - Menu items/products
- **orders** - Customer orders
- **categories** - Product categories

### Real-time Features:
- Live product updates
- Order status changes
- Store information updates
- New order notifications

## 🔧 Available Services

### Authentication (`src/services/supabase/auth.ts`)
- User signup/login
- Profile management
- Avatar upload
- Session management

### Products (`src/services/supabase/products.ts`)
- CRUD operations
- Search and filtering
- Category management
- Image uploads
- Real-time subscriptions

### Stores (`src/services/supabase/stores.ts`)
- Store management
- Logo/cover uploads
- Store search
- Real-time updates

### Orders (`src/services/supabase/orders.ts`)
- Order management
- Status tracking
- Customer/store views
- Real-time notifications

## 🛠 Usage Examples

### Authentication
```typescript
import { signIn, signUp } from '../services/supabase/auth';

// Login
const { user, error } = await signIn('user@example.com', 'password');

// Register
const { user, error } = await signUp('user@example.com', 'password', 'John Doe');
```

### Products
```typescript
import { getProducts, createProduct } from '../services/supabase/products';

// Get all products
const { products, error } = await getProducts({ available: true });

// Create new product
const { product, error } = await createProduct({
  name: 'Classic Burger',
  price: 9.99,
  category: 'Burgers',
  store_id: 'store-uuid',
  description: 'Delicious classic burger'
});
```

### Real-time Updates
```typescript
import { subscribeToProducts } from '../services/supabase/products';

const subscription = subscribeToProducts((payload) => {
  console.log('Product updated:', payload);
}, { storeId: 'your-store-id' });

// Cleanup
subscription.unsubscribe();
```

## 🔒 Security Features

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Store owners can only manage their stores/products
- Secure file uploads with signed URLs

## 📱 React Native Integration

The services are optimized for React Native:
- AsyncStorage for session persistence
- Blob handling for image uploads
- Real-time subscriptions
- Offline support with sync

## 🚨 Important Notes

1. **Environment Variables**: Never commit your `.env` file
2. **RLS Policies**: Review and adjust policies based on your needs
3. **Storage**: Set up proper bucket permissions
4. **API Keys**: Keep your anon key secure
5. **Testing**: Always test in development first

## 🔄 Migration from Dummy Data

To replace dummy data with real Supabase data:

1. Update your components to use the new services
2. Replace static data with API calls
3. Add loading states and error handling
4. Implement real-time updates where needed
5. Test thoroughly

## 📞 Support

If you encounter issues:
1. Check Supabase logs
2. Verify RLS policies
3. Test API calls in Supabase dashboard
4. Check network connectivity
5. Review environment variables
