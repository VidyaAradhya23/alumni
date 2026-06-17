import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('alumni@rvitm.edu.in');
  const [password, setPassword] = useState('alumni123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please enter your email and password');
      return;
    }
    setLoading(true);

    const dummyAlumni = [
      { email: 'alumni@rvce.edu', password: 'alumni123', name: 'RVCE Alumni User', institution: 'RVCE' },
      { email: 'alumni@rvitm.edu.in', password: 'alumni123', name: 'RVITM Alumni User', institution: 'RVITM' },
      { email: 'alumni@rvitm.edu', password: 'alumni123', name: 'RVITM Alumni User', institution: 'RVITM' },
      { email: 'alumni@rvpu.edu', password: 'alumni123', name: 'RVPU Alumni User', institution: 'RVPU' },
      { email: 'alumni@rvis.edu', password: 'alumni123', name: 'RVIS Alumni User', institution: 'RVIS' },
    ];

    const matchedAlumni = dummyAlumni.find(a => a.email === email.toLowerCase().trim() && a.password === password);

    if (matchedAlumni) {
      setTimeout(async () => {
        await AsyncStorage.setItem('userInfo', JSON.stringify({ 
          name: matchedAlumni.name, 
          email: matchedAlumni.email,
          institution: matchedAlumni.institution,
          role: 'Alumni'
        }));
        setLoading(false);
        navigation.navigate('Main');
      }, 800);
      return;
    }

    try {
      const response = await api.post('/auth/login', { email, password });
      await AsyncStorage.setItem('userInfo', JSON.stringify(response.data));
      navigation.navigate('Main');
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#002144" />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Login</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <TextInput 
                  style={styles.input}
                  placeholder="Enter Email"
                  placeholderTextColor="#94A3B8"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <TextInput 
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Enter Password"
                  placeholderTextColor="#94A3B8"
                  value={password}
                  onChangeText={setPassword}
                  autoCapitalize="none"
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 4 }}>
                  <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#94A3B8" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: 16 }}>
              <Text style={{ color: '#003366', fontWeight: '600', fontSize: 13 }}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.primaryButton, loading && styles.disabledButton]} 
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.primaryButtonText}>Login</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20, marginBottom: 20 }}>
            <Text style={{ color: '#94A3B8' }}>{"Don't have an account? "}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={{ color: '#003366', fontWeight: 'bold' }}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={20} color="#64748B" />
            <Text style={styles.infoText}>Use alumni@rvitm.edu.in / alumni123 for dummy access.</Text>
          </View>

          <View style={styles.credentialsBox}>
            <Text style={styles.credentialsTitle}>Demo Credentials</Text>
            <View style={styles.credentialRow}>
              <Text style={styles.credentialLabel}>Alumni (RVCE)</Text>
              <Text style={styles.credentialValue}>alumni@rvce.edu / alumni123</Text>
            </View>
            <View style={styles.credentialRow}>
              <Text style={styles.credentialLabel}>Alumni (RVITM)</Text>
              <Text style={styles.credentialValue}>alumni@rvitm.edu.in / alumni123</Text>
            </View>
            <View style={styles.credentialRow}>
              <Text style={styles.credentialLabel}>Alumni (RVPU)</Text>
              <Text style={styles.credentialValue}>alumni@rvpu.edu / alumni123</Text>
            </View>
            <View style={styles.credentialRow}>
              <Text style={styles.credentialLabel}>Alumni (RVIS)</Text>
              <Text style={styles.credentialValue}>alumni@rvis.edu / alumni123</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  backButton: {
    marginTop: 16,
    marginBottom: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#002144',
  },
  form: {
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    justifyContent: 'center',
  },
  input: {
    fontSize: 15,
    color: '#002144',
  },
  primaryButton: {
    backgroundColor: '#003366',
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  disabledButton: {
    backgroundColor: '#94A3B8',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#94A3B8',
    fontSize: 14,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  socialIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    marginLeft: 10,
  },
  credentialsBox: {
    marginTop: 20,
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  credentialsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 10,
  },
  credentialRow: {
    marginBottom: 8,
  },
  credentialLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#003366',
  },
  credentialValue: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
});

export default LoginScreen;
