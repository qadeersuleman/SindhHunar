import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';
import Animated, { 
  FadeInRight, 
  FadeInDown, 
  Layout, 
  FadeOutLeft 
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { fonts } from '../../utils/fonts';
import { hapticFeedback } from '../../utils/haptics';
import LottieAnimation from '../../components/LottieAnimation';
import EmptyCartAnimation from '../../assets/animations/EmptyCart.json';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#800000',
  secondary: '#C5A059',
  white: '#FFFFFF',
  cream: '#FAF9F6',
  dark: '#1A1A1A',
  gray: '#757575',
  lightGray: '#F0F0F0',
};

const MOCK_CART_ITEMS = [
  {
    id: '1',
    name: 'Special Ghotki Peda (1kg)',
    price: 1200,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1589113103503-49673c683669?q=80&w=400&auto=format',
    artisan: 'Haji Adam Sweets',
  },
  {
    id: '2',
    name: 'Mirror Work Sindhi Topi',
    price: 850,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=400&auto=format',
    artisan: 'Local Craftsmen',
  },
];

import { Badge, IconButton, Button as PaperButton, Divider } from 'react-native-paper';

const JholiScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'sd';
  const [cartItems, setCartItems] = useState(MOCK_CART_ITEMS);

  const updateQuantity = (id: string, delta: number) => {
    hapticFeedback.light(); // Subtle feedback on tap
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeItem = (id: string) => {
    hapticFeedback.medium(); // Slightly stronger feedback for delete
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const renderItem = ({ item, index }: { item: typeof MOCK_CART_ITEMS[0]; index: number }) => (
    <Animated.View 
      entering={FadeInRight.delay(index * 100).springify()}
      exiting={FadeOutLeft}
      layout={Layout.springify()}
      className={`bg-white rounded-3xl p-4 mb-4 flex-row items-center shadow-sm elevation-2 ${isRTL ? 'flex-row-reverse' : ''}`}
    >
      <View className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100">
        <Image source={{ uri: item.image }} className="w-full h-full" resizeMode="cover" />
      </View>
      
      <View className={`flex-1 mx-4 ${isRTL ? 'items-end' : 'items-start'}`}>
        <Text className="text-[14px] text-[#1A1A1A]" style={{ fontFamily: fonts.poppins.bold }} numberOfLines={1}>{item.name}</Text>
        <Text className="text-[11px] text-[#757575]" style={{ fontFamily: fonts.poppins.regular }}>{t('common.by')} {item.artisan}</Text>
        <Text className="text-[16px] text-[#C5A059] mb-2" style={{ fontFamily: fonts.poppins.bold }}>{t('jholi.currency')} {item.price}</Text>
        
        <View className="flex-row items-center bg-gray-100 rounded-xl p-1">
          <TouchableOpacity 
            onPress={() => updateQuantity(item.id, -1)}
            className="w-7 h-7 bg-white rounded-lg justify-center items-center shadow-sm"
          >
            <Icon name="remove" size={14} color={COLORS.primary} />
          </TouchableOpacity>
          <Text className="text-[14px] text-[#1A1A1A] mx-3" style={{ fontFamily: fonts.poppins.bold }}>{item.quantity}</Text>
          <TouchableOpacity 
            onPress={() => updateQuantity(item.id, 1)}
            className="w-7 h-7 bg-white rounded-lg justify-center items-center shadow-sm"
          >
            <Icon name="add" size={14} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>
      
      <IconButton 
        icon="trash-can-outline" 
        iconColor={COLORS.gray} 
        size={20} 
        onPress={() => removeItem(item.id)} 
      />
    </Animated.View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#FAF9F6]" edges={['top']}>
      {/* Header */}
      <View className={`px-6 pt-5 mb-5 flex-row justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Text className="text-[32px] text-[#800000] tracking-widest uppercase" style={{ fontFamily: fonts.bebasNeue.bold }}>
          {t('jholi.title')}
        </Text>
        <Badge className="bg-[#800000]/10 text-[#800000] px-3 py-1 rounded-full text-[12px]" size={24} style={{ fontFamily: fonts.poppins.bold }}>
          {`${cartItems.length} ${t('jholi.items')}`}
        </Badge>
      </View>

      {cartItems.length > 0 ? (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 250 }}
            showsVerticalScrollIndicator={false}
          />

          {/* Checkout Section */}
          <Animated.View 
            entering={FadeInDown.delay(400).springify()}
            className="absolute bottom-0 w-full bg-white rounded-t-[35px] p-8 shadow-lg elevation-20"
          >
            <View className={`flex-row justify-between mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Text className="text-[14px] text-[#757575]" style={{ fontFamily: fonts.poppins.regular }}>{t('jholi.subtotal')}</Text>
              <Text className="text-[14px] text-[#1A1A1A]" style={{ fontFamily: fonts.poppins.bold }}>{t('jholi.currency')} {calculateTotal()}</Text>
            </View>
            <View className={`flex-row justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Text className="text-[14px] text-[#757575]" style={{ fontFamily: fonts.poppins.regular }}>{t('jholi.delivery')}</Text>
              <Text className="text-[14px] text-[#1A1A1A]" style={{ fontFamily: fonts.poppins.bold }}>{t('jholi.currency')} 150</Text>
            </View>
            
            <Divider className="mb-4 bg-gray-100" />
            
            <View className={`flex-row justify-between items-center mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Text className="text-[18px] text-[#1A1A1A]" style={{ fontFamily: fonts.poppins.bold }}>{t('jholi.totalJholi')}</Text>
              <Text className="text-[22px] text-[#800000]" style={{ fontFamily: fonts.poppins.bold }}>{t('jholi.currency')} {calculateTotal() + 150}</Text>
            </View>

            <TouchableOpacity activeOpacity={0.9} className="rounded-2xl overflow-hidden">
              <LinearGradient
                colors={[COLORS.primary, '#4A0000']}
                className={`py-4 flex-row justify-center items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text className="text-white text-[16px] tracking-wider" style={{ fontFamily: fonts.poppins.bold }}>{t('jholi.checkout')}</Text>
                <Icon name={isRTL ? "arrow-back" : "arrow-forward"} size={20} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </>
      ) : (
        <View className="flex-1 justify-center items-center px-8">
          <LottieAnimation
            source={EmptyCartAnimation}
            size={280}
            autoPlay={true}
            loop={true}
          />
          <Text className="text-[32px] text-[#800000] mt-[-30px] text-center uppercase" style={{ fontFamily: fonts.bebasNeue.bold }}>
            {t('jholi.emptyTitle') || 'KHALI JHOLI!'}
          </Text>
          <Text className="text-[14px] text-[#757575] text-center mt-2 mb-8" style={{ fontFamily: fonts.poppins.regular }}>
            {t('jholi.emptySubtitle') || 'Add some authentic Sindhi crafts to start your collection!'}
          </Text>
          <PaperButton 
            mode="contained" 
            onPress={() => {}} 
            buttonColor={COLORS.secondary}
            className="rounded-xl px-4"
            labelStyle={{ fontFamily: fonts.poppins.bold, fontSize: 14 }}
          >
            {t('jholi.exploreBazaar')}
          </PaperButton>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // NativeWind handles the styles
});

export default JholiScreen;
