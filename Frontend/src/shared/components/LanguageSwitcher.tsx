import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'mr', label: 'मराठी' },
  { code: 'gu', label: 'ગુજરાતી' },
];

interface LanguageSwitcherProps {
  visible: boolean;
  onClose: () => void;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ visible, onClose }) => {
  const { i18n, t } = useTranslation();

  const changeLanguage = async (code: string) => {
    i18n.changeLanguage(code);
    try {
      await AsyncStorage.setItem('@app_language', code);
    } catch (e) {
      console.warn('Failed to save language preference:', e);
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <TouchableOpacity 
          activeOpacity={1} 
          style={styles.modalContent}
        >
          <View style={styles.header}>
            <Globe stroke="#306F6F" size={20} />
            <Text style={styles.title}>{t('common.selectLanguage')}</Text>
          </View>
          
          <FlatList
            data={LANGUAGES}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[
                  styles.langItem,
                  i18n.language === item.code && styles.activeItem
                ]}
                onPress={() => changeLanguage(item.code)}
              >
                <Text style={[
                  styles.langLabel,
                  i18n.language === item.code && styles.activeLabel
                ]}>
                  {item.label}
                </Text>
                {i18n.language === item.code && (
                  <Check stroke="#306F6F" size={20} />
                )}
              </TouchableOpacity>
            )}
            scrollEnabled={false}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
  },
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  activeItem: {
    backgroundColor: '#F0F9F9',
  },
  langLabel: {
    fontSize: 17,
    color: '#424242',
    fontWeight: '500',
  },
  activeLabel: {
    color: '#306F6F',
    fontWeight: '700',
  },
});

