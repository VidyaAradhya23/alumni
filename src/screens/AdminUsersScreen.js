import React, { useState, useMemo, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

const FRIENDS_DATA = [
  { id: '1', name: 'Priya Sharma', branch: 'CSE', department: 'Computer Science', batch: '2020', location: 'Bengaluru', course: 'B.E.', avatar: 'PS', institution: 'RVCE' },
  { id: '2', name: 'Rahul Verma', branch: 'ECE', department: 'Electronics', batch: '2019', location: 'Hyderabad', course: 'B.E.', avatar: 'RV', institution: 'RVCE' },
  { id: '3', name: 'Sneha Patel', branch: 'ISE', department: 'Information Science', batch: '2021', location: 'Remote', course: 'B.E.', avatar: 'SP', institution: 'RVITM' },
  { id: '4', name: 'Arjun Reddy', branch: 'ME', department: 'Mechanical', batch: '2018', location: 'Bengaluru', course: 'B.E.', avatar: 'AR', institution: 'RVITM' },
  { id: '5', name: 'Kavitha Nair', branch: 'EEE', department: 'Electrical', batch: '2022', location: 'Mumbai', course: 'M.Tech', avatar: 'KN', institution: 'RVPU' },
  { id: '6', name: 'Deepak Kumar', branch: 'CSE', department: 'Computer Science', batch: '2017', location: 'Bengaluru', course: 'MCA', avatar: 'DK', institution: 'RVPU' },
  { id: '7', name: 'Sarthak Banka', branch: 'CSE', department: 'Computer Science', batch: '2023', location: 'Bengaluru', course: 'B.E.', avatar: 'SB', institution: 'RVIS' },
  { id: '8', name: 'Manjunath N', branch: 'MBA', department: 'Management', batch: '2015', location: 'Mumbai', course: 'MBA', avatar: 'MN', institution: 'RVIS' },
];

const COMMUNITIES_DATA = [
  { id: '1', name: 'RVITM Tech Community', members: '1.2K', icon: 'code-slash-outline', joined: true, institution: 'RVITM' },
  { id: '2', name: 'Alumni Entrepreneurs Club', members: '856', icon: 'rocket-outline', joined: false, institution: 'RVCE' },
  { id: '3', name: 'RVITM Placement Network', members: '2.1K', icon: 'briefcase-outline', joined: true, institution: 'RVITM' },
  { id: '4', name: 'Sports Alumni Association', members: '432', icon: 'football-outline', joined: false, institution: 'RVIS' },
];

const AVATAR_COLORS = ['#003366', '#0F172A', '#1E3A5F', '#2C5282', '#1A365D', '#2D3748'];

const BATCH_OPTIONS = ['All', '2015', '2017', '2018', '2019', '2020', '2021', '2022', '2023'];
const BRANCH_OPTIONS = ['All', 'CSE', 'ECE', 'ISE', 'MBA', 'ME', 'EEE'];
const DEPT_OPTIONS = ['All', 'Computer Science', 'Electronics', 'Information Science', 'Mechanical', 'Electrical', 'Management'];
const LOC_OPTIONS = ['All', 'Bengaluru', 'Hyderabad', 'Mumbai', 'Remote'];
const COURSE_OPTIONS = ['All', 'B.E.', 'M.Tech', 'MCA', 'MBA'];

const AdminUsersScreen = ({ navigation, route }) => {
  const { theme, isDarkMode } = useTheme();
  const styles = getStyles(theme);

  const isSuperAdmin = route?.params?.isSuperAdmin || false;
  const isFocused = useIsFocused();
  const [selectedInstitution, setSelectedInstitution] = useState(global.selectedInstitution || 'All');
  const [activeTab, setActiveTab] = useState('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [communities, setCommunities] = useState(COMMUNITIES_DATA);
  const [pendingUsers, setPendingUsers] = useState([]);

  const fetchPendingUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('is_approved', false)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setPendingUsers(data || []);
    } catch (err) {
      console.error('Error fetching pending users:', err);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchPendingUsers();
    }
  }, [isFocused]);

  const handleApprove = async (userId) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_approved: true })
        .eq('id', userId);
      if (error) throw error;
      setPendingUsers(prev => prev.filter(u => u.id !== userId));
      alert('User approved successfully.');
    } catch (err) {
      alert('Error approving user: ' + err.message);
    }
  };

  const handleReject = async (userId) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);
      if (error) throw error;
      setPendingUsers(prev => prev.filter(u => u.id !== userId));
      alert('User rejected and removed.');
    } catch (err) {
      alert('Error rejecting user: ' + err.message);
    }
  };

  // Filters state
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState('All');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedLoc, setSelectedLoc] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState('All');

  useEffect(() => {
    if (isFocused && isSuperAdmin && global.selectedInstitution) {
      setSelectedInstitution(global.selectedInstitution);
    }
  }, [isFocused, isSuperAdmin]);

  const handleResetAll = () => {
    setSelectedBatch('All');
    setSelectedBranch('All');
    setSelectedDept('All');
    setSelectedLoc('All');
    setSelectedCourse('All');
    if (isSuperAdmin) {
      setSelectedInstitution('All');
      global.selectedInstitution = 'All';
    }
  };

  const filteredFriends = useMemo(() => {
    let data = FRIENDS_DATA;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      data = data.filter((friend) =>
        friend.name.toLowerCase().includes(query)
      );
    }

    if (selectedBatch !== 'All') {
      data = data.filter((friend) => friend.batch === selectedBatch);
    }

    if (selectedBranch !== 'All') {
      data = data.filter((friend) => friend.branch === selectedBranch);
    }

    if (selectedDept !== 'All') {
      data = data.filter((friend) => friend.department === selectedDept);
    }

    if (selectedLoc !== 'All') {
      data = data.filter((friend) => friend.location === selectedLoc);
    }

    if (selectedCourse !== 'All') {
      data = data.filter((friend) => friend.course === selectedCourse);
    }

    if (isSuperAdmin && selectedInstitution !== 'All') {
      data = data.filter((friend) => friend.institution === selectedInstitution);
    }

    return data;
  }, [searchQuery, selectedBatch, selectedBranch, selectedDept, selectedLoc, selectedCourse, isSuperAdmin, selectedInstitution]);

  const filteredCommunities = useMemo(() => {
    let data = communities;
    if (isSuperAdmin && selectedInstitution !== 'All') {
      data = data.filter((comm) => comm.institution === selectedInstitution);
    }
    return data;
  }, [communities, isSuperAdmin, selectedInstitution]);

  const handleToggleJoin = (communityId) => {
    setCommunities((prev) =>
      prev.map((community) =>
        community.id === communityId
          ? { ...community, joined: !community.joined }
          : community
      )
    );
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedBatch !== 'All') count++;
    if (selectedBranch !== 'All') count++;
    if (selectedDept !== 'All') count++;
    if (selectedLoc !== 'All') count++;
    if (selectedCourse !== 'All') count++;
    if (isSuperAdmin && selectedInstitution !== 'All') count++;
    return count;
  }, [selectedBatch, selectedBranch, selectedDept, selectedLoc, selectedCourse, isSuperAdmin, selectedInstitution]);

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={[styles.headerAvatar, isSuperAdmin && { backgroundColor: '#D97706' }]}
        onPress={() => navigation && navigation.navigate('AdminProfile')}
      >
        <Text style={styles.headerAvatarText}>{isSuperAdmin ? 'SA' : 'AD'}</Text>
      </TouchableOpacity>
      <View style={styles.headerSearchContainer}>
        <Ionicons name="search-outline" size={18} color="#94A3B8" style={styles.headerSearchIcon} />
        <TextInput
          style={styles.headerSearchInput}
          placeholder="Search users..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} activeOpacity={0.7}>
            <Ionicons name="close-circle" size={18} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.headerActions}>
        <TouchableOpacity 
          style={styles.headerIconBtn} 
          activeOpacity={0.7}
          onPress={() => navigation && navigation.navigate('Messages')}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={22} color="#003366" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.headerIconBtn} 
          activeOpacity={0.7}
          onPress={() => navigation && navigation.navigate('Notifications')}
        >
          <Ionicons name="notifications-outline" size={22} color="#003366" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'friends' && styles.tabActive]}
        onPress={() => setActiveTab('friends')}
        activeOpacity={0.7}
      >
        <Text style={[styles.tabText, activeTab === 'friends' && styles.tabTextActive]}>
          Friends List
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'community' && styles.tabActive]}
        onPress={() => setActiveTab('community')}
        activeOpacity={0.7}
      >
        <Text style={[styles.tabText, activeTab === 'community' && styles.tabTextActive]}>
          Community
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderPendingItem = ({ item, index }) => (
    <View style={styles.friendCard}>
      <View style={[styles.friendAvatar, { backgroundColor: theme.warning }]}>
        <Text style={styles.friendAvatarText}>{item.name ? item.name.substring(0,2).toUpperCase() : 'UU'}</Text>
      </View>
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.name || 'Unknown'}</Text>
        <Text style={styles.friendDetail}>{item.department || 'No Dept'} • Batch {item.batch_year || 'N/A'}</Text>
        <Text style={styles.friendDetailSub}>{item.institution || 'No Institution'} • {item.email}</Text>
      </View>
      <View style={{ flexDirection: 'column', gap: 6 }}>
        <TouchableOpacity 
          style={[styles.messageBtn, { backgroundColor: theme.success, borderColor: theme.success }]} 
          onPress={() => handleApprove(item.id)}
        >
          <Text style={[styles.messageBtnText, { color: '#FFF' }]}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.messageBtn, { borderColor: theme.danger }]} 
          onPress={() => handleReject(item.id)}
        >
          <Text style={[styles.messageBtnText, { color: theme.danger }]}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFriendItem = ({ item, index }) => (
    <View style={styles.friendCard}>
      <View style={[styles.friendAvatar, { backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length] }]}>
        <Text style={styles.friendAvatarText}>{item.avatar}</Text>
      </View>
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.name}</Text>
        <Text style={styles.friendDetail}>{item.branch} • Batch {item.batch}</Text>
        <Text style={styles.friendDetailSub}>{item.course} • {item.location}</Text>
      </View>
      <TouchableOpacity 
        style={styles.messageBtn} 
        activeOpacity={0.7}
        onPress={() => navigation && navigation.navigate('Chat', { 
          user: { 
            name: item.name, 
            role: `${item.branch} • Batch ${item.batch}`, 
            initials: item.avatar,
            lastMessage: 'Hi! Let\'s connect.',
            time: 'Just now'
          } 
        })}
      >
        <Ionicons name="chatbubble-outline" size={16} color="#003366" />
        <Text style={styles.messageBtnText}>Message</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCommunityItem = ({ item }) => (
    <View style={styles.communityCard}>
      <View style={styles.communityIcon}>
        <Ionicons name={item.icon} size={24} color="#003366" />
      </View>
      <View style={styles.communityInfo}>
        <Text style={styles.communityName}>{item.name}</Text>
        <Text style={styles.communityMembers}>{item.members} members</Text>
      </View>
      <TouchableOpacity
        style={[styles.joinBtn, item.joined && styles.joinedBtn]}
        onPress={() => handleToggleJoin(item.id)}
        activeOpacity={0.7}
      >
        {item.joined && (
          <Ionicons name="checkmark" size={14} color="#FFFFFF" style={styles.joinedIcon} />
        )}
        <Text style={[styles.joinBtnText, item.joined && styles.joinedBtnText]}>
          {item.joined ? 'Joined' : 'Join'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyFriends = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="people-outline" size={56} color="#94A3B8" />
      <Text style={styles.emptyTitle}>No users found</Text>
      <Text style={styles.emptySubtitle}>Try a different search or clear filters</Text>
    </View>
  );

    const isWeb = Platform.OS === 'web';
  const webContainerStyle = isWeb ? { alignSelf: 'center', width: '100%', maxWidth: 1024, flex: 1 } : { flex: 1 };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={webContainerStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="#FFFFFF" />
      {renderHeader()}
      {renderTabs()}

      {activeTab === 'friends' && (
        <View style={styles.filterSummaryBar}>
          <Text style={styles.filterSummaryText}>
            Showing {filteredFriends.length} students
          </Text>
          <TouchableOpacity 
            style={[styles.filterButton, activeFiltersCount > 0 && styles.filterButtonActive]}
            activeOpacity={0.7}
            onPress={() => setShowFilterModal(true)}
          >
            <Ionicons 
              name="options-outline" 
              size={18} 
              color={activeFiltersCount > 0 ? theme.card : theme.primary} 
            />
            <Text style={[styles.filterButtonText, activeFiltersCount > 0 && styles.filterButtonTextActive]}>
              Filter{activeFiltersCount > 0 ? ` (${activeFiltersCount})` : ''}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {activeTab === 'friends' ? (
        <FlatList
          data={filteredFriends}
          keyExtractor={(item) => item.id}
          renderItem={renderFriendItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyFriends}
        />
      ) : (
        <FlatList
          data={filteredCommunities}
          keyExtractor={(item) => item.id}
          renderItem={renderCommunityItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Filter Modal */}
      <Modal visible={showFilterModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowFilterModal(false)} />
          <View style={styles.filterSheet}>
            <View style={styles.filterSheetHeader}>
              <Text style={styles.filterSheetTitle}>Filter Students</Text>
              <View style={{ flexDirection: 'row', gap: 14 }}>
                <TouchableOpacity onPress={handleResetAll} activeOpacity={0.7}>
                  <Text style={styles.resetText}>Reset All</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowFilterModal(false)} activeOpacity={0.7}>
                  <Ionicons name="close" size={24} color="#0F172A" />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView style={styles.filterScrollView} showsVerticalScrollIndicator={false}>
              {/* Batch */}
              <Text style={styles.filterGroupLabel}>Batch</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsRow}>
                {BATCH_OPTIONS.map((batch) => (
                  <TouchableOpacity
                    key={batch}
                    style={[styles.pill, selectedBatch === batch && styles.pillActive]}
                    onPress={() => setSelectedBatch(batch)}
                  >
                    <Text style={[styles.pillText, selectedBatch === batch && styles.pillTextActive]}>
                      {batch}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Department */}
              <Text style={styles.filterGroupLabel}>Department</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsRow}>
                {DEPT_OPTIONS.map((dept) => (
                  <TouchableOpacity
                    key={dept}
                    style={[styles.pill, selectedDept === dept && styles.pillActive]}
                    onPress={() => setSelectedDept(dept)}
                  >
                    <Text style={[styles.pillText, selectedDept === dept && styles.pillTextActive]}>
                      {dept}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Branch */}
              <Text style={styles.filterGroupLabel}>Branch</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsRow}>
                {BRANCH_OPTIONS.map((branch) => (
                  <TouchableOpacity
                    key={branch}
                    style={[styles.pill, selectedBranch === branch && styles.pillActive]}
                    onPress={() => setSelectedBranch(branch)}
                  >
                    <Text style={[styles.pillText, selectedBranch === branch && styles.pillTextActive]}>
                      {branch}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Location */}
              <Text style={styles.filterGroupLabel}>Location</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsRow}>
                {LOC_OPTIONS.map((loc) => (
                  <TouchableOpacity
                    key={loc}
                    style={[styles.pill, selectedLoc === loc && styles.pillActive]}
                    onPress={() => setSelectedLoc(loc)}
                  >
                    <Text style={[styles.pillText, selectedLoc === loc && styles.pillTextActive]}>
                      {loc}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Course */}
              <Text style={styles.filterGroupLabel}>Course</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsRow}>
                {COURSE_OPTIONS.map((course) => (
                  <TouchableOpacity
                    key={course}
                    style={[styles.pill, selectedCourse === course && styles.pillActive]}
                    onPress={() => setSelectedCourse(course)}
                  >
                    <Text style={[styles.pillText, selectedCourse === course && styles.pillTextActive]}>
                      {course}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Institution */}
              {isSuperAdmin && (
                <>
                  <Text style={styles.filterGroupLabel}>Institution</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsRow}>
                    {['All', 'RVCE', 'RVITM', 'RVPU', 'RVIS', 'RVU', 'RVCA', 'RVIM', 'RVILS', 'DAPMRV', 'RVCN', 'RVCP', 'RVTC', 'RVTTI', 'NMKRV', 'SSMRV', 'RVPS', 'RVS', 'RVLH'].map((inst) => (
                      <TouchableOpacity
                        key={inst}
                        style={[styles.pill, selectedInstitution === inst && styles.pillActive]}
                        onPress={() => {
                          setSelectedInstitution(inst);
                          global.selectedInstitution = inst;
                        }}
                      >
                        <Text style={[styles.pillText, selectedInstitution === inst && styles.pillTextActive]}>
                          {inst}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </>
              )}

              <View style={{ height: 40 }} />
            </ScrollView>

            <TouchableOpacity 
              style={styles.applyButton} 
              activeOpacity={0.8}
              onPress={() => setShowFilterModal(false)}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
    </SafeAreaView>
  );
};

const getStyles = (theme) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  headerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerAvatarText: {
    color: theme.card,
    fontSize: 16,
    fontWeight: '700',
  },
  headerSearchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.background,
    borderRadius: 10,
    marginHorizontal: 12,
    paddingHorizontal: 10,
    height: 38,
    borderWidth: 1,
    borderColor: theme.border,
  },
  headerSearchIcon: {
    marginRight: 6,
  },
  headerSearchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: theme.text,
    padding: 0,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: theme.card,
    paddingHorizontal: 16,
    paddingTop: 4,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: theme.primary,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.textMuted,
  },
  tabTextActive: {
    color: theme.primary,
    fontWeight: '700',
  },
  filterSummaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: theme.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  filterSummaryText: {
    fontSize: 13,
    color: theme.textSecondary,
    fontWeight: '600',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: theme.primary,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  filterButtonActive: {
    backgroundColor: theme.primary,
  },
  filterButtonText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: theme.primary,
  },
  filterButtonTextActive: {
    color: theme.card,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.border,
  },
  friendAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendAvatarText: {
    color: theme.card,
    fontSize: 16,
    fontWeight: '700',
  },
  friendInfo: {
    flex: 1,
    marginLeft: 12,
  },
  friendName: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 2,
  },
  friendDetail: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.textSecondary,
  },
  friendDetailSub: {
    fontSize: 11.5,
    fontWeight: '500',
    color: theme.textMuted,
    marginTop: 2,
  },
  messageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: theme.primary,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
    gap: 5,
  },
  messageBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.primary,
  },
  communityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.border,
  },
  communityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EBF2FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  communityInfo: {
    flex: 1,
    marginLeft: 12,
  },
  communityName: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 2,
  },
  communityMembers: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.textSecondary,
  },
  joinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: theme.primary,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 7,
    minWidth: 80,
  },
  joinedBtn: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  joinBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.primary,
  },
  joinedBtnText: {
    color: theme.card,
  },
  joinedIcon: {
    marginRight: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.text,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.textMuted,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  filterSheet: {
    backgroundColor: theme.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  filterSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  filterSheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.text,
  },
  resetText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.danger,
  },
  filterScrollView: {
    padding: 20,
  },
  filterGroupLabel: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#475569',
    marginTop: 16,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 4,
  },
  pill: {
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: theme.border,
  },
  pillActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  pillTextActive: {
    color: theme.card,
  },
  applyButton: {
    backgroundColor: theme.primary,
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.card,
  },
  superAdminSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: theme.card,
    borderBottomWidth: 1,
    borderColor: theme.border,
  },
  selectorLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginRight: 8,
  },
  selectorScroll: {
    gap: 8,
  },
  selectorChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  selectorChipActive: {
    backgroundColor: theme.primary,
  },
  selectorChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.textSecondary,
  },
  selectorChipTextActive: {
    color: theme.card,
  },
});

export default AdminUsersScreen;
