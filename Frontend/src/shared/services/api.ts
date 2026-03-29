import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// ─── IMPORTANT NETWORK CONFIGURATION ───
const PC_WIFI_IP = '10.186.1.226'; // Your Windows PC IP address

// Exported for use in other parts of the app
export const BASE_URL = `http://${PC_WIFI_IP}:3000`;

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

  // ⚠️ Global 401 Handler: logout if token is invalid/expired
  if (response.status === 401) {
    console.warn('Authentication expired. Clearing session.');
    await clearAllAuth();
    throw new Error('Your session has expired. Please login again.');
  }

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// ─── Auth API calls ────────────────────────────────────

export const registerUser = async (payload: any) => {
  const data = await apiRequest('/auth/register', 'POST', payload);
  if (data.success && data.token) {
    await saveToken(data.token);
    await saveUserData(data.user);
  }
  return data;
};

export const loginUser = async (payload: any) => {
  const data = await apiRequest('/auth/login', 'POST', payload);
  if (data.success && data.token) {
    await saveToken(data.token);
    await saveUserData(data.user);
  }
  return data;
};

export const updateUserProfile = async (payload: any) => {
  const data = await apiRequest('/auth/updateProfile', 'PUT', payload, true);
  if (data.success && data.user) {
    await saveUserData(data.user);
  }
  return data;
};

export const getMe = async () => {
  return await apiRequest('/auth/me', 'GET', null, true);
};

// ─── AI & Scanning API calls ───────────────────────────

export const uploadMedicalDocument = async (
  fileUri: string,
  fileName: string,
  mimeType: string,
  patientId: string
) => {
  const token = await getToken();
  if (!token) throw new Error('Not authenticated. Please login.');

  const formData = new FormData();
  formData.append('medical_document', {
    uri: fileUri,
    name: fileName,
    type: mimeType,
  } as any);
  
  if (patientId) formData.append('patientId', patientId);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 300000); 

  try {
    const response = await fetch(`${BASE_URL}/ocr/upload-scan`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
      signal: controller.signal,
    });

    if (response.status === 401) {
      await clearAllAuth();
      throw new Error('Your session has expired. Please login again.');
    }

    const rawText = await response.text();
    let data: any;
    try {
      data = JSON.parse(rawText);
    } catch {
      throw new Error('Server returned invalid response');
    }

    if (!response.ok) {
      throw new Error(data?.message || `Server error: ${response.status}`);
    }

    if (data.analysis) {
      await saveScanResult(data);
    }

    return data;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

export const saveScanResult = async (scanData: any) => {
  try {
    await AsyncStorage.setItem('latest_scan_result', JSON.stringify(scanData));
    const historyRaw = await AsyncStorage.getItem('scan_history');
    const history = historyRaw ? JSON.parse(historyRaw) : [];
    history.unshift({ ...scanData, timestamp: new Date().toISOString() });
    await AsyncStorage.setItem('scan_history', JSON.stringify(history.slice(0, 20)));
  } catch (err) {
    console.warn('Failed to save scan result:', err);
  }
};

export const getLatestScanResult = async () => {
  const data = await AsyncStorage.getItem('latest_scan_result');
  return data ? JSON.parse(data) : null;
};

export const getScanHistory = async () => {
  const data = await AsyncStorage.getItem('scan_history');
  return data ? JSON.parse(data) : [];
};

export const askChatbot = async (question: string) => {
  return await apiRequest('/chatbot/', 'POST', { question }, true);
};

export const askGeneralAI = async (message: string) => {
  return await apiRequest('/ask/', 'POST', { message }, true);
};

export const bookEmergencyAppointment = async (payload: any) => {
  return await apiRequest('/api/appointments/book', 'POST', payload, true);
};
