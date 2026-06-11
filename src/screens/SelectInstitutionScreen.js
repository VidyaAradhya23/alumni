import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const institutions = [
  { id: 'RVCE', name: 'RVCE', fullName: 'RV College of Engineering', icon: 'school' },
  { id: 'RVITM', name: 'RVITM', fullName: 'RV Inst of Tech & Management', icon: 'code-working' },
  { id: 'RVPU', name: 'RVPU', fullName: 'RV Pre-University College', icon: 'book' },
  { id: 'RVIT', name: 'RVIT', fullName: 'RV Institute of Technology', icon: 'desktop' },
  { id: 'RVIM', name: 'RVIM', fullName: 'RV Institute of Management', icon: 'trending-up' },
  { id: 'RVIS', name: 'RVIS', fullName: 'RV International School', icon: 'globe' },
  { id: 'RVJC', name: 'RVJC', fullName: 'RV Junior College', icon: 'medal' },
  { id: 'RVAC', name: 'RVAC', fullName: 'RV Aster College', icon: 'color-palette' },
  { id: 'RVTC', name: 'RV Teachers College', fullName: 'RV Teachers Training College', icon: 'people' },
  { id: 'OTHER', name: 'Other', fullName: 'Other RVEI Institution', icon: 'grid' },
];

const SelectInstitutionScreen = ({ navigation }) => {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = institutions.filter(inst => 
    inst.name.toLowerCase().includes(search.toLowerCase()) || 
    inst.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>RVEI</Text>
        </View>
        <Text style={styles.title}>RV Educational</Text>
        <Text style={styles.title}>Institutions</Text>
      </View>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.listContainer}>
          {institutions.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.listItem,
                selected === item.id && styles.selectedListItem
              ]}
              onPress={() => setSelected(item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.radioContainer}>
                <View style={[styles.outerRadio, selected === item.id && styles.outerRadioSelected]}>
                  {selected === item.id && <View style={styles.innerRadio} />}
                </View>
              </View>
              <Text style={[
                styles.listItemText,
                selected === item.id && styles.selectedListItemText
              ]}>{item.fullName} ({item.name})</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.button, !selected && styles.disabledButton]}
          disabled={!selected}
          onPress={() => navigation.navigate('Welcome')}
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
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#002144',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#002144',
    letterSpacing: -0.5,
  },
  list: {
    flex: 1,
    paddingHorizontal: 24,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  listContainer: {
    gap: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  selectedListItem: {
    borderColor: '#003366',
    backgroundColor: '#F0F9FF',
  },
  radioContainer: {
    marginRight: 16,
  },
  outerRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerRadioSelected: {
    borderColor: '#003366',
  },
  innerRadio: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#003366',
  },
  listItemText: {
    fontSize: 15,
    color: '#475569',
    fontWeight: '500',
    flex: 1,
  },
  selectedListItemText: {
    color: '#002144',
    fontWeight: '700',
  },
  footer: {
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  button: {
    backgroundColor: '#003366',
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#94A3B8',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  }
});

export default SelectInstitutionScreen;
