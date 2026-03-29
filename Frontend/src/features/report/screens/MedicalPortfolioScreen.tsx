// import React, { useState, useEffect } from 'react';
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   ScrollView, 
//   TouchableOpacity, 
//   Dimensions, 
//   Image,
//   ActivityIndicator,
//   Platform
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { 
//   ArrowLeft, 
//   Download, 
//   Share2, 
//   Calendar, 
//   Clock, 
//   Monitor, 
//   MapPin, 
//   FileText,
//   Stethoscope,
//   Activity,
//   HandHelping,
//   ChevronRight,
//   Eye,
//   MoreVertical,
//   BriefcaseMedical,
//   Thermometer,
//   Wind,
//   Heart
// } from 'lucide-react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { useTranslation } from 'react-i18next';
// import { getLatestScanResult, getUserData } from '../../../shared/services/api';
// import { generatePDF, PDFTemplateData } from '../../../shared/utils/pdfGenerator';
// import { Button } from '../../../shared/components/Button';

// const { width } = Dimensions.get('window');

// const VITALS = [
//   { id: '1', titleKey: 'portfolio.vitals.heartRate', value: '77 bpm', icon: Heart, color: '#FF5252' },
//   { id: '2', titleKey: 'portfolio.vitals.bloodPressure', value: '120/80', icon: Stethoscope, color: '#306F6F' },
//   { id: '3', titleKey: 'portfolio.vitals.oxygen', value: '97%', icon: Wind, color: '#4A90E2' },
//   { id: '4', titleKey: 'portfolio.vitals.temp', value: '98.6° F', icon: Thermometer, color: '#FBB03B' },
// ];

// const EXAMINATIONS = [
//   { id: '1', titleKey: 'reports.filter.options.cbc', statusKey: 'reports.status.normal', date: '02 Jan, 2024', color: '#306F6F' },
//   { id: '2', titleKey: 'reports.filter.options.lipid', statusKey: 'reports.status.normal', date: '05 Jan, 2024', color: '#306F6F' },
//   { id: '3', titleKey: 'reports.options.thyroid', statusKey: 'reports.status.followUp', date: '02 Jan, 2024', color: '#FF5252' },
// ];

// const PRESCRIPTIONS = [
//   { id: '1', name: 'Pulmolor 150mg', desc: 'Antibiotic for bacterial infections', dosage: '14 capsules', duration: '14 - 30 May, 2024' },
//   { id: '2', name: 'Lisinopril 10mg', desc: 'ACE inhibitors', dosage: '18 tablets', duration: '11 - 30 April, 2024' },
// ];

// const SYMPTOMS = [
//   'portfolio.symptomsList.shortnessOfBreath', 
//   'portfolio.symptomsList.blueLips', 
//   'portfolio.symptomsList.backPain', 
//   'portfolio.symptomsList.chestPressure'
// ];

// export const MedicalPortfolioScreen: React.FC = () => {
//   const { t } = useTranslation();
//   const navigation = useNavigation<any>();
//   const route = useRoute<any>();
//   const [scanData, setScanData] = useState<any>(null);
//   const [userData, setUserData] = useState<any>(null);
//   const [extractedText, setExtractedText] = useState<string>('');
//   const [loadingText, setLoadingText] = useState<boolean>(false);

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         let currentScanData = null;
//         // Use scan result from navigation params or load from storage
//         if (route.params?.scanResult) {
//           currentScanData = route.params.scanResult;
//           setScanData(currentScanData);
//         } else {
//           const stored = await getLatestScanResult();
//           if (stored) {
//             currentScanData = stored;
//             setScanData(stored);
//           }
//         }

//         const user = await getUserData();
//         if (user) setUserData(user);

//         // Fetch extracted text from Cloudinary if URL exists
//         const summaryUrl = route.params?.summaryUrl || currentScanData?.summary_url || currentScanData?.analysis?.summary_file_url;
//         if (summaryUrl) {
//           fetchExtractedText(summaryUrl);
//         }
//       } catch (err) {
//         console.warn('Failed to load scan data:', err);
//       }
//     };
//     loadData();
//   }, []);

//   const fetchExtractedText = async (url: string) => {
//     setLoadingText(true);
//     try {
//       const response = await fetch(url);
//       const text = await response.text();
//       setExtractedText(text);
//     } catch (err) {
//       console.warn('Failed to fetch extracted text:', err);
//     } finally {
//       setLoadingText(false);
//     }
//   };

//   // Extract dynamic data from scan result
//   const analysis = scanData?.analysis || {};
//   const patientDetails = analysis.patient_details || {};
//   const labDetails = analysis.lab_details || {};
//   const primaryConcerns = analysis.primary_clinical_concerns || [];
//   const secondaryFindings = analysis.secondary_findings || [];
//   const stableSystems = analysis.stable_systems || [];
//   const healthScore = parseInt(analysis.calculated_health_score) || 0;
//   const scoreFactors = analysis.score_factors || [];
//   const summary = analysis.concise_summary || t('portfolio.aiInsight.text');
//   const patientTranslation = analysis.patient_translation || '';

//   const displayName = patientDetails.name || userData?.full_name || 'Patient';
//   const displayAge = patientDetails.age || 'N/A';
//   const displayGender = patientDetails.gender || 'N/A';

//   const handleDownloadReport = async () => {
//     if (!analysis) return;
    
//     // Map findings by combining concerns and secondary findings
//     const mappedFindings = [];
//     if (primaryConcerns.length > 0) {
//       mappedFindings.push(...primaryConcerns.map((c: any) => `${c.test_name}: ${c.result} ${c.unit || ''} (Ref: ${c.reference_range || 'N/A'}) - ${c.implication}`));
//     }
//     if (secondaryFindings.length > 0) {
//       mappedFindings.push(...secondaryFindings.map((c: any) => `${c.test_name}: ${c.result} ${c.unit || ''} - ${c.implication}`));
//     }

//     // Determine risk based on health score
//     let riskStatus: "Low" | "Medium" | "High" = "Medium";
//     if (healthScore >= 80) riskStatus = "Low";
//     else if (healthScore < 60) riskStatus = "High";

//     const pdfData: PDFTemplateData = {
//       patient: {
//         name: displayName,
//         age: displayAge,
//         gender: displayGender
//       },
//       summary: summary,
//       findings: mappedFindings,
//       explanation: patientTranslation,
//       risk: riskStatus,
//       healthScore: healthScore.toString(),
//       recommendations: scoreFactors
//     };

//     await generatePDF(pdfData);
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
//           <ArrowLeft stroke="#717171" size={24} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>{t('portfolio.title')}</Text>
//         <View style={styles.headerIcons}>
//           <TouchableOpacity style={styles.iconBtn} onPress={handleDownloadReport}>
//             <Download stroke="#717171" size={22} />
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.iconBtn}>
//             <Share2 stroke="#717171" size={22} />
//           </TouchableOpacity>
//         </View>
//       </View>

