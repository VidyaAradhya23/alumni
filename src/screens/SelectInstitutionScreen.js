import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const institutions = [
  { id: 'RVCE', name: 'RVCE', fullName: 'RV College of Engineering', icon: 'school' },
  { id: 'RVITM', name: 'RVITM', fullName: 'RV Institute of Technology & Management', icon: 'code-working' },
  { id: 'RVPU', name: 'RVPU', fullName: 'RV Pre-University College', icon: 'book' },
  { id: 'RVIS', name: 'RVIS', fullName: 'RV International School', icon: 'globe' },
  { id: 'RVU', name: 'RVU', fullName: 'RV University', icon: 'ribbon' },
  { id: 'RVCA', name: 'RVCA', fullName: 'RV College of Architecture', icon: 'color-palette' },
  { id: 'RVIM', name: 'RVIM', fullName: 'RV Institute of Management', icon: 'trending-up' },
  { id: 'RVILS', name: 'RVILS', fullName: 'RV Institute of Legal Studies', icon: 'briefcase' },
  { id: 'DAPMRV', name: 'DAPMRV', fullName: 'DAPM RV Dental College', icon: 'medkit' },
  { id: 'RVCN', name: 'RVCN', fullName: 'RV College of Nursing', icon: 'pulse' },
  { id: 'RVCP', name: 'RVCP', fullName: 'RV College of Physiotherapy', icon: 'fitness' },
  { id: 'RVTC', name: 'RVTC', fullName: 'RV Teachers College', icon: 'people' },
  { id: 'RVTTI', name: 'RVTTI', fullName: 'RV Teachers Training Institute', icon: 'pencil' },
  { id: 'NMKRV', name: 'NMKRV', fullName: 'NMKRV College for Women', icon: 'grid' },
  { id: 'SSMRV', name: 'SSMRV', fullName: 'SSMRV College', icon: 'grid' },
  { id: 'RVPS', name: 'RVPS', fullName: 'RV Public School', icon: 'school' },
  { id: 'RVS', name: 'RVS', fullName: 'RV School', icon: 'book' },
  { id: 'RVLH', name: 'RVLH', fullName: 'RV Learning Hub', icon: 'rocket' },
  { id: 'OTHER', name: 'Other', fullName: 'Other Institution', icon: 'grid' },
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
          <Text style={styles.logoText}>RV</Text>
        </View>
        <Text style={styles.title}>RV Educational</Text>
        <Text style={styles.title}>Institutions</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#94A3B8" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Institution..."
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
          clearButtonMode="while-editing"
          autoCapitalize="none"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.listContainer}>
          {filtered.map((item) => (
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
          onPress={async () => {
            if (selected) {
              global.selectedInstitution = selected;
              try {
                await AsyncStorage.setItem('selectedInstitution', selected);
              } catch (e) {
                console.error(e);
              }
              navigation.navigate('Welcome');
            }
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    marginHorizontal: 24,
    marginBottom: 16,
    paddingHorizontal: 14,
    height: 48,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#002144',
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
