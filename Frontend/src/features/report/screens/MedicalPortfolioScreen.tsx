import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  Image 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Calendar, 
  Clock, 
  Monitor, 
  MapPin, 
  FileText,
  Stethoscope,
  Activity,
  HandHelping,
  ChevronRight,
  Eye,
  MoreVertical,
  BriefcaseMedical,
  Thermometer,
  Wind,
  Heart
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const VITALS = [
  { id: '1', title: 'Heart rate', value: '77 bpm', icon: Heart, color: '#FF5252' },
  { id: '2', title: 'Blood pressure', value: '120/80', icon: Stethoscope, color: '#306F6F' },
  { id: '3', title: 'Oxygen', value: '97%', icon: Wind, color: '#4A90E2' },
  { id: '4', title: 'Temp', value: '98.6° F', icon: Thermometer, color: '#FBB03B' },
];

const EXAMINATIONS = [
  { id: '1', title: 'Complete Blood Count (CBC)', status: 'Normal Results', date: '02 Jan, 2024', color: '#306F6F' },
  { id: '2', title: 'Lipid Panel (Cardiovascular)', status: 'Normal Results', date: '05 Jan, 2024', color: '#306F6F' },
  { id: '3', title: 'Thyroid Function Test', status: 'Follow-Up Needed', date: '02 Jan, 2024', color: '#FF5252' },
];

const PRESCRIPTIONS = [
  { id: '1', name: 'Pulmolor 150mg', desc: 'Antibiotic for bacterial infections', dosage: '14 capsules', duration: '14 - 30 May, 2024' },
  { id: '2', name: 'Lisinopril 10mg', desc: 'ACE inhibitors', dosage: '18 tablets', duration: '11 - 30 April, 2024' },
];

const SYMPTOMS = ['Shortness of breath', 'Blue-tinged lips', 'Pain in the back', 'Pressure in the chest'];

