import React, { memo } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { fonts } from '../../../utils/fonts';
import { RESPONSIVE } from '../../../utils/responsive';
import LottieAnimation from '../../../components/LottieAnimation';
import craftLoaderAnimation from '../../../assets/animations/craft-loader.json';

const CARD_WIDTH = RESPONSIVE.GET_WIDTH(43);

const COLORS = {
  primary: '#800000',
  secondary: '#C5A059',
  white: '#FFFFFF',
  dark: '#1A1A1A',
  gray: '#757575',
  lightGray: '#F0F0F0',
};

interface ProductCardProps {
  item: any;
  t: any;
  isRTL: boolean;
  onPress?: () => void;
  loading?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ item, t, isRTL, onPress, loading }) => {
  return (
    <TouchableOpacity 
      className="bg-white rounded-[25px] mb-4 shadow-sm overflow-hidden"
      style={{ width: CARD_WIDTH }}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <View className="w-full h-[150px] relative">
        {loading ? (
          <View className="w-full h-full justify-center items-center bg-gray-100">
            <LottieAnimation
              source={craftLoaderAnimation}
              size={60}
              autoPlay={true}
              loop={true}
            />
          </View>
        ) : (
          <>
            <Image 
              source={typeof item.image === 'string' ? { uri: item.image } : item.image} 
              className="w-full h-full"
              resizeMode="cover"
            />
            <View className="absolute top-2.5 left-2.5 bg-white/90 flex-row items-center px-2 py-1 rounded-[10px]">
              <Icon name="star" size={RESPONSIVE.GET_FONT_SIZE(10)} color="#C5A059" />
              <Text className="ml-1 text-[10px] font-bold text-[#1A1A1A]" style={{ fontFamily: fonts.poppins.bold }}>
                {item.rating}
              </Text>
            </View>
            <TouchableOpacity className="absolute top-2.5 right-2.5 bg-white/90 w-8 h-8 rounded-full justify-center items-center">
              <Icon name="heart-outline" size={RESPONSIVE.GET_FONT_SIZE(18)} color="#800000" />
            </TouchableOpacity>
          </>
        )}
      </View>
      
      <View className={`p-3 w-full ${isRTL ? 'items-end' : 'items-start'}`}>
        <Text className="text-[10px] text-[#757575] font-medium uppercase tracking-[0.5px]" style={{ fontFamily: fonts.poppins.medium }}>
          {item.category}
        </Text>
        <Text 
          className={`text-[13px] text-[#1A1A1A] mt-0.5 h-5 ${isRTL ? 'text-right' : 'text-left'}`} 
          numberOfLines={1}
          style={{ fontFamily: fonts.poppins.bold }}
        >
          {t(item.nameKey)}
        </Text>
        <Text 
          className={`text-[10px] text-[#757575] mt-0.5 ${isRTL ? 'text-right' : 'text-left'}`}
          style={{ fontFamily: fonts.poppins.regular }}
        >
          {t('common.by')} {t(item.artisanKey)}
        </Text>
        
        <View className="flex-row justify-between items-center mt-2 w-full">
          <Text className="text-[18px] text-[#800000]" style={{ fontFamily: fonts.bebasNeue.bold }}>
            Rs. {item.price}
          </Text>
          <TouchableOpacity className="bg-[#800000] w-8 h-8 rounded-xl justify-center items-center">
            <Icon name="add" size={RESPONSIVE.GET_FONT_SIZE(20)} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // NativeWind handles the styles
});

export default memo(ProductCard);
