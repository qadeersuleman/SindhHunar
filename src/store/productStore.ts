import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product } from '../types/product.types';
import { useAppSelector, useAppDispatch } from './hooks';
import { setCategory, setSearch, setPriceRange, setSortBy, resetFilters } from './slices/filterSlice';

// Server State: Fetching products
const fetchProducts = async (filters: any = {}): Promise<Product[]> => {
  // Logic to fetch from API/Supabase using filters
  return [];
};

const fetchFeaturedProducts = async (): Promise<Product[]> => {
  return [];
};

const fetchProductById = async (id: string): Promise<Product | null> => {
  return null;
};

// Hook for products that automatically uses Redux filters
export const useFilteredProducts = () => {
  const filters = useAppSelector((state) => state.filters);
  
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
    staleTime: 1000 * 60 * 5,
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: fetchFeaturedProducts,
    staleTime: 1000 * 60 * 10,
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
  });
};

// Server State: Mutations
export const useProductMutations = () => {
  const queryClient = useQueryClient();

  const addProductMutation = useMutation({
    mutationFn: async (product: Omit<Product, 'id'>) => {
      // API Call
      return { ...product, id: 'new-id' } as Product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  return {
    addProduct: addProductMutation.mutate,
    isLoading: addProductMutation.isPending,
  };
};

// Client State: Filter Actions (using Redux)
export const useProductFilters = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filters);

  return {
    filters,
    setCategory: (cat: string | null) => dispatch(setCategory(cat)),
    setSearch: (search: string) => dispatch(setSearch(search)),
    setPriceRange: (range: [number, number]) => dispatch(setPriceRange(range)),
    setSortBy: (sort: string) => dispatch(setSortBy(sort)),
    clearFilters: () => dispatch(resetFilters()),
  };
};

