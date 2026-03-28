import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  Dimensions, 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../shared/components/Button';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export const WelcomeScreen: React.FC = () => {
  const { t } = useTranslation();
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
        <Text style={styles.title}>{t('welcome.title')}</Text>
        <Text style={styles.description}>{t('welcome.description')}</Text>
        
        <View style={styles.buttonGroup}>
          <Button
            title={t('welcome.createAccount')}
            onPress={() => navigation.navigate('CreateAccount')}
            variant="primary"
          />
          <Button
            title={t('welcome.login')}
            onPress={() => navigation.navigate('Login')}
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
