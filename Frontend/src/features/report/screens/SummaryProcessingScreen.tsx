import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  Animated, 
  ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Sparkles,
  Search,
  BrainCircuit,
  FileCheck
} from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const LOADING_STEPS = [
  { id: '1', title: 'Extracting data via OCR...', color: '#306F6F', icon: Search },
  { id: '2', title: 'Analyzing clinical metrics...', color: '#4A90E2', icon: BrainCircuit },
  { id: '3', title: 'Generating summary report...', color: '#FBB03B', icon: FileCheck },
];

export const SummaryProcessingScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { files } = route.params || { files: [] };
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(1), 2000);
    const timer2 = setTimeout(() => setCurrentStep(2), 4000);
    const timer3 = setTimeout(() => navigation.navigate('MedicalPortfolio'), 6500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Sparkles stroke="#306F6F" size={64} strokeWidth={1.5} />
        </View>

        <Text style={styles.title}>Analyzing your reports</Text>
        <Text style={styles.subtitle}>Our AI is processing your {files.length} document{files.length !== 1 ? 's' : ''} to generate your medical summary.</Text>

        <View style={styles.stepsBox}>
          {LOADING_STEPS.map((step, index) => {
             const Icon = step.icon;
             const isActive = index === currentStep;
             const isDone = index < currentStep;

             return (
               <View key={step.id} style={styles.stepRow}>
                 <View style={[styles.stepIcon, isDone && styles.stepIconDone, isActive && styles.stepIconActive]}>
                    <Icon stroke={isActive || isDone ? '#FFFFFF' : '#A0A0A0'} size={20} />
                 </View>
                 <Text style={[styles.stepText, isActive && styles.stepTextActive, isDone && styles.stepTextDone]}>
                    {step.title}
                 </Text>
                 {isActive && <ActivityIndicator size="small" stroke="#306F6F" />}
               </View>
             );
          })}
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
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#306F6F',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#717171',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 50,
  },
  stepsBox: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 4,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F7FEFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  stepIconActive: {
    backgroundColor: '#306F6F',
  },
  stepIconDone: {
    backgroundColor: '#FBB03B',
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: '#A0A0A0',
  },
  stepTextActive: {
    color: '#333333',
    fontWeight: '700',
  },
  stepTextDone: {
    color: '#306F6F',
    fontWeight: '600',
  },
});


