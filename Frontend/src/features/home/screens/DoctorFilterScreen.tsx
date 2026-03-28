import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  Dimensions,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronDown, MapPin } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../../shared/components/Button';

const SPECIALISATIONS = [
  'General Practitioner',
  'Dentist',
  'Gastroenterologist',
  'Neurologist',
  'Pulmonologist',
];

const EXPERIENCE = ['<3 years', '3-10 years', '>10 years'];
const GENDER = ['Male', 'Female'];
const APPOINTMENT_TYPE = ['Virtual', 'In-person', 'All'];
const LOCATION = ['Near me', 'My city', 'All'];

export const DoctorFilterScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>(['Neurologist']);
  const [selectedExp, setSelectedExp] = useState('3-10 years');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedLoc, setSelectedLoc] = useState('My city');
  const [isUrgent, setIsUrgent] = useState(false);

  const toggleSpec = (spec: string) => {
    if (selectedSpecs.includes(spec)) {
      setSelectedSpecs(selectedSpecs.filter(s => s !== spec));
    } else {
      setSelectedSpecs([...selectedSpecs, spec]);
    }
  };

  const renderSectionHeader = (title: string) => (
    <Text style={styles.sectionTitle}>{title}</Text>
  );

  const renderPill = (item: string, current: string, setter: (v: string) => void) => (
    <TouchableOpacity 
      key={item}
      style={[styles.pill, current === item && styles.activePill]}
      onPress={() => setter(item)}
    >
      <Text style={[styles.pillText, current === item && styles.activePillText]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  const handleReset = () => {
    setSelectedSpecs([]);
    setSelectedExp('');
    setSelectedGender('');
    setSelectedType('All');
    setSelectedLoc('All');
    setIsUrgent(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerBtnText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Filter</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.headerBtnText, styles.applyBtnText]}>Apply</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Specialisations */}
        {renderSectionHeader('Specialisations')}
        {SPECIALISATIONS.map((spec) => (
          <TouchableOpacity 
            key={spec} 
            style={styles.checkboxRow}
            onPress={() => toggleSpec(spec)}
          >
            <View style={[styles.checkbox, selectedSpecs.includes(spec) && styles.categoryItemChecked]}>
              {selectedSpecs.includes(spec) && <View style={styles.checkInner} />}
            </View>
            <Text style={styles.checkboxLabel}>{spec}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.showAllBtn}>
           <ChevronDown color="#306F6F" size={20} />
           <Text style={styles.showAllText}>Show all</Text>
        </TouchableOpacity>

        {/* Experience */}
        {renderSectionHeader('Experience')}
        <View style={styles.pillRow}>
          {EXPERIENCE.map(item => renderPill(item, selectedExp, setSelectedExp))}
        </View>

        {/* Gender */}
        {renderSectionHeader('Gender')}
        <View style={styles.pillRow}>
          {GENDER.map(item => renderPill(item, selectedGender, setSelectedGender))}
        </View>

        {/* Type of appointment */}
        {renderSectionHeader('Type of appointment')}
        <View style={styles.pillRow}>
          {APPOINTMENT_TYPE.map(item => renderPill(item, selectedType, setSelectedType))}
        </View>

        {/* Location */}
        {renderSectionHeader('Location')}
        <View style={styles.pillRow}>
          {LOCATION.map(item => renderPill(item, selectedLoc, setSelectedLoc))}
        </View>

        {/* Urgent Switch */}
        <View style={styles.switchRow}>
           <View style={styles.switchLeft}>
              <MapPin color="#717171" size={24} />
              <Text style={styles.switchLabel}>Available for urgent consultation</Text>
           </View>
           <Switch
             value={isUrgent}
             onValueChange={setIsUrgent}
             trackColor={{ false: '#E0E8E8', true: '#306F6F' }}
             thumbColor="#FFFFFF"
           />
        </View>

        <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
           <Text style={styles.resetBtnText}>Reset filter</Text>
        </TouchableOpacity>

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
    height: 60,
  },
  headerBtnText: {
    fontSize: 16,
    color: '#306F6F',
    fontWeight: '500',
  },
  applyBtnText: {
    fontWeight: '700',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginTop: 25,
    marginBottom: 15,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#306F6F',
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryItemChecked: {
    backgroundColor: '#306F6F',
  },
  checkInner: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#717171',
    fontWeight: '500',
  },
  showAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  showAllText: {
    fontSize: 15,
    color: '#306F6F',
    marginLeft: 8,
    fontWeight: '600',
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  pill: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  activePill: {
    backgroundColor: '#EAF9F9',
    borderColor: '#306F6F',
  },
  pillText: {
    fontSize: 15,
    color: '#717171',
    fontWeight: '500',
  },
  activePillText: {
    color: '#306F6F',
    fontWeight: '700',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 20,
  },
  switchLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  switchLabel: {
    fontSize: 15,
    color: '#333333',
    fontWeight: '600',
    marginLeft: 15,
    flex: 1,
  },
  resetBtn: {
    marginTop: 30,
    alignItems: 'center',
  },
  resetBtnText: {
    fontSize: 16,
    color: '#FF5252',
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 100,
  },
});
