import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, useWindowDimensions, StatusBar, Alert, Platform } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminDashboardScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const styles = getStyles(theme);

  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const webContainerStyle = isWeb ? { alignSelf: 'center', width: '100%', maxWidth: 800, flex: 1 } : { flex: 1 };
  
  const [adminInstitution, setAdminInstitution] = useState('Institution');
  const [pendingApprovals, setPendingApprovals] = useState(45);
  
  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const userInfoStr = await AsyncStorage.getItem('userInfo');
        if (userInfoStr) {
          const userInfo = JSON.parse(userInfoStr);
          if (userInfo.institution) {
            setAdminInstitution(userInfo.institution);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchAdminInfo();
  }, []);
  
  const stats = [
    { label: 'New Users', value: '45', trend: '+18% this wk', icon: 'person-add-outline', color: '#E0F2FE', iconColor: '#0284C7' },
    { label: 'Reported Posts', value: '12', trend: '-5% this wk', icon: 'flag-outline', color: '#FEE2E2', iconColor: theme.danger },
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
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      {/* Header with Back Button */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else {
                navigation.navigate('AdminMain');
              }
            }} 
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#002144" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Admin Console</Text>
            <Text style={styles.headerSub}>{adminInstitution} Portal</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.settingsBtn} onPress={() => Alert.alert('Admin Settings', 'Configuration panel.')}>
          <Ionicons name="settings-outline" size={24} color="#002144" />
        </TouchableOpacity>
      </View>

      <View style={webContainerStyle}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={[styles.statCard, { width: width > 1024 ? '23%' : width > 768 ? '31%' : '48%' }]}>
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
      </View>
    </SafeAreaView>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: theme.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
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
    color: theme.primary,
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 12,
    color: theme.textSecondary,
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
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.border,
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
    color: theme.textSecondary,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.primary,
  },
  statLabel: {
    fontSize: 12,
    color: theme.textSecondary,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.primary,
    marginBottom: 12,
    marginTop: 16,
  },
  chartContainer: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.border,
    marginBottom: 16,
  },
  chartTitleRow: {
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: theme.text,
  },
  chartSubtitle: {
    fontSize: 11.5,
    color: theme.textMuted,
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
    backgroundColor: theme.primary,
    borderRadius: 7,
    width: '100%',
  },
  chartMonthText: {
    fontSize: 11,
    color: theme.textSecondary,
    marginTop: 8,
    fontWeight: '600',
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.card,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 72,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.border,
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
    color: theme.text,
  },
  actionSub: {
    fontSize: 12,
    color: theme.textSecondary,
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
    color: theme.card,
    fontSize: 11,
    fontWeight: '800',
  },
});

export default AdminDashboardScreen;
