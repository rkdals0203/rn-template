import React from 'react';
import { BaseToast, ErrorToast } from 'react-native-toast-message';
import { colors } from '../../styles/colors';

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: colors.text.primary,
        backgroundColor: colors.background.main,
        borderRadius: 10,
        width: '90%',
        position: 'absolute',
        bottom: 10,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: '400',
        color: 'white',
      }}
      text2Style={{
        fontSize: 14,
        color: 'lightgrey',
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: 'red',
        backgroundColor: colors.background.main,
        borderRadius: 10,
        width: '90%',
        position: 'absolute',
        bottom: 10,
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: '400',
        color: 'white',
      }}
      text2Style={{
        fontSize: 14,
        color: 'lightgrey',
      }}
    />
  ),
};