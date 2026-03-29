import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Bell, 
  Search, 
  Star, 
  MoveUpRight, 
  Heart, 
  Wind, 
  Waves, 
  Activity, 
  ChevronRight, 
  Stethoscope,
  TrendingUp,
  Circle,
  LayoutGrid,
  Sparkles
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import { getLatestScanResult, getUserData, bookEmergencyAppointment } from '../../../shared/services/api';
import { Alert, ActivityIndicator } from 'react-native';
import { Power } from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Mock data
const DOCTORS = [
  { id: '1', name: 'Dr. Mia Miller', specialtyKey: 'neurologist', rating: 5.0, image: 'https://img.freepik.com/free-photo/pleased-young-female-doctor-white-coat-with-stethoscope-neck-standing-with-folded-arms-isolated-white-background_637285-3396.jpg' },
  { id: '2', name: 'Dr. Norah Still', specialtyKey: 'cardiologist', rating: 4.9, image: 'https://img.freepik.com/free-photo/front-view-young-female-doctor-medical-uniform-with-mask-due-covid-white-wall_140725-78482.jpg' },
  { id: '3', name: 'Dr. Helena Fox', specialtyKey: 'radiologist', rating: 4.8, image: 'https://img.freepik.com/free-photo/woman-doctor-wearing-lab-coat-with-stethoscope-isolated_1303-29791.jpg' },
  { id: '4', name: 'Dr. Andrew Miller', specialtyKey: 'neurologist', rating: 5.0, image: 'https://img.freepik.com/free-photo/handsome-young-male-doctor-with-stethoscope-standing-against-blue-background_23-2148127025.jpg' },
];

const SPECIALISATIONS = [
  { id: '1', nameKey: 'dentist', count: 21, icon: Stethoscope },
  { id: '2', nameKey: 'pulmonologist', count: 19, icon: Wind },
  { id: '3', nameKey: 'gastroenterologist', count: 8, icon: Waves },
  { id: '4', nameKey: 'cardiologist', count: 15, icon: Heart },
];

const MEDICAL_HISTORY = [
  { id: '1', diseaseKey: 'influenza', durationDays: 7, statusKey: 'recovered', date: 'Jan 2024', color: '#306F6F', secondary: '#EAF9F9' },
  { id: '2', diseaseKey: 'bronchitis', durationDays: 14, statusKey: 'recovered', date: 'Feb 2024', color: '#4A90E2', secondary: '#EBF4FF' },
  { id: '3', diseaseKey: 'headache', durationDays: 2, statusKey: 'active', date: 'Mar 2024', color: '#FBB03B', secondary: '#FFF7E6' },
];

const SERVICES = [
  { id: '1', nameKey: 'appointments' },
  { id: '2', nameKey: 'vaccination' },
  { id: '3', nameKey: 'faq' },
  { id: '4', nameKey: 'chat' },
];