//       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
//         {/* Patient Introduction */}
//         <View style={styles.doctorBlock}>
//           <View style={[styles.doctorAvatar, { backgroundColor: '#EAF9F9', justifyContent: 'center', alignItems: 'center' }]}>
//             <Text style={{ fontSize: 24, fontWeight: '700', color: '#306F6F' }}>{displayName[0]}</Text>
//           </View>
//           <View style={styles.doctorInfo}>
//             <Text style={styles.doctorName}>{displayName}</Text>
//             <Text style={styles.doctorSpec}>
//               {displayAge} • {displayGender} {labDetails.name ? `• ${labDetails.name}` : ''}
//             </Text>
//           </View>
//         </View>

//         {/* AI Insight Summary — Dynamic */}
//         <View style={styles.aiBriefCard}>
//            <BriefcaseMedical stroke="#FFFFFF" size={24} />
//            <View style={styles.aiBriefContent}>
//               <Text style={styles.aiBriefTitle}>AI Health Score: {healthScore}/100</Text>
//               <Text style={styles.aiBriefText}>{summary}</Text>
//            </View>
//         </View>

//         {/* Vital Signs Grid */}
//         <View style={styles.vitalsGrid}>
//            {VITALS.map(vital => (
//              <View key={vital.id} style={styles.vitalCard}>
//                 <View style={[styles.vitalIconBox, { backgroundColor: `${vital.color}10` }]}>
//                    <vital.icon stroke={vital.color} size={20} />
//                 </View>
//                 <Text style={styles.vitalValue}>{vital.value}</Text>
//                 <Text style={styles.vitalTitle}>{t(vital.titleKey)}</Text>
//              </View>
//            ))}
//         </View>

//         {/* Clinical Concerns — Dynamic */}
//         {primaryConcerns.length > 0 && (
//           <>
//             <Text style={styles.sectionTitle}>Primary Clinical Concerns</Text>
//             {primaryConcerns.map((concern: any, i: number) => (
//               <View key={i} style={styles.examCard}>
//                 <View style={styles.examCardTop}>
//                   <View style={styles.examInfo}>
//                     <Text style={styles.examTitle}>{concern.test_name}</Text>
//                     <Text style={styles.examMeta}>
//                       {concern.result} {concern.unit} (Ref: {concern.reference_range})
//                     </Text>
//                   </View>
//                 </View>
//                 <Text style={[styles.pointText, { marginTop: 10, color: '#FF5252' }]}>
//                   ⚠ {concern.implication}
//                 </Text>
//               </View>
//             ))}
//           </>
//         )}

