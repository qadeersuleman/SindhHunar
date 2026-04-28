import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product } from '../types/product.types';

interface CartItem {
  product: Product;
  quantity: number;
}

const CART_QUERY_KEY = ['cart'];

const getCartFromStorage = (): CartItem[] => {
  try {
    const stored = localStorage.getItem('cart-storage');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.state?.items || [];
    }
  } catch (error) {
    console.error('Error loading cart from storage:', error);
  }
  return [];
};

const saveCartToStorage = (items: CartItem[]) => {
  try {
    localStorage.setItem('cart-storage', JSON.stringify({
      state: { items },
      version: 0
    }));
  } catch (error) {
    console.error('Error saving cart to storage:', error);
  }
};

export const useCart = () => {
  const queryClient = useQueryClient();

  const {
    data: items = [],
    isLoading: loading,
  } = useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: () => getCartFromStorage(),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({ product, quantity = 1 }: { product: Product; quantity?: number }) => {
      const currentItems = queryClient.getQueryData(CART_QUERY_KEY) as CartItem[] || [];
      const existingItem = currentItems.find(item => item.product.id === product.id);
      
      let updatedItems: CartItem[];
      if (existingItem) {
        updatedItems = currentItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedItems = [...currentItems, { product, quantity }];
      }
      
      saveCartToStorage(updatedItems);
      return updatedItems;
    },
    onSuccess: (updatedItems) => {
      queryClient.setQueryData(CART_QUERY_KEY, updatedItems);
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (productId: string) => {
      const currentItems = queryClient.getQueryData(CART_QUERY_KEY) as CartItem[] || [];
      const updatedItems = currentItems.filter(item => item.product.id !== productId);
      saveCartToStorage(updatedItems);
      return updatedItems;
    },
    onSuccess: (updatedItems) => {
      queryClient.setQueryData(CART_QUERY_KEY, updatedItems);
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      if (quantity <= 0) {
        const currentItems = queryClient.getQueryData(CART_QUERY_KEY) as CartItem[] || [];
        const updatedItems = currentItems.filter(item => item.product.id !== productId);
        saveCartToStorage(updatedItems);
        return updatedItems;
      }

      const currentItems = queryClient.getQueryData(CART_QUERY_KEY) as CartItem[] || [];
      const updatedItems = currentItems.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      );
      saveCartToStorage(updatedItems);
      return updatedItems;
    },
    onSuccess: (updatedItems) => {
      queryClient.setQueryData(CART_QUERY_KEY, updatedItems);
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      saveCartToStorage([]);
      return [];
    },
    onSuccess: () => {
      queryClient.setQueryData(CART_QUERY_KEY, []);
    },
  });

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  return {
    items,
    totalItems: getTotalItems(),
    totalPrice: getTotalPrice(),
    loading,
    addToCart: addToCartMutation.mutate,
    removeFromCart: removeFromCartMutation.mutate,
    updateQuantity: updateQuantityMutation.mutate,
    clearCart: clearCartMutation.mutate,
    getTotalItems,
    getTotalPrice,
  };
};
