import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  Modal,
  Image,
  Pressable
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  Settings2, 
  ArrowUpDown, 
  MoreVertical, 
  Eye, 
  Download,
  Microscope,
  CheckCircle2,
  X,
  Copy,
  FileDown
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../../shared/components/Button';

const { width, height } = Dimensions.get('window');

const REPORTS = [
  { id: '1', title: 'Complete Blood Count (CBC)', date: '02 Jan, 2024', status: 'Pending', message: 'Results will be 03 Jan, 2024', color: '#717171' },
  { id: '2', title: 'Complete Blood Count (CBC)', date: '02 Jan, 2024', status: 'Normal Results', color: '#306F6F' },
  { id: '3', title: 'Lipid Panel', date: '02 Jan, 2024', status: 'Requires Attention', color: '#FBB03B' },
  { id: '4', title: 'Thyroid Function Test', date: '02 Jan, 2024', status: 'Follow-Up Needed', color: '#FF5252' },
];

const FILTER_OPTIONS = [
  { id: '1', name: 'Hormonal Tests' },
  { id: '2', name: 'Complete Blood Count' },
  { id: '3', name: 'Metabolic and Nutritional Tests' },
  { id: '4', name: 'Lipid Panel' },
  { id: '5', name: 'Inflammatory Markers' },
];

