import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  WifiOff, 
  AlertCircle,
  Home,
  Briefcase,
  MessageCircle,
  User 
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const BottomNavMock = () => (
  <View style={styles.navWrapper}>
    <View style={styles.navContainer}>
       <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <Home stroke="#FFFFFF" size={24} />
       </TouchableOpacity>
       <TouchableOpacity style={styles.navItem}>
          <Briefcase stroke="#306F6F" size={24} />
       </TouchableOpacity>
       <TouchableOpacity style={styles.navItem}>
          <MessageCircle stroke="#306F6F" size={28} />
       </TouchableOpacity>
       <TouchableOpacity style={styles.navItem}>
          <User stroke="#306F6F" size={24} />
       </TouchableOpacity>
    </View>
  </View>
);

export const NoInternetScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconBox}>
           <WifiOff stroke="#306F6F" size={48} strokeWidth={1.5} />
        </View>
        <Text style={styles.errorTitle}>No internet</Text>
        <Text style={styles.errorSubtitle}>
           Check your internet connection and reload the page to proceed.
        </Text>
      </View>
      <BottomNavMock />
    </SafeAreaView>
  );
};

export const ServerErrorScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
           <Text style={styles.exclamation}>!</Text>
        </View>
        <Text style={styles.errorTitle}>Server error</Text>
        <Text style={styles.errorSubtitle}>
           Something happened, please try again later.
        </Text>
      </View>
      <BottomNavMock />
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
    paddingHorizontal: 54,
    marginTop: -80,
  },
  iconBox: {
    marginBottom: 40,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1.5,
    borderColor: '#306F6F',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  exclamation: {
    fontSize: 28,
    color: '#306F6F',
    fontWeight: '300',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 15,
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: 16,
    color: '#717171',
    textAlign: 'center',
    lineHeight: 24,
  },
  navWrapper: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  navContainer: {
    flexDirection: 'row',
    width: width * 0.85,
    height: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#306F6F',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
    paddingHorizontal: 15,
  },
  navItem: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navItemActive: {
    backgroundColor: '#306F6F',
    borderRadius: 25,
  },
});


