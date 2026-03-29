// import React, { useState } from 'react';
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   ScrollView, 
//   TouchableOpacity, 
//   Image, 
//   Dimensions, 
//   Platform 
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { 
//   ArrowLeft, 
//   Heart, 
//   Share2, 
//   Star, 
//   ChevronLeft, 
//   ChevronRight,
//   FileText,
//   Building2,
//   GraduationCap,
//   Award,
//   Stethoscope,
//   ShieldCheck,
//   History,
//   MessageSquare
// } from 'lucide-react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { Button } from '../../../shared/components/Button';

// const { width } = Dimensions.get('window');

// const DOCTOR_DATA = {
//   id: '3958648',
//   name: 'Dr. Charlotte Elizabeth Montgomery',
//   specialty: 'Cardiologist',
//   rating: 4.9,
//   price: '80$',
//   image: 'https://img.freepik.com/free-photo/pleased-young-female-doctor-white-coat-with-stethoscope-neck-standing-with-folded-arms-isolated-white-background_637285-3396.jpg',
//   about: "Dr. Charlotte is an experienced cardiologist, she specializes in preventive cardiology, heart failure management, and advanced cardiac imaging. With a patient-focused approach, she delivers personalized high-quality care.",
//   workingPlace: "Mercy Heart Institute, 123 Main St, Boston",
//   education: "Doctor of Medicine (MD), Johns Hopkins University.",
//   certification: "Board-certified in Cardiology by the American Board of Internal Medicine.",
//   training: "Completed residency and advanced cardiology fellowship at the Cleveland Clinic.",
//   licensure: "Fully licensed to practice medicine and cardiology in multiple states, adhering to the latest professional standards.",
//   experience: "Over 12 years of clinical practice, specializing in preventive care, advanced cardiac imaging, and heart failure management.",
//   reviews: [
//     { id: '1', name: 'Sarah P.', date: 'May 11, 2024', rating: 5, text: "Dr. Montgomery's expertise in cardiology is outstanding. She made me feel comfortable and explained everything in detail. Her approach to heart health is proactive and compassionate. I'm grateful for her care and highly recommend her." },
//     { id: '2', name: 'John D.', date: 'Sept 28, 2024', rating: 5, text: "Dr. Charlotte is an experienced cardiologist, she specializes in preventive cardiology, heart failure management, and advanced cardiac imaging." },
//   ]
// };

// const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
// const TIMES = ['10:00', '11:00', '12:00', '13:00', '15:00', '16:00', '17:00', '18:00'];

// export const DoctorProfileScreen: React.FC = () => {
//   const navigation = useNavigation<any>();
//   const [activeTab, setActiveTab] = useState('Book');
//   const [selectedDate, setSelectedDate] = useState(17);
//   const [selectedTime, setSelectedTime] = useState('16:00');
//   const [appointmentType, setAppointmentType] = useState('In-person');
//   const [isFavorite, setIsFavorite] = useState(false);

//   const renderBookTab = () => (
//     <View style={styles.tabContent}>
//       <View style={styles.priceRow}>
//         <Text style={styles.priceLabel}>Price</Text>
//       </View>
//       <View style={styles.priceDetail}>
//         <Text style={styles.priceText}>1 hour consultation</Text>
//         <Text style={styles.priceAmount}>{DOCTOR_DATA.price}</Text>
//       </View>

//       <View style={styles.divider} />

//       <View style={styles.calendarHeader}>
//         <Text style={styles.monthTitle}>October 2024</Text>
//         <View style={styles.calendarArrows}>
//            <TouchableOpacity><ChevronLeft stroke="#E0E8E8" size={24} /></TouchableOpacity>
//            <TouchableOpacity style={{ marginLeft: 15 }}><ChevronRight stroke="#333333" size={24} /></TouchableOpacity>
//         </View>
//       </View>

//       <View style={styles.daysRow}>
//         {DAYS.map(day => <Text key={day} style={styles.dayText}>{day}</Text>)}
//       </View>
      
//       <View style={styles.calendarGrid}>
//         {/* Simplified calendar mockup */}
//         {Array.from({ length: 31 }).map((_, i) => {
//           const day = i + 1;
//           const isSelected = day === selectedDate;
//           const isDisabled = day < 3; // Mocking some past days
//           return (
//             <TouchableOpacity 
//               key={day} 
//               style={[
//                 styles.calendarDay, 
//                 isSelected && styles.selectedDay,
//                 isDisabled && styles.disabledDay
//               ]}
//               onPress={() => !isDisabled && setSelectedDate(day)}
//             >
//               <Text style={[
//                 styles.dayNum, 
//                 isSelected && styles.selectedDayText,
//                 isDisabled && styles.disabledDayText
//               ]}>
//                 {day}
//               </Text>
//             </TouchableOpacity>
//           );
//         })}
//       </View>

//       <View style={styles.divider} />

//       <Text style={styles.sectionLabel}>Select time</Text>
//       <View style={styles.timeGrid}>
//         {TIMES.map(time => (
//           <TouchableOpacity 
//             key={time} 
//             style={[styles.timeBtn, selectedTime === time && styles.selectedTimeBtn]}
//             onPress={() => setSelectedTime(time)}
//           >
//             <Text style={[styles.timeText, selectedTime === time && styles.selectedTimeText]}>
//               {time}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       <View style={styles.divider} />

//       <Text style={styles.sectionLabel}>Type of appointment</Text>
//       <View style={styles.radioRow}>
//         <TouchableOpacity style={styles.radioOption} onPress={() => setAppointmentType('In-person')}>
//            <View style={styles.radioOuter}>
//               {appointmentType === 'In-person' && <View style={styles.radioInner} />}
//            </View>
//            <Text style={styles.radioText}>In-person</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.radioOption} onPress={() => setAppointmentType('Video call')}>
//            <View style={styles.radioOuter}>
//               {appointmentType === 'Video call' && <View style={styles.radioInner} />}
//            </View>
//            <Text style={styles.radioText}>Video call</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.divider} />

//       <Text style={styles.sectionLabel}>Location</Text>
//       <Text style={styles.locationDetail}>{DOCTOR_DATA.workingPlace}</Text>
//     </View>
//   );

//   const renderAboutTab = () => (
//     <View style={styles.tabContent}>
//       {[
//         { title: 'General information', icon: FileText, content: DOCTOR_DATA.about },
//         { title: 'Current working place', icon: Building2, content: DOCTOR_DATA.workingPlace },
//         { title: 'Education', icon: GraduationCap, content: DOCTOR_DATA.education },
//         { title: 'Certification', icon: Stethoscope, content: DOCTOR_DATA.certification },
//         { title: 'Training', icon: History, content: DOCTOR_DATA.training },
//         { title: 'Licensure', icon: Award, content: DOCTOR_DATA.licensure },
//         { title: 'Experience', icon: Stethoscope, content: DOCTOR_DATA.experience },
//       ].map((item, index) => (
//         <View key={index} style={styles.aboutItem}>
//           <View style={styles.aboutHeader}>
//             <item.icon stroke="#306F6F" size={20} />
//             <Text style={styles.aboutTitle}>{item.title}</Text>
//           </View>
//           <Text style={styles.aboutText}>{item.content}</Text>
//         </View>
//       ))}
//     </View>
//   );

//   const renderReviewsTab = () => (
//     <View style={styles.tabContent}>
//       <View style={styles.reviewsMeta}>
//         <Text style={styles.reviewCount}>13 reviews</Text>
//         <TouchableOpacity 
//           style={styles.leaveReviewLink}
//           onPress={() => navigation.navigate('ReviewForm')}
//         >
//           <MessageSquare stroke="#306F6F" size={18} />
//           <Text style={styles.leaveReviewText}>Leave a review</Text>
//         </TouchableOpacity>
//       </View>

//       {DOCTOR_DATA.reviews.map(review => (
//         <View key={review.id} style={styles.reviewCard}>
//           <View style={styles.reviewUserRow}>
//             <View style={styles.avatarPlaceholder}>
//                <Text style={styles.avatarTxt}>{review.name.charAt(0)}</Text>
//             </View>
//             <View style={styles.reviewUserInfo}>
//                <Text style={styles.reviewUserName}>{review.name}</Text>
//                <Text style={styles.reviewDate}>{review.date}</Text>
//             </View>
//             <View style={styles.starRow}>
//                {[1,2,3,4,5].map(s => <Star key={s} stroke="#FBB03B" fill="#FBB03B" size={14} />)}
//             </View>
//           </View>
//           <Text style={styles.reviewText}>{review.text}</Text>
//         </View>
//       ))}
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[1]}>
//         {/* Upper Background & Doctor Info */}
//         <View style={styles.doctorInfoContainer}>
//           <SafeAreaView edges={['top']}>
//             <View style={styles.topNav}>
//               <TouchableOpacity style={styles.circularBtn} onPress={() => navigation.goBack()}>
//                 <ArrowLeft stroke="#212121" size={22} />
//               </TouchableOpacity>
//               <View style={styles.topNavRight}>
//                 <TouchableOpacity 
//                   style={styles.circularBtn}
//                   onPress={() => setIsFavorite(!isFavorite)}
//                 >
//                   <Heart stroke={isFavorite ? "#FF5252" : "#212121"} fill={isFavorite ? "#FF5252" : "transparent"} size={22} />
//                 </TouchableOpacity>
//                 <TouchableOpacity style={[styles.circularBtn, { marginLeft: 15 }]}>
//                   <Share2 stroke="#212121" size={22} />
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </SafeAreaView>

