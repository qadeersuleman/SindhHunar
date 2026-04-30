import React, { useState, useEffect, useRef, memo, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Animated as RNAnimated,
  StatusBar,
  I18nManager,
  Platform,
  ActivityIndicator,
} from 'react-native';
import notifee, { AndroidImportance } from '@notifee/react-native';
import Carousel from 'react-native-reanimated-carousel';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {
  FadeInDown,
  FadeInRight,
  Layout,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import LottieAnimation from '../../components/LottieAnimation';
import { fonts, typography } from '../../utils/fonts';
import { images } from '../../utils/images';
import { useTranslation } from 'react-i18next';
import { RESPONSIVE } from '../../utils/responsive';
import shoppingcartAnimation from '../../assets/animations/shoppingcart.json';

// Components
import HomeHeader from './components/HomeHeader';
import CategoryList from './components/CategoryList';
import ProductCard from './components/ProductCard';
import SearchOverlay from './components/SearchOverlay';
import { useToast } from '../../context/ToastContext';


const { width } = Dimensions.get('window');

// Authentic Sindhi Color Palette
const COLORS = {
  primary: '#800000', // Deep Maroon (Madder Red / Ajrak Red)
  secondary: '#C5A059', // Antique Gold
  accent: '#002366', // Royal Indigo Blue
  dark: '#1A1A1A',
  lightDark: '#2D2D2D',
  white: '#FFFFFF',
  cream: '#FAF9F6',
  gray: '#757575',
  lightGray: '#F0F0F0',
  success: '#2E7D32',
};

const CATEGORIES = [
  { id: '1', name: 'Peda', icon: 'fast-food-outline' },
  { id: '2', name: 'Ralli', icon: 'grid-outline' },
  { id: '3', name: 'Ajrak', icon: 'shirt-outline' },
  { id: '4', name: 'Topi', icon: 'ribbon-outline' },
  { id: '5', name: 'Pottery', icon: 'wine-outline' },
  { id: '6', name: 'Dates', icon: 'leaf-outline' },
];

const OFFERS = [
  {
    id: '1',
    titleKey: 'products.peda_title',
    subtitleKey: 'products.peda_sub',
    image: images.peda,
    color: ['#800000', '#4A0000'],
  },
  {
    id: '2',
    titleKey: 'products.ralli_title',
    subtitleKey: 'products.ralli_sub',
    image: images.rili,
    color: ['#002366', '#001233'],
  },
  {
    id: '3',
    titleKey: 'products.item3_name',
    subtitleKey: 'home.topi',
    image: images.topi,
    color: ['#C5A059', '#8B6B23'],
  },
  {
    id: '4',
    titleKey: 'products.item4_name',
    subtitleKey: 'home.ajrak',
    image: images.ajrakBg,
    color: ['#800000', '#2D2D2D'],
  },
];

const RECENT_SEARCHES = ['Ajrak Shawl', 'Ralli Quilt', 'Silver Jhumka', 'Handmade Pot'];
const TRENDING_KEYWORDS = ['Embroidery', 'Textiles', 'Pottery', 'Artisan', 'Jewelry'];

import { useSindhiProducts, useSindhiArtisans } from '../../hooks/useSindhiCrafts';
import { subscribeToSindhiProducts } from '../../services/supabase/sindhi-crafts';
import { useQueryClient } from '@tanstack/react-query';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUPABASE_URL } from '../../config/env';

