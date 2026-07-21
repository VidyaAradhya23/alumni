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
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const INITIAL_JOBS = [];

const PROFILE_MATCHES = [];

const RESUME_LIST = [];

const WORK_MODES = ['Full-Time', 'Part-Time', 'Internship', 'Contract', 'Hybrid', 'Remote'];

// ─── JOB CARD COMPONENT ──────────────────────────────────────────────
function JobCard({ item, onPress, onDelete, isSmallScreen }) {
  return (
    <View style={st.jobCard}>
      <TouchableOpacity style={{ flex: 1, flexDirection: 'row' }} activeOpacity={0.7} onPress={() => onPress(item)}>
        <View style={st.companyLogo}>
          <Ionicons name="business-outline" size={isSmallScreen ? 18 : 22} color="#003366" />
        </View>
        <View style={{ flex: 1, marginRight: 24 }}>
          <Text style={[st.jobTitle, isSmallScreen && { fontSize: 14 }]}>{item.role}</Text>
          <Text style={[st.jobCompany, isSmallScreen && { fontSize: 12 }]}>{item.company}</Text>
          <View style={st.badgeRow}>
            <View style={st.badge}><Ionicons name="briefcase-outline" size={11} color="#64748B" style={{ marginRight: 3 }} /><Text style={st.badgeText}>{item.workMode}</Text></View>
            <View style={st.badge}><Ionicons name="time-outline" size={11} color="#64748B" style={{ marginRight: 3 }} /><Text style={st.badgeText}>{item.experience}</Text></View>
            <View style={st.badge}><Ionicons name="location-outline" size={11} color="#64748B" style={{ marginRight: 3 }} /><Text style={st.badgeText}>{item.location}</Text></View>
          </View>
          <View style={st.statsRow}>
            <View style={st.statItem}><Ionicons name="eye-outline" size={13} color="#64748B" /><Text style={st.statText}>{item.views || 0} Views</Text></View>
            <View style={st.statItem}><Ionicons name="document-text-outline" size={13} color="#64748B" /><Text style={st.statText}>{item.applied || 0} Applied</Text></View>
            <View style={st.statItem}><Ionicons name="share-social-outline" size={13} color="#64748B" /><Text style={st.statText}>{item.shared || 0} Shared</Text></View>
          </View>
          <View style={st.viewMoreBtn}><Text style={st.viewMoreText}>View More</Text><Ionicons name="arrow-forward" size={14} color="#003366" style={{ marginLeft: 4 }} /></View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={{ position: 'absolute', right: 12, top: 24, padding: 4 }} onPress={() => onDelete(item.id)}>
        <Ionicons name="close" size={18} color="#94A3B8" />
      </TouchableOpacity>
    </View>
  );
}

