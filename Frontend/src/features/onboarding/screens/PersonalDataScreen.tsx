import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  // Using native ScrollView/TouchableOpacity as requested
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
import { 
  ArrowLeft, 
  Calendar, 
  ChevronDown, 
  Search, 
  MapPin, 
  X,
  Check
} from 'lucide-react-native';
import { ProgressBar } from '../../../shared/components/ProgressBar';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const CITIES = [
  'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 
  'Houston, TX', 'Phoenix, AZ', 'Philadelphia, PA', 
  'San Antonio, TX', 'San Diego, CA', 'Dallas, TX',
  'Boston, MA', 'Seattle, WA', 'Denver, CO'
];

const COUNTRIES = [
  { name: 'United States', code: '+1', flag: '🇺🇸' },
  { name: 'United Kingdom', code: '+44', flag: '🇬🇧' },
  { name: 'India', code: '+91', flag: '🇮🇳' },
];

const ITEM_HEIGHT = 44;

export const PersonalDataScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  // State for form fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    phoneNumber: '',
    email: '',
    city: '',
    address: '',
  });

  const [country, setCountry] = useState(COUNTRIES[0]);

  // State for modals
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isCitySearchVisible, setIsCitySearchVisible] = useState(false);
  const [isCountryPickerVisible, setIsCountryPickerVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Date Picker Wheels State
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [selectedYear, setSelectedYear] = useState(1990);

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const years = Array.from({ length: 100 }, (_, i) => 2024 - i);

  const isFormValid = 
    formData.firstName && 
    formData.lastName && 
    formData.dob && 
    formData.phoneNumber && 
    formData.email && 
    formData.city && 
    formData.address;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCitySelect = (city: string) => {
    handleInputChange('city', city);
    setIsCitySearchVisible(false);
  };

  const handleDobSave = () => {
    const formattedDate = `${selectedDay} ${selectedMonth} ${selectedYear}`;
    handleInputChange('dob', formattedDate);
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
          <Text style={styles.modalTitle}>Choose your birth date</Text>
          
          <View style={styles.datePickerContainer}>
            <View style={styles.selectionOverlay} pointerEvents="none" />
            <View style={styles.wheelWrapper}>{renderWheel(days, 'day')}</View>
            <View style={[styles.wheelWrapper, { flex: 1.5 }]}>{renderWheel(months, 'month')}</View>
            <View style={styles.wheelWrapper}>{renderWheel(years, 'year')}</View>
          </View>

          <Button 
            title="Save date" 
            onPress={handleDobSave} 
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

  // Simplified Country Picker to match emergency screen
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

  const renderCityModal = () => (
    <Modal
      visible={isCitySearchVisible}
      animationType="slide"
      onRequestClose={() => setIsCitySearchVisible(false)}
    >
      <SafeAreaView style={styles.fullModalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setIsCitySearchVisible(false)}>
            <ArrowLeft color="#212121" size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.citySearchContent}>
          <Text style={styles.cityHeaderLarge}>City</Text>
          
          <View style={styles.searchBox}>
            <Search color="#A0A0A0" size={20} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#A0A0A0"
              autoFocus
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X color="#A0A0A0" size={20} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity 
            style={styles.currentLocationRow} 
            onPress={() => handleCitySelect('Current Location, NY')}
          >
            <MapPin color="#306F6F" size={20} />
            <Text style={styles.currentLocationText}>Use current location</Text>
          </TouchableOpacity>

          <ScrollView style={styles.cityResults}>
            {CITIES.filter(c => c.toLowerCase().includes(searchQuery.toLowerCase())).map((city) => (
              <TouchableOpacity 
                key={city} 
                style={styles.cityItem} 
                onPress={() => handleCitySelect(city)}
              >
                <Text style={styles.cityItemText}>{city}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft color="#212121" size={24} />
          </TouchableOpacity>
          <ProgressBar totalSteps={6} currentStep={1} />
        </View>

        <ScrollView 
          style={styles.scroll} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.title}>Personal data</Text>
          <Text style={styles.subtitle}>Provide your personal data to book visits in just a few clicks.</Text>

          <Input
            label="First name"
            placeholder="Enter your name"
            value={formData.firstName}
            onChangeText={(v) => handleInputChange('firstName', v)}
          />
          
          <Input
            label="Last name"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChangeText={(v) => handleInputChange('lastName', v)}
          />

          <TouchableOpacity onPress={() => setIsDatePickerVisible(true)}>
            <Input
              label="Date of birth"
              placeholder="DD/MM/YY"
              value={formData.dob}
              editable={false}
              pointerEvents="none"
              icon={<Calendar color="#A0A0A0" size={24} />}
            />
          </TouchableOpacity>

          <View style={styles.phoneLabelRow}>
            <Text style={styles.fieldLabel}>Phone number</Text>
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
              value={formData.phoneNumber}
              onChangeText={(v) => handleInputChange('phoneNumber', v)}
            />
          </View>

          <Input
            label="Email"
            placeholder="youremail@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(v) => handleInputChange('email', v)}
          />

          <TouchableOpacity onPress={() => setIsCitySearchVisible(true)}>
            <Input
              label="City"
              placeholder="Enter or choose your city"
              value={formData.city}
              editable={false}
              pointerEvents="none"
              icon={<ChevronDown color="#A0A0A0" size={20} />}
            />
          </TouchableOpacity>

          <Input
            label="Address"
            placeholder="Street Name, Building, Apartment"
            value={formData.address}
            onChangeText={(v) => handleInputChange('address', v)}
          />

          <View style={styles.footerSpacer} />
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Next"
            disabled={!isFormValid}
            onPress={() => navigation.navigate('EmergencyContact')}
          />
        </View>
      </KeyboardAvoidingView>

      {renderBirthdayModal()}
      {renderCityModal()}
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
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
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
    fontSize: 17,
    fontWeight: '400',
    color: '#717171',
    lineHeight: 24,
    marginBottom: 30,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212121',
    marginBottom: 8,
  },
  phoneLabelRow: {
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
  fullModalContainer: {
    flex: 1,
    backgroundColor: '#F7FEFE',
  },
  modalHeader: {
    paddingHorizontal: 20,
    height: 60,
    justifyContent: 'center',
  },
  citySearchContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  cityHeaderLarge: {
    fontSize: 28,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 20,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF9F9',
    height: 56,
    borderRadius: 28,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 17,
    color: '#212121',
  },
  currentLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 20,
  },
  currentLocationText: {
    fontSize: 17,
    color: '#212121',
    marginLeft: 12,
  },
  cityResults: {
    flex: 1,
  },
  cityItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F5F5',
  },
  cityItemText: {
    fontSize: 17,
    color: '#212121',
  },
});