const HomeScreen: React.FC<any> = ({ navigation }) => {
  useEffect(() => {
    console.log('Supabase Config Check - URL:', SUPABASE_URL);
  }, []);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'sd';
  const [selectedCategory, setSelectedCategory] = useState('1');
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState('');
  const { showToast } = useToast();
  const scrollY = useSharedValue(0);

  const searchAnim = useSharedValue(0);


  // Fetch real-time products from Supabase via React Query
  const { data: products, isLoading: productsLoading, error: productsError } = useSindhiProducts({});

  useEffect(() => {
    console.log('HomeScreen Products Update:', { 
      count: products?.length, 
      isLoading: productsLoading,
      error: productsError,
      data: products
    });
  }, [products, productsLoading, productsError]);

  const handleProductPress = useCallback((item: any) => {
    navigation.navigate('ProductDetail', { item });
  }, [navigation]);

  // Use QueryClient to invalidate and refetch on real-time updates
  const queryClient = useQueryClient();

  useEffect(() => {
    // Subscribe to real-time changes
    const subscription = subscribeToSindhiProducts(() => {
      queryClient.invalidateQueries({ queryKey: ['sindhi-products'] });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  useEffect(() => {
    const checkWelcome = async () => {
      try {
        const hasShown = await AsyncStorage.getItem('has_shown_welcome_toast');
        if (!hasShown) {
          setTimeout(() => {
            showToast({
              message: t('common.welcomeBazaar', { defaultValue: 'Khush Amdeed to Bazaar!' }),
              type: 'success'
            });
          }, 1500);
          await AsyncStorage.setItem('has_shown_welcome_toast', 'true');
        }
      } catch (e) {
        console.error('AsyncStorage error:', e);
      }
    };
    checkWelcome();
  }, []);

  const toggleLanguage = async () => {
    const newLang = i18n.language === 'en' ? 'sd' : 'en';
    await i18n.changeLanguage(newLang);
    
    try {
      await notifee.requestPermission();
      const channelId = await notifee.createChannel({
        id: 'language_alerts',
        name: 'Language Alerts',
        importance: AndroidImportance.HIGH,
        sound: 'default',
      });

      await notifee.displayNotification({
        title: newLang === 'sd' ? 'ٻولي تبديل ٿي وئي' : 'Language Changed',
        body: newLang === 'sd' 
          ? 'توهان جي ايپ هاڻي سنڌي ٻولي ۾ آهي.' 
          : 'Your app is now in English.',
        android: {
          channelId,
          smallIcon: 'ic_launcher',
          color: COLORS.primary,
          pressAction: { id: 'default' },
        },
      });
    } catch (error) {
      console.log('Notification error:', error);
    }
  };

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const toggleSearch = (visible: boolean) => {
    setShowSearch(visible);
    searchAnim.value = withTiming(visible ? 1 : 0, { duration: 300 });
  };

  const searchOverlayStyle = useAnimatedStyle(() => ({
    opacity: searchAnim.value,
    transform: [{ translateY: interpolate(searchAnim.value, [0, 1], [50, 0]) }],
    zIndex: showSearch ? 1000 : -1,
  }));

  const renderOffer = useCallback(({ item, index }: { item: typeof OFFERS[0]; index: number }) => (
    <TouchableOpacity 
      className="w-full rounded-[20px] overflow-hidden shadow-xl elevation-8" 
      style={{ height: RESPONSIVE.GET_HEIGHT(22) }}
      activeOpacity={0.9}
    >
      <Image
        source={typeof item.image === 'string' ? { uri: item.image } : item.image}
        className="absolute inset-0 w-full h-full"
        resizeMode="cover"
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
        className="absolute inset-0"
      />
      <View className="flex-1 px-6 py-4 justify-center">
        <View className={`w-full ${isRTL ? 'items-end' : 'items-start'}`}>
          <Text className="bg-[#800000] px-3 py-1 rounded-lg text-white text-[10px] uppercase mb-1" style={{ fontFamily: fonts.poppins.bold }}>
            {t('common.trending')}
          </Text>
          <Text className={`text-white text-[28px] leading-[30px] shadow-sm ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontFamily: fonts.bebasNeue.bold }}>
            {t(item.titleKey)}
          </Text>
          <Text className={`text-white/90 text-[13px] mt-1 mb-2 ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontFamily: fonts.poppins.medium }}>
            {t(item.subtitleKey)}
          </Text>
          <TouchableOpacity className="bg-white px-5 py-2 rounded-xl shadow-sm">
            <Text className="text-[#800000] text-[12px]" style={{ fontFamily: fonts.poppins.bold }}>{t('common.shopNow')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  ), [isRTL, t]);

  const listHeaderComponent = useMemo(() => (
    <View>
      {/* Categories Section */}
      <View className={`flex-row justify-between items-center px-5 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Text className="text-[22px] text-[#1A1A1A] tracking-tight" style={{ fontFamily: fonts.bebasNeue.bold }}>
          {t('home.categories')}
        </Text>
      </View>
      <CategoryList
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        isRTL={isRTL}
        t={t}
      />

      {/* Offers Banner */}
      <View className={`flex-row justify-between items-center px-5 mb-3 mt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Text className="text-[22px] text-[#1A1A1A] tracking-tight" style={{ fontFamily: fonts.bebasNeue.bold }}>
          {t('home.exclusive')}
        </Text>
      </View>

      <View className="items-center">
        <Carousel
          loop
          width={width}
          height={RESPONSIVE.GET_HEIGHT(22) + 20}
          autoPlay={true}
          autoPlayInterval={3000}
          data={OFFERS}
          scrollAnimationDuration={1000}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.9,
            parallaxScrollingOffset: 50,
          }}
          renderItem={renderOffer}
        />
      </View>

      {/* Bazaar Section Title */}
      <View className={`flex-row justify-between items-center px-5 mb-3 mt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Text className="text-[22px] text-[#1A1A1A] tracking-tight" style={{ fontFamily: fonts.bebasNeue.bold }}>
          {t('nav.bazaar')}
        </Text>
        <TouchableOpacity>
          <Text className="text-[13px] text-[#800000]" style={{ fontFamily: fonts.poppins.medium }}>{t('common.viewAll')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  ), [isRTL, selectedCategory, t, renderOffer]);

  const renderProduct = useCallback(({ item }: { item: any }) => {
    // Map Supabase fields to ProductCard format
    const mappedItem = {
      ...item,
      nameKey: item.name, // The DB has the actual name
      image: item.images && item.images.length > 0 ? { uri: item.images[0] } : images.ajrakBg,
      artisanKey: item.artisans?.shop_name || 'Artisan',
    };

    return (
      <ProductCard
        item={mappedItem}
        t={t}
        isRTL={isRTL}
        onPress={() => handleProductPress(mappedItem)}
      />
    );
  }, [t, isRTL, handleProductPress]);

  const keyExtractor = useCallback((item: any) => item.id, []);
  const ITEM_HEIGHT = RESPONSIVE.GET_HEIGHT(32);
  const getItemLayout = useCallback((data: any, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  }), []);

  return (
    <View className="flex-1 bg-[#FAF9F6]">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <HomeHeader
        t={t}
        i18n={i18n}
        isRTL={isRTL}
        toggleLanguage={toggleLanguage}
        scrollY={scrollY}
        onSearchPress={() => toggleSearch(true)}
      />

      {productsLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <Animated.FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={keyExtractor}
          numColumns={2}
          ListHeaderComponent={listHeaderComponent}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: RESPONSIVE.GET_HEIGHT(2), paddingBottom: RESPONSIVE.GET_HEIGHT(15) }}
          columnWrapperStyle={{ paddingHorizontal: RESPONSIVE.GET_WIDTH(5), justifyContent: 'space-between', flexDirection: isRTL ? 'row-reverse' : 'row' }}
          initialNumToRender={6}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews={Platform.OS === 'android'}
          getItemLayout={getItemLayout}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center py-20">
              <Icon name="basket-outline" size={60} color="#E5E7EB" />
              <Text className="text-gray-400 mt-4 text-[16px]" style={{ fontFamily: fonts.poppins.medium }}>
                {t('home.noProducts', { defaultValue: 'No products found in Bazaar yet' })}
              </Text>
            </View>
          }
          ListFooterComponent={<View className="h-10" />}
        />
      )}

      <SearchOverlay
        visible={showSearch}
        isRTL={isRTL}
        t={t}
        searchText={searchText}
        setSearchText={setSearchText}
        onClose={() => toggleSearch(false)}
        searchOverlayStyle={searchOverlayStyle}
        recentSearches={RECENT_SEARCHES}
        trendingKeywords={TRENDING_KEYWORDS}
      />

      <Animated.View
        entering={FadeInDown.delay(1000).springify()}
        className="absolute bottom-[100px] right-5 z-[100]"
      >
        <TouchableOpacity 
          className="w-14 h-14 rounded-full overflow-hidden shadow-xl elevation-8"
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Chat')}
        >
          <LinearGradient
            colors={[COLORS.primary, '#4A0000']}
            className="flex-1 justify-center items-center"
          >
            <Icon name="chatbubble-ellipses" size={28} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>


    </View>
  );
};

const styles = StyleSheet.create({
  // NativeWind handles the styles
});

export default memo(HomeScreen);
