import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  TextInput, 
  Dimensions, 
  Modal 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Stethoscope, 
  CheckCircle2, 
  XCircle,
  CreditCard as CardIcon,
  ChevronDown
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../../shared/components/Button';

const { width } = Dimensions.get('window');

const DOCTOR_THUMB = 'https://img.freepik.com/free-photo/pleased-young-female-doctor-white-coat-with-stethoscope-neck-standing-with-folded-arms-isolated-white-background_637285-3396.jpg';

export const BookingConfirmationScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [paymentMethod, setPaymentMethod] = useState('Credit card');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleBookAndPay = () => {
    // Randomly show success or error for demo purposes
    if (Math.random() > 0.2) {
      setShowSuccess(true);
    } else {
      setShowError(true);
    }
  };

  const renderInput = (label: string, placeholder: string, value: string) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput 
          style={styles.input} 
          placeholder={placeholder} 
          placeholderTextColor="#A0A0A0"
          value={value}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft stroke="#212121" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Booking confirmation</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Booking Details */}
        <Text style={styles.sectionTitle}>Booking details</Text>
        <View style={styles.doctorInfoRow}>
          <Image source={{ uri: DOCTOR_THUMB }} style={styles.doctorThumb} />
          <View style={styles.doctorText}>
            <Text style={styles.doctorName}>Dr. Charlotte Elizabeth Montgomery</Text>
            <Text style={styles.doctorSpecialty}>Cardiologist</Text>
          </View>
        </View>

        <View style={styles.detailList}>
          <View style={styles.detailItem}>
            <View style={styles.detailLeft}>
              <Calendar stroke="#306F6F" size={20} />
              <Text style={styles.detailLabel}>Date:</Text>
            </View>
            <Text style={styles.detailValue}>11 February</Text>
          </View>
          <View style={styles.detailItem}>
            <View style={styles.detailLeft}>
              <Clock stroke="#306F6F" size={20} />
              <Text style={styles.detailLabel}>Time:</Text>
            </View>
            <Text style={styles.detailValue}>10:30 - 11:00 PM</Text>
          </View>
          <View style={styles.detailItem}>
            <View style={styles.detailLeft}>
              <Stethoscope stroke="#306F6F" size={20} />
              <Text style={styles.detailLabel}>Type:</Text>
            </View>
            <Text style={styles.detailValue}>In-Person</Text>
          </View>
          <View style={styles.detailItem}>
            <View style={styles.detailLeft}>
              <MapPin stroke="#306F6F" size={20} />
              <Text style={styles.detailLabel}>Location:</Text>
            </View>
            <Text style={[styles.detailValue, { color: '#306F6F', fontWeight: '700' }]}>Mercy Heart Institute</Text>
          </View>
        </View>

        {/* Insurance */}
        <Text style={styles.sectionTitle}>Insurance information</Text>
        {renderInput('Insurance provider', 'Enter name of the insurance company', '')}
        {renderInput('Policy number', '000000000', '')}
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Policy expiry date</Text>
          <View style={styles.inputWrapper}>
            <TextInput style={styles.input} placeholder="Enter policy expiry date" placeholderTextColor="#A0A0A0" />
            <Calendar stroke="#717171" size={20} />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Provider contact</Text>
          <View style={styles.inputWrapper}>
             <View style={styles.countryPicker}>
                <Text style={styles.flag}>🇺🇸</Text>
                <Text style={styles.phoneCode}>+1</Text>
                <ChevronDown stroke="#717171" size={16} />
                <View style={styles.phoneDivider} />
             </View>
             <TextInput style={styles.input} placeholder="000 000 0000" placeholderTextColor="#A0A0A0" keyboardType="phone-pad" />
          </View>
        </View>

        {/* Price */}
        <Text style={styles.sectionTitle}>Price</Text>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Total Price:</Text>
          <Text style={styles.priceValue}>$150</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Insurance Coverage:</Text>
          <Text style={[styles.priceValue, { color: '#717171' }]}>-$100</Text>
        </View>
        <View style={styles.priceDivider} />
        <View style={styles.priceRow}>
           <Text style={styles.amountDueLabel}>Amount Due:</Text>
           <Text style={styles.amountDueValue}>$50</Text>
        </View>

        {/* Payment Method */}
        <Text style={styles.sectionTitle}>Payment Method</Text>
        {[
          { id: 'Apple Pay', name: 'Apple Pay', icon: '' },
          { id: 'Google Pay', name: 'Google Pay', icon: 'G' },
          { id: 'Credit card', name: 'Credit card', icon: <CardIcon stroke="#717171" size={20} /> },
        ].map((method) => (
          <TouchableOpacity 
            key={method.id} 
            style={styles.payMethodItem}
            onPress={() => setPaymentMethod(method.id)}
          >
            <View style={styles.payMethodLeft}>
               <View style={styles.payIconBox}>
                  {typeof method.icon === 'string' ? <Text style={styles.brandIcon}>{method.icon}</Text> : method.icon}
               </View>
               <Text style={styles.payMethodName}>{method.name}</Text>
            </View>
            <View style={styles.radioOuter}>
               {paymentMethod === method.id && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        ))}

        {paymentMethod === 'Credit card' && (
          <View style={styles.cardForm}>
            {renderInput('Cardholder Name', 'Enter full name', '')}
            {renderInput('Card Number', '**** **** **** ****', '')}
            <View style={styles.row}>
               <View style={{ flex: 1, marginRight: 15 }}>
                  {renderInput('Expiration Date', 'MM/YY', '')}
               </View>
               <View style={{ flex: 1 }}>
                  {renderInput('CVV', '***', '')}
               </View>
            </View>
          </View>
        )}

        <TouchableOpacity 
          style={styles.checkboxRow} 
          onPress={() => setAgreeTerms(!agreeTerms)}
        >
          <View style={[styles.checkbox, agreeTerms && styles.checkboxChecked]}>
             {agreeTerms && <CheckCircle2 stroke="#FFFFFF" size={14} />}
          </View>
          <Text style={styles.checkboxLabel}>I agree to the Terms and Conditions</Text>
        </TouchableOpacity>

        <View style={styles.buttonGroup}>
           <Button title="Book and pay" onPress={handleBookAndPay} />
           <TouchableOpacity 
             style={styles.changeDetailsBtn}
             onPress={() => navigation.goBack()}
           >
              <Text style={styles.changeDetailsText}>Change booking details</Text>
           </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Success Modal */}
      <Modal transparent visible={showSuccess} animationType="fade">
        <View style={styles.modalBg}>
           <View style={styles.modalContent}>
              <View style={styles.successCircle}>
                 <CheckCircle2 stroke="#306F6F" size={50} />
              </View>
              <Text style={styles.modalTitle}>Your appointment is successfully booked</Text>
              <Text style={styles.modalSubtitle}>The updates will appear in your profile.</Text>
              <Button 
                title="Go home" 
                onPress={() => {
                  setShowSuccess(false);
                  navigation.navigate('Main');
                }} 
              />
           </View>
        </View>
      </Modal>

      {/* Error Modal */}
      <Modal transparent visible={showError} animationType="fade">
        <View style={styles.modalBg}>
           <View style={styles.modalContent}>
              <View style={[styles.successCircle, { backgroundColor: '#FFECEC' }]}>
                 <XCircle stroke="#FF5252" size={50} />
              </View>
              <Text style={styles.modalTitle}>Booking Failed</Text>
              <Text style={styles.modalSubtitle}>Something went wrong. Please reattempt your booking.</Text>
              <Button 
                title="Try again" 
                onPress={() => setShowError(false)} 
              />
              <TouchableOpacity 
                style={[styles.changeDetailsBtn, { marginTop: 15 }]}
                onPress={() => {
                  setShowError(false);
                  navigation.navigate('Main');
                }}
              >
                 <Text style={styles.changeDetailsText}>Go home</Text>
              </TouchableOpacity>
           </View>
        </View>
      </Modal>

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
    marginTop: 10,
  },
  backBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 20,
  },
  doctorInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  doctorThumb: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EAF9F9',
  },
  doctorText: {
    marginLeft: 15,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#717171',
    marginTop: 2,
  },
  detailList: {
    marginBottom: 35,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 16,
    color: '#717171',
    marginLeft: 12,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 10,
  },
  inputWrapper: {
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#212121',
  },
  countryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  flag: {
    fontSize: 20,
    marginRight: 6,
  },
  phoneCode: {
    fontSize: 16,
    color: '#212121',
    fontWeight: '500',
    marginRight: 4,
  },
  phoneDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#EAF9F9',
    marginLeft: 10,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  priceLabel: {
    fontSize: 16,
    color: '#717171',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
  },
  priceDivider: {
    height: 1,
    backgroundColor: '#EAF9F9',
    marginVertical: 15,
  },
  amountDueLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
  },
  amountDueValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#212121',
  },
  payMethodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  payMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  payIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAF9F9',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  brandIcon: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
  },
  payMethodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#306F6F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#306F6F',
  },
  cardForm: {
    marginTop: 10,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#306F6F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#306F6F',
  },
  checkboxLabel: {
    fontSize: 15,
    color: '#333333',
    fontWeight: '500',
  },
  buttonGroup: {
    marginBottom: 40,
  },
  changeDetailsBtn: {
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#306F6F',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  changeDetailsText: {
    fontSize: 16,
    color: '#306F6F',
    fontWeight: '700',
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EAF9F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#212121',
    textAlign: 'center',
    marginBottom: 15,
  },
  modalSubtitle: {
    fontSize: 15,
    color: '#717171',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  bottomSpacer: {
    height: 20,
  },
});