//         {secondaryFindings.length > 0 && (
//           <>
//             <Text style={styles.sectionTitle}>Secondary Findings</Text>
//             {secondaryFindings.map((finding: any, i: number) => (
//               <View key={i} style={styles.examCard}>
//                 <View style={styles.examCardTop}>
//                   <View style={styles.examInfo}>
//                     <Text style={styles.examTitle}>{finding.test_name}</Text>
//                     <Text style={styles.examMeta}>
//                       {finding.result} {finding.unit} (Ref: {finding.reference_range})
//                     </Text>
//                   </View>
//                 </View>
//               </View>
//             ))}
//           </>
//         )}

//         {/* Stable Systems */}
//         {stableSystems.length > 0 && (
//           <>
//             <Text style={styles.sectionTitle}>Stable Systems ✅</Text>
//             <View style={styles.pointSection}>
//               <View style={styles.symptomGrid}>
//                 {stableSystems.map((system: string, i: number) => (
//                   <View key={i} style={styles.symptomBadge}>
//                     <Text style={styles.symptomText}>{system}</Text>
//                   </View>
//                 ))}
//               </View>
//             </View>
//           </>
//         )}

//         <View style={{ marginTop: 20, marginBottom: 50 }}>
//           <Button 
//             title="Download Report" 
//             onPress={handleDownloadReport} 
//             variant="primary" 
//           />
//         </View>

//         {/* Patient-Friendly Translation */}
//         {patientTranslation ? (
//           <>
//             <Text style={styles.sectionTitle}>What This Means For You</Text>
//             <View style={styles.pointSection}>
//               <Text style={styles.pointText}>{patientTranslation}</Text>
//             </View>
//           </>
//         ) : null}

//         {/* Score Factors */}
//         {scoreFactors.length > 0 && (
//           <>
//             <Text style={styles.sectionTitle}>Score Factors</Text>
//             <View style={styles.pointSection}>
//               {scoreFactors.map((factor: string, i: number) => (
//                 <Text key={i} style={[styles.pointText, { marginBottom: 6 }]}>• {factor}</Text>
//               ))}
//             </View>
//           </>
//         )}

//         {/* Full Extraction Detail Section */}
//         {extractedText ? (
//           <>
//             <View style={styles.extractionHeader}>
//                <Text style={styles.sectionTitle}>Full Extracted Detail</Text>
//                <TouchableOpacity 
//                  style={styles.copyBtn} 
//                  onPress={() => {
//                    // Optional: add copy to clipboard functionality if needed
//                  }}
//                >
//                  <FileText stroke="#306F6F" size={20} />
//                </TouchableOpacity>
//             </View>
//             <View style={[styles.pointSection, { backgroundColor: '#F0F9F9' }]}>
//                <Text style={[styles.pointText, { color: '#333333', fontSize: 13, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' }]}>
//                  {extractedText}
//                </Text>
//             </View>
//           </>
//         ) : loadingText ? (
//           <View style={{ padding: 40, alignItems: 'center' }}>
//             <ActivityIndicator color="#306F6F" />
//             <Text style={{ marginTop: 10, color: '#A0A0A0' }}>Loading extracted txt format...</Text>
//           </View>
//         ) : null}

//         {/* Clinical History & Reason — Fallback */}
//         <Text style={styles.sectionTitle}>{t('portfolio.sections.history')}</Text>
//         <View style={styles.pointSection}>
//            <Text style={styles.pointText}>{t('portfolio.sections.historyText')}</Text>
//         </View>

//         {/* Symptoms & Signs */}
//         <Text style={styles.sectionTitle}>{t('portfolio.sections.symptoms')}</Text>
//         <View style={styles.pointSection}>
//            <View style={styles.symptomGrid}>
//               {SYMPTOMS.map(s => (
//                 <View key={s} style={styles.symptomBadge}>
//                    <Text style={styles.symptomText}>{t(s)}</Text>
//                 </View>
//               ))}
//            </View>
//         </View>

//         {/* AI Deduced Diagnosis */}
//         <Text style={styles.sectionTitle}>{t('portfolio.sections.diagnosis')}</Text>
//         <View style={[styles.pointSection, styles.diagnosisCard]}>
//            <Stethoscope stroke="#306F6F" size={24} />
//            <Text style={styles.diagnosisLarge}>{t('portfolio.sections.diagnosisText')}</Text>
//         </View>

//         {/* Examination Timeline */}
//         <Text style={styles.sectionTitle}>{t('portfolio.sections.timeline')}</Text>
//         {EXAMINATIONS.map(exam => (
//           <View key={exam.id} style={styles.examCard}>
//              <View style={styles.examCardTop}>
//                 <View style={styles.examInfo}>
//                    <Text style={styles.examTitle}>{t(exam.titleKey)}</Text>
//                    <Text style={styles.examMeta}>
//                       {exam.date} • <Text style={{ color: exam.color }}>{t(exam.statusKey)}</Text>
//                    </Text>
//                 </View>
//                 <TouchableOpacity style={styles.moreBtn}>
//                    <MoreVertical stroke="#E0E8E8" size={20} />
//                 </TouchableOpacity>
//              </View>
             
