import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { supabase } from '../lib/supabase';

export default function AdminMetricsScreen({ navigation }) {
  const { theme, isDarkMode } = useTheme();
  const { width } = useWindowDimensions();
  const isFocused = useIsFocused();

  const [institution, setInstitution] = useState('Institution');
  const [adminName, setAdminName] = useState('Admin');
  
  // Dashboard Metrics
  const [metrics, setMetrics] = useState({
    totalAlumni: 0,
    pendingApprovals: 0,
    activeJobs: 24, // Mock
    upcomingEvents: 5 // Mock
  });

  const [recentPending, setRecentPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFocused) {
      loadDashboardData();
    }
  }, [isFocused]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch user info from async storage
      const userInfoString = await AsyncStorage.getItem('userInfo');
      let instName = 'Institution';
      if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        instName = userInfo.institution || 'Institution';
        setInstitution(instName);
        setAdminName(userInfo.name || 'Admin');
      }

      // Fetch pending approvals for this institution
      const { data: pendingUsers, error: usersErr } = await supabase
        .from('users')
        .select('*')
        .eq('institution', instName)
        .eq('is_approved', false)
        .order('created_at', { ascending: false });

      if (!usersErr && pendingUsers) {
        setMetrics(prev => ({ ...prev, pendingApprovals: pendingUsers.length }));
        setRecentPending(pendingUsers.slice(0, 5)); // Show top 5
      }

      const { count: alumniCount, error: countErr } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('institution', instName)
        .eq('is_approved', true)
        .eq('role', 'Alumni');
        
      if (!countErr) {
        setMetrics(prev => ({ ...prev, totalAlumni: alumniCount || 0 }));
      }

    } catch (err) {
      console.log('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const isWeb = Platform.OS === 'web';
  const webContainerStyle = isWeb ? { alignSelf: 'center', width: '100%', maxWidth: 1024, flex: 1 } : { flex: 1 };
  
  const getStyles = (theme) => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: Platform.OS === 'android' ? 40 : 20,
      paddingBottom: 15,
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.text,
    },
    headerIcons: {
      flexDirection: 'row',
    },
    headerIconBtn: {
      marginLeft: 15,
      position: 'relative',
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 80,
    },
    welcomeContainer: {
      marginBottom: 25,
    },
    welcomeText: {
      fontSize: 28,
      fontWeight: '800',
      color: theme.text,
      marginBottom: 6,
    },
    welcomeSubtitle: {
      fontSize: 16,
      color: theme.textMuted,
      fontWeight: '500',
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.text,
      marginBottom: 15,
      marginTop: 10,
    },
    metricsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    metricCard: {
      width: '48%',
      backgroundColor: theme.card,
      padding: 20,
      borderRadius: 16,
      marginBottom: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 5,
      elevation: 2,
      borderWidth: 1,
      borderColor: theme.border,
    },
    metricIconBg: {
      width: 44,
      height: 44,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    metricValue: {
      fontSize: 26,
      fontWeight: '800',
      color: theme.text,
      marginBottom: 4,
    },
    metricLabel: {
      fontSize: 14,
      color: theme.textMuted,
      fontWeight: '600',
    },
    actionsGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    actionBtn: {
      flex: 1,
      backgroundColor: theme.card,
      paddingVertical: 18,
      paddingHorizontal: 10,
      borderRadius: 16,
      alignItems: 'center',
      marginHorizontal: 5,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 1,
    },
    actionIconBg: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.background,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
    },
    actionText: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.text,
      textAlign: 'center',
    },
    listContainer: {
      backgroundColor: theme.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border,
      overflow: 'hidden',
    },
    emptyList: {
      padding: 30,
      alignItems: 'center',
    },
    emptyText: {
      color: theme.textMuted,
      fontSize: 16,
      marginTop: 10,
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    listLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    avatarText: {
      color: theme.primary,
      fontWeight: 'bold',
      fontSize: 16,
    },
    listName: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
    },
    listSub: {
      fontSize: 13,
      color: theme.textMuted,
      marginTop: 2,
    },
    reviewBtn: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: theme.primary,
      borderRadius: 8,
    },
    reviewBtnText: {
      color: '#FFF',
      fontWeight: '600',
      fontSize: 14,
    }
  });

  const styles = getStyles(theme);

  const MetricCard = ({ icon, color, value, label }) => (
    <View style={styles.metricCard}>
      <View style={[styles.metricIconBg, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );

  const ActionButton = ({ icon, label, onPress, color }) => (
    <TouchableOpacity style={styles.actionBtn} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.actionIconBg}>
        <Ionicons name={icon} size={24} color={color || theme.primary} />
      </View>
      <Text style={styles.actionText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={webContainerStyle}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.card} />

        {/* Top App Bar */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.headerIconBtn} onPress={() => navigation && navigation.navigate('AdminProfile')}>
              <Ionicons name="person-circle-outline" size={30} color={theme.text} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Welcome Section */}
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Welcome, {adminName}</Text>
            <Text style={styles.welcomeSubtitle}>Manage {institution}</Text>
          </View>

          {/* KPIs Section */}
          <View style={styles.metricsGrid}>
            <MetricCard 
              icon="people" 
              color={theme.primary} 
              value={metrics.totalAlumni.toString()} 
              label="Total Alumni" 
            />
            <MetricCard 
              icon="time" 
              color="#F59E0B" // Amber
              value={metrics.pendingApprovals.toString()} 
              label="Pending Approvals" 
            />
            <MetricCard 
              icon="briefcase" 
              color="#10B981" // Emerald
              value={metrics.activeJobs.toString()} 
              label="Active Jobs" 
            />
            <MetricCard 
              icon="calendar" 
              color="#8B5CF6" // Violet
              value={metrics.upcomingEvents.toString()} 
              label="Upcoming Events" 
            />
          </View>

          {/* Quick Actions */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <ActionButton 
              icon="checkmark-circle-outline" 
              label="Approvals" 
              color="#F59E0B"
              onPress={() => navigation && navigation.navigate('AdminUsers')} 
            />
            <ActionButton 
              icon="briefcase-outline" 
              label="Post Job" 
              color="#10B981"
              onPress={() => navigation && navigation.navigate('AdminJobs')} 
            />
            <ActionButton 
              icon="calendar-outline" 
              label="New Event" 
              color="#8B5CF6"
              onPress={() => navigation && navigation.navigate('AdminEvents')} 
            />
            <ActionButton 
              icon="mail-outline" 
              label="Broadcast" 
              color={theme.primary}
              onPress={() => navigation && navigation.navigate('AdminPanel')} 
            />
          </View>

          {/* Recent Pending Approvals */}
          <Text style={styles.sectionTitle}>Pending Approvals</Text>
          <View style={styles.listContainer}>
            {recentPending.length === 0 ? (
              <View style={styles.emptyList}>
                <Ionicons name="checkmark-done-circle-outline" size={48} color={theme.textMuted} />
                <Text style={styles.emptyText}>No pending users. You&apos;re all caught up!</Text>
              </View>
            ) : (
              recentPending.map((user, index) => (
                <View 
                  key={user.id || index.toString()} 
                  style={[styles.listItem, index === recentPending.length - 1 && { borderBottomWidth: 0 }]}
                >
                  <View style={styles.listLeft}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</Text>
                    </View>
                    <View>
                      <Text style={styles.listName}>{user.name}</Text>
                      <Text style={styles.listSub}>{user.email}</Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.reviewBtn}
                    onPress={() => navigation && navigation.navigate('AdminUsers')}
                  >
                    <Text style={styles.reviewBtnText}>Review</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
