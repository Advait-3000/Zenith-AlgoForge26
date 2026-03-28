import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  ScrollView, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { ProgressBar } from '../../../shared/components/ProgressBar';
import { Button } from '../../../shared/components/Button';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const SELECTION_OPTIONS = ['Yes', 'No', 'Occasionally'];
const ACTIVITY_LEVELS = [
  'Light (sports 1–3 days a week)',
  'Moderate (sports 3–5 days a week)',
  'Very Active (sports 6–7 days a week)'
];

export const LifestyleInfoScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [smoking, setSmoking] = useState('');
  const [alcohol, setAlcohol] = useState('');
  const [activityLevel, setActivityLevel] = useState('');

  const isFormValid = smoking && alcohol && activityLevel;

  const renderOptionGroup = (
    label: string, 
    options: string[], 
    currentValue: string, 
    onSelect: (val: string) => void
  ) => (
    <View style={styles.groupContainer}>
      <Text style={styles.groupLabel}>{label}</Text>
      <View style={styles.optionsRow}>
        {options.map((opt) => {
          const isActive = currentValue === opt;
          return (
            <TouchableOpacity
              key={opt}
              style={[
                styles.optionButton,
                isActive && styles.activeOption,
                opt === 'Occasionally' && { flex: 1.5 } // Wider for longer text
              ]}
              onPress={() => onSelect(opt)}
            >
              <Text style={[styles.optionText, isActive && styles.activeOptionText]}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color="#212121" size={24} />
        </TouchableOpacity>
        <ProgressBar totalSteps={6} currentStep={4} />
        <TouchableOpacity onPress={() => navigation.navigate('InsuranceInfo')}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Lyfestyle information</Text>
        <Text style={styles.subtitle}>Sharing lifestyle details helps doctors tailor advice and treatment to your health needs.</Text>

        {renderOptionGroup('Smoking', SELECTION_OPTIONS, smoking, setSmoking)}
        {renderOptionGroup('Alcohol', SELECTION_OPTIONS, alcohol, setAlcohol)}

        <View style={styles.groupContainer}>
          <Text style={styles.groupLabel}>Activity Level</Text>
          <View style={styles.verticalOptions}>
            {ACTIVITY_LEVELS.map((level) => {
              const isActive = activityLevel === level;
              return (
                <TouchableOpacity
                  key={level}
                  style={[styles.levelButton, isActive && styles.activeOption]}
                  onPress={() => setActivityLevel(level)}
                >
                  <Text style={[styles.optionText, isActive && styles.activeOptionText]}>{level}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.footerSpacer} />
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Next"
          disabled={!isFormValid}
          onPress={() => navigation.navigate('InsuranceInfo')}
        />
      </View>
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
  groupContainer: {
    marginBottom: 30,
  },
  groupLabel: {
    fontSize: 17,
    fontWeight: '500',
    color: '#212121',
    marginBottom: 16,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  optionButton: {
    flex: 1,
    height: 58,
    backgroundColor: '#F7F9F9',
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeOption: {
    backgroundColor: '#306F6F',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212121',
  },
  activeOptionText: {
    color: '#FFFFFF',
  },
  verticalOptions: {
    gap: 12,
  },
  levelButton: {
    width: '100%',
    height: 58,
    backgroundColor: '#F7F9F9',
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
  },
  footerSpacer: {
    height: 40,
  },
});
