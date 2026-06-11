import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, StatusBar, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const panelItems = [
  { id: '1', title: 'User Management', icon: 'people', color: '#E0F2FE', iconColor: '#0284C7' },
  { id: '2', title: 'Content Moderation', icon: 'shield-half-outline', color: '#FEE2E2', iconColor: '#EF4444' },
  { id: '3', title: 'Analytics', icon: 'bar-chart', color: '#DCFCE7', iconColor: '#16A34A' },
  { id: '4', title: 'Notifications Manager', icon: 'notifications', color: '#FEF3C7', iconColor: '#D97706' },
  { id: '5', title: 'Settings', icon: 'settings', color: '#F3E8FF', iconColor: '#9333EA' },
  { id: '6', title: 'Reports', icon: 'document-text', color: '#FFF7ED', iconColor: '#EA580C' },
  { id: '7', title: 'Broadcast', icon: 'megaphone', color: '#F0F9FF', iconColor: '#003366' },
  { id: '8', title: 'Database', icon: 'server', color: '#F1F5F9', iconColor: '#475569' },
];

const AdminPanelScreen = ({ navigation }) => {
  const handlePanelAction = (title) => {
    if (title === 'User Management') {
      navigation && navigation.navigate('AdminUsers');
    } else {
      Alert.alert(title, 'This module is coming soon. Stay tuned!');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerAvatar} activeOpacity={0.8} onPress={() => navigation.navigate('AdminProfile')}>
          <Text style={styles.headerAvatarText}>AD</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Admin Panel</Text>
          <Text style={styles.headerSub}>RVCE Institution</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.headerIconBtn} onPress={() => navigation.navigate('Messages')}>
            <Ionicons name="chatbubble-ellipses-outline" size={22} color="#003366" />
            <View style={styles.dot} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconBtn} onPress={() => navigation.navigate('Notifications')}>
            <Ionicons name="notifications-outline" size={22} color="#003366" />
            <View style={styles.dot} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeIconCircle}>
            <Ionicons name="shield-checkmark" size={28} color="#003366" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.welcomeTitle}>Welcome, Admin</Text>
            <Text style={styles.welcomeSub}>Manage your institution from here</Text>
          </View>
        </View>

        {/* Quick Stats Row */}
        <View style={styles.quickStatsRow}>
          <View style={styles.quickStat}>
            <Text style={styles.quickStatValue}>1,248</Text>
            <Text style={styles.quickStatLabel}>Total Users</Text>
          </View>
          <View style={[styles.quickStat, styles.quickStatMiddle]}>
            <Text style={styles.quickStatValue}>156</Text>
            <Text style={styles.quickStatLabel}>Active Jobs</Text>
          </View>
          <View style={styles.quickStat}>
            <Text style={styles.quickStatValue}>24</Text>
            <Text style={styles.quickStatLabel}>Events</Text>
          </View>
        </View>

        {/* Panel Grid */}
        <Text style={styles.sectionTitle}>Management Modules</Text>
        <View style={styles.grid}>
          {panelItems.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.gridCard} 
              activeOpacity={0.7}
              onPress={() => handlePanelAction(item.title)}
            >
              <View style={[styles.gridIconCircle, { backgroundColor: item.color }]}>
                <Ionicons name={item.icon} size={26} color={item.iconColor} />
              </View>
              <Text style={styles.gridCardTitle}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={14} color="#CBD5E1" style={{ marginTop: 4 }} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityCard}>
          <View style={styles.activityItem}>
            <View style={[styles.activityDot, { backgroundColor: '#16A34A' }]} />
            <Text style={styles.activityText}>3 new alumni registered</Text>
            <Text style={styles.activityTime}>2m ago</Text>
          </View>
          <View style={styles.activityItem}>
            <View style={[styles.activityDot, { backgroundColor: '#D97706' }]} />
            <Text style={styles.activityText}>Job post flagged for review</Text>
            <Text style={styles.activityTime}>15m ago</Text>
          </View>
          <View style={styles.activityItem}>
            <View style={[styles.activityDot, { backgroundColor: '#0284C7' }]} />
            <Text style={styles.activityText}>Event &quot;Gala Night&quot; approved</Text>
            <Text style={styles.activityTime}>1h ago</Text>
          </View>
          <View style={[styles.activityItem, { borderBottomWidth: 0 }]}>
            <View style={[styles.activityDot, { backgroundColor: '#EF4444' }]} />
            <Text style={styles.activityText}>2 posts reported by users</Text>
            <Text style={styles.activityTime}>3h ago</Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#003366', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  headerAvatarText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  headerCenter: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#002144' },
  headerSub: { fontSize: 11, color: '#64748B' },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  headerIconBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center', marginLeft: 4 },
  dot: { position: 'absolute', top: 6, right: 6, width: 7, height: 7, borderRadius: 4, backgroundColor: '#EF4444' },
  scrollContent: { padding: 20 },
  welcomeCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  welcomeIconCircle: { width: 52, height: 52, borderRadius: 16, backgroundColor: '#F0F9FF', justifyContent: 'center', alignItems: 'center', marginRight: 14, borderWidth: 1, borderColor: '#E0F2FE' },
  welcomeTitle: { fontSize: 17, fontWeight: '800', color: '#0F172A' },
  welcomeSub: { fontSize: 13, color: '#64748B', marginTop: 2 },
  quickStatsRow: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  quickStat: { flex: 1, alignItems: 'center' },
  quickStatMiddle: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#F1F5F9' },
  quickStatValue: { fontSize: 20, fontWeight: '800', color: '#002144' },
  quickStatLabel: { fontSize: 11, color: '#64748B', fontWeight: '600', marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#002144', marginBottom: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 },
  gridCard: { width: (width - 52) / 2, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 18, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 6, elevation: 1 },
  gridIconCircle: { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  gridCardTitle: { fontSize: 13, fontWeight: '700', color: '#0F172A', textAlign: 'center' },
  activityCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  activityItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  activityDot: { width: 8, height: 8, borderRadius: 4, marginRight: 12 },
  activityText: { flex: 1, fontSize: 13, color: '#475569', fontWeight: '600' },
  activityTime: { fontSize: 11, color: '#94A3B8', fontWeight: '500' },
});

export default AdminPanelScreen;
