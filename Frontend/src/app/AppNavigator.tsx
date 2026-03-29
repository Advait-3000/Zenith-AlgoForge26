import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SplashScreen } from '../features/onboarding/screens/SplashScreen';
import { OnboardingScreen } from '../features/onboarding/screens/OnboardingScreen';
import { WelcomeScreen } from '../features/onboarding/screens/WelcomeScreen';

import { LoginScreen } from '../features/auth/screens/LoginScreen';
import { CreateAccountScreen } from '../features/auth/screens/CreateAccountScreen';
import { ForgotPasswordScreen } from '../features/auth/screens/ForgotPasswordScreen';
import { OtpResetScreen } from '../features/auth/screens/OtpResetScreen';
import { ResetPasswordScreen } from '../features/auth/screens/ResetPasswordScreen';
import { OtpVerificationScreen } from '../features/auth/screens/OtpVerificationScreen';
import { VerifiedSuccessScreen } from '../features/auth/screens/VerifiedSuccessScreen';

import { PersonalDataScreen } from '../features/onboarding/screens/PersonalDataScreen';
import { EmergencyContactScreen } from '../features/onboarding/screens/EmergencyContactScreen';
import { HealthAssessmentScreen } from '../features/onboarding/screens/HealthAssessmentScreen';
import { LifestyleInfoScreen } from '../features/onboarding/screens/LifestyleInfoScreen';
import { InsuranceInfoScreen } from '../features/onboarding/screens/InsuranceInfoScreen';
import { MainTabNavigator } from './MainTabNavigator';

import { DoctorSearchScreen } from '../features/home/screens/DoctorSearchScreen';
import { DoctorFilterScreen } from '../features/home/screens/DoctorFilterScreen';
import { DoctorProfileScreen } from '../features/home/screens/DoctorProfileScreen';
import { ReviewFormScreen } from '../features/home/screens/ReviewFormScreen';
import { BookingConfirmationScreen } from '../features/home/screens/BookingConfirmationScreen';
import { LabReportsScreen } from '../features/report/screens/LabReportsScreen';
import { PrescriptionScreen } from '../features/report/screens/PrescriptionScreen';
import { MedicationDetailsScreen } from '../features/report/screens/MedicationDetailsScreen';
import { HealthMetricsScreen } from '../features/report/screens/HealthMetricsScreen';
import { HealthMetricsEditScreen } from '../features/report/screens/HealthMetricsEditScreen';
import { VisitSummariesScreen } from '../features/report/screens/VisitSummariesScreen';
import { SummaryProcessingScreen } from '../features/report/screens/SummaryProcessingScreen';
import { MedicalPortfolioScreen } from '../features/report/screens/MedicalPortfolioScreen';
import { ChatScreen } from '../features/analysis/screens/ChatScreen';
import { EditProfileScreen } from '../features/settings/screens/EditProfileScreen';
import { NotificationSettingsScreen } from '../features/settings/screens/NotificationSettingsScreen';
import { ChangeEmailScreen } from '../features/settings/screens/ChangeEmailScreen';
import { VerifyChangeEmailScreen } from '../features/settings/screens/VerifyChangeEmailScreen';
import { FAQScreen } from '../features/settings/screens/FAQScreen';
import { NotificationsScreen } from '../features/history/screens/NotificationsScreen';
import { NoInternetScreen, ServerErrorScreen } from '../features/error/screens/ErrorScreens';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Welcome: undefined;
  Login: undefined;
  CreateAccount: undefined;
  OtpVerification: undefined;
  VerifiedSuccess: undefined;
  ForgotPassword: undefined;
  OtpReset: undefined;
  ResetPassword: undefined;
  PersonalData: undefined;
  EmergencyContact: undefined;
  HealthAssessment: undefined;
  LifestyleInfo: undefined;
  InsuranceInfo: undefined;
  Main: undefined;
  Chat: undefined;
  DoctorSearch: { query?: string } | undefined;
  DoctorFilter: undefined;
  DoctorProfile: { doctorId: string };
  ReviewForm: undefined;
  BookingConfirmation: undefined;
  LabReports: undefined;
  Prescriptions: undefined;
  MedicationDetails: { id: string };
  HealthMetrics: undefined;
  HealthMetricsEdit: { type: string };
  VisitSummaries: undefined;
  SummaryProcessing: { files: any[] };
  MedicalPortfolio: { scanResult?: any } | undefined;
  EditProfile: undefined;
  NotificationSettings: undefined;
  ChangeEmail: undefined;
  VerifyChangeEmail: { email: string };
  FAQ: undefined;
  Notifications: undefined;
  NoInternet: undefined;
  ServerError: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        animation: 'fade', // Smooth transitions matching the premium feel
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
      <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
      <Stack.Screen name="VerifiedSuccess" component={VerifiedSuccessScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="OtpReset" component={OtpResetScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="PersonalData" component={PersonalDataScreen} />
      <Stack.Screen name="EmergencyContact" component={EmergencyContactScreen} />
      <Stack.Screen name="HealthAssessment" component={HealthAssessmentScreen} />
      <Stack.Screen name="LifestyleInfo" component={LifestyleInfoScreen} />
      <Stack.Screen name="InsuranceInfo" component={InsuranceInfoScreen} />
      <Stack.Screen name="Main" component={MainTabNavigator} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="DoctorSearch" component={DoctorSearchScreen} />
      <Stack.Screen name="DoctorFilter" component={DoctorFilterScreen} />
      <Stack.Screen name="DoctorProfile" component={DoctorProfileScreen} />
      <Stack.Screen name="ReviewForm" component={ReviewFormScreen} />
      <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
      <Stack.Screen name="LabReports" component={LabReportsScreen} />
      <Stack.Screen name="Prescriptions" component={PrescriptionScreen} />
      <Stack.Screen name="MedicationDetails" component={MedicationDetailsScreen} />
      <Stack.Screen name="HealthMetrics" component={HealthMetricsScreen} />
      <Stack.Screen name="HealthMetricsEdit" component={HealthMetricsEditScreen} />
      <Stack.Screen name="VisitSummaries" component={VisitSummariesScreen} />
      <Stack.Screen name="SummaryProcessing" component={SummaryProcessingScreen} />
      <Stack.Screen name="MedicalPortfolio" component={MedicalPortfolioScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
      <Stack.Screen name="ChangeEmail" component={ChangeEmailScreen} />
      <Stack.Screen name="VerifyChangeEmail" component={VerifyChangeEmailScreen} />
      <Stack.Screen name="FAQ" component={FAQScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="NoInternet" component={NoInternetScreen} />
      <Stack.Screen name="ServerError" component={ServerErrorScreen} />
    </Stack.Navigator>
  );
};
