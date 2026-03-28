import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../../shared/components/Button';
import { SafeAreaView } from 'react-native-safe-area-context';

// Placeholder for the illustration - I'll use the one I generated
const SUCCESS_IMAGE = require('../../../assets/images/createAccount.png');

export const VerifiedSuccessScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image 
            source={SUCCESS_IMAGE}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Successfully verified</Text>
        <Text style={styles.subtitle}>
          Fill in your personal information to simplify doctor communication, book appointments faster, and get personalized care.
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            title="Complete patient card"
            onPress={() => navigation.navigate('PersonalData')}
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  imageContainer: {
    width: '100%',
    height: 350,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#212121',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#717171',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 60,
  },
  buttonContainer: {
    width: '100%',
  },
});
