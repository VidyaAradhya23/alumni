import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function EventsScreen() {
  const [activeTab, setActiveTab] = useState('Upcoming');

  const events = [
    { id: '1', title: 'Global Alumni Mega Reunion 2026', date: 'Dec 20, 2026', time: '10:00 AM', location: 'RVCE Campus, Bangalore', type: 'Mega Event', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80', attendees: 1240 },
    { id: '2', title: 'Silicon Valley Tech Networking', date: 'Oct 15, 2026', time: '06:00 PM', location: 'Palo Alto, CA', type: 'Networking', image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80', attendees: 85 },
    { id: '3', title: 'Workshop: AI in Engineering', date: 'Nov 05, 2026', time: '11:00 AM', location: 'Virtual / Zoom', type: 'Workshop', image: 'https://images.unsplash.com/photo-1591115765373-520b7a21769b?w=800&q=80', attendees: 450 },
    { id: '4', title: 'RVCE Founder\'s Day Celebration', date: 'Aug 15, 2026', time: '08:00 AM', location: 'RV Vidyanikethan Post', type: 'Cultural', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80', attendees: 2000 },
    { id: '5', title: 'London Alumni Chapter Meetup', date: 'Sept 10, 2026', time: '07:00 PM', location: 'The Shard, London', type: 'Chapter Meet', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80', attendees: 120 },
  ];

  const handleRegister = (title) => {
    Alert.alert('Registration Successful', `You have been registered for ${title}. Official RVCE invitation will follow.`);
  };

  const renderEvent = ({ item }) => (
    <View style={styles.eventCard}>
      <Image source={{ uri: item.image }} style={styles.eventImage} />
      <View style={styles.eventContent}>
        <View style={styles.eventTag}><Text style={styles.tagText}>{item.type}</Text></View>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <View style={styles.eventDetails}>
          <View style={styles.detailItem}><Ionicons name="calendar-outline" size={16} color="#64748B" /><Text style={styles.detailText}>{item.date} • {item.time}</Text></View>
          <View style={styles.detailItem}><Ionicons name="location-outline" size={16} color="#64748B" /><Text style={styles.detailText}>{item.location}</Text></View>
        </View>
        <View style={styles.eventFooter}>
          <Text style={styles.attendeeText}>{item.attendees}+ Members</Text>
          <TouchableOpacity style={styles.registerBtn} onPress={() => handleRegister(item.title)}><Text style={styles.registerBtnText}>Join Event</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>RVCE Global Events</Text>
        <TouchableOpacity onPress={() => Alert.alert('Filter', 'Filter by Location, Batch or Type.')}><Ionicons name="filter" size={24} color="#002144" /></TouchableOpacity>
      </View>
      <View style={styles.tabContainer}>
        {['Upcoming', 'My Events', 'Chapter Meets'].map(tab => (
          <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.tabActive]} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList data={events} renderItem={renderEvent} keyExtractor={item => item.id} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { paddingHorizontal: 20, paddingVertical: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#002144' },
  tabContainer: { flexDirection: 'row', backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingVertical: 10, gap: 20 },
  tab: { paddingBottom: 8, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: '#FFD700' },
  tabText: { fontSize: 14, color: '#64748B', fontWeight: '600' },
  tabTextActive: { color: '#002144' },
  list: { padding: 15 },
  eventCard: { backgroundColor: '#FFFFFF', borderRadius: 20, overflow: 'hidden', marginBottom: 20, borderWidth: 1, borderColor: '#E2E8F0', elevation: 3 },
  eventImage: { width: '100%', height: 180 },
  eventContent: { padding: 16 },
  eventTag: { backgroundColor: '#FFFBEB', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 10, borderWidth: 1, borderColor: '#FEF3C7' },
  tagText: { color: '#B45309', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  eventTitle: { fontSize: 18, fontWeight: 'bold', color: '#0F172A', marginBottom: 12 },
  eventDetails: { gap: 8, marginBottom: 15 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailText: { fontSize: 13, color: '#64748B' },
  eventFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  attendeeText: { fontSize: 12, color: '#94A3B8', fontWeight: '600' },
  registerBtn: { backgroundColor: '#002144', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  registerBtnText: { color: '#FFD700', fontWeight: 'bold', fontSize: 14 }
});