// ─── MAIN SCREEN ─────────────────────────────────────────────────────
const JobsScreen = ({ navigation, route }) => {
  const { theme, isDarkMode } = useTheme();

  const { width: screenWidth } = useWindowDimensions();
  const isSmallScreen = screenWidth < 400;
  const isDesktop = screenWidth >= 1024;
  const isWeb = Platform.OS === 'web';
  
  const [screen, setScreen] = useState('list'); // list, detail, editor, resume
  const [activeTab, setActiveTab] = useState('post_job');
  const [searchQ, setSearchQ] = useState('');
  const [detail, setDetail] = useState(null);
  const [jobList, setJobList] = useState(INITIAL_JOBS);

  // Form
  const [fRole, setFRole] = useState('');
  const [fCompany, setFCompany] = useState('');
  const [fLoc, setFLoc] = useState('');
  const [fExp, setFExp] = useState('');
  const [fDesc, setFDesc] = useState('');
  const [fMode, setFMode] = useState('Full-Time');
  const [modalVis, setModalVis] = useState(false);

  useEffect(() => {
    if (route && route.params && route.params.openEditor) {
      setScreen('editor');
      if (navigation && navigation.setParams) {
        navigation.setParams({ openEditor: undefined });
      }
    }
  }, [route, navigation]);

  const deleteJob = (id) => setJobList(prev => prev.filter(j => j.id !== id));

  const postJob = () => {
    if (!fRole.trim() || !fCompany.trim()) { Alert.alert('Required', 'Fill in Role and Company.'); return; }
    setJobList([{ id: String(Date.now()), role: fRole, company: fCompany, workMode: fMode, experience: fExp || 'Not specified', location: fLoc || 'Remote', views: 0, applied: 0, shared: 0, description: fDesc || 'No description.' }, ...jobList]);
    setFRole(''); setFCompany(''); setFLoc(''); setFExp(''); setFDesc(''); setFMode('Full-Time');
    setScreen('list');
    Alert.alert('Success', 'Job posted!');
  };

  const openDetail = (job) => { 
    setDetail(job); 
    if (!isDesktop) setScreen('detail'); 
  };

  const filtered = jobList.filter(j => j.role.toLowerCase().includes(searchQ.toLowerCase()) || j.company.toLowerCase().includes(searchQ.toLowerCase()) || j.location.toLowerCase().includes(searchQ.toLowerCase()));

  // ─── RENDER DETAIL ──────────────────────────────────────────────
  const renderDetail = () => {
    if (!detail) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
          <Ionicons name="document-text-outline" size={48} color="#CBD5E1" />
          <Text style={{ fontSize: 16, color: '#94A3B8', marginTop: 12 }}>Select a job to view details</Text>
        </View>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <View style={[st.editorHeader, isDesktop && { borderBottomWidth: 1, borderBottomColor: '#E2E8F0' }]}>
          {!isDesktop && <TouchableOpacity onPress={() => { setDetail(null); setScreen('list'); }}><Ionicons name="arrow-back" size={24} color="#0F172A" /></TouchableOpacity>}
          <Text style={st.editorTitle}>Job Details</Text>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView contentContainerStyle={{ padding: isSmallScreen ? 12 : 20, paddingBottom: 40, backgroundColor: '#F8FAFC' }} showsVerticalScrollIndicator={false}>
          <View style={st.detailCard}>
            <View style={st.detailLogo}><Ionicons name="business-outline" size={28} color="#003366" /></View>
            <Text style={[st.detailRole, isSmallScreen && { fontSize: 17 }]}>{detail.role}</Text>
            <Text style={st.detailCompany}>{detail.company}</Text>
            <View style={[st.badgeRow, { justifyContent: 'center', marginTop: 12, flexWrap: 'wrap' }]}>
              <View style={st.badge}><Text style={st.badgeText}>{detail.workMode}</Text></View>
              <View style={st.badge}><Text style={st.badgeText}>{detail.experience}</Text></View>
              <View style={st.badge}><Text style={st.badgeText}>{detail.location}</Text></View>
            </View>
          </View>
          <View style={[st.detailStatsRow, isSmallScreen && { flexDirection: 'column', gap: 8 }]}>
            <View style={[st.detailStatCard, isSmallScreen && { marginHorizontal: 0 }]}><Text style={{ fontSize: 16, marginRight: 6 }}>👁</Text><Text style={st.detailStatText}>{detail.views || 0} Views</Text></View>
            <View style={[st.detailStatCard, isSmallScreen && { marginHorizontal: 0 }]}><Text style={{ fontSize: 16, marginRight: 6 }}>📄</Text><Text style={st.detailStatText}>{detail.applied || 0} Applied</Text></View>
            <View style={[st.detailStatCard, isSmallScreen && { marginHorizontal: 0 }]}><Text style={{ fontSize: 16, marginRight: 6 }}>🔗</Text><Text style={st.detailStatText}>{detail.shared || 0} Shared</Text></View>
          </View>
          <View style={st.descSection}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 12 }}>Job Description</Text>
            <Text style={{ fontSize: 14.5, color: '#475569', lineHeight: 24 }}>{detail.description}</Text>
          </View>
        </ScrollView>
        <View style={st.bottomBar}>
          <TouchableOpacity style={st.applyBtn} onPress={() => Alert.alert('Applied', 'You have applied for this role.')}>
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '700' }}>Apply Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // ─── RENDER RESUME ──────────────────────────────────────────────
  const renderResume = () => (
    <View style={{ flex: 1 }}>
      <View style={[st.editorHeader, isDesktop && { borderBottomWidth: 1, borderBottomColor: '#E2E8F0' }]}>
        {!isDesktop && <TouchableOpacity onPress={() => setScreen('list')}><Ionicons name="arrow-back" size={24} color="#0F172A" /></TouchableOpacity>}
        <Text style={st.editorTitle}>Resume Book</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: isSmallScreen ? 12 : 16, paddingBottom: 40, backgroundColor: '#F8FAFC' }} showsVerticalScrollIndicator={false}>
        <View style={st.seekerBanner}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 12 }}>Are you a job seeker?</Text>
          <View style={{ flexDirection: 'row', width: '100%' }}>
            <TouchableOpacity style={st.getListedBtn}><Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 14 }}>Get Listed</Text></TouchableOpacity>
            <TouchableOpacity style={st.learnMoreBtn}><Text style={{ color: '#003366', fontWeight: '700', fontSize: 14 }}>Learn More</Text></TouchableOpacity>
          </View>
        </View>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#0F172A', marginBottom: 16 }}>Resume book of your network</Text>
        {RESUME_LIST.map(item => (
          <View key={item.id} style={st.resumeCard}>
            <View style={{ padding: isSmallScreen ? 12 : 16, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <View style={[st.resumeAvatar, isSmallScreen && { width: 48, height: 48, borderRadius: 24 }]}><Text style={{ fontSize: isSmallScreen ? 18 : 22, fontWeight: '700', color: '#64748B' }}>{item.name.charAt(0)}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: isSmallScreen ? 15 : 18, fontWeight: '700', color: '#0F172A', marginBottom: 4 }}>{item.name}</Text>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#003366' }}>More Info</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 }}>
                {item.skills.map((sk, i) => (<View key={i} style={st.skillPill}><Text style={{ fontSize: 11, color: '#475569', fontWeight: '600' }}>{sk}</Text></View>))}
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Ionicons name="briefcase-outline" size={16} color="#94A3B8" style={{ marginRight: 8 }} />
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#0F172A', flex: 1 }}>{item.company} - <Text style={{ fontWeight: '400', color: '#64748B' }}>{item.role}</Text></Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Ionicons name="build-outline" size={16} color="#94A3B8" style={{ marginRight: 8 }} />
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#0F172A', flex: 1 }}>{item.domain} <Text style={{ fontWeight: '400', color: '#64748B' }}>{item.experience}</Text></Text>
              </View>
              {item.desc ? <Text style={{ fontSize: 13, color: '#64748B', lineHeight: 20, marginTop: 8, fontStyle: 'italic' }}>{item.desc}</Text> : null}
            </View>
            <View style={{ flexDirection: isSmallScreen ? 'column' : 'row', justifyContent: 'space-between', paddingHorizontal: isSmallScreen ? 12 : 16, paddingVertical: 12, backgroundColor: '#FAFAFA', gap: isSmallScreen ? 8 : 0 }}>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}><Text style={{ fontSize: 14, fontWeight: '700', color: '#003366' }}>Show Resume</Text><Ionicons name="open-outline" size={16} color="#003366" style={{ marginLeft: 4 }} /></TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}><Text style={{ fontSize: 14, fontWeight: '700', color: '#003366' }}>Forward Resume</Text><Ionicons name="arrow-forward" size={16} color="#003366" style={{ marginLeft: 4 }} /></TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  // ─── RENDER EDITOR ──────────────────────────────────────────────
  const renderEditor = () => (
    <View style={{ flex: 1 }}>
      <View style={[st.editorHeader, isDesktop && { borderBottomWidth: 1, borderBottomColor: '#E2E8F0' }]}>
        {!isDesktop && <TouchableOpacity onPress={() => setScreen('list')}><Ionicons name="close" size={24} color="#0F172A" /></TouchableOpacity>}
        <Text style={st.editorTitle}>Create Job Post</Text>
        <TouchableOpacity style={st.postHeaderBtn} onPress={postJob}><Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 14 }}>Post Job</Text></TouchableOpacity>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: isSmallScreen ? 14 : 20, backgroundColor: '#FFFFFF' }} showsVerticalScrollIndicator={false}>
        <View style={{ marginBottom: 20 }}><Text style={st.inputLabel}>Role / Job Title *</Text><TextInput style={st.textInput} placeholder="e.g. Senior Software Engineer" placeholderTextColor="#94A3B8" value={fRole} onChangeText={setFRole} /></View>
        <View style={{ marginBottom: 20 }}><Text style={st.inputLabel}>Company *</Text><TextInput style={st.textInput} placeholder="e.g. Google, Amazon" placeholderTextColor="#94A3B8" value={fCompany} onChangeText={setFCompany} /></View>
        
        <View style={{ marginBottom: 20 }}>
          <Text style={st.inputLabel}>Work Mode</Text>
          {isWeb ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {WORK_MODES.map(mode => (
                <TouchableOpacity 
                  key={mode} 
                  style={[st.webChip, fMode === mode && st.webChipActive]} 
                  onPress={() => setFMode(mode)}
                >
                  <Text style={[st.webChipText, fMode === mode && st.webChipTextActive]}>{mode}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <TouchableOpacity style={st.selectorInput} onPress={() => setModalVis(true)}>
              <Text style={{ fontSize: 14.5, color: '#0F172A' }}>{fMode}</Text>
              <Ionicons name="chevron-down" size={20} color="#64748B" />
            </TouchableOpacity>
          )}
        </View>

        <View style={{ marginBottom: 20 }}><Text style={st.inputLabel}>Experience Required</Text><TextInput style={st.textInput} placeholder="e.g. 3-5 years" placeholderTextColor="#94A3B8" value={fExp} onChangeText={setFExp} /></View>
        <View style={{ marginBottom: 20 }}><Text style={st.inputLabel}>Location</Text><TextInput style={st.textInput} placeholder="e.g. Bengaluru, Remote" placeholderTextColor="#94A3B8" value={fLoc} onChangeText={setFLoc} /></View>
        <View style={{ marginBottom: 20 }}><Text style={st.inputLabel}>Job Description</Text><TextInput style={[st.textInput, { height: 120, textAlignVertical: 'top' }]} placeholder="Description..." placeholderTextColor="#94A3B8" value={fDesc} onChangeText={setFDesc} multiline /></View>
      </ScrollView>
    </View>
  );

  // ─── RENDER MAIN LIST ──────────────────────────────────────────────
  const renderMainList = () => (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={[st.header, isSmallScreen && { paddingHorizontal: 10, paddingVertical: 8 }]}>
        <TouchableOpacity style={[st.headerAvatar, isSmallScreen && { width: 32, height: 32, borderRadius: 16, marginRight: 8 }]} activeOpacity={0.8} onPress={() => navigation && navigation.navigate('Profile')}>
          <Text style={{ color: '#FFFFFF', fontSize: isSmallScreen ? 11 : 13, fontWeight: '700' }}>AJ</Text>
        </TouchableOpacity>
        <View style={[st.searchBar, isSmallScreen && { height: 34, marginRight: 8 }]}>
          <Ionicons name="search-outline" size={16} color="#94A3B8" style={{ marginRight: 6 }} />
          <TextInput style={{ flex: 1, fontSize: isSmallScreen ? 13 : 14, color: '#0F172A', paddingVertical: 0 }} placeholder="Search" placeholderTextColor="#94A3B8" value={searchQ} onChangeText={setSearchQ} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity style={[st.iconBtn, isSmallScreen && { width: 30, height: 30, marginLeft: 2 }]} onPress={() => { setDetail(null); setScreen('editor'); }}><Ionicons name="add-circle-outline" size={isSmallScreen ? 20 : 22} color="#003366" /></TouchableOpacity>
          <TouchableOpacity style={[st.iconBtn, isSmallScreen && { width: 30, height: 30, marginLeft: 2 }]} onPress={() => navigation && navigation.navigate('Messages')}><Ionicons name="chatbubble-ellipses-outline" size={isSmallScreen ? 20 : 22} color="#003366" /><View style={st.dot} /></TouchableOpacity>
          <TouchableOpacity style={[st.iconBtn, isSmallScreen && { width: 30, height: 30, marginLeft: 2 }]} onPress={() => navigation && navigation.navigate('Notifications')}><Ionicons name="notifications-outline" size={isSmallScreen ? 20 : 22} color="#003366" /><View style={st.dot} /></TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={st.tabBar}>
        <TouchableOpacity style={[st.tab, activeTab === 'post_job' && st.activeTab]} onPress={() => setActiveTab('post_job')}>
          <Text style={[st.tabText, activeTab === 'post_job' && st.activeTabText]}>Post Job</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[st.tab, activeTab === 'preferences' && st.activeTab]} onPress={() => setActiveTab('preferences')}>
          <Text style={[st.tabText, activeTab === 'preferences' && st.activeTabText]}>Preferences</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'post_job' ? (
        <View style={{ flex: 1, minHeight: 0 }}>
          <ScrollView
            contentContainerStyle={{ padding: isSmallScreen ? 12 : 16, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
          >
            {filtered.length > 0 ? (
              filtered.map(item => (
                <JobCard key={item.id} item={item} onPress={openDetail} onDelete={deleteJob} isSmallScreen={isSmallScreen} />
              ))
            ) : (
              <View style={{ alignItems: 'center', paddingVertical: 80, paddingHorizontal: 40 }}>
                <Ionicons name="briefcase-outline" size={48} color="#CBD5E1" />
                <Text style={{ fontSize: 17, fontWeight: '700', color: '#475569', marginTop: 12 }}>No Jobs Posted Yet</Text>
                <Text style={{ fontSize: 13.5, color: '#94A3B8', textAlign: 'center', marginTop: 6 }}>Tap the + button to post a new job.</Text>
              </View>
            )}
          </ScrollView>
          <View style={[st.fabContainer, isSmallScreen && { bottom: 16, right: 16 }]}>
            <TouchableOpacity style={[st.fab, isSmallScreen && { width: 50, height: 50, borderRadius: 25 }]} onPress={() => { setDetail(null); setScreen('resume'); }}>
              <Ionicons name="document-text" size={isSmallScreen ? 20 : 24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <ScrollView style={{ flex: 1, backgroundColor: '#F8FAFC' }} contentContainerStyle={{ padding: isSmallScreen ? 12 : 16, paddingBottom: 100 }}>
          <View style={st.prefHeader}>
            <View>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#0F172A' }}>Job Match Alerts</Text>
              <Text style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>Get notified about roles fitting your profile.</Text>
            </View>
            <View style={[st.toggleTrack, { backgroundColor: '#10B981' }]}><View style={[st.toggleThumb, { transform: [{ translateX: 22 }] }]} /></View>
          </View>
          <Text style={{ fontSize: 15, fontWeight: '700', color: '#0F172A', marginBottom: 12, marginTop: 8 }}>Matches Based on Your Profile</Text>
          {PROFILE_MATCHES.map(item => (
            <View key={item.id} style={st.matchCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: '#0F172A' }}>{item.title}</Text>
                  <Text style={{ fontSize: 14, color: '#475569', marginTop: 2 }}>{item.company} • {item.location}</Text>
                </View>
                <View style={st.matchBadge}><Text style={st.matchBadgeText}>{item.match}</Text></View>
              </View>
              <TouchableOpacity style={st.viewMatchBtn}><Text style={{ fontSize: 13, fontWeight: '700', color: '#003366' }}>View Role</Text></TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={st.updateProfileBtn}><Text style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF' }}>Update Profile Preferences</Text></TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );

  // ─── FINAL RETURN COMPOSED FOR DESKTOP / MOBILE ──────────────────────
  const webContainerStyle = isWeb ? { alignSelf: 'center', width: '100%', maxWidth: 1200, flex: 1 } : { flex: 1 };

  return (
    <SafeAreaView style={st.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={webContainerStyle}>
        {isDesktop ? (
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ width: 400, borderRightWidth: 1, borderRightColor: '#E2E8F0', backgroundColor: '#FFFFFF' }}>
              {renderMainList()}
            </View>
            <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
              {screen === 'editor' ? renderEditor() : screen === 'resume' ? renderResume() : renderDetail()}
            </View>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            {screen === 'editor' ? renderEditor() : screen === 'resume' ? renderResume() : screen === 'detail' ? renderDetail() : renderMainList()}
          </View>
        )}
      </View>

      {!isWeb && (
        <Modal visible={modalVis} transparent animationType="fade">
        <View style={st.modalOverlay}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setModalVis(false)} />
          <View style={st.modalContent}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#0F172A' }}>Select Work Mode</Text>
              <TouchableOpacity onPress={() => setModalVis(false)}><Ionicons name="close" size={24} color="#0F172A" /></TouchableOpacity>
            </View>
            {WORK_MODES.map(mode => (
              <TouchableOpacity key={mode} style={[st.modalItem, fMode === mode && { backgroundColor: '#F8FAFC' }]} onPress={() => { setFMode(mode); setModalVis(false); }}>
                <Text style={{ fontSize: 16, color: fMode === mode ? '#003366' : '#475569', fontWeight: fMode === mode ? '600' : '400' }}>{mode}</Text>
                {fMode === mode && <Ionicons name="checkmark" size={20} color="#003366" />}
              </TouchableOpacity>
            ))}
          </View>
        </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', minHeight: Platform.OS === 'web' ? '100vh' : undefined },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  headerAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#003366', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 20, paddingHorizontal: 12, height: 38, marginRight: 12 },
  iconBtn: { position: 'relative', width: 34, height: 34, justifyContent: 'center', alignItems: 'center', marginLeft: 4 },
  dot: { position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', borderWidth: 1, borderColor: '#FFFFFF' },
  tabBar: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E2E8F0', backgroundColor: '#FFFFFF' },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: '#0F172A' },
  tabText: { fontSize: 14.5, fontWeight: '600', color: '#94A3B8' },
  activeTabText: { color: '#0F172A', fontWeight: '700' },

  // Job Card
  jobCard: { flexDirection: 'row', backgroundColor: '#FFFFFF', paddingVertical: 16, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', position: 'relative' },
  companyLogo: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', marginRight: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  jobTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  jobCompany: { fontSize: 14, color: '#475569', fontWeight: '600', marginBottom: 8 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap' },
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginRight: 6, marginBottom: 6 },
  badgeText: { fontSize: 11, color: '#64748B', fontWeight: '500' },
  statsRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginBottom: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  statItem: { flexDirection: 'row', alignItems: 'center', marginRight: 12, marginBottom: 4 },
  statText: { fontSize: 11, fontWeight: '600', color: '#64748B', marginLeft: 4 },
  viewMoreBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 8, alignSelf: 'flex-start', paddingVertical: 4 },
  viewMoreText: { fontSize: 13, fontWeight: '700', color: '#003366' },

  // Detail
  detailCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 24, alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  detailLogo: { width: 80, height: 80, borderRadius: 20, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  detailRole: { fontSize: 20, fontWeight: '700', color: '#0F172A', marginBottom: 6, textAlign: 'center' },
  detailCompany: { fontSize: 16, fontWeight: '600', color: '#475569', marginBottom: 12 },
  detailStatsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, marginTop: 8 },
  detailStatCard: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, paddingVertical: 12, marginHorizontal: 4, borderWidth: 1, borderColor: '#E2E8F0' },
  detailStatText: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  descSection: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  bottomBar: { padding: 20, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  applyBtn: { backgroundColor: '#003366', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },

  // Editor
  editorHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  editorTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  postHeaderBtn: { backgroundColor: '#0F172A', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  inputLabel: { fontSize: 13.5, fontWeight: '600', color: '#475569', marginBottom: 8 },
  textInput: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14.5, color: '#0F172A', backgroundColor: '#F8FAFC' },
  selectorInput: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC' },

  // Resume
  seekerBanner: { backgroundColor: '#FFFFFF', borderRadius: 8, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: '#E2E8F0' },
  getListedBtn: { flex: 1, alignItems: 'center', backgroundColor: '#003366', paddingVertical: 10, borderRadius: 6, marginRight: 8 },
  learnMoreBtn: { flex: 1, alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#003366', paddingVertical: 10, borderRadius: 6 },
  resumeCard: { backgroundColor: '#FFFFFF', borderRadius: 8, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden' },
  resumeAvatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginRight: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  skillPill: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, paddingHorizontal: 10, paddingVertical: 4, marginRight: 6, marginBottom: 6 },

  // Preferences
  matchCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', padding: 16, marginBottom: 12 },
  matchIcon: { width: 44, height: 44, borderRadius: 8, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center', marginRight: 16 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15,23,42,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 40 },
  modalItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },

  // FABs
  fabContainer: { position: 'absolute', bottom: Platform.OS === 'ios' ? 34 : 24, right: 24, alignItems: 'flex-end', zIndex: 10 },
  fabSmall: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#0F172A', justifyContent: 'center', alignItems: 'center', elevation: 6, shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  extendedFab: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#003366', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 24, elevation: 6, shadowColor: '#003366', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  webChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' },
  webChipActive: { backgroundColor: '#EFF6FF', borderColor: '#003366' },
  webChipText: { fontSize: 13, color: '#475569', fontWeight: '600' },
  webChipTextActive: { color: '#003366' },
});

export default JobsScreen;
