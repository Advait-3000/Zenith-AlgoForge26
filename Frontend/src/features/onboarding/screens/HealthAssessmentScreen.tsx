import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Droplets } from 'lucide-react-native';
import { ProgressBar } from '../../../shared/components/ProgressBar';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const BLOOD_TYPES = ['O (I)', 'A (II)', 'B (III)', 'AB (IV)'];

export const HealthAssessmentScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [bloodType, setBloodType] = useState('');
  const [rhFactor, setRhFactor] = useState('');
  const [formData, setFormData] = useState({
    allergies: '',
    chronicConditions: '',
    height: '',
    weight: '',
    systolic: '',
    diastolic: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = bloodType && rhFactor && formData.height && formData.weight;

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
          <ProgressBar totalSteps={6} currentStep={3} />
          <TouchableOpacity onPress={() => navigation.navigate('LifestyleInfo')}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Health Assessment</Text>
          <Text style={styles.subtitle}>Providing this data helps the doctor customize your treatment and ensure precise care.</Text>

          <Text style={styles.label}>Blood type</Text>
          <View style={styles.bloodTypeGrid}>
            {BLOOD_TYPES.map((type) => {
              const isActive = bloodType === type;
              return (
                <TouchableOpacity 
                  key={type} 
                  style={[styles.bloodTypeCard, isActive && styles.activeCard]}
                  onPress={() => setBloodType(type)}
                >
                  <Droplets stroke={isActive ? '#FFFFFF' : '#306F6F'} size={28} />
                  <Text style={[styles.bloodTypeText, isActive && styles.activeCardText]}>{type}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.rhRow}>
            {['Rh +', 'Rh —'].map((rh) => {
              const isActive = rhFactor === rh;
              return (
                <TouchableOpacity 
                  key={rh} 
                  style={[styles.rhCard, isActive && styles.activeCard]}
                  onPress={() => setRhFactor(rh)}
                >
                  <Text style={[styles.rhText, isActive && styles.activeCardText]}>{rh}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Input
            label="Allergies"
            placeholder="Enter your allergies"
            value={formData.allergies}
            onChangeText={(v) => handleInputChange('allergies', v)}
          />

          <Input
            label="Chronic conditions"
            placeholder="Enter your chronic conditions"
            value={formData.chronicConditions}
            onChangeText={(v) => handleInputChange('chronicConditions', v)}
          />

          <View style={styles.sideBySide}>
            <View style={{ flex: 1, marginRight: 16 }}>
              <Input
                label="Your height (sm)"
                placeholder="Enter your height"
                keyboardType="numeric"
                value={formData.height}
                onChangeText={(v) => handleInputChange('height', v)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Input
                label="Your weight (kg)"
                placeholder="Enter your weight"
                keyboardType="numeric"
                value={formData.weight}
                onChangeText={(v) => handleInputChange('weight', v)}
              />
            </View>
          </View>

          <Text style={styles.label}>Blood pressure (mmHg)</Text>
          <View style={styles.bpRow}>
            <View style={{ flex: 1 }}>
               <Input
                 placeholder="00"
                 keyboardType="numeric"
                 value={formData.systolic}
                 onChangeText={(v) => handleInputChange('systolic', v)}
               />
            </View>
            <Text style={styles.bpSeparator}>/</Text>
            <View style={{ flex: 1 }}>
               <Input
                 placeholder="00"
                 keyboardType="numeric"
                 value={formData.diastolic}
                 onChangeText={(v) => handleInputChange('diastolic', v)}
               />
            </View>
          </View>

          <View style={styles.footerSpacer} />
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Next"
            disabled={!isFormValid}
            onPress={() => {
              console.log('Health data collected');
              navigation.navigate('LifestyleInfo');
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
    justifyContent: 'space-between',
  },
  skipText: {
    fontSize: 16,
    color: '#306F6F',
    fontWeight: '600',
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
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212121',
    marginBottom: 18,
  },
  bloodTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  bloodTypeCard: {
    width: (width - 64) / 4,
    height: 90,
    backgroundColor: '#F7F9F9',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  rhRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  rhCard: {
    flex: 0.48,
    height: 58,
    backgroundColor: '#F7F9F9',
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeCard: {
    backgroundColor: '#306F6F',
  },
  bloodTypeText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#212121',
    marginTop: 8,
  },
  rhText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#212121',
  },
  activeCardText: {
    color: '#FFFFFF',
  },
  sideBySide: {
    flexDirection: 'row',
    width: '100%',
  },
  bpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  bpSeparator: {
    fontSize: 24,
    color: '#BDBDBD',
    marginHorizontal: 12,
    marginBottom: 16,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
  },
  footerSpacer: {
    height: 20,
  },
});


