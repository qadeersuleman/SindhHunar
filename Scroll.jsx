import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  useAnimatedProps,
  runOnJS,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const AGES = Array.from({ length: 83 }, (_, i) => (i + 18).toString());
const ITEM_HEIGHT = 80;
const VISIBLE_ITEMS = 5;

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const AgeItem = ({ item, index, scrollY, onSelect, isSelected }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 2) * ITEM_HEIGHT,
      (index - 1) * ITEM_HEIGHT,
      index * ITEM_HEIGHT,
      (index + 1) * ITEM_HEIGHT,
      (index + 2) * ITEM_HEIGHT,
    ];

    const scale = interpolate(
      scrollY.value,
      inputRange,
      [0.7, 0.9, 1.25, 0.9, 0.7],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      scrollY.value,
      inputRange,
      [0.3, 0.6, 1, 0.6, 0.3],
      Extrapolate.CLAMP
    );

    const translateY = interpolate(
      scrollY.value,
      inputRange,
      [10, 5, 0, -5, -10],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }, { translateY }],
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.itemContainer, animatedStyle]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onSelect(index)}
        style={[styles.item, isSelected && styles.selectedItem]}
      >
        {isSelected ? (
          <LinearGradient
            colors={['#FF3B30', '#800000']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <Text style={styles.selectedText}>{item}</Text>
            <Text style={styles.subText}>YEARS</Text>
          </LinearGradient>
        ) : (
          <Text style={styles.text}>{item}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function AgeSelectionDemo() {
  const [selectedAge, setSelectedAge] = useState('25');
  const scrollY = useSharedValue(0);
  const flatListRef = React.useRef(null);

  const updateSelectedAge = useCallback((index) => {
    const age = AGES[index];
    if (age) setSelectedAge(age);
  }, []);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      const index = Math.round(event.contentOffset.y / ITEM_HEIGHT);
      runOnJS(updateSelectedAge)(index);
    },
  });

  const handleSelect = (index) => {
    flatListRef.current?.scrollToOffset({
      offset: index * ITEM_HEIGHT,
      animated: true,
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1A1A1A', '#000000']}
        style={StyleSheet.absoluteFill}
      />
      
      <View style={styles.header}>
        <Text style={styles.title}>SELECT YOUR AGE</Text>
        <Text style={styles.subtitle}>Scroll to find your perfect fit</Text>
      </View>

      <View style={styles.pickerContainer}>
        {/* Selection Indicators */}
        <View style={styles.indicatorContainer} pointerEvents="none">
          <View style={styles.indicatorLine} />
          <View style={[styles.indicatorLine, { marginTop: ITEM_HEIGHT + 20 }]} />
        </View>

        <Animated.FlatList
          ref={flatListRef}
          data={AGES}
          renderItem={({ item, index }) => (
            <AgeItem
              item={item}
              index={index}
              scrollY={scrollY}
              isSelected={selectedAge === item}
              onSelect={handleSelect}
            />
          )}
          keyExtractor={(item) => item}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onScroll={onScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          getItemLayout={(_, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
          })}
          contentContainerStyle={{
            paddingVertical: ITEM_HEIGHT * 2,
          }}
        />
      </View>

      <View style={styles.footer}>
        <View style={styles.confirmButton}>
          <LinearGradient
            colors={['#C5A059', '#800000']}
            style={styles.confirmGradient}
          >
            <Text style={styles.confirmText}>CONFIRM AGE: {selectedAge}</Text>
          </LinearGradient>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingTop: 60,
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    color: '#C5A059',
    fontSize: 28,
    fontFamily: 'BebasNeue-Bold',
    letterSpacing: 2,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    marginTop: 5,
  },
  pickerContainer: {
    height: ITEM_HEIGHT * 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorContainer: {
    position: 'absolute',
    top: ITEM_HEIGHT * 2 - 10,
    width: width * 0.8,
    zIndex: 1,
  },
  indicatorLine: {
    height: 2,
    backgroundColor: '#C5A059',
    width: '100%',
    opacity: 0.3,
  },
  itemContainer: {
    height: ITEM_HEIGHT,
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    width: width * 0.5,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  selectedItem: {
    borderWidth: 0,
    elevation: 10,
    shadowColor: '#800000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  gradient: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  text: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 24,
    fontWeight: '600',
  },
  selectedText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  subText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  footer: {
    marginTop: 60,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  confirmButton: {
    width: '100%',
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
  },
  confirmGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});