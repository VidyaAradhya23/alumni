import React, { useState, useMemo, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
  Dimensions,
  FlatList,
  Modal,
  Switch,
  ActivityIndicator,
  Platform,
  Image,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// ==========================================
// DUMMY DATABASE / SEED DATA
// ==========================================

const INSTITUTIONS = [
  { id: '1', name: 'RV College of Engineering', shortName: 'RVCE', location: 'Bengaluru, Karnataka', established: 1963, totalAlumni: 9755, registeredUsers: 3420, admins: 5, status: 'Active', color: '#003366' },
  { id: '2', name: 'RV Institute of Technology & Management', shortName: 'RVITM', location: 'Bengaluru, Karnataka', established: 2019, totalAlumni: 4230, registeredUsers: 1580, admins: 3, status: 'Active', color: '#1E3A5F' },
  { id: '3', name: 'RV PU College', shortName: 'RVPU', location: 'Bengaluru, Karnataka', established: 1970, totalAlumni: 6800, registeredUsers: 890, admins: 2, status: 'Pending Audit', color: '#7C3AED' },
  { id: '4', name: 'RV International School', shortName: 'RVIS', location: 'Bengaluru, Karnataka', established: 1999, totalAlumni: 2100, registeredUsers: 560, admins: 2, status: 'Active', color: '#059669' },
];

const INITIAL_ADMINS = [
  { id: '1', name: 'Dr. Ramesh Kumar', email: 'admin@rvce.edu', password: 'admin123', institution: 'RVCE', role: 'Admin', status: 'Active', lastLogin: '17/06/2026 09:30 AM', passwordChangedAt: '15/06/2026' },
  { id: '2', name: 'Prof. Anitha Shetty', email: 'anitha.s@rvce.edu', password: 'anitha@2026', institution: 'RVCE', role: 'Admin', status: 'Active', lastLogin: '16/06/2026 02:15 PM', passwordChangedAt: '10/06/2026' },
  { id: '3', name: 'Suresh Babu', email: 'admin@rvitm.edu', password: 'admin456', institution: 'RVITM', role: 'Admin', status: 'Active', lastLogin: '17/06/2026 11:00 AM', passwordChangedAt: '12/06/2026' },
  { id: '4', name: 'Meera Nair', email: 'admin@rvpu.edu', password: 'admin789', institution: 'RVPU', role: 'Admin', status: 'Active', lastLogin: '14/06/2026 04:45 PM', passwordChangedAt: '01/06/2026' },
  { id: '5', name: 'Vikram Joshi', email: 'admin@rvis.edu', password: 'admin012', institution: 'RVIS', role: 'Admin', status: 'Inactive', lastLogin: '10/06/2026 10:00 AM', passwordChangedAt: '05/05/2026' },
];

const INITIAL_SPAM_REPORTS = [
  { id: '1', name: 'Nithin Ganimaneni', institution: 'RVCE', branch: 'BE, CSE', year: '2022', reason: 'Spamming job referrals with affiliate links', reportedBy: 'Karthik Nagaraju', date: '10/06/2026' },
  { id: '2', name: 'G.Y Rohith', institution: 'RVCE', branch: 'BE, ECE', year: '2016', reason: 'Posting commercial ads in alumni timeline', reportedBy: 'Uday A S', date: '09/06/2026' },
  { id: '3', name: 'Priya Desai', institution: 'RVITM', branch: 'BE, ISE', year: '2020', reason: 'Sending bulk unsolicited messages', reportedBy: 'Admin', date: '11/06/2026' },
  { id: '4', name: 'Rahul Menon', institution: 'RVPU', branch: 'Science', year: '2019', reason: 'Fake profile with misleading information', reportedBy: 'Meera Nair', date: '08/06/2026' },
  { id: '5', name: 'Sneha Patil', institution: 'RVITM', branch: 'MBA', year: '2021', reason: 'Promoting external MLM schemes', reportedBy: 'Suresh Babu', date: '07/06/2026' },
];

const INITIAL_MEMBERSHIP_REQUESTS = [
  { id: '1', name: 'Srinivas Murthy', institution: 'RVCE', branch: 'BE, Mechanical', year: '2020', email: 'srinivas.m@example.com', phone: '+91 98456 12345', proof: 'Degree Certificate ID: 948210', status: 'pending', adminAction: null, details: { company: 'Tata Motors', designation: 'Senior Engineer', graduationYear: 2020, linkedIn: 'linkedin.com/in/srinivas-m' } },
  { id: '2', name: 'Priya Sharma', institution: 'RVCE', branch: 'MBA', year: '2021', email: 'priya.sharma@example.com', phone: '+91 87654 32100', proof: 'Alumni ID Card No: RV-9481', status: 'approved', adminAction: 'Approved by Dr. Ramesh Kumar', details: { company: 'Deloitte', designation: 'Consultant', graduationYear: 2021, linkedIn: 'linkedin.com/in/priya-sharma' } },
  { id: '3', name: 'Amit Kulkarni', institution: 'RVITM', branch: 'BE, CSE', year: '2019', email: 'amit.k@example.com', phone: '+91 99887 76655', proof: 'Marksheet Upload: MS_2019_CSE', status: 'rejected', adminAction: 'Rejected by Suresh Babu - Incomplete documents', details: { company: 'Infosys', designation: 'Tech Lead', graduationYear: 2019, linkedIn: 'linkedin.com/in/amit-k' } },
  { id: '4', name: 'Deepa Rao', institution: 'RVPU', branch: 'Commerce', year: '2018', email: 'deepa.r@example.com', phone: '+91 77889 90011', proof: 'Transfer Certificate No: PU-7823', status: 'pending', adminAction: null, details: { company: 'KPMG', designation: 'Audit Associate', graduationYear: 2018, linkedIn: 'linkedin.com/in/deepa-rao' } },
  { id: '5', name: 'Kiran Hegde', institution: 'RVIS', branch: 'PCMB', year: '2017', email: 'kiran.h@example.com', phone: '+91 88776 65544', proof: 'School Leaving Certificate', status: 'approved', adminAction: 'Approved by Vikram Joshi', details: { company: 'Amazon', designation: 'SDE-2', graduationYear: 2017, linkedIn: 'linkedin.com/in/kiran-hegde' } },
];

const INITIAL_PLACEMENTS = [
  { id: '1', company: 'Cisco Systems', industry: 'Computer Networking', count: 78, institution: 'RVCE' },
  { id: '2', company: 'Accenture', industry: 'IT Services', count: 62, institution: 'RVCE' },
  { id: '3', company: 'Qualcomm', industry: 'Semiconductors', count: 61, institution: 'RVCE' },
  { id: '4', company: 'Infosys', industry: 'IT Services', count: 45, institution: 'RVITM' },
  { id: '5', company: 'Wipro', industry: 'IT Services', count: 38, institution: 'RVITM' },
  { id: '6', company: 'TCS', industry: 'IT Services', count: 32, institution: 'RVPU' },
  { id: '7', company: 'IBM', industry: 'IT Services', count: 28, institution: 'RVCE' },
  { id: '8', company: 'Amazon', industry: 'E-Commerce/Tech', count: 25, institution: 'RVIS' },
];

const INITIAL_ACTIVITIES = [
  { id: '1', type: 'Email Interaction', description: 'Welcome email sent to new admin Anitha Shetty', institution: 'RVCE', category: 'Welcome Mail', date: '17/06/2026' },
  { id: '2', type: 'Admin Action', description: 'Approved membership for Priya Sharma', institution: 'RVCE', category: 'Membership', date: '16/06/2026' },
  { id: '3', type: 'Placement Update', description: 'Added Infosys placement data - 45 alumni', institution: 'RVITM', category: 'Placement Tool', date: '15/06/2026' },
  { id: '4', type: 'Spam Action', description: 'Suspended account of Rahul Menon for fake profile', institution: 'RVPU', category: 'Spam/Report', date: '14/06/2026' },
  { id: '5', type: 'Bulk Import', description: 'Imported 250 alumni records from CSV', institution: 'RVCE', category: 'Bulk Import', date: '13/06/2026' },
  { id: '6', type: 'Data Export', description: 'Exported batch 2020-2023 alumni data', institution: 'RVITM', category: 'Data Export', date: '12/06/2026' },
  { id: '7', type: 'Network Settings', description: 'Updated branding colors and logo', institution: 'RVIS', category: 'Network Settings', date: '11/06/2026' },
  { id: '8', type: 'Email Campaign', description: 'Sent reunion invitation to 1200 alumni', institution: 'RVCE', category: 'Events', date: '10/06/2026' },
];

const INITIAL_IMPORTS = [
  { id: '1', fileName: 'rvce_alumni_2020.csv', institution: 'RVCE', records: 250, successful: 245, failed: 5, date: '13/06/2026', status: 'Completed' },
  { id: '2', fileName: 'rvitm_batch2019.xlsx', institution: 'RVITM', records: 180, successful: 180, failed: 0, date: '10/06/2026', status: 'Completed' },
  { id: '3', fileName: 'rvpu_science_stream.csv', institution: 'RVPU', records: 120, successful: 98, failed: 22, date: '05/06/2026', status: 'Partial' },
];

const INITIAL_NETWORK_SETTINGS = {
  'RVCE': { institutionName: 'RV College of Engineering', shortTitle: 'RVCE', website: 'https://rvce.edu.in', established: '1963', location: 'Bengaluru, Karnataka', primaryColor: '#003366', secondaryColor: '#00a99c', alumniText: 'Alumni', studentsText: 'Students', facultyText: 'Faculty', batchmatesText: 'Batchmates', manualApproval: true, emailVouching: false, allowUnverified: true, displayJobs: true, displayEvents: true, displayGroups: true, displayMemories: true, displayDonations: false, displayMentorship: true, displayAlumniCard: false, welcomeEmailEnabled: true, whatsappEnabled: false },
  'RVITM': { institutionName: 'RV Institute of Technology & Management', shortTitle: 'RVITM', website: 'https://rvitm.edu.in', established: '2019', location: 'Bengaluru, Karnataka', primaryColor: '#1a5276', secondaryColor: '#2ecc71', alumniText: 'Alumni', studentsText: 'Students', facultyText: 'Faculty', batchmatesText: 'Classmates', manualApproval: true, emailVouching: true, allowUnverified: false, displayJobs: true, displayEvents: true, displayGroups: false, displayMemories: true, displayDonations: true, displayMentorship: true, displayAlumniCard: true, welcomeEmailEnabled: true, whatsappEnabled: true },
  'RVPU': { institutionName: 'RV PU College', shortTitle: 'RVPU', website: 'https://rvpu.edu.in', established: '1970', location: 'Bengaluru, Karnataka', primaryColor: '#8e44ad', secondaryColor: '#e74c3c', alumniText: 'Alumni', studentsText: 'Students', facultyText: 'Teachers', batchmatesText: 'Batchmates', manualApproval: false, emailVouching: false, allowUnverified: true, displayJobs: false, displayEvents: true, displayGroups: true, displayMemories: true, displayDonations: false, displayMentorship: false, displayAlumniCard: false, welcomeEmailEnabled: false, whatsappEnabled: false },
  'RVIS': { institutionName: 'RV International School', shortTitle: 'RVIS', website: 'https://rvis.edu.in', established: '1999', location: 'Bengaluru, Karnataka', primaryColor: '#e67e22', secondaryColor: '#f39c12', alumniText: 'Alumni', studentsText: 'Students', facultyText: 'Teachers', batchmatesText: 'Schoolmates', manualApproval: true, emailVouching: false, allowUnverified: false, displayJobs: false, displayEvents: true, displayGroups: true, displayMemories: true, displayDonations: true, displayMentorship: false, displayAlumniCard: true, welcomeEmailEnabled: true, whatsappEnabled: false },
};

const MASTER_LOCATIONS = ['Bengaluru, Karnataka', 'Mysuru, Karnataka', 'Mumbai, Maharashtra', 'Hyderabad, Telangana', 'Chennai, Tamil Nadu'];
const MASTER_BATCHES = ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'];
const MASTER_COMPANIES = ['Cisco Systems', 'Accenture', 'Qualcomm', 'Infosys', 'Wipro', 'TCS', 'IBM', 'Amazon', 'Google', 'Microsoft', 'Oracle', 'SAP'];

const panelItems = [
  { id: '1', title: 'Spam/Report', icon: 'flag-outline', color: '#FFF5F5', iconColor: '#E53E3E', moduleName: 'spam_report', desc: 'Accounts flagged for spam or abuse' },
  { id: '2', title: 'Welcome Mail', icon: 'mail-open-outline', color: '#F0F9FF', iconColor: '#0284C7', moduleName: 'welcome_mail', desc: 'Compose welcome mails to admins only' },
  { id: '3', title: 'Master List', icon: 'list-outline', color: '#F0FDF4', iconColor: '#16A34A', moduleName: 'master_list', desc: 'Institutions, locations, batches & companies' },
  { id: '4', title: 'Administrator', icon: 'person-add-outline', color: '#FEF3C7', iconColor: '#D97706', moduleName: 'administrator', desc: 'Manage institution administrators' },
  { id: '5', title: 'Membership Request', icon: 'checkbox-outline', color: '#FFF7ED', iconColor: '#EA580C', moduleName: 'membership_request', desc: 'Approve or delete membership applications' },
  { id: '6', title: 'Network Settings', icon: 'settings-outline', color: '#F5F3FF', iconColor: '#7C3AED', moduleName: 'network_settings', desc: 'AlmaConnect-style institution configs' },
  { id: '7', title: 'Bulk Import', icon: 'cloud-upload-outline', color: '#ECFDF5', iconColor: '#059669', moduleName: 'bulk_import', desc: 'Bulk import alumni profiles via CSV' },
  { id: '8', title: 'Placement Tool', icon: 'briefcase-outline', color: '#FAF5FF', iconColor: '#9333EA', moduleName: 'placement_tool', desc: 'View and update hiring statistics' },
  { id: '9', title: 'Logs/Stats', icon: 'bar-chart-outline', color: '#FFF1F2', iconColor: '#E11D48', moduleName: 'logs_stats', desc: 'Database, visitors, jobs & email charts' },
  { id: '10', title: 'Dynamic Email Stats', icon: 'analytics-outline', color: '#ECFDF5', iconColor: '#059669', moduleName: 'email_stats', desc: 'Track invite and campaign mail open rates' },
  { id: '11', title: 'Data Exports', icon: 'download-outline', color: '#EFF6FF', iconColor: '#3B82F6', moduleName: 'data_exports', desc: 'Export institution directories' },
  { id: '12', title: 'Admin Activities', icon: 'time-outline', color: '#F1F5F9', iconColor: '#475569', moduleName: 'admin_activities', desc: 'Audit log of actions taken by admins' },
];

const MOCK_POSTS = [
  {
    id: 'p1',
    user: 'Dr. Ramesh Kumar',
    role: 'Principal Admin @ RVCE',
    avatar: 'RK',
    content: 'We are proud to announce that RVCE has been ranked #1 in state engineering college rankings for 2026. Congratulations to all students and faculty! 🎓🎉 #RVCE #Rankings',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&h=400&q=80',
    likes: 245,
    commentsCount: 18,
    time: '2 hours ago',
    institution: 'RVCE',
  },
  {
    id: 'p2',
    user: 'Suresh Babu',
    role: 'Placement Coordinator @ RVITM',
    avatar: 'SB',
    content: 'Fantastic start to the placement season at RVITM! Over 45 alumni placed in Infosys this week. More recruiters visiting campus next week. Keep it up! 💼🚀 #Placements #RVITM',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&h=400&q=80',
    likes: 182,
    commentsCount: 9,
    time: '5 hours ago',
    institution: 'RVITM',
  },
  {
    id: 'p3',
    user: 'Meera Nair',
    role: 'Admissions Officer @ RVPU',
    avatar: 'MN',
    content: "Welcoming the new batch of PU Science and Commerce streams! Orientation starts tomorrow at 9:00 AM. Let's make this academic year amazing! 📚✨ #NewBatch #Orientation",
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&h=400&q=80',
    likes: 95,
    commentsCount: 3,
    time: '1 day ago',
    institution: 'RVPU',
  },
  {
    id: 'p4',
    user: 'Vikram Joshi',
    role: 'Principal @ RVIS',
    avatar: 'VJ',
    content: 'Our school sports meet was a grand success! Outstanding performance by all houses. A huge shoutout to our physical education instructors and volunteers! 🏆🏃‍♂️ #SportsMeet #RVIS',
    image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&h=400&q=80',
    likes: 120,
    commentsCount: 7,
    time: '2 days ago',
    institution: 'RVIS',
  },
];

const SuperAdminDashboardScreen = ({ navigation, route }) => {
  const initialModule = route?.params?.initialModule ?? null;
  const [activeModule, setActiveModule] = useState(initialModule);
  const [selectedInstitution, setSelectedInstitution] = useState(global.selectedInstitution || 'All');
  const isFocused = useIsFocused();

  // Sync selected institution with global value when screen is focused
  useEffect(() => {
    if (isFocused && global.selectedInstitution) {
      setSelectedInstitution(global.selectedInstitution);
    }
  }, [isFocused]);

  // Dynamic States
  const [admins, setAdmins] = useState(INITIAL_ADMINS);
  const [spamReports, setSpamReports] = useState(INITIAL_SPAM_REPORTS);
  const [membershipRequests, setMembershipRequests] = useState(INITIAL_MEMBERSHIP_REQUESTS);
  const [placements, setPlacements] = useState(INITIAL_PLACEMENTS);
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [imports, setImports] = useState(INITIAL_IMPORTS);
  const [networkSettings, setNetworkSettings] = useState(INITIAL_NETWORK_SETTINGS);

  // News Feed & Dropdown States
  const [postsList, setPostsList] = useState(MOCK_POSTS);
  const [likedPosts, setLikedPosts] = useState({});
  const [bookmarkedPosts, setBookmarkedPosts] = useState({});
  const [followedUsers, setFollowedUsers] = useState({});
  const [showInstDropdown, setShowInstDropdown] = useState(false);
  const [broadcastText, setBroadcastText] = useState('');

  // Post Actions
  const togglePostLike = (postId) => {
    setLikedPosts((prev) => {
      const isLiked = prev[postId];
      setPostsList(curr => curr.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            likes: isLiked ? p.likes - 1 : p.likes + 1
          };
        }
        return p;
      }));
      return { ...prev, [postId]: !isLiked };
    });
  };

  const togglePostBookmark = (postId) => {
    setBookmarkedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const togglePostFollow = (postId) => {
    setFollowedUsers((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handlePostShare = async (post) => {
    try {
      await Share.share({
        message: `Check out this post from ${post.user} on Alumni App:\n"${post.content}"`,
      });
    } catch (_error) {
      Alert.alert('Error', 'Could not share this post');
    }
  };

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, text: 'None', color: '#94A3B8' };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 8) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;

    if (score <= 2) return { score, text: 'Weak', color: '#EF4444' };
    if (score <= 4) return { score, text: 'Medium', color: '#F59E0B' };
    return { score, text: 'Strong', color: '#10B981' };
  };

  // Helper function to get rich institution metadata
  const getInstitutionDetails = (inst) => {
    switch (inst) {
      case 'RVCE':
        return {
          fullName: 'RV College of Engineering',
          subtitle: 'Bengaluru, Karnataka • Est. 1963',
          logo: 'CE',
          color: '#003366',
        };
      case 'RVITM':
        return {
          fullName: 'RV Institute of Tech. & Mgmt.',
          subtitle: 'Bengaluru, Karnataka • Est. 2002',
          logo: 'TM',
          color: '#1A5276',
        };
      case 'RVPU':
        return {
          fullName: 'RV PU College',
          subtitle: 'Bengaluru, Karnataka • Est. 1970',
          logo: 'PU',
          color: '#8E44AD',
        };
      case 'RVIS':
        return {
          fullName: 'RV International School',
          subtitle: 'Bengaluru, Karnataka • Est. 1999',
          logo: 'IS',
          color: '#E67E22',
        };
      default:
        return {
          fullName: 'All Campuses',
          subtitle: 'Aggregated view across all campuses',
          logo: 'ALL',
          color: '#0D9488',
        };
    }
  };

  // Premium Institution Selector Dropdown Component
  const InstitutionSelector = ({ allowAll = true }) => {
    // Auto-fallback if 'All' is selected in a non-All selector
    if (!allowAll && selectedInstitution === 'All') {
      setSelectedInstitution('RVCE');
      global.selectedInstitution = 'RVCE';
    }

    const list = allowAll ? ['All', 'RVCE', 'RVITM', 'RVPU', 'RVIS'] : ['RVCE', 'RVITM', 'RVPU', 'RVIS'];
    const currentDetails = getInstitutionDetails(selectedInstitution);

    return (
      <View style={styles.dropdownContainer}>
        <Text style={styles.dropdownLabel}>Active Campus Selection</Text>
        <TouchableOpacity 
          style={styles.dropdownButton} 
          activeOpacity={0.8}
          onPress={() => setShowInstDropdown(true)}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <View style={[styles.dropdownLogoBg, { backgroundColor: currentDetails.color }]}>
              <Text style={styles.dropdownLogoText}>{currentDetails.logo}</Text>
            </View>
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.dropdownCampusName} numberOfLines={1}>
                {currentDetails.fullName}
              </Text>
              <Text style={styles.dropdownCampusSub} numberOfLines={1}>
                {currentDetails.subtitle}
              </Text>
            </View>
          </View>
          <View style={styles.dropdownChevronBg}>
            <Ionicons name="chevron-down" size={16} color="#003366" />
          </View>
        </TouchableOpacity>

        <Modal visible={showInstDropdown} transparent animationType="slide">
          <TouchableOpacity 
            style={styles.dropdownModalOverlay} 
            activeOpacity={1} 
            onPress={() => setShowInstDropdown(false)}
          >
            <View style={styles.dropdownModalContent}>
              <View style={styles.dropdownModalHeader}>
                <View style={styles.dropdownModalHandle} />
                <Text style={styles.dropdownModalTitle}>Select Campus / Institution</Text>
              </View>
              
              <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 400 }}>
                {list.map((inst) => {
                  const details = getInstitutionDetails(inst);
                  const isSelected = selectedInstitution === inst;
                  return (
                    <TouchableOpacity
                      key={inst}
                      style={[
                        styles.dropdownOption,
                        isSelected && styles.dropdownOptionActive
                      ]}
                      activeOpacity={0.7}
                      onPress={() => {
                        setSelectedInstitution(inst);
                        global.selectedInstitution = inst;
                        setShowInstDropdown(false);
                      }}
                    >
                      <View style={[styles.dropdownOptionLogo, { backgroundColor: details.color }]}>
                        <Text style={styles.dropdownOptionLogoText}>{details.logo}</Text>
                      </View>
                      <View style={{ marginLeft: 12, flex: 1 }}>
                        <Text style={[styles.dropdownOptionText, isSelected && styles.dropdownOptionTextActive]}>
                          {details.fullName}
                        </Text>
                        <Text style={styles.dropdownOptionSub}>{details.subtitle}</Text>
                      </View>
                      {isSelected && (
                        <View style={styles.dropdownCheckCircle}>
                          <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  };

  // Render Post Card
  const renderPostCard = (post) => {
    const isLiked = !!likedPosts[post.id];
    const isBookmarked = !!bookmarkedPosts[post.id];
    const isFollowing = !!followedUsers[post.id];

    return (
      <View key={post.id} style={styles.postCard}>
        {/* Post header */}
        <View style={styles.postHeader}>
          <View style={[styles.postUserAvatar, post.isAnnouncement && { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' }]}>
            <Text style={[styles.postAvatarText, post.isAnnouncement && { color: '#D97706' }]}>{post.avatar}</Text>
          </View>
          <View style={styles.postUserInfo}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <Text style={styles.postUserName}>{post.user}</Text>
              {post.isAnnouncement && (
                <View style={styles.announcementBadge}>
                  <Text style={styles.announcementBadgeText}>ANNOUNCEMENT</Text>
                </View>
              )}
            </View>
            <Text style={styles.postUserRole}>{post.role}</Text>
          </View>
          <TouchableOpacity 
            style={[styles.followBtn, isFollowing && styles.followBtnActive]} 
            onPress={() => togglePostFollow(post.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.followBtnText, isFollowing && styles.followBtnTextActive]}>
              {isFollowing ? 'Following' : '+ Follow'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Post Content */}
        <Text style={styles.postContent}>{post.content}</Text>

        {/* Post image */}
        {post.image && (
          <Image source={{ uri: post.image }} style={styles.postImage} />
        )}

        {/* Action Buttons */}
        <View style={styles.postActions}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <TouchableOpacity onPress={() => togglePostLike(post.id)} activeOpacity={0.6} style={styles.actionBtn}>
              <Ionicons 
                name={isLiked ? 'heart' : 'heart-outline'} 
                size={22} 
                color={isLiked ? '#EF4444' : '#64748B'} 
              />
              <Text style={[styles.actionBtnText, isLiked && { color: '#EF4444' }]}>{post.likes}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity activeOpacity={0.6} style={styles.actionBtn} onPress={() => Alert.alert('Comments', 'Comments are in view-only mode for Super Admins.')}>
              <Ionicons name="chatbubble-outline" size={20} color="#64748B" />
              <Text style={styles.actionBtnText}>{post.commentsCount}</Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.6} style={styles.actionBtn} onPress={() => handlePostShare(post)}>
              <Ionicons name="share-social-outline" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => togglePostBookmark(post.id)} activeOpacity={0.6}>
            <Ionicons 
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'} 
              size={22} 
              color={isBookmarked ? '#003366' : '#64748B'} 
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Search, tabs and toggles
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('1'); // Generic state for inner module tabs
  const [uploadedRoster, setUploadedRoster] = useState(null);
  const [visiblePasswords, setVisiblePasswords] = useState({}); // adminId -> bool
  const [alumniDetailModal, setAlumniDetailModal] = useState(null); // alumnus request detail

  // Welcome Mail States
  const [welcomeSubject, setWelcomeSubject] = useState('Welcome to RVITM Admin Portal');
  const [welcomeBody, setWelcomeBody] = useState('Dear Admin,\n\nYour administrator account has been created successfully. Please log in using your registered credentials.\n\nBest regards,\nSuper Admin Team');
  const [welcomeAutoSend, setWelcomeAutoSend] = useState(true);

  // Administrator Form States
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminFormInst, setAdminFormInst] = useState('RVCE');
  const [adminFormName, setAdminFormName] = useState('');
  const [adminFormEmail, setAdminFormEmail] = useState('');
  const [adminFormPassword, setAdminFormPassword] = useState('');

  // Placement Form States
  const [showPlacementModal, setShowPlacementModal] = useState(false);
  const [placementFormInst, setPlacementFormInst] = useState('RVCE');
  const [placementFormCompany, setPlacementFormCompany] = useState('');
  const [placementFormInd, setPlacementFormInd] = useState('');
  const [placementFormCount, setPlacementFormCount] = useState('');

  // Export & Import states
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressVal, setProgressVal] = useState(0);

  // Logs/Stats Date State
  const [statsStartDate, setStatsStartDate] = useState('15/06/2026');
  const [statsEndDate, setStatsEndDate] = useState('17/06/2026');
  const [expandedChart, setExpandedChart] = useState(null);

  // Helper filter function
  const filterByInstitution = (data, field = 'institution') => {
    if (selectedInstitution === 'All') return data;
    return data.filter((item) => item[field] === selectedInstitution);
  };

  // Toggle password eye helper
  const togglePasswordVisibility = (adminId) => {
    setVisiblePasswords((prev) => ({ ...prev, [adminId]: !prev[adminId] }));
  };

  // Old InstitutionSelector replaced by premium dropdown above

  // Back action helper
  const handleGoBack = () => {
    setActiveModule(null);
    setSearchQuery('');
  };

  // ==========================================
  // MODULE RENDERERS
  // ==========================================

  // 1. Dashboard Home (Grid & summary, specific institution details, news feed)
  const renderDashboardHome = () => {
    const totalAlumniAgg = INSTITUTIONS.reduce((sum, item) => sum + item.totalAlumni, 0);
    const registeredUsersAgg = INSTITUTIONS.reduce((sum, item) => sum + item.registeredUsers, 0);
    const activeAdminsAgg = admins.filter(a => a.status === 'Active').length;

    // Filter posts by selected institution
    const filteredPosts = postsList.filter(p => {
      if (selectedInstitution === 'All') return true;
      return p.institution === selectedInstitution;
    });

    return (
      <View style={styles.dashboardHomeView}>
        {/* Custom Institution Dropdown at the top */}
        <InstitutionSelector />

        {selectedInstitution === 'All' ? (
          <>
            {/* Aggregate Stats Card */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryHeaderRow}>
                <Text style={styles.summaryTitle}>SYSTEM STATUS & HEALTH</Text>
                <View style={styles.healthStatusBadge}>
                  <View style={styles.healthDot} />
                  <Text style={styles.healthText}>All Services Online</Text>
                </View>
              </View>
              <View style={styles.summaryGrid}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>{totalAlumniAgg.toLocaleString()}</Text>
                  <Text style={styles.summaryLabel}>Total Alumni</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>{registeredUsersAgg.toLocaleString()}</Text>
                  <Text style={styles.summaryLabel}>Registered Users</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>{activeAdminsAgg}</Text>
                  <Text style={styles.summaryLabel}>Active Admins</Text>
                </View>
              </View>
            </View>

            {/* Institution Performance Cards List */}
            <Text style={styles.sectionHeaderTitle}>Institution Performance</Text>
            {INSTITUTIONS.map((inst) => {
              const instAdmins = admins.filter(a => a.institution === inst.shortName).length;
              const instSpam = spamReports.filter(s => s.institution === inst.shortName).length;

              return (
                <TouchableOpacity
                  key={inst.id}
                  style={styles.instMetricCard}
                  onPress={() => Alert.alert(inst.name, `Location: ${inst.location}\nEstablished: ${inst.established}\nAlumni: ${inst.totalAlumni}`)}
                >
                  <View style={styles.instMetricHeader}>
                    <View style={styles.instTitleWrap}>
                      <View style={[styles.instBadgeCircle, { backgroundColor: inst.color }]}>
                        <Text style={styles.instBadgeCircleText}>{inst.shortName.substring(0,2)}</Text>
                      </View>
                      <View style={{ marginLeft: 12 }}>
                        <Text style={styles.instCardTitle}>{inst.name}</Text>
                        <Text style={styles.instCardLoc}>{inst.location}</Text>
                      </View>
                    </View>
                    <View style={[styles.statusTag, inst.status === 'Active' ? styles.statusActive : styles.statusPending]}>
                      <Text style={inst.status === 'Active' ? styles.statusActiveText : styles.statusPendingText}>{inst.status}</Text>
                    </View>
                  </View>

                  <View style={styles.instMetricsRow}>
                    <View style={styles.metricItem}>
                      <Text style={styles.metricVal}>{inst.totalAlumni}</Text>
                      <Text style={styles.metricLbl}>Total Alumni</Text>
                    </View>
                    <View style={styles.metricItem}>
                      <Text style={styles.metricVal}>{instAdmins}</Text>
                      <Text style={styles.metricLbl}>Admins</Text>
                    </View>
                    <View style={styles.metricItem}>
                      <Text style={[styles.metricVal, instSpam > 0 && { color: '#EF4444' }]}>{instSpam}</Text>
                      <Text style={styles.metricLbl}>Reports</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </>
        ) : (
          <>
            {/* Specific Institution Details */}
            {(() => {
              const instDetails = INSTITUTIONS.find(i => i.shortName === selectedInstitution);
              const instAdminsList = admins.filter(a => a.institution === selectedInstitution);
              const instPlacements = placements.filter(p => p.institution === selectedInstitution);
              const instSettings = networkSettings[selectedInstitution] || {};

              return (
                <View style={{ gap: 16 }}>
                  {/* General Info Card */}
                  <View style={styles.detailsCard}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <Text style={styles.detailsCardHeaderTitle}>{instDetails?.name || selectedInstitution}</Text>
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
                    {instPlacements.length > 0 ? (
                      instPlacements.map(p => (
                        <View key={p.id} style={styles.placementListRow}>
                          <View>
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
            })()}
          </>
        )}

        {/* Broadcast Widget */}
        <View style={styles.broadcastCard}>
          <Text style={styles.broadcastCardTitle}>Broadcast Announcement</Text>
          <View style={styles.broadcastInputRow}>
            <TextInput
              style={styles.broadcastInput}
              placeholder={selectedInstitution === 'All' ? "Announce to all institutions..." : `Announce to ${selectedInstitution}...`}
              placeholderTextColor="#94A3B8"
              value={broadcastText}
              onChangeText={setBroadcastText}
              multiline
            />
            <TouchableOpacity 
              style={styles.broadcastSendBtn} 
              activeOpacity={0.7}
              onPress={() => {
                if (!broadcastText.trim()) {
                  Alert.alert('Error', 'Announcement text cannot be empty.');
                  return;
                }
                const newAnn = {
                  id: `ann_${Date.now()}`,
                  user: 'Super Admin',
                  role: 'Global System Administrator',
                  avatar: 'SA',
                  content: broadcastText.trim(),
                  image: null,
                  likes: 0,
                  commentsCount: 0,
                  time: 'Just now',
                  institution: selectedInstitution === 'All' ? 'All' : selectedInstitution,
                  isAnnouncement: true,
                };
                setPostsList(prev => [newAnn, ...prev]);
                setBroadcastText('');
                Alert.alert('Published', 'Your broadcast has been pinned to the top of the feed.');
              }}
            >
              <Ionicons name="send" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* News Feed / Posts list */}
        <Text style={styles.sectionHeaderTitle}>Alumni News Feed</Text>
        <View style={{ paddingBottom: 20 }}>
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => renderPostCard(post))
          ) : (
            <View style={styles.emptyStateContainer}>
              <Ionicons name="newspaper-outline" size={48} color="#94A3B8" />
              <Text style={styles.emptyStateText}>No posts for this institution.</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  // 2. Spam/Report List
  const renderSpamReport = () => {
    const list = filterByInstitution(spamReports);
    
    // Counts per institution
    const counts = INSTITUTIONS.map(inst => {
      const c = spamReports.filter(s => s.institution === inst.shortName).length;
      return { label: inst.shortName, count: c };
    });

    const handleSuspend = (id, name) => {
      Alert.alert('Confirm Suspension', `Are you sure you want to suspend the account of ${name}?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Suspend', style: 'destructive', onPress: () => {
          setSpamReports(prev => prev.filter(s => s.id !== id));
          Alert.alert('Suspended', `${name}'s account has been suspended.`);
        }}
      ]);
    };

    const handleDismiss = (id) => {
      setSpamReports(prev => prev.filter(s => s.id !== id));
      Alert.alert('Success', 'Complaint dismissed.');
    };

    return (
      <View style={styles.flexContainer}>
        <InstitutionSelector />
        
        <View style={styles.spamCountBar}>
          {counts.map(item => (
            <View key={item.label} style={styles.spamBadgeChip}>
              <Text style={styles.spamBadgeLabel}>{item.label}:</Text>
              <View style={[styles.spamCountDot, item.count > 0 ? styles.spamCountDotActive : styles.spamCountDotEmpty]}>
                <Text style={styles.spamCountDotText}>{item.count}</Text>
              </View>
            </View>
          ))}
        </View>

        <FlatList
          data={list}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listPadding}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.avatarMini}>
                  <Text style={styles.avatarMiniText}>{item.name.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardSubText}>{item.branch} • Class of {item.year}</Text>
                </View>
                <View style={styles.instChip}>
                  <Text style={styles.instChipText}>{item.institution}</Text>
                </View>
              </View>

              <View style={styles.alertTextBox}>
                <Text style={styles.alertTextTitle}>Reason for report:</Text>
                <Text style={styles.alertTextContent}>{item.reason}</Text>
                <Text style={styles.alertTextMeta}>Reported by {item.reportedBy} on {item.date}</Text>
              </View>

              <View style={styles.cardActionRow}>
                <TouchableOpacity style={styles.btnSecondary} onPress={() => handleDismiss(item.id)}>
                  <Text style={styles.btnSecondaryText}>Dismiss</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnDanger} onPress={() => handleSuspend(item.id, item.name)}>
                  <Text style={styles.btnDangerText}>Suspend User</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="shield-checkmark-outline" size={48} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>Zero Spam Found</Text>
              <Text style={styles.emptySub}>No spam reports logged for this selection.</Text>
            </View>
          }
        />
      </View>
    );
  };

  // 3. Welcome Mail (to admin only)
  const renderWelcomeMail = () => {
    const handleSendWelcome = () => {
      if (!welcomeSubject.trim() || !welcomeBody.trim()) {
        Alert.alert('Required', 'Please fill in both the subject and the body.');
        return;
      }
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        // Add activity
        const newAct = {
          id: Date.now().toString(),
          type: 'Email Interaction',
          description: `Super Admin sent welcome email: ${welcomeSubject}`,
          institution: selectedInstitution === 'All' ? 'RVCE' : selectedInstitution,
          category: 'Welcome Mail',
          date: '17/06/2026',
        };
        setActivities(prev => [newAct, ...prev]);
        Alert.alert('Welcome Mail Sent', `Welcome email sent successfully to all admins of ${selectedInstitution} institution.`);
      }, 1000);
    };

    return (
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.moduleScroll}>
        <InstitutionSelector allowAll={true} />
        
        <View style={styles.alertBanner}>
          <Ionicons name="information-circle-outline" size={20} color="#0369A1" />
          <Text style={styles.alertBannerText}>
            Note: Welcome emails configured here are sent exclusively to institutional administrators upon onboarding.
          </Text>
        </View>

        <View style={styles.inputCard}>
          <Text style={styles.formLabel}>Email Subject</Text>
          <TextInput
            style={styles.textInput}
            value={welcomeSubject}
            onChangeText={setWelcomeSubject}
            placeholder="Welcome Subject"
          />

          <Text style={styles.formLabel}>Email Body Template</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={welcomeBody}
            onChangeText={setWelcomeBody}
            placeholder="Welcome message details..."
            multiline
            numberOfLines={6}
          />

          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchTitle}>Auto-Send Welcome Mail</Text>
              <Text style={styles.switchSubtitle}>Send instantly when a new Admin profile is created</Text>
            </View>
            <Switch
              value={welcomeAutoSend}
              onValueChange={setWelcomeAutoSend}
              trackColor={{ true: '#003366', false: '#CBD5E1' }}
            />
          </View>

          <TouchableOpacity style={styles.btnPrimary} onPress={handleSendWelcome} disabled={isProcessing}>
            {isProcessing ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.btnPrimaryText}>Send Welcome Mail Now</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  // 4. Master List (institutions, locations, batches, companies)
  const renderMasterList = () => {
    // subTabs: '1': Institutions, '2': Locations, '3': Batches, '4': Companies
    const filteredComp = MASTER_COMPANIES.filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    const filteredLoc = MASTER_LOCATIONS.filter(l => l.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return (
      <View style={styles.flexContainer}>
        {/* Sub-Tab Navigation */}
        <View style={styles.subTabsHeader}>
          {['Institutes', 'Locations', 'Batches', 'Companies'].map((tabName, index) => {
            const tabId = (index + 1).toString();
            return (
              <TouchableOpacity
                key={tabId}
                style={[styles.subTabButton, activeSubTab === tabId && styles.subTabActive]}
                onPress={() => {
                  setActiveSubTab(tabId);
                  setSearchQuery('');
                }}
              >
                <Text style={[styles.subTabText, activeSubTab === tabId && styles.subTabTextActive]}>
                  {tabName}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Search */}
        {activeSubTab !== '3' && (
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#94A3B8" />
            <TextInput
              style={styles.searchBarInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search master index..."
            />
          </View>
        )}

        {/* Inner Content */}
        <ScrollView contentContainerStyle={styles.listPadding} showsVerticalScrollIndicator={false}>
          {activeSubTab === '1' && (
            INSTITUTIONS.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase())).map(inst => (
              <View key={inst.id} style={styles.simpleItemCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{inst.name}</Text>
                  <Text style={styles.cardSubText}>{inst.location} • Est. {inst.established}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.cardPrimaryVal}>{inst.totalAlumni}</Text>
                  <Text style={styles.cardSubText}>Alumni</Text>
                </View>
              </View>
            ))
          )}

          {activeSubTab === '2' && (
            filteredLoc.map((loc, idx) => {
              const matches = INSTITUTIONS.filter(i => i.location === loc).length;
              return (
                <View key={idx} style={styles.simpleItemCard}>
                  <Text style={styles.cardTitle}>{loc}</Text>
                  <View style={styles.countBadge}>
                    <Text style={styles.countBadgeText}>{matches} {matches === 1 ? 'Institute' : 'Institutes'}</Text>
                  </View>
                </View>
              );
            })
          )}

          {activeSubTab === '3' && (
            MASTER_BATCHES.map((batch, idx) => (
              <View key={idx} style={styles.simpleItemCard}>
                <Text style={styles.cardTitle}>Batch of {batch}</Text>
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>Cohort Group</Text>
                </View>
              </View>
            ))
          )}

          {activeSubTab === '4' && (
            filteredComp.map((comp, idx) => (
              <View key={idx} style={styles.simpleItemCard}>
                <Text style={styles.cardTitle}>{comp}</Text>
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>Corporate Partner</Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    );
  };

  // 5. Administrator Management
  const renderAdministrator = () => {
    const list = filterByInstitution(admins);

    const handleCreateAdmin = () => {
      if (!adminFormName.trim() || !adminFormEmail.trim() || !adminFormPassword.trim()) {
        Alert.alert('Error', 'Please fill in all the details.');
        return;
      }
      const newAdmin = {
        id: Date.now().toString(),
        name: adminFormName,
        email: adminFormEmail.toLowerCase().trim(),
        password: adminFormPassword,
        institution: adminFormInst,
        role: 'Admin',
        status: 'Active',
        lastLogin: 'Never logged in',
        passwordChangedAt: '17/06/2026',
      };
      setAdmins(prev => [...prev, newAdmin]);
      setShowAdminModal(false);
      setAdminFormName('');
      setAdminFormEmail('');
      setAdminFormPassword('');
      Alert.alert('Success', `Admin account created for ${adminFormName} under ${adminFormInst}`);
    };

    const handleDeleteAdmin = (id, name) => {
      Alert.alert('Delete Administrator', `Are you sure you want to delete ${name}'s admin access?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          setAdmins(prev => prev.filter(a => a.id !== id));
          Alert.alert('Deleted', 'Admin profile removed successfully.');
        }}
      ]);
    };

    return (
      <View style={styles.flexContainer}>
        <InstitutionSelector />

        <TouchableOpacity style={styles.btnActionTop} onPress={() => setShowAdminModal(true)}>
          <Ionicons name="person-add-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.btnActionTopText}>Create New Admin</Text>
        </TouchableOpacity>

        <FlatList
          data={list}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listPadding}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.avatarMini}>
                  <Text style={styles.avatarMiniText}>{item.name.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardSubText}>{item.email}</Text>
                </View>
                <View style={styles.instChip}>
                  <Text style={styles.instChipText}>{item.institution}</Text>
                </View>
              </View>

              {/* Password details (visible toggle) */}
              <View style={styles.passwordContainer}>
                <Text style={styles.passwordLabel}>Login Password:</Text>
                <View style={styles.passwordRow}>
                  <Text style={styles.passwordValue}>
                    {visiblePasswords[item.id] ? item.password : '••••••••'}
                  </Text>
                  <TouchableOpacity onPress={() => togglePasswordVisibility(item.id)}>
                    <Ionicons name={visiblePasswords[item.id] ? 'eye-off-outline' : 'eye-outline'} size={18} color="#64748B" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.metaInfoBox}>
                <Text style={styles.metaText}>Last login: {item.lastLogin}</Text>
                <Text style={styles.metaText}>Password changed: {item.passwordChangedAt}</Text>
              </View>

              <View style={styles.cardActionRow}>
                <TouchableOpacity style={styles.btnSecondary} onPress={() => Alert.alert('Edit Admin', 'Edit properties modal placeholder')}>
                  <Text style={styles.btnSecondaryText}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnDanger} onPress={() => handleDeleteAdmin(item.id, item.name)}>
                  <Text style={styles.btnDangerText}>Remove Admin</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        {/* Create Admin Modal */}
        <Modal visible={showAdminModal} animationType="slide" transparent>
          <View style={styles.modalBg}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>New Institution Admin</Text>
                <TouchableOpacity onPress={() => setShowAdminModal(false)}>
                  <Ionicons name="close" size={24} color="#0F172A" />
                </TouchableOpacity>
              </View>
              <ScrollView contentContainerStyle={{ padding: 20 }}>
                <Text style={styles.formLabel}>Institution</Text>
                <View style={styles.pickerWrapper}>
                  {['RVCE', 'RVITM', 'RVPU', 'RVIS'].map((inst) => (
                    <TouchableOpacity
                      key={inst}
                      style={[styles.pickerChip, adminFormInst === inst && styles.pickerChipActive]}
                      onPress={() => setAdminFormInst(inst)}
                    >
                      <Text style={[styles.pickerChipText, adminFormInst === inst && styles.pickerChipTextActive]}>{inst}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.formLabel}>Name</Text>
                <TextInput style={styles.textInput} value={adminFormName} onChangeText={setAdminFormName} placeholder="Admin Full Name" />

                <Text style={styles.formLabel}>Email ID</Text>
                <TextInput style={styles.textInput} value={adminFormEmail} onChangeText={setAdminFormEmail} placeholder="admin@institution.edu" autoCapitalize="none" keyboardType="email-address" />

                <Text style={styles.formLabel}>Initial Login Password</Text>
                <View style={styles.passwordInputWrap}>
                  <TextInput style={{ flex: 1, color: '#0F172A', paddingVertical: 8 }} value={adminFormPassword} onChangeText={setAdminFormPassword} placeholder="Enter Password" secureTextEntry={false} />
                  <TouchableOpacity
                    style={styles.btnGenerate}
                    onPress={() => {
                      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
                      let pass = '';
                      for (let i = 0; i < 10; i++) {
                        pass += chars.charAt(Math.floor(Math.random() * chars.length));
                      }
                      setAdminFormPassword(pass);
                    }}
                  >
                    <Text style={styles.btnGenerateText}>Generate</Text>
                  </TouchableOpacity>
                </View>

                {/* Password Strength Indicator */}
                {adminFormPassword.length > 0 && (() => {
                  const strength = getPasswordStrength(adminFormPassword);
                  return (
                    <View style={{ marginTop: 8, marginBottom: 12 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600' }}>Password Strength:</Text>
                        <Text style={{ fontSize: 11, color: strength.color, fontWeight: '700' }}>{strength.text}</Text>
                      </View>
                      <View style={styles.strengthBarBg}>
                        <View style={[styles.strengthBarFill, { width: `${(strength.score / 5) * 100}%`, backgroundColor: strength.color }]} />
                      </View>
                    </View>
                  );
                })()}

                <TouchableOpacity style={[styles.btnPrimary, { marginTop: 24 }]} onPress={handleCreateAdmin}>
                  <Text style={styles.btnPrimaryText}>Create Admin Account</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  // 6. Membership Request (approve/reject/delete, view details)
  const renderMembershipRequest = () => {
    // subTabs: '1': All, '2': Pending, '3': Approved, '4': Rejected
    const list = filterByInstitution(membershipRequests);
    const filteredByStatus = list.filter((r) => {
      if (activeSubTab === '1') return true;
      if (activeSubTab === '2') return r.status === 'pending';
      if (activeSubTab === '3') return r.status === 'approved';
      return r.status === 'rejected';
    });

    const handleApprove = (id, name) => {
      setMembershipRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'approved', adminAction: 'Approved by Super Admin' } : r))
      );
      Alert.alert('Approved', `${name}'s request approved.`);
    };

    const handleReject = (id, name) => {
      setMembershipRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'rejected', adminAction: 'Rejected by Super Admin' } : r))
      );
      Alert.alert('Rejected', `${name}'s request rejected.`);
    };

    const handleDeleteAccount = (id, name) => {
      Alert.alert('Delete Profile', `Delete registration request of ${name}?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          setMembershipRequests((prev) => prev.filter((r) => r.id !== id));
          Alert.alert('Deleted', 'Account request deleted.');
        }}
      ]);
    };

    return (
      <View style={styles.flexContainer}>
        <InstitutionSelector />

        {/* Status Tab Pills */}
        <View style={styles.subTabsHeader}>
          {['All', 'Pending', 'Approved', 'Rejected'].map((statusName, idx) => {
            const tabId = (idx + 1).toString();
            return (
              <TouchableOpacity
                key={tabId}
                style={[styles.subTabButton, activeSubTab === tabId && styles.subTabActive]}
                onPress={() => setActiveSubTab(tabId)}
              >
                <Text style={[styles.subTabText, activeSubTab === tabId && styles.subTabTextActive]}>
                  {statusName}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <FlatList
          data={filteredByStatus}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listPadding}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.avatarMini}>
                  <Text style={styles.avatarMiniText}>{item.name.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardSubText}>{item.branch} • Class of {item.year}</Text>
                </View>
                <View style={[styles.statusTag, item.status === 'approved' ? styles.statusActive : item.status === 'pending' ? styles.statusPending : styles.statusRejected]}>
                  <Text style={item.status === 'approved' ? styles.statusActiveText : item.status === 'pending' ? styles.statusPendingText : styles.statusRejectedText}>
                    {item.status.toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.metaInfoBox}>
                <Text style={styles.metaText}>Verification Proof: {item.proof}</Text>
                {item.adminAction && (
                  <Text style={[styles.metaText, { color: '#0F172A', fontWeight: '600', marginTop: 4 }]}>
                    Action: {item.adminAction}
                  </Text>
                )}
              </View>

              <View style={styles.cardActionRow}>
                <TouchableOpacity style={styles.btnSecondary} onPress={() => setAlumniDetailModal(item)}>
                  <Text style={styles.btnSecondaryText}>View Details</Text>
                </TouchableOpacity>

                {item.status === 'pending' && (
                  <>
                    <TouchableOpacity style={styles.btnSuccess} onPress={() => handleApprove(item.id, item.name)}>
                      <Text style={styles.btnSuccessText}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnDanger} onPress={() => handleReject(item.id, item.name)}>
                      <Text style={styles.btnDangerText}>Reject</Text>
                    </TouchableOpacity>
                  </>
                )}

                {item.status !== 'pending' && (
                  <TouchableOpacity style={styles.btnDanger} onPress={() => handleDeleteAccount(item.id, item.name)}>
                    <Text style={styles.btnDangerText}>Delete Request</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="clipboard-outline" size={48} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>No Requests</Text>
              <Text style={styles.emptySub}>No membership requests in this filter.</Text>
            </View>
          }
        />

        {/* Details Modal */}
        {alumniDetailModal && (
          <Modal visible={true} animationType="fade" transparent>
            <View style={styles.modalBg}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Alumni Detailed Profile</Text>
                  <TouchableOpacity onPress={() => setAlumniDetailModal(null)}>
                    <Ionicons name="close" size={24} color="#0F172A" />
                  </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={{ padding: 20 }}>
                  <Text style={styles.modalSectionTitle}>Basic Information</Text>
                  <Text style={styles.modalText}>Name: {alumniDetailModal.name}</Text>
                  <Text style={styles.modalText}>Institution: {alumniDetailModal.institution}</Text>
                  <Text style={styles.modalText}>Email: {alumniDetailModal.email}</Text>
                  <Text style={styles.modalText}>Phone: {alumniDetailModal.phone}</Text>
                  <Text style={styles.modalText}>Graduation Year: {alumniDetailModal.details.graduationYear}</Text>

                  <Text style={[styles.modalSectionTitle, { marginTop: 16 }]}>Employment Info</Text>
                  <Text style={styles.modalText}>Company: {alumniDetailModal.details.company}</Text>
                  <Text style={styles.modalText}>Designation: {alumniDetailModal.details.designation}</Text>
                  <Text style={styles.modalText}>LinkedIn: {alumniDetailModal.details.linkedIn}</Text>
                </ScrollView>
              </View>
            </View>
          </Modal>
        )}
      </View>
    );
  };

  // 7. Network Settings (AlmaConnect-inspired)
  const renderNetworkSettings = () => {
    // Requires a selected institution
    const currentInst = selectedInstitution === 'All' ? 'RVCE' : selectedInstitution;
    const settings = networkSettings[currentInst];

    const updateField = (field, value) => {
      setNetworkSettings((prev) => ({
        ...prev,
        [currentInst]: {
          ...prev[currentInst],
          [field]: value,
        },
      }));
    };

    const handleSaveSettings = () => {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        Alert.alert('Settings Saved', `Network properties updated for ${currentInst}`);
      }, 1000);
    };

    return (
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.moduleScroll}>
        <InstitutionSelector allowAll={false} />

        <View style={styles.inputCard}>
          <Text style={styles.sectionHeaderTitle}>General Configuration</Text>
          <Text style={styles.formLabel}>Institution Full Name</Text>
          <TextInput
            style={styles.textInput}
            value={settings.institutionName}
            onChangeText={(v) => updateField('institutionName', v)}
          />

          <Text style={styles.formLabel}>Title Shortcut</Text>
          <TextInput
            style={styles.textInput}
            value={settings.shortTitle}
            onChangeText={(v) => updateField('shortTitle', v)}
          />

          <Text style={styles.formLabel}>Institution URL</Text>
          <TextInput
            style={styles.textInput}
            value={settings.website}
            onChangeText={(v) => updateField('website', v)}
          />

          <Text style={styles.sectionHeaderTitle}>Custom Labels</Text>
          <View style={styles.rowGrid}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.formLabel}>Alumni Label</Text>
              <TextInput style={styles.textInput} value={settings.alumniText} onChangeText={(v) => updateField('alumniText', v)} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.formLabel}>Students Label</Text>
              <TextInput style={styles.textInput} value={settings.studentsText} onChangeText={(v) => updateField('studentsText', v)} />
            </View>
          </View>

          <View style={styles.rowGrid}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.formLabel}>Faculty Label</Text>
              <TextInput style={styles.textInput} value={settings.facultyText} onChangeText={(v) => updateField('facultyText', v)} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.formLabel}>Classmate Label</Text>
              <TextInput style={styles.textInput} value={settings.batchmatesText} onChangeText={(v) => updateField('batchmatesText', v)} />
            </View>
          </View>

          <Text style={styles.sectionHeaderTitle}>Branding (Theme Colors)</Text>

          <Text style={styles.formLabel}>Quick Palette Presets</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 12, paddingBottom: 4 }}>
            {[
              { name: 'Ocean Blue', primary: '#003366', secondary: '#00A99C' },
              { name: 'Emerald', primary: '#059669', secondary: '#10B981' },
              { name: 'Sunset', primary: '#EA580C', secondary: '#F59E0B' },
              { name: 'Amethyst', primary: '#7C3AED', secondary: '#A78BFA' },
              { name: 'Slate Dark', primary: '#1E293B', secondary: '#64748B' },
            ].map((preset) => (
              <TouchableOpacity
                key={preset.name}
                style={styles.presetColorChip}
                activeOpacity={0.7}
                onPress={() => {
                  updateField('primaryColor', preset.primary);
                  updateField('secondaryColor', preset.secondary);
                }}
              >
                <View style={{ flexDirection: 'row', gap: 4, marginRight: 6 }}>
                  <View style={[styles.presetSwatchMini, { backgroundColor: preset.primary }]} />
                  <View style={[styles.presetSwatchMini, { backgroundColor: preset.secondary }]} />
                </View>
                <Text style={styles.presetColorChipText}>{preset.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.rowGrid}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.formLabel}>Primary Theme Color</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={[styles.colorBox, { backgroundColor: settings.primaryColor }]} />
                <TextInput style={[styles.textInput, { flex: 1 }]} value={settings.primaryColor} onChangeText={(v) => updateField('primaryColor', v)} />
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.formLabel}>Secondary Theme Color</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={[styles.colorBox, { backgroundColor: settings.secondaryColor }]} />
                <TextInput style={[styles.textInput, { flex: 1 }]} value={settings.secondaryColor} onChangeText={(v) => updateField('secondaryColor', v)} />
              </View>
            </View>
          </View>

          <Text style={styles.sectionHeaderTitle}>Signup & Toggles</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchTitle}>Manual Moderator Approval</Text>
            <Switch value={settings.manualApproval} onValueChange={(v) => updateField('manualApproval', v)} trackColor={{ true: '#003366' }} />
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.switchTitle}>Email Identity Vouching</Text>
            <Switch value={settings.emailVouching} onValueChange={(v) => updateField('emailVouching', v)} trackColor={{ true: '#003366' }} />
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.switchTitle}>Allow Unverified Logins</Text>
            <Switch value={settings.allowUnverified} onValueChange={(v) => updateField('allowUnverified', v)} trackColor={{ true: '#003366' }} />
          </View>

          <Text style={styles.sectionHeaderTitle}>Features Access Control</Text>
          <View style={styles.rowGrid}>
            <View style={styles.featureBox}>
              <Text style={styles.featureText}>Jobs Portal</Text>
              <Switch value={settings.displayJobs} onValueChange={(v) => updateField('displayJobs', v)} trackColor={{ true: '#003366' }} />
            </View>
            <View style={styles.featureBox}>
              <Text style={styles.featureText}>Events</Text>
              <Switch value={settings.displayEvents} onValueChange={(v) => updateField('displayEvents', v)} trackColor={{ true: '#003366' }} />
            </View>
          </View>

          <View style={styles.rowGrid}>
            <View style={styles.featureBox}>
              <Text style={styles.featureText}>Mentorship</Text>
              <Switch value={settings.displayMentorship} onValueChange={(v) => updateField('displayMentorship', v)} trackColor={{ true: '#003366' }} />
            </View>
            <View style={styles.featureBox}>
              <Text style={styles.featureText}>Alumni Card</Text>
              <Switch value={settings.displayAlumniCard} onValueChange={(v) => updateField('displayAlumniCard', v)} trackColor={{ true: '#003366' }} />
            </View>
          </View>

          <TouchableOpacity style={[styles.btnPrimary, { marginTop: 24 }]} onPress={handleSaveSettings} disabled={isProcessing}>
            {isProcessing ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.btnPrimaryText}>Save Settings Configuration</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  // 8. Bulk Import
  const renderBulkImport = () => {
    const list = filterByInstitution(imports);

    const handleDownloadTemplate = () => {
      Alert.alert('CSV Template Downloaded', 'The bulk upload skeleton CSV has been saved to your downloads directory.');
    };

    const handleUploadSimulate = () => {
      setUploadedRoster([
        { id: '1', name: 'Rohan Deshmukh', email: 'rohan.d@example.com', course: 'BE, CSE', batch: '2024' },
        { id: '2', name: 'Neha Patil', email: 'neha.p@example.com', course: 'BE, ISE', batch: '2023' },
        { id: '3', name: 'Aditya Hegde', email: 'aditya.h@example.com', course: 'MBA', batch: '2022' },
      ]);
      Alert.alert('Roster Loaded', 'Mock spreadsheet roster loaded! You can now edit cells directly before importing.');
    };

    const handleImportSimulate = () => {
      if (!uploadedRoster || uploadedRoster.length === 0) {
        Alert.alert('No Data', 'Please load or add data to the spreadsheet first.');
        return;
      }
      setIsProcessing(true);
      setProgressVal(0);
      const interval = setInterval(() => {
        setProgressVal((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsProcessing(false);
            const inst = selectedInstitution === 'All' ? 'RVCE' : selectedInstitution;
            const newImport = {
              id: Date.now().toString(),
              fileName: `ingested_sheet_${inst.toLowerCase()}.csv`,
              institution: inst,
              records: uploadedRoster.length,
              successful: uploadedRoster.filter(r => r.name && r.email).length,
              failed: uploadedRoster.filter(r => !r.name || !r.email).length,
              date: '17/06/2026',
              status: 'Completed',
            };
            setImports((prevList) => [newImport, ...prevList]);
            setUploadedRoster(null);
            Alert.alert(
              'Import Complete',
              `${newImport.successful} alumni profiles successfully imported to ${inst}.`
            );
            return 100;
          }
          return prev + 25;
        });
      }, 300);
    };

    return (
      <View style={styles.flexContainer}>
        <InstitutionSelector />

        <ScrollView contentContainerStyle={styles.listPadding} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Text style={styles.cardHeading}>Bulk Ingest Portal</Text>
            
            <TouchableOpacity style={styles.btnOutline} onPress={handleDownloadTemplate}>
              <Ionicons name="download-outline" size={16} color="#003366" style={{ marginRight: 6 }} />
              <Text style={styles.btnOutlineText}>Download CSV Template</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.uploadArea} onPress={handleUploadSimulate}>
              <Ionicons name="cloud-upload-outline" size={36} color="#94A3B8" />
              <Text style={styles.uploadTitle}>Choose file to import</Text>
              <Text style={styles.uploadSubtitle}>Supports CSV, XLS or XLSX roster templates</Text>
            </TouchableOpacity>

            {uploadedRoster && (
              <View style={styles.sheetContainer}>
                <Text style={styles.sheetTitle}>Spreadsheet Editor Preview</Text>
                
                {/* Headers */}
                <View style={styles.sheetHeaderRow}>
                  <Text style={[styles.sheetHeaderCell, { flex: 2 }]}>Name</Text>
                  <Text style={[styles.sheetHeaderCell, { flex: 3 }]}>Email</Text>
                  <Text style={[styles.sheetHeaderCell, { flex: 2 }]}>Course</Text>
                  <Text style={[styles.sheetHeaderCell, { flex: 1.5 }]}>Batch</Text>
                  <Text style={[styles.sheetHeaderCell, { flex: 1 }]}></Text>
                </View>

                {/* Rows */}
                {uploadedRoster.map((row) => (
                  <View key={row.id} style={styles.sheetRow}>
                    <TextInput
                      style={[styles.sheetCellInput, { flex: 2 }]}
                      value={row.name}
                      onChangeText={(txt) => {
                        setUploadedRoster(prev => prev.map(r => r.id === row.id ? { ...r, name: txt } : r));
                      }}
                    />
                    <TextInput
                      style={[styles.sheetCellInput, { flex: 3 }]}
                      value={row.email}
                      onChangeText={(txt) => {
                        setUploadedRoster(prev => prev.map(r => r.id === row.id ? { ...r, email: txt } : r));
                      }}
                    />
                    <TextInput
                      style={[styles.sheetCellInput, { flex: 2 }]}
                      value={row.course}
                      onChangeText={(txt) => {
                        setUploadedRoster(prev => prev.map(r => r.id === row.id ? { ...r, course: txt } : r));
                      }}
                    />
                    <TextInput
                      style={[styles.sheetCellInput, { flex: 1.5 }]}
                      value={row.batch}
                      onChangeText={(txt) => {
                        setUploadedRoster(prev => prev.map(r => r.id === row.id ? { ...r, batch: txt } : r));
                      }}
                    />
                    <TouchableOpacity
                      style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                      onPress={() => {
                        setUploadedRoster(prev => prev.filter(r => r.id !== row.id));
                      }}
                    >
                      <Ionicons name="trash-outline" size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                ))}

                {/* Spreadsheet controls */}
                <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
                  <TouchableOpacity 
                    style={styles.sheetAddBtn}
                    onPress={() => {
                      const newId = String(Date.now());
                      setUploadedRoster(prev => [...prev, { id: newId, name: '', email: '', course: '', batch: '' }]);
                    }}
                  >
                    <Ionicons name="add" size={16} color="#003366" />
                    <Text style={styles.sheetAddBtnText}>Add Row</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.sheetClearBtn}
                    onPress={() => setUploadedRoster(null)}
                  >
                    <Text style={styles.sheetClearBtnText}>Discard</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <View style={styles.mappingList}>
              <Text style={styles.mappingLabel}> Roster Column Mapping Preview:</Text>
              <Text style={styles.mappingText}>✓ [alumni_name] → Full Name</Text>
              <Text style={styles.mappingText}>✓ [personal_email] → Username / Contact</Text>
              <Text style={styles.mappingText}>✓ [grad_year] → Batch Index</Text>
              <Text style={styles.mappingText}>✓ [degree_course] → Branch / Course</Text>
            </View>

            {isProcessing && (
              <View style={{ marginVertical: 12 }}>
                <Text style={styles.progressText}>Ingesting data... {progressVal}%</Text>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${progressVal}%` }]} />
                </View>
              </View>
            )}

            <TouchableOpacity style={styles.btnPrimary} onPress={handleImportSimulate} disabled={isProcessing}>
              <Text style={styles.btnPrimaryText}>Start Bulk Import</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionHeaderTitle}>Recent Import History</Text>
          {list.map((item) => (
            <View key={item.id} style={styles.historyCard}>
              <View style={styles.cardHeaderRow}>
                <Ionicons name="document-text-outline" size={20} color="#003366" />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.cardTitle}>{item.fileName}</Text>
                  <Text style={styles.cardSubText}>{item.date} • {item.institution}</Text>
                </View>
                <View style={[styles.statusTag, styles.statusActive]}>
                  <Text style={styles.statusActiveText}>{item.status}</Text>
                </View>
              </View>
              <View style={styles.historyStatsRow}>
                <Text style={styles.historyStatText}>Records: {item.records}</Text>
                <Text style={[styles.historyStatText, { color: '#10B981' }]}>Success: {item.successful}</Text>
                <Text style={[styles.historyStatText, { color: '#EF4444' }]}>Failed: {item.failed}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  // 9. Placement Tool
  const renderPlacementTool = () => {
    const list = filterByInstitution(placements);

    const handleAddPlacement = () => {
      if (!placementFormCompany.trim() || !placementFormCount.trim()) {
        Alert.alert('Error', 'Please fill in Company Name and Alumni Count.');
        return;
      }
      const newPlace = {
        id: Date.now().toString(),
        company: placementFormCompany,
        industry: placementFormInd || 'Corporate Systems',
        count: parseInt(placementFormCount) || 1,
        institution: placementFormInst,
      };
      setPlacements(prev => [...prev, newPlace].sort((a,b) => b.count - a.count));
      setShowPlacementModal(false);
      setPlacementFormCompany('');
      setPlacementFormInd('');
      setPlacementFormCount('');
      Alert.alert('Success', 'Corporate placement records registered.');
    };

    const handleDelete = (id) => {
      setPlacements(prev => prev.filter(p => p.id !== id));
      Alert.alert('Success', 'Placement record deleted.');
    };

    return (
      <View style={styles.flexContainer}>
        <InstitutionSelector />

        <TouchableOpacity style={styles.btnActionTop} onPress={() => setShowPlacementModal(true)}>
          <Ionicons name="briefcase-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.btnActionTopText}>Register New Placement</Text>
        </TouchableOpacity>

        <FlatList
          data={list}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listPadding}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.avatarMini}>
                  <Ionicons name="business-outline" size={18} color="#003366" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.cardTitle}>{item.company}</Text>
                  <Text style={styles.cardSubText}>{item.industry}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.cardPrimaryVal}>{item.count}</Text>
                  <Text style={styles.cardSubText}>Hired</Text>
                </View>
              </View>

              <View style={[styles.instChip, { alignSelf: 'flex-start', marginTop: 8 }]}>
                <Text style={styles.instChipText}>{item.institution}</Text>
              </View>

              <View style={[styles.cardActionRow, { marginTop: 12 }]}>
                <TouchableOpacity style={styles.btnSecondary} onPress={() => Alert.alert('Edit', 'Edit placement data placeholder')}>
                  <Text style={styles.btnSecondaryText}>Edit Metrics</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnDanger} onPress={() => handleDelete(item.id)}>
                  <Text style={styles.btnDangerText}>Delete Record</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        {/* Add Placement Modal */}
        <Modal visible={showPlacementModal} animationType="slide" transparent>
          <View style={styles.modalBg}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add Corporate Placement</Text>
                <TouchableOpacity onPress={() => setShowPlacementModal(false)}>
                  <Ionicons name="close" size={24} color="#0F172A" />
                </TouchableOpacity>
              </View>
              <ScrollView contentContainerStyle={{ padding: 20 }}>
                <Text style={styles.formLabel}>Institution</Text>
                <View style={styles.pickerWrapper}>
                  {['RVCE', 'RVITM', 'RVPU', 'RVIS'].map((inst) => (
                    <TouchableOpacity
                      key={inst}
                      style={[styles.pickerChip, placementFormInst === inst && styles.pickerChipActive]}
                      onPress={() => setPlacementFormInst(inst)}
                    >
                      <Text style={[styles.pickerChipText, placementFormInst === inst && styles.pickerChipTextActive]}>{inst}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.formLabel}>Company Name</Text>
                <TextInput style={styles.textInput} value={placementFormCompany} onChangeText={setPlacementFormCompany} placeholder="e.g. Cisco Systems" />

                <Text style={styles.formLabel}>Industry Sector</Text>
                <TextInput style={styles.textInput} value={placementFormInd} onChangeText={setPlacementFormInd} placeholder="e.g. IT Services / Networking" />

                <Text style={styles.formLabel}>Total Alumni Placed</Text>
                <TextInput style={styles.textInput} value={placementFormCount} onChangeText={setPlacementFormCount} placeholder="Alumni Headcount" keyboardType="numeric" />

                <TouchableOpacity style={[styles.btnPrimary, { marginTop: 24 }]} onPress={handleAddPlacement}>
                  <Text style={styles.btnPrimaryText}>Add Placement Record</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  // 10. Logs/Stats (5 cards with horizontal View-based bar charts matching layout)
  const renderLogsStats = () => {
    return (
      <View style={styles.flexContainer}>
        {/* Date Selector Row */}
        <View style={styles.datePickerRow}>
          <View style={styles.dateField}>
            <Text style={styles.dateLabel}>Start Date</Text>
            <TextInput style={styles.dateInput} value={statsStartDate} onChangeText={setStatsStartDate} />
          </View>
          <View style={styles.dateField}>
            <Text style={styles.dateLabel}>End Date</Text>
            <TextInput style={styles.dateInput} value={statsEndDate} onChangeText={setStatsEndDate} />
          </View>
          <TouchableOpacity style={styles.btnApply} onPress={() => Alert.alert('Date Range Applied', `Logs filtered between ${statsStartDate} and ${statsEndDate}`)}>
            <Text style={styles.btnApplyText}>Apply</Text>
          </TouchableOpacity>
        </View>

        <InstitutionSelector />

        <ScrollView contentContainerStyle={styles.listPadding} showsVerticalScrollIndicator={false}>
          {/* Card 1: Database Signups */}
          <TouchableOpacity 
            style={styles.statCard} 
            activeOpacity={0.9} 
            onPress={() => setExpandedChart(expandedChart === 'signups' ? null : 'signups')}
          >
            <View style={styles.statCardHeader}>
              <Text style={styles.statCardHeading}>Database Signups</Text>
              <Ionicons 
                name={expandedChart === 'signups' ? 'chevron-up-circle' : 'chevron-down-circle'} 
                size={20} 
                color="#0D9488" 
              />
            </View>
            <View style={styles.statNumbersRow}>
              <View>
                <Text style={styles.statHugeText}>24</Text>
                <Text style={styles.statSubtitleText}>Users signed up</Text>
              </View>
              <View style={{ marginLeft: 24 }}>
                <Text style={styles.statHugeText}>39</Text>
                <Text style={styles.statSubtitleText}>Profiles updated</Text>
              </View>
            </View>
            <View style={styles.chartWrapper}>
              <View style={styles.chartBarRow}>
                <Text style={styles.chartBarLabel}>Signups</Text>
                <View style={styles.chartBarTrack}>
                  <View style={[styles.chartBarFill, { width: '38%', backgroundColor: '#0D9488' }]} />
                </View>
                <Text style={styles.chartBarValue}>38%</Text>
              </View>
              <View style={styles.chartBarRow}>
                <Text style={styles.chartBarLabel}>Updates</Text>
                <View style={styles.chartBarTrack}>
                  <View style={[styles.chartBarFill, { width: '60%', backgroundColor: '#0D9488' }]} />
                </View>
                <Text style={styles.chartBarValue}>60%</Text>
              </View>
            </View>
            {expandedChart === 'signups' ? (
              <View style={styles.chartDetailsContainer}>
                <Text style={styles.chartDetailsTitle}>Institution Breakdown</Text>
                <View style={styles.chartDetailsTable}>
                  <View style={styles.chartDetailsHeaderRow}>
                    <Text style={[styles.chartDetailsHeaderCell, { flex: 2 }]}>Institute</Text>
                    <Text style={[styles.chartDetailsHeaderCellText, { flex: 1.5 }]}>Signups</Text>
                    <Text style={[styles.chartDetailsHeaderCellText, { flex: 1.5 }]}>Updates</Text>
                  </View>
                  {[
                    { inst: 'RVCE', val1: 12, val2: 20 },
                    { inst: 'RVITM', val1: 8, val2: 12 },
                    { inst: 'RVPU', val1: 3, val2: 5 },
                    { inst: 'RVIS', val1: 1, val2: 2 },
                  ].map((row, idx) => (
                    <View key={idx} style={styles.chartDetailsRow}>
                      <Text style={[styles.chartDetailsCellLabel, { flex: 2 }]}>{row.inst}</Text>
                      <Text style={[styles.chartDetailsCellVal, { flex: 1.5 }]}>{row.val1}</Text>
                      <Text style={[styles.chartDetailsCellVal, { flex: 1.5 }]}>{row.val2}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              <Text style={styles.chartDetailsHelpText}>Tap card to expand institution breakdown</Text>
            )}
          </TouchableOpacity>

          {/* Card 2: Engagement / News Feed Visitors */}
          <TouchableOpacity 
            style={styles.statCard} 
            activeOpacity={0.9} 
            onPress={() => setExpandedChart(expandedChart === 'engagement' ? null : 'engagement')}
          >
            <View style={styles.statCardHeader}>
              <Text style={styles.statCardHeading}>Engagement / News Feed Visitors</Text>
              <Ionicons 
                name={expandedChart === 'engagement' ? 'chevron-up-circle' : 'chevron-down-circle'} 
                size={20} 
                color="#0D9488" 
              />
            </View>
            <View style={styles.statNumbersRow}>
              <View>
                <Text style={styles.statHugeText}>200</Text>
                <Text style={styles.statSubtitleText}>Visitors on news feed</Text>
              </View>
              <View style={{ marginLeft: 24 }}>
                <Text style={styles.statHugeText}>8081</Text>
                <Text style={styles.statSubtitleText}>Visitors on job page</Text>
              </View>
            </View>
            <View style={styles.chartWrapper}>
              <View style={styles.chartBarRow}>
                <Text style={styles.chartBarLabel}>Feed</Text>
                <View style={styles.chartBarTrack}>
                  <View style={[styles.chartBarFill, { width: '20%', backgroundColor: '#0D9488' }]} />
                </View>
                <Text style={styles.chartBarValue}>2.4%</Text>
              </View>
              <View style={styles.chartBarRow}>
                <Text style={styles.chartBarLabel}>Jobs</Text>
                <View style={styles.chartBarTrack}>
                  <View style={[styles.chartBarFill, { width: '90%', backgroundColor: '#0D9488' }]} />
                </View>
                <Text style={styles.chartBarValue}>97.6%</Text>
              </View>
            </View>
            {expandedChart === 'engagement' ? (
              <View style={styles.chartDetailsContainer}>
                <Text style={styles.chartDetailsTitle}>Institution Breakdown</Text>
                <View style={styles.chartDetailsTable}>
                  <View style={styles.chartDetailsHeaderRow}>
                    <Text style={[styles.chartDetailsHeaderCell, { flex: 2 }]}>Institute</Text>
                    <Text style={[styles.chartDetailsHeaderCellText, { flex: 1.5 }]}>Feed</Text>
                    <Text style={[styles.chartDetailsHeaderCellText, { flex: 1.5 }]}>Jobs</Text>
                  </View>
                  {[
                    { inst: 'RVCE', val1: 120, val2: 5000 },
                    { inst: 'RVITM', val1: 60, val2: 2500 },
                    { inst: 'RVPU', val1: 15, val2: 400 },
                    { inst: 'RVIS', val1: 5, val2: 181 },
                  ].map((row, idx) => (
                    <View key={idx} style={styles.chartDetailsRow}>
                      <Text style={[styles.chartDetailsCellLabel, { flex: 2 }]}>{row.inst}</Text>
                      <Text style={[styles.chartDetailsCellVal, { flex: 1.5 }]}>{row.val1}</Text>
                      <Text style={[styles.chartDetailsCellVal, { flex: 1.5 }]}>{row.val2}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              <Text style={styles.chartDetailsHelpText}>Tap card to expand institution breakdown</Text>
            )}
          </TouchableOpacity>

          {/* Card 3: Overall Users */}
          <TouchableOpacity 
            style={styles.statCard} 
            activeOpacity={0.9} 
            onPress={() => setExpandedChart(expandedChart === 'users' ? null : 'users')}
          >
            <View style={styles.statCardHeader}>
              <Text style={styles.statCardHeading}>Overall Users</Text>
              <Ionicons 
                name={expandedChart === 'users' ? 'chevron-up-circle' : 'chevron-down-circle'} 
                size={20} 
                color="#0D9488" 
              />
            </View>
            <View style={styles.statNumbersRowMulti}>
              <View style={styles.numItem}>
                <Text style={styles.statHugeText}>9755</Text>
                <Text style={styles.statSubtitleText}>Registered users</Text>
              </View>
              <View style={styles.numItem}>
                <Text style={styles.statHugeText}>23448</Text>
                <Text style={styles.statSubtitleText}>Unregistered users</Text>
              </View>
              <View style={styles.numItem}>
                <Text style={styles.statHugeText}>20756</Text>
                <Text style={styles.statSubtitleText}>Contactable alumni</Text>
              </View>
            </View>
            <View style={styles.chartWrapper}>
              <View style={styles.chartBarRow}>
                <Text style={styles.chartBarLabel}>Registered</Text>
                <View style={styles.chartBarTrack}>
                  <View style={[styles.chartBarFill, { width: '29%', backgroundColor: '#0D9488' }]} />
                </View>
                <Text style={styles.chartBarValue}>29%</Text>
              </View>
              <View style={styles.chartBarRow}>
                <Text style={styles.chartBarLabel}>Unregister</Text>
                <View style={styles.chartBarTrack}>
                  <View style={[styles.chartBarFill, { width: '71%', backgroundColor: '#0D9488' }]} />
                </View>
                <Text style={styles.chartBarValue}>71%</Text>
              </View>
            </View>
            {expandedChart === 'users' ? (
              <View style={styles.chartDetailsContainer}>
                <Text style={styles.chartDetailsTitle}>Institution Breakdown</Text>
                <View style={styles.chartDetailsTable}>
                  <View style={styles.chartDetailsHeaderRow}>
                    <Text style={[styles.chartDetailsHeaderCell, { flex: 1.5 }]}>Institute</Text>
                    <Text style={[styles.chartDetailsHeaderCellText, { flex: 1.2 }]}>Reg</Text>
                    <Text style={[styles.chartDetailsHeaderCellText, { flex: 1.2 }]}>Unreg</Text>
                    <Text style={[styles.chartDetailsHeaderCellText, { flex: 1.2 }]}>Contact</Text>
                  </View>
                  {[
                    { inst: 'RVCE', val1: 5000, val2: 12000, val3: 10000 },
                    { inst: 'RVITM', val1: 2500, val2: 6000, val3: 5500 },
                    { inst: 'RVPU', val1: 1500, val2: 4000, val3: 4200 },
                    { inst: 'RVIS', val1: 755, val2: 1448, val3: 1056 },
                  ].map((row, idx) => (
                    <View key={idx} style={styles.chartDetailsRow}>
                      <Text style={[styles.chartDetailsCellLabel, { flex: 1.5 }]}>{row.inst}</Text>
                      <Text style={[styles.chartDetailsCellVal, { flex: 1.2 }]}>{row.val1}</Text>
                      <Text style={[styles.chartDetailsCellVal, { flex: 1.2 }]}>{row.val2}</Text>
                      <Text style={[styles.chartDetailsCellVal, { flex: 1.2 }]}>{row.val3}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              <Text style={styles.chartDetailsHelpText}>Tap card to expand institution breakdown</Text>
            )}
          </TouchableOpacity>

          {/* Card 4: Jobs */}
          <TouchableOpacity 
            style={styles.statCard} 
            activeOpacity={0.9} 
            onPress={() => setExpandedChart(expandedChart === 'jobs' ? null : 'jobs')}
          >
            <View style={styles.statCardHeader}>
              <Text style={styles.statCardHeading}>Jobs</Text>
              <Ionicons 
                name={expandedChart === 'jobs' ? 'chevron-up-circle' : 'chevron-down-circle'} 
                size={20} 
                color="#0D9488" 
              />
            </View>
            <View style={styles.statNumbersRowMulti}>
              <View style={styles.numItem}>
                <Text style={styles.statHugeText}>0</Text>
                <Text style={styles.statSubtitleText}>Jobs posted</Text>
              </View>
              <View style={styles.numItem}>
                <Text style={styles.statHugeText}>2</Text>
                <Text style={styles.statSubtitleText}>Applications</Text>
              </View>
              <View style={styles.numItem}>
                <Text style={styles.statHugeText}>1</Text>
                <Text style={styles.statSubtitleText}>Applied</Text>
              </View>
              <View style={styles.numItem}>
                <Text style={styles.statHugeText}>0</Text>
                <Text style={styles.statSubtitleText}>Referred</Text>
              </View>
            </View>
            <View style={styles.chartWrapper}>
              <View style={styles.chartBarRow}>
                <Text style={styles.chartBarLabel}>Apply Rate</Text>
                <View style={styles.chartBarTrack}>
                  <View style={[styles.chartBarFill, { width: '50%', backgroundColor: '#0D9488' }]} />
                </View>
                <Text style={styles.chartBarValue}>50%</Text>
              </View>
            </View>
            {expandedChart === 'jobs' ? (
              <View style={styles.chartDetailsContainer}>
                <Text style={styles.chartDetailsTitle}>Institution Breakdown</Text>
                <View style={styles.chartDetailsTable}>
                  <View style={styles.chartDetailsHeaderRow}>
                    <Text style={[styles.chartDetailsHeaderCell, { flex: 1.5 }]}>Institute</Text>
                    <Text style={[styles.chartDetailsHeaderCellText, { flex: 1.2 }]}>Posts</Text>
                    <Text style={[styles.chartDetailsHeaderCellText, { flex: 1.2 }]}>Apps</Text>
                    <Text style={[styles.chartDetailsHeaderCellText, { flex: 1.2 }]}>Applied</Text>
                  </View>
                  {[
                    { inst: 'RVCE', val1: 0, val2: 1, val3: 1 },
                    { inst: 'RVITM', val1: 0, val2: 1, val3: 0 },
                    { inst: 'RVPU', val1: 0, val2: 0, val3: 0 },
                    { inst: 'RVIS', val1: 0, val2: 0, val3: 0 },
                  ].map((row, idx) => (
                    <View key={idx} style={styles.chartDetailsRow}>
                      <Text style={[styles.chartDetailsCellLabel, { flex: 1.5 }]}>{row.inst}</Text>
                      <Text style={[styles.chartDetailsCellVal, { flex: 1.2 }]}>{row.val1}</Text>
                      <Text style={[styles.chartDetailsCellVal, { flex: 1.2 }]}>{row.val2}</Text>
                      <Text style={[styles.chartDetailsCellVal, { flex: 1.2 }]}>{row.val3}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              <Text style={styles.chartDetailsHelpText}>Tap card to expand institution breakdown</Text>
            )}
          </TouchableOpacity>

          {/* Card 5: Emails */}
          <TouchableOpacity 
            style={styles.statCard} 
            activeOpacity={0.9} 
            onPress={() => setExpandedChart(expandedChart === 'emails' ? null : 'emails')}
          >
            <View style={styles.statCardHeader}>
              <Text style={styles.statCardHeading}>Emails</Text>
              <Ionicons 
                name={expandedChart === 'emails' ? 'chevron-up-circle' : 'chevron-down-circle'} 
                size={20} 
                color="#0D9488" 
              />
            </View>
            <View style={{ paddingBottom: 10 }}>
              <Text style={[styles.statHugeText, { fontSize: 18 }]}>23118</Text>
              <Text style={styles.statSubtitleText}>News feed emails sent (10.63% opened, 3.77% clicked)</Text>
            </View>
            <View style={{ paddingTop: 8, borderTopWidth: 1, borderColor: '#F1F5F9' }}>
              <Text style={[styles.statHugeText, { fontSize: 18 }]}>0</Text>
              <Text style={styles.statSubtitleText}>Email sent from master list (0% opened, 0% clicked)</Text>
            </View>
            <View style={styles.chartWrapper}>
              <View style={styles.chartBarRow}>
                <Text style={styles.chartBarLabel}>Opened</Text>
                <View style={styles.chartBarTrack}>
                  <View style={[styles.chartBarFill, { width: '10.6%', backgroundColor: '#0D9488' }]} />
                </View>
                <Text style={styles.chartBarValue}>10.6%</Text>
              </View>
              <View style={styles.chartBarRow}>
                <Text style={styles.chartBarLabel}>Clicked</Text>
                <View style={styles.chartBarTrack}>
                  <View style={[styles.chartBarFill, { width: '3.7%', backgroundColor: '#0D9488' }]} />
                </View>
                <Text style={styles.chartBarValue}>3.7%</Text>
              </View>
            </View>
            {expandedChart === 'emails' ? (
              <View style={styles.chartDetailsContainer}>
                <Text style={styles.chartDetailsTitle}>Institution Breakdown</Text>
                <View style={styles.chartDetailsTable}>
                  <View style={styles.chartDetailsHeaderRow}>
                    <Text style={[styles.chartDetailsHeaderCell, { flex: 1.5 }]}>Institute</Text>
                    <Text style={[styles.chartDetailsHeaderCellText, { flex: 1.2 }]}>Sent</Text>
                    <Text style={[styles.chartDetailsHeaderCellText, { flex: 1.2 }]}>Open</Text>
                    <Text style={[styles.chartDetailsHeaderCellText, { flex: 1.2 }]}>Click</Text>
                  </View>
                  {[
                    { inst: 'RVCE', val1: 15000, val2: 1800, val3: 600 },
                    { inst: 'RVITM', val1: 5000, val2: 450, val3: 180 },
                    { inst: 'RVPU', val1: 2000, val2: 150, val3: 50 },
                    { inst: 'RVIS', val1: 1118, val2: 68, val3: 20 },
                  ].map((row, idx) => (
                    <View key={idx} style={styles.chartDetailsRow}>
                      <Text style={[styles.chartDetailsCellLabel, { flex: 1.5 }]}>{row.inst}</Text>
                      <Text style={[styles.chartDetailsCellVal, { flex: 1.2 }]}>{row.val1}</Text>
                      <Text style={[styles.chartDetailsCellVal, { flex: 1.2 }]}>{row.val2}</Text>
                      <Text style={[styles.chartDetailsCellVal, { flex: 1.2 }]}>{row.val3}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              <Text style={styles.chartDetailsHelpText}>Tap card to expand institution breakdown</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };

  // 11. Dynamic Email Stats
  const renderEmailStats = () => {
    // subTabs: '1': Invitation, '2': Custom
    return (
      <View style={styles.flexContainer}>
        <InstitutionSelector />

        <View style={styles.subTabsHeader}>
          {['Invitation Campaigns', 'Custom Campaigns'].map((tabName, index) => {
            const tabId = (index + 1).toString();
            return (
              <TouchableOpacity
                key={tabId}
                style={[styles.subTabButton, activeSubTab === tabId && styles.subTabActive]}
                onPress={() => setActiveSubTab(tabId)}
              >
                <Text style={[styles.subTabText, activeSubTab === tabId && styles.subTabTextActive]}>
                  {tabName}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <ScrollView contentContainerStyle={styles.listPadding} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Text style={styles.cardHeading}>Email Performance Analytics</Text>

            <View style={styles.progressStatRow}>
              <Text style={styles.progressLabel}>Total Sent emails: 1,480</Text>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: '100%', backgroundColor: '#003366' }]} />
              </View>
            </View>

            <View style={styles.progressStatRow}>
              <Text style={styles.progressLabel}>Open Rate (78%): 1,154</Text>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: '78%', backgroundColor: '#10B981' }]} />
              </View>
            </View>

            <View style={styles.progressStatRow}>
              <Text style={styles.progressLabel}>Click Rate (45%): 666</Text>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: '45%', backgroundColor: '#F59E0B' }]} />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };

  // 12. Data Exports
  const renderDataExports = () => {
    const handleExportSimulate = () => {
      setIsProcessing(true);
      setProgressVal(0);
      const interval = setInterval(() => {
        setProgressVal((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsProcessing(false);
            Alert.alert('Export Success', 'alumni_database_export.csv compiled and saved.');
            return 100;
          }
          return prev + 25;
        });
      }, 300);
    };

    return (
      <View style={styles.flexContainer}>
        <InstitutionSelector />

        <ScrollView contentContainerStyle={styles.listPadding} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Text style={styles.cardHeading}>Custom Export Configuration</Text>
            
            <Text style={styles.formLabel}>Select Graduation Year Cohort</Text>
            <View style={styles.pickerWrapper}>
              {['All', '2022', '2023', '2024', '2025'].map((year) => (
                <TouchableOpacity key={year} style={styles.pickerChip}>
                  <Text style={styles.pickerChipText}>{year}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.formLabel}>Select Branch Cohort</Text>
            <View style={styles.pickerWrapper}>
              {['All', 'CSE', 'ECE', 'ISE', 'MBA'].map((dept) => (
                <TouchableOpacity key={dept} style={styles.pickerChip}>
                  <Text style={styles.pickerChipText}>{dept}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {isProcessing && (
              <View style={{ marginVertical: 12 }}>
                <Text style={styles.progressText}>Generating file... {progressVal}%</Text>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${progressVal}%` }]} />
                </View>
              </View>
            )}

            <TouchableOpacity style={styles.btnPrimary} onPress={handleExportSimulate} disabled={isProcessing}>
              <Ionicons name="download-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.btnPrimaryText}>Generate CSV Export</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  };

  // 13. Admin Activities
  const renderAdminActivities = () => {
    // subTabs: '1': Past, '2': Due
    const list = filterByInstitution(activities);
    
    return (
      <View style={styles.flexContainer}>
        <InstitutionSelector />

        <View style={styles.subTabsHeader}>
          {['Past Interactions', 'Due / Follow Ups'].map((tabName, index) => {
            const tabId = (index + 1).toString();
            return (
              <TouchableOpacity
                key={tabId}
                style={[styles.subTabButton, activeSubTab === tabId && styles.subTabActive]}
                onPress={() => setActiveSubTab(tabId)}
              >
                <Text style={[styles.subTabText, activeSubTab === tabId && styles.subTabTextActive]}>
                  {tabName}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <FlatList
          data={activeSubTab === '1' ? list : []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listPadding}
          renderItem={({ item }) => (
            <View style={styles.simpleItemCard}>
              <View style={styles.activityIconBg}>
                <Ionicons name="time-outline" size={18} color="#003366" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.cardTitle}>{item.description}</Text>
                <Text style={styles.cardSubText}>{item.date} • {item.type} • {item.institution}</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="time-outline" size={48} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>No Activities</Text>
              <Text style={styles.emptySub}>No recent logs match the parameters.</Text>
            </View>
          }
        />
      </View>
    );
  };

  // Switch to render chosen sub-module
  const renderModuleContent = () => {
    switch (activeModule) {
      case 'spam_report':
        return renderSpamReport();
      case 'welcome_mail':
        return renderWelcomeMail();
      case 'master_list':
        return renderMasterList();
      case 'administrator':
        return renderAdministrator();
      case 'membership_request':
        return renderMembershipRequest();
      case 'network_settings':
        return renderNetworkSettings();
      case 'bulk_import':
        return renderBulkImport();
      case 'placement_tool':
        return renderPlacementTool();
      case 'logs_stats':
        return renderLogsStats();
      case 'email_stats':
        return renderEmailStats();
      case 'data_exports':
        return renderDataExports();
      case 'admin_activities':
        return renderAdminActivities();
      default:
        return renderDashboardHome();
    }
  };

  // Get active module metadata
  const currentModuleData = panelItems.find(p => p.moduleName === activeModule);

  const filteredPanelItems = useMemo(() => {
    if (!searchQuery.trim()) return panelItems;
    return panelItems.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.desc && item.desc.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  const isMainScreen = activeModule === null || activeModule === 'dashboard_home';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      {!isMainScreen ? (
        <View style={styles.headerAdminStyle}>
          <TouchableOpacity onPress={handleGoBack} style={styles.headerIconBtnAdminStyle}>
            <Ionicons name="arrow-back" size={24} color="#002144" />
          </TouchableOpacity>
          
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#002144' }}>{currentModuleData?.title}</Text>
            <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '500' }}>Super Admin Panel</Text>
          </View>

          <View style={styles.headerIconsAdminStyle}>
            <TouchableOpacity
              style={styles.headerIconBtnAdminStyle}
              onPress={() => navigation && navigation.navigate('Messages')}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={24} color="#003366" />
              <View style={styles.dotAdminStyle} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerIconBtnAdminStyle}
              onPress={() => navigation && navigation.navigate('Notifications')}
            >
              <Ionicons name="notifications-outline" size={24} color="#003366" />
              <View style={styles.dotAdminStyle} />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.headerAdminStyle}>
          <TouchableOpacity
            style={styles.headerAvatarAdminStyle}
            activeOpacity={0.8}
            onPress={() => navigation && navigation.navigate('AdminProfile')}
          >
            <Text style={styles.headerAvatarTextAdminStyle}>SA</Text>
          </TouchableOpacity>

          {activeModule === 'dashboard_home' ? (
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#002144' }}>Super Admin Dashboard</Text>
              <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '500' }}>System Status Overview</Text>
            </View>
          ) : (
            <View style={styles.searchBarAdminStyle}>
              <Ionicons name="search-outline" size={18} color="#94A3B8" style={{ marginRight: 6 }} />
              <TextInput
                style={styles.searchInputAdminStyle}
                placeholder="Search Panel..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          )}

          <View style={styles.headerIconsAdminStyle}>
            <TouchableOpacity
              style={styles.headerIconBtnAdminStyle}
              onPress={() => navigation && navigation.navigate('Messages')}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={24} color="#003366" />
              <View style={styles.dotAdminStyle} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerIconBtnAdminStyle}
              onPress={() => navigation && navigation.navigate('Notifications')}
            >
              <Ionicons name="notifications-outline" size={24} color="#003366" />
              <View style={styles.dotAdminStyle} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Main Content Area */}
      {activeModule === null ? (
        <ScrollView contentContainerStyle={styles.panelContainer} showsVerticalScrollIndicator={false}>
          {/* Default Dashboard Home */}
          {renderDashboardHome()}

          <Text style={styles.sectionHeaderTitle}>Administration Modules</Text>
          {/* Main Grid Options */}
          <View style={styles.gridContainer}>
            {filteredPanelItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.gridCard, { backgroundColor: item.color }]}
                onPress={() => {
                  setActiveModule(item.moduleName);
                  setActiveSubTab('1');
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.gridIconBg, { backgroundColor: '#FFFFFF' }]}>
                  <Ionicons name={item.icon} size={24} color={item.iconColor} />
                </View>
                <Text style={styles.gridCardTitle}>{item.title}</Text>
                <Text style={styles.gridCardDesc} numberOfLines={2}>{item.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.flexContainer}>
          {renderModuleContent()}
        </View>
      )}
    </SafeAreaView>
  );
};

// ==========================================
// STYLING CONVENTIONS
// ==========================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerAdminStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    height: 60,
  },
  headerAvatarAdminStyle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#D97706',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  headerAvatarTextAdminStyle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  searchBarAdminStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 24,
    paddingHorizontal: 14,
    height: 38,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInputAdminStyle: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    paddingVertical: 0,
  },
  headerIconsAdminStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconBtnAdminStyle: {
    position: 'relative',
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotAdminStyle: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  flexContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#002144',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  profileBtn: {
    padding: 2,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#002144',
  },
  panelContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 20,
    marginBottom: 12,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridCard: {
    width: (width - 44) / 2,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  gridIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  gridCardTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  gridCardDesc: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
  },
  // Module layouts
  moduleScroll: {
    padding: 16,
    paddingBottom: 40,
  },
  listPadding: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  cardSubText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  cardPrimaryVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#003366',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarMini: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarMiniText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#003366',
  },
  instChip: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  instChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1E40AF',
  },
  cardActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 14,
  },
  btnSecondary: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  btnSecondaryText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#334155',
  },
  btnDanger: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#EF4444',
  },
  btnDangerText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  btnSuccess: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#10B981',
  },
  btnSuccessText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Selector style
  selectorWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectorLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginRight: 8,
  },
  selectorList: {
    gap: 8,
  },
  selectorChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  selectorChipActive: {
    backgroundColor: '#003366',
  },
  selectorChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  selectorChipTextActive: {
    color: '#FFFFFF',
  },
  // Subtabs
  subTabsHeader: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  subTabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  subTabActive: {
    borderColor: '#003366',
  },
  subTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
  },
  subTabTextActive: {
    color: '#003366',
    fontWeight: '700',
  },
  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginBottom: 0,
    paddingHorizontal: 12,
    height: 42,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchBarInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13.5,
    color: '#0F172A',
  },
  simpleItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 8,
  },
  countBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  // Dashboard Metrics
  summaryCard: {
    backgroundColor: '#003366',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  summaryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  healthStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  healthDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  healthText: {
    fontSize: 10,
    color: '#10B981',
    fontWeight: '800',
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'flex-start',
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  summaryLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
  },
  instMetricCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 12,
  },
  instMetricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
    paddingBottom: 12,
    marginBottom: 12,
  },
  instTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  instBadgeCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instBadgeCircleText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  instCardTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  instCardLoc: {
    fontSize: 11,
    color: '#64748B',
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusActive: {
    backgroundColor: '#ECFDF5',
  },
  statusActiveText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  statusPendingText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D97706',
  },
  statusRejected: {
    backgroundColor: '#FEE2E2',
  },
  statusRejectedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#EF4444',
  },
  instMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricVal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  metricLbl: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  // Inner module inputs
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
    marginBottom: 6,
    marginTop: 12,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    fontSize: 13.5,
    color: '#0F172A',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: '#E2E8F0',
  },
  switchTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  switchSubtitle: {
    fontSize: 11,
    color: '#64748B',
  },
  btnPrimary: {
    backgroundColor: '#003366',
    borderRadius: 8,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 16,
  },
  btnPrimaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  btnActionTop: {
    backgroundColor: '#003366',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    margin: 16,
    marginBottom: 0,
    paddingHorizontal: 14,
    height: 38,
    borderRadius: 8,
  },
  btnActionTopText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // Modal layout
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  pickerWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  pickerChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  pickerChipActive: {
    backgroundColor: '#003366',
  },
  pickerChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  pickerChipTextActive: {
    color: '#FFFFFF',
  },
  passwordInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  btnGenerate: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  btnGenerateText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#003366',
  },
  // Settings Branding Color Box
  colorBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  rowGrid: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  featureBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 8,
  },
  featureText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#334155',
  },
  // Stats Card Inner Layout
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderLeftWidth: 4,
    borderLeftColor: '#0D9488',
    padding: 16,
    marginBottom: 12,
  },
  statCardHeader: {
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
    paddingBottom: 8,
    marginBottom: 12,
  },
  statCardHeading: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  statHugeText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
  },
  statSubtitleText: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 2,
  },
  statNumbersRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  statNumbersRowMulti: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 14,
  },
  numItem: {
    minWidth: '40%',
  },
  chartWrapper: {
    gap: 8,
    marginTop: 6,
  },
  chartBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chartBarLabel: {
    width: 70,
    fontSize: 10.5,
    color: '#475569',
    fontWeight: '700',
  },
  chartBarTrack: {
    flex: 1,
    height: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 5,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  chartBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  chartBarValue: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '700',
  },
  // Date Picker Layout
  datePickerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  dateField: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#475569',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  dateInput: {
    height: 36,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    paddingHorizontal: 8,
    fontSize: 12.5,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  btnApply: {
    backgroundColor: '#003366',
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnApplyText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
  },
  // Dynamic Email Stats progress rows
  progressStatRow: {
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '700',
    marginBottom: 4,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  // Bulk import upload area
  btnOutline: {
    borderWidth: 1,
    borderColor: '#003366',
    borderRadius: 8,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 16,
  },
  btnOutlineText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#003366',
  },
  uploadArea: {
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    borderRadius: 12,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    marginBottom: 16,
  },
  uploadTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#475569',
    marginTop: 8,
  },
  uploadSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  mappingList: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  mappingLabel: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#475569',
    marginBottom: 6,
  },
  mappingText: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '600',
    marginBottom: 2,
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginBottom: 8,
  },
  historyStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 0.5,
    borderColor: '#F1F5F9',
    paddingTop: 8,
    marginTop: 8,
  },
  historyStatText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  // Admin Activities Icon
  activityIconBg: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBanner: {
    flexDirection: 'row',
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  alertBannerText: {
    fontSize: 12,
    color: '#0369A1',
    lineHeight: 16,
    marginLeft: 8,
    flex: 1,
    fontWeight: '600',
  },
  alertTextBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 4,
  },
  alertTextTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#475569',
    marginBottom: 4,
  },
  alertTextContent: {
    fontSize: 12,
    color: '#0F172A',
    lineHeight: 16,
  },
  alertTextMeta: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 6,
  },
  spamCountBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  spamBadgeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  spamBadgeLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#64748B',
    marginRight: 4,
  },
  spamCountDot: {
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  spamCountDotActive: {
    backgroundColor: '#EF4444',
  },
  spamCountDotEmpty: {
    backgroundColor: '#94A3B8',
  },
  spamCountDotText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  passwordContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 4,
  },
  passwordLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  passwordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  passwordValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  metaInfoBox: {
    marginTop: 8,
  },
  metaText: {
    fontSize: 11,
    color: '#64748B',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#475569',
    marginTop: 10,
  },
  emptySub: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 4,
  },
  modalSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    paddingBottom: 4,
  },
  modalText: {
    fontSize: 13,
    color: '#334155',
    marginBottom: 6,
  },
  // New Styles
  dashboardHomeView: {
    flex: 1,
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdownLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 6,
    paddingLeft: 4,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#003366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  dropdownLogoBg: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownLogoText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  dropdownCampusName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  dropdownCampusSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '600',
  },
  dropdownChevronBg: {
    backgroundColor: '#F1F5F9',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  dropdownModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 34,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 20,
  },
  dropdownModalHeader: {
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 16,
  },
  dropdownModalHandle: {
    width: 36,
    height: 4.5,
    borderRadius: 3,
    backgroundColor: '#E2E8F0',
    marginBottom: 12,
  },
  dropdownModalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: 'transparent',
    backgroundColor: '#F8FAFC',
  },
  dropdownOptionActive: {
    backgroundColor: '#F0F9FF',
    borderColor: '#003366',
  },
  dropdownOptionLogo: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownOptionLogoText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  dropdownOptionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  dropdownOptionTextActive: {
    color: '#003366',
    fontWeight: '800',
  },
  dropdownOptionSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  dropdownCheckCircle: {
    backgroundColor: '#003366',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // News Feed / Posts
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  postUserAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  postAvatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#003366',
  },
  postUserInfo: {
    flex: 1,
  },
  postUserName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  postUserRole: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  followBtn: {
    borderWidth: 1,
    borderColor: '#003366',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  followBtnActive: {
    backgroundColor: '#003366',
  },
  followBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#003366',
  },
  followBtnTextActive: {
    color: '#FFFFFF',
  },
  postContent: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
    resizeMode: 'cover',
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionBtnText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  // Details Card
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  detailsCardHeaderTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
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
    fontSize: 14,
    color: '#475569',
  },
  detailsLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  detailsLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#003366',
    textDecorationLine: 'underline',
  },
  detailsSectionHeader: {
    fontSize: 15,
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
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: 8,
  },
  statusInactive: {
    backgroundColor: '#F1F5F9',
  },
  // --- Start of newly added interactivity features styles ---
  // Broadcast announcement
  broadcastCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  broadcastCardTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#003366',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  broadcastInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  broadcastInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#0F172A',
    minHeight: 48,
    maxHeight: 120,
    textAlignVertical: 'top',
  },
  broadcastSendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#003366',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  announcementBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#F59E0B',
  },
  announcementBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#D97706',
  },

  // Spreadsheet Editor
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1.5,
    borderColor: '#003366',
    shadowColor: '#003366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  sheetTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#003366',
    marginBottom: 12,
  },
  sheetHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginBottom: 6,
  },
  sheetHeaderCell: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    textAlign: 'center',
  },
  sheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  sheetCellInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    fontSize: 12,
    color: '#0F172A',
    paddingHorizontal: 6,
    paddingVertical: 4,
    marginHorizontal: 2,
    textAlign: 'center',
  },
  sheetAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E6F0FA',
    borderWidth: 1,
    borderColor: '#003366',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  sheetAddBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#003366',
    marginLeft: 4,
  },
  sheetClearBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sheetClearBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },

  // Color Presets & Theme Swatches
  presetColorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  presetColorChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  presetSwatchMini: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  // Password Strength Indicator
  strengthBarBg: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    marginTop: 6,
    overflow: 'hidden',
  },
  strengthBarFill: {
    height: '100%',
    borderRadius: 3,
  },

  // Logs/Stats interactive Breakdown Table
  chartDetailsContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginTop: 12,
  },
  chartDetailsTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0D9488',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chartDetailsTable: {
    width: '100%',
  },
  chartDetailsHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingBottom: 6,
    marginBottom: 6,
  },
  chartDetailsHeaderCell: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
  },
  chartDetailsHeaderCellText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    textAlign: 'right',
  },
  chartDetailsRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  chartDetailsCellLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  chartDetailsCellVal: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'right',
  },
  chartDetailsHelpText: {
    fontSize: 11,
    color: '#0D9488',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});

export default SuperAdminDashboardScreen;
