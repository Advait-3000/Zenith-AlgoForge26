import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  ScrollView, 
  TouchableOpacity, 
  Modal, 
  TextInput,
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, ChevronDown, Check, Search, MapPin, X } from 'lucide-react-native';
import { ProgressBar } from '../../../shared/components/ProgressBar';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { SafeAreaView } from 'react-native-safe-area-context';

const RELATIONSHIPS = ['Spouse', 'Parent', 'Child', 'Friend', 'Other'];
const COUNTRIES = [
  { name: 'United States', code: '+1', flag: '🇺🇸' },
  { name: 'United Kingdom', code: '+44', flag: '🇬🇧' },
  { name: 'India', code: '+91', flag: '🇮🇳' },
];

const CITIES = [
  'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 
  'Houston, TX', 'Phoenix, AZ', 'Philadelphia, PA', 
  'San Antonio, TX', 'San Diego, CA', 'Dallas, TX',
  'Boston, MA', 'Seattle, WA', 'Denver, CO'
];

export const EmergencyContactScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    relationship: '',
    phoneNumber: '',
    email: '',
    city: '',
    address: '',
  });

  const [country, setCountry] = useState(COUNTRIES[0]);
  const [isRelationshipModalVisible, setIsRelationshipModalVisible] = useState(false);
  const [isCountryPickerVisible, setIsCountryPickerVisible] = useState(false);
  const [isCitySearchVisible, setIsCitySearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCitySelect = (city: string) => {
    handleInputChange('city', city);
    setIsCitySearchVisible(false);
  };

  const isFormValid = 
    formData.firstName && 
    formData.lastName && 
    formData.relationship && 
    formData.phoneNumber && 
    formData.city && 
    formData.address;

  const renderRelationshipModal = () => (
    <Modal
      visible={isRelationshipModalVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setIsRelationshipModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.bottomSheet}>
          <Text style={styles.modalTitle}>Select relationship</Text>
          <ScrollView>
            {RELATIONSHIPS.map((rel) => (
              <TouchableOpacity 
                key={rel} 
                style={styles.relOption}
                onPress={() => {
                  handleInputChange('relationship', rel);
                  setIsRelationshipModalVisible(false);
                }}
              >
                <Text style={styles.relOptionText}>{rel}</Text>
                {formData.relationship === rel && <View style={styles.checkIndicator} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Button 
            title="Save" 
            onPress={() => setIsRelationshipModalVisible(false)} 
            style={styles.modalSaveButton} 
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
      <View style={styles.modalOverlay}>
        <View style={styles.bottomSheet}>
          <Text style={styles.modalTitle}>Choose country</Text>
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
                {country.name === item.name && <Check stroke="#306F6F" size={20} />}
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
        <View style={styles.modalHeaderCity}>
          <TouchableOpacity onPress={() => setIsCitySearchVisible(false)}>
            <ArrowLeft stroke="#212121" size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.citySearchContent}>
          <Text style={styles.cityHeaderLarge}>City</Text>
          
          <View style={styles.searchBox}>
            <Search stroke="#A0A0A0" size={20} />
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
                <X stroke="#A0A0A0" size={20} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity 
            style={styles.currentLocationRow} 
            onPress={() => handleCitySelect('Current Location, NY')}
          >
            <MapPin stroke="#306F6F" size={20} />
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
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft stroke="#212121" size={24} />
          </TouchableOpacity>
          <ProgressBar totalSteps={6} currentStep={2} />
          <TouchableOpacity onPress={() => navigation.navigate('HealthAssessment')}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Emergency contact</Text>
          <Text style={styles.subtitle}>Provide an emergency contact to ensure swift communication with your close relatives in case of an urgent situation.</Text>

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

          <TouchableOpacity onPress={() => setIsRelationshipModalVisible(true)}>
            <Input
              label="Relationship"
              placeholder="Select your relationship"
              value={formData.relationship}
              editable={false}
              pointerEvents="none"
              icon={<ChevronDown stroke="#A0A0A0" size={20} />}
            />
          </TouchableOpacity>

          <View style={styles.fieldLabelRow}>
            <Text style={styles.fieldLabel}>Phone number</Text>
          </View>
          <View style={styles.phoneInputContainer}>
            <TouchableOpacity 
              style={styles.countryPicker}
              onPress={() => setIsCountryPickerVisible(true)}
            >
              <Text style={styles.flag}>{country.flag}</Text>
              <Text style={styles.countryCode}>{country.code}</Text>
              <ChevronDown stroke="#212121" size={16} />
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
            placeholder="Enter the email (optional)"
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
              icon={<ChevronDown stroke="#A0A0A0" size={20} />}
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
            onPress={() => navigation.navigate('HealthAssessment')}
          />
        </View>
      </KeyboardAvoidingView>

      {renderRelationshipModal()}
      {renderCountryModal()}
      {renderCityModal()}
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
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 30,
    color: '#212121',
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
  checkIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 6,
    borderColor: '#306F6F',
  },
  modalSaveButton: {
    marginTop: 20,
  },
  fullModalContainer: {
    flex: 1,
    backgroundColor: '#F7FEFE',
  },
  modalHeaderCity: {
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