export const LabReportsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [filterVisible, setFilterVisible] = useState(false);
  const [shareVisible, setShareVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState(['1']);
  const [resultType, setResultType] = useState('Borderline');

  const toggleFilter = (id: string) => {
    if (selectedFilters.includes(id)) {
      setSelectedFilters(selectedFilters.filter(f => f !== id));
    } else {
      setSelectedFilters([...selectedFilters, id]);
    }
  };

  const renderFilterModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={filterVisible}
      onRequestClose={() => setFilterVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.filterContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setFilterVisible(false)}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
            <Text style={styles.modalTitle}>Filter</Text>
            <TouchableOpacity onPress={() => setFilterVisible(false)}><Text style={styles.applyText}>Apply</Text></TouchableOpacity>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false} style={styles.filterScroll}>
             <Text style={styles.filterSectionTitle}>Test type</Text>
             {FILTER_OPTIONS.map(opt => (
               <TouchableOpacity key={opt.id} style={styles.checkboxRow} onPress={() => toggleFilter(opt.id)}>
                  <View style={[styles.checkbox, selectedFilters.includes(opt.id) && styles.checkboxActive]}>
                    {selectedFilters.includes(opt.id) && <CheckCircle2 color="#FFFFFF" size={16} />}
                  </View>
                  <Text style={[styles.checkboxLabel, selectedFilters.includes(opt.id) && styles.checkboxLabelActive]}>{opt.name}</Text>
               </TouchableOpacity>
             ))}
             <TouchableOpacity style={styles.showAll}><Text style={styles.showAllText}>Show all</Text></TouchableOpacity>

             <Text style={[styles.filterSectionTitle, { marginTop: 30 }]}>Result type</Text>
             <View style={styles.pillRow}>
               {['Good', 'Borderline', 'Bad'].map(type => (
                 <TouchableOpacity 
                   key={type} 
                   style={[styles.pill, resultType === type && styles.pillActive]}
                   onPress={() => setResultType(type)}
                 >
                   <Text style={[styles.pillText, resultType === type && styles.pillTextActive]}>{type}</Text>
                 </TouchableOpacity>
               ))}
             </View>
          </ScrollView>

          <TouchableOpacity style={styles.resetBtn}>
             <Text style={styles.resetText}>Reset filter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderShareModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={shareVisible}
      onRequestClose={() => setShareVisible(false)}
    >
      <Pressable style={styles.modalOverlay} onPress={() => setShareVisible(false)}>
        <View style={styles.shareCard}>
          <Text style={styles.shareTitle}>Share report</Text>
          <Text style={styles.shareDesc}>Share this file by copying the link or downloading it as a PDF.</Text>
          <TouchableOpacity style={styles.shareMainBtn} onPress={() => setShareVisible(false)}>
             <Copy color="#FFFFFF" size={20} />
             <Text style={styles.shareMainText}>Copy link</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareSecBtn} onPress={() => setShareVisible(false)}>
             <FileDown color="#306F6F" size={20} />
             <Text style={styles.shareSecText}>Download PDF</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft color="#717171" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lab reports</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Controls */}
        <View style={styles.controlsRow}>
          <View style={styles.sortBox}>
             <View style={styles.circularIcon}>
               <ArrowUpDown color="#717171" size={24} />
             </View>
             <Text style={styles.controlText}>By date</Text>
          </View>
          <TouchableOpacity style={styles.circularIcon} onPress={() => setFilterVisible(true)}>
             <Settings2 color="#717171" size={24} />
          </TouchableOpacity>
        </View>

        {REPORTS.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Microscope color="#306F6F" size={60} strokeWidth={1} />
            <Text style={styles.emptyTitle}>No lab reports found</Text>
            <Text style={styles.emptySub}>Your test reports will appear here once they are available.</Text>
          </View>
        ) : (
          REPORTS.map(report => (
            <View key={report.id} style={styles.reportCard}>
               <View style={styles.cardTop}>
                 <View style={styles.cardInfo}>
                   <Text style={styles.reportTitle}>{report.title}</Text>
                   <Text style={styles.reportMeta}>
                      {report.date} • <Text style={{ color: report.color }}>{report.message || report.status}</Text>
                   </Text>
                 </View>
                 <TouchableOpacity style={styles.moreBtn} onPress={() => setShareVisible(true)}>
                   <MoreVertical color="#E0E8E8" size={20} />
                 </TouchableOpacity>
               </View>
               
               {report.status !== 'Pending' && (
                 <View style={styles.cardActions}>
                    <TouchableOpacity style={styles.viewBtn}>
                       <Eye color="#FFFFFF" size={18} />
                       <Text style={styles.viewText}>View report</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.downloadBtn}>
                       <Download color="#306F6F" size={18} />
                       <Text style={styles.downText}>Download</Text>
                    </TouchableOpacity>
                 </View>
               )}
            </View>
          ))
        )}
      </ScrollView>

      {renderFilterModal()}
      {renderShareModal()}
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
    fontSize: 20,
    color: '#333333',
    fontWeight: '600',
  },
  placeholder: {
    width: 44,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  sortBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circularIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  controlText: {
    marginLeft: 12,
    fontSize: 18,
    color: '#717171',
    fontWeight: '500',
  },
  reportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 4,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardInfo: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 6,
  },
  reportMeta: {
    fontSize: 15,
    color: '#717171',
  },
  moreBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F7FEFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardActions: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 12,
  },
  viewBtn: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#306F6F',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 8,
  },
  downloadBtn: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#306F6F',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  downText: {
    color: '#306F6F',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333333',
    marginTop: 30,
    marginBottom: 12,
  },
  emptySub: {
    fontSize: 16,
    color: '#717171',
    textAlign: 'center',
    lineHeight: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(48, 111, 111, 0.1)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40,
  },
  filterContainer: {
    width: width,
    height: height * 0.9,
    backgroundColor: '#F7FEFE',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 24,
    paddingTop: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  cancelText: {
    fontSize: 17,
    color: '#306F6F',
  },
  applyText: {
    fontSize: 17,
    color: '#306F6F',
    fontWeight: '700',
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#333333',
  },
  filterScroll: {
    flex: 1,
  },
  filterSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 20,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#E0E8E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: '#306F6F',
    borderColor: '#306F6F',
  },
  checkboxLabel: {
    fontSize: 17,
    color: '#717171',
    marginLeft: 15,
  },
  checkboxLabelActive: {
    color: '#333333',
    fontWeight: '500',
  },
  showAll: {
    marginTop: 5,
  },
  showAllText: {
    fontSize: 17,
    color: '#306F6F',
    fontWeight: '600',
    textAlign: 'center',
  },
  pillRow: {
    flexDirection: 'row',
    gap: 12,
  },
  pill: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillActive: {
    backgroundColor: '#306F6F',
  },
  pillText: {
    fontSize: 16,
    color: '#717171',
  },
  pillTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  resetBtn: {
    marginTop: 30,
    alignItems: 'center',
  },
  resetText: {
    fontSize: 18,
    color: '#FF5252',
    fontWeight: '600',
  },
  shareCard: {
    width: width * 0.85,
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  shareTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 12,
  },
  shareDesc: {
    fontSize: 15,
    color: '#717171',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  shareMainBtn: {
    width: '100%',
    height: 64,
    borderRadius: 32,
    backgroundColor: '#306F6F',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  shareMainText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 10,
  },
  shareSecBtn: {
    width: '100%',
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#306F6F',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareSecText: {
    color: '#306F6F',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 10,
  },
});
