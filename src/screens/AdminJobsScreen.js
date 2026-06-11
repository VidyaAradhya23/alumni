import React, { useState } from 'react';
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
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const DUMMY_JOBS = [
  {
    id: '1',
    role: 'Sr Software Engineer',
    company: 'Paypal',
    workMode: 'Full-Time',
    experience: '5+ years',
    location: 'Bengaluru',
    views: 124,
    applied: 38,
    description:
      'We are looking for a Senior Software Engineer to join our payments platform team. You will design, develop, and maintain scalable backend services that power millions of transactions daily. Strong experience in distributed systems, microservices architecture, and cloud technologies is required. You will collaborate with cross-functional teams to deliver high-quality solutions.',
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
    description:
      'Amazon is hiring a Backend Developer to work on our cloud infrastructure services. You will build and optimize APIs, work with large-scale databases, and contribute to the architecture of highly available systems. Experience with AWS services, Java or Python, and RESTful API design is essential. Join us to solve complex engineering challenges at scale.',
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
    description:
      'Google is seeking a Frontend Engineer to build next-generation web applications. You will work with React, TypeScript, and modern web technologies to create performant and accessible user interfaces. Collaboration with UX designers and backend engineers is key. A passion for clean code, testing, and continuous improvement is a must.',
  },
];

const RESUME_DATA = [
  {
    id: 'r1',
    name: 'Sarthak Banka',
    initials: 'SB',
    skills: ['C++', 'C', 'JavaScript', 'Node.js', 'Python'],
    company: 'Qualcomm',
    role: 'Software Engineer',
    domain: 'Technology',
    experience: '1-2 years',
    description:
      'Passionate software engineer with strong fundamentals in systems programming and web development. Experienced in building efficient, scalable applications.',
  },
  {
    id: 'r2',
    name: 'Manjunath N',
    initials: 'MN',
    skills: ['B2B Sales', 'Export', 'International Marketing'],
    company: 'Maverik',
    role: 'Sr Manager',
    domain: 'Sales & Marketing',
    experience: '6-10 years',
    description:
      'Seasoned business development professional with extensive experience in B2B sales, export management, and international market expansion across multiple geographies.',
  },
];

const WORK_MODES = ['Full-Time', 'Part-Time', 'Remote', 'Hybrid', 'Contract', 'Internship'];

