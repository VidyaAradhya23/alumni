import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RoleSelectionScreen = ({ navigation }) => {
  const [selected, setSelected] = useState(null);

  const roles = [
    { id: 'Alumni', icon: 'school', description: 'Access the global alumni network and resources' },
    { id: 'Admin', icon: 'settings', description: 'Institution-level management and moderation' },
    { id: 'Super Admin', icon: 'shield', description: 'Global RVEI governance and control' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
          <Text style={styles.title}>Choose Role</Text>
          <Text style={styles.subtitle}>Select your role to personalize your experience</Text>
        </View>

        <View style={styles.rolesContainer}>
          {roles.map((role) => (
            <TouchableOpacity
              key={role.id}
              style={[
                styles.roleCard,
                selected === role.id && styles.selectedCard
              ]}
              onPress={() => setSelected(role.id)}
            >
              <View style={[
                styles.iconContainer,
                selected === role.id && styles.selectedIconContainer
              ]}>
                <Ionicons 
                  name={role.icon} 
                  size={32} 
                  color={selected === role.id ? '#FFFFFF' : '#003366'} 
                />
              </View>
              <View style={styles.roleTextContainer}>
                <Text style={[
                  styles.roleTitle,
                  selected === role.id && styles.selectedRoleTitle
                ]}>{role.id}</Text>
                <Text style={styles.roleDescription}>{role.description}</Text>
              </View>
              {selected === role.id && (
                <Ionicons name="checkmark-circle" size={24} color="#003366" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.button, !selected && styles.disabledButton]}
          disabled={!selected}
          onPress={() => {
            if (selected === 'Admin') navigation.navigate('AdminDashboard');
            else if (selected === 'Super Admin') navigation.navigate('SuperAdminDashboard');
            else navigation.navigate('Main');
          }}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 24,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    marginBottom: 48,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#002144',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  rolesContainer: {
    gap: 16,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectedCard: {
    backgroundColor: '#F0F9FF',
    borderColor: '#003366',
    borderWidth: 2,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedIconContainer: {
    backgroundColor: '#003366',
  },
  roleTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#002144',
  },
  selectedRoleTitle: {
    color: '#003366',
  },
  roleDescription: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  footer: {
    padding: 24,
  },
  button: {
    backgroundColor: '#003366',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#94A3B8',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RoleSelectionScreen;
