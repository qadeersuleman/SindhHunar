import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthNavigator, TabNavigator } from './index';
import { useAuth } from '../hooks/useAuth';
import SplashScreen from '../components/SplashScreen';
import ProductDetailScreen from '../screens/product/ProductDetailScreen';
import PersonalInfoScreen from '../screens/profile/PersonalInfoScreen';
import CameraScreen from '../screens/profile/CameraScreen';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  ProductDetail: { item: any };
  PersonalInfo: undefined;
  Camera: { onPhotoCaptured: (path: string) => void };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { user, isInitialized } = useAuth();

  if (!isInitialized) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
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
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
