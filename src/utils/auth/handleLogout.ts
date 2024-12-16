import { supabase } from '../../lib/supabase';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../App';
import Toast from 'react-native-toast-message';

interface HandleLogoutParams {
  setSession: (session: null) => void;
  navigation: StackNavigationProp<RootStackParamList>;
}

export const handleLogout = async ({ setSession, navigation }: HandleLogoutParams) => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }

    setSession(null);

    Toast.show({
      type: 'success',
      text1: 'Logout Success',
      text2: 'Successfully logged out.',
      position: 'bottom',
    });

    navigation.replace('Login');
  } catch (error) {
    console.error('Logout error:', error);
    Toast.show({
      type: 'error',
      text1: 'Logout Failed',
      text2: 'An error occurred during logout.',
      position: 'bottom',
    });
  }
};
