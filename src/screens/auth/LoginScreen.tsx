import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Dimensions,
  TextInput,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { BlurView } from '@react-native-community/blur';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming, 
  withSequence,
  interpolate,
} from 'react-native-reanimated';
import { images } from '../../utils/images';
import { fonts } from '../../utils/fonts';
import { useAuthContext } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../context/ToastContext';
import LottieAnimation from '../../components/LottieAnimation';
import welcomeAnimation from '../../assets/animations/welcome.json';
import { TextInput as PaperInput, Button, HelperText } from 'react-native-paper';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/AuthNavigator';

const { width, height } = Dimensions.get('window');

const COLORS = {
  primary: '#C41E3A', // Deep Red
  secondary: '#C5A059',
  white: '#FFFFFF',
  glass: 'rgba(255, 255, 255, 0.12)',
};

const LoginScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'sd';
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const { login, loading, error, clearError } = useAuthContext();
  const { showToast } = useToast();

  const floatAnim = useSharedValue(0);

  useEffect(() => {
    floatAnim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 4000 }),
        withTiming(0, { duration: 4000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedBgStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(floatAnim.value, [0, 1], [0, -25]) },
      { scale: interpolate(floatAnim.value, [0, 1], [1, 1.08]) }
    ],
  }));

  const handleLogin = async () => {
    if (!email || !password) {
      showToast({ message: 'Please fill in all fields', type: 'error' });
      return;
    }
    clearError();
    try {
      await login(email, password);
      showToast({ 
        message: t('auth.loginSuccess', { defaultValue: 'Login Successful! Khush Amdeed.' }), 
        type: 'success' 
      });
    } catch (err) {
      // Error handled by AuthContext
    }
  };

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Background with Animation */}
      <Animated.Image 
        source={images.ajrakBg} 
        className="absolute inset-0 w-full h-full opacity-80"
        style={[animatedBgStyle]} 
        resizeMode="cover"
      />
      <LinearGradient 
        colors={['rgba(74, 0, 0, 0.4)', 'rgba(0, 0, 0, 0.9)']} 
        style={StyleSheet.absoluteFillObject} 
      />
      
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
          className="flex-1"
        >
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 25 }} 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            
            {/* Header Area */}
            <Animated.View entering={FadeInUp.delay(200).springify()} className="items-center mb-8">
              <View className="w-20 h-20 rounded-full bg-white/10 justify-center items-center border border-white/20 mb-4 overflow-hidden">
                <LottieAnimation
                  source={welcomeAnimation}
                  size={80}
                  autoPlay={true}
                  loop={true}
                />
                <View className="absolute inset-0 rounded-full border-2 border-[#C41E3A] opacity-30 scale-110" />
              </View>
              <Text className="text-[52px] text-white tracking-[4px]" style={{ fontFamily: fonts.bebasNeue.bold, textShadowColor: '#C41E3A', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 15 }}>
                SindhHunar
              </Text>
              <Text className="text-[14px] text-white/70 -mt-2" style={{ fontFamily: fonts.poppins.medium }}>
                {t('common.welcome')} ✨
              </Text>
            </Animated.View>
            
            {/* Glass Card */}
            <Animated.View entering={FadeInDown.delay(400).springify()} className="rounded-[35px] overflow-hidden bg-white/5 border border-white/15">
              <Image source={images.cardbg} style={StyleSheet.absoluteFillObject} />
              {Platform.OS === 'ios' ? (
                <BlurView style={StyleSheet.absoluteFillObject} blurType="dark" blurAmount={25} />
              ) : (
                <View className="absolute inset-0 bg-black/75" />
              )}
              
              <View className="p-8 z-10">
                <Text 
                  className={`text-[24px] text-white mb-6 ${isRTL ? 'text-right' : 'text-left'}`}
                  style={{ fontFamily: fonts.poppins.bold }}
                >
                  {t('auth.welcomeBack')}
                </Text>
                
                {error ? (
                  <HelperText type="error" visible={!!error} className="text-center mb-4">
                    {error}
                  </HelperText>
                ) : null}
                
                <View className="gap-4">
                  <PaperInput
                    label={t('auth.email')}
                    value={email}
                    onChangeText={setEmail}
                    mode="outlined"
                    outlineColor="rgba(255,255,255,0.3)"
                    activeOutlineColor={COLORS.primary}
                    textColor="white"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                    left={<PaperInput.Icon icon="mail-outline" color="rgba(255,255,255,0.7)" />}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />

                  <PaperInput
                    label={t('auth.password')}
                    value={password}
                    onChangeText={setPassword}
                    mode="outlined"
                    outlineColor="rgba(255,255,255,0.3)"
                    activeOutlineColor={COLORS.primary}
                    textColor="white"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                    secureTextEntry={secureText}
                    left={<PaperInput.Icon icon="lock-outline" color="rgba(255,255,255,0.7)" />}
                    right={<PaperInput.Icon icon={secureText ? "eye" : "eye-off"} onPress={() => setSecureText(!secureText)} color="rgba(255,255,255,0.7)" />}
                  />
                  
                  <TouchableOpacity 
                    className={`mt-1 ${isRTL ? 'self-start' : 'self-end'}`}
                  >
                    <Text className="text-[#C41E3A] text-[13px]" style={{ fontFamily: fonts.poppins.medium }}>
                      {t('auth.forgot')}
                    </Text>
                  </TouchableOpacity>
                  
                  <Button 
                    mode="contained"
                    onPress={handleLogin}
                    loading={loading}
                    disabled={loading}
                    contentStyle={{ height: 56 }}
                    className="mt-4 rounded-2xl overflow-hidden"
                    buttonColor={COLORS.primary}
                    labelStyle={{ fontFamily: fonts.poppins.bold, fontSize: 16, letterSpacing: 1 }}
                  >
                    {t('auth.login')}
                  </Button>
                </View>
                
                <View className={`flex-row justify-center items-center mt-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Text className="text-white/60 text-[14px]" style={{ fontFamily: fonts.poppins.regular }}>
                    {t('auth.newHere')} 
                  </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                    <Text className="text-[#C41E3A] text-[14px] ml-1" style={{ fontFamily: fonts.poppins.bold }}>
                      {t('auth.signup')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  // NativeWind and Paper handle the styles
});

export default LoginScreen;
