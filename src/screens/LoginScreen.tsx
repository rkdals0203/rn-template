import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { supabase } from '../lib/supabase';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { appleAuth } from '@invertase/react-native-apple-authentication';
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

  const handleAppleLogin = async () => {
    try {
      setLoading(true);
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      if (!appleAuthRequestResponse.identityToken) {
        throw new Error('No identity token');
      }

      await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: appleAuthRequestResponse.identityToken,
      });

    } catch (error) {
      Alert.alert('Login Failed', 'Failed to sign in with Apple');
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
      {Platform.OS === 'ios' && (
        <TouchableOpacity 
          style={[styles.signInButton, styles.appleButton]}
          onPress={handleAppleLogin}
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