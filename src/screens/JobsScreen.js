import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Alert,
  ScrollView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const INITIAL_JOBS = [
  {
    id: '1',
    role: 'Sr Software Engineer',
    company: 'Paypal',
    workMode: 'Full-Time',
    experience: '5+ years',
    location: 'Bengaluru',
    views: 124,
    applied: 38,
    shared: 14,
    description:
      'We are looking for a Senior Software Engineer with strong background in Node.js and scalable architectures to join our core team.',
  },
  {
    id: '2',
    role: 'Backend Developer',
    company: 'Amazon',
    workMode: 'Remote',
    experience: '3-5 years',
    location: 'Remote',
    views: 89,
    applied: 22,
    shared: 8,
    description: 'Join our AWS team to build highly available backend services.',
  },
  {
    id: '3',
    role: 'Frontend Engineer',
    company: 'Google',
    workMode: 'Hybrid',
    experience: '2+ years',
    location: 'Hyderabad',
    views: 156,
    applied: 45,
    shared: 25,
    description: 'Build beautiful user interfaces with React and Next.js.',
  },
];

const PROFILE_MATCHES = [
  { id: 'm1', title: 'Senior Full Stack Engineer', company: 'Google', location: 'Bengaluru / Hybrid', match: '95% Match' },
  { id: 'm2', title: 'Backend Developer (Node.js)', company: 'Amazon', location: 'Remote', match: '88% Match' },
  { id: 'm3', title: 'Lead Software Engineer', company: 'Microsoft', location: 'Hyderabad', match: '82% Match' },
];

const RESUME_LIST = [
  {
    id: 'r1',
    name: 'Sarthak Banka',
    skills: ['C++', 'C', 'JavaScript', 'Node.js', 'Python'],
    company: 'Qualcomm',
    role: 'Software Engineer',
    domain: 'Software Engineering',
    experience: '1 - 2 years',
    desc: '',
  },
  {
    id: 'r2',
    name: 'Manjunath N',
    skills: ['B2B Sales', 'Export', 'International Marketing', 'Sales', 'Marketing'],
    company: 'Maverik Facility Management Private Limited',
    role: 'Sr Manager',
    domain: 'Sales / Business',
    experience: '6-10 years',
    desc: 'Over 11 years of experience in Business Development, Key Account Management, and Team Management.',
  },
];

const WORK_MODES = ['Full-Time', 'Part-Time', 'Internship', 'Contract', 'Hybrid', 'Remote'];

