import React, { useState, useRef, useLayoutEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  Platform,
  StatusBar,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';
import Animated, {
  FadeInDown,
  SlideInUp,
  FadeOutDown,
  FadeIn,
  ZoomIn,
  SlideInDown,
} from 'react-native-reanimated';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { fonts } from '../../utils/fonts';
import { Card as PaperCard, IconButton, Button as PaperButton } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

const COLORS = {
  primary: '#800000',
  primaryLight: '#9B1B1B',
  secondary: '#C5A059',
  accent: '#FF6B6B',
  white: '#FFFFFF',
  black: '#1A1A1A',
  grey: '#F5F5F5',
  textGrey: '#666666',
  lightMaroon: 'rgba(128, 0, 0, 0.06)',
  success: '#4CAF50',
  warning: '#FFA726',
};

const shops = [
  { id: 1, name: "Ali Grocery Store", lat: 24.8607, lng: 67.0011, address: "Burns Road, Karachi" },
  { id: 2, name: "Karachi Electronics", lat: 24.8620, lng: 67.0030, address: "Saddar, Karachi" },
  { id: 3, name: "Bismillah Mart", lat: 24.8585, lng: 67.0000, address: "I.I Chundrigar Rd, Karachi" },
];

const MapScreen = () => {
  const [selectedShop, setSelectedShop] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const webViewRef = useRef<WebView>(null);
  const navigation = useNavigation<any>();

  // Hide bottom tab bar when on Map screen
  useFocusEffect(
    React.useCallback(() => {
      const parent = navigation.getParent();
      if (parent) {
        parent.setOptions({
          tabBarStyle: { display: 'none' },
        });
      }
      
      return () => {
        handleCloseModal();
        if (parent) {
          parent.setOptions({
            tabBarStyle: { 
              display: 'flex',
              backgroundColor: '#FFFFFF',
              height: 65,
              position: 'absolute',
              bottom: 25,
              left: 20,
              right: 20,
              borderRadius: 20,
              borderTopWidth: 0,
              elevation: 10,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.1,
              shadowRadius: 10,
              paddingBottom: Platform.OS === 'ios' ? 20 : 10,
            },
          });
        }
      };
    }, [navigation])
  );

  const handleCloseModal = () => {
    setSelectedShop(null);
    webViewRef.current?.injectJavaScript(`
      if (window.map) {
        map.closePopup();
      }
      true;
    `);
  };

  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body { margin: 0; padding: 0; background-color: #f0f0f0; }
        #map { height: 100vh; width: 100vw; }
        .leaflet-container { background: #f0f0f0; }
        .custom-div-icon {
          background: ${COLORS.primary};
          border: 3px solid white;
          border-radius: 50%;
          color: white;
          width: 36px !important;
          height: 36px !important;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(128,0,0,0.4);
          font-size: 16px;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map', { 
          zoomControl: false,
          attributionControl: false 
        }).setView([24.8607, 67.0011], 14);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
        }).addTo(map);

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        var shops = ${JSON.stringify(shops)};

        shops.forEach(function(shop) {
          var icon = L.divIcon({
            className: 'custom-div-icon',
            html: '<div>🏪</div>',
            iconSize: [36, 36],
            iconAnchor: [18, 18]
          });

          var marker = L.marker([shop.lat, shop.lng], { icon: icon }).addTo(map);
          marker.on('click', function(e) {
            L.DomEvent.stopPropagation(e);
            window.ReactNativeWebView.postMessage(JSON.stringify(shop));
            map.setView([shop.lat, shop.lng], 16, { animate: true, duration: 0.5 });
          });
        });

        map.on('click', function() {
           window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'map_click' }));
        });
      </script>
    </body>
    </html>
  `;

  const onMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'map_click') {
        handleCloseModal();
      } else if (data.id) {
        setSelectedShop(data);
      }
    } catch (e) {
      console.warn('Error parsing message from webview', e);
    }
  };

  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: mapHtml }}
        className="flex-1"
        style={{ backgroundColor: 'transparent' }}
        onMessage={onMessage}
        onLoadEnd={() => setIsLoading(false)}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scrollEnabled={false}
        bounces={false}
      />

      {isLoading && (
        <View className="absolute inset-0 justify-center items-center bg-white z-[100]">
          <Animated.View entering={FadeIn} className="items-center">
            <LottieView
              source={{ uri: 'https://lottie.host/7623910c-f370-449e-9764-793570624d6d/m8G0S5vXb5.json' }} // Generic Shop/Bazaar Loading
              autoPlay
              loop
              style={{ width: 250, height: 250 }}
            />
            <Text className="mt-[-20px] text-[24px] text-[#800000] tracking-tight text-center" style={{ fontFamily: fonts.bebasNeue.bold }}>
              SINDH BAZAAR KHULI RAHO AAHE...
            </Text>
            <Text className="text-[14px] text-[#666666] mt-1" style={{ fontFamily: fonts.poppins.regular }}>
              Finding the best local crafts for you
            </Text>
          </Animated.View>
        </View>
      )}

      {/* Floating Creative Header */}
      <Animated.View entering={SlideInUp.delay(200).duration(800)} className="absolute top-12 left-4 right-4 z-10">
        <PaperCard className="bg-white/90 rounded-[24px] overflow-hidden shadow-xl elevation-10 border border-white/20">
          <LinearGradient
            colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
            className="p-3 flex-row items-center"
          >
            <IconButton
              icon="arrow-left"
              size={22}
              iconColor="#1A1A1A"
              onPress={() => navigation.goBack()}
              className="bg-gray-100/80 mr-2"
            />
            <View className="w-10 h-10 rounded-xl bg-[#800000] justify-center items-center shadow-sm">
              <Icon name="map" size={20} color="white" />
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-[18px] text-[#1A1A1A] tracking-tight" style={{ fontFamily: fonts.bebasNeue.bold }}>Sindh Bazaar Map</Text>
              <Text className="text-[10px] text-[#800000] uppercase tracking-widest" style={{ fontFamily: fonts.poppins.bold }}>Explore Local Shops</Text>
            </View>
            <TouchableOpacity className="bg-[#800000]/10 px-3 py-1.5 rounded-full flex-row items-center gap-1">
              <View className="w-1.5 h-1.5 rounded-full bg-[#800000] animate-pulse" />
              <Text className="text-[10px] text-[#800000]" style={{ fontFamily: fonts.poppins.bold }}>LIVE</Text>
            </TouchableOpacity>
          </LinearGradient>
        </PaperCard>
      </Animated.View>

      {/* Bottom Sheet Shop Details */}
      {selectedShop && (
        <Animated.View
          entering={SlideInDown.duration(400)}
          exiting={FadeOutDown.duration(200)}
          className="absolute bottom-0 left-0 right-0 z-[100]"
        >
          <View className="bg-white rounded-t-[40px] p-6 pb-12 shadow-2xl elevation-20 border-t border-gray-100">
            <View className="w-12 h-1 bg-gray-200 rounded-full self-center mb-6" />

            <View className="flex-row items-center mb-8">
              <View className="w-16 h-16 rounded-3xl bg-[#800000]/5 justify-center items-center border border-[#800000]/10">
                <Text className="text-[#800000] text-[28px]" style={{ fontFamily: fonts.bebasNeue.bold }}>
                  {selectedShop.name.charAt(0)}
                </Text>
              </View>

              <View className="flex-1 ml-4">
                <Text className="text-[22px] text-[#1A1A1A] leading-tight" style={{ fontFamily: fonts.bebasNeue.bold }}>{selectedShop.name}</Text>
                <View className="flex-row items-center mt-1">
                  <Icon name="location" size={12} color="#C5A059" />
                  <Text className="text-[12px] text-[#757575] ml-1" style={{ fontFamily: fonts.poppins.regular }} numberOfLines={1}>{selectedShop.address}</Text>
                </View>
              </View>

              <IconButton 
                icon="close-circle" 
                size={28} 
                iconColor="#E5E7EB" 
                onPress={handleCloseModal}
                className="m-0"
              />
            </View>

            <View className="flex-row gap-3">
              <PaperButton 
                mode="contained" 
                onPress={() => { handleCloseModal(); }}
                buttonColor={COLORS.primary}
                className="flex-1 rounded-2xl py-1"
                labelStyle={{ fontFamily: fonts.poppins.bold, fontSize: 14 }}
              >
                Visit Shop
              </PaperButton>

              <PaperButton 
                mode="outlined" 
                onPress={handleCloseModal}
                textColor="#1A1A1A"
                style={{ borderColor: '#E5E7EB' }}
                className="flex-1 rounded-2xl py-1"
                labelStyle={{ fontFamily: fonts.poppins.bold, fontSize: 14 }}
              >
                Dismiss
              </PaperButton>
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // NativeWind handles the styles
});

export default MapScreen;