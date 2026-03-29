import React from 'react';
import { Providers } from './providers';
import { AppNavigator } from './AppNavigator';
import '../i18n';

export default function RootLayout() {
  return (
    <Providers>
      <AppNavigator />
    </Providers>
  );
}
