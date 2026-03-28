import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { Button } from '../../../shared/components/Button';
import { SafeAreaView } from 'react-native-safe-area-context';

export const OtpVerificationScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(59);
  const inputs = useRef<any>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus logic
    if (value && index < 3) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const isFormValid = otp.every(v => v !== '');

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

        <View style={styles.content}>
          <Text style={styles.title}>Code sent to email</Text>
          <Text style={styles.subtitle}>
            A verification code has been sent to your email. Please enter it to verify your profile.
          </Text>

          <View style={styles.otpContainer}>
            {otp.map((val, i) => (
              <View key={i} style={styles.otpInputBox}>
                <TextInput
                  ref={el => { inputs.current[i] = el; }}
                  style={styles.otpInput}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={val}
                  onChangeText={v => handleOtpChange(v, i)}
                  onKeyPress={e => handleKeyPress(e, i)}
                />
              </View>
            ))}
          </View>

          <Text style={styles.timerText}>
            This OTP will be available during 00:{timer < 10 ? `0${timer}` : timer}sec
          </Text>
        </View>

        <View style={styles.footer}>
          <Button
            title="Confirm"
            disabled={!isFormValid}
            onPress={() => navigation.navigate('VerifiedSuccess')}
          />
          <TouchableOpacity style={styles.resendButton}>
            <Text style={styles.resendText}>Resend code</Text>
          </TouchableOpacity>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  subtitle: {
    fontSize: 16,
    color: '#717171',
    lineHeight: 22,
    marginBottom: 40,
    alignSelf: 'flex-start',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 40,
  },
  otpInputBox: {
    width: 65,
    height: 65,
    borderRadius: 16,
    backgroundColor: '#F7F9F9',
    borderColor: '#306F6F',
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpInput: {
    fontSize: 28,
    fontWeight: '700',
    color: '#212121',
    textAlign: 'center',
    width: '100%',
  },
  timerText: {
    fontSize: 16,
    color: '#717171',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 10,
    paddingTop: 10,
    marginTop: 'auto',
  },
  resendButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  resendText: {
    fontSize: 16,
    color: '#306F6F',
    fontWeight: '600',
  },
});
