import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DirectoryScreen() {
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('Global');

  const alumni = [
    { id: '1', name: 'Ananya Joshi', batch: '2018', branch: 'ISE', company: 'Microsoft', location: 'Seattle, WA', role: 'Senior SDE' },
    { id: '2', name: 'Rahul Verma', batch: '2020', branch: 'ECE', company: 'Apple', location: 'Cupertino, CA', role: 'Hardware Eng' },
    { id: '3', name: 'Priya Sharma', batch: '2015', branch: 'CSE', company: 'Google', location: 'Bangalore, India', role: 'Staff Eng' },
    { id: '4', name: 'Vikram Singh', batch: '2012', branch: 'ME', company: 'Tesla', location: 'Austin, TX', role: 'Supply Chain Mgr' },
    { id: '5', name: 'Siddharth Jain', batch: '2005', branch: 'CV', company: 'L&T Construction', location: 'Dubai, UAE', role: 'Project Director' },
    { id: '6', name: 'Kavita Rao', batch: '2019', branch: 'BT', company: 'Biocon', location: 'Bangalore, India', role: 'Research Scientist' },
    { id: '7', name: 'Zeeshan Ali', batch: '2014', branch: 'EE', company: 'Siemens', location: 'Munich, Germany', role: 'Automation Lead' },
    { id: '8', name: 'Monica G.', batch: '2021', branch: 'CSE', company: 'Meta', location: 'London, UK', role: 'Software Eng' },
  ];

  const handleConnect = (name) => {
    Alert.alert('Connection Request', `Your request to connect with ${name} has been sent. Once accepted, you can message them directly.`);
  };

  const renderAlumnus = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.avatar}><Text style={styles.avatarText}>{item.name.charAt(0)}</Text></View>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.details}>{item.role} @ {item.company}</Text>
        <Text style={styles.subDetails}>Class of {item.batch} • {item.branch}</Text>
        <View style={styles.tagRow}>
          <View style={styles.tag}><Ionicons name="location-outline" size={10} color="#64748B" /><Text style={styles.tagText}>{item.location}</Text></View>
        </View>
      </View>
      <TouchableOpacity style={styles.connectBtn} onPress={() => handleConnect(item.name)}>
        <Ionicons name="person-add" size={24} color="#002144" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Alumni Directory</Text>
      </View>

      <View style={styles.toggleRow}>
        {['Global', 'Chapters', 'Mentors'].map(type => (
          <TouchableOpacity key={type} style={[styles.toggleBtn, activeType === type && styles.toggleActive]} onPress={() => setActiveType(type)}>
            <Text style={[styles.toggleText, activeType === type && styles.toggleTextActive]}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#94A3B8" style={styles.searchIcon} />
        <TextInput style={styles.searchInput} placeholder="Search by name, batch, company..." value={search} onChangeText={setSearch} />
      </View>

      <FlatList data={alumni} renderItem={renderAlumnus} keyExtractor={item => item.id} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { padding: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#002144' },
  toggleRow: { flexDirection: 'row', backgroundColor: '#FFFFFF', paddingHorizontal: 15, paddingVertical: 10, gap: 10 },
  toggleBtn: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F1F5F9' },
  toggleActive: { backgroundColor: '#002144' },
  toggleText: { fontSize: 13, fontWeight: 'bold', color: '#64748B' },
  toggleTextActive: { color: '#FFD700' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', margin: 15, paddingHorizontal: 15, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', height: 50 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16 },
  list: { padding: 15 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  avatar: { width: 55, height: 55, borderRadius: 27.5, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 15, borderWidth: 1, borderColor: '#E2E8F0' },
  avatarText: { fontSize: 20, fontWeight: 'bold', color: '#002144' },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#0F172A' },
  details: { fontSize: 13, color: '#002144', fontWeight: '600', marginTop: 2 },
  subDetails: { fontSize: 12, color: '#64748B', marginTop: 2 },
  tagRow: { flexDirection: 'row', marginTop: 8 },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F8FAFC', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#F1F5F9' },
  tagText: { fontSize: 10, color: '#64748B', fontWeight: 'bold' },
  connectBtn: { padding: 10, backgroundColor: '#FFFBEB', borderRadius: 12, borderWidth: 1, borderColor: '#FFD700' }
});
