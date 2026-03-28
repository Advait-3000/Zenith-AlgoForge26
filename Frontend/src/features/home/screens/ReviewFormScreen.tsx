import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Star, CheckCircle2 } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../../shared/components/Button';

const DOCTOR_IMG = 'https://img.freepik.com/free-photo/pleased-young-female-doctor-white-coat-with-stethoscope-neck-standing-with-folded-arms-isolated-white-background_637285-3396.jpg';

export const ReviewFormScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = () => {
    // Logic to submit review
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      navigation.goBack();
    }, 2500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
           <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <ArrowLeft color="#212121" size={24} />
           </TouchableOpacity>
           <Text style={styles.title}>Review form</Text>
           <View style={{ width: 44 }} />
        </View>

        <View style={styles.doctorHeader}>
           <Image source={{ uri: DOCTOR_IMG }} style={styles.doctorThumb} />
           <View style={styles.doctorText}>
              <Text style={styles.doctorName}>Dr. Charlotte Elizabeth Montgomery</Text>
              <Text style={styles.doctorSpecialty}>Cardiologist</Text>
           </View>
        </View>

        <View style={styles.formContainer}>
           <Text style={styles.sectionTitle}>Overall rating</Text>
           <View style={styles.starRow}>
              {[1, 2, 3, 4, 5].map(star => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Star 
                    color="#306F6F" 
                    fill={rating >= star ? "#306F6F" : "transparent"} 
                    size={40} 
                    style={{ marginRight: 15 }}
                  />
                </TouchableOpacity>
              ))}
           </View>

           <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Review</Text>
           <View style={styles.textAreaContainer}>
              <TextInput
                style={styles.textArea}
                placeholder="Tell us about your visit..."
                placeholderTextColor="#A0A0A0"
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                value={review}
                onChangeText={setReview}
              />
           </View>
        </View>

        <View style={styles.footer}>
           <Button title="Leave a review" onPress={handleSubmit} />
        </View>
      </KeyboardAvoidingView>

      {/* Success Modal */}
      <Modal transparent visible={showSuccess} animationType="fade">
        <View style={styles.modalBg}>
           <View style={styles.modalContent}>
              <View style={styles.successCircle}>
                 <CheckCircle2 color="#306F6F" size={50} />
              </View>
              <Text style={styles.modalTitle}>Review Submitted Successfully</Text>
              <Text style={styles.modalSubtitle}>Thank you! We appreciate your feedback.</Text>
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
  doctorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 30,
    marginBottom: 30,
  },
  doctorThumb: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EAF9F9',
  },
  doctorText: {
    flex: 1,
    marginLeft: 15,
  },
  doctorName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#212121',
    lineHeight: 22,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#717171',
    marginTop: 2,
  },
  formContainer: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 20,
  },
  starRow: {
    flexDirection: 'row',
  },
  textAreaContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    height: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  textArea: {
    fontSize: 16,
    color: '#212121',
    height: '100%',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 24,
    right: 24,
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
  },
});
