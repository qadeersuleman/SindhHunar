import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    artisan?: string;
    inStock?: boolean;
  };
  onPress?: (product: any) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
}) => {
  return (
    <Card onPress={() => onPress?.(product)}>
      <View style={styles.container}>
        <Image source={{ uri: product.image }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>
            {product.name}
          </Text>
          {product.artisan && (
            <Text style={styles.artisan}>by {product.artisan}</Text>
          )}
          <View style={styles.footer}>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            <Badge text={product.category} variant="secondary" size="small" />
          </View>
          {product.inStock === false && (
            <Badge text="Out of Stock" variant="error" size="small" />
          )}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  artisan: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#C41E3A',
  },
});

export default ProductCard;
