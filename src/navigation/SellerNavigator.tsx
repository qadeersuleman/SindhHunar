import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SellerDashboard from '../screens/seller/SellerDashboard';
import AddProductScreen from '../screens/seller/AddProductScreen';
import PersonalInfoScreen from '../screens/profile/PersonalInfoScreen';
import CameraScreen from '../screens/profile/CameraScreen';
// import ManageProductsScreen from '../screens/seller/ManageProductsScreen'; // To be created
// import ViewOrdersScreen from '../screens/seller/ViewOrdersScreen'; // To be created

export type SellerStackParamList = {
  SellerDashboard: undefined;
  AddProduct: undefined;
  ManageProducts: undefined;
  ViewOrders: undefined;
  PersonalInfo: undefined;
  Camera: { onPhotoCaptured: (path: string) => void };
};

const Stack = createNativeStackNavigator<SellerStackParamList>();

export const SellerNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SellerDashboard" component={SellerDashboard} />
      <Stack.Screen name="AddProduct" component={AddProductScreen} />
      <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
      <Stack.Screen name="Camera" component={CameraScreen} />
      {/* 
      <Stack.Screen name="ManageProducts" component={ManageProductsScreen} />
      <Stack.Screen name="ViewOrders" component={ViewOrdersScreen} />
      */}
    </Stack.Navigator>
  );
};
