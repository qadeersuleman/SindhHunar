import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthNavigator, TabNavigator } from './index';
import { SellerNavigator } from './SellerNavigator';
import { AdminNavigator } from './AdminNavigator';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import SplashScreen from '../components/SplashScreen';
import ProductDetailScreen from '../screens/product/ProductDetailScreen';
import PersonalInfoScreen from '../screens/profile/PersonalInfoScreen';
import CameraScreen from '../screens/profile/CameraScreen';
import OrderHistoryScreen from '../screens/order/OrderHistoryScreen';
import ChatScreen from '../screens/chat/ChatScreen';

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
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { user, isAuthenticated, isInitialized } = useAuth();
  const { data: profile, isLoading: isProfileLoading } = useProfile(isAuthenticated ? user?.id : undefined);

  console.log('[AppNavigator] State:', { hasUser: !!user, isAuthenticated, isInitialized, role: profile?.role, isProfileLoading });

  if (!isInitialized || (isAuthenticated && isProfileLoading)) {
    return <SplashScreen />;
  }

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
                options={{ 
                  animation: 'slide_from_bottom',
                }}
              />
              <Stack.Screen 
                name="PersonalInfo" 
                component={PersonalInfoScreen} 
                options={{ 
                  animation: 'slide_from_right',
                }}
              />
              <Stack.Screen 
                name="Camera" 
                component={CameraScreen} 
                options={{ 
                  animation: 'fade',
                }}
              />
              <Stack.Screen 
                name="OrderHistory" 
                component={OrderHistoryScreen} 
                options={{ 
                  animation: 'slide_from_right',
                }}
              />
              <Stack.Screen 
                name="Chat" 
                component={ChatScreen} 
                options={{ 
                  animation: 'slide_from_right',
                }}
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

export default AppNavigator;
