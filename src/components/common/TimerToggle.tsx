import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { TimerMode } from '../../hooks/useTimer';
import { style } from '../../styles';

interface TimerToggleProps {
  mode: TimerMode;
  onModeChange: (mode: TimerMode) => void;
  disabled?: boolean;
}

export const TimerToggle = ({ mode, onModeChange, disabled }: TimerToggleProps) => {
  const handlePress = (newMode: TimerMode) => {
    if (!disabled && mode !== newMode) {
      ReactNativeHapticFeedback.trigger("impactLight");
      onModeChange(newMode);
    }
  };

  return (
    <View style={styles.toggleContainer}>
      <TouchableOpacity 
        style={[
          styles.toggleButton, 
          mode === 'Practice' && styles.toggleActive,
          disabled && styles.toggleDisabled
        ]}
        onPress={() => handlePress('Practice')}
        disabled={disabled}
      >
        <Text style={[styles.toggleText, disabled && styles.toggleTextDisabled]}>Practice</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[
          styles.toggleButton, 
          mode === 'Play' && styles.toggleActive,
          disabled && styles.toggleDisabled
        ]}
        onPress={() => handlePress('Play')}
        disabled={disabled}
      >
        <Text style={[styles.toggleText, disabled && styles.toggleTextDisabled]}>Play</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#333',
    borderRadius: 6,
    padding: 2,
    width: '35%',
    alignSelf: 'center',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 3,
    alignItems: 'center',
    borderRadius: 4,
  },
  toggleActive: {
    backgroundColor: style.colors.primary.mainDarkest,
  },
  toggleText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 11,
  },
  toggleDisabled: {
    opacity: 0.5,
  },
  toggleTextDisabled: {
    opacity: 0.5,
  },
});
