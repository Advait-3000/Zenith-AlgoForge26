import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  Dimensions, 
  SafeAreaView 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../../shared/components/Button';

const { width, height } = Dimensions.get('window');

export const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image 
          source={require('../../../assets/images/welcome.png')} 
          style={styles.image} 
          resizeMode="contain" 
        />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Welcome to CURA!</Text>
        <Text style={styles.description}>Connect with doctors, manage appointments, access care whenever you need it.</Text>
        
        <View style={styles.buttonGroup}>
          <Button
            title="Create an account"
            onPress={() => {
              // Navigate to registration when ready
              console.log('Navigate to Registration');
            }}
            variant="primary"
          />
          <Button
            title="Log in"
            onPress={() => {
              // Navigate to login when ready
              console.log('Navigate to Login');
            }}
            variant="outline"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FEFE',
  },
  imageContainer: {
    height: height * 0.45,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  image: {
    width: width * 0.85,
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#242424',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'System',
  },
  description: {
    fontSize: 18,
    fontWeight: '400',
    color: '#717171',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 40,
    fontFamily: 'System',
  },
  buttonGroup: {
    width: '100%',
    gap: 12,
  },
});
