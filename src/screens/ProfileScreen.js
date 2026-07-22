import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ScrollView, useWindowDimensions, Alert, StatusBar, Modal, TextInput, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProfile, updateProfile, changePassword, deleteAccount, getPosts, getFollowers, getFollowing, toggleFollowUser, logout, setup2FA, verify2FA, disable2FA, getActiveSessions, revokeSession, getLoginHistory } from '../services/authService';
import { getChatHistory } from '../services/messageService';

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

const ProfileScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const styles = getStyles(theme);

  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const containerWidth = isWeb ? Math.min(width, 800) : width;
  const gridItemSize = (containerWidth - 6) / 3;
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [settingsSubView, setSettingsSubView] = useState('menu'); // 'menu' | 'profile_edit' | 'profile_settings' | 'security'
  const [activeTab, setActiveTab] = useState('post'); // 'post' | 'messages' | 'reshare' | 'saved' | 'tags'
  const [listModalType, setListModalType] = useState(null); // 'connections' | 'following'
  
  // Real data states for connections, following, and messages
  const [connections, setConnections] = useState([]);
  const [following, setFollowing] = useState([]);
  const [profileChats, setProfileChats] = useState([]);

  const [profileData, setProfileData] = useState({
    username: 'loading',
    name: 'Loading...',
    branch: 'Loading...',
    batch: 'Loading...',
    bio: '',
    linkedin: '',
    posts: '0',
    followers: '0',
    following: '0',
    avatar: '..'
  });

  const [userPosts, setUserPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [highlights, setHighlights] = useState([
    { id: '1', title: 'Campus', icon: 'school-outline' },
    { id: '2', title: 'Work', icon: 'briefcase-outline' },
    { id: '3', title: 'Events', icon: 'calendar-outline' },
    { id: '4', title: 'Projects', icon: 'code-slash-outline' },
  ]);

  useFocusEffect(
    useCallback(() => {
    const fetchRecentChats = async () => {
      try {
        const history = await getChatHistory();
        if (history && Array.isArray(history)) {
          setProfileChats(history);
        }
      } catch (err) {
        console.log('Error loading profile chats:', err);
      }
    };
    fetchRecentChats();

    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        if (data) {
          setProfileData(prev => ({
            ...prev,
            name: data.name || data.email.split('@')[0],
            username: data.email.split('@')[0],
            branch: data.department || 'Not specified',
            batch: data.batch_year || 'Not specified',
            bio: data.bio || `Institution Class of ${data.batch_year || ''}`,
            linkedin: data.linkedin || '',
            avatar: data.name ? data.name.substring(0, 2).toUpperCase() : 'UU',
          }));
        }
      } catch (e) {
        console.error('Error fetching profile', e);
      }
    };

    const fetchConnections = async () => {
      try {
        const [followersData, followingData] = await Promise.all([
          getFollowers(),
          getFollowing()
        ]);
        
        if (followersData) {
          const formattedFollowers = followersData.map(s => ({
            id: s._id,
            name: s.name,
            title: s.company ? `${s.designation || ''} @ ${s.company}`.trim() : `Batch of ${s.batchYear || ''} • ${s.department || ''}`.trim(),
            avatar: s.name ? s.name.substring(0, 2).toUpperCase() : '??',
          }));
          setConnections(formattedFollowers);
        }
        
        if (followingData) {
          const formattedFollowing = followingData.map(s => ({
            id: s._id,
            name: s.name,
            title: s.company ? `${s.designation || ''} @ ${s.company}`.trim() : `Batch of ${s.batchYear || ''} • ${s.department || ''}`.trim(),
            avatar: s.name ? s.name.substring(0, 2).toUpperCase() : '??',
          }));
          setFollowing(formattedFollowing);
        }

        setProfileData(prev => ({
          ...prev,
          followers: followersData ? followersData.length.toString() : '0',
          following: followingData ? followingData.length.toString() : '0',
        }));
      } catch (e) {
        console.error('Error fetching connections', e);
      }
    };

    const fetchUserPosts = async () => {
      try {
        const postsData = await getPosts();
        if (postsData) {
          // Count posts by current user (we'll filter after getting profile)
          const userInfoStr = await AsyncStorage.getItem('userInfo');
          if (userInfoStr) {
            const userInfo = JSON.parse(userInfoStr);
            const myPosts = postsData.filter(p => p.user?.name === userInfo.name || p.user?._id === userInfo._id);
            setProfileData(prev => ({
              ...prev,
              posts: myPosts.length.toString(),
            }));
            setUserPosts(myPosts);
          }
        }
      } catch (e) {
        console.error('Error fetching user posts', e);
      }
    };

    fetchProfile();
    fetchConnections();
    fetchUserPosts();
  }, [])
  );

  // Profile Editing States
  const [editName, setEditName] = useState(profileData.name);
  const [editUsername, setEditUsername] = useState(profileData.username);
  const [editBranch, setEditBranch] = useState(profileData.branch);
  const [editBatch, setEditBatch] = useState(profileData.batch);
  const [editBio, setEditBio] = useState(profileData.bio);
  const [editLinkedin, setEditLinkedin] = useState(profileData.linkedin);

  // Settings States
  const [privateAccount, setPrivateAccount] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailDigest, setEmailDigest] = useState(false);
  const [jobAlerts, setJobAlerts] = useState(true);

  // Security States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactor, setTwoFactor] = useState(false);

  const mockTags = [];
  const mockSaved = [];
  const mockReshares = [];

  const handleSettings = () => {
    setSettingsSubView('menu');
    setSettingsVisible(true);
  };

  const handleOpenEdit = () => {
    setEditName(profileData.name);
    setEditUsername(profileData.username);
    setEditBranch(profileData.branch);
    setEditBatch(profileData.batch);
    setEditBio(profileData.bio);
    setEditLinkedin(profileData.linkedin || '');
    setSettingsSubView('profile_edit');
    setSettingsVisible(true);
  };

  const handleLogout = () => {
    const performLogout = async () => {
      setSettingsVisible(false);
      try {
        await logout().catch(err => console.log('Logout API call error:', err));
        await AsyncStorage.clear();
      } catch (error) {
        console.error('Failed to clear user session', error);
      }
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    };

    if (Platform.OS === 'web') {
      const confirmLogout = window.confirm('Are you sure you want to log out of the Alumni portal?');
      if (confirmLogout) {
        performLogout();
      }
    } else {
      Alert.alert(
        'Confirm Logout',
        'Are you sure you want to log out of the Alumni portal?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Log Out', style: 'destructive', onPress: performLogout }
        ]
      );
    }
  };

  const webContainerStyle = isWeb ? { alignSelf: 'center', width: '100%', maxWidth: 800, flex: 1 } : { flex: 1 };

  return (
    <SafeAreaView style={styles.container}>
      <View style={webContainerStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      {/* Premium Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={{ marginRight: 12 }} 
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else {
                navigation.navigate('Main');
              }
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Ionicons name="shield-checkmark" size={18} color="#003366" />
          <Text style={styles.headerUsername}>{profileData.username}</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate('PostCreation')} activeOpacity={0.7}>
            <Ionicons name="add-circle-outline" size={26} color="#002144" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon} onPress={handleSettings} activeOpacity={0.7}>
            <Ionicons name="settings-outline" size={24} color="#002144" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Info Section */}
        <View style={styles.profileInfoContainer}>
          <View style={styles.mainInfoRow}>
            {/* Avatar */}
            <View style={styles.avatarWrapper}>
              <View style={styles.storyRing}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{profileData.avatar}</Text>
                </View>
              </View>
            </View>
            
            {/* Stats */}
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
            <Text style={styles.nameText}>
              {profileData.name} <Text style={{fontSize: 14, color: '#3B82F6', fontWeight: 'bold'}}>• Alumni</Text>
            </Text>
            <Text style={styles.occupationText}>{profileData.branch} Class of {profileData.batch}</Text>
            <Text style={styles.bioText}>{profileData.bio}</Text>
            {profileData.linkedin ? (
              <TouchableOpacity onPress={() => Platform.OS === 'web' && window.open(profileData.linkedin, '_blank')}>
                <Text style={{ color: '#0A66C2', fontWeight: '600', fontSize: 13, marginTop: 4 }}>
                  🔗 {profileData.linkedin}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Instagram Story Highlights */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 14, paddingLeft: 4 }}>
            {highlights.map(h => (
              <View key={h.id} style={{ alignItems: 'center', marginRight: 18 }}>
                <View style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  padding: 2.5,
                  borderWidth: 2,
                  borderColor: theme.primary,
                  backgroundColor: theme.card,
                  justify: 'center',
                  alignItems: 'center'
                }}>
                  <View style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 30,
                    backgroundColor: theme.background,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <Ionicons name={h.icon} size={24} color={theme.primary} />
                  </View>
                </View>
                <Text style={{ fontSize: 11, color: theme.text, marginTop: 4, fontWeight: '500' }}>{h.title}</Text>
              </View>
            ))}
            <TouchableOpacity style={{ alignItems: 'center', marginRight: 18 }} onPress={handleOpenEdit}>
              <View style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                borderWidth: 1.5,
                borderColor: '#CBD5E1',
                borderStyle: 'dashed',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: theme.card
              }}>
                <Ionicons name="add" size={26} color="#64748B" />
              </View>
              <Text style={{ fontSize: 11, color: theme.textMuted, marginTop: 4 }}>New</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.actionButton, { flex: 1, marginRight: 8 }]} onPress={handleOpenEdit} activeOpacity={0.7}>
              <Text style={styles.actionButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, { flex: 1, marginRight: 8, backgroundColor: 'rgba(0, 33, 68, 0.08)' }]} 
              onPress={() => {
                if (Platform.OS === 'web' && navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Profile link copied to clipboard!');
                } else {
                  alert(`Profile link: https://alma-connect.vercel.app/profile/${profileData.username}`);
                }
              }} 
              activeOpacity={0.7}
            >
              <Text style={[styles.actionButtonText, { color: theme.primary }]}>Share Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallIconBtn} onPress={handleLogout} activeOpacity={0.7}>
              <Ionicons name="log-out-outline" size={18} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Instagram-style Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'post' && styles.activeTabButton]} 
            onPress={() => setActiveTab('post')}
            activeOpacity={0.7}
          >
            <Ionicons name={activeTab === 'post' ? 'grid' : 'grid-outline'} size={20} color={activeTab === 'post' ? theme.primary : theme.textMuted} />
            <Text style={[styles.tabLabel, activeTab === 'post' && styles.activeTabLabel]}>Posts</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'reshare' && styles.activeTabButton]} 
            onPress={() => setActiveTab('reshare')}
            activeOpacity={0.7}
          >
            <Ionicons name={activeTab === 'reshare' ? 'repeat' : 'repeat-outline'} size={20} color={activeTab === 'reshare' ? theme.primary : theme.textMuted} />
            <Text style={[styles.tabLabel, activeTab === 'reshare' && styles.activeTabLabel]}>Reshares</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'saved' && styles.activeTabButton]} 
            onPress={() => setActiveTab('saved')}
            activeOpacity={0.7}
          >
            <Ionicons name={activeTab === 'saved' ? 'bookmark' : 'bookmark-outline'} size={20} color={activeTab === 'saved' ? theme.primary : theme.textMuted} />
            <Text style={[styles.tabLabel, activeTab === 'saved' && styles.activeTabLabel]}>Saved</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'tags' && styles.activeTabButton]} 
            onPress={() => setActiveTab('tags')}
            activeOpacity={0.7}
          >
            <Ionicons name={activeTab === 'tags' ? 'pricetag' : 'pricetag-outline'} size={20} color={activeTab === 'tags' ? theme.primary : theme.textMuted} />
            <Text style={[styles.tabLabel, activeTab === 'tags' && styles.activeTabLabel]}>Tags</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content Section */}
        {activeTab === 'post' && (
          <View style={styles.postsGrid}>
            {userPosts.length === 0 ? (
              <View style={{ padding: 40, alignItems: 'center', width: '100%' }}>
                <Ionicons name="grid-outline" size={48} color="#CBD5E1" />
                <Text style={{ marginTop: 12, fontSize: 14, color: '#64748B' }}>No posts yet</Text>
                <TouchableOpacity style={{ marginTop: 16, backgroundColor: theme.primary, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20 }} onPress={() => navigation.navigate('PostCreation')}>
                  <Text style={{ color: '#FFF', fontWeight: '600', fontSize: 13 }}>Share your first post</Text>
                </TouchableOpacity>
              </View>
            ) : (
              userPosts.map((post) => (
                <TouchableOpacity 
                  key={post._id || post.id} 
                  style={[styles.gridItem, { width: gridItemSize, height: gridItemSize }]} 
                  activeOpacity={0.85}
                  onPress={() => setSelectedPost(post)}
                >
                  {post.image_url ? (
                    <Image source={{ uri: post.image_url }} style={styles.gridImage} />
                  ) : (
                    <View style={[styles.gridImage, { backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', padding: 10, borderWidth: 0.5, borderColor: '#E2E8F0' }]}>
                      <Ionicons name="document-text-outline" size={24} color={theme.primary} style={{ marginBottom: 6 }} />
                      <Text style={{fontSize: 11, color: '#334155', fontWeight: '500', textAlign: 'center'}} numberOfLines={3}>{post.content}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))
            )}
          </View>
        )}


        {activeTab === 'tags' && (
          <View style={styles.postsGrid}>
            {mockTags.map((tag) => (
              <TouchableOpacity key={tag.id} style={[styles.gridItem, { width: gridItemSize, height: gridItemSize }]} activeOpacity={0.9}>
                <Image source={{ uri: tag.uri }} style={styles.gridImage} />
                <View style={styles.tagOverlay}>
                  <Ionicons name="person" size={16} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {activeTab === 'saved' && (
          <View style={styles.postsGrid}>
            {mockSaved.map((item) => (
              <TouchableOpacity key={item.id} style={[styles.gridItem, { width: gridItemSize, height: gridItemSize }]} activeOpacity={0.9}>
                <Image source={{ uri: item.uri }} style={styles.gridImage} />
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
      </ScrollView>

      {/* Settings Modal Sheet */}
      <Modal visible={settingsVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => { setSettingsVisible(false); setSettingsSubView('menu'); }} />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              {settingsSubView !== 'menu' ? (
                <TouchableOpacity onPress={() => setSettingsSubView('menu')}>
                  <Ionicons name="arrow-back" size={24} color="#003366" />
                </TouchableOpacity>
              ) : (
                <View style={{ width: 24 }} />
              )}
              <Text style={styles.modalTitle}>
                {settingsSubView === 'menu' && 'Settings'}
                {settingsSubView === 'profile_edit' && 'Edit Profile'}
                {settingsSubView === 'profile_settings' && 'Profile Settings'}
                {settingsSubView === 'security' && 'Login & Security'}
              </Text>
              <TouchableOpacity onPress={() => { setSettingsVisible(false); setSettingsSubView('menu'); }}>
                <Ionicons name="close" size={24} color="#0F172A" />
              </TouchableOpacity>
            </View>
            
            {/* Main Menu Sub-view */}
            {settingsSubView === 'menu' && (
              <View>
                <TouchableOpacity 
                  style={styles.modalItem}
                  onPress={handleOpenEdit}
                >
                  <Ionicons name="person-outline" size={22} color="#003366" style={{ marginRight: 12 }} />
                  <Text style={styles.modalItemText}>Profile Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.modalItem}
                  onPress={() => setSettingsSubView('profile_settings')}
                >
                  <Ionicons name="settings-outline" size={22} color="#003366" style={{ marginRight: 12 }} />
                  <Text style={styles.modalItemText}>Profile Settings</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.modalItem}
                  onPress={() => setSettingsSubView('security')}
                >
                  <Ionicons name="shield-checkmark-outline" size={22} color="#003366" style={{ marginRight: 12 }} />
                  <Text style={styles.modalItemText}>Login & Security</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.modalItem, { borderBottomWidth: 0 }]}
                  onPress={handleLogout}
                >
                  <Ionicons name="log-out-outline" size={22} color="#FF3B30" style={{ marginRight: 12 }} />
                  <Text style={[styles.modalItemText, { color: '#FF3B30' }]}>Log Out</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Profile Edit Sub-view */}
            {settingsSubView === 'profile_edit' && (
              <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 380, marginTop: 10 }}>
                <Text style={styles.settingsSectionTitle}>Profile Information</Text>
                
                <Text style={styles.editLabel}>Full Name</Text>
                <TextInput 
                  style={styles.securityInput} 
                  placeholder="Full Name" 
                  placeholderTextColor="#94A3B8"
                  value={editName}
                  onChangeText={setEditName}
                />

                <Text style={styles.editLabel}>Username</Text>
                <TextInput 
                  style={styles.securityInput} 
                  placeholder="Username" 
                  placeholderTextColor="#94A3B8"
                  value={editUsername}
                  onChangeText={setEditUsername}
                />

                <Text style={styles.editLabel}>Branch / Department</Text>
                <TextInput 
                  style={styles.securityInput} 
                  placeholder="Branch / Department" 
                  placeholderTextColor="#94A3B8"
                  value={editBranch}
                  onChangeText={setEditBranch}
                />

                <Text style={styles.editLabel}>Graduation Batch Year</Text>
                <TextInput 
                  style={styles.securityInput} 
                  placeholder="Batch Year" 
                  placeholderTextColor="#94A3B8"
                  keyboardType="number-pad"
                  maxLength={4}
                  value={editBatch}
                  onChangeText={setEditBatch}
                />

                <Text style={styles.editLabel}>Bio</Text>
                <TextInput 
                  style={[styles.securityInput, { height: 80, textAlignVertical: 'top', paddingTop: 10 }]} 
                  placeholder="Write your bio..." 
                  placeholderTextColor="#94A3B8"
                  multiline
                  value={editBio}
                  onChangeText={setEditBio}
                />

                <Text style={styles.editLabel}>LinkedIn Profile URL</Text>
                <TextInput 
                  style={styles.securityInput} 
                  placeholder="https://linkedin.com/in/username" 
                  placeholderTextColor="#94A3B8"
                  value={editLinkedin}
                  onChangeText={setEditLinkedin}
                />

                <TouchableOpacity 
                  style={styles.saveSettingsBtn}
                  onPress={() => {
                    if (!editName.trim() || !editUsername.trim()) {
                      Alert.alert('Required', 'Name and username cannot be empty.');
                      return;
                    }
                    setProfileData({
                      ...profileData,
                      name: editName,
                      username: editUsername,
                      branch: editBranch,
                      batch: editBatch,
                      bio: editBio,
                      linkedin: editLinkedin,
                      avatar: editName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'AJ'
                    });

                    const submitProfileUpdate = async () => {
                      try {
                        await updateProfile({
                          name: editName,
                          department: editBranch,
                          batch_year: editBatch,
                          bio: editBio,
                          linkedin: editLinkedin
                        });
                      } catch (err) {
                        console.error('Error saving profile:', err);
                      }
                    };
                    submitProfileUpdate();

                    setSettingsVisible(false);
                    setSettingsSubView('menu');
                    Alert.alert('Success', 'Profile updated successfully!');
                  }}
                >
                  <Text style={styles.saveSettingsBtnText}>Save Profile</Text>
                </TouchableOpacity>
                <View style={{ height: 20 }} />
              </ScrollView>
            )}

            {/* Profile Settings Sub-view */}
            {settingsSubView === 'profile_settings' && (
              <View style={{ marginTop: 10 }}>
                {/* Privacy Toggle */}
                <View style={styles.settingsRow}>
                  <View>
                    <Text style={styles.settingsRowLabel}>Private Profile</Text>
                    <Text style={styles.settingsRowDesc}>Only approved connections can see your posts.</Text>
                  </View>
                  <TouchableOpacity onPress={() => setPrivateAccount(!privateAccount)}>
                    <Ionicons name={privateAccount ? "toggle" : "toggle-outline"} size={40} color={privateAccount ? "#003366" : "#CBD5E1"} />
                  </TouchableOpacity>
                </View>

                {/* Notifications Toggles */}
                <View style={styles.settingsRow}>
                  <View>
                    <Text style={styles.settingsRowLabel}>Push Notifications</Text>
                    <Text style={styles.settingsRowDesc}>Receive notifications for connections & messages.</Text>
                  </View>
                  <TouchableOpacity onPress={() => setPushNotifications(!pushNotifications)}>
                    <Ionicons name={pushNotifications ? "toggle" : "toggle-outline"} size={40} color={pushNotifications ? "#003366" : "#CBD5E1"} />
                  </TouchableOpacity>
                </View>

                <View style={styles.settingsRow}>
                  <View>
                    <Text style={styles.settingsRowLabel}>Email Digest</Text>
                    <Text style={styles.settingsRowDesc}>Weekly digest of top alumni posts and jobs.</Text>
                  </View>
                  <TouchableOpacity onPress={() => setEmailDigest(!emailDigest)}>
                    <Ionicons name={emailDigest ? "toggle" : "toggle-outline"} size={40} color={emailDigest ? "#003366" : "#CBD5E1"} />
                  </TouchableOpacity>
                </View>

                <View style={[styles.settingsRow, { borderBottomWidth: 0 }]}>
                  <View>
                    <Text style={styles.settingsRowLabel}>Job Alerts</Text>
                    <Text style={styles.settingsRowDesc}>Get notified immediately when new jobs are posted.</Text>
                  </View>
                  <TouchableOpacity onPress={() => setJobAlerts(!jobAlerts)}>
                    <Ionicons name={jobAlerts ? "toggle" : "toggle-outline"} size={40} color={jobAlerts ? "#003366" : "#CBD5E1"} />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity 
                  style={styles.saveSettingsBtn} 
                  onPress={() => {
                    setSettingsSubView('menu');
                    Alert.alert('Saved', 'Profile settings updated successfully.');
                  }}
                >
                  <Text style={styles.saveSettingsBtnText}>Save Settings</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Login & Security Sub-view */}
            {settingsSubView === 'security' && (
              <View style={{ marginTop: 10 }}>
                <Text style={styles.settingsSectionTitle}>Change Password</Text>
                <TextInput 
                  style={styles.securityInput} 
                  placeholder="Current Password" 
                  placeholderTextColor="#94A3B8"
                  secureTextEntry
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                />
                <TextInput 
                  style={styles.securityInput} 
                  placeholder="New Password" 
                  placeholderTextColor="#94A3B8"
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <TextInput 
                  style={styles.securityInput} 
                  placeholder="Confirm New Password" 
                  placeholderTextColor="#94A3B8"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />

                <TouchableOpacity 
                  style={styles.changePasswordBtn}
                  onPress={async () => {
                    if (!currentPassword || !newPassword || !confirmPassword) {
                      Alert.alert('Error', 'Please fill in all password fields.');
                      return;
                    }
                    if (newPassword !== confirmPassword) {
                      Alert.alert('Error', 'New password and confirm password do not match.');
                      return;
                    }
                    const pwdCheck = validatePasswordStrength(newPassword);
                    if (!pwdCheck.valid) {
                      Alert.alert('Error', pwdCheck.reason);
                      return;
                    }
                    try {
                      await changePassword({
                        currentPassword,
                        newPassword
                      });

                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                      setSettingsSubView('menu');
                      Alert.alert('Success', 'Your password has been changed successfully!');
                    } catch (err) {
                      Alert.alert('Error', err.message || 'Failed to update password.');
                    }
                  }}
                >
                  <Text style={styles.changePasswordBtnText}>Update Password</Text>
                </TouchableOpacity>

                <Text style={[styles.settingsSectionTitle, { marginTop: 20 }]}>Two-Factor Authentication</Text>
                <View style={[styles.settingsRow, { borderBottomWidth: 0, paddingTop: 4 }]}>
                  <View>
                    <Text style={styles.settingsRowLabel}>Secure Account with 2FA</Text>
                    <Text style={styles.settingsRowDesc}>Require verification code sent to your phone/email.</Text>
                  </View>
                  <TouchableOpacity onPress={() => setTwoFactor(!twoFactor)}>
                    <Ionicons name={twoFactor ? "toggle" : "toggle-outline"} size={40} color={twoFactor ? "#003366" : "#CBD5E1"} />
                  </TouchableOpacity>
                </View>

                <Text style={[styles.settingsSectionTitle, { marginTop: 30, color: '#DC2626' }]}>Danger Zone</Text>
                <TouchableOpacity 
                  style={{
                    backgroundColor: '#FEF2F2',
                    borderWidth: 1,
                    borderColor: '#FECACA',
                    padding: 16,
                    borderRadius: 12,
                    marginTop: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onPress={() => {
                    Alert.alert(
                      'Delete Account',
                      'Are you sure you want to permanently delete your account? This action cannot be undone and all your data will be removed.',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { 
                          text: 'Delete Permanently', 
                          style: 'destructive',
                                                    onPress: async () => {
                            try {
                              await deleteAccount();
                              await AsyncStorage.removeItem('userInfo');
                            } catch (e) {
                              console.error('Delete Account Error', e);
                            }
                            setSettingsVisible(false);
                            navigation.replace('Welcome');
                          }
                        }
                      ]
                    );
                  }}
                >
                  <Ionicons name="trash-outline" size={20} color="#DC2626" style={{ marginRight: 8 }} />
                  <Text style={{ color: '#DC2626', fontWeight: '600', fontSize: 16 }}>Delete Account</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
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

            {/* Instagram-style Modal Tabs */}
            <View style={styles.modalTabBar}>
              <TouchableOpacity 
                style={[styles.modalTab, listModalType === 'connections' && styles.activeModalTab]}
                onPress={() => setListModalType('connections')}
              >
                <Text style={[styles.modalTabText, listModalType === 'connections' && styles.activeModalTabText]}>
                  {profileData.followers} Connections
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalTab, listModalType === 'following' && styles.activeModalTab]}
                onPress={() => setListModalType('following')}
              >
                <Text style={[styles.modalTabText, listModalType === 'following' && styles.activeModalTabText]}>
                  {profileData.following} Following
                </Text>
              </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.modalSearchContainer}>
              <View style={styles.modalSearchBar}>
                <Ionicons name="search" size={18} color="#94A3B8" />
                <TextInput 
                  style={styles.modalSearchInput} 
                  placeholder="Search" 
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
            
            <ScrollView style={{ padding: 16 }}>
              {(listModalType === 'following' ? following : connections).map(user => (
                <View key={user.id} style={styles.connectionItem}>
                  <View style={styles.connectionAvatar}>
                    <Text style={styles.connectionAvatarText}>{user.avatar}</Text>
                  </View>
                  <View style={styles.connectionInfo}>
                    <Text style={styles.connectionName}>{user.name}</Text>
                    <Text style={styles.connectionUsername}>{user.title}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity 
                      style={[styles.connectionBtn, { backgroundColor: '#EFF6FF', marginRight: 8, paddingHorizontal: 10 }]}
                      onPress={() => {
                        setListModalType(null);
                        navigation.navigate('Chat', { 
                          user: { 
                            id: user.id, 
                            name: user.name, 
                            role: user.title || '', 
                            initials: user.avatar 
                          } 
                        });
                      }}
                    >
                      <Ionicons name="chatbubble-ellipses-outline" size={16} color="#003366" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[styles.connectionBtn, listModalType === 'following' && styles.followingBtn]}
                      onPress={async () => {
                        try {
                          await toggleFollowUser(user.id);
                          if (listModalType === 'following') {
                            setFollowing(prev => prev.filter(u => u.id !== user.id));
                            setProfileData(prev => ({...prev, following: (parseInt(prev.following) - 1).toString()}));
                          } else {
                            setConnections(prev => prev.filter(u => u.id !== user.id));
                            setProfileData(prev => ({...prev, followers: (parseInt(prev.followers) - 1).toString()}));
                          }
                        } catch (err) {
                          console.error('Error toggling follow', err);
                        }
                      }}
                    >
                      <Text style={[styles.connectionBtnText, listModalType === 'following' && styles.followingBtnText]}>
                        {listModalType === 'connections' ? 'Remove' : 'Following'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              <View style={{height: 40}} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Instagram Post Detail Lightbox Modal */}
      <Modal visible={!!selectedPost} transparent animationType="fade" onRequestClose={() => setSelectedPost(null)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: Platform.OS === 'web' ? 20 : 10 }}>
          <View style={{ backgroundColor: theme.card, width: '100%', maxWidth: 520, borderRadius: 16, overflow: 'hidden', maxHeight: '90%' }}>
            {/* Post Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderBottomWidth: 0.5, borderColor: theme.border }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
                  <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 14 }}>{profileData.avatar}</Text>
                </View>
                <View>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: theme.text }}>{profileData.name}</Text>
                  <Text style={{ fontSize: 11, color: theme.textMuted }}>{selectedPost?.createdAt ? new Date(selectedPost.createdAt).toLocaleDateString() : 'Just now'}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setSelectedPost(null)} style={{ padding: 4 }}>
                <Ionicons name="close-circle" size={26} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Post Image or Styled Card */}
              {selectedPost?.image_url ? (
                <Image source={{ uri: selectedPost.image_url }} style={{ width: '100%', height: 320, resizeMode: 'cover' }} />
              ) : null}

              {/* Post Body & Content */}
              <View style={{ padding: 16 }}>
                <Text style={{ fontSize: 15, color: theme.text, lineHeight: 22 }}>{selectedPost?.content}</Text>
              </View>

              {/* Engagement Bar */}
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderTopWidth: 0.5, borderColor: theme.border }}>
                <TouchableOpacity 
                  style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}
                  onPress={async () => {
                    if (selectedPost) {
                      try {
                        await toggleLikePost(selectedPost._id || selectedPost.id);
                        const isLiked = selectedPost.likes?.includes(profileData.name);
                        const updatedLikes = isLiked 
                          ? (selectedPost.likes || []).filter(l => l !== profileData.name)
                          : [...(selectedPost.likes || []), profileData.name];
                        setSelectedPost({ ...selectedPost, likes: updatedLikes });
                      } catch (e) {
                        console.error('Like toggle error', e);
                      }
                    }
                  }}
                >
                  <Ionicons name={selectedPost?.likes?.length > 0 ? "heart" : "heart-outline"} size={24} color={selectedPost?.likes?.length > 0 ? "#EF4444" : theme.text} />
                  <Text style={{ marginLeft: 6, fontWeight: '600', color: theme.text, fontSize: 14 }}>
                    {selectedPost?.likes?.length || 0} {selectedPost?.likes?.length === 1 ? 'like' : 'likes'}
                  </Text>
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="chatbubble-outline" size={22} color={theme.text} />
                  <Text style={{ marginLeft: 6, fontWeight: '600', color: theme.text, fontSize: 14 }}>
                    {selectedPost?.comments?.length || 0} comments
                  </Text>
                </View>
              </View>
            </ScrollView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: theme.card,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerUsername: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.text,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerIcon: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfoContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  mainInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  avatarWrapper: {
    position: 'relative',
  },
  storyRing: {
    padding: 3,
    borderRadius: 44,
    borderWidth: 2,
    borderColor: theme.primary,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: theme.background,
    borderWidth: 1,
    borderColor: theme.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
    marginLeft: 20,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 17,
    fontWeight: '800',
    color: theme.text,
  },
  statLabel: {
    fontSize: 12,
    color: theme.textSecondary,
    marginTop: 2,
  },
  bioContainer: {
    marginBottom: 16,
  },
  nameText: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.text,
  },
  occupationText: {
    fontSize: 13.5,
    color: theme.primary,
    fontWeight: '600',
    marginVertical: 4,
  },
  bioText: {
    fontSize: 13.5,
    color: '#475569',
    lineHeight: 19,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    height: 38,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: theme.text,
  },
  smallIconBtn: {
    backgroundColor: '#FEF2F2',
    width: 38,
    height: 38,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 1,
    paddingTop: 1,
  },
  gridItem: {
    margin: 1,
  },
  gridImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.primary,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
  },
  
  // Instagram-style tabs styling
  tabContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: theme.card,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    gap: 4,
  },
  activeTabButton: {
    borderBottomColor: theme.primary,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.textMuted,
  },
  activeTabLabel: {
    color: theme.primary,
    fontWeight: '700',
  },
  tabContentList: {
    padding: 16,
  },
  listCard: {
    backgroundColor: theme.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.text,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 8,
  },
  cardBodyText: {
    fontSize: 13,
    color: '#475569',
    fontStyle: 'italic',
    lineHeight: 18,
    marginBottom: 8,
  },
  cardFooterText: {
    fontSize: 11,
    color: theme.textMuted,
    fontWeight: '500',
  },

  // Settings sub-view styling
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  settingsRowLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.text,
  },
  settingsRowDesc: {
    fontSize: 12,
    color: theme.textSecondary,
    marginTop: 2,
    maxWidth: '70%',
  },
  saveSettingsBtn: {
    backgroundColor: theme.primary,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  saveSettingsBtnText: {
    color: theme.card,
    fontSize: 15,
    fontWeight: '700',
  },
  settingsSectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginTop: 8,
  },
  securityInput: {
    backgroundColor: theme.background,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 10,
    height: 46,
    paddingHorizontal: 14,
    fontSize: 14,
    color: theme.text,
    marginBottom: 12,
  },
  changePasswordBtn: {
    backgroundColor: theme.text,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  changePasswordBtnText: {
    color: theme.card,
    fontSize: 15,
    fontWeight: '700',
  },
  editLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
    paddingLeft: 2,
    marginTop: 4,
  },
  tagOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 4,
    borderRadius: 12,
  },
  connectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  connectionAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  connectionAvatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.textSecondary,
  },
  connectionInfo: {
    flex: 1,
  },
  connectionName: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.text,
  },
  connectionUsername: {
    fontSize: 13,
    color: theme.textSecondary,
  },
  connectionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: theme.border,
    borderRadius: 6,
  },
  connectionBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.text,
  },
  followingBtn: {
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
  },
  followingBtnText: {
    color: theme.text,
  },
  modalTabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  modalTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeModalTab: {
    borderBottomColor: theme.text,
  },
  modalTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.textMuted,
  },
  activeModalTabText: {
    color: theme.text,
  },
  modalSearchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  modalSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 36,
  },
  modalSearchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: theme.text,
  },
});

export default ProfileScreen;
