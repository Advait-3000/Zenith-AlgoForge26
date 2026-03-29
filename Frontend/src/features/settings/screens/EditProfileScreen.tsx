import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  TextInput, 
  Modal, 
  Dimensions,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Calendar, 
  ChevronDown, 
  X,
  Trash2,
  PencilLine
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { getUserData, updateUserProfile } from '../../../shared/services/api';

const { width, height } = Dimensions.get('window');

const USER_IMG = 'https://img.freepik.com/free-photo/portrait-successful-businessman-wearing-gray-suit-against-concrete-wall_23-2148127025.jpg';

export const EditProfileScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    phone: '',
    city: '',
    address: ''
  });

  // Load real user data on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await getUserData();
        if (user) {
          const nameParts = (user.full_name || '').split(' ');
          setFormData({
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            dob: user.patient_details?.date_of_birth || '',
            phone: user.contact_number || '',
            city: '',
            address: '',
          });
        }
      } catch (err) {
        console.warn('Failed to load user:', err);
      }
    };
    loadUser();
  }, []);

  const handleCancel = () => {
    setShowDiscardModal(true);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      await updateUserProfile({
        full_name: fullName,
        contact_number: formData.phone,
        patient_details: {
          date_of_birth: formData.dob,
        },
      });
      Alert.alert('Success', 'Profile updated successfully!');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const confirmDiscard = () => {
    setShowDiscardModal(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel}>
          <Text style={styles.cancelText}>{t('common.cancel')}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('profile.personalInfo')}</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveText}>{t('common.save')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Photo */}
        <View style={styles.photoSection}>
          <Image source={{ uri: USER_IMG }} style={styles.avatar} />
          <TouchableOpacity style={styles.deletePhotoBtn}>
            <Trash2 stroke="#FF5252" size={18} />
            <Text style={styles.deletePhotoText}>{t('profile.deletePhoto')}</Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={[styles.inputGroup, { marginTop: 10 }]}>
            <Text style={styles.label}>{t('profile.firstName')}</Text>
            <TextInput 
              style={styles.input} 
              value={formData.firstName}
              onChangeText={(text) => setFormData({...formData, firstName: text})}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('profile.lastName')}</Text>
            <TextInput 
              style={styles.input} 
              value={formData.lastName}
              onChangeText={(text) => setFormData({...formData, lastName: text})}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('profile.dob')}</Text>
            <View style={styles.inputWrapper}>
              <TextInput 
                style={styles.cleanInput} 
                value={formData.dob}
                editable={false}
              />
              <View style={styles.inputIcon}>
                <Calendar stroke="#717171" size={24} />
              </View>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('profile.phone')}</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.countryPicker}>
                <Image source={{ uri: 'https://flagcdn.com/w40/us.png' }} style={styles.flag} />
                <Text style={styles.countryCode}>+1</Text>
                <ChevronDown stroke="#717171" size={18} />
              </View>
              <View style={styles.divider} />
              <TextInput 
                style={styles.cleanInput} 
                value={formData.phone}
                keyboardType="phone-pad"
                onChangeText={(text) => setFormData({...formData, phone: text})}
              />
              <TouchableOpacity onPress={() => setFormData({...formData, phone: ''})}>
                <View style={styles.inputIcon}>
                  <X stroke="#A0A0A0" size={20} />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('profile.city')}</Text>
            <View style={styles.inputWrapper}>
              <TextInput 
                style={styles.cleanInput} 
                value={formData.city}
                editable={false}
              />
              <View style={styles.inputIcon}>
                <ChevronDown stroke="#717171" size={24} />
              </View>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('profile.address')}</Text>
            <TextInput 
              style={styles.input} 
              value={formData.address}
              multiline
              onChangeText={(text) => setFormData({...formData, address: text})}
            />
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Discard Modal */}
      <Modal
        visible={showDiscardModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
           <View style={styles.modalContent}>
              <View style={styles.modalIconBox}>
                 <PencilLine stroke="#FBB03B" size={32} />
              </View>
              <Text style={styles.modalTitle}>{t('profile.discardChangesTitle')}</Text>
              <Text style={styles.modalSubtitle}>{t('profile.discardChangesSub')}</Text>
              
              <TouchableOpacity style={styles.discardBtn} onPress={confirmDiscard}>
                 <Text style={styles.discardBtnText}>Yes, discard</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.keepBtn} onPress={() => setShowDiscardModal(false)}>
                 <Text style={styles.keepBtnText}>No, keep</Text>
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
    paddingVertical: 15,
  },
  cancelText: {
    fontSize: 17,
    color: '#306F6F',
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#333333',
  },
  saveText: {
    fontSize: 17,
    color: '#306F6F',
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  photoSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  deletePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deletePhotoText: {
    fontSize: 16,
    color: '#FF5252',
    fontWeight: '600',
  },
  form: {
    marginTop: 20,
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 10,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#FFFFFF',
    height: 60,
    borderRadius: 30,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#333333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cleanInput: {
    flex: 1,
    height: 60,
    fontSize: 16,
    color: '#333333',
    paddingHorizontal: 0,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    height: 60,
    borderRadius: 30,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  inputIcon: {
    marginLeft: 10,
  },
  countryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flag: {
    width: 28,
    height: 20,
    borderRadius: 4,
  },
  countryCode: {
    fontSize: 16,
    color: '#333333',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#E0E8E8',
    marginHorizontal: 15,
  },
  bottomSpacer: {
    height: 100,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.85,
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    padding: 30,
    alignItems: 'center',
  },
  modalIconBox: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFF7E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#717171',
    textAlign: 'center',
    marginBottom: 30,
  },
  discardBtn: {
    width: '100%',
    height: 60,
    borderRadius: 30,
    backgroundColor: '#306F6F',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  discardBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  keepBtn: {
    width: '100%',
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#306F6F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keepBtnText: {
    color: '#306F6F',
    fontSize: 17,
    fontWeight: '700',
  },
});


