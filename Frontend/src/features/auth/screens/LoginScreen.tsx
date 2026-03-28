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
import { ArrowLeft, Eye, EyeOff, ScanFace } from 'lucide-react-native';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { SafeAreaView } from 'react-native-safe-area-context';

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);

  // Validation logic
  const isEmailValid = email.includes('@');
  const isPasswordValid = password.length >= 8;
  const isFormValid = isEmailValid && isPasswordValid;

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
          <Text style={styles.title}>Log in</Text>
          <Text style={styles.subtitle}>Nice to have you back!</Text>

          <Input
            label="Email"
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            error={email.length > 0 && !isEmailValid ? 'Email must contain @' : undefined}
          />

          <View style={styles.passwordContainer}>
             <Input
                label="Password"
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                error={password.length > 0 && password.length < 8 ? 'Incorrect password. Please try again.' : undefined}
                icon={
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff color="#A0A0A0" size={20} /> : <Eye color="#A0A0A0" size={20} />}
                    </TouchableOpacity>
                }
              />
          </View>

          <TouchableOpacity 
            style={styles.forgotContainer}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>
{/* 
          <TouchableOpacity 
            style={styles.checkboxRow}
            onPress={() => setKeepSignedIn(!keepSignedIn)}
          >
            <View style={[styles.checkbox, keepSignedIn && styles.checkboxActive]}>
              {keepSignedIn && <View style={styles.checkboxCheck} />}
            </View>
            <Text style={styles.checkboxLabel}>Keep me signed in</Text>
          </TouchableOpacity> */}

          <View style={styles.footerSpacer} />
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Log in"
            disabled={!isFormValid}
            onPress={() => navigation.replace('Main')}
          />
          
          {/* <TouchableOpacity style={styles.faceIdContainer}>
             <View style={styles.faceIdIconBox}>
                <ScanFace color="#A0A0A0" size={48} />
             </View>
             <Text style={styles.faceIdText}>Face ID</Text>
          </TouchableOpacity> */}

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Are you new here? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('CreateAccount')}>
              <Text style={styles.registerLink}>Create account</Text>
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
  forgotContainer: {
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  forgotText: {
    fontSize: 16,
    color: '#306F6F',
    fontWeight: '600',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#306F6F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxActive: {
    backgroundColor: '#306F6F',
  },
  checkboxCheck: {
    width: 10,
    height: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#717171',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 10,
    paddingTop: 10,
  },
  footerSpacer: {
    height: 20,
  },
  faceIdContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  faceIdIconBox: {
    marginBottom: 8,
  },
  faceIdText: {
    fontSize: 16,
    color: '#717171',
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  registerText: {
    fontSize: 16,
    color: '#717171',
  },
  registerLink: {
    fontSize: 16,
    color: '#306F6F',
    fontWeight: '600',
  },
});
