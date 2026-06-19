import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, StatusBar, Modal, Image, TextInput, useWindowDimensions, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Seed Data for Profile Campus Info Tab
const INSTITUTIONS = [
  { id: '1', name: 'RV College of Engineering', shortName: 'RVCE', location: 'Bengaluru, Karnataka', established: 1963, totalAlumni: 9755, registeredUsers: 3420, admins: 5, status: 'Active', color: '#003366' },
  { id: '2', name: 'Institute of Technology', shortName: 'Institution', location: 'Bengaluru, Karnataka', established: 2019, totalAlumni: 4230, registeredUsers: 1580, admins: 3, status: 'Active', color: '#1E3A5F' },
  { id: '3', name: 'RV PU College', shortName: 'RVPU', location: 'Bengaluru, Karnataka', established: 1970, totalAlumni: 6800, registeredUsers: 890, admins: 2, status: 'Active', color: '#7C3AED' },
  { id: '4', name: 'RV International School', shortName: 'RVIS', location: 'Bengaluru, Karnataka', established: 1999, totalAlumni: 2100, registeredUsers: 560, admins: 2, status: 'Active', color: '#059669' },
  { id: '5', name: 'RV University', shortName: 'RVU', location: 'Bengaluru, Karnataka', established: 2021, totalAlumni: 1200, registeredUsers: 450, admins: 3, status: 'Active', color: '#B45309' },
  { id: '6', name: 'RV College of Architecture', shortName: 'RVCA', location: 'Bengaluru, Karnataka', established: 1992, totalAlumni: 2800, registeredUsers: 980, admins: 2, status: 'Active', color: '#4F46E5' },
  { id: '7', name: 'RV Institute of Management', shortName: 'RVIM', location: 'Bengaluru, Karnataka', established: 1999, totalAlumni: 3500, registeredUsers: 1240, admins: 3, status: 'Active', color: '#0891B2' },
  { id: '8', name: 'RV Institute of Legal Studies', shortName: 'RVILS', location: 'Bengaluru, Karnataka', established: 2018, totalAlumni: 950, registeredUsers: 380, admins: 2, status: 'Active', color: '#DC2626' },
  { id: '9', name: 'DAPM RV Dental College', shortName: 'DAPMRV', location: 'Bengaluru, Karnataka', established: 1992, totalAlumni: 2400, registeredUsers: 870, admins: 2, status: 'Active', color: '#2563EB' },
  { id: '10', name: 'RV College of Nursing', shortName: 'RVCN', location: 'Bengaluru, Karnataka', established: 2003, totalAlumni: 1500, registeredUsers: 490, admins: 2, status: 'Active', color: '#0D9488' },
  { id: '11', name: 'RV College of Physiotherapy', shortName: 'RVCP', location: 'Bengaluru, Karnataka', established: 2003, totalAlumni: 1700, registeredUsers: 580, admins: 2, status: 'Active', color: '#BE185D' },
  { id: '12', name: 'RV Teachers College', shortName: 'RVTC', location: 'Bengaluru, Karnataka', established: 1954, totalAlumni: 3200, registeredUsers: 640, admins: 2, status: 'Active', color: '#8B5CF6' },
  { id: '13', name: 'RV Teachers Training Institute', shortName: 'RVTTI', location: 'Bengaluru, Karnataka', established: 1940, totalAlumni: 4000, registeredUsers: 510, admins: 1, status: 'Active', color: '#10B981' },
  { id: '14', name: 'NMKRV College for Women', shortName: 'NMKRV', location: 'Bengaluru, Karnataka', established: 1973, totalAlumni: 8900, registeredUsers: 2100, admins: 4, status: 'Active', color: '#EC4899' },
  { id: '15', name: 'SSMRV College', shortName: 'SSMRV', location: 'Bengaluru, Karnataka', established: 1982, totalAlumni: 7200, registeredUsers: 1840, admins: 3, status: 'Active', color: '#3B82F6' },
  { id: '16', name: 'RV Public School', shortName: 'RVPS', location: 'Bengaluru, Karnataka', established: 1992, totalAlumni: 1900, registeredUsers: 420, admins: 1, status: 'Active', color: '#6B7280' },
  { id: '17', name: 'RV School', shortName: 'RVS', location: 'Bengaluru, Karnataka', established: 1940, totalAlumni: 5400, registeredUsers: 750, admins: 2, status: 'Active', color: '#78350F' },
  { id: '18', name: 'RV Learning Hub', shortName: 'RVLH', location: 'Bengaluru, Karnataka', established: 2020, totalAlumni: 800, registeredUsers: 210, admins: 1, status: 'Active', color: '#111827' }
];

const INITIAL_ADMINS = [
  { id: '1', name: 'Dr. Ramesh Kumar', email: 'admin@rvce.edu', password: 'admin123', institution: 'RVCE', role: 'Admin', status: 'Active', lastLogin: '17/06/2026 09:30 AM', passwordChangedAt: '15/06/2026' },
  { id: '2', name: 'Prof. Anitha Shetty', email: 'anitha.s@rvce.edu', password: 'anitha@2026', institution: 'RVCE', role: 'Admin', status: 'Active', lastLogin: '16/06/2026 02:15 PM', passwordChangedAt: '10/06/2026' },
  { id: '3', name: 'Suresh Babu', email: 'admin@institution.edu', password: 'admin456', institution: 'Institution', role: 'Admin', status: 'Active', lastLogin: '17/06/2026 11:00 AM', passwordChangedAt: '12/06/2026' },
  { id: '4', name: 'Meera Nair', email: 'admin@rvpu.edu', password: 'admin789', institution: 'RVPU', role: 'Admin', status: 'Active', lastLogin: '14/06/2026 04:45 PM', passwordChangedAt: '01/06/2026' },
  { id: '5', name: 'Vikram Joshi', email: 'admin@rvis.edu', password: 'admin012', institution: 'RVIS', status: 'Inactive', lastLogin: '10/06/2026 10:00 AM', passwordChangedAt: '05/05/2026' },
];

const INITIAL_PLACEMENTS = [
  { id: '1', company: 'Cisco Systems', industry: 'Computer Networking', count: 78, institution: 'RVCE' },
  { id: '2', company: 'Accenture', industry: 'IT Services', count: 62, institution: 'RVCE' },
  { id: '3', company: 'Qualcomm', industry: 'Semiconductors', count: 61, institution: 'RVCE' },
  { id: '4', company: 'Infosys', industry: 'IT Services', count: 45, institution: 'Institution' },
  { id: '5', company: 'Wipro', industry: 'IT Services', count: 38, institution: 'Institution' },
  { id: '6', company: 'TCS', industry: 'IT Services', count: 32, institution: 'RVPU' },
  { id: '7', company: 'IBM', industry: 'IT Services', count: 28, institution: 'RVCE' },
  { id: '8', company: 'Amazon', industry: 'E-Commerce/Tech', count: 25, institution: 'RVIS' },
];

const INITIAL_NETWORK_SETTINGS = {
  'RVCE': { institutionName: 'RV College of Engineering', shortTitle: 'RVCE', website: 'https://rvce.edu.in', established: '1963', location: 'Bengaluru, Karnataka', primaryColor: '#003366', secondaryColor: '#00a99c', alumniText: 'Alumni', studentsText: 'Students', facultyText: 'Faculty', batchmatesText: 'Batchmates', manualApproval: true, emailVouching: false, allowUnverified: true, displayJobs: true, displayEvents: true, displayGroups: true, displayMemories: true, displayDonations: false, displayMentorship: true, displayAlumniCard: false, welcomeEmailEnabled: true, whatsappEnabled: false },
  'Institution': { institutionName: 'Institute of Technology', shortTitle: 'Institution', website: 'https://institution.edu.in', established: '2019', location: 'Bengaluru, Karnataka', primaryColor: '#1a5276', secondaryColor: '#2ecc71', alumniText: 'Alumni', studentsText: 'Students', facultyText: 'Faculty', batchmatesText: 'Classmates', manualApproval: true, emailVouching: true, allowUnverified: false, displayJobs: true, displayEvents: true, displayGroups: false, displayMemories: true, displayDonations: true, displayMentorship: true, displayAlumniCard: true, welcomeEmailEnabled: true, whatsappEnabled: true },
  'RVPU': { institutionName: 'RV PU College', shortTitle: 'RVPU', website: 'https://rvpucollege.edu.in', established: '1970', location: 'Bengaluru, Karnataka', primaryColor: '#8e44ad', secondaryColor: '#e74c3c', alumniText: 'Alumni', studentsText: 'Students', facultyText: 'Teachers', batchmatesText: 'Batchmates', manualApproval: false, emailVouching: false, allowUnverified: true, displayJobs: false, displayEvents: true, displayGroups: true, displayMemories: true, displayDonations: false, displayMentorship: false, displayAlumniCard: false, welcomeEmailEnabled: false, whatsappEnabled: false },
  'RVIS': { institutionName: 'RV International School', shortTitle: 'RVIS', website: 'https://rvis.edu.in', established: '1999', location: 'Bengaluru, Karnataka', primaryColor: '#e67e22', secondaryColor: '#f39c12', alumniText: 'Alumni', studentsText: 'Students', facultyText: 'Teachers', batchmatesText: 'Schoolmates', manualApproval: true, emailVouching: false, allowUnverified: false, displayJobs: false, displayEvents: true, displayGroups: true, displayMemories: true, displayDonations: true, displayMentorship: false, displayAlumniCard: true, welcomeEmailEnabled: true, whatsappEnabled: false },
  'RVU': { institutionName: 'RV University', shortTitle: 'RVU', website: 'https://rvu.edu.in', established: '2021', location: 'Bengaluru, Karnataka', primaryColor: '#B45309', secondaryColor: '#F59E0B', alumniText: 'Alumni', studentsText: 'Students', facultyText: 'Faculty', batchmatesText: 'Classmates', manualApproval: true, emailVouching: true, allowUnverified: true, displayJobs: true, displayEvents: true, displayGroups: true, displayMemories: true, displayDonations: true, displayMentorship: true, displayAlumniCard: true, welcomeEmailEnabled: true, whatsappEnabled: true },
  'RVCA': { institutionName: 'RV College of Architecture', shortTitle: 'RVCA', website: 'https://rvca.edu.in', established: '1992', location: 'Bengaluru, Karnataka', primaryColor: '#4F46E5', secondaryColor: '#818CF8', alumniText: 'Alumni', studentsText: 'Students', facultyText: 'Faculty', batchmatesText: 'Batchmates', manualApproval: true, emailVouching: false, allowUnverified: true, displayJobs: true, displayEvents: true, displayGroups: true, displayMemories: true, displayDonations: false, displayMentorship: true, displayAlumniCard: false, welcomeEmailEnabled: true, whatsappEnabled: false },
  'RVIM': { institutionName: 'RV Institute of Management', shortTitle: 'RVIM', website: 'https://rvim.edu.in', established: '1999', location: 'Bengaluru, Karnataka', primaryColor: '#0891B2', secondaryColor: '#22D3EE', alumniText: 'Alumni', studentsText: 'Students', facultyText: 'Faculty', batchmatesText: 'Classmates', manualApproval: true, emailVouching: false, allowUnverified: true, displayJobs: true, displayEvents: true, displayGroups: true, displayMemories: true, displayDonations: true, displayMentorship: true, displayAlumniCard: true, welcomeEmailEnabled: true, whatsappEnabled: false },
  'RVILS': { institutionName: 'RV Institute of Legal Studies', shortTitle: 'RVILS', website: 'https://rvils.edu.in', established: '2018', location: 'Bengaluru, Karnataka', primaryColor: '#DC2626', secondaryColor: '#F87171', alumniText: 'Alumni', studentsText: 'Students', facultyText: 'Faculty', batchmatesText: 'Batchmates', manualApproval: true, emailVouching: false, allowUnverified: false, displayJobs: true, displayEvents: true, displayGroups: false, displayMemories: true, displayDonations: false, displayMentorship: true, displayAlumniCard: false, welcomeEmailEnabled: true, whatsappEnabled: false },
  'DAPMRV': { institutionName: 'DAPM RV Dental College', shortTitle: 'DAPMRV', website: 'https://rvdentalcollege.org', established: '1992', location: 'Bengaluru, Karnataka', primaryColor: '#2563EB', secondaryColor: '#60A5FA', alumniText: 'Alumni', studentsText: 'Students', facultyText: 'Faculty', batchmatesText: 'Batchmates', manualApproval: true, emailVouching: false, allowUnverified: true, displayJobs: true, displayEvents: true, displayGroups: true, displayMemories: true, displayDonations: false, displayMentorship: true, displayAlumniCard: false, welcomeEmailEnabled: true, whatsappEnabled: false },
  'RVCN': { institutionName: 'RV College of Nursing', shortTitle: 'RVCN', website: 'https://rvnursing.edu.in', established: '2003', location: 'Bengaluru, Karnataka', primaryColor: '#0D9488', secondaryColor: '#2DD4BF', alumniText: 'Alumni', studentsText: 'Students', facultyText: 'Faculty', batchmatesText: 'Batchmates', manualApproval: true, emailVouching: false, allowUnverified: true, displayJobs: true, displayEvents: true, displayGroups: false, displayMemories: true, displayDonations: false, displayMentorship: true, displayAlumniCard: false, welcomeEmailEnabled: true, whatsappEnabled: false },
  'RVCP': { institutionName: 'RV College of Physiotherapy', shortTitle: 'RVCP', website: 'https://rvphysiotherapy.edu.in', established: '2003', location: 'Bengaluru, Karnataka', primaryColor: '#BE185D', secondaryColor: '#F472B6', alumniText: 'Alumni', studentsText: 'Students', facultyText: 'Faculty', batchmatesText: 'Batchmates', manualApproval: true, emailVouching: false, allowUnverified: true, displayJobs: true, displayEvents: true, displayGroups: false, displayMemories: true, displayDonations: false, displayMentorship: true, displayAlumniCard: false, welcomeEmailEnabled: true, whatsappEnabled: false },
  'RVTC': { institutionName: 'RV Teachers College', shortTitle: 'RVTC', website: 'https://rvtc.edu.in', established: '1954', location: 'Bengaluru, Karnataka', primaryColor: '#8B5CF6', secondaryColor: '#A78BFA', alumniText: 'Alumni', studentsText: 'Students', facultyText: 'Faculty', batchmatesText: 'Batchmates', manualApproval: true, emailVouching: false, allowUnverified: true, displayJobs: false, displayEvents: true, displayGroups: true, displayMemories: true, displayDonations: false, displayMentorship: false, displayAlumniCard: false, welcomeEmailEnabled: true, whatsappEnabled: false },
  'RVTTI': { institutionName: 'RV Teachers Training Institute', shortTitle: 'RVTTI', website: 'https://rvtti.edu.in', established: '1940', location: 'Bengaluru, Karnataka', primaryColor: '#10B981', secondaryColor: '#34D399', alumniText: 'Alumni', studentsText: 'Students', facultyText: 'Faculty', batchmatesText: 'Batchmates', manualApproval: true, emailVouching: false, allowUnverified: true, displayJobs: false, displayEvents: true, displayGroups: true, displayMemories: true, displayDonations: false, displayMentorship: false, displayAlumniCard: false, welcomeEmailEnabled: true, whatsappEnabled: false },
  'NMKRV': { institutionName: 'NMKRV College for Women', shortTitle: 'NMKRV', website: 'https://nmkrv.edu.in', established: '1973', location: 'Bengaluru, Karnataka', primaryColor: '#EC4899', secondaryColor: '#F472B6', alumniText: 'Alumni', studentsText: 'Students', facultyText: 'Faculty', batchmatesText: 'Batchmates', manualApproval: true, emailVouching: false, allowUnverified: true, displayJobs: true, displayEvents: true, displayGroups: true, displayMemories: true, displayDonations: false, displayMentorship: true, displayAlumniCard: false, welcomeEmailEnabled: true, whatsappEnabled: false },
  'SSMRV': { institutionName: 'SSMRV College', shortTitle: 'SSMRV', website: 'https://ssmrv.edu.in', established: '1982', location: 'Bengaluru, Karnataka', primaryColor: '#3B82F6', secondaryColor: '#60A5FA', alumniText: 'Alumni', studentsText: 'Students', facultyText: 'Faculty', batchmatesText: 'Batchmates', manualApproval: true, emailVouching: false, allowUnverified: true, displayJobs: true, displayEvents: true, displayGroups: true, displayMemories: true, displayDonations: false, displayMentorship: true, displayAlumniCard: false, welcomeEmailEnabled: true, whatsappEnabled: false },
  'RVPS': { institutionName: 'RV Public School', shortTitle: 'RVPS', website: 'https://rvps.edu.in', established: '1992', location: 'Bengaluru, Karnataka', primaryColor: '#6B7280', secondaryColor: '#9CA3AF', alumniText: 'Alumni', studentsText: 'Students', facultyText: 'Teachers', batchmatesText: 'Schoolmates', manualApproval: true, emailVouching: false, allowUnverified: false, displayJobs: false, displayEvents: true, displayGroups: true, displayMemories: true, displayDonations: false, displayMentorship: false, displayAlumniCard: false, welcomeEmailEnabled: true, whatsappEnabled: false },
  'RVS': { institutionName: 'RV School', shortTitle: 'RVS', website: 'https://rvschool.edu.in', established: '1940', location: 'Bengaluru, Karnataka', primaryColor: '#78350F', secondaryColor: '#D97706', alumniText: 'Alumni', studentsText: 'Students', facultyText: 'Teachers', batchmatesText: 'Schoolmates', manualApproval: true, emailVouching: false, allowUnverified: false, displayJobs: false, displayEvents: true, displayGroups: true, displayMemories: true, displayDonations: false, displayMentorship: false, displayAlumniCard: true, welcomeEmailEnabled: true, whatsappEnabled: false },
  'RVLH': { institutionName: 'RV Learning Hub', shortTitle: 'RVLH', website: 'https://rvlearninghub.com', established: '2020', location: 'Bengaluru, Karnataka', primaryColor: '#111827', secondaryColor: '#374151', alumniText: 'Alumni', studentsText: 'Students', facultyText: 'Teachers', batchmatesText: 'Batchmates', manualApproval: true, emailVouching: false, allowUnverified: false, displayJobs: false, displayEvents: true, displayGroups: true, displayMemories: true, displayDonations: false, displayMentorship: false, displayAlumniCard: false, welcomeEmailEnabled: true, whatsappEnabled: false },
};

const AdminProfileScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' | 'campus' | 'admin'
  const [userInfo, setUserInfo] = useState(null);
  const [listModalType, setListModalType] = useState(null);
  const [userRole, setUserRole] = useState('admin');
  const [activeInst, setActiveInst] = useState('RVCE');
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [settingsSubView, setSettingsSubView] = useState('menu');

  const [profileData, setProfileData] = useState({
    name: 'Institution Admin',
    username: '@institution_admin',
    bio: 'Official Admin • Institution Alumni Network • Managing institutional connections & opportunities.',
    branch: 'Administration',
    batch: '2024',
    posts: 48,
    followers: 1248,
    following: 56,
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const info = await AsyncStorage.getItem('userInfo');
        if (info) {
          const parsed = JSON.parse(info);
          setUserRole(parsed.role || 'admin');

          const defaultInst = parsed.role === 'superadmin' 
            ? (global.selectedInstitution && global.selectedInstitution !== 'All' ? global.selectedInstitution : 'RVCE')
            : (parsed.email && parsed.email.toLowerCase().includes('rvce') ? 'RVCE' 
              : parsed.email && parsed.email.toLowerCase().includes('institution') ? 'Institution' 
              : parsed.email && parsed.email.toLowerCase().includes('rvpu') ? 'RVPU' 
              : parsed.email && parsed.email.toLowerCase().includes('rvis') ? 'RVIS' 
              : 'Institution');
          setActiveInst(defaultInst);

          if (parsed.role === 'superadmin') {
            setProfileData({
              name: parsed.name || 'Super Admin',
              username: '@superadmin',
              bio: 'Global controls governance account • Managing all institutions, admins & system settings.',
              branch: 'Global System Admin',
              batch: '2026',
              posts: 120,
              followers: 15420,
              following: 12,
            });
          } else {
            setProfileData({
              name: parsed.name || 'Institution Admin',
              username: parsed.email ? `@${parsed.email.split('@')[0]}` : '@institution_admin',
              bio: `Official Admin • ${parsed.name || 'Institution'} Alumni Network • Managing institutional connections & opportunities.`,
              branch: 'Administration',
              batch: '2024',
              posts: 48,
              followers: 1248,
              following: 56,
            });
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadProfile();
  }, []);

  const posts = [
    { id: '1', uri: 'https://images.unsplash.com/photo-1523050854058-8df90110c476?auto=format&fit=crop&w=300&h=300&q=80' },
    { id: '2', uri: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=300&h=300&q=80' },
    { id: '3', uri: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=300&h=300&q=80' },
    { id: '4', uri: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=300&h=300&q=80' },
    { id: '5', uri: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=300&h=300&q=80' },
    { id: '6', uri: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=300&h=300&q=80' },
  ];

  const mockReshares = [
    { id: 'r1', user: 'Priya Sharma', content: 'Institution ranked among top 50 engineering colleges in India! Proud to be an alumnus 🎓', date: '2 days ago' },
    { id: 'r2', user: 'Rahul Verma', content: 'Great placement season results for Institution 2026 batch!', date: '5 days ago' },
  ];

  const mockSaved = [
    { id: 's1', uri: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=300&h=300&q=80' },
    { id: 's2', uri: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=300&h=300&q=80' },
    { id: 's3', uri: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=300&h=300&q=80' },
  ];

  const mockTags = [
    { id: 't1', uri: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=300&h=300&q=80' },
    { id: 't2', uri: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=300&h=300&q=80' },
  ];

  const mockConnections = [
    { id: '1', name: 'Priya Sharma', username: 'priya.s', avatar: 'PS' },
    { id: '2', name: 'Rahul Verma', username: 'rahul_v', avatar: 'RV' },
    { id: '3', name: 'Sneha Patel', username: 'sneha.p', avatar: 'SP' },
    { id: '4', name: 'Arjun Reddy', username: 'arjun.r', avatar: 'AR' },
    { id: '5', name: 'Kavitha Nair', username: 'kavitha.n', avatar: 'KN' },
  ];

  const handleLogout = () => {
    const performLogout = async () => {
      try {
        await AsyncStorage.removeItem('userInfo');
      } catch (error) {
        console.error('Failed to clear user session', error);
      }
      if (navigation) {
        const parentNav = navigation.getParent() || navigation;
        parentNav.reset({ index: 0, routes: [{ name: 'AdminLogin' }] });
      }
    };

    if (Platform.OS === 'web') {
      const confirmLogout = window.confirm('Are you sure you want to logout?');
      if (confirmLogout) {
        performLogout();
      }
    } else {
      Alert.alert('Logout', 'Are you sure you want to logout?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: performLogout },
      ]);
    }
  };

  const renderInstitutionDetails = () => {
    const instDetails = INSTITUTIONS.find(i => i.shortName === activeInst);
    const instAdminsList = INITIAL_ADMINS.filter(a => a.institution === activeInst);
    const instPlacementsList = INITIAL_PLACEMENTS.filter(p => p.institution === activeInst);
    const instSettings = INITIAL_NETWORK_SETTINGS[activeInst] || {};

    return (
      <View style={{ gap: 16 }}>
        {userRole === 'superadmin' && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.miniSelectorScrollContent}
            style={styles.miniSelectorContainer}
          >
            {INSTITUTIONS.map((i) => i.shortName).map((inst) => (
              <TouchableOpacity
                key={inst}
                style={[
                  styles.miniSelectorChip,
                  activeInst === inst && styles.miniSelectorChipActive
                ]}
                onPress={() => setActiveInst(inst)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.miniSelectorChipText,
                  activeInst === inst && styles.miniSelectorChipTextActive
                ]}>
                  {inst}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* General Info Card */}
        <View style={styles.detailsCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={styles.detailsCardHeaderTitle}>{instDetails?.name || activeInst}</Text>
            <View style={[styles.statusTag, instDetails?.status === 'Active' ? styles.statusActive : styles.statusPending]}>
              <Text style={instDetails?.status === 'Active' ? styles.statusActiveText : styles.statusPendingText}>
                {instDetails?.status || 'Active'}
              </Text>
            </View>
          </View>
          
          <View style={styles.detailsDivider} />

          <View style={styles.detailsInfoRow}>
            <Ionicons name="location-outline" size={16} color="#64748B" style={{ marginRight: 6 }} />
            <Text style={styles.detailsInfoText}>Location: {instDetails?.location || 'Bengaluru, Karnataka'}</Text>
          </View>
          <View style={styles.detailsInfoRow}>
            <Ionicons name="calendar-outline" size={16} color="#64748B" style={{ marginRight: 6 }} />
            <Text style={styles.detailsInfoText}>Established: {instDetails?.established || 'N/A'}</Text>
          </View>
          {instSettings.website && (
            <TouchableOpacity 
              style={styles.detailsLinkRow}
              onPress={() => Alert.alert('Website Link', `Opening ${instSettings.website}`)}
            >
              <Ionicons name="globe-outline" size={16} color="#003366" style={{ marginRight: 6 }} />
              <Text style={styles.detailsLinkText}>{instSettings.website}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Feature Status Cards */}
        <View style={styles.detailsCard}>
          <Text style={styles.detailsSectionHeader}>Feature Settings Overview</Text>
          <View style={styles.featuresGrid}>
            <View style={styles.featureItem}>
              <Ionicons 
                name={instSettings.displayJobs ? "checkmark-circle" : "close-circle"} 
                size={18} 
                color={instSettings.displayJobs ? "#10B981" : "#EF4444"} 
              />
              <Text style={styles.featureItemText}>Jobs Board</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons 
                name={instSettings.displayEvents ? "checkmark-circle" : "close-circle"} 
                size={18} 
                color={instSettings.displayEvents ? "#10B981" : "#EF4444"} 
              />
              <Text style={styles.featureItemText}>Events</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons 
                name={instSettings.displayGroups ? "checkmark-circle" : "close-circle"} 
                size={18} 
                color={instSettings.displayGroups ? "#10B981" : "#EF4444"} 
              />
              <Text style={styles.featureItemText}>Groups</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons 
                name={instSettings.displayMemories ? "checkmark-circle" : "close-circle"} 
                size={18} 
                color={instSettings.displayMemories ? "#10B981" : "#EF4444"} 
              />
              <Text style={styles.featureItemText}>Timeline</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons 
                name={instSettings.displayDonations ? "checkmark-circle" : "close-circle"} 
                size={18} 
                color={instSettings.displayDonations ? "#10B981" : "#EF4444"} 
              />
              <Text style={styles.featureItemText}>Donations</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons 
                name={instSettings.displayMentorship ? "checkmark-circle" : "close-circle"} 
                size={18} 
                color={instSettings.displayMentorship ? "#10B981" : "#EF4444"} 
              />
              <Text style={styles.featureItemText}>Mentorship</Text>
            </View>
          </View>
        </View>

        {/* Administrators List */}
        <View style={styles.detailsCard}>
          <Text style={styles.detailsSectionHeader}>Administrators ({instAdminsList.length})</Text>
          {instAdminsList.length > 0 ? (
            instAdminsList.map(a => (
              <View key={a.id} style={styles.adminListRow}>
                <View style={styles.adminInfoCol}>
                  <Text style={styles.adminNameText}>{a.name}</Text>
                  <Text style={styles.adminEmailText}>{a.email}</Text>
                </View>
                <View style={[styles.statusTagMini, a.status === 'Active' ? styles.statusActive : styles.statusInactive]}>
                  <Text style={styles.statusTagMiniText}>{a.status}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyDetailsText}>No administrators registered.</Text>
          )}
        </View>

        {/* Placement Tool Data */}
        <View style={styles.detailsCard}>
          <Text style={styles.detailsSectionHeader}>Hiring Partners & Placements</Text>
          {instPlacementsList.length > 0 ? (
            instPlacementsList.map(p => (
              <View key={p.id} style={styles.placementListRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.placementCompanyText}>{p.company}</Text>
                  <Text style={styles.placementIndustryText}>{p.industry}</Text>
                </View>
                <View style={styles.placementCountBadge}>
                  <Text style={styles.placementCountText}>{p.count} Alumni</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyDetailsText}>No placement data available.</Text>
          )}
        </View>
      </View>
    );
  };

  // ===== SETTINGS MODAL =====
  // Handled inline in the main render statement below.

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation && navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerUsername}>{profileData.username}</Text>
          <Ionicons name="chevron-down" size={16} color="#0F172A" />
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => setSettingsVisible(true)}>
            <Ionicons name="menu-outline" size={24} color="#0F172A" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileInfoContainer}>
          {/* Avatar + Stats Row */}
          <View style={styles.mainInfoRow}>
            <View style={styles.avatarCircle}>
              <Ionicons name="shield-checkmark" size={32} color="#003366" />
            </View>
            <View style={styles.statsContainer}>
              <TouchableOpacity style={styles.statBox} onPress={() => setActiveTab('post')} activeOpacity={0.7}>
                <Text style={styles.statNumber}>{profileData.posts}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.statBox} onPress={() => setListModalType('connections')} activeOpacity={0.7}>
                <Text style={styles.statNumber}>{profileData.followers}</Text>
                <Text style={styles.statLabel}>Connections</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.statBox} onPress={() => setListModalType('following')} activeOpacity={0.7}>
                <Text style={styles.statNumber}>{profileData.following}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bio */}
          <View style={styles.bioContainer}>
            <Text style={styles.nameText}>{profileData.name}</Text>
            <Text style={styles.occupationText}>{profileData.branch}</Text>
            <Text style={styles.bioText}>{profileData.bio}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.actionButton} onPress={() => { setSettingsSubView('profile_edit'); setSettingsVisible(true); }} activeOpacity={0.7}>
              <Text style={styles.actionButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
              <Text style={styles.actionButtonText}>Share Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallIconBtn} onPress={handleLogout} activeOpacity={0.7}>
              <Ionicons name="log-out-outline" size={18} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          {[
            { key: 'post', icon: 'grid', label: 'Posts' },
            { key: 'reshare', icon: 'repeat', label: 'Reshares' },
            { key: 'tags', icon: 'pricetag', label: 'Tags' },
            { key: 'institution', icon: 'business', label: 'Campus' },
          ].map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabButton, activeTab === tab.key && styles.activeTabButton]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}
            >
              <Ionicons name={activeTab === tab.key ? tab.icon : `${tab.icon}-outline`} size={20} color={activeTab === tab.key ? '#003366' : '#94A3B8'} />
              <Text style={[styles.tabLabel, activeTab === tab.key && styles.activeTabLabel]}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {activeTab === 'post' && (
          <View style={styles.postsGrid}>
            {posts.map((post) => (
              <TouchableOpacity key={post.id} style={[styles.gridItem, { width: width / 3, height: width / 3 }]} activeOpacity={0.9}>
                <Image source={{ uri: post.uri }} style={styles.gridImage} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {activeTab === 'tags' && (
          <View style={styles.postsGrid}>
            {mockTags.map((tag) => (
              <TouchableOpacity key={tag.id} style={[styles.gridItem, { width: width / 3, height: width / 3 }]} activeOpacity={0.9}>
                <Image source={{ uri: tag.uri }} style={styles.gridImage} />
                <View style={styles.tagOverlay}>
                  <Ionicons name="person" size={16} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {activeTab === 'reshare' && (
          <View style={styles.tabContentList}>
            {mockReshares.map(res => (
              <View key={res.id} style={styles.listCard}>
                <View style={styles.cardHeader}>
                  <Ionicons name="repeat" size={18} color="#003366" style={{ marginRight: 8 }} />
                  <Text style={styles.cardTitle}>Reshared from {res.user}</Text>
                </View>
                <Text style={styles.cardBodyText}>&quot;{res.content}&quot;</Text>
                <Text style={styles.cardFooterText}>{res.date}</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'institution' && (
          <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
            {renderInstitutionDetails()}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Connections / Following Modal */}
      <Modal visible={!!listModalType} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setListModalType(null)} />
          <View style={[styles.modalContent, { height: '90%' }]}>
            <View style={styles.modalHeader}>
              <View style={{ width: 24 }} />
              <Text style={styles.modalTitle}>{profileData.username}</Text>
              <TouchableOpacity onPress={() => setListModalType(null)}>
                <Ionicons name="close" size={24} color="#0F172A" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalTabBar}>
              <TouchableOpacity style={[styles.modalTab, listModalType === 'connections' && styles.activeModalTab]} onPress={() => setListModalType('connections')}>
                <Text style={[styles.modalTabText, listModalType === 'connections' && styles.activeModalTabText]}>{profileData.followers} Connections</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalTab, listModalType === 'following' && styles.activeModalTab]} onPress={() => setListModalType('following')}>
                <Text style={[styles.modalTabText, listModalType === 'following' && styles.activeModalTabText]}>{profileData.following} Following</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalSearchContainer}>
              <View style={styles.modalSearchBar}>
                <Ionicons name="search" size={18} color="#94A3B8" />
                <TextInput style={styles.modalSearchInput} placeholder="Search" placeholderTextColor="#94A3B8" />
              </View>
            </View>
            <ScrollView style={{ padding: 16 }}>
              {mockConnections.map(user => (
                <View key={user.id} style={styles.connectionItem}>
                  <View style={styles.connectionAvatar}>
                    <Text style={styles.connectionAvatarText}>{user.avatar}</Text>
                  </View>
                  <View style={styles.connectionInfo}>
                    <Text style={styles.connectionName}>{user.name}</Text>
                    <Text style={styles.connectionUsername}>{user.username}</Text>
                  </View>
                  <TouchableOpacity style={[styles.connectionBtn, listModalType === 'following' && styles.followingBtn]}>
                    <Text style={[styles.connectionBtnText, listModalType === 'following' && styles.followingBtnText]}>
                      {listModalType === 'connections' ? 'Remove' : 'Following'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Settings Modal */}
      <Modal visible={settingsVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => { setSettingsVisible(false); setSettingsSubView('menu'); }} />
          <View style={[styles.modalContent, (settingsSubView === 'saved' || settingsSubView === 'activity') && { height: '85%' }]}>
            <View style={styles.modalHeader}>
              {settingsSubView !== 'menu' ? (
                <TouchableOpacity onPress={() => setSettingsSubView('menu')}>
                  <Ionicons name="arrow-back" size={24} color="#0F172A" />
                </TouchableOpacity>
              ) : <View style={{ width: 24 }} />}
              <Text style={styles.modalTitle}>
                {settingsSubView === 'menu' 
                  ? 'Settings' 
                  : settingsSubView === 'profile_edit' 
                  ? 'Edit Profile' 
                  : settingsSubView === 'security'
                  ? 'Security'
                  : settingsSubView === 'saved'
                  ? 'Saved Items'
                  : 'Your Activity'}
              </Text>
              <TouchableOpacity onPress={() => { setSettingsVisible(false); setSettingsSubView('menu'); }}>
                <Ionicons name="close" size={24} color="#0F172A" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
              <View style={{ padding: 20 }}>
                {settingsSubView === 'menu' && (
                  <View>
                    <TouchableOpacity style={styles.settingsRow} onPress={() => setSettingsSubView('profile_edit')}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="person-outline" size={20} color="#003366" style={{ marginRight: 12 }} />
                        <Text style={styles.settingsRowLabel}>Edit Profile</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingsRow} onPress={() => setSettingsSubView('saved')}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="bookmark-outline" size={20} color="#003366" style={{ marginRight: 12 }} />
                        <Text style={styles.settingsRowLabel}>Saved Items</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingsRow} onPress={() => setSettingsSubView('activity')}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="pulse-outline" size={20} color="#003366" style={{ marginRight: 12 }} />
                        <Text style={styles.settingsRowLabel}>Your Activity</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingsRow} onPress={() => setSettingsSubView('security')}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="shield-outline" size={20} color="#003366" style={{ marginRight: 12 }} />
                        <Text style={styles.settingsRowLabel}>Security</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.settingsRow, { borderBottomWidth: 0 }]} onPress={handleLogout}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="log-out-outline" size={20} color="#EF4444" style={{ marginRight: 12 }} />
                        <Text style={[styles.settingsRowLabel, { color: '#EF4444' }]}>Logout</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}

                {settingsSubView === 'profile_edit' && (
                  <View>
                    <Text style={styles.editLabel}>Name</Text>
                    <TextInput style={styles.editInput} value={profileData.name} onChangeText={(t) => setProfileData({ ...profileData, name: t })} />
                    <Text style={styles.editLabel}>Bio</Text>
                    <TextInput style={[styles.editInput, { height: 80, textAlignVertical: 'top' }]} value={profileData.bio} onChangeText={(t) => setProfileData({ ...profileData, bio: t })} multiline />
                    <TouchableOpacity style={styles.saveBtn} onPress={() => { setSettingsSubView('menu'); Alert.alert('Saved', 'Profile updated!'); }}>
                      <Text style={styles.saveBtnText}>Save Changes</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {settingsSubView === 'security' && (
                  <View>
                    <Text style={styles.editLabel}>Current Password</Text>
                    <TextInput style={styles.editInput} placeholder="••••••••" placeholderTextColor="#94A3B8" secureTextEntry />
                    <Text style={styles.editLabel}>New Password</Text>
                    <TextInput style={styles.editInput} placeholder="••••••••" placeholderTextColor="#94A3B8" secureTextEntry />
                    <TouchableOpacity style={[styles.saveBtn, { backgroundColor: '#0F172A' }]} onPress={() => Alert.alert('Updated', 'Password changed.')}>
                      <Text style={styles.saveBtnText}>Change Password</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {settingsSubView === 'saved' && (
                  <View style={styles.postsGrid}>
                    {mockSaved.map((item) => (
                      <TouchableOpacity key={item.id} style={[styles.gridItem, { width: width / 3, height: width / 3 }]} activeOpacity={0.9}>
                        <Image source={{ uri: item.uri }} style={styles.gridImage} />
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {settingsSubView === 'activity' && (
                  <View style={styles.activityContainer}>
                    {/* Accounts Reached */}
                    <View style={styles.activityCard}>
                      <View style={styles.activityCardHeader}>
                        <Ionicons name="people-outline" size={20} color="#003366" />
                        <Text style={styles.activityCardTitle}>Accounts Reached</Text>
                      </View>
                      <Text style={styles.activityBigNumber}>12,845</Text>
                      <Text style={styles.activitySubText}>+23.5% vs last 30 days</Text>
                      {/* Mini Bar Chart */}
                      <View style={styles.activityChartRow}>
                        {[40, 55, 70, 45, 80, 65, 90].map((val, idx) => (
                          <View key={idx} style={styles.activityChartCol}>
                            <View style={styles.activityBarBg}>
                              <View style={[styles.activityBarFill, { height: `${val}%` }]} />
                            </View>
                            <Text style={styles.activityDayLabel}>{['M','T','W','T','F','S','S'][idx]}</Text>
                          </View>
                        ))}
                      </View>
                    </View>

                    {/* Content Interactions */}
                    <View style={styles.activityCard}>
                      <View style={styles.activityCardHeader}>
                        <Ionicons name="heart-outline" size={20} color="#EF4444" />
                        <Text style={styles.activityCardTitle}>Content Interactions</Text>
                      </View>
                      <View style={styles.interactionRow}>
                        <View style={styles.interactionItem}>
                          <Text style={styles.interactionValue}>2,456</Text>
                          <Text style={styles.interactionLabel}>Likes</Text>
                        </View>
                        <View style={styles.interactionItem}>
                          <Text style={styles.interactionValue}>342</Text>
                          <Text style={styles.interactionLabel}>Comments</Text>
                        </View>
                        <View style={styles.interactionItem}>
                          <Text style={styles.interactionValue}>128</Text>
                          <Text style={styles.interactionLabel}>Shares</Text>
                        </View>
                        <View style={styles.interactionItem}>
                          <Text style={styles.interactionValue}>89</Text>
                          <Text style={styles.interactionLabel}>Saves</Text>
                        </View>
                      </View>
                    </View>

                    {/* Profile Activity */}
                    <View style={styles.activityCard}>
                      <View style={styles.activityCardHeader}>
                        <Ionicons name="person-outline" size={20} color="#16A34A" />
                        <Text style={styles.activityCardTitle}>Profile Activity</Text>
                      </View>
                      <View style={styles.profileActivityRow}>
                        <View style={styles.profileActivityItem}>
                          <Ionicons name="eye-outline" size={22} color="#003366" />
                          <Text style={styles.profileActivityValue}>856</Text>
                          <Text style={styles.profileActivityLabel}>Profile Visits</Text>
                        </View>
                        <View style={styles.profileActivityItem}>
                          <Ionicons name="link-outline" size={22} color="#003366" />
                          <Text style={styles.profileActivityValue}>124</Text>
                          <Text style={styles.profileActivityLabel}>Link Taps</Text>
                        </View>
                        <View style={styles.profileActivityItem}>
                          <Ionicons name="person-add-outline" size={22} color="#003366" />
                          <Text style={styles.profileActivityValue}>+38</Text>
                          <Text style={styles.profileActivityLabel}>New Followers</Text>
                        </View>
                      </View>
                    </View>

                    {/* Engagement Summary */}
                    <View style={styles.activityCard}>
                      <View style={styles.activityCardHeader}>
                        <Ionicons name="trending-up-outline" size={20} color="#D97706" />
                        <Text style={styles.activityCardTitle}>Engagement Summary</Text>
                      </View>
                      <View style={styles.engagementList}>
                        <View style={styles.engagementItem}>
                          <Text style={styles.engagementLabel}>Engagement Rate</Text>
                          <Text style={styles.engagementValue}>4.8%</Text>
                        </View>
                        <View style={styles.engagementItem}>
                          <Text style={styles.engagementLabel}>Avg. Reach per Post</Text>
                          <Text style={styles.engagementValue}>267</Text>
                        </View>
                        <View style={styles.engagementItem}>
                          <Text style={styles.engagementLabel}>Best Posting Time</Text>
                          <Text style={styles.engagementValue}>6:00 PM</Text>
                        </View>
                        <View style={[styles.engagementItem, { borderBottomWidth: 0 }]}>
                          <Text style={styles.engagementLabel}>Top Content Type</Text>
                          <Text style={styles.engagementValue}>Photos</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerUsername: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginLeft: 10, marginRight: 4 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  headerIcon: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  profileInfoContainer: { paddingHorizontal: 20, paddingTop: 16 },
  mainInfoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  avatarCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F0F9FF', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#003366' },
  statsContainer: { flexDirection: 'row', flex: 1, justifyContent: 'space-around', marginLeft: 16 },
  statBox: { alignItems: 'center' },
  statNumber: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  statLabel: { fontSize: 11, color: '#64748B', fontWeight: '600', marginTop: 2 },
  bioContainer: { marginTop: 14, marginBottom: 14 },
  nameText: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  occupationText: { fontSize: 13, color: '#64748B', fontWeight: '600', marginTop: 2 },
  bioText: { fontSize: 13, color: '#475569', lineHeight: 19, marginTop: 6 },
  buttonRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  actionButton: { flex: 1, backgroundColor: '#F1F5F9', height: 36, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  actionButtonText: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  smallIconBtn: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  tabContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  tabButton: { flex: 1, alignItems: 'center', paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTabButton: { borderBottomColor: '#003366' },
  tabLabel: { fontSize: 11, color: '#94A3B8', fontWeight: '600', marginTop: 4 },
  activeTabLabel: { color: '#003366' },
  postsGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  gridItem: { padding: 1 },
  gridImage: { width: '100%', height: '100%', backgroundColor: '#F1F5F9' },
  tagOverlay: { position: 'absolute', bottom: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.5)', padding: 4, borderRadius: 12 },
  tabContentList: { padding: 16 },
  listCard: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  cardBodyText: { fontSize: 13, color: '#475569', fontStyle: 'italic', lineHeight: 18, marginBottom: 8 },
  cardFooterText: { fontSize: 11, color: '#94A3B8', fontWeight: '500' },
  // Activity Tab (inside modal settings now)
  activityContainer: { paddingVertical: 10 },
  activityCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 },
  activityCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  activityCardTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A', marginLeft: 8 },
  activityBigNumber: { fontSize: 32, fontWeight: '800', color: '#002144', marginBottom: 4 },
  activitySubText: { fontSize: 13, color: '#16A34A', fontWeight: '600', marginBottom: 16 },
  activityChartRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 80 },
  activityChartCol: { alignItems: 'center', flex: 1 },
  activityBarBg: { height: 50, width: 12, backgroundColor: '#F1F5F9', borderRadius: 6, justifyContent: 'flex-end', overflow: 'hidden' },
  activityBarFill: { backgroundColor: '#003366', borderRadius: 6, width: '100%' },
  activityDayLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '600', marginTop: 6 },
  interactionRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 8 },
  interactionItem: { alignItems: 'center' },
  interactionValue: { fontSize: 18, fontWeight: '800', color: '#002144' },
  interactionLabel: { fontSize: 11, color: '#64748B', fontWeight: '600', marginTop: 2 },
  profileActivityRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 8 },
  profileActivityItem: { alignItems: 'center' },
  profileActivityValue: { fontSize: 18, fontWeight: '800', color: '#002144', marginTop: 6 },
  profileActivityLabel: { fontSize: 11, color: '#64748B', fontWeight: '600', marginTop: 2 },
  engagementList: {},
  engagementItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  engagementLabel: { fontSize: 14, color: '#475569', fontWeight: '600' },
  engagementValue: { fontSize: 14, fontWeight: '800', color: '#002144' },
  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  modalTitle: { fontSize: 17, fontWeight: '700', color: '#0F172A' },
  modalTabBar: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  modalTab: { flex: 1, alignItems: 'center', paddingVertical: 14, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeModalTab: { borderBottomColor: '#0F172A' },
  modalTabText: { fontSize: 14, fontWeight: '600', color: '#94A3B8' },
  activeModalTabText: { color: '#0F172A' },
  modalSearchContainer: { paddingHorizontal: 16, paddingVertical: 12 },
  modalSearchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 8, paddingHorizontal: 12, height: 36 },
  modalSearchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#0F172A' },
  connectionItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  connectionAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  connectionAvatarText: { fontSize: 16, fontWeight: '700', color: '#64748B' },
  connectionInfo: { flex: 1 },
  connectionName: { fontSize: 15, fontWeight: '600', color: '#0F172A' },
  connectionUsername: { fontSize: 13, color: '#64748B' },
  connectionBtn: { paddingHorizontal: 16, paddingVertical: 6, backgroundColor: '#E2E8F0', borderRadius: 6 },
  connectionBtnText: { fontSize: 13, fontWeight: '600', color: '#0F172A' },
  followingBtn: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0' },
  followingBtnText: { color: '#0F172A' },
  settingsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  settingsRowLabel: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  editLabel: { fontSize: 12, fontWeight: '700', color: '#475569', marginBottom: 6, paddingLeft: 2, marginTop: 12 },
  editInput: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, height: 46, paddingHorizontal: 14, fontSize: 14, color: '#0F172A' },
  saveBtn: { backgroundColor: '#003366', height: 48, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  saveBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  // Mini Institution Selector for Super Admin inside Profile
  miniSelectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  miniSelectorScrollContent: {
    paddingHorizontal: 4,
    flexDirection: 'row',
    gap: 8,
  },
  miniSelectorContainer: {
    marginBottom: 16,
  },
  miniSelectorChip: {
    paddingHorizontal: 16,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  miniSelectorChipActive: {
    backgroundColor: '#003366',
    borderColor: '#003366',
  },
  miniSelectorChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  miniSelectorChipTextActive: {
    color: '#FFFFFF',
  },

  // Institution details tab styling
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  detailsCardHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
  },
  statusTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusActive: {
    backgroundColor: '#D1FAE5',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  statusActiveText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46',
  },
  statusPendingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
  },
  detailsDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  detailsInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailsInfoText: {
    fontSize: 13.5,
    color: '#475569',
  },
  detailsLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  detailsLinkText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#003366',
    textDecorationLine: 'underline',
  },
  detailsSectionHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    width: '47%',
  },
  featureItemText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginLeft: 6,
  },
  adminListRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  adminInfoCol: {
    flex: 1,
  },
  adminNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  adminEmailText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  statusTagMini: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusTagMiniText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statusInactive: {
    backgroundColor: '#F1F5F9',
  },
  placementListRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  placementCompanyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  placementIndustryText: {
    fontSize: 12,
    color: '#64748B',
  },
  placementCountBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  placementCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#003366',
  },
  emptyDetailsText: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    paddingVertical: 12,
  },
});

export default AdminProfileScreen;
