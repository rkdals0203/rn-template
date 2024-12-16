import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Alert,
  Platform,
  KeyboardAvoidingView,
  Image
} from 'react-native';
import CloseIcon from '../../assets/icons/icon_close.svg';
import DefaultProfileImage from '../../assets/icons/icon_account.svg';
import { supabase } from '../../lib/supabase';
import { colors } from '../../styles/colors';

interface AccountModalProps {
  visible: boolean;
  onClose: () => void;
  email?: string;
  profileUrl?: string;
  provider?: string;
}

export const AccountModal = ({ visible, onClose, email, profileUrl, provider }: AccountModalProps) => {
  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account?\nThis action cannot be undone and all your data will be deleted.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase.auth.admin.deleteUser(
                (await supabase.auth.getUser()).data.user?.id ?? ''
              );
              
              if (error) throw error;
              
              await supabase.auth.signOut();
            } catch (error) {
              console.error('Account deletion error:', error);
              Alert.alert(
                'Error',
                'Failed to delete account. Please try again.'
              );
            }
          }
        }
      ]
    );
  };

  const getProviderName = (provider: string) => {
    switch (provider) {
      case 'google':
        return 'Google';
      case 'github':
        return 'GitHub';
      case 'apple':
        return 'Apple';
      default:
        return 'Email';
    }
  };

  if (!visible) return null;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingView}
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Account Management</Text>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <CloseIcon />
            </Pressable>
          </View>

          <View style={styles.content}>
            <View style={styles.profileSection}>
              {profileUrl ? (
                <Image 
                  source={{ uri: profileUrl }} 
                  style={styles.profileImage} 
                />
              ) : (
                <View style={styles.defaultProfileContainer}>
                  <DefaultProfileImage width={60} height={60} />
                </View>
              )}
              <Text style={styles.emailText}>{email}</Text>
              <Text style={styles.providerText}>
                Signed in with {getProviderName(provider || '')}
              </Text>
            </View>
            
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={handleDeleteAccount}
            >
              <Text style={styles.deleteButtonText}>Delete Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
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
  content: {
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  defaultProfileContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emailText: {
    fontSize: 17,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  deleteButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  deleteButtonText: {
    color: colors.background.light,
    fontSize: 15,
    fontWeight: '400',
    textDecorationLine: 'underline'
  },
  providerText: {
    fontSize: 15,
    color: '#8E8E93',
    marginTop: 4,
  },
});