export default function AdminJobsScreen({ navigation }) {
  const [jobs, setJobs] = useState(DUMMY_JOBS);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showResumeBook, setShowResumeBook] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showWorkModeModal, setShowWorkModeModal] = useState(false);

  const [formRole, setFormRole] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formWorkMode, setFormWorkMode] = useState('');
  const [formExperience, setFormExperience] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formDescription, setFormDescription] = useState('');

  const resetForm = () => {
    setFormRole('');
    setFormCompany('');
    setFormWorkMode('');
    setFormExperience('');
    setFormLocation('');
    setFormDescription('');
  };

  const handlePostJob = () => {
    if (!formRole.trim() || !formCompany.trim()) {
      Alert.alert('Missing Fields', 'Please fill in at least the role and company name.');
      return;
    }
    const newJob = {
      id: Date.now().toString(),
      role: formRole.trim(),
      company: formCompany.trim(),
      workMode: formWorkMode || 'Full-Time',
      experience: formExperience.trim() || 'Not specified',
      location: formLocation.trim() || 'Not specified',
      views: 0,
      applied: 0,
      description: formDescription.trim() || 'No description provided.',
    };
    setJobs([newJob, ...jobs]);
    resetForm();
    setShowEditor(false);
    Alert.alert('Success', 'Job posted successfully!');
  };

  const handleDeleteJob = (jobId) => {
    Alert.alert('Delete Job', 'Are you sure you want to delete this job posting?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setJobs(jobs.filter((j) => j.id !== jobId));
          if (selectedJob && selectedJob.id === jobId) {
            setSelectedJob(null);
          }
        },
      },
    ]);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.avatarContainer}
        onPress={() => navigation && navigation.navigate('AdminProfile')}
        activeOpacity={0.7}
      >
        <View style={styles.avatar}>
          <Ionicons name="person" size={20} color="#FFFFFF" />
        </View>
      </TouchableOpacity>
      <View style={styles.searchBarContainer}>
        <Ionicons name="search-outline" size={18} color="#94A3B8" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search jobs..."
          placeholderTextColor="#94A3B8"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      <View style={styles.headerIcons}>
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

  const renderBadge = (text) => (
    <View style={styles.badge} key={text}>
      <Text style={styles.badgeText}>{text}</Text>
    </View>
  );

  // ─── JOB DETAIL VIEW ─────────────────────────────────────────────────
  const renderJobDetail = () => (
    <View style={styles.detailContainer}>
      <View style={styles.detailHeader}>
        <TouchableOpacity
          onPress={() => setSelectedJob(null)}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#003366" />
        </TouchableOpacity>
        <Text style={styles.detailHeaderTitle}>Job Details</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView
        style={styles.detailScroll}
        contentContainerStyle={styles.detailScrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.detailLogoContainer}>
          <View style={styles.detailLogo}>
            <Ionicons name="business-outline" size={36} color="#003366" />
          </View>
        </View>
        <Text style={styles.detailRole}>{selectedJob.role}</Text>
        <Text style={styles.detailCompany}>{selectedJob.company}</Text>
        <View style={styles.detailBadges}>
          {renderBadge(selectedJob.workMode)}
          {renderBadge(selectedJob.experience)}
          {renderBadge(selectedJob.location)}
        </View>
        <View style={styles.detailSection}>
          <Text style={styles.detailSectionTitle}>Job Description</Text>
          <Text style={styles.detailDescription}>{selectedJob.description}</Text>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>👁</Text>
            <Text style={styles.statValue}>{selectedJob.views} Views</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>📄</Text>
            <Text style={styles.statValue}>{selectedJob.applied} Applied</Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.detailFooter}>
        <TouchableOpacity
          style={styles.applyButton}
          activeOpacity={0.8}
          onPress={() => Alert.alert('Apply', 'Application submitted!')}
        >
          <Text style={styles.applyButtonText}>Apply Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // ─── RESUME BOOK VIEW ────────────────────────────────────────────────
  const renderResumeCard = ({ item }) => (
    <View style={styles.resumeCard}>
      <View style={styles.resumeCardTop}>
        <View style={styles.resumeAvatar}>
          <Text style={styles.resumeAvatarText}>{item.initials}</Text>
        </View>
        <View style={styles.resumeNameContainer}>
          <Text style={styles.resumeName}>{item.name}</Text>
          <Text style={styles.resumeRole}>
            {item.role} at {item.company}
          </Text>
        </View>
        <TouchableOpacity style={styles.moreInfoBtn} activeOpacity={0.7}>
          <Text style={styles.moreInfoText}>More Info</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.skillsContainer}>
        {item.skills.map((skill) => (
          <View style={styles.skillPill} key={skill}>
            <Text style={styles.skillPillText}>{skill}</Text>
          </View>
        ))}
      </View>
      <View style={styles.resumeMeta}>
        <View style={styles.resumeMetaRow}>
          <Ionicons name="business-outline" size={14} color="#64748B" />
          <Text style={styles.resumeMetaText}>{item.company}</Text>
        </View>
        <View style={styles.resumeMetaRow}>
          <Ionicons name="briefcase-outline" size={14} color="#64748B" />
          <Text style={styles.resumeMetaText}>{item.role}</Text>
        </View>
        <View style={styles.resumeMetaRow}>
          <Ionicons name="grid-outline" size={14} color="#64748B" />
          <Text style={styles.resumeMetaText}>{item.domain}</Text>
        </View>
        <View style={styles.resumeMetaRow}>
          <Ionicons name="time-outline" size={14} color="#64748B" />
          <Text style={styles.resumeMetaText}>{item.experience}</Text>
        </View>
      </View>
      <Text style={styles.resumeDescription}>{item.description}</Text>
      <View style={styles.resumeActions}>
        <TouchableOpacity
          style={styles.resumeActionBtn}
          activeOpacity={0.7}
          onPress={() => Alert.alert('Resume', 'Showing resume...')}
        >
          <Ionicons name="document-text-outline" size={16} color="#003366" />
          <Text style={styles.resumeActionText}>Show Resume</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.resumeActionBtn, styles.resumeForwardBtn]}
          activeOpacity={0.7}
          onPress={() => Alert.alert('Forward', 'Resume forwarded!')}
        >
          <Ionicons name="arrow-redo-outline" size={16} color="#FFFFFF" />
          <Text style={[styles.resumeActionText, styles.resumeForwardText]}>Forward Resume</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderResumeBook = () => (
    <View style={styles.resumeBookContainer}>
      <View style={styles.detailHeader}>
        <TouchableOpacity
          onPress={() => setShowResumeBook(false)}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#003366" />
        </TouchableOpacity>
        <Text style={styles.detailHeaderTitle}>Resume Book</Text>
        <View style={{ width: 40 }} />
      </View>
      <View style={styles.resumeBanner}>
        <Text style={styles.resumeBannerTitle}>Are you a job seeker?</Text>
        <Text style={styles.resumeBannerSubtitle}>
          Get listed in the resume book and let recruiters find you.
        </Text>
        <View style={styles.resumeBannerButtons}>
          <TouchableOpacity
            style={styles.getListedBtn}
            activeOpacity={0.8}
            onPress={() => Alert.alert('Get Listed', 'Listing flow initiated.')}
          >
            <Text style={styles.getListedText}>Get Listed</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.learnMoreBtn}
            activeOpacity={0.8}
            onPress={() => Alert.alert('Learn More', 'More information about resume book.')}
          >
            <Text style={styles.learnMoreText}>Learn More</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={RESUME_DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderResumeCard}
        contentContainerStyle={styles.resumeList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  // ─── EDITOR / CREATE JOB VIEW ────────────────────────────────────────
  const renderEditor = () => (
    <View style={styles.editorContainer}>
      <View style={styles.detailHeader}>
        <TouchableOpacity
          onPress={() => {
            resetForm();
            setShowEditor(false);
          }}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#003366" />
        </TouchableOpacity>
        <Text style={styles.detailHeaderTitle}>Create Job Post</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView
        style={styles.editorScroll}
        contentContainerStyle={styles.editorScrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.editorLabel}>Role *</Text>
        <TextInput
          style={styles.editorInput}
          placeholder="e.g. Sr Software Engineer"
          placeholderTextColor="#94A3B8"
          value={formRole}
          onChangeText={setFormRole}
        />

        <Text style={styles.editorLabel}>Company *</Text>
        <TextInput
          style={styles.editorInput}
          placeholder="e.g. Google"
          placeholderTextColor="#94A3B8"
          value={formCompany}
          onChangeText={setFormCompany}
        />

        <Text style={styles.editorLabel}>Work Mode</Text>
        <TouchableOpacity
          style={styles.editorSelector}
          activeOpacity={0.7}
          onPress={() => setShowWorkModeModal(true)}
        >
          <Text
            style={[
              styles.editorSelectorText,
              !formWorkMode && styles.editorSelectorPlaceholder,
            ]}
          >
            {formWorkMode || 'Select work mode'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#64748B" />
        </TouchableOpacity>

        <Text style={styles.editorLabel}>Experience</Text>
        <TextInput
          style={styles.editorInput}
          placeholder="e.g. 3-5 years"
          placeholderTextColor="#94A3B8"
          value={formExperience}
          onChangeText={setFormExperience}
        />

        <Text style={styles.editorLabel}>Location</Text>
        <TextInput
          style={styles.editorInput}
          placeholder="e.g. Bengaluru"
          placeholderTextColor="#94A3B8"
          value={formLocation}
          onChangeText={setFormLocation}
        />

        <Text style={styles.editorLabel}>Description</Text>
        <TextInput
          style={[styles.editorInput, styles.editorTextArea]}
          placeholder="Enter job description..."
          placeholderTextColor="#94A3B8"
          value={formDescription}
          onChangeText={setFormDescription}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />

        <TouchableOpacity style={styles.postJobButton} activeOpacity={0.8} onPress={handlePostJob}>
          <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
          <Text style={styles.postJobButtonText}>Post Job</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={showWorkModeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowWorkModeModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowWorkModeModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Work Mode</Text>
            {WORK_MODES.map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[
                  styles.modalOption,
                  formWorkMode === mode && styles.modalOptionSelected,
                ]}
                activeOpacity={0.7}
                onPress={() => {
                  setFormWorkMode(mode);
                  setShowWorkModeModal(false);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    formWorkMode === mode && styles.modalOptionTextSelected,
                  ]}
                >
                  {mode}
                </Text>
                {formWorkMode === mode && (
                  <Ionicons name="checkmark" size={20} color="#003366" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );

  // ─── JOB CARD ─────────────────────────────────────────────────────────
  const renderJobCard = ({ item }) => (
    <View style={styles.jobCard}>
      <View style={styles.jobCardHeader}>
        <TouchableOpacity
          style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
          activeOpacity={0.7}
          onPress={() => setSelectedJob(item)}
        >
          <View style={styles.jobLogo}>
            <Ionicons name="business-outline" size={24} color="#003366" />
          </View>
          <View style={styles.jobCardInfo}>
            <Text style={styles.jobRole} numberOfLines={1}>
              {item.role}
            </Text>
            <Text style={styles.jobCompany}>{item.company}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          activeOpacity={0.7}
          onPress={() => handleDeleteJob(item.id)}
        >
          <Ionicons name="close-circle" size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setSelectedJob(item)}
      >
        <View style={styles.jobBadges}>
          {renderBadge(item.workMode)}
          {renderBadge(item.experience)}
          {renderBadge(item.location)}
        </View>
        <View style={styles.jobStatsRow}>
          <View style={styles.jobStatItem}>
            <Ionicons name="eye-outline" size={16} color="#64748B" />
            <Text style={styles.jobStatText}>{item.views} Views</Text>
          </View>
          <View style={styles.jobStatItem}>
            <Ionicons name="document-text-outline" size={16} color="#64748B" />
            <Text style={styles.jobStatText}>{item.applied} Applied</Text>
          </View>
        </View>
        <View style={styles.viewMoreBtn}>
          <Text style={styles.viewMoreText}>View More</Text>
          <Ionicons name="arrow-forward" size={16} color="#003366" />
        </View>
      </TouchableOpacity>
    </View>
  );

  // ─── EMPTY STATE ──────────────────────────────────────────────────────
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="briefcase-outline" size={64} color="#E2E8F0" />
      <Text style={styles.emptyTitle}>No Job Postings</Text>
      <Text style={styles.emptySubtitle}>
        Tap the + button below to create your first job post.
      </Text>
    </View>
  );

  // ─── MAIN LIST VIEW ──────────────────────────────────────────────────
  const filteredJobs = jobs.filter((job) => {
    if (!searchText.trim()) return true;
    const query = searchText.toLowerCase();
    return (
      job.role.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query) ||
      job.location.toLowerCase().includes(query) ||
      job.workMode.toLowerCase().includes(query)
    );
  });

  const renderMainList = () => (
    <View style={styles.mainListContainer}>
      <Text style={styles.sectionTitle}>Job Postings</Text>
      <FlatList
        data={filteredJobs}
        keyExtractor={(item) => item.id}
        renderItem={renderJobCard}
        contentContainerStyle={styles.jobList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
      <TouchableOpacity
        style={styles.resumeBookFab}
        activeOpacity={0.8}
        onPress={() => setShowResumeBook(true)}
      >
        <Ionicons name="book-outline" size={20} color="#FFFFFF" />
        <Text style={styles.resumeBookFabText}>Resume Book</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => setShowEditor(true)}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  // ─── BODY ROUTER ──────────────────────────────────────────────────────
  const renderBody = () => {
    if (selectedJob) return renderJobDetail();
    if (showResumeBook) return renderResumeBook();
    if (showEditor) return renderEditor();
    return renderMainList();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {renderHeader()}
      {renderBody()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  // ─── HEADER ─────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#003366',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#0F172A',
    padding: 0,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  headerIconBtn: {
    marginLeft: 8,
    padding: 4,
  },

  // ─── BADGES ─────────────────────────────────────────────────────────
  badge: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#003366',
  },

  // ─── JOB DETAIL VIEW ───────────────────────────────────────────────
  detailContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  detailHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#002144',
  },
  detailScroll: {
    flex: 1,
  },
  detailScrollContent: {
    padding: 20,
    paddingBottom: 32,
  },
  detailLogoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  detailLogo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  detailRole: {
    fontSize: 22,
    fontWeight: '800',
    color: '#002144',
    textAlign: 'center',
    marginBottom: 4,
  },
  detailCompany: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
  },
  detailBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 24,
  },
  detailSection: {
    marginBottom: 24,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#002144',
    marginBottom: 10,
  },
  detailDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 16,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#002144',
  },
  detailFooter: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  applyButton: {
    backgroundColor: '#003366',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // ─── RESUME BOOK ────────────────────────────────────────────────────
  resumeBookContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  resumeBanner: {
    backgroundColor: '#003366',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
  },
  resumeBannerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  resumeBannerSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#CBD5E1',
    marginBottom: 16,
    lineHeight: 20,
  },
  resumeBannerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  getListedBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 12,
  },
  getListedText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#003366',
  },
  learnMoreBtn: {
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  learnMoreText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  resumeList: {
    padding: 16,
    paddingBottom: 32,
  },
  resumeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  resumeCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  resumeAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#003366',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  resumeAvatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  resumeNameContainer: {
    flex: 1,
  },
  resumeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#002144',
  },
  resumeRole: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  moreInfoBtn: {
    borderWidth: 1,
    borderColor: '#003366',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  moreInfoText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#003366',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  skillPill: {
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginRight: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  skillPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#003366',
  },
  resumeMeta: {
    marginBottom: 12,
  },
  resumeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  resumeMetaText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    marginLeft: 8,
  },
  resumeDescription: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 14,
  },
  resumeActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resumeActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#003366',
    marginRight: 8,
  },
  resumeForwardBtn: {
    backgroundColor: '#003366',
    borderColor: '#003366',
    marginRight: 0,
    marginLeft: 8,
  },
  resumeActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#003366',
    marginLeft: 6,
  },
  resumeForwardText: {
    color: '#FFFFFF',
  },

  // ─── EDITOR / CREATE JOB ───────────────────────────────────────────
  editorContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  editorScroll: {
    flex: 1,
  },
  editorScrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  editorLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#002144',
    marginBottom: 8,
    marginTop: 16,
  },
  editorInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    fontWeight: '500',
    color: '#0F172A',
  },
  editorTextArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  editorSelector: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editorSelectorText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0F172A',
  },
  editorSelectorPlaceholder: {
    color: '#94A3B8',
  },
  postJobButton: {
    backgroundColor: '#003366',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
  },
  postJobButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 8,
  },

  // ─── WORK MODE MODAL ───────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 340,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#002144',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 4,
  },
  modalOptionSelected: {
    backgroundColor: '#EFF6FF',
  },
  modalOptionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  modalOptionTextSelected: {
    color: '#003366',
  },

  // ─── MAIN LIST ──────────────────────────────────────────────────────
  mainListContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#002144',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  jobList: {
    paddingHorizontal: 16,
    paddingBottom: 160,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  jobCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  jobLogo: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  jobCardInfo: {
    flex: 1,
  },
  jobRole: {
    fontSize: 16,
    fontWeight: '700',
    color: '#002144',
  },
  jobCompany: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  deleteButton: {
    padding: 4,
  },
  jobBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  jobStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  jobStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  jobStatText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginLeft: 6,
  },
  viewMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  viewMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#003366',
    marginRight: 6,
  },

  // ─── EMPTY STATE ────────────────────────────────────────────────────
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94A3B8',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },

  // ─── FAB BUTTONS ────────────────────────────────────────────────────
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#003366',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#003366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  resumeBookFab: {
    position: 'absolute',
    bottom: 36,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#002144',
    elevation: 6,
    shadowColor: '#002144',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  resumeBookFabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});
