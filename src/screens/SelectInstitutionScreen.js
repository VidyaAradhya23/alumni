import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, StatusBar } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const institutions = [
  { id: 'RV School', name: 'RVS', fullName: 'RV School', icon: 'school' },
  { id: 'RV Girls High School', name: 'RVGHS', fullName: 'RV Girls High School', icon: 'school' },
  { id: 'RV Public School', name: 'RVPS', fullName: 'RV Public School', icon: 'school' },
  { id: 'RV Learning Hub', name: 'RVLH', fullName: 'RV Learning Hub', icon: 'book' },
  { id: 'SSMRV PU College', name: 'SSMRVPU', fullName: 'SSMRV PU College', icon: 'book' },
  { id: 'NMKRV PU College', name: 'NMKRVPU', fullName: 'NMKRV PU College', icon: 'book' },
  { id: 'RV PU College Jayanagar', name: 'RVPU_JAY', fullName: 'RV PU College Jayanagar', icon: 'book' },
  { id: 'RV PU College North', name: 'RVPU_NOR', fullName: 'RV PU College North', icon: 'book' },
  { id: 'RV PU College South', name: 'RVPU_SOU', fullName: 'RV PU College South', icon: 'book' },
  { id: 'RV PU College, E-City', name: 'RVPU_ECI', fullName: 'RV PU College, E-City', icon: 'book' },
  { id: 'RV PU College, Harohalli', name: 'RVPU_HAR', fullName: 'RV PU College, Harohalli', icon: 'book' },
  { id: 'RV PU College, Mysuru', name: 'RVPU_MYS', fullName: 'RV PU College, Mysuru', icon: 'book' },
  { id: 'RV College of Engineering', name: 'RVCE', fullName: 'RV College of Engineering', icon: 'build' },
  { id: 'RV Institute of Technology and Management', name: 'RVITM', fullName: 'RV Institute of Technology and Management', icon: 'code-working' },
  { id: 'RV-Skills', name: 'RVSK', fullName: 'RV-Skills', icon: 'laptop' },
  { id: 'RV College of Architecture', name: 'RVCA', fullName: 'RV College of Architecture', icon: 'color-palette' },
  { id: 'RV Institute of Management', name: 'RVIM', fullName: 'RV Institute of Management', icon: 'trending-up' },
  { id: 'MKPM RV Institute of Legal Studies', name: 'RVILS', fullName: 'MKPM RV Institute of Legal Studies', icon: 'briefcase' },
  { id: 'RV Teachers College', name: 'RVTC', fullName: 'RV Teachers College', icon: 'people' },
  { id: 'D.A. Pandu Memorial RV Dental College', name: 'DAPMRV', fullName: 'D.A. Pandu Memorial RV Dental College', icon: 'medkit' },
  { id: 'RV College of Physiotherapy', name: 'RVCP', fullName: 'RV College of Physiotherapy', icon: 'fitness' },
  { id: 'RV College of Nursing', name: 'RVCN', fullName: 'RV College of Nursing', icon: 'pulse' },
  { id: 'NMKRV College', name: 'NMKRV', fullName: 'NMKRV College', icon: 'grid' },
  { id: 'SSMRV College', name: 'SSMRV', fullName: 'SSMRV College', icon: 'grid' },
  { id: 'RV University, Bengaluru Campus', name: 'RVU_BLR', fullName: 'RV University, Bengaluru Campus', icon: 'ribbon' },
  { id: 'RV University, Mysuru Campus', name: 'RVU_MYS', fullName: 'RV University, Mysuru Campus', icon: 'ribbon' },
  { id: 'Media Cell Institution', name: 'MCI', fullName: 'Media Cell Institution', icon: 'camera' },
];

const SelectInstitutionScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const styles = getStyles(theme);

  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = institutions.filter(inst => 
    inst.name.toLowerCase().includes(search.toLowerCase()) || 
    inst.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
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

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.card,
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
    backgroundColor: theme.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.border,
    marginBottom: 20,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '900',
    color: theme.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.primary,
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
    borderColor: theme.border,
    backgroundColor: theme.background,
  },
  selectedListItem: {
    borderColor: theme.primary,
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
    borderColor: theme.primary,
  },
  innerRadio: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.primary,
  },
  listItemText: {
    fontSize: 15,
    color: '#475569',
    fontWeight: '500',
    flex: 1,
  },
  selectedListItemText: {
    color: theme.primary,
    fontWeight: '700',
  },
  footer: {
    padding: 24,
    backgroundColor: theme.card,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.background,
    borderWidth: 1,
    borderColor: theme.border,
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
    color: theme.primary,
  },
  button: {
    backgroundColor: theme.primary,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: theme.textMuted,
  },
  buttonText: {
    color: theme.card,
    fontSize: 16,
    fontWeight: '700',
  }
});

export default SelectInstitutionScreen;
