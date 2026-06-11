import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';

const MentorshipScreen = () => {
  const mentors = [
    {
      id: 1,
      name: 'Dr. Ramesh Kumar',
      expertise: 'Cloud Computing & Architecture',
      batch: '1998',
      company: 'AWS',
      initials: 'RK'
    },
    {
      id: 2,
      name: 'Sarah Chen',
      expertise: 'Product Design & UX',
      batch: '2010',
      company: 'Airbnb',
      initials: 'SC'
    },
    {
      id: 3,
      name: 'Vikram Malhotra',
      expertise: 'Entrepreneurship & VC',
      batch: '2005',
      company: 'Sequoia Capital',
      initials: 'VM'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mentorship Hub</Text>
        </View>

        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Learn from the Best</Text>
          <Text style={styles.heroSubtitle}>Connect with senior alumni for career guidance, technical mentorship, and industry insights.</Text>
          <TouchableOpacity style={styles.becomeMentorBtn}>
            <Text style={styles.becomeMentorText}>Become a Mentor</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Mentors</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {mentors.map(mentor => (
          <View key={mentor.id} style={styles.mentorCard}>
            <View style={styles.mentorHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{mentor.initials}</Text>
              </View>
              <View style={styles.mentorInfo}>
                <Text style={styles.mentorName}>{mentor.name}</Text>
                <Text style={styles.mentorDetails}>Class of {mentor.batch} • {mentor.company}</Text>
              </View>
            </View>
            <View style={styles.expertiseRow}>
              <Text style={styles.expertiseLabel}>Expertise:</Text>
              <Text style={styles.expertiseValue}>{mentor.expertise}</Text>
            </View>
            <TouchableOpacity style={styles.requestBtn}>
              <Text style={styles.requestBtnText}>Request Mentorship</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>500+</Text>
            <Text style={styles.statLabel}>Mentors</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>1.2k</Text>
            <Text style={styles.statLabel}>Success Stories</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>24h</Text>
            <Text style={styles.statLabel}>Avg Response</Text>
          </View>
        </View>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#002144',
  },
  heroSection: {
    padding: 24,
    backgroundColor: '#003366',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    opacity: 0.9,
  },
  becomeMentorBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  becomeMentorText: {
    color: '#003366',
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  viewAllText: {
    color: '#003366',
    fontWeight: '600',
  },
  mentorCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  mentorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003366',
  },
  mentorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  mentorDetails: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  expertiseRow: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 8,
  },
  expertiseLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    marginRight: 8,
  },
  expertiseValue: {
    fontSize: 12,
    color: '#334155',
    flex: 1,
  },
  requestBtn: {
    backgroundColor: '#003366',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  requestBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 24,
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003366',
  },
  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  }
});

export default MentorshipScreen;
