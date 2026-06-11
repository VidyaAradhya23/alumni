import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function JobsScreen() {
  const [search, setSearch] = useState('');
  const jobs = [
    { id: '1', title: 'Senior AI Engineer', company: 'NVIDIA', location: 'Bangalore / Remote', type: 'Full-time', salary: '₹45L - ₹65L', posted: '2h ago' },
    { id: '2', title: 'Director of Product', company: 'PhonePe', location: 'Bangalore', type: 'Full-time', salary: '₹60L - ₹85L', posted: '5h ago' },
    { id: '3', title: 'Full Stack Developer (React/Node)', company: 'Postman', location: 'Remote', type: 'Full-time', salary: '₹25L - ₹40L', posted: '1d ago' },
    { id: '4', title: 'Machine Learning Lead', company: 'Tesla', location: 'Austin, TX (H1B Support)', type: 'Full-time', salary: '$180k - $250k', posted: '2d ago' },
    { id: '5', title: 'Product Designer', company: 'Airbnb', location: 'Bangalore Hub', type: 'Full-time', salary: '₹30L - ₹45L', posted: '3d ago' },
    { id: '6', title: 'VP Engineering', company: 'Zerodha', location: 'Bangalore', type: 'Full-time', salary: '₹80L+', posted: '4d ago' },
    { id: '7', title: 'Cloud Architect', company: 'AWS', location: 'Hyderabad', type: 'Full-time', salary: '₹40L - ₹55L', posted: '5d ago' },
  ];

  const renderJob = ({ item }) => (
    <View style={styles.jobCard}>
      <View style={styles.jobHeader}>
        <View style={styles.companyIcon}><Text style={styles.iconText}>{item.company.charAt(0)}</Text></View>
        <View style={styles.jobTitleArea}>
          <Text style={styles.jobTitle}>{item.title}</Text>
          <Text style={styles.companyName}>{item.company} • Verified Alumni Employer</Text>
        </View>
        <TouchableOpacity onPress={() => Alert.alert('Saved', 'Job saved to your bookmarks.')}><Ionicons name="bookmark-outline" size={20} color="#94A3B8" /></TouchableOpacity>
      </View>
      
      <View style={styles.jobMeta}>
        <View style={styles.metaItem}><Ionicons name="location-outline" size={14} color="#64748B" /><Text style={styles.metaText}>{item.location}</Text></View>
        <View style={styles.metaItem}><Ionicons name="time-outline" size={14} color="#64748B" /><Text style={styles.metaText}>{item.type}</Text></View>
        <View style={styles.metaItem}><Ionicons name="cash-outline" size={14} color="#64748B" /><Text style={styles.metaText}>{item.salary}</Text></View>
      </View>

      <View style={styles.jobFooter}>
        <Text style={styles.postedText}>Posted {item.posted}</Text>
        <TouchableOpacity style={styles.applyBtn} onPress={() => Alert.alert('Application Sent', `Your RVCE Alumni Profile has been shared with the hiring team at ${item.company}.`)}>
          <Text style={styles.applyBtnText}>Apply Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Alumni Career Hub</Text>
        <TouchableOpacity style={styles.postJobBtn} onPress={() => Alert.alert('Post Job', 'As an alumnus, you can post jobs for free. Redirecting to portal...')}>
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.postJobText}>Post Job</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="#94A3B8" />
        <TextInput style={styles.searchInput} placeholder="Search jobs, companies, batches..." value={search} onChangeText={setSearch} />
      </View>

      <FlatList data={jobs} renderItem={renderJob} keyExtractor={item => item.id} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { padding: 20, backgroundColor: '#FFFFFF', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#002144' },
  postJobBtn: { backgroundColor: '#002144', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, gap: 4 },
  postJobText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 12 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', margin: 15, paddingHorizontal: 15, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', height: 50 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
  list: { padding: 15 },
  jobCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 15, borderWidth: 1, borderColor: '#E2E8F0' },
  jobHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 15 },
  companyIcon: { width: 45, height: 45, backgroundColor: '#F1F5F9', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 20, fontWeight: 'bold', color: '#002144' },
  jobTitleArea: { flex: 1 },
  jobTitle: { fontSize: 16, fontWeight: 'bold', color: '#0F172A' },
  companyName: { fontSize: 11, color: '#64748B', marginTop: 2 },
  jobMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 15, marginBottom: 15, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: '#64748B' },
  jobFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  postedText: { fontSize: 12, color: '#94A3B8' },
  applyBtn: { backgroundColor: '#FFFBEB', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#FFD700' },
  applyBtnText: { color: '#002144', fontWeight: 'bold', fontSize: 13 }
});
