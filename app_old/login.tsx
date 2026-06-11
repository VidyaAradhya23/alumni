import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function AuthScreen() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [batch, setBatch] = useState('');
  const [usn, setUsn] = useState('');
  const [dept, setDept] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = () => {
    setIsLoading(true);
    // Simulate institutional verification
    setTimeout(() => {
      setIsLoading(false);
      if (isLogin) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Request Sent', 'Your verification request has been submitted to the RVCE Administrative Office.');
        setIsLogin(true);
      }
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          
          {/* RVCE Institutional Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>RVCE <Text style={styles.logoAlumni}>ALUMNI</Text></Text>
            <Text style={styles.tagline}>Rashtreeya Vidyalaya College of Engineering</Text>
            <View style={styles.badgeRow}>
              <View style={styles.headerBadge}><Text style={styles.badgeText}>ESTD. 1963</Text></View>
              <View style={styles.headerBadge}><Text style={styles.badgeText}>NIRF TOP RANKED</Text></View>
            </View>
          </View>

          {/* About RVCE Section (Pre-Auth Info) */}
          <View style={styles.infoSection}>
            <View style={styles.infoCard}>
              <Ionicons name="school" size={24} color="#FFD700" />
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Legacy of Excellence</Text>
                <Text style={styles.infoText}>Join 50,000+ global alumni from one of India&apos;s premier engineering institutions.</Text>
              </View>
            </View>
          </View>

          <View style={styles.authCard}>
            <View style={styles.tabBar}>
              <TouchableOpacity style={[styles.tab, isLogin && styles.tabActive]} onPress={() => setIsLogin(true)}>
                <Text style={[styles.tabText, isLogin && styles.tabTextActive]}>Member Login</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tab, !isLogin && styles.tabActive]} onPress={() => setIsLogin(false)}>
                <Text style={[styles.tabText, !isLogin && styles.tabTextActive]}>New Signup</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              {!isLogin && (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Full Name (as per degree)</Text>
                    <TextInput style={styles.input} placeholder="e.g. Rahul Sharma" placeholderTextColor="rgba(255, 255, 255, 0.4)" value={name} onChangeText={setName} />
                  </View>
                  <View style={styles.row}>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                      <Text style={styles.label}>Batch</Text>
                      <TextInput style={styles.input} placeholder="2018" placeholderTextColor="rgba(255, 255, 255, 0.4)" value={batch} onChangeText={setBatch} keyboardType="numeric" />
                    </View>
                    <View style={[styles.inputGroup, { flex: 2, marginLeft: 10 }]}>
                      <Text style={styles.label}>USN</Text>
                      <TextInput style={styles.input} placeholder="1RV14CS001" placeholderTextColor="rgba(255, 255, 255, 0.4)" value={usn} onChangeText={setUsn} autoCapitalize="characters" />
                    </View>
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Department</Text>
                    <TextInput style={styles.input} placeholder="Computer Science / ISE / ECE" placeholderTextColor="rgba(255, 255, 255, 0.4)" value={dept} onChangeText={setDept} />
                  </View>
                </>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Institutional Email</Text>
                <TextInput style={styles.input} placeholder="alumni@rvce.edu.in" placeholderTextColor="rgba(255, 255, 255, 0.4)" value={email} onChangeText={setEmail} autoCapitalize="none" />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor="rgba(255, 255, 255, 0.4)" value={password} onChangeText={setPassword} secureTextEntry />
              </View>

              <TouchableOpacity style={styles.primaryBtn} onPress={handleAuth} disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color="#002144" />
                ) : (
                  <Text style={styles.primaryBtnText}>{isLogin ? 'Enter Global Network' : 'Request Verification'}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.collegeStats}>
            <View style={styles.statItem}><Text style={styles.statVal}>12+</Text><Text style={styles.statLab}>Dept</Text></View>
            <View style={styles.statItem}><Text style={styles.statVal}>50k+</Text><Text style={styles.statLab}>Alumni</Text></View>
          </View>

          <Text style={styles.footerText}>© 2026 RV College of Engineering. All Rights Reserved.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#001A35' },
  flex: { flex: 1 },
  scroll: { padding: 20, flexGrow: 1, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 25 },
  logo: { fontSize: 32, fontWeight: '900', color: 'white', letterSpacing: 1 },
  logoAlumni: { color: '#FFD700' },
  tagline: { color: 'rgba(255, 255, 255, 0.7)', marginTop: 8, fontSize: 13, textAlign: 'center' },
  badgeRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  headerBadge: { backgroundColor: 'rgba(255, 215, 0, 0.1)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: 'rgba(255, 215, 0, 0.3)' },
  badgeText: { color: '#FFD700', fontSize: 10, fontWeight: 'bold' },
  infoSection: { marginBottom: 25 },
  infoCard: { flexDirection: 'row', backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: 15, borderRadius: 16, alignItems: 'center', gap: 15, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
  infoContent: { flex: 1 },
  infoTitle: { color: 'white', fontWeight: 'bold', fontSize: 15 },
  infoText: { color: 'rgba(255, 255, 255, 0.5)', fontSize: 12, marginTop: 2, lineHeight: 16 },
  authCard: { backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  tabBar: { flexDirection: 'row', marginBottom: 25, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: 4 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: '#002144' },
  tabText: { color: 'rgba(255, 255, 255, 0.4)', fontWeight: '700', fontSize: 13 },
  tabTextActive: { color: '#FFD700' },
  form: { gap: 15 },
  inputGroup: { gap: 6 },
  row: { flexDirection: 'row', gap: 10 },
  label: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 11, fontWeight: '600', textTransform: 'uppercase' },
  input: { backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: 12, padding: 14, color: 'white', fontSize: 15, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  primaryBtn: { backgroundColor: '#FFD700', padding: 16, borderRadius: 15, alignItems: 'center', marginTop: 10 },
  primaryBtnText: { color: '#002144', fontSize: 16, fontWeight: '900' },
  collegeStats: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 30, paddingVertical: 20, borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.05)' },
  statItem: { alignItems: 'center' },
  statVal: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  statLab: { color: 'rgba(255, 255, 255, 0.4)', fontSize: 10, marginTop: 4, textTransform: 'uppercase' },
  footerText: { color: 'rgba(255, 255, 255, 0.3)', textAlign: 'center', marginTop: 30, fontSize: 10, marginBottom: 20 }
});
