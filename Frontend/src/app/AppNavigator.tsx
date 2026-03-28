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
import { HomeScreen } from '../features/home/screens/HomeScreen';

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
      <Stack.Screen name="Main" component={HomeScreen} />
    </Stack.Navigator>
  );
};
