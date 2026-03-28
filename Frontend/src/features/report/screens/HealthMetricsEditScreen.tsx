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
  Droplet
} from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { markSectionFilled } from './HealthMetricsScreen';

const { width } = Dimensions.get('window');

export const HealthMetricsEditScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { type } = route.params || { type: 'body' };

  const [formData, setFormData] = useState<any>({});

  const handleSave = () => {
    markSectionFilled(type);
    navigation.goBack();
  };

  const renderBodyForm = () => (
    <View style={styles.form}>
      <View style={styles.row}>
         <View style={styles.halfInput}>
            <Text style={styles.inputLabel}>Your height (sm)</Text>
            <TextInput style={styles.textInput} defaultValue="172" keyboardType="numeric" />
         </View>
         <View style={styles.halfInput}>
            <Text style={styles.inputLabel}>Your weight (kg)</Text>
            <TextInput style={styles.textInput} defaultValue="85" keyboardType="numeric" />
         </View>
      </View>

      <View style={styles.fullInput}>
         <Text style={styles.inputLabel}>Oxygen Saturation (%)</Text>
         <TextInput style={styles.textInput} defaultValue="97" keyboardType="numeric" />
      </View>

      <View style={styles.fullInput}>
         <Text style={styles.inputLabel}>Heart rate (bpm)</Text>
         <TextInput style={styles.textInput} defaultValue="77" keyboardType="numeric" />
      </View>

      <View style={styles.fullInput}>
         <Text style={styles.inputLabel}>Blood pressure (mmHg)</Text>
         <View style={styles.pressureRow}>
           <TextInput style={[styles.textInput, { flex: 1 }]} defaultValue="120" keyboardType="numeric" />
           <Text style={styles.slash}>/</Text>
           <TextInput style={[styles.textInput, { flex: 1 }]} defaultValue="80" keyboardType="numeric" />
         </View>
      </View>

      <Text style={styles.inputLabel}>Blood type</Text>
      <View style={styles.bloodTypeGrid}>
        {['O (I)', 'A (II)', 'B (III)', 'AB (IV)'].map(bt => (
           <TouchableOpacity key={bt} style={[styles.btBtn, bt.includes('B') && styles.btBtnActive]}>
              <Droplet color={bt.includes('B') ? "#FFFFFF" : "#306F6F"} size={24} />
              <Text style={[styles.btText, bt.includes('B') && styles.btTextActive]}>{bt}</Text>
           </TouchableOpacity>
        ))}
      </View>

      <View style={styles.rhRow}>
        <TouchableOpacity style={[styles.rhBtn, styles.rhBtnActive]}><Text style={styles.rhTextActive}>Rh +</Text></TouchableOpacity>
        <TouchableOpacity style={styles.rhBtn}><Text style={styles.rhText}>Rh —</Text></TouchableOpacity>
      </View>
    </View>
  );

  const renderLifestyleForm = () => (
    <View style={styles.form}>
      <Text style={styles.inputLabel}>Sleep (h)</Text>
      <View style={styles.pillGrid}>
        {['<7', '7-8', '>8'].map(p => (
           <TouchableOpacity key={p} style={[styles.pill, p === '7-8' && styles.pillActive]}><Text style={[styles.pillText, p === '7-8' && styles.pillTextActive]}>{p}</Text></TouchableOpacity>
        ))}
      </View>

      <Text style={styles.inputLabel}>Water intake (l)</Text>
      <View style={styles.pillGrid}>
        {['<1', '1-1,5', '>1,5'].map(p => (
           <TouchableOpacity key={p} style={[styles.pill, p === '1-1,5' && styles.pillActive]}><Text style={[styles.pillText, p === '1-1,5' && styles.pillTextActive]}>{p}</Text></TouchableOpacity>
        ))}
      </View>

      <Text style={styles.inputLabel}>Smoking</Text>
      <View style={styles.pillGrid}>
        {['Yes', 'No', 'Occasionally'].map(p => (
           <TouchableOpacity key={p} style={[styles.pill, p === 'No' && styles.pillActive]}><Text style={[styles.pillText, p === 'No' && styles.pillTextActive]}>{p}</Text></TouchableOpacity>
        ))}
      </View>

      <Text style={styles.inputLabel}>Alcohol</Text>
      <View style={styles.pillGrid}>
        {['Yes', 'No', 'Occasionally'].map(p => (
           <TouchableOpacity key={p} style={[styles.pill, p === 'Occasionally' && styles.pillActive]}><Text style={[styles.pillText, p === 'Occasionally' && styles.pillTextActive]}>{p}</Text></TouchableOpacity>
        ))}
      </View>

      <Text style={styles.inputLabel}>Activity Level</Text>
      <View style={styles.activityGrid}>
        <TouchableOpacity style={styles.activityBtn}><Text style={styles.activityText}>Light (sports 1-3 days a week)</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.activityBtn, styles.activityBtnActive]}><Text style={styles.activityTextActive}>Moderate (sports 3-5 days a week)</Text></TouchableOpacity>
        <TouchableOpacity style={styles.activityBtn}><Text style={styles.activityText}>Very Active (sports 6-7 days a week)</Text></TouchableOpacity>
      </View>
    </View>
  );

  const renderAnamnesisForm = () => (
    <View style={styles.form}>
      <View style={styles.fullInput}>
         <Text style={styles.inputLabel}>Chronic conditions</Text>
         <TextInput style={styles.textInput} defaultValue="Migraines" />
      </View>
      <View style={styles.fullInput}>
         <Text style={styles.inputLabel}>Allergies</Text>
         <TextInput style={styles.textInput} defaultValue="Peanuts" />
      </View>
    </View>
  );

  const renderNotesForm = () => (
    <View style={styles.form}>
      <Text style={styles.inputLabel}>Clinical Notes</Text>
      <TextInput 
        style={[styles.textInput, { height: 200, textAlignVertical: 'top', paddingTop: 15 }]} 
        multiline
        placeholder="Enter your notes here..."
      />
    </View>
  );

  const getTitle = () => {
    switch(type) {
      case 'body': return 'Body parameters';
      case 'lifestyle': return 'Lifestyle';
      case 'anamnesis': return 'Anamnesis';
      case 'notes': return 'Anamnesis'; // Based on requirements for a "similar screen"
      default: return 'Health metrics';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{getTitle()}</Text>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {type === 'body' && renderBodyForm()}
        {type === 'lifestyle' && renderLifestyleForm()}
        {type === 'anamnesis' && renderAnamnesisForm()}
        {type === 'notes' && renderNotesForm()}
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
  cancelBtn: {
    padding: 5,
  },
  saveBtn: {
    padding: 5,
  },
  cancelText: {
    fontSize: 17,
    color: '#306F6F',
  },
  saveText: {
    fontSize: 17,
    color: '#306F6F',
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 19,
    color: '#333333',
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  form: {
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: (width - 64) / 2,
  },
  fullInput: {
    width: '100%',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 10,
    marginTop: 20,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    height: 56,
    borderRadius: 28,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#333333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  pressureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  slash: {
    fontSize: 24,
    color: '#717171',
    fontWeight: '300',
  },
  bloodTypeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  btBtn: {
    width: (width - 80) / 4,
    height: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  btBtnActive: {
    backgroundColor: '#306F6F',
  },
  btText: {
    fontSize: 14,
    color: '#717171',
    marginTop: 8,
  },
  btTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  rhRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    marginTop: 25,
  },
  rhBtn: {
    flex: 1,
    height: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  rhBtnActive: {
    backgroundColor: '#306F6F',
  },
  rhText: {
    fontSize: 18,
    color: '#717171',
  },
  rhTextActive: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  pillGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  pill: {
    flex: 1,
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  pillActive: {
    backgroundColor: '#306F6F',
  },
  pillText: {
    fontSize: 16,
    color: '#717171',
  },
  pillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  activityGrid: {
    gap: 12,
  },
  activityBtn: {
    height: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    paddingHorizontal: 20,
  },
  activityBtnActive: {
    backgroundColor: '#306F6F',
  },
  activityText: {
    fontSize: 16,
    color: '#717171',
  },
  activityTextActive: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 100,
  },
});
