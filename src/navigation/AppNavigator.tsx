import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthNavigator, TabNavigator } from './index';
import { SellerNavigator } from './SellerNavigator';
import { AdminNavigator } from './AdminNavigator';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { useFirstLaunch } from '../hooks/useFirstLaunch';
import SplashScreen from '../components/SplashScreen';
import ProductDetailScreen from '../screens/product/ProductDetailScreen';
import PersonalInfoScreen from '../screens/profile/PersonalInfoScreen';
import CameraScreen from '../screens/profile/CameraScreen';
import OrderHistoryScreen from '../screens/order/OrderHistoryScreen';
import ChatScreen from '../screens/chat/ChatScreen';
import CheckoutScreen from '../screens/order/CheckoutScreen';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  SellerMain: undefined;
  AdminMain: undefined;
  ProductDetail: { item: any };
  PersonalInfo: undefined;
  Camera: { onPhotoCaptured: (path: string) => void };
  OrderHistory: undefined;
  Chat: undefined;
  Checkout: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// ─── Minimal loading screen shown while auth initialises on subsequent launches ──
const AppLoadingScreen: React.FC = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#C41E3A" />
  </View>
);

const AppNavigator: React.FC = () => {
  const { user, isAuthenticated, isInitialized } = useAuth();
  const { data: profile, isLoading: isProfileLoading } = useProfile(
    isAuthenticated ? user?.id : undefined
  );

  // ─── First-launch guard ────────────────────────────────────────────────────
  // isChecking  → AsyncStorage read is in-flight (show nothing / wait)
  // isFirstLaunch → key was never set = first install = show splash
  const { isFirstLaunch, isChecking, markSplashSeen } = useFirstLaunch();

  console.log('[AppNavigator] State:', {
    hasUser: !!user,
    isAuthenticated,
    isInitialized,
    role: profile?.role,
    isProfileLoading,
    isFirstLaunch,
    isChecking,
  });

  // 1️⃣  Still reading AsyncStorage — render nothing briefly to avoid flicker
  if (isChecking) {
    return null;
  }

  // 2️⃣  FIRST INSTALL ONLY — show the custom branded splash.
  //     onFinish writes the flag to AsyncStorage so this never runs again.
  if (isFirstLaunch) {
    return <SplashScreen onFinish={markSplashSeen} />;
  }

  // 3️⃣  Subsequent launches — auth is still initialising → minimal spinner
  if (!isInitialized || (isAuthenticated && isProfileLoading)) {
    return <AppLoadingScreen />;
  }

  // 4️⃣  Fully ready — render the real navigator
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          profile?.role === 'admin' ? (
            <Stack.Screen name="AdminMain" component={AdminNavigator} />
          ) : profile?.role === 'artisan' ? (
            <Stack.Screen name="SellerMain" component={SellerNavigator} />
          ) : (
            <>
              <Stack.Screen name="Main" component={TabNavigator} />
              <Stack.Screen
                name="ProductDetail"
                component={ProductDetailScreen}
                options={{ animation: 'slide_from_bottom' }}
              />
              <Stack.Screen
                name="PersonalInfo"
                component={PersonalInfoScreen}
                options={{ animation: 'slide_from_right' }}
              />
              <Stack.Screen
                name="Camera"
                component={CameraScreen}
                options={{ animation: 'fade' }}
              />
              <Stack.Screen
                name="OrderHistory"
                component={OrderHistoryScreen}
                options={{ animation: 'slide_from_right' }}
              />
              <Stack.Screen
                name="Chat"
                component={ChatScreen}
                options={{ animation: 'slide_from_right' }}
              />
              <Stack.Screen
                name="Checkout"
                component={CheckoutScreen}
                options={{ animation: 'slide_from_right' }}
              />
            </>
          )
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppNavigator;
