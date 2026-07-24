import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SSOCallbackScreen = ({ route, navigation }) => {
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const processSSO = async () => {
      try {
        const { token, refreshToken, userInfo, error } = route.params || {};

        if (error) {
          if (error === 'no_access') {
            setErrorMsg('Your Fiori email does not have an active Alumni account yet.');
          } else if (error === 'not_approved') {
            setErrorMsg('Your Alumni account is pending approval.');
          } else {
            setErrorMsg('SSO Authentication failed.');
          }
          return;
        }

        if (token && userInfo) {
          const parsedUser = JSON.parse(decodeURIComponent(userInfo));
          await AsyncStorage.setItem('userInfo', JSON.stringify({
            token,
            refreshToken,
            ...parsedUser
          }));
          
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainDrawer' }],
          });
        } else {
            setErrorMsg('Invalid SSO response data.');
        }
      } catch (err) {
        console.error('SSO parsing error:', err);
        setErrorMsg('An error occurred while logging you in.');
      }
    };

    processSSO();
  }, [route.params, navigation]);

  return (
    <View style={styles.container}>
      {errorMsg ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Access Denied</Text>
          <Text style={styles.errorText}>{errorMsg}</Text>
          <Text style={styles.linkText} onPress={() => navigation.navigate('Login')}>
            Go to Login Page
          </Text>
        </View>
      ) : (
        <>
          <ActivityIndicator size="large" color="#003366" />
          <Text style={styles.loadingText}>Authenticating with Fiori...</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC'
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#475569',
    fontWeight: '500'
  },
  errorBox: {
    padding: 24,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    alignItems: 'center',
    maxWidth: 400
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#991B1B',
    marginBottom: 8
  },
  errorText: {
    fontSize: 15,
    color: '#7F1D1D',
    textAlign: 'center',
    marginBottom: 16
  },
  linkText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '600',
    textDecorationLine: 'underline'
  }
});

export default SSOCallbackScreen;
