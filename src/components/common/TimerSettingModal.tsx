import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { CircularSlider } from './CircularSlider';
import { supabase } from '../../lib/supabase';
import { style } from '../../styles';

interface TimerSettingModalProps {
  isVisible: boolean;
  totalTime: number;
  presentationId: string;
  onClose: () => void;
  onConfirm: (time: number) => void;
  setTotalTime: (time: number) => void;
}

export const TimerSettingModal = ({
  isVisible,
  totalTime,
  presentationId,
  onClose,
  onConfirm,
  setTotalTime
}: TimerSettingModalProps) => {
  const [tempTime, setTempTime] = useState(totalTime);

  useEffect(() => {
    if (isVisible) {
      setTempTime(totalTime);
    }
  }, [totalTime, isVisible]);

  const handleTimeConfirm = async () => {
    try {
      const { error } = await supabase
        .from('Presentation')
        .update({ total_time: tempTime })
        .eq('presentation_id', presentationId);

      if (error) throw error;

      onConfirm(tempTime);
    } catch (error) {
      console.error('시간 설정 중 오류 발생:', error);
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Presentation Time</Text>
          <View style={styles.sliderContainer}>
            <CircularSlider
              value={tempTime}
              maxValue={3600}
              radius={140}
              onChange={setTempTime}
            />
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.modalButtonCancel]}
              onPress={onClose}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.modalButtonConfirm]}
              onPress={handleTimeConfirm}
            >
              <Text style={styles.modalButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1A1A1A',
    padding: 20,
    borderRadius: 12,
    width: '80%',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  sliderContainer: {
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#333',
  },
  modalButtonConfirm: {
    backgroundColor: style.colors.primary.mainDarkest,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