//           <View style={styles.headerInfo}>
//             <View style={styles.textColumn}>
//               <Text style={styles.docNameTitle}>Dr. Charlotte Elizabeth Montgomery</Text>
//               <Text style={styles.docSpecialtySub}>Cardiologist</Text>
              
//               <View style={styles.badgeRow}>
//                 <View style={[styles.badge, styles.ratingBadge]}>
//                    <Star stroke="#306F6F" fill="#306F6F" size={14} />
//                    <Text style={styles.badgeText}>4.9</Text>
//                 </View>
//                 <View style={[styles.badge, styles.idBadge]}>
//                    <Text style={styles.badgeIdLabel}>ID: {DOCTOR_DATA.id}</Text>
//                 </View>
//               </View>
//             </View>
//             <Image source={{ uri: DOCTOR_DATA.image }} style={styles.docLargeImg} resizeMode="contain" />
//           </View>
//         </View>

//         {/* Tabs */}
//         <View style={styles.tabsContainer}>
//           {['Book', 'About', 'Reviews'].map(tab => (
//             <TouchableOpacity 
//               key={tab} 
//               onPress={() => setActiveTab(tab)}
//               style={[styles.tabBtn, activeTab === tab && styles.activeTabBtn]}
//             >
//               <Text style={[styles.tabBtnText, activeTab === tab && styles.activeTabBtnText]}>
//                 {tab}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Tab Content */}
//         {activeTab === 'Book' && renderBookTab()}
//         {activeTab === 'About' && renderAboutTab()}
//         {activeTab === 'Reviews' && renderReviewsTab()}