const JobsScreen = ({ navigation, route }) => {
  // View state: 'list' | 'detail' | 'editor' | 'resume'
  const [currentView, setCurrentView] = useState('list');
  const [activeTab, setActiveTab] = useState('post_job');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);

  // Job Post Form States
  const [jobRole, setJobRole] = useState('');
  const [jobCompany, setJobCompany] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [jobExperience, setJobExperience] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobWorkMode, setJobWorkMode] = useState('Full-Time');
  const [workModeModalVisible, setWorkModeModalVisible] = useState(false);

  const [jobList, setJobList] = useState(INITIAL_JOBS);

  useEffect(() => {
    if (route && route.params && route.params.openEditor) {
      setCurrentView('editor');
      if (navigation && navigation.setParams) {
        navigation.setParams({ openEditor: undefined });
      }
    }
  }, [route, navigation]);

  const handleDeleteJob = (id) => {
    setJobList((prev) => prev.filter((job) => job.id !== id));
  };

  const handlePostJob = () => {
    if (!jobRole.trim() || !jobCompany.trim()) {
      Alert.alert('Required', 'Please fill in at least the Role and Company.');
      return;
    }
    const newJob = {
      id: Date.now().toString(),
      role: jobRole,
      company: jobCompany,
      workMode: jobWorkMode,
      experience: jobExperience || 'Not specified',
      location: jobLocation || 'Remote',
      views: 0,
      applied: 0,
      shared: 0,
      description: jobDescription || 'No description provided.',
    };
    setJobList([newJob, ...jobList]);
    setJobRole('');
    setJobCompany('');
    setJobLocation('');
    setJobExperience('');
    setJobDescription('');
    setJobWorkMode('Full-Time');
    setCurrentView('list');
    Alert.alert('Success', 'Your job opportunity has been posted successfully!');
  };

  const openJobDetail = (job) => {
    setSelectedJob(job);
    setCurrentView('detail');
  };

  const filteredJobs = jobList.filter(
    (job) =>
      job.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* === JOB DETAILS VIEW === */}
      {currentView === 'detail' && selectedJob != null && (
        <View style={{ flex: 1 }}>
          <View style={styles.editorHeader}>
            <TouchableOpacity onPress={() => { setSelectedJob(null); setCurrentView('list'); }}>
              <Ionicons name="arrow-back" size={24} color="#0F172A" />
            </TouchableOpacity>
            <View style={styles.editorHeaderCenter}>
              <Text style={styles.editorTitleText}>Job Details</Text>
            </View>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView contentContainerStyle={styles.jobDetailsContent} showsVerticalScrollIndicator={false}>
            <View style={styles.jobDetailsTopCard}>
              <View style={styles.detailsCompanyLogo}>
                <Text style={styles.logoText}>Co. logo</Text>
              </View>
              <Text style={styles.detailsJobTitle}>{selectedJob.role}</Text>
              <Text style={styles.detailsJobCompany}>{selectedJob.company}</Text>
              <View style={[styles.jobDetailsRow, { justifyContent: 'center', marginTop: 12 }]}>
                <View style={styles.jobDetailBadge}>
                  <Ionicons name="briefcase-outline" size={12} color="#64748B" style={{ marginRight: 4 }} />
                  <Text style={styles.jobDetailText}>{selectedJob.workMode}</Text>
                </View>
                <View style={styles.jobDetailBadge}>
                  <Ionicons name="time-outline" size={12} color="#64748B" style={{ marginRight: 4 }} />
                  <Text style={styles.jobDetailText}>{selectedJob.experience}</Text>
                </View>
                <View style={styles.jobDetailBadge}>
                  <Ionicons name="location-outline" size={12} color="#64748B" style={{ marginRight: 4 }} />
                  <Text style={styles.jobDetailText}>{selectedJob.location}</Text>
                </View>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statEmoji}>👁</Text>
                <Text style={styles.statValue}>{selectedJob.views || 0} Views</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statEmoji}>📄</Text>
                <Text style={styles.statValue}>{selectedJob.applied || 0} Applied</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statEmoji}>🔗</Text>
                <Text style={styles.statValue}>{selectedJob.shared || 0} Shared</Text>
              </View>
            </View>

            <View style={styles.jobDetailsDescSection}>
              <Text style={styles.jobDetailsSectionTitle}>Job Description</Text>
              <Text style={styles.jobDetailsDescText}>{selectedJob.description}</Text>
            </View>
          </ScrollView>

          <View style={styles.jobDetailsBottomBar}>
            <TouchableOpacity
              style={styles.jobDetailsApplyBtn}
              onPress={() => Alert.alert('Applied', 'You have successfully applied for this role.')}
            >
              <Text style={styles.jobDetailsApplyBtnText}>Apply Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* === RESUME BOOK VIEW === */}
      {currentView === 'resume' && (
        <View style={{ flex: 1 }}>
          <View style={styles.editorHeader}>
            <TouchableOpacity onPress={() => setCurrentView('list')}>
              <Ionicons name="arrow-back" size={24} color="#0F172A" />
            </TouchableOpacity>
            <View style={styles.editorHeaderCenter}>
              <Text style={styles.editorTitleText}>Resume Book</Text>
            </View>
            <View style={{ width: 24 }} />
          </View>

          <FlatList
            data={RESUME_LIST}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.resumeListContent}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View>
                <View style={styles.seekerBanner}>
                  <Text style={styles.seekerBannerText}>Are you a job seeker?</Text>
                  <View style={styles.seekerBannerBtns}>
                    <TouchableOpacity style={styles.btnGetListed}>
                      <Text style={styles.btnGetListedText}>Get Listed</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnLearnMore}>
                      <Text style={styles.btnLearnMoreText}>Learn More</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.resumeHeaderTitle}>Resume book of your network</Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.resumeCardWrapper}>
                <View style={styles.resumeCardTop}>
                  <View style={styles.resumeTopSection}>
                    <View style={styles.resumeAvatarLarge}>
                      <Text style={styles.resumeAvatarInitials}>{item.name.charAt(0)}</Text>
                    </View>
                    <View style={styles.resumeNameWrap}>
                      <Text style={styles.resumeNameLarge}>{item.name}</Text>
                      <TouchableOpacity>
                        <Text style={styles.moreInfoText}>More Info</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.resumeDetailsSection}>
                    <View style={styles.skillsContainer}>
                      <Ionicons name="cog-outline" size={16} color="#94A3B8" style={{ marginRight: 8, marginTop: 4 }} />
                      <View style={styles.skillsWrap}>
                        {item.skills.map((skill, index) => (
                          <View key={index} style={styles.skillPill}>
                            <Text style={styles.skillPillText}>{skill}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                    <View style={styles.resumeDetailRow}>
                      <Ionicons name="briefcase-outline" size={16} color="#94A3B8" style={{ marginRight: 8 }} />
                      <Text style={styles.resumeCompanyText}>
                        {item.company} - <Text style={styles.resumeRoleTextLight}>{item.role}</Text>
                      </Text>
                    </View>
                    <View style={styles.resumeDetailRow}>
                      <Ionicons name="build-outline" size={16} color="#94A3B8" style={{ marginRight: 8 }} />
                      <Text style={styles.resumeDomainText}>
                        {item.domain} <Text style={styles.resumeRoleTextLight}>{item.experience}</Text>
                      </Text>
                    </View>
                    {item.desc ? <Text style={styles.resumeDescText}>{item.desc}</Text> : null}
                  </View>
                </View>
                <View style={styles.resumeCardBottom}>
                  <TouchableOpacity style={styles.actionBtnLeft}>
                    <Text style={styles.actionBtnText}>Show Resume</Text>
                    <Ionicons name="open-outline" size={16} color="#003366" style={{ marginLeft: 4 }} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtnRight}>
                    <Text style={styles.actionBtnText}>Forward Resume</Text>
                    <Ionicons name="arrow-forward" size={16} color="#003366" style={{ marginLeft: 4 }} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      )}

      {/* === EDITOR VIEW === */}
      {currentView === 'editor' && (
        <View style={{ flex: 1 }}>
          <View style={styles.editorHeader}>
            <TouchableOpacity onPress={() => setCurrentView('list')}>
              <Ionicons name="close" size={24} color="#0F172A" />
            </TouchableOpacity>
            <View style={styles.editorHeaderCenter}>
              <Text style={styles.editorTitleText}>Create Job Post</Text>
            </View>
            <View style={styles.editorHeaderRight}>
              <TouchableOpacity style={styles.postBtn} onPress={handlePostJob}>
                <Text style={styles.postBtnText}>Post Job</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.editorBody} showsVerticalScrollIndicator={false}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Role / Job Title *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Senior Software Engineer"
                placeholderTextColor="#94A3B8"
                value={jobRole}
                onChangeText={setJobRole}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Company *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Google, Amazon"
                placeholderTextColor="#94A3B8"
                value={jobCompany}
                onChangeText={setJobCompany}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Work Mode</Text>
              <TouchableOpacity
                style={styles.selectorInput}
                onPress={() => setWorkModeModalVisible(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.selectorText}>{jobWorkMode}</Text>
                <Ionicons name="chevron-down" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Experience Required</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. 3-5 years, 5+ years"
                placeholderTextColor="#94A3B8"
                value={jobExperience}
                onChangeText={setJobExperience}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Location</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Bengaluru, Remote"
                placeholderTextColor="#94A3B8"
                value={jobLocation}
                onChangeText={setJobLocation}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Job Description</Text>
              <TextInput
                style={[styles.textInput, { height: 120, textAlignVertical: 'top' }]}
                placeholder="Provide a detailed description of the role..."
                placeholderTextColor="#94A3B8"
                value={jobDescription}
                onChangeText={setJobDescription}
                multiline
              />
            </View>
          </ScrollView>

          {/* Work Mode Modal */}
          <Modal visible={workModeModalVisible} transparent animationType="fade">
            <View style={styles.modalOverlay}>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => setWorkModeModalVisible(false)} />
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Work Mode</Text>
                  <TouchableOpacity onPress={() => setWorkModeModalVisible(false)}>
                    <Ionicons name="close" size={24} color="#0F172A" />
                  </TouchableOpacity>
                </View>
                {WORK_MODES.map((mode) => (
                  <TouchableOpacity
                    key={mode}
                    style={[styles.modalItem, jobWorkMode === mode && styles.selectedModalItem]}
                    onPress={() => { setJobWorkMode(mode); setWorkModeModalVisible(false); }}
                  >
                    <Text style={[styles.modalItemText, jobWorkMode === mode && styles.selectedModalItemText]}>
                      {mode}
                    </Text>
                    {jobWorkMode === mode && <Ionicons name="checkmark" size={20} color="#003366" />}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Modal>
        </View>
      )}

      {/* === MAIN LIST VIEW === */}
      {currentView === 'list' && (
        <View style={{ flex: 1 }}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.headerAvatar}
              activeOpacity={0.8}
              onPress={() => navigation && navigation.navigate('Profile')}
            >
              <Text style={styles.headerAvatarText}>AJ</Text>
            </TouchableOpacity>
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={18} color="#94A3B8" style={{ marginRight: 6 }} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search"
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <View style={styles.headerIcons}>
              <TouchableOpacity
                style={[styles.headerIconBtn, { marginRight: 8 }]}
                onPress={() => setCurrentView('editor')}
              >
                <Ionicons name="add-circle-outline" size={22} color="#003366" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.headerIconBtn, { marginRight: 8 }]}
                onPress={() => navigation && navigation.navigate('Messages')}
              >
                <Ionicons name="chatbubble-ellipses-outline" size={22} color="#003366" />
                <View style={styles.dot} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerIconBtn}
                onPress={() => navigation && navigation.navigate('Notifications')}
              >
                <Ionicons name="notifications-outline" size={22} color="#003366" />
                <View style={styles.dot} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'post_job' && styles.activeTab]}
              onPress={() => setActiveTab('post_job')}
            >
              <Text style={[styles.tabText, activeTab === 'post_job' && styles.activeTabText]}>Post Job</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'preferences' && styles.activeTab]}
              onPress={() => setActiveTab('preferences')}
            >
              <Text style={[styles.tabText, activeTab === 'preferences' && styles.activeTabText]}>Preferences</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          {activeTab === 'post_job' ? (
            <View style={{ flex: 1 }}>
              <FlatList
                data={filteredJobs}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View style={styles.jobCard}>
                    <TouchableOpacity
                      style={{ flex: 1, flexDirection: 'row' }}
                      activeOpacity={0.7}
                      onPress={() => openJobDetail(item)}
                    >
                      <View style={styles.companyLogo}>
                        <Text style={styles.logoText}>Co. logo</Text>
                      </View>
                      <View style={styles.jobInfo}>
                        <Text style={styles.jobTitle}>{item.role}</Text>
                        <Text style={styles.jobCompanyText}>{item.company}</Text>
                        <View style={styles.jobDetailsRow}>
                          <View style={styles.jobDetailBadge}>
                            <Ionicons name="briefcase-outline" size={12} color="#64748B" style={{ marginRight: 4 }} />
                            <Text style={styles.jobDetailText}>{item.workMode}</Text>
                          </View>
                          <View style={styles.jobDetailBadge}>
                            <Ionicons name="time-outline" size={12} color="#64748B" style={{ marginRight: 4 }} />
                            <Text style={styles.jobDetailText}>{item.experience}</Text>
                          </View>
                          <View style={styles.jobDetailBadge}>
                            <Ionicons name="location-outline" size={12} color="#64748B" style={{ marginRight: 4 }} />
                            <Text style={styles.jobDetailText}>{item.location}</Text>
                          </View>
                        </View>
                        <View style={styles.jobStatsRow}>
                          <View style={styles.jobStatItem}>
                            <Ionicons name="eye-outline" size={14} color="#64748B" />
                            <Text style={styles.jobStatText}>{item.views || 0} Views</Text>
                          </View>
                          <View style={styles.jobStatItem}>
                            <Ionicons name="document-text-outline" size={14} color="#64748B" />
                            <Text style={styles.jobStatText}>{item.applied || 0} Applied</Text>
                          </View>
                          <View style={styles.jobStatItem}>
                            <Ionicons name="share-social-outline" size={14} color="#64748B" />
                            <Text style={styles.jobStatText}>{item.shared || 0} Shared</Text>
                          </View>
                        </View>
                        <View style={styles.viewMoreBtn}>
                          <Text style={styles.viewMoreText}>View More</Text>
                          <Ionicons name="arrow-forward" size={14} color="#003366" style={{ marginLeft: 4 }} />
                        </View>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.closeBtn} onPress={() => handleDeleteJob(item.id)}>
                      <Ionicons name="close" size={18} color="#94A3B8" />
                    </TouchableOpacity>
                  </View>
                )}
                ListEmptyComponent={
                  <View style={styles.emptyState}>
                    <Ionicons name="briefcase-outline" size={48} color="#CBD5E1" />
                    <Text style={styles.emptyTitle}>No Jobs Posted Yet</Text>
                    <Text style={styles.emptySubtitle}>
                      Tap the floating button below to post a new job opportunity.
                    </Text>
                  </View>
                }
              />

              {/* FAB Container */}
              <View style={styles.fabContainer}>
                <TouchableOpacity
                  style={styles.fabSmall}
                  onPress={() => setCurrentView('editor')}
                  activeOpacity={0.85}
                >
                  <Ionicons name="add" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.extendedFab, { marginTop: 12 }]}
                  onPress={() => setCurrentView('resume')}
                  activeOpacity={0.85}
                >
                  <Ionicons name="book-outline" size={20} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.extendedFabText}>Resume Book</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
              <Text style={styles.preferenceHeaderText}>Based on your profile</Text>
              {PROFILE_MATCHES.map((matchItem) => (
                <TouchableOpacity
                  key={matchItem.id}
                  style={styles.matchCard}
                  activeOpacity={0.7}
                  onPress={() =>
                    openJobDetail({
                      id: matchItem.id,
                      role: matchItem.title,
                      company: matchItem.company,
                      location: matchItem.location,
                      workMode: 'Full-Time',
                      experience: '3-5 years',
                      description: `This is a ${matchItem.match} for your profile. As a ${matchItem.title} at ${matchItem.company}, you will be responsible for building scalable systems.`,
                    })
                  }
                >
                  <View style={styles.matchIconBg}>
                    <Ionicons name="briefcase" size={24} color="#003366" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.commTitle}>{matchItem.title}</Text>
                    <Text style={styles.commDesc}>{matchItem.company} • {matchItem.location}</Text>
                    <Text style={styles.matchScoreText}>{matchItem.match}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#003366',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerAvatarText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 38,
    marginRight: 12,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#0F172A' },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  headerIconBtn: {
    position: 'relative',
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },

  // Tabs
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: { borderBottomColor: '#0F172A' },
  tabText: { fontSize: 14.5, fontWeight: '600', color: '#94A3B8' },
  activeTabText: { color: '#0F172A', fontWeight: '700' },

  // List Content
  listContent: { padding: 16, paddingBottom: 100 },

  // Job Card
  jobCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    position: 'relative',
  },
  companyLogo: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  logoText: { fontSize: 11, fontWeight: '700', color: '#94A3B8', textAlign: 'center' },
  jobInfo: { flex: 1, marginRight: 24 },
  jobTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  jobCompanyText: { fontSize: 14, color: '#475569', fontWeight: '600', marginBottom: 8 },
  jobDetailsRow: { flexDirection: 'row', flexWrap: 'wrap' },
  jobDetailBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  jobDetailText: { fontSize: 12, color: '#64748B', fontWeight: '500' },
  viewMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  viewMoreText: { fontSize: 13, fontWeight: '700', color: '#003366' },
  closeBtn: { position: 'absolute', right: 12, top: 24, padding: 4 },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: '#475569', marginTop: 12 },
  emptySubtitle: {
    fontSize: 13.5,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },

  // Job Details View
  jobDetailsContent: { padding: 20, paddingBottom: 40, backgroundColor: '#F8FAFC' },
  jobDetailsTopCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  detailsCompanyLogo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  detailsJobTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
    textAlign: 'center',
  },
  detailsJobCompany: { fontSize: 16, fontWeight: '600', color: '#475569', marginBottom: 12 },
  jobDetailsDescSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  jobDetailsSectionTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 12 },
  jobDetailsDescText: { fontSize: 14.5, color: '#475569', lineHeight: 24 },
  jobDetailsBottomBar: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  jobDetailsApplyBtn: { backgroundColor: '#003366', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  jobDetailsApplyBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },

  // Preferences Section
  preferenceHeaderText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  matchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 12,
  },
  matchIconBg: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  commTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  commDesc: { fontSize: 12, color: '#64748B', marginTop: 4, lineHeight: 16 },
  matchScoreText: { fontSize: 12, color: '#16A34A', fontWeight: '700', marginTop: 6 },

  // FAB Container
  fabContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    alignItems: 'flex-end',
  },
  extendedFab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#003366',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    shadowColor: '#003366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  extendedFabText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  fabSmall: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  // Editor View
  editorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  editorHeaderCenter: { flexDirection: 'row', alignItems: 'center' },
  editorTitleText: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  editorHeaderRight: { flexDirection: 'row', alignItems: 'center' },
  postBtn: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  postBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  editorBody: { flex: 1, padding: 20, backgroundColor: '#FFFFFF' },
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 13.5, fontWeight: '600', color: '#475569', marginBottom: 8 },
  textInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14.5,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  selectorInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  selectorText: { fontSize: 14.5, color: '#0F172A' },

  // Resume Book
  resumeListContent: { padding: 16, paddingBottom: 40, backgroundColor: '#F8FAFC' },
  seekerBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  seekerBannerText: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 12 },
  seekerBannerBtns: { flexDirection: 'row', width: '100%' },
  btnGetListed: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#003366',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    marginRight: 8,
  },
  btnGetListedText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  btnLearnMore: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#003366',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
  btnLearnMoreText: { color: '#003366', fontWeight: '700', fontSize: 14 },
  resumeHeaderTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A', marginBottom: 16 },
  resumeCardWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  resumeCardTop: {
    flexDirection: 'column',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  resumeTopSection: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  resumeNameWrap: { flex: 1 },
  resumeAvatarLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  resumeAvatarInitials: { fontSize: 22, fontWeight: '700', color: '#64748B' },
  resumeNameLarge: { fontSize: 18, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  moreInfoText: { fontSize: 13, fontWeight: '700', color: '#003366' },
  resumeDetailsSection: { width: '100%' },
  skillsContainer: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  skillsWrap: { flex: 1, flexDirection: 'row', flexWrap: 'wrap' },
  skillPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  skillPillText: { fontSize: 11, color: '#475569', fontWeight: '600' },
  resumeDetailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  resumeCompanyText: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  resumeRoleTextLight: { fontWeight: '400', color: '#64748B' },
  resumeDomainText: { fontSize: 14, fontWeight: '600', color: '#0F172A' },
  resumeDescText: { fontSize: 13, color: '#64748B', lineHeight: 20, marginTop: 8, fontStyle: 'italic' },
  resumeCardBottom: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FAFAFA',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  actionBtnLeft: { flexDirection: 'row', alignItems: 'center' },
  actionBtnRight: { flexDirection: 'row', alignItems: 'center' },
  actionBtnText: { fontSize: 14, fontWeight: '700', color: '#003366' },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  selectedModalItem: { backgroundColor: '#F8FAFC' },
  modalItemText: { fontSize: 16, color: '#475569' },
  selectedModalItemText: { color: '#003366', fontWeight: '600' },

  // Stats
  jobStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  jobStatItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  jobStatText: { fontSize: 12, fontWeight: '600', color: '#64748B', marginLeft: 4 },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 8,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statEmoji: { fontSize: 16, marginRight: 6 },
  statValue: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
});

export default JobsScreen;
