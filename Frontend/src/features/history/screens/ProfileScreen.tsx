import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Heart, 
  BookUser, 
  ShieldCheck, 
  Bell, 
  CreditCard, 
  Mail, 
  Lock, 
  LogOut,
  ChevronRight,
  Stethoscope,
  HelpCircle,
  Globe
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../../../shared/components/LanguageSwitcher';

const { width } = Dimensions.get('window');

const USER_IMG = 'https://img.freepik.com/free-photo/portrait-successful-businessman-wearing-gray-suit-against-concrete-wall_23-2148127025.jpg';

export const ProfileScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<any>();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);

  const PROFILE_ITEMS = [
    { id: '1', title: t('profile.favoriteDoctors', 'Favorite doctors'), icon: Heart, route: null },
    { id: '2', title: t('profile.emergencyContact', 'Emergency contact'), icon: BookUser, route: 'EmergencyContact' },
    { id: '3', title: t('profile.insuranceInfo', 'Insurance information'), icon: Stethoscope, route: 'InsuranceInfo' },
    { id: '4', title: t('profile.notificationSettings', 'Notification settings'), icon: Bell, route: 'NotificationSettings' },
    { id: '5', title: t('profile.faq', 'FAQ'), icon: HelpCircle, route: 'FAQ' },
    { id: '6', title: t('profile.paymentSettings', 'Payment settings'), icon: CreditCard, route: null },
    { id: '7', title: t('profile.changeEmail', 'Change email'), icon: Mail, route: 'ChangeEmail' },
    { id: '8', title: t('profile.securitySettings', 'Security settings'), icon: Lock, route: null },
  ];

  const handleLogout = () => {
    setShowLogoutModal(false);
    navigation.replace('Login');
  };

  const getLanguageLabel = (code: string) => {
    switch (code) {
      case 'en': return 'English';
      case 'hi': return 'हिन्दी';
      case 'mr': return 'मराठी';
      case 'gu': return 'ગુજરાતી';
      default: return code;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{t('common.profile')}</Text>

        {/* User Card */}
        <TouchableOpacity style={styles.userCard} onPress={() => navigation.navigate('EditProfile')}>
          <Image source={{ uri: USER_IMG }} style={styles.userImg} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{t('profile.userName')}</Text>
            <Text style={styles.userBirth}>{t('profile.userAge', { age: 56 })} {t('profile.userBirthDate', { date: '05 Jul 1989' })}</Text>
          </View>
          <ChevronRight stroke="#717171" size={24} />
        </TouchableOpacity>

        {/* List Items */}
        <View style={styles.listContainer}>
          {PROFILE_ITEMS.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.listItem}
              onPress={() => item.route && navigation.navigate(item.route)}
            >
              <View style={styles.itemLeft}>
                <item.icon stroke="#306F6F" size={24} />
                <Text style={styles.itemTitle}>{item.title}</Text>
              </View>
              <ChevronRight stroke="#717171" size={20} />
            </TouchableOpacity>
          ))}

          {/* Language Switcher Item */}
          <TouchableOpacity style={styles.listItem} onPress={() => setShowLangModal(true)}>
             <View style={styles.itemLeft}>
               <Globe stroke="#306F6F" size={24} />
               <Text style={styles.itemTitle}>{t('common.language')}</Text>
             </View>
             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ marginRight: 8, color: '#717171', fontWeight: '600' }}>
                   {getLanguageLabel(i18n.language)}
                </Text>
                <ChevronRight stroke="#717171" size={20} />
             </View>
          </TouchableOpacity>

          {/* Logout Item */}
          <TouchableOpacity style={styles.listItem} onPress={() => setShowLogoutModal(true)}>
            <View style={styles.itemLeft}>
              <LogOut stroke="#306F6F" size={24} />
              <Text style={styles.itemTitle}>{t('profile.logout')}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Logout Modal */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
           <View style={styles.modalContent}>
              <View style={styles.modalIconBox}>
                 <LogOut stroke="#FBB03B" size={32} />
              </View>
              <Text style={styles.modalTitle}>Are you sure you want to log out?</Text>
              <Text style={styles.modalSubtitle}>While logged out, you may miss critical notifications and reminders</Text>
              
              <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                 <Text style={styles.logoutBtnText}>{t('common.login', 'Log out')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowLogoutModal(false)}>
                 <Text style={styles.cancelBtnText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
           </View>
        </View>
      </Modal>

      <LanguageSwitcher visible={showLangModal} onClose={() => setShowLangModal(false)} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FEFE',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 30,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 4,
  },
  userImg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F0F0F0',
  },
  userInfo: {
    flex: 1,
    marginLeft: 18,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 4,
  },
  userBirth: {
    fontSize: 15,
    color: '#717171',
    fontWeight: '500',
  },
  listContainer: {
    marginTop: 10,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F5F5',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 17,
    fontWeight: '500',
    color: '#212121',
    marginLeft: 15,
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
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#717171',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  logoutBtn: {
    width: '100%',
    height: 60,
    borderRadius: 30,
    backgroundColor: '#306F6F',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoutBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  cancelBtn: {
    width: '100%',
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#306F6F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#306F6F',
    fontSize: 17,
    fontWeight: '700',
  },
});


