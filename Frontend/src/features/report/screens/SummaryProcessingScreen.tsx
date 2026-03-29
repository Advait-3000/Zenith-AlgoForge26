// import React, { useEffect, useState, useRef } from 'react';
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   Dimensions, 
//   ActivityIndicator,
//   Alert,
//   Animated,
//   Easing
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { 
//   Sparkles,
//   Search,
//   BrainCircuit,
//   FileCheck,
//   CheckCircle,
//   AlertTriangle
// } from 'lucide-react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { getUserData } from '../../../shared/services/api';
// import { uploadMedicalDocument } from '../../../shared/services/api';
// import * as FileSystem from 'expo-file-system/legacy';

// const { width } = Dimensions.get('window');

// const LOADING_STEPS = [
//   { id: '1', title: 'Uploading & extracting data via OCR...', color: '#306F6F', icon: Search },
//   { id: '2', title: 'AI analyzing clinical metrics...', color: '#4A90E2', icon: BrainCircuit },
//   { id: '3', title: 'Generating summary report...', color: '#FBB03B', icon: FileCheck },
// ];

// export const SummaryProcessingScreen: React.FC = () => {
//   const navigation = useNavigation<any>();
//   const route = useRoute<any>();
//   const { files } = route.params || { files: [] };
//   const [currentStep, setCurrentStep] = useState(0);
//   const [isDone, setIsDone] = useState(false);
//   const [hasError, setHasError] = useState(false);
//   const [errorMsg, setErrorMsg] = useState('');

//   // Spinning animation for the sparkle icon
//   const spinAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Animated.loop(
//       Animated.timing(spinAnim, {
//         toValue: 1,
//         duration: 2500,
//         easing: Easing.linear,
//         useNativeDriver: true,
//       })
//     ).start();
//   }, []);

//   const spin = spinAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['0deg', '360deg'],
//   });

//   // Process files by calling the actual OCR API
//   useEffect(() => {
//     const processFiles = async () => {
//       try {
//         if (!files || files.length === 0) {
//           throw new Error('No files to process');
//         }

//         // Step 1: Upload & OCR
//         setCurrentStep(0);

//         // Get user data for patientId
//         const userData = await getUserData();
//         const patientId = userData?.id || '';

//         // Upload each file (process the first file for now; the backend handles one at a time)
//         const file = files[0];
//         let fileUri = file.uri;
//         let fileName = file.name || `scan_${Date.now()}.jpg`;
//         const mimeType = file.mimeType || file.type || 
//           (fileName.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg');

//         // 🔥 FIX FOR ANDROID CONTENT URIs Network Request Failed 🔥
//         // React Native often crashes throwing 'Network request failed' on FormData uploads
//         // if the file sits in Scoped Storage via a content:// URI. Deep copy it to cache first.
//         if (fileUri.startsWith('content://')) {
//           // @ts-ignore
//           const cachePath = `${FileSystem.cacheDirectory}${fileName}`;
//           await FileSystem.copyAsync({
//             from: fileUri,
//             to: cachePath
//           });
//           fileUri = cachePath;
//         }

//         // Move to step 2 after a short delay for UX
//         const step2Timer = setTimeout(() => setCurrentStep(1), 3000);

//         // Actually call the API
//         const result = await uploadMedicalDocument(fileUri, fileName, mimeType, patientId);

//         clearTimeout(step2Timer);

//         // Step 3: Generating summary
//         setCurrentStep(2);

//         // Give user time to see the final step
//         await new Promise(resolve => setTimeout(resolve, 2000));

//         setIsDone(true);

//         // Navigate to MedicalPortfolio with the scan result
//         setTimeout(() => {
//           navigation.navigate('MedicalPortfolio', { scanResult: result });
//         }, 1500);

//       } catch (error: any) {
//         console.error('OCR Processing Error:', error);
//         setHasError(true);
//         setErrorMsg(error.message || 'Failed to process document');

//         // Show error and navigate back after delay
//         setTimeout(() => {
//           Alert.alert(
//             'Processing Failed',
//             error.message || 'Something went wrong while analyzing your document.',
//             [{ text: 'OK', onPress: () => navigation.goBack() }]
//           );
//         }, 500);
//       }
//     };

//     processFiles();
//   }, []);

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.content}>
//         <Animated.View style={[styles.iconContainer, { transform: [{ rotate: isDone ? '0deg' : spin }] }]}>
//           {isDone ? (
//             <CheckCircle stroke="#306F6F" size={64} strokeWidth={1.5} />
//           ) : hasError ? (
//             <AlertTriangle stroke="#FF5252" size={64} strokeWidth={1.5} />
//           ) : (
//             <Sparkles stroke="#306F6F" size={64} strokeWidth={1.5} />
//           )}
//         </Animated.View>

