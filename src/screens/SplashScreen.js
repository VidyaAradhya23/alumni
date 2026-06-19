import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const checkSession = async () => {
      try {
        const userInfoStr = await AsyncStorage.getItem('userInfo');
        if (userInfoStr) {
          const userInfo = JSON.parse(userInfoStr);
          if (userInfo && userInfo.role) {
            if (userInfo.role === 'superadmin') {
              navigation.replace('SuperAdminMain');
              return;
            } else if (userInfo.role === 'admin') {
              navigation.replace('AdminMain');
              return;
            } else if (userInfo.role === 'Alumni') {
              navigation.replace('Main');
              return;
            }
          }
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
      }
      navigation.replace('Welcome');
    };

    const timer = setTimeout(() => {
      checkSession();
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          {/* Logo Placeholder */}
          <View style={styles.logo}>
            <Text style={styles.logoText}>Alumni</Text>
          </View>
        </View>
        <Text style={styles.title}>Alumni</Text>
        <Text style={styles.subtitle}>Portal Network</Text>
        
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#003366" />
          <TouchableOpacity 
            style={styles.tourBtn} 
            onPress={() => navigation.navigate('DemoCarousel')}
          >
            <Text style={styles.tourBtnText}>Take a Tour</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#003366',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#F1F5F9',
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#002144',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 18,
    color: '#003366',
    marginTop: 4,
    fontWeight: '500',
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 80,
    alignItems: 'center',
  },
  tourBtn: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#003366',
  },
  tourBtnText: {
    color: '#003366',
    fontWeight: 'bold',
    fontSize: 14,
  }
});

export default SplashScreen;
