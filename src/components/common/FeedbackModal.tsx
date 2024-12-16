import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from 'react-native';
import CloseIcon from '../../assets/icons/icon_close.svg';
import { supabase } from '../../lib/supabase';
import { Feedback } from '../../types';

interface FeedbackModalProps {
  visible: boolean;
  onClose: () => void;
}

export const FeedbackModal = ({ visible, onClose }: FeedbackModalProps) => {
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const screenHeight = Dimensions.get('window').height;

  const handleSubmit = async () => {
    if (feedback.trim().length === 0) {
      Alert.alert('Alert', 'Please write your feedback.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not found');
      }

      const feedbackData: Partial<Feedback> = {
        user_id: user.id,
        content: feedback.trim(),
        email: user.email || null,
        status: 'pending',
        platform: Platform.OS
      };

      const { error: insertError } = await supabase
        .from('Feedback')
        .insert([feedbackData]);

      if (insertError) {
        throw insertError;
      }

      Alert.alert(
        'Thank You',
        'Your feedback has been sent',
        [{ 
          text: 'OK',
          onPress: () => {
            setFeedback('');
            onClose();
          }
        }]
      );
    } catch (error) {
      console.error('FeedbackModal Error:', error);
      Alert.alert(
        'Error',
        'Failed to send feedback'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return visible ? (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingView}
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={[
          styles.modalContainer,
          {
            maxHeight: screenHeight * 0.4,
            marginTop: -(screenHeight * 0.15)
          }
        ]}>
          <View style={styles.header}>
            <Text style={styles.title}>Feedback</Text>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <CloseIcon />
            </Pressable>
          </View>
          
          <TextInput
            style={[
              styles.input,
              { height: screenHeight * 0.15 }
            ]}
            multiline
            placeholder="Feel free to share your thoughts and suggestions."
            placeholderTextColor="#666"
            value={feedback}
            onChangeText={setFeedback}
            maxLength={1000}
          />
          
          <TouchableOpacity 
            style={[
              styles.submitButton,
              isSubmitting && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Submitting...' : 'Send'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  ) : null;
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#1C1C1E',
    borderRadius: 15,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 8,
  },
  input: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    height: Platform.select({
      ios: 150,
      android: 120
    }),
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#0A84FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  }
});
