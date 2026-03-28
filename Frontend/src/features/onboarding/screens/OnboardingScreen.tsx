import React, { useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  Image, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../../shared/components/Button';

const { width, height } = Dimensions.get('window');

const onboardingData = [
  {
    id: '1',
    title: 'Healthcare Made Easy',
    description: 'Choose from a wide range of specialists and book appointments with ease. Personalized care is just a click away.',
    image: require('../../../assets/images/onboarding1.png'), // Generated image
  },
  {
    id: '2',
    title: 'Here for You, Always',
    description: 'Save your test results, access prescriptions, get medication delivered, manage appointments — all in one place.',
    image: require('../../../assets/images/onboarding2.png'), // Generated image
  },
];

export const OnboardingScreen: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation<any>();

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.navigate('Welcome');
    }
  };

  const handleSkip = () => {
     navigation.navigate('Welcome');
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.slide}>
      <Image 
        source={item.image} 
        style={styles.image} 
        resizeMode="contain" 
      />
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity 
        style={styles.skipButton} 
        onPress={handleSkip}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const contentOffset = e.nativeEvent.contentOffset.x;
          const index = Math.round(contentOffset / width);
          setCurrentIndex(index);
        }}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.footer}>
        {/* Indicator dots */}
        <View style={styles.indicatorContainer}>
          {onboardingData.map((_, index) => (
            <View
              key={index.toString()}
              style={[
                styles.indicator,
                currentIndex === index ? styles.activeIndicator : styles.inactiveIndicator
              ]}
            />
          ))}
        </View>

        <Button
          title="Next"
          onPress={handleNext}
          style={styles.nextButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FEFE',
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 25,
    zIndex: 10,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#809191',
  },
  slide: {
    width,
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 60,
  },
  image: {
    width: width * 0.85,
    height: height * 0.45,
    marginBottom: 40,
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#242424',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'System', // Outfit-like appearance
  },
  description: {
    fontSize: 17,
    fontWeight: '400',
    color: '#717171',
    textAlign: 'center',
    lineHeight: 25,
    fontFamily: 'System',
  },
  footer: {
    paddingHorizontal: 30,
    marginBottom: 40,
    alignItems: 'center',
  },
  indicatorContainer: {
    flexDirection: 'row',
    marginBottom: 35,
  },
  indicator: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#306F6F',
    width: 24,
  },
  inactiveIndicator: {
    backgroundColor: '#E0E8E8',
    width: 8,
  },
  nextButton: {
    width: '100%',
  },
});
