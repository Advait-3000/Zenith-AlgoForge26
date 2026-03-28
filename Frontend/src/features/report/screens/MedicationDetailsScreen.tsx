import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  Modal 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  Share2, 
  HandHelping, 
  Calendar, 
  Pill, 
  Activity, 
  User,
  CheckCircle2
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../../shared/components/Button';

const { width } = Dimensions.get('window');

const MED_DETAILS = {
  name: 'Amoxicillin',
  duration: '14 May - 30 May, 2024',
  dosage: '1 capsule (250mg)',
  frequency: 'Once, Every day',
  prescribedBy: 'Dr. Mia Miller',
  specialInstructions: [
    'Take with food to avoid stomach upset.',
    'Do not skip doses, even if symptoms improve.',
  ],
  storage: [
    'Store at room temperature, away from moisture and sunlight.'
  ],
  sideEffects: [
    'Possible nausea, diarrhea, or mild rash. Contact your doctor if severe.'
  ],
  allergyWarning: [
    'Avoid if allergic to penicillin or similar antibiotics.'
  ]
};

export const MedicationDetailsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    // Simulated download logic
    setDownloaded(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft color="#717171" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Medication Details</Text>
        <TouchableOpacity style={styles.backBtn}>
          <Share2 color="#717171" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Main Card */}
        <View style={styles.mainCard}>
          <View style={styles.detailRow}>
             <View style={styles.labelContainer}>
                <HandHelping color="#306F6F" size={22} />
                <Text style={styles.label}>Name:</Text>
             </View>
             <Text style={styles.value}>{MED_DETAILS.name}</Text>
          </View>
          <View style={styles.detailRow}>
             <View style={styles.labelContainer}>
                <Calendar color="#306F6F" size={22} />
                <Text style={styles.label}>Duration:</Text>
             </View>
             <Text style={styles.value}>{MED_DETAILS.duration}</Text>
          </View>
          <View style={styles.detailRow}>
             <View style={styles.labelContainer}>
                <Pill color="#306F6F" size={22} />
                <Text style={styles.label}>Dosage:</Text>
             </View>
             <Text style={styles.value}>{MED_DETAILS.dosage}</Text>
          </View>
          <View style={styles.detailRow}>
             <View style={styles.labelContainer}>
                <Activity color="#306F6F" size={22} />
                <Text style={styles.label}>Frequency:</Text>
             </View>
             <Text style={styles.value}>{MED_DETAILS.frequency}</Text>
          </View>
          <View style={styles.detailRow}>
             <View style={styles.labelContainer}>
                <User color="#306F6F" size={22} />
                <Text style={styles.label}>Prescribed by:</Text>
             </View>
             <TouchableOpacity onPress={() => navigation.navigate('DoctorProfile', { doctorId: '1' })}>
                <Text style={[styles.value, styles.link]}>{MED_DETAILS.prescribedBy}</Text>
             </TouchableOpacity>
          </View>
        </View>

        {/* Instructions Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Instructions:</Text>
          {MED_DETAILS.specialInstructions.map((text, i) => (
             <View key={i} style={styles.bulletRow}>
                <View style={styles.bullet} />
                <Text style={styles.instructionText}>{text}</Text>
             </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Storage:</Text>
          <View style={styles.bulletRow}>
             <View style={styles.bullet} />
             <Text style={styles.instructionText}>{MED_DETAILS.storage[0]}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Side Effects:</Text>
          <View style={styles.bulletRow}>
             <View style={styles.bullet} />
             <Text style={styles.instructionText}>{MED_DETAILS.sideEffects[0]}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Allergy Warning:</Text>
          <View style={styles.bulletRow}>
             <View style={styles.bullet} />
             <Text style={styles.instructionText}>{MED_DETAILS.allergyWarning[0]}</Text>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Persistent Button */}
      <View style={styles.footer}>
        <Button 
          title="Download Prescription PDF" 
          onPress={handleDownload} 
        />
      </View>

      {/* Downloaded Modal */}
      <Modal visible={downloaded} transparent animationType="fade">
         <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
               <View style={styles.checkCircle}>
                  <CheckCircle2 color="#306F6F" size={40} />
               </View>
               <Text style={styles.modalTitle}>Successfully downloaded</Text>
               <Text style={styles.modalDesc}>Prescription PDF downloaded. Keep it handy for your records or pharmacy visits.</Text>
               <TouchableOpacity style={styles.closeBtn} onPress={() => setDownloaded(false)}>
                  <Text style={styles.closeText}>Great!</Text>
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
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    color: '#333333',
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 24,
    marginBottom: 35,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 15,
    elevation: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#717171',
    marginLeft: 10,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'right',
    flex: 1,
    marginLeft: 10,
  },
  link: {
    color: '#306F6F',
    textDecorationLine: 'underline',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 15,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingRight: 20,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#306F6F',
    marginTop: 8,
    marginRight: 15,
  },
  instructionText: {
    fontSize: 16,
    color: '#717171',
    lineHeight: 24,
    flex: 1,
  },
  footer: {
    padding: 24,
    backgroundColor: '#F7FEFE',
    borderTopWidth: 1,
    borderTopColor: '#EAF9F9',
  },
  bottomSpacer: {
    height: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: width * 0.85,
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    padding: 30,
    alignItems: 'center',
  },
  checkCircle: {
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
    marginBottom: 12,
    textAlign: 'center',
  },
  modalDesc: {
    fontSize: 16,
    color: '#717171',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  closeBtn: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    backgroundColor: '#306F6F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
