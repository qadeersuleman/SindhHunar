import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/layout/Header';
import { fonts } from '../../utils/fonts';

interface AddProductScreenProps {
  onAddProduct?: (productData: {
    name: string;
    price: string;
    category: string;
    description: string;
    inStock: boolean;
  }) => void;
  onBackPress?: () => void;
}

import { TextInput as PaperInput, Button as PaperButton, Chip, Switch } from 'react-native-paper';

const AddProductScreen: React.FC<AddProductScreenProps> = ({
  onAddProduct,
  onBackPress,
}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [inStock, setInStock] = useState(true);
  const [loading, setLoading] = useState(false);

  const categories = [
    'Textiles',
    'Pottery',
    'Jewelry',
    'Woodwork',
    'Metalwork',
    'Paintings',
    'Other',
  ];

  const handleAddProduct = async () => {
    if (!name || !price || !category) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }

    setLoading(true);
    try {
      await onAddProduct?.({
        name,
        price,
        category,
        description,
        inStock,
      });
      Alert.alert('Success', 'Product added successfully!');
      setName('');
      setPrice('');
      setCategory('');
      setDescription('');
      setInStock(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header
        title="Add New Product"
        showBack={true}
        onBackPress={onBackPress}
      />
      
      <ScrollView className="flex-1 px-4 py-6">
        <View className="gap-6 mb-10">
          <PaperInput
            label="Product Name"
            value={name}
            onChangeText={setName}
            mode="outlined"
            placeholder="Enter product name"
            outlineColor="#E0E0E0"
            activeOutlineColor="#800000"
            className="bg-white"
          />
          
          <PaperInput
            label="Price"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            mode="outlined"
            placeholder="0.00"
            left={<PaperInput.Affix text="$" />}
            outlineColor="#E0E0E0"
            activeOutlineColor="#800000"
            className="bg-white"
          />
          
          <View>
            <Text className="text-[16px] text-gray-700 mb-3" style={{ fontFamily: fonts.poppins.medium }}>Category</Text>
            <View className="flex-row flex-wrap gap-2">
              {categories.map((cat) => (
                <Chip
                  key={cat}
                  selected={category === cat}
                  onPress={() => setCategory(cat)}
                  selectedColor="white"
                  style={{ 
                    backgroundColor: category === cat ? '#800000' : '#F5F5F5',
                    borderRadius: 20
                  }}
                  textStyle={{ 
                    fontFamily: fonts.poppins.medium,
                    color: category === cat ? 'white' : '#666'
                  }}
                >
                  {cat}
                </Chip>
              ))}
            </View>
          </View>
          
          <PaperInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            placeholder="Describe your product..."
            multiline
            numberOfLines={4}
            outlineColor="#E0E0E0"
            activeOutlineColor="#800000"
            className="bg-white"
          />
          
          <View className="flex-row items-center justify-between bg-gray-50 p-4 rounded-2xl">
            <View>
              <Text className="text-[16px] text-gray-800" style={{ fontFamily: fonts.poppins.bold }}>Availability</Text>
              <Text className="text-[12px] text-gray-500" style={{ fontFamily: fonts.poppins.regular }}>{inStock ? 'In Stock' : 'Out of Stock'}</Text>
            </View>
            <Switch
              value={inStock}
              onValueChange={setInStock}
              color="#800000"
            />
          </View>
          
          <PaperButton
            mode="contained"
            onPress={handleAddProduct}
            loading={loading}
            className="rounded-2xl py-2 mt-4"
            buttonColor="#800000"
            labelStyle={{ fontFamily: fonts.poppins.bold, fontSize: 18 }}
          >
            Add Product
          </PaperButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // NativeWind handles the styles
});

export default AddProductScreen;
