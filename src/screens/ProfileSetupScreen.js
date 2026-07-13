import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert, Image, StatusBar, Modal, FlatList } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { uploadFile } from '../services/uploadService';
import { updateProfile } from '../services/authService';

const institutions = [
  { id: 'RV School', name: 'RVS', fullName: 'RV School' },
  { id: 'RV Girls High School', name: 'RVGHS', fullName: 'RV Girls High School' },
  { id: 'RV Public School', name: 'RVPS', fullName: 'RV Public School' },
  { id: 'RV Learning Hub', name: 'RVLH', fullName: 'RV Learning Hub' },
  { id: 'SSMRV PU College', name: 'SSMRVPU', fullName: 'SSMRV PU College' },
  { id: 'NMKRV PU College', name: 'NMKRVPU', fullName: 'NMKRV PU College' },
  { id: 'RV PU College Jayanagar', name: 'RVPU_JAY', fullName: 'RV PU College Jayanagar' },
  { id: 'RV PU College North', name: 'RVPU_NOR', fullName: 'RV PU College North' },
  { id: 'RV PU College South', name: 'RVPU_SOU', fullName: 'RV PU College South' },
  { id: 'RV PU College, E-City', name: 'RVPU_ECI', fullName: 'RV PU College, E-City' },
  { id: 'RV PU College, Harohalli', name: 'RVPU_HAR', fullName: 'RV PU College, Harohalli' },
  { id: 'RV PU College, Mysuru', name: 'RVPU_MYS', fullName: 'RV PU College, Mysuru' },
  { id: 'RV College of Engineering', name: 'RVCE', fullName: 'RV College of Engineering' },
  { id: 'RV Institute of Technology and Management', name: 'RVITM', fullName: 'RV Institute of Technology and Management' },
  { id: 'RV-Skills', name: 'RVSK', fullName: 'RV-Skills' },
  { id: 'RV College of Architecture', name: 'RVCA', fullName: 'RV College of Architecture' },
  { id: 'RV Institute of Management', name: 'RVIM', fullName: 'RV Institute of Management' },
  { id: 'MKPM RV Institute of Legal Studies', name: 'RVILS', fullName: 'MKPM RV Institute of Legal Studies' },
  { id: 'RV Teachers College', name: 'RVTC', fullName: 'RV Teachers College' },
  { id: 'D.A. Pandu Memorial RV Dental College', name: 'DAPMRV', fullName: 'D.A. Pandu Memorial RV Dental College' },
  { id: 'RV College of Physiotherapy', name: 'RVCP', fullName: 'RV College of Physiotherapy' },
  { id: 'RV College of Nursing', name: 'RVCN', fullName: 'RV College of Nursing' },
  { id: 'NMKRV College', name: 'NMKRV', fullName: 'NMKRV College' },
  { id: 'SSMRV College', name: 'SSMRV', fullName: 'SSMRV College' },
  { id: 'RV University, Bengaluru Campus', name: 'RVU_BLR', fullName: 'RV University, Bengaluru Campus' },
  { id: 'RV University, Mysuru Campus', name: 'RVU_MYS', fullName: 'RV University, Mysuru Campus' },
];

const locations = [
  { id: 'BLR', name: 'Bengaluru, India' },
  { id: 'MUM', name: 'Mumbai, India' },
  { id: 'DEL', name: 'Delhi NCR, India' },
  { id: 'HYD', name: 'Hyderabad, India' },
  { id: 'PUN', name: 'Pune, India' },
  { id: 'SV', name: 'Silicon Valley, USA' },
  { id: 'NYC', name: 'New York City, USA' },
  { id: 'LON', name: 'London, UK' },
  { id: 'SGP', name: 'Singapore' },
  { id: 'OTHER', name: 'Other Location' },
];


const ProfileSetupScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const styles = getStyles(theme);

  const [formData, setFormData] = useState({
    fullName: '',
    institution: '',
    batchYear: '',
    department: '',
    company: '',
    location: '',
  });
  
  const [avatar, setAvatar] = useState(null);
  const [avatarMimeType, setAvatarMimeType] = useState('image/jpeg');
  const [isUploading, setIsUploading] = useState(false);
  const [instModalVisible, setInstModalVisible] = useState(false);
  const [locModalVisible, setLocModalVisible] = useState(false);

  const handleContinue = async () => {
    if (!formData.fullName.trim()) {
      Alert.alert('Required', 'Please enter your full name.');
      return;
    }
    if (!formData.batchYear.trim()) {
      Alert.alert('Required', 'Please enter your graduation batch year.');
      return;
    }
    if (!formData.department.trim()) {
      Alert.alert('Required', 'Please enter your department/branch.');
      return;
    }

    setIsUploading(true);
    try {
      let avatarUrl = null;
      if (avatar) {
        avatarUrl = await uploadFile(avatar, avatarMimeType, 'avatar.jpg');
      }

      await updateProfile({
        name: formData.fullName,
        institution: formData.institution,
        batch_year: formData.batchYear,
        department: formData.department,
        company: formData.company,
        location: formData.location,
        avatar_url: avatarUrl
      });

      setIsUploading(false);
      navigation.navigate('Main');
    } catch (error) {
      console.error('Error saving profile setup:', error);
      setIsUploading(false);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    }
  };

  const handleSelectAvatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAvatar(result.assets[0].uri);
      setAvatarMimeType(result.assets[0].mimeType || 'image/jpeg');
    }
  };

    const isWeb = Platform.OS === 'web';
  const webContainerStyle = isWeb ? { alignSelf: 'center', width: '100%', maxWidth: 800, flex: 1 } : { flex: 1 };

  return (
    <SafeAreaView style={styles.container}>
      <View style={webContainerStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressStep, styles.stepActive]} />
            <View style={[styles.progressStep, styles.stepActive]} />
            <View style={[styles.progressStep, styles.stepActive]} />
            <View style={styles.progressStep} />
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>Profile Setup</Text>
            <Text style={styles.subtitle}>Complete your profile to connect with fellow alumni</Text>
          </View>

          {/* Avatar Upload Placeholder */}
          <View style={styles.avatarSection}>
            <TouchableOpacity style={styles.avatarButton} onPress={handleSelectAvatar} activeOpacity={0.8}>
              {avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="camera-outline" size={32} color="#94A3B8" />
                  <Text style={styles.avatarLabel}>Add Photo</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name *</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="John Doe"
                  placeholderTextColor="#94A3B8"
                  value={formData.fullName}
                  onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Institution *</Text>
              <TouchableOpacity 
                style={styles.inputWrapper} 
                onPress={() => setInstModalVisible(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="business-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                <Text style={[styles.input, !formData.institution && { color: theme.textMuted }]}>
                  {formData.institution ? formData.institution : 'Select your Institution'}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 12 }]}>
                <Text style={styles.label}>Batch Year *</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="calendar-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 2024"
                    placeholderTextColor="#94A3B8"
                    keyboardType="number-pad"
                    maxLength={4}
                    value={formData.batchYear}
                    onChangeText={(text) => setFormData({ ...formData, batchYear: text })}
                  />
                </View>
              </View>

              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>Department *</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="school-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. CSE, ECE"
                    placeholderTextColor="#94A3B8"
                    value={formData.department}
                    onChangeText={(text) => setFormData({ ...formData, department: text })}
                  />
                </View>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Current Company</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="briefcase-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Google, Microsoft, Startup"
                  placeholderTextColor="#94A3B8"
                  value={formData.company}
                  onChangeText={(text) => setFormData({ ...formData, company: text })}
                />
              </View>
            </View>

             <View style={styles.inputContainer}>
               <Text style={styles.label}>Location</Text>
               <TouchableOpacity 
                 style={styles.inputWrapper} 
                 onPress={() => setLocModalVisible(true)}
                 activeOpacity={0.8}
               >
                 <Ionicons name="location-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                 <Text style={[styles.input, !formData.location && { color: theme.textMuted }]}>
                   {formData.location ? formData.location : 'Select Location'}
                 </Text>
                 <Ionicons name="chevron-down" size={18} color="#94A3B8" />
               </TouchableOpacity>
             </View>
          </View>

          <TouchableOpacity style={[styles.button, isUploading && { opacity: 0.7 }]} onPress={handleContinue} activeOpacity={0.8} disabled={isUploading}>
            <Text style={styles.buttonText}>{isUploading ? 'Saving...' : 'Save & Continue'}</Text>
            {!isUploading && <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Location Selection Modal */}
      <Modal visible={locModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setLocModalVisible(false)} />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Location</Text>
              <TouchableOpacity onPress={() => setLocModalVisible(false)}>
                <Ionicons name="close" size={24} color="#002144" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={locations}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalListItem,
                    formData.location === item.name && styles.selectedModalListItem
                  ]}
                  onPress={() => {
                    setFormData({ ...formData, location: item.name });
                    setLocModalVisible(false);
                  }}
                >
                  <Text style={[
                    styles.modalListItemText,
                    formData.location === item.name && styles.selectedModalListItemText
                  ]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Institution Selection Modal */}
      <Modal visible={instModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setInstModalVisible(false)} />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Institution</Text>
              <TouchableOpacity onPress={() => setInstModalVisible(false)}>
                <Ionicons name="close" size={24} color="#002144" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={institutions}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalListItem,
                    formData.institution === `${item.fullName} (${item.name})` && styles.selectedModalListItem
                  ]}
                  onPress={() => {
                    setFormData({ ...formData, institution: `${item.fullName} (${item.name})` });
                    setInstModalVisible(false);
                  }}
                >
                  <Text style={[
                    styles.modalListItemText,
                    formData.institution === `${item.fullName} (${item.name})` && styles.selectedModalListItemText
                  ]}>
                    {item.fullName} ({item.name})
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
    </SafeAreaView>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.card,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  progressContainer: {
    flexDirection: 'row',
    height: 4,
    gap: 8,
    marginBottom: 28,
  },
  progressStep: {
    flex: 1,
    height: '100%',
    borderRadius: 2,
    backgroundColor: theme.border,
  },
  stepActive: {
    backgroundColor: theme.primary,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.primary,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: theme.textSecondary,
    lineHeight: 22,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  avatarButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.background,
    borderWidth: 1.5,
    borderColor: theme.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLabel: {
    fontSize: 11,
    color: theme.textMuted,
    fontWeight: '600',
    marginTop: 4,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  form: {
    marginBottom: 28,
  },
  inputRow: {
    flexDirection: 'row',
  },
  inputContainer: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.background,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: theme.primary,
  },
  button: {
    backgroundColor: theme.primary,
    height: 52,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: theme.card,
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.primary,
  },
  modalListItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  selectedModalListItem: {
    backgroundColor: '#F0F9FF',
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  modalListItemText: {
    fontSize: 15,
    color: '#475569',
    fontWeight: '500',
  },
  selectedModalListItemText: {
    color: theme.primary,
    fontWeight: '700',
  },
});

export default ProfileSetupScreen;
