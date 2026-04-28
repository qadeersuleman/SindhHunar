import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product } from '../types/product.types';

interface ProductFilters {
  category?: string;
  priceRange?: [number, number];
  search?: string;
}

// Mock API functions - replace with actual API calls
const fetchProducts = async (filters: ProductFilters = {}): Promise<Product[]> => {
  // This would be an actual API call
  // For now, return empty array
  return [];
};

const fetchFeaturedProducts = async (): Promise<Product[]> => {
  // This would be an actual API call
  return [];
};

const fetchProductById = async (id: string): Promise<Product | null> => {
  // This would be an actual API call
  return null;
};

const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  // This would be an actual API call
  const newProduct = { ...product, id: Date.now().toString() };
  return newProduct;
};

const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
  // This would be an actual API call
  const updatedProduct = { ...updates, id } as Product;
  return updatedProduct;
};

const deleteProduct = async (id: string): Promise<void> => {
  // This would be an actual API call
  return;
};

export const useProducts = (filters: ProductFilters = {}) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: fetchFeaturedProducts,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useProductMutations = () => {
  const queryClient = useQueryClient();

  const addProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: (newProduct) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.setQueryData(['product', newProduct.id], newProduct);
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Product> }) =>
      updateProduct(id, updates),
    onSuccess: (updatedProduct) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.setQueryData(['product', updatedProduct.id], updatedProduct);
    },
  });

  const removeProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.removeQueries({ queryKey: ['product', id] });
    },
  });

  return {
    addProduct: addProductMutation.mutate,
    updateProduct: updateProductMutation.mutate,
    removeProduct: removeProductMutation.mutate,
    isLoading: addProductMutation.isPending || 
               updateProductMutation.isPending || 
               removeProductMutation.isPending,
  };
};

export const useProductFilters = () => {
  const queryClient = useQueryClient();

  const setFilters = (filters: Partial<ProductFilters>) => {
    queryClient.setQueryData(['products', 'filters'], (current: ProductFilters) => ({
      ...current,
      ...filters,
    }));
  };

  const clearFilters = () => {
    queryClient.setQueryData(['products', 'filters'], {});
  };

  const filters = queryClient.getQueryData(['products', 'filters']) as ProductFilters || {};

  return {
    filters,
    setFilters,
    clearFilters,
  };
};
