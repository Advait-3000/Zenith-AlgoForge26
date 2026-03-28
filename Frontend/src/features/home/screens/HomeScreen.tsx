import React from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const HomeScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Home Dashboard</Text>
        <Text style={styles.subtitle}>Welcome to CURA. Your health data is securely saved. Explore your upcoming appointments and history here.</Text>
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
    padding: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#717171',
    textAlign: 'center',
    lineHeight: 26,
  },
});
