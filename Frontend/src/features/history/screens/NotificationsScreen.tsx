import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  Bell, 
  Calendar, 
  Pill, 
  Monitor, 
  AlertCircle,
  X,
  Trash2 
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';

const NOTIFICATIONS_DATA = [
  {
    id: '1',
    title: "Your Visit Has Been Rescheduled",
    description: "Your visit to Dr. Smith is rescheduled to 3:00 PM on December 15th.",
    icon: Calendar,
    iconBg: '#E7F5F5',
    iconColor: '#306F6F'
  },
  {
    id: '2',
    title: "Time to Take Your Medicine",
    description: "Don't forget to take: 50mg of Antibiotic. Stay on track with your treatment!",
    icon: Pill,
    iconBg: '#F0F5F5',
    iconColor: '#306F6F'
  },
  {
    id: '3',
    title: "Appointment Reminder",
    description: "Your virtual visit with Dr. Lee is scheduled for tomorrow at 10:00 AM.",
    icon: Monitor,
    iconBg: '#E7F5F5',
    iconColor: '#306F6F'
  },
  {
    id: '4',
    title: "Only 2 pills of AmoxiCare left",
    description: "Time to refill your prescription!",
    linkText: "Go to e-pharmacy",
    icon: AlertCircle,
    iconBg: '#FFF7E6',
    iconColor: '#FBB03B'
  },
  {
    id: '5',
    title: "Your Visit Has Been Rescheduled",
    description: "Your visit to Dr. Smith is rescheduled to 3:00 PM on December 15th.",
    icon: Calendar,
    iconBg: '#E7F5F5',
    iconColor: '#306F6F'
  },
  {
    id: '6',
    title: "Card expired",
    description: "Your policy has expired. Please renew it as soon as possible to restore coverage.",
    icon: X,
    iconBg: '#FFEFEF',
    iconColor: '#FF5252'
  }
];

export const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [notifications, setNotifications] = React.useState(NOTIFICATIONS_DATA);

  const handleReadAll = () => {
    // Logic for read all if needed
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const renderRightActions = (id: string) => {
    return (
      <TouchableOpacity 
        style={styles.deleteAction} 
        onPress={() => handleDelete(id)}
        activeOpacity={0.8}
      >
        <Trash2 stroke="#FFFFFF" size={24} />
      </TouchableOpacity>
    );
  };

  const isEmpty = notifications.length === 0;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <ArrowLeft stroke="#717171" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          {!isEmpty ? (
            <TouchableOpacity onPress={handleReadAll}>
              <Text style={styles.readAllText}>Read all</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.placeholder} />
          )}
        </View>

        {isEmpty ? (
          <View style={styles.emptyContainer}>
            <View style={styles.bellIconCircle}>
                <Bell stroke="#306F6F" size={48} strokeWidth={1} />
            </View>
            <Text style={styles.emptyTitle}>No Notifications Yet</Text>
            <Text style={styles.emptySubtitle}>You'll be notified here once there's something new.</Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {notifications.map((item) => (
              <Swipeable
                key={item.id}
                renderRightActions={() => renderRightActions(item.id)}
                friction={2}
                rightThreshold={40}
              >
                <View style={styles.notificationItem}>
                  <View style={[styles.iconBox, { backgroundColor: item.iconBg }]}>
                    <item.icon stroke={item.iconColor} size={24} />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.notiTitle}>{item.title}</Text>
                    <Text style={styles.notiDesc}>{item.description}</Text>
                    {item.linkText && (
                      <TouchableOpacity>
                        <Text style={styles.linkText}>{item.linkText}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </Swipeable>
            ))}
            <View style={styles.bottomSpacer} />
          </ScrollView>
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
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
    fontSize: 28,
    fontWeight: '700',
    color: '#333333',
    flex: 1,
    marginLeft: 0,
  },
  readAllText: {
    fontSize: 18,
    color: '#306F6F',
    fontWeight: '500',
  },
  placeholder: {
    width: 44,
  },
  scrollContent: {
    paddingTop: 10,
  },
  notificationItem: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F5F5',
    backgroundColor: '#F7FEFE', // Explicit bg for swipeable overlay
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  notiTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 6,
  },
  notiDesc: {
    fontSize: 16,
    color: '#717171',
    lineHeight: 22,
  },
  linkText: {
    fontSize: 16,
    color: '#306F6F',
    fontWeight: '700',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: -80,
  },
  bellIconCircle: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 15,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#717171',
    textAlign: 'center',
    lineHeight: 24,
  },
  deleteAction: {
    backgroundColor: '#FF5252',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  bottomSpacer: {
    height: 100,
  },
});


