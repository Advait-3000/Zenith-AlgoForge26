import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pill, Microscope, Activity, FileText, MoveUpRight, Search, ChevronRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: '1', titleKey: 'records.categories.prescriptions', icon: Pill, color: '#FF7D52', bgColor: '#FFF2EE', route: 'Prescriptions' },
  { id: '2', titleKey: 'records.categories.labReports', icon: Microscope, color: '#306F6F', bgColor: '#EAF9F9', route: 'LabReports' },
  { id: '3', titleKey: 'records.categories.healthMetrics', icon: Activity, color: '#4A90E2', bgColor: '#EBF4FF', route: 'HealthMetrics' },
  { id: '4', titleKey: 'records.categories.visitSummaries', icon: FileText, color: '#FBB03B', bgColor: '#FFF7E6', route: 'VisitSummaries' },
];

const RECENT_REPORTS = [
  { id: '1', nameKey: 'records.reportNames.bloodTest', date: 'Feb 24, 2024', typeKey: 'records.reportTypes.lab' },
  { id: '2', nameKey: 'records.reportNames.dental', date: 'Jan 15, 2024', typeKey: 'records.reportTypes.clinical' },
];

export const MedicalRecordsScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{t('records.title')}</Text>

        <View style={styles.searchContainer}>
          <Search stroke="#A0A0A0" size={20} />
          <TextInput 
            style={styles.searchInput}
            placeholder={t('records.searchPlaceholder')}
            placeholderTextColor="#A0A0A0"
          />
        </View>

        <View style={styles.grid}>
          {CATEGORIES.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.card}
              onPress={() => navigation.navigate(item.route)}
            >
              <View style={[styles.iconContainer, { backgroundColor: item.bgColor }]}>
                 <item.icon stroke={item.color} size={32} />
              </View>
              <View style={styles.cardText}>
                 <Text style={styles.cardTitle}>{t(item.titleKey)}</Text>
                 <Text style={styles.cardSubtitle}>{t('records.categories.viewAll')}</Text>
              </View>
              <View style={styles.arrowBtn}>
                <MoveUpRight stroke="#FFFFFF" size={20} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.recentHeader}>
           <Text style={styles.sectionTitle}>{t('records.recent.title')}</Text>
           <TouchableOpacity><Text style={styles.seeAll}>{t('records.recent.seeAll')}</Text></TouchableOpacity>
        </View>

        {RECENT_REPORTS.map(report => (
          <TouchableOpacity key={report.id} style={styles.reportRow}>
             <View style={styles.reportIconBox}>
                <FileText stroke="#306F6F" size={22} />
             </View>
             <View style={styles.reportInfo}>
                <Text style={styles.reportName}>{t(report.nameKey)}</Text>
                <Text style={styles.reportMeta}>{t(report.typeKey)} • {report.date}</Text>
             </View>
             <ChevronRight stroke="#E0E8E8" size={20} />
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 25,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    height: 56,
    borderRadius: 28,
    paddingHorizontal: 20,
    marginBottom: 30,
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  card: {
    width: (width - 64) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 16,
    marginBottom: 35,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardText: {
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#A0A0A0',
    marginTop: 2,
  },
  arrowBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#306F6F',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: -18,
    alignSelf: 'center',
    left: '50%',
    marginLeft: 0, // Manual centering helper
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
  },
  seeAll: {
    fontSize: 15,
    color: '#306F6F',
    fontWeight: '600',
  },
  reportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 24,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  reportIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EAF9F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  reportInfo: {
    flex: 1,
  },
  reportName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  reportMeta: {
    fontSize: 13,
    color: '#717171',
    marginTop: 2,
  },
  bottomSpacer: {
    height: 100,
  },
});