//         <Text style={styles.title}>
//           {isDone ? 'Analysis Complete!' : hasError ? 'Processing Failed' : 'Analyzing your reports'}
//         </Text>
//         <Text style={styles.subtitle}>
//           {isDone
//             ? 'Your medical summary has been generated successfully.'
//             : hasError
//             ? errorMsg
//             : `Our AI is processing your ${files.length} document${files.length !== 1 ? 's' : ''} to generate your medical summary.`
//           }
//         </Text>

//         <View style={styles.stepsBox}>
//           {LOADING_STEPS.map((step, index) => {
//              const Icon = step.icon;
//              const isActive = index === currentStep && !isDone && !hasError;
//              const isDoneStep = index < currentStep || isDone;
//              const isErrorStep = hasError && index === currentStep;

//              return (
//                <View key={step.id} style={styles.stepRow}>
//                  <View style={[
//                    styles.stepIcon, 
//                    isDoneStep && styles.stepIconDone, 
//                    isActive && styles.stepIconActive,
//                    isErrorStep && styles.stepIconError,
//                  ]}>
//                     <Icon stroke={isActive || isDoneStep ? '#FFFFFF' : isErrorStep ? '#FFFFFF' : '#A0A0A0'} size={20} />
//                  </View>
//                  <Text style={[
//                    styles.stepText, 
//                    isActive && styles.stepTextActive, 
//                    isDoneStep && styles.stepTextDone,
//                    isErrorStep && styles.stepTextError,
//                  ]}>
//                     {step.title}
//                  </Text>
//                  {isActive && <ActivityIndicator size="small" color="#306F6F" />}
//                  {isDoneStep && <CheckCircle stroke="#306F6F" size={18} />}
//                </View>
//              );
//           })}
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F7FEFE',
//   },
//   content: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 40,
//   },
//   iconContainer: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: '#FFFFFF',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 40,
//     shadowColor: '#306F6F',
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.1,
//     shadowRadius: 20,
//     elevation: 8,
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: '700',
//     color: '#333333',
//     marginBottom: 15,
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#717171',
//     textAlign: 'center',
//     lineHeight: 24,
//     marginBottom: 50,
//   },
//   stepsBox: {
//     width: '100%',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 40,
//     padding: 30,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.04,
//     shadowRadius: 12,
//     elevation: 4,
//   },
//   stepRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 25,
//   },
//   stepIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 12,
//     backgroundColor: '#F7FEFE',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 15,
//   },
//   stepIconActive: {
//     backgroundColor: '#306F6F',
//   },
//   stepIconDone: {
//     backgroundColor: '#FBB03B',
//   },
//   stepIconError: {
//     backgroundColor: '#FF5252',
//   },
//   stepText: {
//     flex: 1,
//     fontSize: 16,
//     color: '#A0A0A0',
//   },
//   stepTextActive: {
//     color: '#333333',
//     fontWeight: '700',
//   },
//   stepTextDone: {
//     color: '#306F6F',
//     fontWeight: '600',
//   },
//   stepTextError: {
//     color: '#FF5252',
//     fontWeight: '600',
//   },
// });
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Sparkles,
  Search,
  BrainCircuit,
  FileCheck,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getUserData, uploadMedicalDocument } from '../../../shared/services/api';
import * as FileSystem from 'expo-file-system/legacy';

const LOADING_STEPS = [
  { id: '1', title: 'Uploading & extracting data via OCR...', icon: Search },
  { id: '2', title: 'AI analyzing clinical metrics...', icon: BrainCircuit },
  { id: '3', title: 'Generating summary report...', icon: FileCheck },
];

// Approximate time each step takes on the backend
// Step 1 (upload + OCR): ~4s, Step 2 (AI): ~10s, Step 3 (write result): ~2s
const STEP_ADVANCE_DELAYS = [4000, 10000];