//              <View style={styles.examActions}>
//                 <TouchableOpacity style={styles.viewBtn}>
//                    <Eye stroke="#FFFFFF" size={16} />
//                    <Text style={styles.btnText}>{t('portfolio.actions.viewReport')}</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.downBtn}>
//                    <Download stroke="#306F6F" size={16} />
//                    <Text style={[styles.btnText, { color: '#306F6F' }]}>{t('portfolio.actions.download')}</Text>
//                 </TouchableOpacity>
//              </View>
//           </View>
//         ))}

//         {/* Management Plan & Prescriptions */}
//         <Text style={[styles.sectionTitle, { marginTop: 30 }]}>{t('portfolio.sections.management')}</Text>
//         <View style={styles.pointSection}>
//            <Text style={styles.pointText}>{t('portfolio.sections.managementText')}</Text>
//         </View>

//         <Text style={styles.sectionTitle}>{t('portfolio.sections.prescriptions')}</Text>
//         {PRESCRIPTIONS.map(med => (
//           <TouchableOpacity key={med.id} style={styles.medCard}>
//              <View style={styles.medCardTop}>
//                 <View style={[styles.medIconBox, { backgroundColor: '#EAF9F9' }]}>
//                    <HandHelping stroke="#306F6F" size={24} />
//                 </View>
//                 <View style={styles.medInfo}>
//                    <Text style={styles.medName}>{med.name}</Text>
//                    <Text style={styles.medDesc}>{med.desc}</Text>
//                 </View>
//                 <TouchableOpacity style={styles.moreBtn}>
//                    <MoreVertical stroke="#E0E8E8" size={20} />
//                 </TouchableOpacity>
//              </View>

//              <View style={styles.medPills}>
//                 <View style={styles.medPill}><Text style={styles.medPillText}>{med.dosage}</Text></View>
//                 <View style={styles.medPill}><Text style={styles.medPillText}>{med.duration}</Text></View>
//              </View>
//           </TouchableOpacity>
//         ))}

