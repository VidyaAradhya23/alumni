import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ScrollView, Dimensions, Alert, StatusBar, Modal, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [settingsSubView, setSettingsSubView] = useState('menu'); // 'menu' | 'profile_edit' | 'profile_settings' | 'security'
  const [activeTab, setActiveTab] = useState('post'); // 'post' | 'reshare' | 'saved' | 'tags'
  const [listModalType, setListModalType] = useState(null); // 'connections' | 'following'
  
  // Profile Data State
  const [profileData, setProfileData] = useState({
    username: 'abhishek_rvitm',
    name: 'Abhishek Jaiswal',
    branch: 'Computer Science & Engineering',
    batch: '2023',
    bio: 'RVITM Class of 23 🎓\nSenior Software Engineer @ Tech Solutions\nBuilding scalable systems 🚀\nrvitm.edu.in/alumni/abhishek',
    posts: '6',
    followers: '1.2k',
    following: '850',
    avatar: 'AJ'
  });

  // Profile Editing States
  const [editName, setEditName] = useState(profileData.name);
  const [editUsername, setEditUsername] = useState(profileData.username);
  const [editBranch, setEditBranch] = useState(profileData.branch);
  const [editBatch, setEditBatch] = useState(profileData.batch);
  const [editBio, setEditBio] = useState(profileData.bio);

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

  const posts = [
    { id: '1', uri: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=300&h=300&q=80' },
    { id: '2', uri: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=300&h=300&q=80' },
    { id: '3', uri: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=300&h=300&q=80' },
    { id: '4', uri: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=300&h=300&q=80' },
    { id: '5', uri: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=300&h=300&q=80' },
    { id: '6', uri: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=300&h=300&q=80' },
  ];

  const mockTags = [
    { id: 't1', uri: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=300&h=300&q=80' },
    { id: 't2', uri: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=300&h=300&q=80' },
  ];

  const mockSaved = [
    { id: 's1', uri: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=300&h=300&q=80' },
    { id: 's2', uri: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=300&h=300&q=80' },
    { id: 's3', uri: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=300&h=300&q=80' },
  ];

  const mockConnections = [
    { id: '1', name: 'Priya Sharma', username: 'priya.s', avatar: 'PS' },
    { id: '2', name: 'Rahul Verma', username: 'rahul_v', avatar: 'RV' },
    { id: '3', name: 'Sneha Patel', username: 'sneha.p', avatar: 'SP' },
    { id: '4', name: 'Arjun Reddy', username: 'arjun.r', avatar: 'AR' },
  ];

  const mockReshares = [
    { id: 'r1', user: 'Dr. Satish Kumar', content: 'Truly honored to be back on campus for the RVITM Alumni Gala. The network growth is incredible!', date: 'Reshared yesterday' },
    { id: 'r2', user: 'Ananya Joshi', content: 'Our Silicon Valley RVITM chapter is hosting a meetup next month. Join us!', date: 'Reshared 4 days ago' },
  ];

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
    setSettingsSubView('profile_edit');
    setSettingsVisible(true);
  };

  const handleLogout = () => {
    const performLogout = async () => {
      setSettingsVisible(false);
      try {
        await AsyncStorage.removeItem('userInfo');
      } catch (error) {
        console.error('Failed to clear user session', error);
      }
      navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      });
    };

    if (Platform.OS === 'web') {
      const confirmLogout = window.confirm('Are you sure you want to log out of the RVITM Alumni portal?');
      if (confirmLogout) {
        performLogout();
      }
    } else {
      Alert.alert(
        'Confirm Logout',
        'Are you sure you want to log out of the RVITM Alumni portal?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Log Out', style: 'destructive', onPress: performLogout }
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Premium Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={{ marginRight: 12 }} onPress={() => navigation.goBack()}>
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
            <Text style={styles.nameText}>{profileData.name}</Text>
            <Text style={styles.occupationText}>{profileData.branch} Class of {profileData.batch}</Text>
            <Text style={styles.bioText}>{profileData.bio}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.actionButton} onPress={handleOpenEdit} activeOpacity={0.7}>
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

        {/* Instagram-style Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'post' && styles.activeTabButton]} 
            onPress={() => setActiveTab('post')}
            activeOpacity={0.7}
          >
            <Ionicons name={activeTab === 'post' ? 'grid' : 'grid-outline'} size={20} color={activeTab === 'post' ? '#003366' : '#94A3B8'} />
            <Text style={[styles.tabLabel, activeTab === 'post' && styles.activeTabLabel]}>Posts</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'reshare' && styles.activeTabButton]} 
            onPress={() => setActiveTab('reshare')}
            activeOpacity={0.7}
          >
            <Ionicons name={activeTab === 'reshare' ? 'repeat' : 'repeat-outline'} size={20} color={activeTab === 'reshare' ? '#003366' : '#94A3B8'} />
            <Text style={[styles.tabLabel, activeTab === 'reshare' && styles.activeTabLabel]}>Reshares</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'saved' && styles.activeTabButton]} 
            onPress={() => setActiveTab('saved')}
            activeOpacity={0.7}
          >
            <Ionicons name={activeTab === 'saved' ? 'bookmark' : 'bookmark-outline'} size={20} color={activeTab === 'saved' ? '#003366' : '#94A3B8'} />
            <Text style={[styles.tabLabel, activeTab === 'saved' && styles.activeTabLabel]}>Saved</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'tags' && styles.activeTabButton]} 
            onPress={() => setActiveTab('tags')}
            activeOpacity={0.7}
          >
            <Ionicons name={activeTab === 'tags' ? 'pricetag' : 'pricetag-outline'} size={20} color={activeTab === 'tags' ? '#003366' : '#94A3B8'} />
            <Text style={[styles.tabLabel, activeTab === 'tags' && styles.activeTabLabel]}>Tags</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content Section */}
        {activeTab === 'post' && (
          <View style={styles.postsGrid}>
            {posts.map((post) => (
              <TouchableOpacity key={post.id} style={styles.gridItem} activeOpacity={0.9}>
                <Image source={{ uri: post.uri }} style={styles.gridImage} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {activeTab === 'tags' && (
          <View style={styles.postsGrid}>
            {mockTags.map((tag) => (
              <TouchableOpacity key={tag.id} style={styles.gridItem} activeOpacity={0.9}>
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
              <TouchableOpacity key={item.id} style={styles.gridItem} activeOpacity={0.9}>
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
                      avatar: editName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'AJ'
                    });
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
                  onPress={() => {
                    if (!currentPassword || !newPassword || !confirmPassword) {
                      Alert.alert('Error', 'Please fill in all password fields.');
                      return;
                    }
                    if (newPassword !== confirmPassword) {
                      Alert.alert('Error', 'New password and confirm password do not match.');
                      return;
                    }
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setSettingsSubView('menu');
                    Alert.alert('Success', 'Your password has been changed successfully!');
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
              <View style={{height: 40}} />
            </ScrollView>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
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
    color: '#0F172A',
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
    borderColor: '#003366',
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#003366',
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
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  bioContainer: {
    marginBottom: 16,
  },
  nameText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  occupationText: {
    fontSize: 13.5,
    color: '#003366',
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
    color: '#0F172A',
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
    width: (width - 6) / 3,
    height: (width - 6) / 3,
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
    backgroundColor: '#FFFFFF',
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
    color: '#002144',
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
    color: '#0F172A',
  },
  
  // Instagram-style tabs styling
  tabContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
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
    borderBottomColor: '#003366',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  activeTabLabel: {
    color: '#003366',
    fontWeight: '700',
  },
  tabContentList: {
    padding: 16,
  },
  listCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
    color: '#0F172A',
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
    color: '#94A3B8',
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
    color: '#0F172A',
  },
  settingsRowDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    maxWidth: width * 0.7,
  },
  saveSettingsBtn: {
    backgroundColor: '#003366',
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  saveSettingsBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  settingsSectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginTop: 8,
  },
  securityInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    height: 46,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 12,
  },
  changePasswordBtn: {
    backgroundColor: '#0F172A',
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  changePasswordBtnText: {
    color: '#FFFFFF',
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
    color: '#64748B',
  },
  connectionInfo: {
    flex: 1,
  },
  connectionName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  connectionUsername: {
    fontSize: 13,
    color: '#64748B',
  },
  connectionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 6,
  },
  connectionBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  followingBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  followingBtnText: {
    color: '#0F172A',
  },
  modalTabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeModalTab: {
    borderBottomColor: '#0F172A',
  },
  modalTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
  },
  activeModalTabText: {
    color: '#0F172A',
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
    color: '#0F172A',
  },
});

export default ProfileScreen;
