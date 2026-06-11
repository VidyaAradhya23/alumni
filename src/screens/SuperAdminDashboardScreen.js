import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SuperAdminDashboardScreen = ({ navigation }) => {
  const [institutions, setInstitutions] = useState([
    { name: 'RV College of Engineering (RVCE)', admins: 5, status: 'Active', badgeColor: '#10B981' },
    { name: 'RV Inst of Tech & Management (RVITM)', admins: 3, status: 'Active', badgeColor: '#10B981' },
    { name: 'RV PU College (RVPU)', admins: 2, status: 'Pending Audit', badgeColor: '#F59E0B' },
    { name: 'RV International School (RVIS)', admins: 2, status: 'Active', badgeColor: '#10B981' },
  ]);

  const handleAddNew = () => {
    Alert.alert(
      'Register Institution',
      'Enter new RVEI institution details to configure global control settings.',
      [
        { text: 'Add Mock (RVIM)', onPress: () => {
          setInstitutions(prev => [
            ...prev,
            { name: 'RV Institute of Management (RVIM)', admins: 1, status: 'Active', badgeColor: '#10B981' }
          ]);
          Alert.alert('Success', 'RVIM has been registered as an active institution!');
        }},
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleGlobalControl = (actionName) => {
    Alert.alert('Super Admin Action', `Initiating global action: ${actionName}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Premium Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>RVEI Global Control</Text>
        </View>
        <TouchableOpacity style={styles.profileBtn} onPress={() => Alert.alert('Super Admin Profile', 'Global Governance SuperUser account.')}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>SA</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* System Health Status Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeaderRow}>
            <Text style={styles.summaryTitle}>SYSTEM STATUS & HEALTH</Text>
            <View style={styles.healthStatusBadge}>
              <View style={styles.healthDot} />
              <Text style={styles.healthText}>All Services Online</Text>
            </View>
          </View>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>12.4k</Text>
              <Text style={styles.summaryLabel}>Total Alumni</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{institutions.length}</Text>
              <Text style={styles.summaryLabel}>Institutions</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>99.98%</Text>
              <Text style={styles.summaryLabel}>System Uptime</Text>
            </View>
          </View>
        </View>

        {/* Manage Institutions Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Manage Institutions</Text>
          <TouchableOpacity onPress={handleAddNew}>
            <Text style={styles.addBtn}>+ Add New</Text>
          </TouchableOpacity>
        </View>

        {institutions.map((inst, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.instCard}
            onPress={() => Alert.alert('Institution Administration', `Opening settings panel for ${inst.name}`)}
            activeOpacity={0.7}
          >
            <View style={styles.instInfo}>
              <Text style={styles.instName} numberOfLines={1}>{inst.name}</Text>
              <Text style={styles.instSub}>{inst.admins} Admin Accounts</Text>
            </View>
            <View style={styles.rightInstContainer}>
              <View style={[styles.statusBadge, { backgroundColor: inst.badgeColor + '20' }]}>
                <Text style={[styles.statusBadgeText, { color: inst.badgeColor }]}>{inst.status}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" style={{ marginLeft: 6 }} />
            </View>
          </TouchableOpacity>
        ))}

        {/* Global Control Actions */}
        <Text style={styles.sectionTitle}>Global Actions (RVEI Level)</Text>
        
        <TouchableOpacity style={styles.actionRow} onPress={() => handleGlobalControl('Global Announcement')} activeOpacity={0.7}>
          <View style={[styles.actionIconBox, { backgroundColor: '#FEE2E2' }]}>
            <Ionicons name="megaphone" size={20} color="#EF4444" />
          </View>
          <Text style={styles.actionLabel}>Global Broadcast Announcement</Text>
          <Ionicons name="chevron-forward" size={16} color="#CBD5E1" style={styles.chevronRight} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionRow} onPress={() => handleGlobalControl('Cross-Institution Synced Database')} activeOpacity={0.7}>
          <View style={[styles.actionIconBox, { backgroundColor: '#E0F2FE' }]}>
            <Ionicons name="git-branch" size={20} color="#0284C7" />
          </View>
          <Text style={styles.actionLabel}>Cross-Institution Collaboration</Text>
          <Ionicons name="chevron-forward" size={16} color="#CBD5E1" style={styles.chevronRight} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionRow} onPress={() => handleGlobalControl('RVEI Global Insights')} activeOpacity={0.7}>
          <View style={[styles.actionIconBox, { backgroundColor: '#DCFCE7' }]}>
            <Ionicons name="analytics" size={20} color="#16A34A" />
          </View>
          <Text style={styles.actionLabel}>Global Analytics & Insights</Text>
          <Ionicons name="chevron-forward" size={16} color="#CBD5E1" style={styles.chevronRight} />
        </TouchableOpacity>

        {/* System Settings & Security */}
        <Text style={styles.sectionTitle}>Security & Audit</Text>
        
        <TouchableOpacity style={styles.actionRow} onPress={() => handleGlobalControl('Roles & Permissions Matrix')} activeOpacity={0.7}>
          <View style={[styles.actionIconBox, { backgroundColor: '#F1F5F9' }]}>
            <Ionicons name="shield-checkmark" size={20} color="#003366" />
          </View>
          <Text style={styles.actionLabel}>Roles & Permissions Matrix</Text>
          <Ionicons name="chevron-forward" size={16} color="#CBD5E1" style={styles.chevronRight} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionRow} onPress={() => handleGlobalControl('Global Audit Logs')} activeOpacity={0.7}>
          <View style={[styles.actionIconBox, { backgroundColor: '#F1F5F9' }]}>
            <Ionicons name="document-text" size={20} color="#003366" />
          </View>
          <Text style={styles.actionLabel}>Global System Audit Logs</Text>
          <Ionicons name="chevron-forward" size={16} color="#CBD5E1" style={styles.chevronRight} />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#002144',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#002144',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  summaryCard: {
    backgroundColor: '#003366',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  summaryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '800',
    letterSpacing: 1,
  },
  healthStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  healthDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  healthText: {
    fontSize: 10,
    color: '#10B981',
    fontWeight: '800',
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'flex-start',
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  summaryLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
    marginTop: 12,
  },
  addBtn: {
    color: '#003366',
    fontWeight: '800',
    fontSize: 14,
  },
  instCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 64,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  instInfo: {
    flex: 1,
    marginRight: 10,
  },
  instName: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  instSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  rightInstContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    height: 56,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  actionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionLabel: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '600',
    flex: 1,
  },
  chevronRight: {
    marginLeft: 'auto',
  },
});

export default SuperAdminDashboardScreen;
