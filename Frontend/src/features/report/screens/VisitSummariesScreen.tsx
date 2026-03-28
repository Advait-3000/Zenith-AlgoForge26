import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  FileUp, 
  ScanLine, 
  Info,
  ChevronRight,
  Sparkles,
  X,
  FileText,
  Check
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

export const VisitSummariesScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [selectedDocs, setSelectedDocs] = useState<any[]>([]);

  const simulateUpload = (newDocs: any[]) => {
    // Add docs with 0% progress
    const docsWithProgress = newDocs.map(d => ({ ...d, progress: 0, isDone: false }));
    setSelectedDocs(prev => [...prev, ...docsWithProgress]);

    // Simulate progress for each new doc
    docsWithProgress.forEach((doc, idx) => {
      const globalIdx = selectedDocs.length + idx;
      let p = 0;
      const interval = setInterval(() => {
        p += Math.random() * 30;
        if (p >= 100) {
          p = 100;
          clearInterval(interval);
          setSelectedDocs(curr => {
            const next = [...curr];
            if (next[globalIdx]) {
              next[globalIdx].progress = 100;
              next[globalIdx].isDone = true;
            }
            return next;
          });
        } else {
          setSelectedDocs(curr => {
            const next = [...curr];
            if (next[globalIdx]) next[globalIdx].progress = p;
            return next;
          });
        }
      }, 400);
    });
  };

  const handlePickPDF = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        multiple: true,
      });

      if (!result.canceled) {
        simulateUpload(result.assets);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick documents.');
    }
  };

  const handleScanReport = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera access to scan your reports.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        simulateUpload([result.assets[0]]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to scan document.');
    }
  };

  const handleRemoveDoc = (index: number) => {
    const newDocs = [...selectedDocs];
    newDocs.splice(index, 1);
    setSelectedDocs(newDocs);
  };

  const handleStartAnalysis = () => {
    if (selectedDocs.length === 0) {
      Alert.alert('No files', 'Please upload or scan at least one report.');
      return;
    }
    // Navigate to a processing state/animation screen
    navigation.navigate('SummaryProcessing', { files: selectedDocs });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft color="#717171" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Visit summaries</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.promoCard}>
           <View style={styles.promoIcon}>
              <Sparkles color="#FFFFFF" size={28} />
           </View>
           <View style={styles.promoTextContainer}>
              <Text style={styles.promoTitle}>AI-Powered Portfolio</Text>
              <Text style={styles.promoDesc}>Our AI will analyze your medical history from PDFs or scans to generate a comprehensive medical portfolio.</Text>
           </View>
        </View>

        <Text style={styles.sectionLabel}>Select an option to start</Text>

        <TouchableOpacity style={styles.optionCard} onPress={handlePickPDF}>
           <View style={[styles.iconBox, { backgroundColor: '#EAF9F9' }]}>
              <FileUp color="#306F6F" size={30} />
           </View>
           <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>Upload PDF Reports</Text>
              <Text style={styles.optionSub}>Directly upload digital laboratory or clinical summaries.</Text>
           </View>
           <ChevronRight color="#E0E8E8" size={24} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCard} onPress={handleScanReport}>
           <View style={[styles.iconBox, { backgroundColor: '#FFF7E6' }]}>
              <ScanLine color="#FBB03B" size={30} />
           </View>
           <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>Scan Hardcopy Reports</Text>
              <Text style={styles.optionSub}>Scan physical documents using your device camera.</Text>
           </View>
           <ChevronRight color="#E0E8E8" size={24} />
        </TouchableOpacity>

        {selectedDocs.length > 0 && (
          <View style={styles.selectedContainer}>
             <Text style={styles.selectedTitle}>Selected files ({selectedDocs.length})</Text>
             {selectedDocs.map((doc, index) => (
               <View key={index} style={styles.fileCard}>
                  <View style={styles.fileRow}>
                    <FileText color="#306F6F" size={20} />
                    <View style={{ flex: 1 }}>
                       <Text style={styles.fileName} numberOfLines={1}>{doc.name || `Scan_${index + 1}`}</Text>
                       <Text style={styles.fileSize}>{doc.size ? `${(doc.size / 1024).toFixed(1)} KB` : 'Image scan'}</Text>
                    </View>
                    {doc.progress === 100 ? (
                      <Check color="#306F6F" size={20} />
                    ) : (
                      <TouchableOpacity onPress={() => handleRemoveDoc(index)}>
                        <X color="#FF5252" size={20} />
                      </TouchableOpacity>
                    )}
                  </View>
                  
                  {doc.progress < 100 && (
                    <View style={styles.progressContainer}>
                       <View style={[styles.progressBar, { width: `${doc.progress}%` }]} />
                    </View>
                  )}
                  {doc.progress < 100 && (
                    <Text style={styles.uploadingText}>Uploading... {Math.round(doc.progress)}%</Text>
                  )}
               </View>
             ))}

             <TouchableOpacity 
                style={[
                  styles.analyzeBtn, 
                  selectedDocs.some(d => !d.isDone) && { opacity: 0.5 }
                ]} 
                onPress={handleStartAnalysis}
                disabled={selectedDocs.some(d => !d.isDone)}
             >
                <Sparkles color="#FFFFFF" size={20} />
                <Text style={styles.analyzeText}>Analyze all reports</Text>
             </TouchableOpacity>
          </View>
        )}

        <View style={styles.infoBox}>
           <Info color="#306F6F" size={20} />
           <Text style={styles.infoText}>Data processing is encrypted and handled by our HIPAA-compliant medical AI model.</Text>
        </View>
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
  promoCard: {
    backgroundColor: '#306F6F',
    borderRadius: 30,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  promoIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  promoTextContainer: {
    flex: 1,
  },
  promoTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 5,
  },
  promoDesc: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    lineHeight: 20,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 20,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
  },
  optionSub: {
    fontSize: 14,
    color: '#717171',
    marginTop: 4,
    lineHeight: 18,
  },
  selectedContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 24,
    marginTop: 10,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  selectedTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 15,
  },
  fileCard: {
    backgroundColor: '#F7FEFE',
    borderRadius: 15,
    padding: 12,
    marginBottom: 12,
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fileName: {
    flex: 1,
    fontSize: 15,
    color: '#333333',
    fontWeight: '600',
  },
  fileSize: {
    fontSize: 12,
    color: '#717171',
    marginTop: 2,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#E0E8E8',
    borderRadius: 2,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#306F6F',
    borderRadius: 2,
  },
  uploadingText: {
    fontSize: 11,
    color: '#306F6F',
    marginTop: 4,
    fontWeight: '600',
  },
  analyzeBtn: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    backgroundColor: '#306F6F',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 10,
  },
  analyzeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#EAF9F9',
    padding: 16,
    borderRadius: 20,
    marginTop: 20,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#306F6F',
    lineHeight: 18,
  },
});
