import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Array<{
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    artisan?: string;
    inStock?: boolean;
  }>;
  onProductPress?: (product: any) => void;
  loading?: boolean;
  numColumns?: number;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onProductPress,
  loading = false,
  numColumns = 2,
}) => {
  const renderProduct = ({ item }: { item: any }) => (
    <ProductCard product={item} onPress={onProductPress} />
  );

  if (loading) {
    return <View style={styles.loadingContainer} />;
  }

  return (
    <FlatList
      data={products}
      renderItem={renderProduct}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProductGrid;