export const HomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const [healthData, setHealthData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [userName, setUserName] = useState('User');
  const [isEmergencyLoading, setIsEmergencyLoading] = useState(false);

  // Load health data and user info on focus (so it refreshes after scanning)
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          const [scanResult, user] = await Promise.all([
            getLatestScanResult(),
            getUserData(),
          ]);
          setUserData(user);
          if (scanResult?.analysis) {
            setHealthData(scanResult.analysis);
          }
          if (user?.full_name) {
            setUserName(user.full_name.split(' ')[0]);
          }
        } catch (err) {
          console.warn('Failed to load health data:', err);
        }
      };
      loadData();
    }, [])
  );

  const handleEmergencySOS = async () => {
    if (isEmergencyLoading) return;
    
    Alert.alert(
      "CONFIRM EMERGENCY",
      "This will trigger an SOS alert to nearby hospitals and your emergency contacts. Proceed?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "YES, SOS", 
          style: "destructive",
          onPress: async () => {
            setIsEmergencyLoading(true);
            try {
              if (!userData) throw new Error("User data not loaded");
              
              // Get coordinates from user profile [lng, lat]
              const coords = userData.location_coordinates?.coordinates || [72.870968, 19.0460726];
              const lng = coords[0];
              const lat = coords[1];

              await bookEmergencyAppointment({
                patient_id: userData.id || userData._id,
                reason: "Emergency SOS: Immediate medical assistance required",
                lat,
                lng
              });

              Alert.alert("SOS Sent!", "Help is on the way. Emergency contacts notified via Twilio.");
            } catch (error: any) {
              Alert.alert("SOS Failed", error.message || "Could not trigger emergency protocol.");
            } finally {
              setIsEmergencyLoading(false);
            }
          }
        }
      ]
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#4ADE80';
    if (score >= 60) return '#FBB03B';
    return '#FF5252';
  };

  const renderHealthScore = () => {
    if (!healthData) return null;

    const score = parseInt(healthData.calculated_health_score) || 0;
    const scoreColor = getScoreColor(score);
    const concerns = healthData.primary_clinical_concerns || [];
    const stableSystems = healthData.stable_systems || [];

    return (
      <View style={styles.healthScoreContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Health Score</Text>
          <TouchableOpacity 
            style={styles.trendingBtn}
            onPress={() => navigation.navigate('HealthMetrics')}
          >
            <TrendingUp stroke="#306F6F" size={18} />
          </TouchableOpacity>
        </View>
        <View style={styles.healthScoreCard}>
          <View style={styles.scoreCircle}>
            <View style={[styles.scoreRing, { borderColor: scoreColor }]}>
              <Text style={[styles.scoreNumber, { color: scoreColor }]}>{score}</Text>
              <Text style={styles.scoreLabel}>/ 100</Text>
            </View>
          </View>
          <View style={styles.scoreDetails}>
            <Text style={styles.scoreSummary}>
              {healthData.concise_summary?.substring(0, 120) || 'No summary available'}...
            </Text>
            {concerns.length > 0 && (
              <View style={styles.concernsList}>
                <Text style={styles.concernsTitle}>Key Concerns:</Text>
                {concerns.slice(0, 3).map((c: any, i: number) => (
                  <View key={i} style={styles.concernItem}>
                    <View style={[styles.concernDot, { backgroundColor: '#FF5252' }]} />
                    <Text style={styles.concernText}>{c.test_name}: {c.implication}</Text>
                  </View>
                ))}
              </View>
            )}
            {stableSystems.length > 0 && (
              <View style={styles.stableRow}>
                <View style={[styles.concernDot, { backgroundColor: '#4ADE80' }]} />
                <Text style={styles.stableText}>{stableSystems.slice(0, 3).join(', ')} — Normal</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderRecoveryTrack = () => (
    <View style={styles.recoveryContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t('home.recoveryTrack')}</Text>
        <TouchableOpacity style={styles.trendingBtn}><TrendingUp stroke="#306F6F" size={18} /></TouchableOpacity>
      </View>
      <View style={styles.graphCard}>
        <View style={styles.timeline}>
          {MEDICAL_HISTORY.map((item, index) => (
            <View key={item.id} style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View style={[styles.timelineDotCircle, { borderColor: item.color }]}>
                   <View style={[styles.timelineDotInner, { backgroundColor: item.color }]} />
                </View>
                {index !== MEDICAL_HISTORY.length - 1 && <View style={styles.timelineLine} />}
              </View>
              <View style={styles.timelineContent}>
                <View style={styles.timelineHeader}>
                  <Text style={styles.diseaseName}>{t(`home.history.${item.diseaseKey}`)}</Text>
                  <Text style={styles.timelineDate}>{item.date}</Text>
                </View>
                <View style={styles.progressSection}>
                  <View style={[styles.progressBarBg, { backgroundColor: item.secondary }]}>
                    <View style={[styles.progressBarFill, { 
                      width: item.statusKey === 'recovered' ? '100%' : '40%', 
                      backgroundColor: item.color 
                    }]} />
                  </View>
                  <View style={styles.recoveryBadge}>
                     <Text style={[styles.recoveryTime, { color: item.color }]}>{t('home.history.days', { count: item.durationDays })}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>{t('home.greeting', { name: userName })}</Text>
          <TouchableOpacity 
            style={styles.notificationBtn}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Bell stroke="#212121" size={24} />
            <View style={styles.dot} />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <TouchableOpacity 
          style={styles.searchContainer}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('DoctorSearch')}
        >
          <Search stroke="#A0A0A0" size={20} />
          <Text style={styles.searchPlaceholder}>{t('home.searchPlaceholder')}</Text>
        </TouchableOpacity>

        {/* Health Score from latest scan */}
        {renderHealthScore()}

        {/* Portfolio CTA */}
        <TouchableOpacity 
          style={styles.portfolioCTA}
          onPress={() => navigation.navigate('VisitSummaries')}
        >
          <View style={styles.ctaLeft}>
             <View style={styles.ctaIconBox}>
                <Sparkles stroke="#FFFFFF" size={24} />
             </View>
              <View style={styles.ctaTextContainer}>
                <Text style={styles.ctaTitle}>{t('home.buildPortfolioTitle')}</Text>
                <Text style={styles.ctaSub}>{t('home.buildPortfolioSub')}</Text>
              </View>
          </View>
          <View style={styles.ctaArrow}>
             <ChevronRight stroke="#306F6F" size={20} />
          </View>
        </TouchableOpacity>

        {/* 1. Doctors Section (Moved to Top) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('home.doctorsNearYou')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('DoctorSearch')}>
            <Text style={styles.seeAll}>{t('home.seeAll')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.doctorGrid}>
          {DOCTORS.map(doc => (
            <TouchableOpacity 
              key={doc.id} 
              style={styles.doctorCard}
              onPress={() => navigation.navigate('DoctorProfile', { doctorId: doc.id })}
            >
              <View style={styles.imageWrapper}>
                <Image source={{ uri: doc.image }} style={styles.doctorImg} />
                <View style={styles.ratingBadge}>
                  <Star stroke="#FBB03B" fill="#FBB03B" size={12} />
                  <Text style={styles.ratingText}>{doc.rating.toFixed(1)}</Text>
                </View>
              </View>
              <Text style={styles.docName}>{doc.name}</Text>
              <Text style={styles.docSpecialty}>{t(`home.specialisations.${doc.specialtyKey}`)}</Text>
              <TouchableOpacity style={styles.docArrowBtn}>
                <MoveUpRight stroke="#FFFFFF" size={20} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        {/* 2. Recovery Track Graph (Mid Section) */}
        {renderRecoveryTrack()}

        {/* 3. Popular Specialisations */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('home.popularSpecialisations')}</Text>
          <TouchableOpacity><Text style={styles.seeAll}>{t('home.seeAll')}</Text></TouchableOpacity>
        </View>

        <View style={styles.specialisationList}>
          {SPECIALISATIONS.map(spec => (
            <TouchableOpacity 
              key={spec.id} 
              style={styles.specItem}
              onPress={() => navigation.navigate('DoctorSearch', { query: t(`home.specialisations.${spec.nameKey}`) })}
            >
              <View style={styles.specLeft}>
                <View style={styles.specIconBox}>
                   <spec.icon stroke="#306F6F" size={22} />
                </View>
                <Text style={styles.specName}>{t(`home.specialisations.${spec.nameKey}`)}</Text>
              </View>
              <Text style={styles.specCount}>{spec.count} doctors</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 4. Services */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('home.services')}</Text>
          <TouchableOpacity><LayoutGrid stroke="#306F6F" size={20} /></TouchableOpacity>
        </View>

        <View style={styles.serviceList}>
          {SERVICES.map(service => (
            <TouchableOpacity 
              key={service.id} 
              style={styles.serviceItem}
              onPress={() => {
                if (service.nameKey === 'faq') navigation.navigate('FAQ');
              }}
            >
              <Text style={styles.serviceName}>{t(`home.servicesList.${service.nameKey}`)}</Text>
              <MoveUpRight stroke="#306F6F" size={20} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Floating Emergency SOS Button */}
      <TouchableOpacity 
        style={styles.sosButton} 
        onPress={handleEmergencySOS}
        activeOpacity={0.8}
        disabled={isEmergencyLoading}
      >
        {isEmergencyLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Power stroke="#FFFFFF" size={24} />
            <Text style={styles.sosText}>SOS</Text>
          </>
        )}
      </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#212121',
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  dot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#306F6F',
    borderWidth: 2,
    borderColor: '#FFFFFF',
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
  searchPlaceholder: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#A0A0A0',
  },
  portfolioCTA: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 35,
    shadowColor: '#306F6F',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#EAF9F9',
  },
  ctaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ctaIconBox: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: '#306F6F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
  },
  ctaTextContainer: {
    justifyContent: 'center',
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 4,
  },
  ctaSub: {
    fontSize: 13,
    color: '#717171',
    fontWeight: '500',
  },
  ctaArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F7FEFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recoveryContainer: {
    marginBottom: 30,
  },
  trendingBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EAF9F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  graphCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 15,
    elevation: 4,
  },
  timeline: {
    marginTop: 5,
  },
  timelineItem: {
    flexDirection: 'row',
    height: 85,
  },
  timelineLeft: {
    width: 24,
    alignItems: 'center',
  },
  timelineDotCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    zIndex: 1,
  },
  timelineDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  timelineLine: {
    width: 1.5,
    flex: 1,
    backgroundColor: '#F0F5F5',
    marginVertical: 4,
  },
  timelineContent: {
    flex: 1,
    paddingLeft: 18,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  diseaseName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333333',
  },
  timelineDate: {
    fontSize: 13,
    color: '#A0A0A0',
    fontWeight: '500',
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    marginRight: 15,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  recoveryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F5F5',
  },
  recoveryTime: {
    fontSize: 12,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
  },
  seeAll: {
    fontSize: 16,
    color: '#306F6F',
    fontWeight: '600',
  },
  doctorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  doctorCard: {
    width: (width - 64) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 12,
    marginBottom: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  imageWrapper: {
    width: '100%',
    height: 124,
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 12,
  },
  doctorImg: {
    width: '100%',
    height: '100%',
    backgroundColor: '#EAF9F9',
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#212121',
    marginLeft: 4,
  },
  docName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#212121',
    textAlign: 'center',
    marginTop: 4,
  },
  docSpecialty: {
    fontSize: 13,
    color: '#717171',
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 12,
  },
  docArrowBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#306F6F',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: -18,
  },
  specialisationList: {
    marginBottom: 30,
  },
  specItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    height: 64,
    borderRadius: 32,
    paddingHorizontal: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  specLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  specIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EAF9F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  specName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
    marginLeft: 15,
  },
  specCount: {
    fontSize: 14,
    color: '#717171',
    fontWeight: '500',
  },
  serviceList: {
    marginBottom: 20,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    height: 60,
    borderRadius: 30,
    paddingHorizontal: 24,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  // Health Score Card styles
  healthScoreContainer: {
    marginBottom: 25,
  },
  healthScoreCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 24,
    shadowColor: '#306F6F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
  },
  scoreCircle: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7FEFE',
  },
  scoreNumber: {
    fontSize: 36,
    fontWeight: '800',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#A0A0A0',
    fontWeight: '600',
  },
  scoreDetails: {},
  scoreSummary: {
    fontSize: 14,
    color: '#717171',
    lineHeight: 20,
    marginBottom: 15,
  },
  concernsList: {
    marginBottom: 10,
  },
  concernsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },
  concernItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  concernDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  concernText: {
    fontSize: 13,
    color: '#717171',
    flex: 1,
  },
  stableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  stableText: {
    fontSize: 13,
    color: '#717171',
    flex: 1,
  },
  bottomSpacer: {
    height: 110,
  },
  sosButton: {
    position: 'absolute',
    bottom: 120,
    right: 40,
    backgroundColor: '#FF5252',
    width: 65,
    height: 65,
    borderRadius: 33,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF5252',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
    zIndex: 999,
  },
  sosText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    marginTop: 2,
  },
});


