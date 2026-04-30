import { supabase } from './client';
import type { CartItem } from '../../store/slices/cartSlice';


export interface OrderData {
  customer_id: string;
  artisan_id: string;
  items: CartItem[];
  total_amount: number;
  shipping_address: any;
  phone: string;
  notes?: string;
}

/**
 * Create a new order in Supabase
 */
export const createOrder = async (orderData: OrderData) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          customer_id: orderData.customer_id,
          artisan_id: orderData.artisan_id,
          items: orderData.items,
          total_amount: orderData.total_amount,
          shipping_address: orderData.shipping_address,
          phone: orderData.phone,
          notes: orderData.notes,
          status: 'pending'
        }
      ])
      .select();

    if (error) throw error;
    return { order: data[0], error: null };
  } catch (error) {
    return { order: null, error: error as Error };
  }
};

/**
 * Get orders for the current user
 */
export const getMyOrders = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        artisans (
          shop_name,
          logo_url
        )
      `)
      .eq('customer_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { orders: data || [], error: null };
  } catch (error) {
    return { orders: [], error: error as Error };
  }
};

/**
 * Update order status (for artisans)
 */
export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date() })
      .eq('id', orderId)
      .select();

    if (error) throw error;
    return { order: data[0], error: null };
  } catch (error) {
    return { order: null, error: error as Error };
  }
};
