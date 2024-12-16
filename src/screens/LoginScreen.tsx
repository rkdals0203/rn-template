import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { AUTH_CONFIG } from '../config/auth';
import { handleGoogleLogin } from '../utils/auth/handleGoogleLogin';
import { handleAppleLogin } from '../utils/auth/handleAppleLogin';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

GoogleSignin.configure({
  webClientId: AUTH_CONFIG.GOOGLE.WEB_CLIENT_ID,
  iosClientId: AUTH_CONFIG.GOOGLE.IOS_CLIENT_ID,
});

const LoginScreen: React.FC<LoginScreenProps> = () => {
  const [loading, setLoading] = useState(false);

  const onGoogleLoginPress = async () => {
    try {
      setLoading(true);
      await handleGoogleLogin();
    } finally {
      setLoading(false);
    }
  };

  const onAppleLoginPress = async () => {
    try {
      setLoading(true);
      await handleAppleLogin();
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Template</Text>
      </View>
      <TouchableOpacity 
        style={styles.signInButton}
        onPress={onGoogleLoginPress}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Google로 로그인</Text>
      </TouchableOpacity>
      {Platform.OS === 'ios' && (
        <TouchableOpacity 
          style={[styles.signInButton, styles.appleButton]}
          onPress={onAppleLoginPress}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Apple로 로그인</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '600',
    marginTop: 16,
  },
  signInButton: {
    backgroundColor: '#333',
    padding: 16,
    borderRadius: 8,
    width: '80%',
    marginBottom: 12,
  },
  appleButton: {
    backgroundColor: '#000',
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginScreen;