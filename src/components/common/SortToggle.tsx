import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { style } from '../../styles';

interface SortToggleProps {
  sortBy: 'name' | 'date';
  onSortChange: (sort: 'name' | 'date') => void;
}

export const SortToggle = ({ sortBy, onSortChange }: SortToggleProps) => {
  return (
    <View style={styles.toggleContainer}>
      <TouchableOpacity 
        style={[styles.toggleButton, sortBy === 'name' && styles.toggleActive]}
        onPress={() => onSortChange('name')}
      >
        <Text style={styles.toggleText}>Name</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.toggleButton, sortBy === 'date' && styles.toggleActive]}
        onPress={() => onSortChange('date')}
      >
        <Text style={styles.toggleText}>Date</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: style.colors.background.medium,
    borderRadius: 8,
    padding: 2,
    width: '40%',
    alignSelf: 'center',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 4,
    alignItems: 'center',
    borderRadius: 6,
  },
  toggleActive: {
    backgroundColor: style.colors.background.light,
  },
  toggleText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
