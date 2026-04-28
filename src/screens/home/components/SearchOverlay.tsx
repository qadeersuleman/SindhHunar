import React, { memo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { fonts } from '../../../utils/fonts';
import { images } from '../../../utils/images';
import { RESPONSIVE } from '../../../utils/responsive';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#800000',
  secondary: '#C5A059',
  white: '#FFFFFF',
  dark: '#1A1A1A',
  gray: '#757575',
  lightGray: '#F0F0F0',
  cream: '#FAF9F6',
};

interface SearchOverlayProps {
  visible: boolean;
  isRTL: boolean;
  t: any;
  searchText: string;
  setSearchText: (text: string) => void;
  onClose: () => void;
  searchOverlayStyle: any;
  recentSearches: string[];
  trendingKeywords: string[];
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({
  visible,
  isRTL,
  t,
  searchText,
  setSearchText,
  onClose,
  searchOverlayStyle,
  recentSearches,
  trendingKeywords,
}) => {
  return (
    <Animated.View style={[styles.searchOverlay, searchOverlayStyle]}>
      <SafeAreaView style={styles.searchOverlayContent}>
        <View style={[styles.searchOverlayHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View style={[styles.searchInputContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Icon name="search" size={RESPONSIVE.GET_FONT_SIZE(20)} color={COLORS.primary} />
            <TextInput
              placeholder={t('home.search')}
              placeholderTextColor={COLORS.gray}
              style={[styles.searchInput, { textAlign: isRTL ? 'right' : 'left', marginHorizontal: 10 }]}
              autoFocus={visible}
              value={searchText}
              onChangeText={setSearchText}
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText('')}>
                <Icon name="close-circle" size={RESPONSIVE.GET_FONT_SIZE(20)} color={COLORS.gray} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity 
            style={styles.closeSearchButton}
            onPress={onClose}
          >
            <Text style={styles.closeSearchText}>{t('common.cancel')}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.searchSection}>
            <Text style={[styles.searchSectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{t('home.recent')}</Text>
            <View style={[styles.recentSearchesContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              {recentSearches.map((item, index) => (
                <View 
                  key={index}
                  style={[styles.searchChip, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                >
                  <Icon name="time-outline" size={RESPONSIVE.GET_FONT_SIZE(14)} color={COLORS.gray} style={{ [isRTL ? 'marginLeft' : 'marginRight']: 5 }} />
                  <Text style={styles.searchChipText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.searchSection}>
            <Text style={[styles.searchSectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{t('home.trendingNow')}</Text>
            <View style={styles.trendingContainer}>
              {trendingKeywords.map((item, index) => (
                <View 
                  key={index}
                  style={[styles.trendingItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                >
                  <View style={styles.trendingIcon}>
                    <Icon name="trending-up" size={RESPONSIVE.GET_FONT_SIZE(16)} color={COLORS.secondary} />
                  </View>
                  <Text style={[styles.trendingText, { textAlign: isRTL ? 'right' : 'left' }]}>{item}</Text>
                  <Icon name={isRTL ? "chevron-back" : "chevron-forward"} size={RESPONSIVE.GET_FONT_SIZE(14)} color={COLORS.lightGray} />
                </View>
              ))}
            </View>
          </View>

          <View style={styles.searchSection}>
            <Text style={[styles.searchSectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{t('home.popularCollections')}</Text>
            <View style={[styles.popularSearchGrid, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              {['Fashion', 'Ajrak', 'Decor'].map((item, index) => (
                <TouchableOpacity key={index} style={styles.popularSearchCard}>
                  <Image 
                    source={images.background} 
                    style={[StyleSheet.absoluteFillObject, { opacity: 0.1 }]} 
                  />
                  <Text style={styles.popularSearchCardText}>{t(`home.${item.toLowerCase()}`)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  searchOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.cream,
    zIndex: 100,
  },
  searchOverlayContent: {
    flex: 1,
  },
  searchOverlayHeader: {
    paddingHorizontal: RESPONSIVE.GET_WIDTH(5),
    paddingVertical: RESPONSIVE.GET_HEIGHT(2),
    alignItems: 'center',
    gap: RESPONSIVE.MODERATE_SCALE(12),
  },
  searchInputContainer: {
    flex: 1,
    height: RESPONSIVE.GET_HEIGHT(6),
    backgroundColor: COLORS.white,
    borderRadius: RESPONSIVE.MODERATE_SCALE(15),
    paddingHorizontal: RESPONSIVE.GET_WIDTH(4),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.poppins.medium,
    fontSize: RESPONSIVE.GET_FONT_SIZE(14),
    color: COLORS.dark,
  },
  closeSearchButton: {
    paddingHorizontal: RESPONSIVE.MODERATE_SCALE(5),
  },
  closeSearchText: {
    fontFamily: fonts.poppins.medium,
    fontSize: RESPONSIVE.GET_FONT_SIZE(14),
    color: COLORS.primary,
  },
  searchSection: {
    marginTop: RESPONSIVE.GET_HEIGHT(3),
    paddingHorizontal: RESPONSIVE.GET_WIDTH(5),
  },
  searchSectionTitle: {
    fontFamily: fonts.bebasNeue.bold,
    fontSize: RESPONSIVE.GET_FONT_SIZE(18),
    color: COLORS.gray,
    marginBottom: RESPONSIVE.GET_HEIGHT(2),
    letterSpacing: 0.8,
  },
  recentSearchesContainer: {
    flexWrap: 'wrap',
    gap: RESPONSIVE.MODERATE_SCALE(10),
  },
  searchChip: {
    backgroundColor: COLORS.white,
    paddingHorizontal: RESPONSIVE.MODERATE_SCALE(12),
    paddingVertical: RESPONSIVE.MODERATE_SCALE(8),
    borderRadius: RESPONSIVE.MODERATE_SCALE(10),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  searchChipText: {
    fontFamily: fonts.poppins.regular,
    fontSize: RESPONSIVE.GET_FONT_SIZE(12),
    color: COLORS.dark,
  },
  trendingContainer: {
    backgroundColor: COLORS.white,
    borderRadius: RESPONSIVE.MODERATE_SCALE(20),
    overflow: 'hidden',
    padding: RESPONSIVE.MODERATE_SCALE(5),
  },
  trendingItem: {
    padding: RESPONSIVE.MODERATE_SCALE(12),
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  trendingIcon: {
    width: RESPONSIVE.MODERATE_SCALE(32),
    height: RESPONSIVE.MODERATE_SCALE(32),
    borderRadius: RESPONSIVE.MODERATE_SCALE(10),
    backgroundColor: 'rgba(197, 160, 89, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: RESPONSIVE.MODERATE_SCALE(10),
  },
  trendingText: {
    flex: 1,
    fontFamily: fonts.poppins.medium,
    fontSize: RESPONSIVE.GET_FONT_SIZE(13),
    color: COLORS.dark,
  },
  popularSearchGrid: {
    flexWrap: 'wrap',
    gap: RESPONSIVE.MODERATE_SCALE(12),
  },
  popularSearchCard: {
    width: (width - RESPONSIVE.GET_WIDTH(13)) / 3,
    height: RESPONSIVE.GET_HEIGHT(12),
    backgroundColor: COLORS.white,
    borderRadius: RESPONSIVE.MODERATE_SCALE(15),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    overflow: 'hidden',
  },
  popularSearchCardText: {
    fontFamily: fonts.poppins.bold,
    fontSize: RESPONSIVE.GET_FONT_SIZE(12),
    color: COLORS.primary,
  },
});

export default memo(SearchOverlay);
