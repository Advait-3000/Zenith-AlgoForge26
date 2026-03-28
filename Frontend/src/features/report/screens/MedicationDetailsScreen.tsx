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
import { useTranslation } from 'react-i18next';
import { Button } from '../../../shared/components/Button';

const { width } = Dimensions.get('window');

const MED_DETAILS = {
  name: 'Amoxicillin',
  duration: '14 May - 30 May, 2024',
  dosage: '1 capsule (250mg)',
  prescribedBy: 'Dr. Mia Miller',
};

export const MedicationDetailsScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const [downloaded, setDownloaded] = useState(false);

  // Safely get robust array translations from i18n
  const specialInstructions = t('medicationDetails.mockData.specialInstructions', { returnObjects: true }) as string[];

  const handleDownload = () => {
    // Simulated download logic
    setDownloaded(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft stroke="#717171" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('medicationDetails.title')}</Text>
        <TouchableOpacity style={styles.backBtn}>
          <Share2 stroke="#717171" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Main Card */}
        <View style={styles.mainCard}>
          <View style={styles.detailRow}>
             <View style={styles.labelContainer}>
                <HandHelping stroke="#306F6F" size={22} />
                <Text style={styles.label}>{t('medicationDetails.fields.name')}</Text>
             </View>
             <Text style={styles.value}>{MED_DETAILS.name}</Text>
          </View>
          <View style={styles.detailRow}>
             <View style={styles.labelContainer}>
                <Calendar stroke="#306F6F" size={22} />
                <Text style={styles.label}>{t('medicationDetails.fields.duration')}</Text>
             </View>
             <Text style={styles.value}>{MED_DETAILS.duration}</Text>
          </View>
          <View style={styles.detailRow}>
             <View style={styles.labelContainer}>
                <Pill stroke="#306F6F" size={22} />
                <Text style={styles.label}>{t('medicationDetails.fields.dosage')}</Text>
             </View>
             <Text style={styles.value}>{MED_DETAILS.dosage}</Text>
          </View>
          <View style={styles.detailRow}>
             <View style={styles.labelContainer}>
                <Activity stroke="#306F6F" size={22} />
                <Text style={styles.label}>{t('medicationDetails.fields.frequency')}</Text>
             </View>
             <Text style={styles.value}>{t('medicationDetails.mockData.frequency')}</Text>
          </View>
          <View style={styles.detailRow}>
             <View style={styles.labelContainer}>
                <User stroke="#306F6F" size={22} />
                <Text style={styles.label}>{t('medicationDetails.fields.prescribedBy')}</Text>
             </View>
             <TouchableOpacity onPress={() => navigation.navigate('DoctorProfile', { doctorId: '1' })}>
                <Text style={[styles.value, styles.link]}>{MED_DETAILS.prescribedBy}</Text>
             </TouchableOpacity>
          </View>
        </View>

        {/* Instructions Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('medicationDetails.sections.specialInstructions')}</Text>
          {Array.isArray(specialInstructions) && specialInstructions.map((text: string, i: number) => (
             <View key={i} style={styles.bulletRow}>
                <View style={styles.bullet} />
                <Text style={styles.instructionText}>{text}</Text>
             </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('medicationDetails.sections.storage')}</Text>
          <View style={styles.bulletRow}>
             <View style={styles.bullet} />
             <Text style={styles.instructionText}>{t('medicationDetails.mockData.storage')}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('medicationDetails.sections.sideEffects')}</Text>
          <View style={styles.bulletRow}>
             <View style={styles.bullet} />
             <Text style={styles.instructionText}>{t('medicationDetails.mockData.sideEffects')}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('medicationDetails.sections.allergyWarning')}</Text>
          <View style={styles.bulletRow}>
             <View style={styles.bullet} />
             <Text style={styles.instructionText}>{t('medicationDetails.mockData.allergyWarning')}</Text>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Persistent Button */}
      <View style={styles.footer}>
        <Button 
          title={t('medicationDetails.actions.downloadPdf')} 
          onPress={handleDownload} 
        />
      </View>

      {/* Downloaded Modal */}
      <Modal visible={downloaded} transparent animationType="fade">
         <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
               <View style={styles.checkCircle}>
                  <CheckCircle2 stroke="#306F6F" size={40} />
               </View>
               <Text style={styles.modalTitle}>{t('medicationDetails.modal.title')}</Text>
               <Text style={styles.modalDesc}>{t('medicationDetails.modal.desc')}</Text>
               <TouchableOpacity style={styles.closeBtn} onPress={() => setDownloaded(false)}>
                  <Text style={styles.closeText}>{t('medicationDetails.modal.button')}</Text>
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


