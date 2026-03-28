import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  ScrollView, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Check, Eye, EyeOff } from 'lucide-react-native';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { SafeAreaView } from 'react-native-safe-area-context';

export const CreateAccountScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Validation logic
  const isMinLength = password.length >= 8;
  const hasTwoNumbers = (password.match(/\d/g) || []).length >= 2;
  const hasUppercase = /[A-Z]/.test(password);

  const isPasswordValid = isMinLength && hasTwoNumbers && hasUppercase;
  const isFormValid = email.includes('@') && isPasswordValid;

  const renderRequirement = (text: string, isValid: boolean) => (
    <View style={styles.requirementRow}>
      {isValid ? (
        <Check color="#306F6F" size={16} />
      ) : (
        <View style={styles.requirementBullet} />
      )}
      <Text style={[styles.requirementText, isValid && styles.validRequirement]}>
        {text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft color="#212121" size={24} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Create an account</Text>
          <Text style={styles.subtitle}>Excited to have you on board!</Text>

          <Input
            label="Email"
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <View style={styles.passwordContainer}>
              <Input
  label="Password"
  placeholder="Create password"
  secureTextEntry={!showPassword}
  value={password}
  onChangeText={setPassword}
  inputContainerStyle={
    password.length === 0
      ? undefined                              // untouched — no border
      : isPasswordValid
      ? styles.validBorder                     // all rules met — green
      : styles.errorBorder                     // rules failing — red
  }
  icon={
    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
      {showPassword
        ? <EyeOff color="#A0A0A0" size={20} />
        : <Eye color="#A0A0A0" size={20} />}
    </TouchableOpacity>
  }
/>
          </View>

          <View style={styles.requirementsContainer}>
            {renderRequirement('Min 8 characters length', isMinLength)}
            {renderRequirement('Min 2 number', hasTwoNumbers)}
            {renderRequirement('Min 1 uppercase letter', hasUppercase)}
          </View>

          <View style={styles.footerSpacer} />
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Create an account"
            disabled={!isFormValid}
            onPress={() => navigation.navigate('OtpVerification')}
          />
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FEFE',
  },
  header: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#717171',
    lineHeight: 22,
    marginBottom: 40,
  },
  passwordContainer: {
    marginTop: 10,
  },
  errorInput: {
    borderColor: '#FF7070',
    borderWidth: 1.5,
  },
  validInput: {
    borderColor: '#306F6F',
    borderWidth: 1.5,
  },
  errorBorder: {
  borderColor: '#FF7070',
  borderWidth: 1.5,
},
validBorder: {
  borderColor: '#306F6F',
  borderWidth: 1.5,
},
  requirementsContainer: {
    marginTop: 12,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#A0A0A0',
    marginLeft: 5,
    marginRight: 9,
  },
  requirementText: {
    fontSize: 14,
    color: '#A0A0A0',
    marginLeft: 8,
  },
  validRequirement: {
    color: '#306F6F',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 10,
    paddingTop: 2,
  },
  footerSpacer: {
    height: 20,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: 16,
    color: '#717171',
  },
  loginLink: {
    fontSize: 16,
    color: '#306F6F',
    fontWeight: '600',
  },
});
