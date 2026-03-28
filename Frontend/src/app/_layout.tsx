import React from 'react';
import { Providers } from './providers';
import { AppNavigator } from './AppNavigator';

export default function RootLayout() {
  return (
    <Providers>
      <AppNavigator />
    </Providers>
  );
}
