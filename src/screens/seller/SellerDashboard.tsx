import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/layout/Header';
import { fonts } from '../../utils/fonts';
import { Card as PaperCard, Button as PaperButton, Badge as PaperBadge, List, IconButton } from 'react-native-paper';

interface SellerDashboardProps {
  sellerData: {
    name: string;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    rating: number;
  };
  onAddProduct?: () => void;
  onViewOrders?: () => void;
  onViewProducts?: () => void;
  onEditProfile?: () => void;
  onLogout?: () => void;
}

const SellerDashboard: React.FC<SellerDashboardProps> = ({
  sellerData,
  onAddProduct,
  onViewOrders,
  onViewProducts,
  onEditProfile,
  onLogout,
}) => {
  const [loading, setLoading] = useState(false);

  const StatCard = ({ title, value, subtitle }: { title: string; value: string; subtitle: string }) => (
    <PaperCard className="flex-1 items-center p-4 bg-white rounded-2xl elevation-2 shadow-sm">
      <Text className="text-[14px] text-gray-500 mb-2" style={{ fontFamily: fonts.poppins.medium }}>{title}</Text>
      <Text className="text-[24px] text-[#800000]" style={{ fontFamily: fonts.poppins.bold }}>{value}</Text>
      <Text className="text-[12px] text-gray-400" style={{ fontFamily: fonts.poppins.regular }}>{subtitle}</Text>
    </PaperCard>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Header
        title="Seller Dashboard"
        showMenu={true}
        onMenuPress={() => {}}
      />
      
      <ScrollView className="flex-1 px-4">
        <View className="bg-white p-6 rounded-3xl mb-6 items-center shadow-sm elevation-1 mt-4">
          <Text className="text-[16px] text-gray-500 mb-1" style={{ fontFamily: fonts.poppins.regular }}>Welcome back,</Text>
          <Text className="text-[24px] text-[#1A1A1A] mb-3" style={{ fontFamily: fonts.poppins.bold }}>{sellerData.name}</Text>
          <View className="flex-row items-center gap-2">
            <Text className="text-[16px] text-[#C5A059]" style={{ fontFamily: fonts.poppins.bold }}>⭐ {sellerData.rating.toFixed(1)}</Text>
            <PaperBadge className="bg-green-100 text-green-700 px-3 py-0.5 h-6 justify-center rounded-full" style={{ fontFamily: fonts.poppins.bold }}>Verified Seller</PaperBadge>
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-[20px] text-[#1A1A1A] mb-4 tracking-tight" style={{ fontFamily: fonts.poppins.bold }}>Your Stats</Text>
          <View className="flex-row gap-3">
            <StatCard
              title="Products"
              value={sellerData.totalProducts.toString()}
              subtitle="Total listed"
            />
            <StatCard
              title="Orders"
              value={sellerData.totalOrders.toString()}
              subtitle="This month"
            />
            <StatCard
              title="Revenue"
              value={`$${sellerData.totalRevenue.toFixed(0)}`}
              subtitle="This month"
            />
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-[20px] text-[#1A1A1A] mb-4 tracking-tight" style={{ fontFamily: fonts.poppins.bold }}>Quick Actions</Text>
          
          <PaperButton
            mode="contained"
            onPress={() => onAddProduct?.()}
            className="mb-3 rounded-2xl py-1"
            buttonColor="#800000"
            labelStyle={{ fontFamily: fonts.poppins.bold, fontSize: 16 }}
            icon="plus"
          >
            Add New Product
          </PaperButton>
          
          <PaperButton
            mode="contained-tonal"
            onPress={() => onViewOrders?.()}
            className="mb-3 rounded-2xl py-1"
            labelStyle={{ fontFamily: fonts.poppins.bold, fontSize: 16 }}
            icon="receipt"
          >
            View Orders
          </PaperButton>
          
          <PaperButton
            mode="outlined"
            onPress={() => onViewProducts?.()}
            className="mb-3 rounded-2xl py-1"
            textColor="#800000"
            style={{ borderColor: '#800000' }}
            labelStyle={{ fontFamily: fonts.poppins.bold, fontSize: 16 }}
            icon="package-variant"
          >
            Manage Products
          </PaperButton>
        </View>

        <View className="mb-5">
          <Text className="text-[20px] text-[#1A1A1A] mb-4 tracking-tight" style={{ fontFamily: fonts.poppins.bold }}>Settings</Text>
          
          <List.Item
            title="Edit Profile"
            onPress={onEditProfile}
            className="bg-white rounded-2xl mb-2 elevation-1 shadow-sm"
            titleStyle={{ fontFamily: fonts.poppins.medium, fontSize: 16, color: '#333' }}
            left={props => <List.Icon {...props} icon="account-edit-outline" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
          
          <List.Item
            title="Logout"
            onPress={onLogout}
            className="bg-white rounded-2xl mb-2 elevation-1 shadow-sm"
            titleStyle={{ fontFamily: fonts.poppins.bold, fontSize: 16, color: '#800000' }}
            left={props => <List.Icon {...props} icon="logout" color="#800000" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // NativeWind and Paper handle the styles
});

export default SellerDashboard;
