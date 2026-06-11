import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const initialNotifications = [
  // Today
  {
    id: '1',
    type: 'connection',
    title: 'New Connection Request',
    message: 'Aditya (Batch 2021) wants to connect with you.',
    time: '2m ago',
    icon: 'people-outline',
    color: '#E0F2FE',
    iconColor: '#0284C7',
    unread: true,
    section: 'Today'
  },
  {
    id: '2',
    type: 'job',
    title: 'New Job Alert',
    message: 'Google posted a new Senior SDE role matching your profile.',
    time: '1h ago',
    icon: 'briefcase-outline',
    color: '#FEF3C7',
    iconColor: '#D97706',
    unread: true,
    section: 'Today'
  },
  // Yesterday
  {
    id: '3',
    type: 'event',
    title: 'Event Reminder',
    message: 'Annual Alumni Meet starts in 2 days. Have you registered?',
    time: 'Yesterday',
    icon: 'calendar-outline',
    color: '#F3E8FF',
    iconColor: '#9333EA',
    unread: false,
    section: 'Yesterday'
  },
  // Earlier
  {
    id: '4',
    type: 'referral',
    title: 'Referral Update',
    message: 'Your referral for Sanjay at Microsoft has been accepted.',
    time: '3d ago',
    icon: 'checkmark-circle-outline',
    color: '#DCFCE7',
    iconColor: '#16A34A',
    unread: false,
    section: 'Earlier'
  },
  {
    id: '5',
    type: 'announcement',
    title: 'Official Announcement',
    message: 'RVCE campus tour for the Batch of 1998 scheduled for July.',
    time: '5d ago',
    icon: 'megaphone-outline',
    color: '#FFEDD5',
    iconColor: '#EA580C',
    unread: false,
    section: 'Earlier'
  }
];

const NotificationsScreen = ({ navigation }) => {
  const [notificationsList, setNotificationsList] = useState(initialNotifications);

  const handleMarkAllRead = () => {
    const updated = notificationsList.map(item => ({ ...item, unread: false }));
    setNotificationsList(updated);
  };

  const handleNotificationPress = (item) => {
    if (item.unread) {
      const updated = notificationsList.map(n => 
        n.id === item.id ? { ...n, unread: false } : n
      );
      setNotificationsList(updated);
    }

    if (item.type === 'job') {
      navigation.navigate('Main', { screen: 'Jobs' });
    } else if (item.type === 'connection' || item.type === 'referral') {
      navigation.navigate('Main', { screen: 'Engage' });
    } else {
      navigation.navigate('Main', { screen: 'Home' });
    }
  };

  // Group notifications by section
  const sections = ['Today', 'Yesterday', 'Earlier'];
  const groupedData = sections.map(section => {
    const data = notificationsList.filter(n => n.section === section);
    return { section, data };
  }).filter(group => group.data.length > 0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header with Back Button */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#002144" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>
        
        {notificationsList.some(n => n.unread) && (
          <TouchableOpacity onPress={handleMarkAllRead}>
            <Text style={styles.markRead}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {groupedData.map(group => (
          <View key={group.section} style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>{group.section}</Text>
            {group.data.map(item => (
              <TouchableOpacity 
                key={item.id} 
                style={[
                  styles.notificationCard,
                  item.unread && styles.unreadCard
                ]}
                onPress={() => handleNotificationPress(item)}
                activeOpacity={0.7}
              >
                {/* Left indicator for unread */}
                {item.unread && <View style={styles.unreadDot} />}
                
                <View style={[styles.iconBox, { backgroundColor: item.color }]}>
                  <Ionicons name={item.icon} size={22} color={item.iconColor} />
                </View>
                
                <View style={styles.textContainer}>
                  <View style={styles.titleRow}>
                    <Text style={[styles.title, item.unread && styles.unreadTitle]}>{item.title}</Text>
                    <Text style={styles.time}>{item.time}</Text>
                  </View>
                  <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {notificationsList.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={64} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptySubtitle}>You don&apos;t have any notifications at the moment.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
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
  markRead: {
    fontSize: 13.5,
    color: '#003366',
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  sectionContainer: {
    marginTop: 16,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
    paddingHorizontal: 20,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  notificationCard: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
    position: 'relative',
    alignItems: 'center',
  },
  unreadCard: {
    backgroundColor: '#F0F9FF',
  },
  unreadDot: {
    position: 'absolute',
    left: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0284C7',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#475569',
  },
  unreadTitle: {
    color: '#0F172A',
    fontWeight: '700',
  },
  time: {
    fontSize: 11,
    color: '#94A3B8',
  },
  message: {
    fontSize: 13.5,
    color: '#64748B',
    lineHeight: 18,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#475569',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13.5,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 6,
  },
});

export default NotificationsScreen;
