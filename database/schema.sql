-- Handcraft E-commerce Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles Table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'artisan', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Artisans/Shops Table
CREATE TABLE IF NOT EXISTS artisans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  shop_name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  cover_url TEXT,
  address TEXT,
  phone TEXT,
  specialty TEXT[], -- Array of specialties like ['pottery', 'textiles', 'woodwork']
  rating DECIMAL(3,2) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products Table (Handcraft Items)
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  artisan_id UUID REFERENCES artisans(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  category TEXT NOT NULL,
  subcategory TEXT,
  materials TEXT[], -- Materials used like ['clay', 'wood', 'cotton']
  dimensions JSONB, -- {length: 10, width: 5, height: 3, unit: 'cm'}
  weight DECIMAL(8,2), -- Weight in grams
  colors TEXT[], -- Available colors
  images TEXT[] DEFAULT '{}',
  is_available BOOLEAN DEFAULT true,
  is_customizable BOOLEAN DEFAULT false,
  production_time INTEGER, -- Days to make
  stock_quantity INTEGER DEFAULT 1,
  rating DECIMAL(3,2) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  artisan_id UUID REFERENCES artisans(id) ON DELETE CASCADE NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'crafting', 'ready', 'shipped', 'delivered', 'cancelled')),
  shipping_address JSONB NOT NULL, -- {street, city, state, postal_code, country}
  phone TEXT NOT NULL,
  notes TEXT,
  estimated_delivery DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_artisans_owner ON artisans(owner_id);
CREATE INDEX IF NOT EXISTS idx_artisans_active ON artisans(is_active);
CREATE INDEX IF NOT EXISTS idx_products_artisan ON products(artisan_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON products(subcategory);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(is_available);
CREATE INDEX IF NOT EXISTS idx_products_materials ON products USING GIN(materials);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_artisan ON orders(artisan_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- RLS (Row Level Security) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE artisans ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Artisans Policies
CREATE POLICY "Anyone can view active artisans" ON artisans
  FOR SELECT USING (is_active = true);

CREATE POLICY "Artisans can manage their own shops" ON artisans
  FOR ALL USING (auth.uid() = owner_id);

-- Products Policies
CREATE POLICY "Anyone can view available products" ON products
  FOR SELECT USING (is_available = true);

CREATE POLICY "Artisans can manage their products" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM artisans 
      WHERE artisans.id = products.artisan_id 
      AND artisans.owner_id = auth.uid()
    )
  );

-- Orders Policies
CREATE POLICY "Customers can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Artisans can view orders for their products" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM artisans 
      WHERE artisans.id = orders.artisan_id 
      AND artisans.owner_id = auth.uid()
    )
  );

CREATE POLICY "Customers can create orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Artisans can update order status" ON orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM artisans 
      WHERE artisans.id = orders.artisan_id 
      AND artisans.owner_id = auth.uid()
    )
  );

-- Functions for automatic timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_artisans_updated_at BEFORE UPDATE ON artisans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample categories for handcraft items
INSERT INTO categories (name, icon) VALUES 
  ('Pottery', '�'),
  ('Textiles', '🧵'),
  ('Woodwork', '�'),
  ('Jewelry', '💎'),
  ('Paintings', '�'),
  ('Basketry', '�'),
  ('Metalwork', '⚒️'),
  ('Glass Art', '�'),
  ('Leatherwork', '👜'),
  ('Paper Crafts', '📜')
ON CONFLICT (name) DO NOTHING;

-- Function to create profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
