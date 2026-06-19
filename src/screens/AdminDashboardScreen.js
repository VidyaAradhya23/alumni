import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, useWindowDimensions, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AdminDashboardScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const [pendingApprovals, setPendingApprovals] = useState(45);
  
  const stats = [
    { label: 'New Users', value: '45', trend: '+18% this wk', icon: 'person-add-outline', color: '#E0F2FE', iconColor: '#0284C7' },
    { label: 'Reported Posts', value: '12', trend: '-5% this wk', icon: 'flag-outline', color: '#FEE2E2', iconColor: '#EF4444' },
    { label: 'Pending Jobs', value: '8', trend: 'New alerts', icon: 'briefcase-outline', color: '#FEF3C7', iconColor: '#D97706' },
    { label: 'Event Requests', value: '5', trend: 'Needs review', icon: 'calendar-outline', color: '#DCFCE7', iconColor: '#16A34A' },
  ];

  const handleQuickAction = (actionTitle) => {
    if (actionTitle === 'User Approvals') {
      Alert.alert(
        'Pending Approvals',
        'Review recent alumni registration requests.',
        [
          { text: 'Approve All (10)', onPress: () => {
            setPendingApprovals(prev => Math.max(0, prev - 10));
            Alert.alert('Approved', '10 alumni registrations approved successfully!');
          }},
          { text: 'View Queue', onPress: () => Alert.alert('Queue Open', 'Loading verification queue...') },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } else {
      Alert.alert('Console Trigger', `${actionTitle} console will open here.`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header with Back Button */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#002144" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Admin Console</Text>
            <Text style={styles.headerSub}>Admin Portal</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.settingsBtn} onPress={() => Alert.alert('Admin Settings', 'Configuration panel.')}>
          <Ionicons name="settings-outline" size={24} color="#002144" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={[styles.statCard, { width: (width - 52) / 2 }]}>
              <View style={styles.statTopRow}>
                <View style={[styles.iconBox, { backgroundColor: stat.color }]}>
                  <Ionicons name={stat.icon} size={20} color={stat.iconColor} />
                </View>
                <Text style={styles.trendText}>{stat.trend}</Text>
              </View>
              <Text style={styles.statValue}>{stat.label === 'User Approvals' ? pendingApprovals : stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Analytics Section / Mock Chart */}
        <Text style={styles.sectionTitle}>User Registration Trends</Text>
        <View style={styles.chartContainer}>
          <View style={styles.chartTitleRow}>
            <Text style={styles.chartTitle}>Alumni Onboarded</Text>
            <Text style={styles.chartSubtitle}>Last 6 Months</Text>
          </View>
          {/* Mock Bar Chart using Flex and Views */}
          <View style={styles.chartBarRow}>
            {[
              { month: 'Jan', val: 30 },
              { month: 'Feb', val: 45 },
              { month: 'Mar', val: 65 },
              { month: 'Apr', val: 50 },
              { month: 'May', val: 80 },
              { month: 'Jun', val: 95 },
            ].map((item, idx) => (
              <View key={idx} style={styles.chartCol}>
                <View style={styles.barBackground}>
                  <View style={[styles.barValue, { height: `${item.val}%` }]} />
                </View>
                <Text style={styles.chartMonthText}>{item.month}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Moderation Section */}
        <Text style={styles.sectionTitle}>Moderation & Control</Text>
        
        <TouchableOpacity style={styles.actionCard} onPress={() => handleQuickAction('Review Flagged Content')}>
          <View style={styles.actionInfo}>
            <View style={[styles.actionIcon, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="flag" size={22} color="#EF4444" />
            </View>
            <View>
              <Text style={styles.actionTitle}>Review Flagged Content</Text>
              <Text style={styles.actionSub}>Review reported posts, jobs, and events</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => handleQuickAction('Block/Unblock Users')}>
          <View style={styles.actionInfo}>
            <View style={[styles.actionIcon, { backgroundColor: '#F1F5F9' }]}>
              <Ionicons name="shield-half-outline" size={22} color="#003366" />
            </View>
            <View>
              <Text style={styles.actionTitle}>Block/Unblock Users</Text>
              <Text style={styles.actionSub}>Manage access for institutional members</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
        </TouchableOpacity>

        {/* Management Section */}
        <Text style={styles.sectionTitle}>Institutional Management</Text>

        <TouchableOpacity style={styles.actionCard} onPress={() => handleQuickAction('User Approvals')}>
          <View style={styles.actionInfo}>
            <View style={[styles.actionIcon, { backgroundColor: '#F0F9FF' }]}>
              <Ionicons name="people" size={22} color="#003366" />
            </View>
            <View>
              <Text style={styles.actionTitle}>User Approvals</Text>
              <Text style={styles.actionSub}>{pendingApprovals} alumni pending verification</Text>
            </View>
          </View>
          <View style={styles.badgeRow}>
            {pendingApprovals > 0 && (
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{pendingApprovals}</Text>
              </View>
            )}
            <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => handleQuickAction('Manage Events')}>
          <View style={styles.actionInfo}>
            <View style={[styles.actionIcon, { backgroundColor: '#F3E8FF' }]}>
              <Ionicons name="calendar" size={22} color="#9333EA" />
            </View>
            <View>
              <Text style={styles.actionTitle}>Manage Events</Text>
              <Text style={styles.actionSub}>Approve and organize alumni meets</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => handleQuickAction('Manage Jobs')}>
          <View style={styles.actionInfo}>
            <View style={[styles.actionIcon, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="briefcase" size={22} color="#D97706" />
            </View>
            <View>
              <Text style={styles.actionTitle}>Manage Jobs</Text>
              <Text style={styles.actionSub}>Verify professional opportunities</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
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
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
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
    fontSize: 20,
    fontWeight: '800',
    color: '#002144',
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 12,
    color: '#64748B',
  },
  settingsBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  statTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#002144',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#002144',
    marginBottom: 12,
    marginTop: 16,
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  chartTitleRow: {
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  chartSubtitle: {
    fontSize: 11.5,
    color: '#94A3B8',
    marginTop: 1,
  },
  chartBarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    paddingTop: 10,
  },
  chartCol: {
    alignItems: 'center',
    flex: 1,
  },
  barBackground: {
    height: 80,
    width: 14,
    backgroundColor: '#F1F5F9',
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barValue: {
    backgroundColor: '#003366',
    borderRadius: 7,
    width: '100%',
  },
  chartMonthText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 8,
    fontWeight: '600',
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 72,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  actionInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  actionSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  countBadge: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  countBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
});

export default AdminDashboardScreen;
