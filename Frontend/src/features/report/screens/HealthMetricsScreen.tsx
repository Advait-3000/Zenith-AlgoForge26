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
      setSections(prev => {
        const next = { ...prev };
        Object.keys(FILLED_TRACKER).forEach(key => {
          if (FILLED_TRACKER[key]) {
            next[key].isFilled = true;
          }
        });
        return next;
      });
    }, [])
  );

  const renderSection = (key: string, section: MetricSection) => {
    if (!section.isFilled) {
      return (
        <View key={key} style={styles.sectionRow}>
          <Text style={styles.sectionLabel}>{section.title}</Text>
          <TouchableOpacity 
            style={styles.addBtn}
            onPress={() => navigation.navigate('HealthMetricsEdit', { type: key })}
          >
            <Plus color="#306F6F" size={20} />
            <Text style={styles.addText}>Add</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // Filled State UI
    return (
      <View key={key} style={styles.filledSection}>
        <View style={styles.sectionHeader}>
           <Text style={styles.sectionTitle}>{section.title}</Text>
           <TouchableOpacity onPress={() => navigation.navigate('HealthMetricsEdit', { type: key })}>
              <Pencil color="#717171" size={20} />
           </TouchableOpacity>
        </View>

        {key === 'body' && (
          <View style={styles.dataGrid}>
             <View style={styles.dataRow}><Text style={styles.dataLabel}>Your height (sm)</Text><Text style={styles.dataValue}>{section.data.height}</Text></View>
             <View style={styles.dataRow}><Text style={styles.dataLabel}>Your weight (kg)</Text><Text style={styles.dataValue}>{section.data.weight}</Text></View>
             <View style={styles.dataRow}><Text style={styles.dataLabel}>Body Mass Index</Text><Text style={styles.dataValue}>{section.data.bmi}</Text></View>
             <View style={styles.dataRow}><Text style={styles.dataLabel}>Oxygen Saturation (%)</Text><Text style={styles.dataValue}>{section.data.oxygen}</Text></View>
             <View style={styles.dataRow}><Text style={styles.dataLabel}>Blood pressure (mmHg)</Text><Text style={styles.dataValue}>{section.data.pressure}</Text></View>
             <View style={styles.dataRow}><Text style={styles.dataLabel}>Heart rate (bpm)</Text><Text style={styles.dataValue}>{section.data.heartRate}</Text></View>
             <View style={styles.dataRow}><Text style={styles.dataLabel}>Blood type</Text><Text style={styles.dataValue}>{section.data.bloodType}</Text></View>
          </View>
        )}

        {key === 'lifestyle' && (
          <View style={styles.dataGrid}>
             <View style={styles.dataRow}><Text style={styles.dataLabel}>Sleep (h)</Text><Text style={styles.dataValue}>{section.data.sleep}</Text></View>
             <View style={styles.dataRow}><Text style={styles.dataLabel}>Water intake (l)</Text><Text style={styles.dataValue}>{section.data.water}</Text></View>
             <View style={styles.dataRow}><Text style={styles.dataLabel}>Smoking</Text><Text style={styles.dataValue}>{section.data.smoking}</Text></View>
             <View style={styles.dataRow}><Text style={styles.dataLabel}>Alcohol</Text><Text style={styles.dataValue}>{section.data.alcohol}</Text></View>
             <View style={styles.dataRow}><Text style={styles.dataLabel}>Activity Level</Text><Text style={styles.dataValue}>{section.data.activity}</Text></View>
          </View>
        )}

        {key === 'anamnesis' && (
          <View style={styles.dataGrid}>
             <View style={styles.dataRow}><Text style={styles.dataLabel}>Chronic conditions</Text><Text style={styles.dataValue}>{section.data.chronic}</Text></View>
             <View style={styles.dataRow}><Text style={styles.dataLabel}>Allergies</Text><Text style={styles.dataValue}>{section.data.allergies}</Text></View>
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
          <ArrowLeft color="#717171" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Health metrics</Text>
        <TouchableOpacity style={styles.backBtn}>
          <Share2 color="#717171" size={24} />
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
