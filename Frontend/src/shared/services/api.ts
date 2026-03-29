import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';

// ─── IMPORTANT NETWORK CONFIGURATION ───
// If testing on a Physical Device: Your phone AND computer MUST be on the exact same Wi-Fi network!
// If your phone is on Cellular Data (LTE/5G), it will throw a Timeout Network Error.
const PC_WIFI_IP = '10.186.1.226'; // Your Windows PC IP address
const DEV_URL = Platform.OS === 'android' ? 'http://10.186.1.226:3000' : 'http://localhost:3000';

// Change this to use DEV_URL if testing on Android Studio Emulator or iOS Simulator
const BASE_URL = `http://${PC_WIFI_IP}:3000`;

// ─── Token helpers ─────────────────────────────────────
export const saveToken = async (token: string) => {
  await AsyncStorage.setItem('auth_token', token);
};

export const getToken = async (): Promise<string | null> => {
  return AsyncStorage.getItem('auth_token');
};

export const removeToken = async () => {
  await AsyncStorage.removeItem('auth_token');
};

export const saveUserData = async (user: any) => {
  await AsyncStorage.setItem('user_data', JSON.stringify(user));
};

export const getUserData = async () => {
  const data = await AsyncStorage.getItem('user_data');
  return data ? JSON.parse(data) : null;
};

export const clearAllAuth = async () => {
  await AsyncStorage.multiRemove(['auth_token', 'user_data']);
};

// ─── API request helper ────────────────────────────────
const apiRequest = async (
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any,
  requiresAuth: boolean = false
) => {
  const headers: any = {
    'Content-Type': 'application/json',
  };

  if (requiresAuth) {
    const token = await getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// ─── Auth API calls ────────────────────────────────────

/**
 * Register a new user
 * POST /auth/register
 */
export const registerUser = async (payload: {
  email: string;
  password: string;
  full_name: string;
  role: string;
}) => {
  const data = await apiRequest('/auth/register', 'POST', payload);

  if (data.success && data.token) {
    await saveToken(data.token);
    await saveUserData(data.user);
  }

  return data;
};

/**
 * Login user
 * POST /auth/login
 */
export const loginUser = async (payload: {
  email: string;
  password: string;
}) => {
  const data = await apiRequest('/auth/login', 'POST', payload);

  if (data.success && data.token) {
    await saveToken(data.token);
    await saveUserData(data.user);
  }

  return data;
};

/**
 * Update user profile (requires auth token)
 * PUT /auth/updateProfile
 */
export const updateUserProfile = async (payload: {
  full_name?: string;
  contact_number?: string;
  patient_details?: {
    date_of_birth?: string;
    gender?: string;
    vitals?: {
      height_cm?: number;
      weight_kg?: number;
      bmi?: number;
      blood_group?: string;
      allergies?: string[];
    };
    emergency_contacts?: Array<{
      name: string;
      relation: string;
      phone: string;
    }>;
    disease_history?: Array<{
      disease_name: string;
      status: string;
      diagnosis_date?: string;
    }>;
  };
}) => {
  const data = await apiRequest('/auth/updateProfile', 'PUT', payload, true);

  if (data.success && data.user) {
    await saveUserData(data.user);
  }

  return data;
};

// ─── OCR / Scan API calls ──────────────────────────────

/**
 * Upload a medical document for AI analysis
 * POST /ocr/upload-scan
 * Uses multipart/form-data (not JSON)
 */
// export const uploadMedicalDocument = async (
//   fileUri: string,
//   fileName: string,
//   mimeType: string,
//   patientId: string
// ) => {
//   const token = await getToken();

//   const formData = new FormData();
//   formData.append('medical_document', {
//     uri: fileUri,
//     name: fileName,
//     type: mimeType,
//   } as any);
//   formData.append('patientId', patientId);

//   // Use AbortController with 5-min timeout for long Gemini AI processing
//   const controller = new AbortController();
//   // const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minutes

//   try {
//     const response = await fetch(`${BASE_URL}/ocr/upload-scan`, {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${token}`,
//         // Do NOT set Content-Type — RN sets multipart/form-data boundary automatically
//       },
//       body: formData,
//       signal: controller.signal,
//     });

//     const rawText = await response.text();
//     let data;
//     try {
//       data = JSON.parse(rawText);
//     } catch (err) {
//       console.error('OCR Upload received non-JSON:', rawText.substring(0, 500));
//       throw new Error(rawText.substring(0, 100).trim());
//     }

//     if (!response.ok) {
//       throw new Error(data.message || 'Failed to upload document');
//     }

//     // Save the analysis result locally for use across the app
//     if (data.success && data.analysis) {
//       await saveScanResult(data);
//     }

//     return data;
//   } finally {
//     // clearTimeout(timeoutId);
//   }
// };
// shared/services/api.ts

export const uploadMedicalDocument = async (
  fileUri: string,
  fileName: string,
  mimeType: string,
  patientId: string
) => {
  const token = await getToken();

  const formData = new FormData();
  formData.append('medical_document', {
    uri: fileUri,
    name: fileName,
    type: mimeType,
  } as any);
  formData.append('patientId', patientId);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 min timeout

  try {
    const response = await fetch(`${BASE_URL}/ocr/upload-scan`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // ❌ Do NOT set Content-Type manually
      },
      body: formData,
      signal: controller.signal,
    });

    const rawText = await response.text();
    let data: any;

    try {
      data = JSON.parse(rawText);
    } catch {
      console.error('Non-JSON response:', rawText.substring(0, 500));
      throw new Error(rawText.substring(0, 150).trim() || 'Server returned invalid response');
    }

    if (!response.ok) {
      throw new Error(data?.message || `Server error: ${response.status}`);
    }

    if (!data.success) {
      throw new Error(data?.message || 'Upload failed');
    }

    // Save result locally for use across the app
    if (data.analysis) {
      await saveScanResult(data);
    }

    return data;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. The AI analysis is taking too long. Please try again.');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};
/**
 * Save scan result to AsyncStorage for use across the app
 */
export const saveScanResult = async (scanData: any) => {
  try {
    // Save latest scan
    await AsyncStorage.setItem('latest_scan_result', JSON.stringify(scanData));

    // Append to scan history
    const historyRaw = await AsyncStorage.getItem('scan_history');
    const history = historyRaw ? JSON.parse(historyRaw) : [];
    history.unshift({
      ...scanData,
      timestamp: new Date().toISOString(),
    });
    // Keep only last 20 scans
    await AsyncStorage.setItem('scan_history', JSON.stringify(history.slice(0, 20)));
  } catch (err) {
    console.warn('Failed to save scan result:', err);
  }
};

/**
 * Get the latest scan result from local storage
 */
export const getLatestScanResult = async () => {
  try {
    const data = await AsyncStorage.getItem('latest_scan_result');
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

/**
 * Get all scan history from local storage
 */
export const getScanHistory = async () => {
  try {
    const data = await AsyncStorage.getItem('scan_history');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// ─── Chatbot API calls ─────────────────────────────────

/**
 * Ask the AI chatbot a question
 * POST /chatbot/
 */
export const askChatbot = async (question: string) => {
  const data = await apiRequest('/chatbot/', 'POST', { question }, true);
  return data;
};
