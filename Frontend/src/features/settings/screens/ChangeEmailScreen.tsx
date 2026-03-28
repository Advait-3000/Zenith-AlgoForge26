import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export const ChangeEmailScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const currentEmail = "alex.john78examplemail.com";

  const handleSendCode = () => {
    // Navigate to verify screen with the new email
    navigation.navigate('VerifyChangeEmail', { email });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <ArrowLeft color="#717171" size={24} />
            </TouchableOpacity>
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, styles.activeProgress]} />
              <View style={styles.progressBar} />
            </View>
            <View style={{ width: 44 }} />
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title}>Change email</Text>
            <Text style={styles.subtitle}>
              Your current email is <Text style={styles.boldText}>{currentEmail}</Text>. To verify your new address, we'll send you a 4-digit code. Please enter the code to complete verification
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="alex.johnson5679examplemail.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity 
              style={[styles.button, !email && styles.buttonDisabled]} 
              onPress={handleSendCode}
              disabled={!email}
            >
              <Text style={styles.buttonText}>Send code</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FEFE',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  boldText: {
    fontWeight: '700',
    color: '#333333',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#FFFFFF',
    height: 64,
    borderRadius: 32,
    paddingHorizontal: 24,
    fontSize: 16,
    color: '#333333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  footer: {
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
});
