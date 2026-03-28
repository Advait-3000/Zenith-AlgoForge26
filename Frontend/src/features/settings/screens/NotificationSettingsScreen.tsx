import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft 
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NotificationService } from '../../../shared/services/NotificationService';

interface NotificationSettingsState {
  messages: boolean;
  testResults: boolean;
  bookingUpdates: boolean;
  medicationReminders: boolean;
  appointmentReminders: boolean;
  newPrescription: boolean;
}

export const NotificationSettingsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [settings, setSettings] = useState<NotificationSettingsState>({
    messages: false,
    testResults: true,
    bookingUpdates: false,
    medicationReminders: true,
    appointmentReminders: false,
    newPrescription: true,
  });

  useEffect(() => {
    NotificationService.requestPermissions();
  }, []);

  const toggleSwitch = (key: keyof NotificationSettingsState) => {
    const newValue = !settings[key];
    setSettings(prev => ({ ...prev, [key]: newValue }));

    if (newValue) {
      const item = SETTING_ITEMS.find(i => i.key === key);
      NotificationService.scheduleLocalNotification(
        "Notifications Enabled",
        `You will now receive updates for: ${item?.title || key}`
      );
    }
  };

  const SETTING_ITEMS: { id: string, title: string, key: keyof NotificationSettingsState }[] = [
    { id: '1', title: 'Messages', key: 'messages' },
    { id: '2', title: 'Test results', key: 'testResults' },
    { id: '3', title: 'Booking updates', key: 'bookingUpdates' },
    { id: '4', title: 'Medication reminders', key: 'medicationReminders' },
    { id: '5', title: 'Appointment reminders', key: 'appointmentReminders' },
    { id: '6', title: 'New prescription', key: 'newPrescription' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft stroke="#717171" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.listContainer}>
          {SETTING_ITEMS.map((item) => (
            <View key={item.id} style={styles.listItem}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Switch
                trackColor={{ false: "#E0E8E8", true: "#306F6F" }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#E0E8E8"
                onValueChange={() => toggleSwitch(item.key)}
                value={settings[item.key as keyof typeof settings]}
              />
            </View>
          ))}
        </View>
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
  },
  headerTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: '#333333',
    textAlign: 'center',
    flex: 1,
  },
  placeholder: {
    width: 44,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  listContainer: {
    marginTop: 20,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F5F5',
  },
  itemTitle: {
    fontSize: 18,
    color: '#333333',
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 100,
  },
});

