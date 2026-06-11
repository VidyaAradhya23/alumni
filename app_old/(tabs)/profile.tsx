import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const [view, setView] = useState('main'); // main, personal, security
  const [user, setUser] = useState({
    name: 'Ananya Joshi',
    batch: '2018',
    branch: 'ISE',
    id: 'AL-2018-0452',
    designation: 'Senior Software Engineer',
    company: 'Microsoft',
    location: 'Seattle, WA',
    email: 'ananya.joshi@microsoft.com',
    phone: '+1 (425) 555-0123'
  });

  const renderPersonalSettings = () => (
    <View style={styles.subView}>
      <View style={styles.subHeader}>
        <TouchableOpacity onPress={() => setView('main')}><Ionicons name="arrow-back" size={24} color="#002144" /></TouchableOpacity>
        <Text style={styles.subTitle}>Personal Information</Text>
      </View>
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Full Name</Text>
          <TextInput style={styles.input} value={user.name} onChangeText={(t) => setUser({...user, name: t})} />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Professional Designation</Text>
          <TextInput style={styles.input} value={user.designation} onChangeText={(t) => setUser({...user, designation: t})} />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Contact Email</Text>
          <TextInput style={styles.input} value={user.email} />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <TextInput style={styles.input} value={user.phone} />
        </View>
        <TouchableOpacity style={styles.saveBtn} onPress={() => { Alert.alert('Success', 'Profile updated successfully!'); setView('main'); }}>
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSecuritySettings = () => (
    <View style={styles.subView}>
      <View style={styles.subHeader}>
        <TouchableOpacity onPress={() => setView('main')}><Ionicons name="arrow-back" size={24} color="#002144" /></TouchableOpacity>
        <Text style={styles.subTitle}>Privacy & Security</Text>
      </View>
      <View style={styles.form}>
        <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('2FA', 'Two-factor authentication is currently ENABLED.')}>
          <Text style={styles.menuText}>Two-Factor Authentication</Text>
          <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Privacy', 'Your profile is currently PUBLIC to the network.')}>
          <Text style={styles.menuText}>Profile Visibility</Text>
          <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Password', 'A password reset link has been sent to your email.')}>
          <Text style={styles.menuText}>Change Password</Text>
          <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (view === 'personal') return renderPersonalSettings();
  if (view === 'security') return renderSecuritySettings();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarLargeText}>{user.name.charAt(0)}</Text>
            </View>
            <TouchableOpacity style={styles.editBtn} onPress={() => setView('personal')}>
              <Ionicons name="pencil" size={18} color="#002144" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userTitle}>{user.designation} @ {user.company}</Text>
          <Text style={styles.userMeta}>{user.branch}, Class of {user.batch}</Text>
        </View>

        {/* Digital Alumni ID Card */}
        <View style={styles.idCardContainer}>
          <View style={styles.idCard}>
            <View style={styles.idHeader}>
              <Text style={styles.idLogo}>RVCE <Text style={styles.idLogoSub}>ALUMNI</Text></Text>
              <Ionicons name="wifi" size={20} color="#FFD700" />
            </View>
            <View style={styles.idBody}>
              <View>
                <Text style={styles.idLabel}>ALUMNI ID</Text>
                <Text style={styles.idValue}>{user.id}</Text>
                <View style={styles.idInfoRow}>
                  <View>
                    <Text style={styles.idLabel}>VALID TILL</Text>
                    <Text style={styles.idValueSmall}>Lifetime</Text>
                  </View>
                  <View style={{ marginLeft: 30 }}>
                    <Text style={styles.idLabel}>MEMBER SINCE</Text>
                    <Text style={styles.idValueSmall}>June 2018</Text>
                  </View>
                </View>
              </View>
              <View style={styles.qrPlaceholder}>
                <Ionicons name="qr-code" size={60} color="#002144" />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <TouchableOpacity style={styles.menuItem} onPress={() => setView('personal')}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#EEF2FF' }]}>
                <Ionicons name="person-outline" size={20} color="#4F46E5" />
              </View>
              <Text style={styles.menuText}>Personal Information</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Education', 'Education history is synced with RVCE records.')}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#FFF7ED' }]}>
                <Ionicons name="school-outline" size={20} color="#EA580C" />
              </View>
              <Text style={styles.menuText}>Education History</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => setView('security')}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#F0FDF4' }]}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#16A34A" />
              </View>
              <Text style={styles.menuText}>Privacy & Security</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={() => Alert.alert('Logout', 'Are you sure you want to logout?', [{text: 'Cancel'}, {text: 'Logout', style: 'destructive'}])}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#FEF2F2' }]}>
                <Ionicons name="log-out-outline" size={20} color="#DC2626" />
              </View>
              <Text style={[styles.menuText, { color: '#DC2626' }]}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { backgroundColor: '#FFFFFF', alignItems: 'center', paddingVertical: 30, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  profileHeader: { position: 'relative', marginBottom: 15 },
  avatarLarge: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#002144', alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: '#F1F5F9' },
  avatarLargeText: { color: '#FFD700', fontSize: 40, fontWeight: 'bold' },
  editBtn: { position: 'absolute', right: 0, bottom: 0, backgroundColor: '#FFD700', width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FFFFFF' },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#0F172A' },
  userTitle: { fontSize: 14, color: '#64748B', marginTop: 4 },
  userMeta: { fontSize: 12, color: '#94A3B8', marginTop: 4 },
  idCardContainer: { padding: 20 },
  idCard: { backgroundColor: '#002144', borderRadius: 20, padding: 20, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, elevation: 5 },
  idHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  idLogo: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  idLogoSub: { color: '#FFD700', fontSize: 14 },
  idBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  idLabel: { color: 'rgba(255, 255, 255, 0.5)', fontSize: 10, fontWeight: '600', letterSpacing: 1 },
  idValue: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  idValueSmall: { color: 'white', fontSize: 14, fontWeight: '600' },
  idInfoRow: { flexDirection: 'row' },
  qrPlaceholder: { backgroundColor: 'white', padding: 10, borderRadius: 12 },
  section: { marginTop: 10, paddingHorizontal: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#0F172A', marginBottom: 15 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  menuIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  menuText: { fontSize: 15, fontWeight: '500', color: '#334155' },
  subView: { flex: 1, backgroundColor: '#F8FAFC' },
  subHeader: { flexDirection: 'row', alignItems: 'center', gap: 15, padding: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  subTitle: { fontSize: 18, fontWeight: 'bold', color: '#002144' },
  form: { padding: 20, gap: 20 },
  inputGroup: { gap: 8 },
  inputLabel: { fontSize: 12, fontWeight: 'bold', color: '#64748B', textTransform: 'uppercase' },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', padding: 15, borderRadius: 12, fontSize: 16, color: '#0F172A' },
  saveBtn: { backgroundColor: '#002144', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: '#FFD700', fontWeight: 'bold', fontSize: 16 }
});
