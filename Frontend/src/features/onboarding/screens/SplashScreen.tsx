import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  Image, 
  Animated 
} from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export const SplashScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in text after a short delay
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      delay: 500,
      useNativeDriver: true,
    }).start();

    // Navigate to Onboarding after animation
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 3500);

    return () => clearTimeout(timer);
  }, [fadeAnim, navigation]);

  return (
    <View style={styles.container}>
      {/* Background stays light teal/white */}
      <View style={styles.logoContainer}>
        {/*
          Lottie Animation for Splash
          The user mentioned having splash.json for it.
          Assuming it will be placed in assets/lottie/splash.json
        */}
        <LottieView
          source={require('@/assets/animation/clone.json')}
          autoPlay
          loop={false}
          style={styles.lottie}
          // Error handling for missing file
          onAnimationFailure={(error) => {
             console.log('Lottie Animation Failure:', error);
          }}
        />
        
        {/* App Name CURA */}
        <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
          <Text style={styles.appName}>CURA</Text>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FEFE', // Extremely light teal background
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottie: {
    width: width * 0.6,
    height: width * 0.6,
  },
  textContainer: {
    marginTop: 20,
  },
  appName: {
    fontSize: 56,
    fontWeight: '700',
    color: '#306F6F', // Matching the teal in the Wellio screenshot
    letterSpacing: 2,
  },
});