export const SummaryProcessingScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { files } = route.params || { files: [] };

  const [currentStep, setCurrentStep] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const alertShown = useRef(false);

  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 2500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    const processFiles = async () => {
      try {
        if (!files || files.length === 0) {
          throw new Error('No files provided. Please select a document and try again.');
        }

        // ── Step 1: Uploading ──────────────────────────────────────────
        setCurrentStep(0);

        const userData = await getUserData();
        const patientId = userData?.id ? String(userData.id) : '';

        if (!patientId) {
          throw new Error('Patient ID not found. Please log in again.');
        }

        const file = files[0];
        let fileUri: string = file.uri;
        const fileName: string = file.name || `scan_${Date.now()}.jpg`;
        const mimeType: string =
          file.mimeType ||
          file.type ||
          (fileName.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/jpeg');

        // Fix for Android content:// URIs (Scoped Storage)
        if (fileUri.startsWith('content://')) {
          const cachePath = `${FileSystem.cacheDirectory}${fileName}`;
          await FileSystem.copyAsync({ from: fileUri, to: cachePath });
          fileUri = cachePath;
        }

        // Advance to step 2 after delay (UX — backend is processing)
        timers.push(setTimeout(() => setCurrentStep(1), STEP_ADVANCE_DELAYS[0]));

        // ── API Call ───────────────────────────────────────────────────
        // This is a long-running call (~15-30s) because Gemini AI runs server-side
        const result = await uploadMedicalDocument(fileUri, fileName, mimeType, patientId);

        // Clear pending step timers — we have the result now
        timers.forEach(clearTimeout);
        timers.length = 0;

        // ── Step 3: Generating summary ─────────────────────────────────
        setCurrentStep(2);
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsDone(true);

        // Navigate with full analysis data
        timers.push(
          setTimeout(() => {
            navigation.navigate('MedicalPortfolio', {
              scanResult: result,          // full response object
              analysis: result.analysis,  // extracted analysis for convenience
              recordId: result.record_id,
              summaryUrl: result.summary_url,
            });
          }, 1500)
        );
      } catch (error: any) {
        timers.forEach(clearTimeout);
        console.error('OCR Processing Error:', error);

        const message = error.message || 'Failed to process document. Please try again.';
        setHasError(true);
        setErrorMsg(message);

        if (!alertShown.current) {
          alertShown.current = true;
          setTimeout(() => {
            Alert.alert('Processing Failed', message, [
              { text: 'OK', onPress: () => navigation.goBack() },
            ]);
          }, 500);
        }
      }
    };

    processFiles();

    // Cleanup on unmount
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        {/* ── Icon ── */}
        <Animated.View
          style={[
            styles.iconContainer,
            { transform: [{ rotate: isDone || hasError ? '0deg' : spin }] },
          ]}
        >
          {isDone ? (
            <CheckCircle stroke="#306F6F" size={64} strokeWidth={1.5} />
          ) : hasError ? (
            <AlertTriangle stroke="#FF5252" size={64} strokeWidth={1.5} />
          ) : (
            <Sparkles stroke="#306F6F" size={64} strokeWidth={1.5} />
          )}
        </Animated.View>

        {/* ── Title ── */}
        <Text style={styles.title}>
          {isDone
            ? 'Analysis Complete!'
            : hasError
            ? 'Processing Failed'
            : 'Analyzing your reports'}
        </Text>

        {/* ── Subtitle ── */}
        <Text style={styles.subtitle}>
          {isDone
            ? 'Your medical summary has been generated successfully.'
            : hasError
            ? errorMsg
            : `Our AI is processing your ${files.length} document${
                files.length !== 1 ? 's' : ''
              } to generate your medical summary.`}
        </Text>

        {/* ── Steps ── */}
        <View style={styles.stepsBox}>
          {LOADING_STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep && !isDone && !hasError;
            const isDoneStep = index < currentStep || isDone;
            const isErrorStep = hasError && index === currentStep;

            return (
              <View
                key={step.id}
                style={[styles.stepRow, index === LOADING_STEPS.length - 1 && { marginBottom: 0 }]}
              >
                <View
                  style={[
                    styles.stepIcon,
                    isDoneStep && styles.stepIconDone,
                    isActive && styles.stepIconActive,
                    isErrorStep && styles.stepIconError,
                  ]}
                >
                  <Icon
                    stroke={isActive || isDoneStep || isErrorStep ? '#FFFFFF' : '#A0A0A0'}
                    size={20}
                  />
                </View>

                <Text
                  style={[
                    styles.stepText,
                    isActive && styles.stepTextActive,
                    isDoneStep && styles.stepTextDone,
                    isErrorStep && styles.stepTextError,
                  ]}
                >
                  {step.title}
                </Text>

                {isActive && <ActivityIndicator size="small" color="#306F6F" />}
                {isDoneStep && <CheckCircle stroke="#306F6F" size={18} />}
              </View>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FEFE',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#306F6F',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#717171',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 50,
  },
  stepsBox: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 4,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F7FEFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  stepIconActive: { backgroundColor: '#306F6F' },
  stepIconDone:   { backgroundColor: '#FBB03B' },
  stepIconError:  { backgroundColor: '#FF5252' },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: '#A0A0A0',
  },
  stepTextActive: { color: '#333333', fontWeight: '700' },
  stepTextDone:   { color: '#306F6F', fontWeight: '600' },
  stepTextError:  { color: '#FF5252', fontWeight: '600' },
});
