import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { SafeAreaView } from 'react-native-safe-area-context';

export const ResetPasswordScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const isFormValid = password.length >= 8 && password === repeatPassword;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft stroke="#212121" size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Enter new password</Text>

          <View style={styles.inputGap}>
            <Input
              label="Password"
              placeholder="Enter new password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              icon={
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff stroke="#A0A0A0" size={20} /> : <Eye stroke="#A0A0A0" size={20} />}
                </TouchableOpacity>
              }
            />
          </View>

          <Input
            label="Repeat password"
            placeholder="Enter new password again"
            secureTextEntry={!showRepeatPassword}
            value={repeatPassword}
            onChangeText={setRepeatPassword}
            icon={
              <TouchableOpacity onPress={() => setShowRepeatPassword(!showRepeatPassword)}>
                {showRepeatPassword ? <EyeOff stroke="#A0A0A0" size={20} /> : <Eye stroke="#A0A0A0" size={20} />}
              </TouchableOpacity>
            }
          />
        </View>

        <View style={styles.footer}>
          <Button
            title="Save password"
            disabled={!isFormValid}
            onPress={() => {
              console.log('Password updated');
              navigation.replace('Login');
            }}
          />
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
  content: {
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 40,
  },
  inputGap: {
    marginBottom: 10,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
    marginTop: 'auto',
  },
});

