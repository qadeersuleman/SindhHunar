import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Switch,
  Modal,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, { FadeInDown, FadeInRight, FadeIn } from 'react-native-reanimated';
import { BlurView } from '@react-native-community/blur';
import { fonts } from '../../utils/fonts';
import { useAuthContext } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useProfile } from '../../hooks/useProfile';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#800000',
  secondary: '#C5A059',
  white: '#FFFFFF',
  cream: '#FAF9F6',
  dark: '#1A1A1A',
  gray: '#757575',
  lightGray: '#F0F0F0',
  error: '#E74C3C',
};

import { Avatar, List, Switch as PaperSwitch, Divider, Portal, Dialog, Button } from 'react-native-paper';

const ProfileScreen: React.FC = () => {
  const { logout, user } = useAuthContext();
  const { t, i18n } = useTranslation();
  const { showToast } = useToast();
  const isRTL = i18n.language === 'sd';
  const navigation = useNavigation<any>();
  const [showLogoutDialog, setShowLogoutDialog] = React.useState(false);

  // Fetch profile from Supabase via React Query
  const { data: profile, isLoading } = useProfile(user?.id);

  const displayName = profile?.full_name || user?.name || user?.email?.split('@')[0] || 'Sindh Hunar';
  const avatarUrl = profile?.avatar_url;

  return (
    <SafeAreaView className="flex-1 bg-[#FAF9F6]" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Profile Header */}
        <View className="items-center py-8">
          <Animated.View entering={FadeInDown.springify()} className="relative mb-4">
            {isLoading ? (
              <View className="w-[110px] h-[110px] rounded-full bg-gray-200 justify-center items-center border-2 border-[#C5A059]">
                <ActivityIndicator size="small" color={COLORS.primary} />
              </View>
            ) : avatarUrl ? (
              <Avatar.Image size={110} source={{ uri: avatarUrl }} style={{ borderWidth: 3, borderColor: COLORS.secondary, backgroundColor: 'transparent' }} />
            ) : (
              <Avatar.Icon size={110} icon="account" color={COLORS.secondary} style={{ backgroundColor: 'rgba(128,0,0,0.08)', borderWidth: 3, borderColor: COLORS.secondary }} />
            )}
            
            {!isLoading && (
              <TouchableOpacity
                className="absolute bottom-1 right-1 bg-[#800000] w-8 h-8 rounded-full justify-center items-center border-2 border-white"
                onPress={() => navigation.navigate('PersonalInfo')}
              >
                <Icon name="camera" size={16} color="white" />
              </TouchableOpacity>
            )}
          </Animated.View>
          
          <Animated.View entering={FadeInDown.delay(200).springify()} className="items-center">
            {isLoading ? (
              <View className="w-40 h-8 bg-gray-200 rounded mb-2" />
            ) : (
              <Text className="text-[28px] text-[#1A1A1A] tracking-wider" style={{ fontFamily: fonts.bebasNeue.bold }}>
                {displayName}
              </Text>
            )}
            
            {isLoading ? (
              <View className="w-32 h-6 bg-gray-200 rounded-full" />
            ) : (
              <View className="flex-row items-center bg-[#C5A059]/10 px-3 py-1 rounded-full mt-1">
                <Icon name="checkmark-circle" size={14} color={COLORS.secondary} />
                <Text className="text-[10px] text-[#C5A059] ml-1" style={{ fontFamily: fonts.poppins.bold }}>
                  Premium Member
                </Text>
              </View>
            )}
          </Animated.View>
        </View>

        {/* Stats Row */}
        <Animated.View entering={FadeInDown.delay(400).springify()} className="flex-row bg-white mx-6 rounded-[25px] py-5 shadow-sm elevation-3 mb-8">
          <View className="flex-1 items-center">
            <Text className="text-[22px] text-[#800000]" style={{ fontFamily: fonts.bebasNeue.bold }}>12</Text>
            <Text className="text-[11px] text-[#757575]" style={{ fontFamily: fonts.poppins.medium }}>Orders</Text>
          </View>
          <View className="w-[1px] h-3/5 bg-gray-100 self-center" />
          <View className="flex-1 items-center">
            <Text className="text-[22px] text-[#800000]" style={{ fontFamily: fonts.bebasNeue.bold }}>25</Text>
            <Text className="text-[11px] text-[#757575]" style={{ fontFamily: fonts.poppins.medium }}>Saved</Text>
          </View>
          <View className="w-[1px] h-3/5 bg-gray-100 self-center" />
          <View className="flex-1 items-center">
            <Text className="text-[22px] text-[#800000]" style={{ fontFamily: fonts.bebasNeue.bold }}>450</Text>
            <Text className="text-[11px] text-[#757575]" style={{ fontFamily: fonts.poppins.medium }}>Points</Text>
          </View>
        </Animated.View>

        {/* Menu Sections */}
        <View className="px-6 gap-6">
          <Animated.View entering={FadeInDown.delay(600).springify()}>
            <Text className="text-[18px] text-[#757575] mb-2 ml-1 tracking-wider uppercase" style={{ fontFamily: fonts.bebasNeue.bold }}>
              Account Settings
            </Text>
            <View className="bg-white rounded-[25px] overflow-hidden shadow-sm elevation-3">
              <List.Item
                title="Personal Information"
                description="Update your profile details"
                left={props => <List.Icon {...props} icon="account-outline" color={COLORS.primary} />}
                right={props => <List.Icon {...props} icon="chevron-right" size={20} />}
                onPress={() => navigation.navigate('PersonalInfo')}
                titleStyle={{ fontFamily: fonts.poppins.bold, fontSize: 14 }}
                descriptionStyle={{ fontFamily: fonts.poppins.regular, fontSize: 11 }}
              />
              <Divider />
              <List.Item
                title="Shipping Addresses"
                description="Ghotki, Sindh"
                left={props => <List.Icon {...props} icon="map-marker-outline" color={COLORS.primary} />}
                right={props => <List.Icon {...props} icon="chevron-right" size={20} />}
                titleStyle={{ fontFamily: fonts.poppins.bold, fontSize: 14 }}
                descriptionStyle={{ fontFamily: fonts.poppins.regular, fontSize: 11 }}
              />
              <Divider />
              <List.Item
                title="Payment Methods"
                description="Visa, JazzCash"
                left={props => <List.Icon {...props} icon="credit-card-outline" color={COLORS.primary} />}
                right={props => <List.Icon {...props} icon="chevron-right" size={20} />}
                titleStyle={{ fontFamily: fonts.poppins.bold, fontSize: 14 }}
                descriptionStyle={{ fontFamily: fonts.poppins.regular, fontSize: 11 }}
              />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(800).springify()}>
            <Text className="text-[18px] text-[#757575] mb-2 ml-1 tracking-wider uppercase" style={{ fontFamily: fonts.bebasNeue.bold }}>
              Preferences
            </Text>
            <View className="bg-white rounded-[25px] overflow-hidden shadow-sm elevation-3">
              <List.Item
                title="Notifications"
                description="Order updates and offers"
                left={props => <List.Icon {...props} icon="bell-outline" color={COLORS.primary} />}
                right={() => <PaperSwitch value={true} color={COLORS.primary} />}
                titleStyle={{ fontFamily: fonts.poppins.bold, fontSize: 14 }}
                descriptionStyle={{ fontFamily: fonts.poppins.regular, fontSize: 11 }}
              />
              <Divider />
              <List.Item
                title="App Language"
                description="Sindhi / Urdu / English"
                left={props => <List.Icon {...props} icon="translate" color={COLORS.primary} />}
                right={props => <List.Icon {...props} icon="chevron-right" size={20} />}
                titleStyle={{ fontFamily: fonts.poppins.bold, fontSize: 14 }}
                descriptionStyle={{ fontFamily: fonts.poppins.regular, fontSize: 11 }}
              />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(1000).springify()} className="bg-white rounded-[25px] overflow-hidden shadow-sm elevation-3 mb-6">
            <List.Item
              title="Support Center"
              left={props => <List.Icon {...props} icon="help-circle-outline" color={COLORS.primary} />}
              onPress={() => {}}
              titleStyle={{ fontFamily: fonts.poppins.bold, fontSize: 14 }}
            />
            <Divider />
            <List.Item
              title="Logout"
              left={props => <List.Icon {...props} icon="logout" color={COLORS.error} />}
              onPress={() => setShowLogoutDialog(true)}
              titleStyle={{ fontFamily: fonts.poppins.bold, fontSize: 14, color: COLORS.error }}
            />
          </Animated.View>
        </View>

        <View className="items-center mt-2">
          <Text className="text-[#757575] text-[12px]" style={{ fontFamily: fonts.poppins.regular }}>SindhHunar v1.0.2</Text>
          <Text className="text-[#800000]/40 text-[10px] mt-1" style={{ fontFamily: fonts.poppins.bold }}>Made with ❤️ in Sindh</Text>
        </View>
      </ScrollView>

      {/* Logout Dialog */}
      <Portal>
        <Dialog visible={showLogoutDialog} onDismiss={() => setShowLogoutDialog(false)} style={{ borderRadius: 25, backgroundColor: 'white' }}>
          <Dialog.Icon icon="logout" color={COLORS.primary} size={40} />
          <Dialog.Title style={{ textAlign: 'center', fontFamily: fonts.bebasNeue.bold, fontSize: 24 }}>{t('common.logoutTitle')}</Dialog.Title>
          <Dialog.Content>
            <Text className="text-center text-[#757575]" style={{ fontFamily: fonts.poppins.regular }}>{t('common.logoutConfirm')}</Text>
          </Dialog.Content>
          <Dialog.Actions className={`justify-around px-4 pb-6 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <Button 
              onPress={() => setShowLogoutDialog(false)}
              mode="text"
              textColor="#757575"
              labelStyle={{ fontFamily: fonts.poppins.bold }}
            >
              {t('common.cancel')}
            </Button>
            <Button 
              onPress={() => {
                setShowLogoutDialog(false);
                logout();
                showToast({ message: t('common.logoutSuccess'), type: 'info' });
              }}
              mode="contained"
              buttonColor={COLORS.primary}
              labelStyle={{ fontFamily: fonts.poppins.bold }}
            >
              {t('common.yes')}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // NativeWind and Paper handle the styles
});

export default ProfileScreen;
