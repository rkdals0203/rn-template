import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { supabase } from '../lib/supabase';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { AUTH_CONFIG } from '../config/auth';

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

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      const signInResult = await GoogleSignin.signIn();
      
      if (!signInResult) throw new Error("Sign in failed!");

      const tokens = await GoogleSignin.getTokens();
      if (!tokens.accessToken) throw new Error("Access token is missing!");

      await supabase.auth.signInWithIdToken({
        provider: "google",
        token: tokens.accessToken,
      });

    } catch (error) {
      Alert.alert('Login Failed', 'Failed to sign in with Google');
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
        onPress={handleGoogleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Google로 로그인</Text>
      </TouchableOpacity>
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
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginScreen;