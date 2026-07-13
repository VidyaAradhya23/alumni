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
import { useTheme } from '../theme/ThemeContext';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

WebBrowser.maybeCompleteAuthSession();
const institutions = [
  'RV School', 'RV Girls High School', 'RV Public School', 'RV Learning Hub', 
  'SSMRV PU College', 'NMKRV PU College', 'RV PU College Jayanagar', 
  'RV PU College North', 'RV PU College South', 'RV PU College, E-City', 
  'RV PU College, Harohalli', 'RV PU College, Mysuru', 'RV College of Engineering', 
  'RV Institute of Technology and Management', 'RV-Skills', 'RV College of Architecture', 
  'RV Institute of Management', 'MKPM RV Institute of Legal Studies', 
  'RV Teachers College', 'D.A. Pandu Memorial RV Dental College', 
  'RV College of Physiotherapy', 'RV College of Nursing', 'NMKRV College', 
  'SSMRV College', 'RV University, Bengaluru Campus', 'RV University, Mysuru Campus'
];

const institutionDepartments = {
  'RV College of Engineering': [
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
  'RV Institute of Technology and Management': ["Computer Science & Engineering", "Information Science & Engineering", "Electronics & Communication Engineering", "Mechanical Engineering"],
  'RV PU College Jayanagar': ["Science (PCMB)", "Science (PCMC)", "Commerce (CEBA)", "Commerce (SEBA)"],
  'RV PU College North': ["Science (PCMB)", "Science (PCMC)", "Commerce (CEBA)", "Commerce (SEBA)"],
  'RV PU College South': ["Science (PCMB)", "Science (PCMC)", "Commerce (CEBA)", "Commerce (SEBA)"],
  'RV PU College, E-City': ["Science (PCMB)", "Science (PCMC)", "Commerce (CEBA)", "Commerce (SEBA)"],
  'RV PU College, Harohalli': ["Science (PCMB)", "Science (PCMC)", "Commerce (CEBA)", "Commerce (SEBA)"],
  'RV PU College, Mysuru': ["Science (PCMB)", "Science (PCMC)", "Commerce (CEBA)", "Commerce (SEBA)"],
  'RV Institute of Management': ["MBA", "Executive Education"],
  'RV University, Bengaluru Campus': ["School of Computer Science & Engineering", "School of Design", "School of Business", "School of Economics", "School of Liberal Arts & Sciences"],
  'RV University, Mysuru Campus': ["School of Computer Science & Engineering", "School of Design", "School of Business", "School of Economics", "School of Liberal Arts & Sciences"],
  'RV College of Architecture': ["Architecture (B.Arch)", "Architecture (M.Arch)", "Urban Design"],
  'MKPM RV Institute of Legal Studies': ["BA LLB", "BBA LLB", "LLB"],
  'D.A. Pandu Memorial RV Dental College': ["BDS", "MDS"],
  'RV College of Nursing': ["B.Sc Nursing", "M.Sc Nursing"],
  'RV College of Physiotherapy': ["BPT", "MPT"],
  'RV Teachers College': ["B.Ed", "M.Ed"],
  'SSMRV College': ["B.Com", "BBA", "BCA", "M.Com"],
  'NMKRV College': ["BA", "B.Sc", "B.Com", "BBA", "MA", "M.Sc"],
  'SSMRV PU College': ["Science (PCMB)", "Commerce (CEBA)"],
  'NMKRV PU College': ["Science (PCMB)", "Commerce (CEBA)"],
};

const defaultDepartments = ["General", "Other"];

const currentYear = new Date().getFullYear();
const batchYears = Array.from({ length: currentYear - 1963 + 1 }, (_, i) => (currentYear - i).toString());

const validatePasswordStrength = (password) => {
  if (password.length < 8) {
    return { valid: false, reason: 'Password must be at least 8 characters long.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, reason: 'Password must contain at least one uppercase letter.' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, reason: 'Password must contain at least one lowercase letter.' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, reason: 'Password must contain at least one number.' };
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, reason: 'Password must contain at least one special character.' };
  }
  return { valid: true };
};

const RegisterScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const styles = getStyles(theme);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    institution: '',
    branch: '',
    batchYear: '',
    joiningYear: ''
  });
  const [agreeEULA, setAgreeEULA] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(''); // 'institution', 'branch' or 'batch'

  const handleRegister = async () => {
    const { name, email, password, institution, branch, batchYear, joiningYear } = formData;
    if (!name || !email || !password || !institution || !branch || !batchYear || !joiningYear) {
      alert('Please fill in all fields');
      return;
    }

    const emailClean = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailClean)) {
      alert('Email address is not valid');
      return;
    }

    const pwdCheck = validatePasswordStrength(password);
    if (!pwdCheck.valid) {
      alert(pwdCheck.reason);
      return;
    }
    if (!agreeEULA) {
      alert('You must agree to the Terms of Service and End User License Agreement (EULA) to continue.');
      return;
    }

    setLoading(true);
    try {
      // Check if email already exists
      const { data: emailExists } = await supabase
        .rpc('check_email_exists', { email_to_check: emailClean });

      if (emailExists) {
        alert('This email has already been taken. Please use a different email or log in.');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: emailClean,
        password,
        options: {
          data: {
            name,
            institution,
            department: branch,
            batchYear,
            joiningYear
          }
        }
      });

      if (error) {
        throw error;
      }

      alert('Account created successfully! Check your email for verification.');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Registration error:', error);
      let errorMsg = 'Registration failed';
      if (error) {
        if (typeof error === 'string') {
          errorMsg = error;
        } else if (error.message && typeof error.message === 'string') {
          errorMsg = error.message;
          if (errorMsg.startsWith('{')) {
            try {
              const parsed = JSON.parse(errorMsg);
              errorMsg = parsed.message || parsed.error || errorMsg;
            } catch (e) {}
          }
        } else {
          try {
            const str = JSON.stringify(error);
            errorMsg = str === '{}' ? (error.toString() || 'Registration failed') : str;
          } catch (e) {
            errorMsg = error.toString() || 'Registration failed';
          }
        }
      }
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = (provider) => {
    alert(`OAuth signup for ${provider} requires Client IDs setup.`);
  };

  const handleLinkedInLogin = async () => {
    setLoading(true);
    try {
      const redirectUrl = Linking.createURL('oauth-callback');
      const stateObj = { redirectUrl };
      const state = encodeURIComponent(JSON.stringify(stateObj));
      
      const backendAuthUrl = 'http://localhost:5000/api/auth/linkedin/callback';
      const clientId = 'your_linkedin_client_id'; 
      const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(backendAuthUrl)}&state=${state}&scope=openid%20profile%20email`;

      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUrl);

      if (result.type === 'success' && result.url) {
        const parsed = Linking.parse(result.url);
        const { token, user } = parsed.queryParams;

        if (token && user) {
          const userInfo = JSON.parse(decodeURIComponent(user));
          userInfo.token = token;
          await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
          navigation.navigate('Main');
        } else {
          alert('LinkedIn login failed: Invalid response from server');
        }
      }
    } catch (error) {
      console.error('LinkedIn Login Error:', error);
      alert('LinkedIn Login Error: ' + error.message);
    } finally {
      setLoading(false);
    }
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
    } else if (modalType === 'joining') {
      setFormData({ ...formData, joiningYear: item });
    } else {
      setFormData({ ...formData, batchYear: item });
    }
    setModalVisible(false);
  };

  const isWeb = Platform.OS === 'web';
  const webContainerStyle = isWeb ? { alignSelf: 'center', width: '100%', maxWidth: 500, flex: 1 } : { flex: 1 };

  return (
    <SafeAreaView style={styles.container}>
      <View style={webContainerStyle}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else {
                navigation.navigate('Welcome');
              }
            }}
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
                <Text style={[styles.selectorText, !formData.institution && { color: theme.textMuted }]}>
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
                  <Text style={[styles.selectorText, !formData.branch && { color: theme.textMuted }]}>
                    {formData.branch || 'Select Dept'}
                  </Text>
                  <Text style={styles.arrow}>▼</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>Joining Yr</Text>
                <TouchableOpacity 
                  style={styles.selector} 
                  onPress={() => openPicker('joining')}
                >
                  <Text style={[styles.selectorText, !formData.joiningYear && { color: theme.textMuted }]}>
                    {formData.joiningYear || 'Year'}
                  </Text>
                  <Text style={styles.arrow}>▼</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>Grad Yr</Text>
                <TouchableOpacity 
                  style={styles.selector} 
                  onPress={() => openPicker('batch')}
                >
                  <Text style={[styles.selectorText, !formData.batchYear && { color: theme.textMuted }]}>
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
              style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}
              onPress={() => setAgreeEULA(!agreeEULA)}
              activeOpacity={0.8}
            >
              <View style={{ width: 24, height: 24, borderRadius: 6, borderWidth: 1, borderColor: '#FFD700', justifyContent: 'center', alignItems: 'center', marginRight: 10, backgroundColor: agreeEULA ? '#FFD700' : 'transparent' }}>
                {agreeEULA && <Ionicons name="checkmark" size={16} color={theme.primary} />}
              </View>
              <Text style={{ color: 'rgba(255, 255, 255, 0.9)', flex: 1, fontSize: 13, lineHeight: 18 }}>
                I agree to the Terms of Service and EULA. I understand there is zero tolerance for abusive users and objectionable content.
              </Text>
            </TouchableOpacity>

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
          
          <Text style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.6)', fontSize: 12, marginTop: 20, marginBottom: 40, paddingHorizontal: 20 }}>
            By registering, you confirm your agreement to our End User License Agreement.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select {modalType === 'institution' ? 'Institution' : modalType === 'branch' ? 'Department' : modalType === 'joining' ? 'Joining Year' : 'Graduation Year'}</Text>
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

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primary,
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
    color: theme.card,
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
    color: theme.card,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: theme.card,
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
    color: theme.card,
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
    color: theme.primary,
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
  linkedinButton: {
    backgroundColor: '#0A66C2',
    height: 52,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkedinIcon: {
    marginRight: 8,
  },
  linkedinButtonText: {
    color: theme.card,
    fontSize: 16,
    fontWeight: '700',
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
    backgroundColor: theme.card,
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
    color: theme.primary,
  },
  closeButton: {
    color: theme.primary,
    fontWeight: '600',
  },
  modalItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalItemText: {
    fontSize: 16,
    color: theme.text,
  }
});

export default RegisterScreen;
