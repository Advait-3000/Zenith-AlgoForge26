import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

interface ProgressBarProps {
  totalSteps: number;
  currentStep: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  totalSteps = 6,
  currentStep = 1,
}) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isActive = index < currentStep;
        return (
          <View
            key={index.toString()}
            style={[
              styles.segment,
              isActive ? styles.activeSegment : styles.inactiveSegment,
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 4,
    width: '80%',
    paddingHorizontal: 30,
    gap: 8,
    marginVertical: 20,
  },
  segment: {
    height: 4,
    flex: 1,
    borderRadius: 2,
  },
  activeSegment: {
    backgroundColor: '#306F6F', // Premium Teal
  },
  inactiveSegment: {
    backgroundColor: '#E0E8E8', // Light teal/grey
  },
});
