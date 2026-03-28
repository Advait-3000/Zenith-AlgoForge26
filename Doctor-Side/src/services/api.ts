import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.algo-forge.com/api', // Mock base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mocking some API responses for demo
export const mockData = {
  appointments: [
    {
      id: '1',
      patientName: 'Sarah Jenkins',
      time: '09:00 AM',
      date: '2026-03-29',
      status: 'pending',
      type: 'Routine Check-up',
      patientId: 'p1',
      risk: 'low',
    },
    {
      id: '2',
      patientName: 'Michael Brown',
      time: '10:30 AM',
      date: '2026-03-29',
      status: 'upcoming',
      type: 'Follow-up',
      patientId: 'p2',
      risk: 'medium',
    },
    {
      id: '3',
      patientName: 'Emma Watson',
      time: '11:45 AM',
      date: '2026-03-29',
      status: 'pending',
      type: 'Chest Pain',
      patientId: 'p3',
      risk: 'high',
    },
    {
      id: '4',
      patientName: 'David Miller',
      time: '02:00 PM',
      date: '2026-03-29',
      status: 'completed',
      type: 'Consultation',
      patientId: 'p4',
      risk: 'low',
    },
  ],
  patientReports: {
    'p3': {
      patientInfo: {
        name: 'Emma Watson',
        age: 34,
        bloodType: 'O+',
        vitals: { hr: 92, bp: '145/95', temp: '98.6°F' },
      },
      aiSummary: 'Emma is presenting with persistent chest discomfort and slightly elevated blood pressure. AI analysis suggests a potential minor arrhythmia.',
      riskLevel: 'high',
      keyFindings: [
        'Moderate hypertension detected (145/95)',
        'ST segment changes in recent ECG scan',
        'Family history of cardiovascular issues',
      ],
      recommendations: [
        'Immediate Echo/Stress test',
        'Beta-blocker consultation',
        'Low sodium diet recommendation',
      ],
      pastReports: [
        { id: 'r1', date: '2026-01-15', title: 'General Checkup', result: 'Normal' },
        { id: 'r2', date: '2025-11-20', title: 'Blood Work', result: 'Anemic tendencies' },
      ],
    },
  },
};

// Generic response wrapper for simulation
const simulateResponse = (data: any, delay = 500) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ data }), delay);
  });
};

export const apiService = {
  auth: {
    login: (credentials: any) => simulateResponse({ id: 'doc1', name: 'Dr. John Doe', ...credentials }),
    signup: (data: any) => simulateResponse({ id: 'doc1', ...data }),
  },
  doctor: {
    updateProfile: (profile: any) => simulateResponse({ success: true, ...profile }),
    getProfile: () => simulateResponse({ id: 'doc1', name: 'Dr. John Doe', specialization: 'Cardiology', experience: '12 Years' }),
  },
  appointments: {
    getAll: () => simulateResponse(mockData.appointments),
    reschedule: (id: string, newDateTime: any) => simulateResponse({ success: true, id, ...newDateTime }),
    updateStatus: (id: string, status: string) => simulateResponse({ success: true, id, status }),
  },
  patients: {
    getReport: (id: string) => simulateResponse(mockData.patientReports[id as keyof typeof mockData.patientReports] || null),
  },
  prescriptions: {
    submit: (data: any) => simulateResponse({ success: true, ...data }),
  },
};

export default api;
