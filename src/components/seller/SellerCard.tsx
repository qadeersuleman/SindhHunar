import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

interface SellerCardProps {
  seller: {
    id: string;
    name: string;
    avatar: string;
    location: string;
    specialty: string;
    rating?: number;
    productsCount?: number;
  };
  onPress?: (seller: any) => void;
}

const SellerCard: React.FC<SellerCardProps> = ({
  seller,
  onPress,
}) => {
  return (
    <Card onPress={() => onPress?.(seller)}>
      <View style={styles.container}>
        <Image source={{ uri: seller.avatar }} style={styles.avatar} />
        <View style={styles.info}>
          <Text style={styles.name}>{seller.name}</Text>
          <Text style={styles.location}>{seller.location}</Text>
          <View style={styles.specialtyContainer}>
            <Badge text={seller.specialty} variant="primary" size="small" />
          </View>
          <View style={styles.stats}>
            {seller.rating && (
              <Text style={styles.rating}>⭐ {seller.rating.toFixed(1)}</Text>
            )}
            {seller.productsCount && (
              <Text style={styles.productsCount}>{seller.productsCount} products</Text>
            )}
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  specialtyContainer: {
    marginBottom: 8,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '500',
    color: '#C41E3A',
  },
  productsCount: {
    fontSize: 14,
    color: '#666',
  },
});

export default SellerCard;