//         <View style={styles.bottomSpacer} />
//       </ScrollView>

//       {/* Persistent Button */}
//       <View style={styles.footer}>
//          <Button 
//            title="Book appointment" 
//            onPress={() => navigation.navigate('BookingConfirmation')} 
//          />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F7FEFE',
//   },
//   doctorInfoContainer: {
//     paddingHorizontal: 24,
//     backgroundColor: '#DEFAFA', // Light teal background as in the image
//     paddingBottom: 0,
//   },
//   topNav: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 10,
//   },
//   topNavRight: {
//     flexDirection: 'row',
//   },
//   circularBtn: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: 'transparent',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   headerInfo: {
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//     marginTop: 10,
//   },
//   textColumn: {
//     flex: 1,
//     paddingBottom: 40,
//   },
//   docNameTitle: {
//     fontSize: 26,
//     fontWeight: '700',
//     color: '#333333',
//     lineHeight: 32,
//   },
//   docSpecialtySub: {
//     fontSize: 18,
//     color: '#717171',
//     marginTop: 8,
//     marginBottom: 20,
//   },
//   badgeRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   badge: {
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: '#FFFFFF',
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//     marginRight: 10,
//   },
//   ratingBadge: {},
//   idBadge: {},
//   badgeText: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: '#333333',
//     marginLeft: 6,
//   },
//   badgeIdLabel: {
//     fontSize: 14,
//     color: '#717171',
//   },
//   docLargeImg: {
//     width: width * 0.4,
//     height: width * 0.6,
//     zIndex: 1,
//   },
//   tabsContainer: {
//     flexDirection: 'row',
//     display: 'flex',
//     width: '100%',
//     backgroundColor: '#F7FEFE',
//     borderBottomWidth: 1,
//     borderBottomColor: '#EAF9F9',
//     marginTop: 0,
//     zIndex: 10,
//   },
//   tabBtn: {
//     flex: 1,
//     height: 56,
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   activeTabBtn: {
//     borderBottomWidth: 3,
//     borderBottomColor: '#306F6F',
//   },
//   tabBtnText: {
//     fontSize: 16,
//     color: '#A0A0A0',
//     fontWeight: '600',
//     letterSpacing: 0.3,
//   },
//   activeTabBtnText: {
//     color: '#306F6F',
//     fontWeight: '800',
//   },
//   tabContent: {
//     paddingHorizontal: 24,
//     paddingTop: 20,
//   },
//   priceRow: {
//     marginBottom: 8,
//   },
//   priceLabel: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#333333',
//   },
//   priceDetail: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   priceText: {
//     fontSize: 16,
//     color: '#717171',
//   },
//   priceAmount: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#212121',
//   },
//   divider: {
//     height: 1,
//     backgroundColor: '#EAF9F9',
//     width: '100%',
//     marginVertical: 15,
//   },
//   calendarHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   monthTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#333333',
//   },
//   calendarArrows: {
//     flexDirection: 'row',
//   },
//   daysRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//   },
//   dayText: {
//     width: width / 9.5,
//     textAlign: 'center',
//     color: '#717171',
//     fontWeight: '500',
//   },
//   calendarGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   calendarDay: {
//     width: width / 9.5,
//     height: width / 9.5,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 10,
//     borderRadius: (width / 9.5) / 2,
//     borderWidth: 1,
//     borderColor: '#EAF9F9',
//   },
//   selectedDay: {
//     backgroundColor: '#306F6F',
//     borderColor: '#306F6F',
//   },
//   disabledDay: {
//     opacity: 0.3,
//   },
//   dayNum: {
//     fontSize: 15,
//     color: '#212121',
//   },
//   selectedDayText: {
//     color: '#FFFFFF',
//     fontWeight: '700',
//   },
//   disabledDayText: {
//     color: '#A0A0A0',
//   },
//   sectionLabel: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#333333',
//     marginBottom: 15,
//   },
//   timeGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 12,
//   },
//   timeBtn: {
//     width: (width - 80) / 4,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: '#FFFFFF',
//     borderWidth: 1,
//     borderColor: '#EAF9F9',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   selectedTimeBtn: {
//     backgroundColor: '#306F6F',
//     borderColor: '#306F6F',
//   },
//   timeText: {
//     fontSize: 15,
//     color: '#717171',
//     fontWeight: '500',
//   },
//   selectedTimeText: {
//     color: '#FFFFFF',
//     fontWeight: '700',
//   },
//   radioRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   radioOption: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 30,
//   },
//   radioOuter: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: '#306F6F',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 10,
//   },
//   radioInner: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     backgroundColor: '#306F6F',
//   },
//   radioText: {
//     fontSize: 16,
//     color: '#333333',
//     fontWeight: '500',
//   },
//   locationDetail: {
//     fontSize: 16,
//     color: '#717171',
//     lineHeight: 22,
//   },
//   aboutItem: {
//     marginBottom: 24,
//   },
//   aboutHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   aboutTitle: {
//     fontSize: 17,
//     fontWeight: '700',
//     color: '#333333',
//     marginLeft: 12,
//   },
//   aboutText: {
//     fontSize: 15,
//     color: '#717171',
//     lineHeight: 22,
//   },
//   reviewsMeta: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   reviewCount: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#212121',
//   },
//   leaveReviewLink: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   leaveReviewText: {
//     fontSize: 15,
//     color: '#306F6F',
//     fontWeight: '600',
//     marginLeft: 8,
//   },
//   reviewCard: {
//     marginBottom: 25,
//     borderBottomWidth: 1,
//     borderBottomColor: '#EAF9F9',
//     paddingBottom: 20,
//   },
//   reviewUserRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   avatarPlaceholder: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: '#EAF9F9',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   avatarTxt: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#306F6F',
//   },
//   reviewUserInfo: {
//     flex: 1,
//     marginLeft: 12,
//   },
//   reviewUserName: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#333333',
//   },
//   reviewDate: {
//     fontSize: 13,
//     color: '#717171',
//     marginTop: 2,
//   },
//   starRow: {
//     flexDirection: 'row',
//   },
//   reviewText: {
//     fontSize: 15,
//     color: '#717171',
//     lineHeight: 22,
//   },
//   footer: {
//     padding: 24,
//     backgroundColor: '#F7FEFE',
//     borderTopWidth: 1,
//     borderTopColor: '#EAF9F9',
//   },
//   bottomSpacer: {
//     height: 20,
//   },
// });
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Heart,
  Share2,
  Star,
  ChevronLeft,
  ChevronRight,
  FileText,
  Building2,
  GraduationCap,
  Award,
  Stethoscope,
  History,
  MessageSquare,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../shared/components/Button';

const { width } = Dimensions.get('window');

const DOCTOR_DATA = {
  id: '3958648',
  name: 'Dr. Charlotte Elizabeth Montgomery',
  specialty: 'Cardiologist',
  rating: 4.9,
  price: '80$',
  image: 'https://img.freepik.com/free-photo/pleased-young-female-doctor-white-coat-with-stethoscope-neck-standing-with-folded-arms-isolated-white-background_637285-3396.jpg',
  about: "Dr. Charlotte is an experienced cardiologist, she specializes in preventive cardiology, heart failure management, and advanced cardiac imaging.",
  workingPlace: "Mercy Heart Institute, 123 Main St, Boston",
  education: "Doctor of Medicine (MD), Johns Hopkins University.",
  certification: "Board-certified in Cardiology by the American Board of Internal Medicine.",
  training: "Completed residency and advanced cardiology fellowship at the Cleveland Clinic.",
  licensure: "Fully licensed to practice medicine and cardiology in multiple states.",
  experience: "Over 12 years of clinical practice, specializing in preventive care.",
  reviews: [
    { id: '1', name: 'Sarah P.', date: 'May 11, 2024', rating: 5, text: "Dr. Montgomery's expertise in cardiology is outstanding. She made me feel comfortable and explained everything in detail." },
    { id: '2', name: 'John D.', date: 'Sept 28, 2024', rating: 5, text: "Dr. Charlotte is an experienced cardiologist, she specializes in preventive cardiology, heart failure management." },
  ],
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const TIMES = ['10:00', '11:00', '12:00', '13:00', '15:00', '16:00', '17:00', '18:00'];
const TABS = ['Book', 'About', 'Reviews'];

export const DoctorProfileScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedDate, setSelectedDate] = useState(17);
  const [selectedTime, setSelectedTime] = useState('16:00');
  const [appointmentType, setAppointmentType] = useState('In-person');
  const [isFavorite, setIsFavorite] = useState(false);

  // ✅ FlatList ref for programmatic horizontal scroll
  const flatListRef = useRef<FlatList>(null);

  const handleTabPress = (index: number) => {
    setActiveTab(index);
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

  // ─── Book Tab ───────────────────────────────────────────────
  const renderBookTab = () => (
    <ScrollView
      style={{ width }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.tabScrollContent}
    >
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>{t('doctorProfile.price')}</Text>
      </View>
      <View style={styles.priceDetail}>
        <Text style={styles.priceText}>{t('doctorProfile.consultation')}</Text>
        <Text style={styles.priceAmount}>{DOCTOR_DATA.price}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.calendarHeader}>
        <Text style={styles.monthTitle}>October 2024</Text>
        <View style={styles.calendarArrows}>
          <TouchableOpacity><ChevronLeft stroke="#E0E8E8" size={24} /></TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 15 }}><ChevronRight stroke="#333333" size={24} /></TouchableOpacity>
        </View>
      </View>

      <View style={styles.daysRow}>
        {DAYS.map(day => <Text key={day} style={styles.dayText}>{day}</Text>)}
      </View>

      <View style={styles.calendarGrid}>
        {Array.from({ length: 31 }).map((_, i) => {
          const day = i + 1;
          const isSelected = day === selectedDate;
          const isDisabled = day < 3;
          return (
            <TouchableOpacity
              key={day}
              style={[styles.calendarDay, isSelected && styles.selectedDay, isDisabled && styles.disabledDay]}
              onPress={() => !isDisabled && setSelectedDate(day)}
            >
              <Text style={[styles.dayNum, isSelected && styles.selectedDayText, isDisabled && styles.disabledDayText]}>
                {day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.divider} />

      <Text style={styles.sectionLabel}>{t('doctorProfile.selectTime')}</Text>
      <View style={styles.timeGrid}>
        {TIMES.map(time => (
          <TouchableOpacity
            key={time}
            style={[styles.timeBtn, selectedTime === time && styles.selectedTimeBtn]}
            onPress={() => setSelectedTime(time)}
          >
            <Text style={[styles.timeText, selectedTime === time && styles.selectedTimeText]}>
              {time}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.divider} />

      <Text style={styles.sectionLabel}>{t('doctorProfile.appointmentType')}</Text>
      <View style={styles.radioRow}>
        {['In-person', 'Video call'].map(type => (
          <TouchableOpacity key={type} style={styles.radioOption} onPress={() => setAppointmentType(type)}>
            <View style={styles.radioOuter}>
              {appointmentType === type && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.radioText}>{type === 'In-person' ? t('doctorProfile.inPerson') : t('doctorProfile.videoCall')}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.divider} />

      <Text style={styles.sectionLabel}>{t('doctorProfile.location')}</Text>
      <Text style={styles.locationDetail}>{DOCTOR_DATA.workingPlace}</Text>

      <View style={{ height: 20 }} />
    </ScrollView>
  );

  // ─── About Tab ──────────────────────────────────────────────
  const renderAboutTab = () => (
    <ScrollView
      style={{ width }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.tabScrollContent}
    >
      {[
        { title: t('doctorProfile.generalInfo'), icon: FileText, content: DOCTOR_DATA.about },
        { title: t('doctorProfile.workingPlace'), icon: Building2, content: DOCTOR_DATA.workingPlace },
        { title: t('doctorProfile.education'), icon: GraduationCap, content: DOCTOR_DATA.education },
        { title: t('doctorProfile.certification'), icon: Stethoscope, content: DOCTOR_DATA.certification },
        { title: t('doctorProfile.training'), icon: History, content: DOCTOR_DATA.training },
        { title: t('doctorProfile.licensure'), icon: Award, content: DOCTOR_DATA.licensure },
        { title: t('doctorProfile.experience'), icon: Stethoscope, content: DOCTOR_DATA.experience },
      ].map((item, index) => (
        <View key={index} style={styles.aboutItem}>
          <View style={styles.aboutHeader}>
            <item.icon stroke="#306F6F" size={20} />
            <Text style={styles.aboutTitle}>{item.title}</Text>
          </View>
          <Text style={styles.aboutText}>{item.content}</Text>
        </View>
      ))}
      <View style={{ height: 20 }} />
    </ScrollView>
  );

  // ─── Reviews Tab ────────────────────────────────────────────
  const renderReviewsTab = () => (
    <ScrollView
      style={{ width }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.tabScrollContent}
    >
      <View style={styles.reviewsMeta}>
        <Text style={styles.reviewCount}>{t('doctorProfile.reviewsCount', { count: 13 })}</Text>
        <TouchableOpacity style={styles.leaveReviewLink} onPress={() => navigation.navigate('ReviewForm')}>
          <MessageSquare stroke="#306F6F" size={18} />
          <Text style={styles.leaveReviewText}>{t('doctorProfile.leaveReview')}</Text>
        </TouchableOpacity>
      </View>

      {DOCTOR_DATA.reviews.map(review => (
        <View key={review.id} style={styles.reviewCard}>
          <View style={styles.reviewUserRow}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarTxt}>{review.name.charAt(0)}</Text>
            </View>
            <View style={styles.reviewUserInfo}>
              <Text style={styles.reviewUserName}>{review.name}</Text>
              <Text style={styles.reviewDate}>{review.date}</Text>
            </View>
            <View style={styles.starRow}>
              {[1, 2, 3, 4, 5].map(s => <Star key={s} stroke="#FBB03B" fill="#FBB03B" size={14} />)}
            </View>
          </View>
          <Text style={styles.reviewText}>{review.text}</Text>
        </View>
      ))}
      <View style={{ height: 20 }} />
    </ScrollView>
  );

  const tabScreens = [renderBookTab, renderAboutTab, renderReviewsTab];

  return (
    <View style={styles.container}>
      {/* ── Doctor Info Header (not scrollable, stays fixed above tabs) ── */}
      <View style={styles.doctorInfoContainer}>
        <SafeAreaView edges={['top']}>
          <View style={styles.topNav}>
            <TouchableOpacity style={styles.circularBtn} onPress={() => navigation.goBack()}>
              <ArrowLeft stroke="#212121" size={22} />
            </TouchableOpacity>
            <View style={styles.topNavRight}>
              <TouchableOpacity style={styles.circularBtn} onPress={() => setIsFavorite(!isFavorite)}>
                <Heart stroke={isFavorite ? "#FF5252" : "#212121"} fill={isFavorite ? "#FF5252" : "transparent"} size={22} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.circularBtn, { marginLeft: 15 }]}>
                <Share2 stroke="#212121" size={22} />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>

        <View style={styles.headerInfo}>
          <View style={styles.textColumn}>
            <Text style={styles.docNameTitle}>Dr. Charlotte Elizabeth Montgomery</Text>
            <Text style={styles.docSpecialtySub}>{t('home.specialisations.cardiologist')}</Text>
            <View style={styles.badgeRow}>
              <View style={[styles.badge]}>
                <Star stroke="#306F6F" fill="#306F6F" size={14} />
                <Text style={styles.badgeText}>4.9</Text>
              </View>
              <View style={[styles.badge]}>
                <Text style={styles.badgeIdLabel}>ID: {DOCTOR_DATA.id}</Text>
              </View>
            </View>
          </View>
          <Image source={{ uri: DOCTOR_DATA.image }} style={styles.docLargeImg} resizeMode="contain" />
        </View>
      </View>

      {/* ── Horizontal Tab Bar ── */}
      <View style={styles.tabsContainer}>
        {TABS.map((tab, index) => (
          <TouchableOpacity
            key={tab}
            onPress={() => handleTabPress(index)}
            style={[styles.tabBtn, activeTab === index && styles.activeTabBtn]}
          >
            <Text style={[styles.tabBtnText, activeTab === index && styles.activeTabBtnText]}>
              {index === 0 ? t('doctorProfile.book') : index === 1 ? t('doctorProfile.about') : t('doctorProfile.reviews')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ✅ FlatList renders tab content side-by-side horizontally */}
      <FlatList
        ref={flatListRef}
        data={tabScreens}
        keyExtractor={(_, i) => String(i)}
        horizontal
        pagingEnabled                        // snap to each tab's full width
        scrollEnabled={false}                // only switch via tab press, not swipe (set true to allow swipe)
        showsHorizontalScrollIndicator={false}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        renderItem={({ item: renderTab }) => renderTab()}
        style={{ flex: 1 }}
      />

      {/* ── Persistent Footer Button ── */}
      <View style={styles.footer}>
        <Button
          title={t('doctorProfile.bookAppointment')}
          onPress={() => navigation.navigate('BookingConfirmation')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FEFE' },
  doctorInfoContainer: {
    paddingHorizontal: 24,
    backgroundColor: '#DEFAFA',
    paddingBottom: 0,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  topNavRight: { flexDirection: 'row' },
  circularBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 10,
  },
  textColumn: { flex: 1, paddingBottom: 40 },
  docNameTitle: { fontSize: 26, fontWeight: '700', color: '#333333', lineHeight: 32 },
  docSpecialtySub: { fontSize: 18, color: '#717171', marginTop: 8, marginBottom: 20 },
  badgeRow: { flexDirection: 'row', alignItems: 'center' },
  badge: {
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginRight: 10,
  },
  badgeText: { fontSize: 14, fontWeight: '700', color: '#333333', marginLeft: 6 },
  badgeIdLabel: { fontSize: 14, color: '#717171' },
  docLargeImg: { width: width * 0.4, height: width * 0.6 },

  // ── Tabs ──
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F7FEFE',
    borderBottomWidth: 1,
    borderBottomColor: '#EAF9F9',
  },
  tabBtn: {
    flex: 1,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTabBtn: {
    borderBottomWidth: 3,
    borderBottomColor: '#306F6F',
  },
  tabBtnText: { fontSize: 16, color: '#A0A0A0', fontWeight: '600' },
  activeTabBtnText: { color: '#306F6F', fontWeight: '800' },

  // ── Tab Content (each tab is full-width scrollable) ──
  tabScrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    backgroundColor: '#F7FEFE',
  },

  // ── Book ──
  priceRow: { marginBottom: 8 },
  priceLabel: { fontSize: 18, fontWeight: '700', color: '#333333' },
  priceDetail: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  priceText: { fontSize: 16, color: '#717171' },
  priceAmount: { fontSize: 20, fontWeight: '700', color: '#212121' },
  divider: { height: 1, backgroundColor: '#EAF9F9', marginVertical: 15 },
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  monthTitle: { fontSize: 18, fontWeight: '700', color: '#333333' },
  calendarArrows: { flexDirection: 'row' },
  daysRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  dayText: { width: width / 9.5, textAlign: 'center', color: '#717171', fontWeight: '500' },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  calendarDay: {
    width: width / 9.5,
    height: width / 9.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: (width / 9.5) / 2,
    borderWidth: 1,
    borderColor: '#EAF9F9',
  },
  selectedDay: { backgroundColor: '#306F6F', borderColor: '#306F6F' },
  disabledDay: { opacity: 0.3 },
  dayNum: { fontSize: 15, color: '#212121' },
  selectedDayText: { color: '#FFFFFF', fontWeight: '700' },
  disabledDayText: { color: '#A0A0A0' },
  sectionLabel: { fontSize: 18, fontWeight: '700', color: '#333333', marginBottom: 15 },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  timeBtn: {
    width: (width - 80) / 4,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAF9F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedTimeBtn: { backgroundColor: '#306F6F', borderColor: '#306F6F' },
  timeText: { fontSize: 15, color: '#717171', fontWeight: '500' },
  selectedTimeText: { color: '#FFFFFF', fontWeight: '700' },
  radioRow: { flexDirection: 'row', alignItems: 'center' },
  radioOption: { flexDirection: 'row', alignItems: 'center', marginRight: 30 },
  radioOuter: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#306F6F', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#306F6F' },
  radioText: { fontSize: 16, color: '#333333', fontWeight: '500' },
  locationDetail: { fontSize: 16, color: '#717171', lineHeight: 22 },

  // ── About ──
  aboutItem: { marginBottom: 24 },
  aboutHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  aboutTitle: { fontSize: 17, fontWeight: '700', color: '#333333', marginLeft: 12 },
  aboutText: { fontSize: 15, color: '#717171', lineHeight: 22 },

  // ── Reviews ──
  reviewsMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  reviewCount: { fontSize: 18, fontWeight: '600', color: '#212121' },
  leaveReviewLink: { flexDirection: 'row', alignItems: 'center' },
  leaveReviewText: { fontSize: 15, color: '#306F6F', fontWeight: '600', marginLeft: 8 },
  reviewCard: { marginBottom: 25, borderBottomWidth: 1, borderBottomColor: '#EAF9F9', paddingBottom: 20 },
  reviewUserRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatarPlaceholder: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#EAF9F9', justifyContent: 'center', alignItems: 'center' },
  avatarTxt: { fontSize: 18, fontWeight: '700', color: '#306F6F' },
  reviewUserInfo: { flex: 1, marginLeft: 12 },
  reviewUserName: { fontSize: 16, fontWeight: '700', color: '#333333' },
  reviewDate: { fontSize: 13, color: '#717171', marginTop: 2 },
  starRow: { flexDirection: 'row' },
  reviewText: { fontSize: 15, color: '#717171', lineHeight: 22 },

  // ── Footer ──
  footer: { padding: 24, backgroundColor: '#F7FEFE', borderTopWidth: 1, borderTopColor: '#EAF9F9' },
});