export const MedicalPortfolioScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft color="#717171" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Medical Portfolio</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn}>
            <Download color="#717171" size={22} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Share2 color="#717171" size={22} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Patient Introduction */}
        <View style={styles.doctorBlock}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=200' }} 
            style={styles.doctorAvatar}
          />
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>John Doe</Text>
            <Text style={styles.doctorSpec}>34 Years • Male • B+ Blood Group</Text>
          </View>
        </View>

        {/* AI Insight Summary */}
        <View style={styles.aiBriefCard}>
           <BriefcaseMedical color="#FFFFFF" size={24} />
           <View style={styles.aiBriefContent}>
              <Text style={styles.aiBriefTitle}>AI Portfolio Insight</Text>
              <Text style={styles.aiBriefText}>Patient shows history of respiratory distress correlated with seasonal laboratory findings. Cardiovascular risk is currently low.</Text>
           </View>
        </View>

        {/* Vital Signs Grid */}
        <View style={styles.vitalsGrid}>
           {VITALS.map(vital => (
             <View key={vital.id} style={styles.vitalCard}>
                <View style={[styles.vitalIconBox, { backgroundColor: `${vital.color}10` }]}>
                   <vital.icon color={vital.color} size={20} />
                </View>
                <Text style={styles.vitalValue}>{vital.value}</Text>
                <Text style={styles.vitalTitle}>{vital.title}</Text>
             </View>
           ))}
        </View>

        {/* Clinical History & Reason */}
        <Text style={styles.sectionTitle}>Clinical History (Anamnesis)</Text>
        <View style={styles.pointSection}>
           <Text style={styles.pointText}>History of hypertension for 12 years, managed with medication. Diagnosed with type 2 diabetes 5 years ago. Family history includes recurring cardiovascular conditions.</Text>
        </View>

        {/* Symptoms & Signs */}
        <Text style={styles.sectionTitle}>Signs & Symptoms</Text>
        <View style={styles.pointSection}>
           <View style={styles.symptomGrid}>
              {SYMPTOMS.map(s => (
                <View key={s} style={styles.symptomBadge}>
                   <Text style={styles.symptomText}>{s}</Text>
                </View>
              ))}
           </View>
        </View>

        {/* AI Deduced Diagnosis */}
        <Text style={styles.sectionTitle}>AI Deduced Diagnosis</Text>
        <View style={[styles.pointSection, styles.diagnosisCard]}>
           <Stethoscope color="#306F6F" size={24} />
           <Text style={styles.diagnosisLarge}>Atrial Fibrillation (Paroxysmal)</Text>
        </View>

        {/* Examination Timeline */}
        <Text style={styles.sectionTitle}>Examination & Results Timeline</Text>
        {EXAMINATIONS.map(exam => (
          <View key={exam.id} style={styles.examCard}>
             <View style={styles.examCardTop}>
                <View style={styles.examInfo}>
                   <Text style={styles.examTitle}>{exam.title}</Text>
                   <Text style={styles.examMeta}>
                      {exam.date} • <Text style={{ color: exam.color }}>{exam.status}</Text>
                   </Text>
                </View>
                <TouchableOpacity style={styles.moreBtn}>
                   <MoreVertical color="#E0E8E8" size={20} />
                </TouchableOpacity>
             </View>
             
             <View style={styles.examActions}>
                <TouchableOpacity style={styles.viewBtn}>
                   <Eye color="#FFFFFF" size={16} />
                   <Text style={styles.btnText}>View report</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.downBtn}>
                   <Download color="#306F6F" size={16} />
                   <Text style={[styles.btnText, { color: '#306F6F' }]}>Download</Text>
                </TouchableOpacity>
             </View>
          </View>
        ))}

        {/* Management Plan & Prescriptions */}
        <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Management Plan</Text>
        <View style={styles.pointSection}>
           <Text style={styles.pointText}>Continue primary ACE inhibitor therapy. Recommend cardiovascular follow-up within 14 days based on symptoms.</Text>
        </View>

        <Text style={styles.sectionTitle}>Prescriptions</Text>
        {PRESCRIPTIONS.map(med => (
          <TouchableOpacity key={med.id} style={styles.medCard}>
             <View style={styles.medCardTop}>
                <View style={[styles.medIconBox, { backgroundColor: '#EAF9F9' }]}>
                   <HandHelping color="#306F6F" size={24} />
                </View>
                <View style={styles.medInfo}>
                   <Text style={styles.medName}>{med.name}</Text>
                   <Text style={styles.medDesc}>{med.desc}</Text>
                </View>
                <TouchableOpacity style={styles.moreBtn}>
                   <MoreVertical color="#E0E8E8" size={20} />
                </TouchableOpacity>
             </View>

             <View style={styles.medPills}>
                <View style={styles.medPill}><Text style={styles.medPillText}>{med.dosage}</Text></View>
                <View style={styles.medPill}><Text style={styles.medPillText}>{med.duration}</Text></View>
             </View>
          </TouchableOpacity>
        ))}

        <View style={styles.bottomSpacer} />
      </ScrollView>
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
  },
  headerTitle: {
    fontSize: 20,
    color: '#333333',
    fontWeight: '600',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  doctorBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  doctorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333333',
  },
  doctorSpec: {
    fontSize: 14,
    color: '#717171',
    marginTop: 4,
  },
  aiBriefCard: {
    backgroundColor: '#306F6F',
    borderRadius: 30,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  aiBriefContent: {
    flex: 1,
    marginLeft: 15,
  },
  aiBriefTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  aiBriefText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 35,
  },
  vitalCard: {
    width: (width - 60) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  vitalIconBox: {
    width: 44,
    height: 44,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  vitalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
  },
  vitalTitle: {
    fontSize: 12,
    color: '#717171',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 15,
    marginTop: 10,
  },
  pointSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  pointText: {
    fontSize: 15,
    color: '#717171',
    lineHeight: 22,
  },
  symptomGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  symptomBadge: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: '#EAF9F9',
  },
  symptomText: {
    fontSize: 14,
    color: '#306F6F',
    fontWeight: '600',
  },
  diagnosisCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  diagnosisLarge: {
    fontSize: 18,
    fontWeight: '700',
    color: '#306F6F',
    flex: 1,
  },
  examCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 4,
  },
  examCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  examInfo: {
    flex: 1,
  },
  examTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 6,
  },
  examMeta: {
    fontSize: 14,
    color: '#717171',
  },
  moreBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  examActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  viewBtn: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#306F6F',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  downBtn: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#306F6F',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
  },
  medCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  medCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  medIconBox: {
    width: 50,
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  medInfo: {
    flex: 1,
  },
  medName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333333',
  },
  medDesc: {
    fontSize: 14,
    color: '#717171',
    marginTop: 2,
  },
  medPills: {
    flexDirection: 'row',
    gap: 10,
  },
  medPill: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#F7FEFE',
    borderRadius: 18,
  },
  medPillText: {
    fontSize: 14,
    color: '#717171',
  },
  bottomSpacer: {
    height: 100,
  },
});
