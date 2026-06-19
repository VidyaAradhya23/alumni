import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  Modal,
  FlatList
} from 'react-native';
import api from '../services/api';

const institutions = [
  'RVCE', 'Institution', 'RVPU', 'RVIS', 'RVU', 'RVCA', 'RVIM', 'RVILS', 'DAPMRV', 'RVCN', 'RVCP', 'RVTC', 'RVTTI', 'NMKRV', 'SSMRV', 'RVPS', 'RVS', 'RVLH', 'Other'
];

const institutionDepartments = {
  'RVCE': [
    "Aerospace Engineering",
    "Artificial Intelligence and Machine Learning",
    "Biotechnology",
    "Chemical Engineering",
    "Civil Engineering",
    "Computer Science & Engineering",
    "Electrical & Electronics Engineering",
    "Electronics & Communication Engineering",
    "Electronics & Telecommunication Engineering",
    "Information Science & Engineering",
    "Industrial Engineering & Management",
    "Mechanical Engineering"
  ],
  'Institution': ["Computer Science & Engineering", "Information Science & Engineering", "Electronics & Communication Engineering", "Mechanical Engineering"],
  'RVPU': ["Science (PCMB)", "Science (PCMC)", "Commerce (CEBA)", "Commerce (SEBA)"],
  'RVIM': ["MBA", "Executive Education"],
  'RVU': ["School of Computer Science & Engineering", "School of Design", "School of Business", "School of Economics", "School of Liberal Arts & Sciences"],
  'RVCA': ["Architecture (B.Arch)", "Architecture (M.Arch)", "Urban Design"],
  'RVILS': ["BA LLB", "BBA LLB", "LLB"],
  'DAPMRV': ["BDS", "MDS"],
  'RVCN': ["B.Sc Nursing", "M.Sc Nursing"],
  'RVCP': ["BPT", "MPT"],
  'RVTC': ["B.Ed", "M.Ed"],
  'SSMRV': ["B.Com", "BBA", "BCA", "M.Com"],
  'NMKRV': ["BA", "B.Sc", "B.Com", "BBA", "MA", "M.Sc"],
  'Other': ["General", "Not Applicable"]
};

const defaultDepartments = ["General", "Other"];

const currentYear = new Date().getFullYear();
const batchYears = Array.from({ length: currentYear - 1963 + 1 }, (_, i) => (currentYear - i).toString());

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    institution: '',
    branch: '',
    batchYear: ''
  });
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(''); // 'institution', 'branch' or 'batch'

  const handleRegister = async () => {
    const { name, email, password, institution, branch, batchYear } = formData;
    if (!name || !email || !password || !institution || !branch || !batchYear) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', formData);
      alert('Account created successfully! Please sign in.');
      navigation.navigate('Login');
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = (provider) => {
    alert(`OAuth signup for ${provider} requires Client IDs setup.`);
  };

  const openPicker = (type) => {
    setModalType(type);
    setModalVisible(true);
  };

  const selectItem = (item) => {
    if (modalType === 'institution') {
      setFormData({ ...formData, institution: item, branch: '' });
    } else if (modalType === 'branch') {
      setFormData({ ...formData, branch: item });
    } else {
      setFormData({ ...formData, batchYear: item });
    }
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Join Network</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput 
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="#94A3B8"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput 
                style={styles.input}
                placeholder="college or personal email"
                placeholderTextColor="#94A3B8"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Institution</Text>
              <TouchableOpacity 
                style={styles.selector} 
                onPress={() => openPicker('institution')}
              >
                <Text style={[styles.selectorText, !formData.institution && { color: '#94A3B8' }]}>
                  {formData.institution || 'Select Institution'}
                </Text>
                <Text style={styles.arrow}>▼</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, { flex: 1.5, marginRight: 10 }]}>
                <Text style={styles.label}>Department</Text>
                <TouchableOpacity 
                  style={[styles.selector, !formData.institution && { opacity: 0.6 }]} 
                  onPress={() => {
                    if (!formData.institution) {
                      alert('Please select an institution first');
                      return;
                    }
                    openPicker('branch');
                  }}
                >
                  <Text style={[styles.selectorText, !formData.branch && { color: '#94A3B8' }]}>
                    {formData.branch || 'Select Dept'}
                  </Text>
                  <Text style={styles.arrow}>▼</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>Batch</Text>
                <TouchableOpacity 
                  style={styles.selector} 
                  onPress={() => openPicker('batch')}
                >
                  <Text style={[styles.selectorText, !formData.batchYear && { color: '#94A3B8' }]}>
                    {formData.batchYear || 'Year'}
                  </Text>
                  <Text style={styles.arrow}>▼</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput 
                style={styles.input}
                placeholder="Create a strong password"
                placeholderTextColor="#94A3B8"
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
                secureTextEntry
              />
            </View>

            <TouchableOpacity 
              style={[styles.primaryButton, loading && { opacity: 0.7 }]} 
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.primaryButtonText}>{loading ? 'Creating Account...' : 'Create Account'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.signupText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select {modalType === 'institution' ? 'Institution' : modalType === 'branch' ? 'Department' : 'Batch'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>Close</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={
                modalType === 'institution' 
                  ? institutions 
                  : modalType === 'branch' 
                    ? (institutionDepartments[formData.institution] || defaultDepartments) 
                    : batchYears
              }
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.modalItem}
                  onPress={() => selectItem(item)}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#002144',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  backButton: {
    marginTop: 20,
    marginBottom: 20,
  },
  backButtonText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  form: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#FFFFFF',
  },
  selector: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectorText: {
    fontSize: 15,
    color: '#FFFFFF',
  },
  arrow: {
    color: '#FFD700',
    fontSize: 12,
  },
  primaryButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#002144',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dividerText: {
    marginHorizontal: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 20,
  },
  socialIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
    marginBottom: 40,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  signupText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '70%',
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#002144',
  },
  closeButton: {
    color: '#002144',
    fontWeight: '600',
  },
  modalItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalItemText: {
    fontSize: 16,
    color: '#334155',
  }
});

export default RegisterScreen;
