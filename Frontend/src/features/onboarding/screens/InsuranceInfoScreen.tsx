import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  ScrollView, 
  TouchableOpacity, 
  Modal,
  TextInput,
  Dimensions, 
  KeyboardAvoidingView, 
  Platform,
  FlatList
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Calendar, ChevronDown, Check } from 'lucide-react-native';
import { ProgressBar } from '../../../shared/components/ProgressBar';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const COUNTRIES = [
  { name: 'United States', code: '+1', flag: '🇺🇸' },
  { name: 'United Kingdom', code: '+44', flag: '🇬🇧' },
  { name: 'India', code: '+91', flag: '🇮🇳' },
];

const ITEM_HEIGHT = 44;

export const InsuranceInfoScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [formData, setFormData] = useState({
    insuranceProvider: '',
    policyNumber: '',
    policyExpiry: '',
    providerContact: '',
  });

  const [country, setCountry] = useState(COUNTRIES[0]);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isCountryPickerVisible, setIsCountryPickerVisible] = useState(false);

  // Date Picker Wheels State
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [selectedYear, setSelectedYear] = useState(2024);

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const years = Array.from({ length: 20 }, (_, i) => 2024 + i);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = 
    formData.insuranceProvider && 
    formData.policyNumber && 
    formData.policyExpiry && 
    formData.providerContact;

  const handleExpirySave = () => {
    const formattedDate = `${selectedDay} ${selectedMonth} ${selectedYear}`;
    handleInputChange('policyExpiry', formattedDate);
    setIsDatePickerVisible(false);
  };

  const handleScroll = (event: any, type: 'day' | 'month' | 'year') => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    
    if (type === 'day') setSelectedDay(days[index] || 1);
    if (type === 'month') setSelectedMonth(months[index] || 'January');
    if (type === 'year') setSelectedYear(years[index] || 2024);
  };

  // ---------------- Render Helpers ----------------

  const renderWheel = (data: any[], type: 'day' | 'month' | 'year') => (
    <ScrollView
      style={styles.wheelScroll}
      showsVerticalScrollIndicator={false}
      snapToInterval={ITEM_HEIGHT}
      onMomentumScrollEnd={(e) => handleScroll(e, type)}
      contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 2 }}
    >
      {data.map((item) => {
        const isSelected = 
          (type === 'day' && selectedDay === item) ||
          (type === 'month' && selectedMonth === item) ||
          (type === 'year' && selectedYear === item);
        
        return (
          <View key={item} style={styles.wheelItem}>
            <Text style={[styles.wheelText, isSelected && styles.activeWheelText]}>
              {item}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );

  const renderBirthdayModal = () => (
    <Modal
      visible={isDatePickerVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setIsDatePickerVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Choose expiry date</Text>
          
          <View style={styles.datePickerContainer}>
            <View style={styles.selectionOverlay} pointerEvents="none" />
            <View style={styles.wheelWrapper}>{renderWheel(days, 'day')}</View>
            <View style={[styles.wheelWrapper, { flex: 1.5 }]}>{renderWheel(months, 'month')}</View>
            <View style={styles.wheelWrapper}>{renderWheel(years, 'year')}</View>
          </View>

          <Button 
            title="Save date" 
            onPress={handleExpirySave} 
            style={styles.modalSaveButton} 
          />
          <Button 
            title="Cancel" 
            onPress={() => setIsDatePickerVisible(false)} 
            variant="outline" 
          />
        </View>
      </View>
    </Modal>
  );

  const renderCountryModal = () => (
    <Modal
      visible={isCountryPickerVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setIsCountryPickerVisible(false)}
    >
      <View style={styles.modalOverlayBottom}>
        <View style={styles.bottomSheet}>
          <Text style={styles.modalTitleSmall}>Choose country</Text>
          <ScrollView>
            {COUNTRIES.map((item) => (
              <TouchableOpacity 
                key={item.name} 
                style={styles.relOption}
                onPress={() => {
                  setCountry(item);
                  setIsCountryPickerVisible(false);
                }}
              >
                <Text style={styles.relOptionText}>{item.flag} {item.name} ({item.code})</Text>
                {country.name === item.name && <Check color="#306F6F" size={20} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft color="#212121" size={24} />
          </TouchableOpacity>
          <ProgressBar totalSteps={6} currentStep={5} />
          <TouchableOpacity onPress={() => navigation.navigate('Main')}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Insurance Information</Text>
          <Text style={styles.subtitle}>Providing insurance details helps streamline billing and your care process.</Text>

          <Input
            label="Insurance provider"
            placeholder="Enter name of the insurance company"
            value={formData.insuranceProvider}
            onChangeText={(v: string) => handleInputChange('insuranceProvider', v)}
          />
          
          <Input
            label="Policy number"
            placeholder="000000000"
            keyboardType="numeric"
            value={formData.policyNumber}
            onChangeText={(v: string) => handleInputChange('policyNumber', v)}
          />

          <TouchableOpacity onPress={() => setIsDatePickerVisible(true)}>
            <Input
              label="Policy expiry date"
              placeholder="Enter policy expiry date"
              value={formData.policyExpiry}
              editable={false}
              pointerEvents="none"
              icon={<Calendar color="#A0A0A0" size={24} />}
            />
          </TouchableOpacity>

          <View style={styles.fieldLabelRow}>
            <Text style={styles.fieldLabel}>Provider contact</Text>
          </View>
          <View style={styles.phoneInputContainer}>
            <TouchableOpacity 
              style={styles.countryPicker}
              onPress={() => setIsCountryPickerVisible(true)}
            >
              <Text style={styles.flag}>{country.flag}</Text>
              <Text style={styles.countryCode}>{country.code}</Text>
              <ChevronDown color="#212121" size={16} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TextInput
              style={styles.phoneInput}
              placeholder="000 000 0000"
              placeholderTextColor="#A0A0A0"
              keyboardType="phone-pad"
              value={formData.providerContact}
              onChangeText={(v: string) => handleInputChange('providerContact', v)}
            />
          </View>

          <View style={styles.footerSpacer} />
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Save data"
            disabled={!isFormValid}
            onPress={() => {
              console.log('Registration Complete:', formData);
              navigation.replace('Main');
            }}
          />
        </View>
      </KeyboardAvoidingView>

      {renderBirthdayModal()}
      {renderCountryModal()}
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
    paddingHorizontal: 20,
    marginTop: 10,
    justifyContent: 'space-between',
  },
  skipText: {
    fontSize: 16,
    color: '#306F6F',
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#717171',
    lineHeight: 22,
    marginBottom: 30,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212121',
    marginBottom: 8,
  },
  fieldLabelRow: {
    width: '100%',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F9F9',
    height: 58,
    borderRadius: 29,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  countryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flag: {
    fontSize: 20,
    marginRight: 8,
  },
  countryCode: {
    fontSize: 16,
    color: '#212121',
    marginRight: 4,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#E0E8E8',
    marginHorizontal: 12,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: '#212121',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
  },
  footerSpacer: {
    height: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalOverlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 30,
    width: '100%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#212121',
    textAlign: 'center',
    marginBottom: 30,
  },
  modalTitleSmall: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 30,
    color: '#212121',
  },
  datePickerContainer: {
    flexDirection: 'row',
    height: ITEM_HEIGHT * 5,
    width: '100%',
    marginBottom: 30,
    position: 'relative',
  },
  selectionOverlay: {
    position: 'absolute',
    top: ITEM_HEIGHT * 2,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    backgroundColor: '#EAF8F8',
    borderRadius: 10,
    zIndex: -1,
  },
  wheelWrapper: {
    flex: 1,
  },
  wheelScroll: {
    height: '100%',
  },
  wheelItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wheelText: {
    fontSize: 18,
    color: '#C0C0C0',
  },
  activeWheelText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212121',
  },
  modalSaveButton: {
    marginBottom: 12,
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    maxHeight: '60%',
  },
  relOption: {
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  relOptionText: {
    fontSize: 18,
    color: '#212121',
  },
});