//         <View style={styles.bottomSpacer} />
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F7FEFE',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//   },
//   backBtn: {
//     width: 44,
//     height: 44,
//     justifyContent: 'center',
//   },
//   headerTitle: {
//     fontSize: 20,
//     color: '#333333',
//     fontWeight: '600',
//   },
//   headerIcons: {
//     flexDirection: 'row',
//   },
//   iconBtn: {
//     width: 44,
//     height: 44,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   scrollContent: {
//     paddingHorizontal: 24,
//     paddingTop: 10,
//   },
//   doctorBlock: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 25,
//   },
//   doctorAvatar: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     marginRight: 15,
//   },
//   doctorInfo: {
//     flex: 1,
//   },
//   doctorName: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#333333',
//   },
//   doctorSpec: {
//     fontSize: 14,
//     color: '#717171',
//     marginTop: 4,
//   },
//   aiBriefCard: {
//     backgroundColor: '#306F6F',
//     borderRadius: 30,
//     padding: 24,
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 30,
//   },
//   aiBriefContent: {
//     flex: 1,
//     marginLeft: 15,
//   },
//   aiBriefTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#FFFFFF',
//     marginBottom: 4,
//   },
//   aiBriefText: {
//     fontSize: 13,
//     color: 'rgba(255, 255, 255, 0.8)',
//     lineHeight: 18,
//   },
//   vitalsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 12,
//     marginBottom: 35,
//   },
//   vitalCard: {
//     width: (width - 60) / 2,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 25,
//     padding: 18,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.04,
//     shadowRadius: 10,
//     elevation: 3,
//   },
//   vitalIconBox: {
//     width: 44,
//     height: 44,
//     borderRadius: 15,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   vitalValue: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#333333',
//   },
//   vitalTitle: {
//     fontSize: 12,
//     color: '#717171',
//     marginTop: 4,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#333333',
//     marginBottom: 15,
//     marginTop: 10,
//   },
//   pointSection: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 24,
//     padding: 20,
//     marginBottom: 25,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.03,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   pointText: {
//     fontSize: 15,
//     color: '#717171',
//     lineHeight: 22,
//   },
//   symptomGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 10,
//   },
//   symptomBadge: {
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     borderRadius: 18,
//     backgroundColor: '#EAF9F9',
//   },
//   symptomText: {
//     fontSize: 14,
//     color: '#306F6F',
//     fontWeight: '600',
//   },
//   diagnosisCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 15,
//   },
//   diagnosisLarge: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#306F6F',
//     flex: 1,
//   },
//   examCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 30,
//     padding: 24,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.04,
//     shadowRadius: 12,
//     elevation: 4,
//   },
//   examCardTop: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   examInfo: {
//     flex: 1,
//   },
//   examTitle: {
//     fontSize: 17,
//     fontWeight: '700',
//     color: '#333333',
//     marginBottom: 6,
//   },
//   examMeta: {
//     fontSize: 14,
//     color: '#717171',
//   },
//   moreBtn: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   examActions: {
//     flexDirection: 'row',
//     gap: 12,
//     marginTop: 20,
//   },
//   viewBtn: {
//     flex: 1,
//     height: 52,
//     borderRadius: 26,
//     backgroundColor: '#306F6F',
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   downBtn: {
//     flex: 1,
//     height: 52,
//     borderRadius: 26,
//     borderWidth: 1,
//     borderColor: '#306F6F',
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   btnText: {
//     color: '#FFFFFF',
//     fontSize: 15,
//     fontWeight: '700',
//     marginLeft: 8,
//   },
//   medCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 30,
//     padding: 24,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.04,
//     shadowRadius: 10,
//     elevation: 2,
//   },
//   medCardTop: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   medIconBox: {
//     width: 50,
//     height: 50,
//     borderRadius: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 15,
//   },
//   medInfo: {
//     flex: 1,
//   },
//   medName: {
//     fontSize: 17,
//     fontWeight: '700',
//     color: '#333333',
//   },
//   medDesc: {
//     fontSize: 14,
//     color: '#717171',
//     marginTop: 2,
//   },
//   medPills: {
//     flexDirection: 'row',
//     gap: 10,
//   },
//   medPill: {
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     backgroundColor: '#F7FEFE',
//     borderRadius: 18,
//   },
//   medPillText: {
//     fontSize: 14,
//     color: '#717171',
//   },
//   bottomSpacer: {
//     height: 100,
//   },
//   extractionHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingRight: 10,
//   },
//   copyBtn: {
//     width: 44,
//     height: 44,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Download,
  Share2,
  FileText,
  Stethoscope,
  HandHelping,
  Eye,
  MoreVertical,
  BriefcaseMedical,
  Thermometer,
  Wind,
  Heart,
} from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { getLatestScanResult, getUserData, getToken, BASE_URL } from '../../../shared/services/api';
import { generatePDF } from '../../../shared/utils/pdfGenerator';
import { Button } from '../../../shared/components/Button';

const { width } = Dimensions.get('window');

const VITALS = [
  { id: '1', titleKey: 'portfolio.vitals.heartRate', value: '77 bpm', icon: Heart, color: '#FF5252' },
  { id: '2', titleKey: 'portfolio.vitals.bloodPressure', value: '120/80', icon: Stethoscope, color: '#306F6F' },
  { id: '3', titleKey: 'portfolio.vitals.oxygen', value: '97%', icon: Wind, color: '#4A90E2' },
  { id: '4', titleKey: 'portfolio.vitals.temp', value: '98.6° F', icon: Thermometer, color: '#FBB03B' },
];

const EXAMINATIONS = [
  { id: '1', titleKey: 'reports.filter.options.cbc', statusKey: 'reports.status.normal', date: '02 Jan, 2024', color: '#306F6F' },
  { id: '2', titleKey: 'reports.filter.options.lipid', statusKey: 'reports.status.normal', date: '05 Jan, 2024', color: '#306F6F' },
  { id: '3', titleKey: 'reports.options.thyroid', statusKey: 'reports.status.followUp', date: '02 Jan, 2024', color: '#FF5252' },
];

const PRESCRIPTIONS = [
  { id: '1', name: 'Pulmolor 150mg', desc: 'Antibiotic for bacterial infections', dosage: '14 capsules', duration: '14 - 30 May, 2024' },
  { id: '2', name: 'Lisinopril 10mg', desc: 'ACE inhibitors', dosage: '18 tablets', duration: '11 - 30 April, 2024' },
];

const SYMPTOMS = [
  'portfolio.symptomsList.shortnessOfBreath',
  'portfolio.symptomsList.blueLips',
  'portfolio.symptomsList.backPain',
  'portfolio.symptomsList.chestPressure',
];

export const MedicalPortfolioScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const [scanData, setScanData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [loadingText, setLoadingText] = useState<boolean>(false);
  const [downloadLoading, setDownloadLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        let currentScanData = null;

        if (route.params?.scanResult) {
          currentScanData = route.params.scanResult;
          setScanData(currentScanData);
        } else {
          const stored = await getLatestScanResult();
          if (stored) {
            currentScanData = stored;
            setScanData(stored);
          }
        }

        const user = await getUserData();
        if (user) setUserData(user);

        const summaryUrl =
          route.params?.summaryUrl ||
          currentScanData?.summary_url ||
          currentScanData?.analysis?.summary_file_url;

        if (summaryUrl) {
          fetchExtractedText(summaryUrl);
        }
      } catch (err) {
        console.warn('Failed to load scan data:', err);
      }
    };

    loadData();
  }, []);

  const fetchExtractedText = async (url: string) => {
    setLoadingText(true);
    try {
      const response = await fetch(url);
      const text = await response.text();
      setExtractedText(text);
    } catch (err) {
      console.warn('Failed to fetch extracted text:', err);
    } finally {
      setLoadingText(false);
    }
  };

  // ─── Derived data from scan ───────────────────────────────────────────────
  const analysis = scanData?.analysis || {};
  const patientDetails = analysis.patient_details || {};
  const labDetails = analysis.lab_details || {};
  const primaryConcerns = analysis.primary_clinical_concerns || [];
  const secondaryFindings = analysis.secondary_findings || [];
  const stableSystems = analysis.stable_systems || [];
  const healthScore = parseInt(analysis.calculated_health_score) || 0;
  const scoreFactors = analysis.score_factors || [];
  const summary = analysis.concise_summary || t('portfolio.aiInsight.text');
  const patientTranslation = analysis.patient_translation || '';

  const displayName = patientDetails.name || userData?.full_name || 'Patient';
  const displayAge = patientDetails.age || 'N/A';
  const displayGender = patientDetails.gender || 'N/A';

  // ─── The patient ID the backend needs ────────────────────────────────────
  // Resolved in priority order: route param → scanData → userData
  const patientId: string =
    route.params?.patientId ||
    scanData?.patient_id ||
    userData?.id ||
    userData?.patient_id ||
    '';

  // ─── Fixed: send only PDF blob + patientId to backend ────────────────────
  const handleDownloadReport = async () => {
    if (!patientId) {
      Alert.alert('Error', 'Patient ID not found. Please try again.');
      return;
    }

    setDownloadLoading(true);
    try {
      // 1. Generate the PDF and get its local URI
      const pdfUri: string = await generatePDF({
        patient: { name: displayName, age: displayAge, gender: displayGender },
        summary,
        findings: [
          ...primaryConcerns.map(
            (c: any) =>
              `${c.test_name}: ${c.result} ${c.unit || ''} (Ref: ${c.reference_range || 'N/A'}) - ${c.implication}`,
          ),
          ...secondaryFindings.map(
            (c: any) =>
              `${c.test_name}: ${c.result} ${c.unit || ''} - ${c.implication}`,
          ),
        ],
        explanation: patientTranslation,
        risk: healthScore >= 80 ? 'Low' : healthScore < 60 ? 'High' : 'Medium',
        healthScore: healthScore.toString(),
        recommendations: scoreFactors,
      }, true); // Pass 'true' to skip the automatic share dialog if we want manual upload control

      // 2. Prepare for upload to the backend
      const formData = new FormData();
      
      // For React Native, instead of a Blob, we append an object with uri, type, and name
      formData.append('medical_document', {
        uri: pdfUri,
        name: `report_${patientId}_${Date.now()}.pdf`,
        type: 'application/pdf',
      } as any);
      
      formData.append('patientId', patientId);

      // 3. Upload to the standard OCR scan endpoint (which supports PDFs)
      // This will store the generated report as a record in the patient's history
      const token = await getToken();
      const response = await fetch(`${BASE_URL}/ocr/upload-scan`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Upload error:', errorBody);
        throw new Error('Failed to upload processed report to server.');
      }

      Alert.alert('Report Saved', 'Your health report has been generated and securely stored in your medical history.');
    } catch (err: any) {
      console.error('handleDownloadReport error:', err);
      Alert.alert('Error', err?.message || 'Failed to generate or upload report.');
    } finally {
      setDownloadLoading(false);
    }
  };

  // ─── UI ──────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft stroke="#717171" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('portfolio.title')}</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn} onPress={handleDownloadReport} disabled={downloadLoading}>
            {downloadLoading ? (
              <ActivityIndicator color="#306F6F" size="small" />
            ) : (
              <Download stroke="#717171" size={22} />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Share2 stroke="#717171" size={22} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Patient Introduction */}
        <View style={styles.doctorBlock}>
          <View style={[styles.doctorAvatar, { backgroundColor: '#EAF9F9', justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={{ fontSize: 24, fontWeight: '700', color: '#306F6F' }}>
              {displayName[0]}
            </Text>
          </View>
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{displayName}</Text>
            <Text style={styles.doctorSpec}>
              {displayAge} • {displayGender} {labDetails.name ? `• ${labDetails.name}` : ''}
            </Text>
          </View>
        </View>

        {/* AI Health Score Card */}
        <View style={styles.aiBriefCard}>
          <BriefcaseMedical stroke="#FFFFFF" size={24} />
          <View style={styles.aiBriefContent}>
            <Text style={styles.aiBriefTitle}>AI Health Score: {healthScore}/100</Text>
            <Text style={styles.aiBriefText}>{summary}</Text>
          </View>
        </View>

        {/* Vital Signs Grid */}
        <View style={styles.vitalsGrid}>
          {VITALS.map(vital => (
            <View key={vital.id} style={styles.vitalCard}>
              <View style={[styles.vitalIconBox, { backgroundColor: `${vital.color}10` }]}>
                <vital.icon stroke={vital.color} size={20} />
              </View>
              <Text style={styles.vitalValue}>{vital.value}</Text>
              <Text style={styles.vitalTitle}>{t(vital.titleKey)}</Text>
            </View>
          ))}
        </View>

        {/* Primary Clinical Concerns */}
        {primaryConcerns.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Primary Clinical Concerns</Text>
            {primaryConcerns.map((concern: any, i: number) => (
              <View key={i} style={styles.examCard}>
                <View style={styles.examCardTop}>
                  <View style={styles.examInfo}>
                    <Text style={styles.examTitle}>{concern.test_name}</Text>
                    <Text style={styles.examMeta}>
                      {concern.result} {concern.unit} (Ref: {concern.reference_range})
                    </Text>
                  </View>
                </View>
                <Text style={[styles.pointText, { marginTop: 10, color: '#FF5252' }]}>
                  ⚠ {concern.implication}
                </Text>
              </View>
            ))}
          </>
        )}

        {/* Secondary Findings */}
        {secondaryFindings.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Secondary Findings</Text>
            {secondaryFindings.map((finding: any, i: number) => (
              <View key={i} style={styles.examCard}>
                <View style={styles.examCardTop}>
                  <View style={styles.examInfo}>
                    <Text style={styles.examTitle}>{finding.test_name}</Text>
                    <Text style={styles.examMeta}>
                      {finding.result} {finding.unit} (Ref: {finding.reference_range})
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </>
        )}

        {/* Stable Systems */}
        {stableSystems.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Stable Systems ✅</Text>
            <View style={styles.pointSection}>
              <View style={styles.symptomGrid}>
                {stableSystems.map((system: string, i: number) => (
                  <View key={i} style={styles.symptomBadge}>
                    <Text style={styles.symptomText}>{system}</Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}

        {/* Download Button */}
        <View style={{ marginTop: 20, marginBottom: 50 }}>
          <Button
            title={downloadLoading ? 'Generating Report...' : 'Download Report'}
            onPress={handleDownloadReport}
            variant="primary"
            disabled={downloadLoading}
          />
        </View>

        {/* Patient-Friendly Translation */}
        {patientTranslation ? (
          <>
            <Text style={styles.sectionTitle}>What This Means For You</Text>
            <View style={styles.pointSection}>
              <Text style={styles.pointText}>{patientTranslation}</Text>
            </View>
          </>
        ) : null}

        {/* Score Factors */}
        {scoreFactors.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Score Factors</Text>
            <View style={styles.pointSection}>
              {scoreFactors.map((factor: string, i: number) => (
                <Text key={i} style={[styles.pointText, { marginBottom: 6 }]}>
                  • {factor}
                </Text>
              ))}
            </View>
          </>
        )}

        {/* Full Extracted Detail */}
        {extractedText ? (
          <>
            <View style={styles.extractionHeader}>
              <Text style={styles.sectionTitle}>Full Extracted Detail</Text>
              <TouchableOpacity style={styles.copyBtn}>
                <FileText stroke="#306F6F" size={20} />
              </TouchableOpacity>
            </View>
            <View style={[styles.pointSection, { backgroundColor: '#F0F9F9' }]}>
              <Text
                style={[
                  styles.pointText,
                  {
                    color: '#333333',
                    fontSize: 13,
                    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
                  },
                ]}>
                {extractedText}
              </Text>
            </View>
          </>
        ) : loadingText ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator color="#306F6F" />
            <Text style={{ marginTop: 10, color: '#A0A0A0' }}>Loading extracted txt format...</Text>
          </View>
        ) : null}

        {/* Clinical History */}
        <Text style={styles.sectionTitle}>{t('portfolio.sections.history')}</Text>
        <View style={styles.pointSection}>
          <Text style={styles.pointText}>{t('portfolio.sections.historyText')}</Text>
        </View>

        {/* Symptoms */}
        <Text style={styles.sectionTitle}>{t('portfolio.sections.symptoms')}</Text>
        <View style={styles.pointSection}>
          <View style={styles.symptomGrid}>
            {SYMPTOMS.map(s => (
              <View key={s} style={styles.symptomBadge}>
                <Text style={styles.symptomText}>{t(s)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* AI Diagnosis */}
        <Text style={styles.sectionTitle}>{t('portfolio.sections.diagnosis')}</Text>
        <View style={[styles.pointSection, styles.diagnosisCard]}>
          <Stethoscope stroke="#306F6F" size={24} />
          <Text style={styles.diagnosisLarge}>{t('portfolio.sections.diagnosisText')}</Text>
        </View>

        {/* Examination Timeline */}
        <Text style={styles.sectionTitle}>{t('portfolio.sections.timeline')}</Text>
        {EXAMINATIONS.map(exam => (
          <View key={exam.id} style={styles.examCard}>
            <View style={styles.examCardTop}>
              <View style={styles.examInfo}>
                <Text style={styles.examTitle}>{t(exam.titleKey)}</Text>
                <Text style={styles.examMeta}>
                  {exam.date} •{' '}
                  <Text style={{ color: exam.color }}>{t(exam.statusKey)}</Text>
                </Text>
              </View>
              <TouchableOpacity style={styles.moreBtn}>
                <MoreVertical stroke="#E0E8E8" size={20} />
              </TouchableOpacity>
            </View>
            <View style={styles.examActions}>
              <TouchableOpacity style={styles.viewBtn}>
                <Eye stroke="#FFFFFF" size={16} />
                <Text style={styles.btnText}>{t('portfolio.actions.viewReport')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.downBtn}>
                <Download stroke="#306F6F" size={16} />
                <Text style={[styles.btnText, { color: '#306F6F' }]}>
                  {t('portfolio.actions.download')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Management Plan */}
        <Text style={[styles.sectionTitle, { marginTop: 30 }]}>{t('portfolio.sections.management')}</Text>
        <View style={styles.pointSection}>
          <Text style={styles.pointText}>{t('portfolio.sections.managementText')}</Text>
        </View>

        {/* Prescriptions */}
        <Text style={styles.sectionTitle}>{t('portfolio.sections.prescriptions')}</Text>
        {PRESCRIPTIONS.map(med => (
          <TouchableOpacity key={med.id} style={styles.medCard}>
            <View style={styles.medCardTop}>
              <View style={[styles.medIconBox, { backgroundColor: '#EAF9F9' }]}>
                <HandHelping stroke="#306F6F" size={24} />
              </View>
              <View style={styles.medInfo}>
                <Text style={styles.medName}>{med.name}</Text>
                <Text style={styles.medDesc}>{med.desc}</Text>
              </View>
              <TouchableOpacity style={styles.moreBtn}>
                <MoreVertical stroke="#E0E8E8" size={20} />
              </TouchableOpacity>
            </View>
            <View style={styles.medPills}>
              <View style={styles.medPill}>
                <Text style={styles.medPillText}>{med.dosage}</Text>
              </View>
              <View style={styles.medPill}>
                <Text style={styles.medPillText}>{med.duration}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FEFE' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backBtn: { width: 44, height: 44, justifyContent: 'center' },
  headerTitle: { fontSize: 20, color: '#333333', fontWeight: '600' },
  headerIcons: { flexDirection: 'row' },
  iconBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingHorizontal: 24, paddingTop: 10 },
  doctorBlock: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  doctorAvatar: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  doctorInfo: { flex: 1 },
  doctorName: { fontSize: 22, fontWeight: '700', color: '#333333' },
  doctorSpec: { fontSize: 14, color: '#717171', marginTop: 4 },
  aiBriefCard: {
    backgroundColor: '#306F6F',
    borderRadius: 30,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  aiBriefContent: { flex: 1, marginLeft: 15 },
  aiBriefTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  aiBriefText: { fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 18 },
  vitalsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 35 },
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
  vitalValue: { fontSize: 18, fontWeight: '700', color: '#333333' },
  vitalTitle: { fontSize: 12, color: '#717171', marginTop: 4 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#333333', marginBottom: 15, marginTop: 10 },
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
  pointText: { fontSize: 15, color: '#717171', lineHeight: 22 },
  symptomGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  symptomBadge: { paddingHorizontal: 15, paddingVertical: 10, borderRadius: 18, backgroundColor: '#EAF9F9' },
  symptomText: { fontSize: 14, color: '#306F6F', fontWeight: '600' },
  diagnosisCard: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  diagnosisLarge: { fontSize: 18, fontWeight: '700', color: '#306F6F', flex: 1 },
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
  examCardTop: { flexDirection: 'row', justifyContent: 'space-between' },
  examInfo: { flex: 1 },
  examTitle: { fontSize: 17, fontWeight: '700', color: '#333333', marginBottom: 6 },
  examMeta: { fontSize: 14, color: '#717171' },
  moreBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  examActions: { flexDirection: 'row', gap: 12, marginTop: 20 },
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
  btnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700', marginLeft: 8 },
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
  medCardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  medIconBox: { width: 50, height: 50, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  medInfo: { flex: 1 },
  medName: { fontSize: 17, fontWeight: '700', color: '#333333' },
  medDesc: { fontSize: 14, color: '#717171', marginTop: 2 },
  medPills: { flexDirection: 'row', gap: 10 },
  medPill: { paddingHorizontal: 15, paddingVertical: 10, backgroundColor: '#F7FEFE', borderRadius: 18 },
  medPillText: { fontSize: 14, color: '#717171' },
  bottomSpacer: { height: 100 },
  extractionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 10 },
  copyBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
});

