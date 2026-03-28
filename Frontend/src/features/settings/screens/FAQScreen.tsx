import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  LayoutAnimation, 
  Platform, 
  UIManager 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TABS = [
  { key: 'appointments', labelKey: 'faq.tabs.appointments' },
  { key: 'payments', labelKey: 'faq.tabs.payments' },
  { key: 'prescriptions', labelKey: 'faq.tabs.prescriptions' },
  { key: 'support', labelKey: 'faq.tabs.support' }
];

const FAQ_DATA = {
  "Appointments": [
    {
      question: "How do I book an appointment?",
      answer: "Browse through the list of available doctors, and select the one that best suits your needs. Choose a convenient time slot from their schedule, provide any necessary details, and confirm your booking to secure the appointment."
    },
    {
      question: "Can I cancel an appointment?",
      answer: "Yes, you can cancel your appointment up to 24 hours before the scheduled time through the 'My Appointments' section."
    },
    {
      question: "Can I book urgent consultations?",
      answer: "For urgent needs, look for doctors with 'Instant' badge or use the emergency contact feature if available."
    },
    {
      question: "How do I know if my appointment is confirmed?",
      answer: "You will receive a push notification and an email confirmation once the doctor accepts your booking."
    },
    {
      question: "Are virtual consultations available?",
      answer: "Yes, many of our doctors offer video consultations which you can select during the booking process."
    }
  ],
  "Prescriptions": [
    {
      question: "How do I view my prescription?",
      answer: "Once your doctor issues a prescription, you can find it under the 'Records' tab in the 'Prescriptions' section."
    },
    {
      question: "How can I order medication?",
      answer: "You can click on 'Order to pharmacy' within your prescription details to send it directly to your preferred pharmacy."
    },
    {
      question: "Can I share my prescription with a pharmacy?",
      answer: "Yes, download the prescription as a PDF and share it via your preferred messaging app or email."
    },
    {
      question: "How do I request a refill?",
      answer: "You can request a refill by clicking the 'Request Refill' button on an existing prescription, which will notify your doctor."
    }
  ]
};

export const FAQScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState("appointments");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleExpand = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const faqArray = t(`faq.questions.${activeTab}`, { returnObjects: true }) as any[];
  const currentFaqs = Array.isArray(faqArray) ? faqArray : [];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft stroke="#717171" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('faq.title')}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
          {TABS.map((tab) => (
            <TouchableOpacity 
              key={tab.key} 
              style={[styles.tab, activeTab === tab.key && styles.activeTab]}
              onPress={() => {
                setActiveTab(tab.key);
                setExpandedIndex(null);
              }}
            >
              <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>{t(tab.labelKey)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {currentFaqs.map((faq, index) => (
          <TouchableOpacity 
            key={index} 
            style={[styles.faqCard, expandedIndex === index && styles.expandedCard]}
            onPress={() => toggleExpand(index)}
            activeOpacity={0.7}
          >
            <View style={styles.faqHeader}>
              <Text style={styles.question}>{faq.q}</Text>
              <View style={styles.iconCircle}>
                {expandedIndex === index ? (
                  <ChevronUp stroke="#717171" size={20} />
                ) : (
                  <ChevronDown stroke="#717171" size={20} />
                )}
              </View>
            </View>
            {expandedIndex === index && (
              <Text style={styles.answer}>{faq.a}</Text>
            )}
          </TouchableOpacity>
        ))}
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
  tabsWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F5F5',
    marginBottom: 20,
  },
  tabsContainer: {
    paddingHorizontal: 20,
    height: 50,
  },
  tab: {
    paddingHorizontal: 15,
    justifyContent: 'center',
    marginRight: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#306F6F',
  },
  tabText: {
    fontSize: 16,
    color: '#717171',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#306F6F',
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  expandedCard: {
    borderColor: 'transparent',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  question: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
    paddingRight: 15,
    lineHeight: 24,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F7FEFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  answer: {
    marginTop: 15,
    fontSize: 15,
    color: '#717171',
    lineHeight: 24,
  },
  bottomSpacer: {
    height: 100,
  },
});

