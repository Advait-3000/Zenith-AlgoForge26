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
  Share2, 
  Plus, 
  Pencil
} from 'lucide-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { getLatestScanResult } from '../../../shared/services/api';

const { width } = Dimensions.get('window');

// Global simulated store to track which sections are filled in this session
const FILLED_TRACKER: Record<string, boolean> = {
  body: false,
  lifestyle: false,
  anamnesis: false,
  notes: false,
};

export const markSectionFilled = (type: string) => {
  FILLED_TRACKER[type] = true;
};

interface MetricSection {
  title: string;
  isFilled: boolean;
  data?: any;
}

export const HealthMetricsScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  // Initial state is empty as requested
  const [sections, setSections] = useState<Record<string, MetricSection>>({
    body: { title: 'Body parameters', isFilled: false, data: { height: '172', weight: '85', bmi: '24.5', oxygen: '97', pressure: '120/80', heartRate: '77', bloodType: 'B+', } },
    lifestyle: { title: 'Lifestyle', isFilled: false, data: { sleep: '7-8', water: '1-1,5', smoking: 'Yes', alcohol: 'No', activity: 'Moderate', } },
    anamnesis: { title: 'Anamnesis', isFilled: false, data: { chronic: 'Migraines', allergies: 'Peanuts', } },
    notes: { title: 'Notes', isFilled: false, data: { text: "I've been having headaches almost every day, mostly in the afternoon. They are mild to moderate and usually go away after I take some painkillers." } }
  });

  useFocusEffect(
    React.useCallback(() => {
      // Sync manual fill tracker
      setSections(prev => {
        const next = { ...prev };
        Object.keys(FILLED_TRACKER).forEach(key => {
          if (FILLED_TRACKER[key]) {
            next[key].isFilled = true;
          }
        });
        return next;
      });

      // Load data from latest scan result
      const loadScanData = async () => {
        try {
          const scanResult = await getLatestScanResult();
          if (!scanResult?.analysis) return;

          const analysis = scanResult.analysis;
          const clinicalData = analysis.clinical_data || {};
          const concerns = analysis.primary_clinical_concerns || [];
          const secondary = analysis.secondary_findings || [];
          const score = analysis.calculated_health_score || 'N/A';

          setSections(prev => {
            const next = { ...prev };

            // Auto-populate body parameters from scan data
            const findClinicalValue = (nameSubstring: string) => {
              const key = Object.keys(clinicalData).find(k => 
                k.toLowerCase().includes(nameSubstring.toLowerCase())
              );
              return key ? clinicalData[key].split('(')[0].trim() : null; // Remove reference range in parentheses
            };

            const extractedOxygen = findClinicalValue('Oxygen');
            const extractedPressure = findClinicalValue('Blood Pressure');
            const extractedHeartRate = findClinicalValue('Pulse Rate');

            const hasExtractableData = extractedOxygen || extractedPressure || extractedHeartRate;

            if (hasExtractableData || concerns.length > 0) {
              next.body = {
                ...next.body,
                isFilled: true,
                data: {
                  ...next.body.data,
                  ...(extractedOxygen && { oxygen: extractedOxygen }),
                  ...(extractedPressure && { pressure: extractedPressure }),
                  ...(extractedHeartRate && { heartRate: extractedHeartRate }),
                  healthScore: score,
                },
              };

              // Populate anamnesis from concerns
              if (concerns.length > 0) {
                const chronicList = concerns.map((c: any) => c.implication).join(', ');
                next.anamnesis = {
                  ...next.anamnesis,
                  isFilled: true,
                  data: {
                    ...next.anamnesis.data,
                    chronic: chronicList || next.anamnesis.data.chronic,
                  },
                };
              }
            }

            return next;
          });
        } catch (err) {
          console.warn('Failed to load scan data for metrics:', err);
        }
      };
      loadScanData();
    }, [])
  );

  const renderSection = (key: string, section: MetricSection) => {
    if (!section.isFilled) {
      return (
        <View key={key} style={styles.sectionRow}>
          <Text style={styles.sectionLabel}>{t(`metrics.sections.${key}`)}</Text>
          <TouchableOpacity 
            style={styles.addBtn}
            onPress={() => navigation.navigate('HealthMetricsEdit', { type: key })}
          >
            <Plus stroke="#306F6F" size={20} />
            <Text style={styles.addText}>{t('metrics.add')}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // Filled State UI
    return (
      <View key={key} style={styles.filledSection}>
        <View style={styles.sectionHeader}>
           <Text style={styles.sectionTitle}>{t(`metrics.sections.${key}`)}</Text>
           <TouchableOpacity onPress={() => navigation.navigate('HealthMetricsEdit', { type: key })}>
              <Pencil stroke="#717171" size={20} />
           </TouchableOpacity>
        </View>

        {key === 'body' && (
          <View style={styles.dataGrid}>
             <View style={styles.dataRow}><Text style={styles.dataLabel}>{t('metrics.fields.height')}</Text><Text style={styles.dataValue}>{section.data.height}</Text></View>
             <View style={styles.dataRow}><Text style={styles.dataLabel}>{t('metrics.fields.weight')}</Text><Text style={styles.dataValue}>{section.data.weight}</Text></View>
             <View style={styles.dataRow}><Text style={styles.dataLabel}>{t('metrics.fields.bmi')}</Text><Text style={styles.dataValue}>{section.data.bmi}</Text></View>
             <View style={styles.dataRow}><Text style={styles.dataLabel}>{t('metrics.fields.oxygen')}</Text><Text style={styles.dataValue}>{section.data.oxygen}</Text></View>
             <View style={styles.dataRow}><Text style={styles.dataLabel}>{t('metrics.fields.pressure')}</Text><Text style={styles.dataValue}>{section.data.pressure}</Text></View>
             <View style={styles.dataRow}><Text style={styles.dataLabel}>{t('metrics.fields.heartRate')}</Text><Text style={styles.dataValue}>{section.data.heartRate}</Text></View>
             <View style={styles.dataRow}><Text style={styles.dataLabel}>{t('metrics.fields.bloodType')}</Text><Text style={styles.dataValue}>{section.data.bloodType}</Text></View>
          </View>
        )}

        {key === 'lifestyle' && (
          <View style={styles.dataGrid}>
             <View style={styles.dataRow}><Text style={styles.dataLabel}>{t('metrics.fields.sleep')}</Text><Text style={styles.dataValue}>{section.data.sleep}</Text></View>
             <View style={styles.dataRow}><Text style={styles.dataLabel}>{t('metrics.fields.water')}</Text><Text style={styles.dataValue}>{section.data.water}</Text></View>
             <View style={styles.dataRow}><Text style={styles.dataLabel}>{t('metrics.fields.smoking')}</Text><Text style={styles.dataValue}>{section.data.smoking}</Text></View>
             <View style={styles.dataRow}><Text style={styles.dataLabel}>{t('metrics.fields.alcohol')}</Text><Text style={styles.dataValue}>{section.data.alcohol}</Text></View>
             <View style={styles.dataRow}><Text style={styles.dataLabel}>{t('metrics.fields.activity')}</Text><Text style={styles.dataValue}>{section.data.activity}</Text></View>
          </View>
        )}

        {key === 'anamnesis' && (
          <View style={styles.dataGrid}>
             <View style={styles.dataRow}><Text style={styles.dataLabel}>{t('metrics.fields.chronic')}</Text><Text style={styles.dataValue}>{section.data.chronic}</Text></View>
             <View style={styles.dataRow}><Text style={styles.dataLabel}>{t('metrics.fields.allergies')}</Text><Text style={styles.dataValue}>{section.data.allergies}</Text></View>
          </View>
        )}

        {key === 'notes' && (
          <Text style={styles.notesText}>{section.data.text}</Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft stroke="#717171" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('metrics.title')}</Text>
        <TouchableOpacity style={styles.backBtn}>
          <Share2 stroke="#717171" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {Object.keys(sections).map(key => renderSection(key, sections[key]))}
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
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    color: '#333333',
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 18,
    color: '#333333',
    fontWeight: '500',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addText: {
    fontSize: 18,
    color: '#306F6F',
    fontWeight: '600',
    marginLeft: 8,
  },
  filledSection: {
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
  },
  dataGrid: {
    gap: 15,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dataLabel: {
    fontSize: 16,
    color: '#717171',
  },
  dataValue: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  notesText: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
  },
  bottomSpacer: {
    height: 100,
  },
});


