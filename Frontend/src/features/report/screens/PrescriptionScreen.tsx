import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  TextInput 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  Search, 
  ArrowUpDown, 
  Settings2, 
  MoreVertical,
  HandHelping
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const ACTUAL_PRESCRIPTIONS = [
  { id: '1', name: 'Amoxicillin 250mg', desc: 'Antibiotic for bacterial infections', dosage: '14 capsules', duration: '14 - 30 May, 2024', color: '#EAF9F9' },
  { id: '2', name: 'Lisinopril 10mg', desc: 'ACE inhibitors', dosage: '18 tablets', duration: '11 - 30 April, 2024', color: '#FFF7E6' },
  { id: '3', name: 'Metformin 500mg', desc: 'ACE inhibitors', dosage: '14 capsules', duration: '14 - 30 March, 2024', color: '#EAF9F9' },
  { id: '4', name: 'Metformin 500mg', desc: 'ACE inhibitors', dosage: '14 capsules', duration: '14 - 30 March, 2024', color: '#EAF9F9' },
];

const HISTORY_PRESCRIPTIONS = [
  { id: '5', name: 'Amoxicillin 250mg', desc: 'Antibiotic for bacterial infections', dosage: '14 capsules', duration: '14 - 30 May, 2023', color: '#FFEBEE' },
  { id: '6', name: 'Lisinopril 10mg', desc: 'ACE inhibitors', dosage: '18 tablets', duration: '11 - 30 April, 2022', color: '#FFEBEE' },
];

export const PrescriptionScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState('Actual');

  const prescriptions = activeTab === 'Actual' ? ACTUAL_PRESCRIPTIONS : HISTORY_PRESCRIPTIONS;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft stroke="#717171" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('prescriptionsList.title')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <Search stroke="#A0A0A0" size={20} />
          <TextInput 
            style={styles.searchInput}
            placeholder={t('prescriptionsList.searchPlaceholder')}
            placeholderTextColor="#A0A0A0"
          />
        </View>

        {/* Tabs */}
        <View style={styles.tabBar}>
          {['Actual', 'History'].map(tab => (
            <TouchableOpacity 
              key={tab} 
              style={[styles.tabItem, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{t(`prescriptionsList.tabs.${tab.toLowerCase()}`)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Controls */}
        <View style={styles.controlsRow}>
          <View style={styles.sortBox}>
             <View style={styles.circularIcon}>
               <ArrowUpDown stroke="#717171" size={24} />
             </View>
             <Text style={styles.controlText}>{t('prescriptionsList.byDate')}</Text>
          </View>
          <TouchableOpacity style={styles.circularIcon}>
             <Settings2 stroke="#717171" size={24} />
          </TouchableOpacity>
        </View>

        {prescriptions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <HandHelping stroke="#306F6F" size={60} strokeWidth={1} />
            <Text style={styles.emptyTitle}>{t('prescriptionsList.empty.title')}</Text>
            <Text style={styles.emptySub}>{t('prescriptionsList.empty.desc')}</Text>
          </View>
        ) : (
          prescriptions.map(item => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.card}
              onPress={() => navigation.navigate('MedicationDetails', { id: item.id })}
            >
               <View style={styles.cardHeader}>
                  <View style={styles.iconBox}>
                     <HandHelping stroke="#306F6F" size={22} />
                  </View>
                  <View style={styles.mainInfo}>
                     <Text style={styles.medName}>{item.name}</Text>
                     <Text style={styles.medDesc}>{item.desc}</Text>
                  </View>
                  <TouchableOpacity style={styles.moreBtn}>
                     <MoreVertical stroke="#E0E8E8" size={20} />
                  </TouchableOpacity>
               </View>

               <View style={styles.badgeRow}>
                  <View style={styles.badge}>
                     <Text style={styles.badgeText}>{item.dosage}</Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: item.color }]}>
                     <Text style={styles.badgeText}>{item.duration}</Text>
                  </View>
               </View>
            </TouchableOpacity>
          ))
        )}
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
  placeholder: {
    width: 44,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    height: 56,
    borderRadius: 28,
    paddingHorizontal: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333333',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EAF9F9',
    marginBottom: 25,
  },
  tabItem: {
    flex: 1,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#306F6F',
  },
  tabText: {
    fontSize: 17,
    color: '#717171',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#333333',
    fontWeight: '700',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  sortBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circularIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  controlText: {
    marginLeft: 12,
    fontSize: 17,
    color: '#717171',
    fontWeight: '500',
  },
  card: {
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainInfo: {
    flex: 1,
    marginLeft: 10,
  },
  medName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
  },
  medDesc: {
    fontSize: 14,
    color: '#717171',
    marginTop: 2,
  },
  moreBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 10,
  },
  badge: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: '#F7FEFE',
  },
  badgeText: {
    fontSize: 14,
    color: '#717171',
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333333',
    marginTop: 30,
    marginBottom: 12,
  },
  emptySub: {
    fontSize: 16,
    color: '#717171',
    textAlign: 'center',
    lineHeight: 24,
  },
});


