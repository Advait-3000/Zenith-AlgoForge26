import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Dimensions, 
  TextInput 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  Search, 
  ArrowUpDown, 
  ListFilter, 
  Star, 
  MoveUpRight,
  TrendingUp,
  X
} from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const ALL_DOCTORS = [
  { id: '1', name: 'Dr. Mia Miller', specialty: 'Gynecologist', rating: 5.0, image: 'https://img.freepik.com/free-photo/pleased-young-female-doctor-white-coat-with-stethoscope-neck-standing-with-folded-arms-isolated-white-background_637285-3396.jpg' },
  { id: '2', name: 'Dr. Norah Still', specialty: 'Gynecologist', rating: 4.9, image: 'https://img.freepik.com/free-photo/front-view-young-female-doctor-medical-uniform-with-mask-due-covid-white-wall_140725-78482.jpg' },
  { id: '3', name: 'Dr. Helena Fox', specialty: 'Gynecologist', rating: 4.9, image: 'https://img.freepik.com/free-photo/woman-doctor-wearing-lab-coat-with-stethoscope-isolated_1303-29791.jpg' },
  { id: '4', name: 'Dr. Andrew Miller', specialty: 'Gynecologist', rating: 4.8, image: 'https://img.freepik.com/free-photo/handsome-young-male-doctor-with-stethoscope-standing-against-blue-background_23-2148127025.jpg' },
  { id: '5', name: 'Dr. Sarah Wilson', specialty: 'Pulmonologist', rating: 4.7, image: 'https://img.freepik.com/free-photo/medical-concept-young-female-doctor-white-coat-isolated-white_186202-3932.jpg' },
];

export const DoctorSearchScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const initialQuery = route.params?.query || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [filteredDoctors, setFilteredDoctors] = useState(
    initialQuery 
      ? ALL_DOCTORS.filter(d => d.specialty.toLowerCase().includes(initialQuery.toLowerCase()))
      : ALL_DOCTORS
  );

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredDoctors(ALL_DOCTORS);
    } else {
      const results = ALL_DOCTORS.filter(d => 
        d.name.toLowerCase().includes(text.toLowerCase()) || 
        d.specialty.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredDoctors(results);
    }
  };

  const renderNoResults = () => (
    <View style={styles.noResultsContainer}>
       <View style={styles.emptyCircle}>
          <Search color="#306F6F" size={40} />
       </View>
       <Text style={styles.noResultsTitle}>Sorry, no results found</Text>
       <Text style={styles.noResultsSubtitle}>Please try a different search term.</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft color="#212121" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Search results</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Search color="#A0A0A0" size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#A0A0A0"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <X color="#A0A0A0" size={20} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.filterRow}>
         <TouchableOpacity style={styles.sortBtn}>
            <ArrowUpDown color="#212121" size={20} />
         </TouchableOpacity>
         <Text style={styles.sortLabel}>By location</Text>
         <View style={{ flex: 1 }} />
         <TouchableOpacity 
           style={styles.filterBtn}
           onPress={() => navigation.navigate('DoctorFilter')}
         >
            <ListFilter color="#212121" size={24} />
            <View style={styles.filterBadge}>
               <Text style={styles.badgeText}>9</Text>
            </View>
         </TouchableOpacity>
      </View>

      {filteredDoctors.length === 0 ? renderNoResults() : (
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.doctorGrid}>
            {filteredDoctors.map(doc => (
              <TouchableOpacity 
                key={doc.id} 
                style={styles.doctorCard}
                onPress={() => navigation.navigate('DoctorProfile', { doctorId: doc.id })}
              >
                <View style={styles.imageWrapper}>
                  <Image source={{ uri: doc.image }} style={styles.doctorImg} />
                  <View style={styles.ratingBadge}>
                    <Star color="#FBB03B" fill="#FBB03B" size={12} />
                    <Text style={styles.ratingText}>{doc.rating.toFixed(1)}</Text>
                  </View>
                </View>
                <Text style={styles.docName}>{doc.name}</Text>
                <Text style={styles.docSpecialty}>{doc.specialty}</Text>
                <TouchableOpacity style={styles.docArrowBtn}>
                  <MoveUpRight color="#FFFFFF" size={20} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.bottomSpacer} />
        </ScrollView>
      )}
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
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
  },
  searchRow: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    height: 56,
    borderRadius: 28,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 17,
    color: '#212121',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  sortBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sortLabel: {
    fontSize: 16,
    color: '#717171',
    marginLeft: 15,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 15, // Matches the image's squircle shape
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  filterBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#306F6F',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  doctorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  doctorCard: {
    width: (width - 64) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 12,
    marginBottom: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  imageWrapper: {
    width: '100%',
    height: 120,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 10,
  },
  doctorImg: {
    width: '100%',
    height: '100%',
    backgroundColor: '#EAF9F9',
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#212121',
    marginLeft: 4,
  },
  docName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#212121',
    textAlign: 'center',
    marginTop: 4,
  },
  docSpecialty: {
    fontSize: 13,
    color: '#717171',
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 10,
  },
  docArrowBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#306F6F',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: -18,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: '#306F6F',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    opacity: 0.3,
  },
  noResultsTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 12,
  },
  noResultsSubtitle: {
    fontSize: 16,
    color: '#717171',
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomSpacer: {
    height: 40,
  },
});
