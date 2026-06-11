import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const LandingScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.badge}>Welcome back</Text>
          <Text style={styles.title}>
            RVCE <Text style={styles.highlight}>Alumni</Text>
          </Text>
          <Text style={styles.subtitle}>
            Connect, Collaborate, and Grow Together with the exclusive global network of R.V. College of Engineering alumni.
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>25k+</Text>
            <Text style={styles.statLabel}>Alumni</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>5k+</Text>
            <Text style={styles.statLabel}>Jobs</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.primaryButtonText}>Join the Network</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Explore as Guest</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  badge: {
    backgroundColor: 'rgba(10, 61, 145, 0.1)',
    color: '#003366',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    fontWeight: '600',
    marginBottom: 16,
    overflow: 'hidden',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#002144',
    marginBottom: 16,
  },
  highlight: {
    color: '#003366',
  },
  subtitle: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 24,
    marginBottom: 32,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  statBox: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 4,
  },
  statLabel: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    padding: 24,
    paddingBottom: 36,
  },
  primaryButton: {
    backgroundColor: '#003366',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#003366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#003366',
  },
  secondaryButtonText: {
    color: '#003366',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LandingScreen;
