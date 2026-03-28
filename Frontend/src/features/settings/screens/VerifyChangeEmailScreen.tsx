import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  Modal, 
  Dimensions,
  LayoutAnimation,
  Platform,
  UIManager
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Check } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');

export const VerifyChangeEmailScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { email } = route.params || {};

  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(59);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const inputs = useRef<TextInput[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 3) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleVerify = () => {
    // Simulate verification
    setShowSuccessModal(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    navigation.navigate('Main'); // Or back to profile
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `00:${s.toString().padStart(2, '0')}sec`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft color="#717171" size={24} />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, styles.activeProgress]} />
          <View style={[styles.progressBar, styles.activeProgress]} />
        </View>
        <View style={{ width: 44 }} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Enter the 4-digit code</Text>
        <Text style={styles.subtitle}>Code sent to your email. Check your inbox.</Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(el) => { if (el) inputs.current[index] = el; }}
              style={[styles.otpInput, digit !== '' && styles.otpInputActive]}
              maxLength={1}
              keyboardType="number-pad"
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              textAlign="center"
              placeholderTextColor="#A0A0A0"
            />
          ))}
        </View>

        <Text style={styles.timerText}>
          This OTP will be available during <Text style={styles.timerBold}>{formatTimer(timer)}</Text>
        </Text>

        <TouchableOpacity 
          style={styles.resendBtn} 
          onPress={() => setTimer(59)}
          disabled={timer > 0}
        >
          <Text style={[styles.resendText, timer > 0 && styles.resendDisabled]}>Resend code</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.button, otp.some(d => !d) && styles.buttonDisabled]} 
          onPress={handleVerify}
          disabled={otp.some(d => !d)}
        >
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
      </View>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIconCircle}>
              <Check color="#306F6F" size={32} strokeWidth={3} />
            </View>
            <Text style={styles.modalTitle}>Successfully verified</Text>
            <Text style={styles.modalSubtitle}>Your email has been verified and linked to your profile.</Text>
            
            <TouchableOpacity style={styles.continueBtn} onPress={handleCloseSuccess}>
              <Text style={styles.continueText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FEFE',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 15,
  },
  backBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  progressBar: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E7F5F5',
  },
  activeProgress: {
    backgroundColor: '#306F6F',
  },
  content: {
    marginTop: 30,
    paddingHorizontal: 24,
    flex: 1,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#717171',
    lineHeight: 24,
    marginBottom: 40,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  otpInput: {
    width: (width - 48 - 60) / 4,
    height: 64,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    fontSize: 28,
    fontWeight: '700',
    color: '#333333',
    borderWidth: 1,
    borderColor: '#E7F5F5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  otpInputActive: {
    borderColor: '#306F6F',
  },
  timerText: {
    fontSize: 16,
    color: '#717171',
    textAlign: 'center',
    marginBottom: 30,
  },
  timerBold: {
    fontWeight: '700',
    color: '#333333',
  },
  resendBtn: {
    alignSelf: 'center',
  },
  resendText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#306F6F',
    textDecorationLine: 'underline',
  },
  resendDisabled: {
    opacity: 0.5,
    textDecorationLine: 'none',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 30,
    marginTop: 20,
  },
  button: {
    backgroundColor: '#306F6F',
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.85,
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    padding: 30,
    alignItems: 'center',
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EAF9F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#717171',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  continueBtn: {
    width: '100%',
    height: 60,
    borderRadius: 30,
    backgroundColor: '#306F6F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});
