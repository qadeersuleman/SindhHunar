import React from 'react';
import { 
  View, 
  StyleSheet, 
  ImageBackground, 
  StatusBar, 
  Dimensions,
  ViewStyle
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../utils/images';

const { width } = Dimensions.get('window');

interface PremiumHeaderProps {
  children: React.ReactNode;
  headerContent?: React.ReactNode;
  height?: number;
  overlap?: number;
  containerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
}

const PremiumHeader: React.FC<PremiumHeaderProps> = ({ 
  children, 
  headerContent, 
  height = 160, 
  overlap = 30,
  containerStyle,
  contentStyle
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ImageBackground 
        source={images.ajrakBg} 
        style={[styles.headerBg, { height }]}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(128,0,0,0.85)', 'rgba(0,0,0,0.3)']}
          style={StyleSheet.absoluteFillObject}
        />
        <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
          <View style={styles.headerInner}>
            {headerContent}
          </View>
        </SafeAreaView>
      </ImageBackground>

      <View style={[styles.contentArea, { marginTop: -overlap }, contentStyle]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6', // Default cream color
  },
  headerBg: {
    width: '100%',
    justifyContent: 'flex-end',
  },
  headerSafeArea: {
    flex: 1,
  },
  headerInner: {
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: 'flex-end',
    paddingBottom: 35,
  },

  contentArea: {
    flex: 1,
    backgroundColor: '#FAF9F6',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
});

export default PremiumHeader;
