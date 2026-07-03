import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Share,
  Alert,
  StatusBar,
  TextInput,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const DashboardScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const styles = getStyles(theme);

  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isDesktop = isWeb && width >= 768;
  const contentWidth = isWeb ? Math.min(width, 800) : width;
  const webContainerStyle = isWeb ? { alignSelf: 'center', width: '100%', maxWidth: isDesktop ? 1200 : 800, flex: 1 } : { flex: 1 };
  
  const [likedPosts, setLikedPosts] = useState({});
  const [bookmarkedPosts, setBookmarkedPosts] = useState({});
  const [followedUsers, setFollowedUsers] = useState({});
  const [followedSuggestions, setFollowedSuggestions] = useState({});
  const [searchText, setSearchText] = useState('');
  const [userInstitution, setUserInstitution] = useState('Our Network');

  // Modal States
  const [activeModal, setActiveModal] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentText, setCommentText] = useState('');

  const mockComments = [
    { id: '1', user: 'Rohan K.', text: 'Great event! Looking forward to the next one.', time: '1h' },
    { id: '2', user: 'Priya S.', text: 'Absolutely loved it.', time: '2h' }
  ];

  const mockUsers = [
    { id: 'u1', name: 'Rohan K.', avatar: 'RK' },
    { id: 'u2', name: 'Priya S.', avatar: 'PS' },
    { id: 'u3', name: 'Rahul M.', avatar: 'RM' },
    { id: 'u4', name: 'Amit Shah', avatar: 'AS' },
  ];

  const openModal = (type, post) => {
    setSelectedPost(post);
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedPost(null);
    setCommentText('');
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to logout?')) {
        AsyncStorage.removeItem('userInfo');
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      }
    } else {
      Alert.alert('Logout', 'Are you sure you want to logout?', [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('userInfo');
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
          }
        }
      ]);
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userInfoString = await AsyncStorage.getItem('userInfo');
      if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        if (userInfo.institution) {
          setUserInstitution(userInfo.institution);
        }
      }
    };
    fetchUserInfo();
  }, []);

  // ─── Data ──────────────────────────────────────────────
  const posts = [
    {
      id: '1',
      user: 'Dr. Satish Kumar',
      role: 'Staff Engineer @ Google',
      avatar: 'SK',
      content:
        'Truly honored to be back on campus for the Institution Alumni Gala. The growth of our network is incredible! Inspiring to see the next generation of leaders. #Institution #AlumniMeet',
      image:
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&h=400&q=80',
      likes: 124,
      commentsCount: 12,
      time: '2 hours ago',
    },
    {
      id: '2',
      user: 'Ananya Joshi',
      role: 'SDE-2 @ Microsoft',
      avatar: 'AJ',
      content:
        'Our Silicon Valley Institution chapter is hosting a meetup next month. Anyone in the Bay Area, please join us for coffee and mentorship talks! ☕️ #Mentorship #BayArea',
      image:
        'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&h=400&q=80',
      likes: 89,
      commentsCount: 5,
      time: '5 hours ago',
    },
  ];

  const suggestions = [
    { id: 's1', name: 'Rohan K.', avatar: 'RK' },
    { id: 's2', name: 'Priya S.', avatar: 'PS' },
    { id: 's3', name: 'Rahul M.', avatar: 'RM' },
    { id: 's4', name: 'Karan G.', avatar: 'KG' },
  ];

  const eventsAndJobs = [
    {
      id: 'e1',
      title: 'Alumni Gala Night 2026',
      image:
        'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=400&h=260&q=80',
    },
    {
      id: 'e2',
      title: 'SDE Intern @ Amazon',
      image:
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&h=260&q=80',
    },
    {
      id: 'e3',
      title: 'Tech Talk: AI in 2026',
      image:
        'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=400&h=260&q=80',
    },
  ];

  // ─── Handlers ──────────────────────────────────────────
  const toggleLike = (postId) => {
    setLikedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const toggleBookmark = (postId) => {
    setBookmarkedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const toggleFollow = (postId) => {
    setFollowedUsers((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const toggleSuggestionFollow = (id) => {
    setFollowedSuggestions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleShare = async (post) => {
    try {
      await Share.share({
        message: `Check out this post from ${post.user} on Institution Alumni App:\n"${post.content}"`,
      });
    } catch (_error) {
      Alert.alert('Error', 'Could not share this post');
    }
  };

  // ─── Sub-components ────────────────────────────────────
  const renderPostCard = (post) => (
    <View key={post.id} style={styles.postCard}>
      {/* Post header */}
      <View style={styles.postHeader}>
        <View style={styles.postUserAvatar}>
          <Text style={styles.avatarText}>{post.avatar}</Text>
        </View>
        <View style={styles.postUserInfo}>
          <Text style={styles.postUserName}>{post.user}</Text>
          <Text style={styles.postUserRole}>{post.role}</Text>
        </View>
        <TouchableOpacity
          style={styles.followBtn}
          activeOpacity={0.7}
          onPress={() => toggleFollow(post.id)}
        >
          <Text style={styles.followBtnText}>
            {followedUsers[post.id] ? 'Following' : '+ Follow'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Post image */}
      <Image source={{ uri: post.image }} style={[styles.postImage, { width: '100%', height: contentWidth * 0.65 }]} />

      {/* Action row */}
      <View style={styles.postActions}>
        <View style={styles.leftActions}>
          <TouchableOpacity onPress={() => toggleLike(post.id)} activeOpacity={0.6}>
            <Ionicons
              name={likedPosts[post.id] ? 'heart' : 'heart-outline'}
              size={26}
              color={likedPosts[post.id] ? theme.danger : theme.text}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.6} onPress={() => openModal('comments', post)}>
            <Ionicons name="chatbubble-outline" size={24} color="#0F172A" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.6} onPress={() => openModal('reshare', post)}>
            <Ionicons name="repeat-outline" size={26} color="#0F172A" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => openModal('share', post)}
            activeOpacity={0.6}
          >
            <Ionicons name="paper-plane-outline" size={24} color="#0F172A" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => toggleBookmark(post.id)} activeOpacity={0.6}>
          <Ionicons
            name={bookmarkedPosts[post.id] ? 'bookmark' : 'bookmark-outline'}
            size={24}
            color={bookmarkedPosts[post.id] ? theme.primary : theme.text}
          />
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.postFooter}>
        <Text style={styles.likesText}>
          {likedPosts[post.id] ? post.likes + 1 : post.likes} likes
        </Text>
        <Text style={styles.postContent} numberOfLines={2}>
          {post.content}
        </Text>
        {post.commentsCount > 0 && (
          <TouchableOpacity style={styles.commentBtn} onPress={() => openModal('comments', post)}>
            <Text style={styles.viewCommentsText}>
              View all {post.commentsCount} comments
            </Text>
          </TouchableOpacity>
        )}
        <Text style={styles.timeText}>{post.time}</Text>
      </View>
    </View>
  );

  // ─── Render ────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={webContainerStyle}>
        
        {/* ── Header ─────────────────────────────────────── */}
        <View style={styles.header}>
          {/* Left – User avatar */}
          <TouchableOpacity
            style={styles.headerAvatar}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.headerAvatarText}>AJ</Text>
          </TouchableOpacity>

          {/* Center – Search bar */}
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={18} color="#94A3B8" style={{ marginRight: 6 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#94A3B8"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          {/* Right – Icons */}
          <View style={styles.headerIcons}>
            <TouchableOpacity
              style={styles.headerIconBtn}
              onPress={() => navigation.navigate('Messages')}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={22} color="#003366" />
              <View style={styles.dot} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerIconBtn}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Ionicons name="notifications-outline" size={22} color="#003366" />
              <View style={styles.dot} />
            </TouchableOpacity>
          </View>
        </View>

        {isDesktop ? (
          // WEB GRID DASHBOARD
          <View style={{ flex: 1, padding: 24, flexDirection: 'row', gap: 24 }}>
            {/* Left Column: Feed */}
            <View style={{ flex: 7 }}>
              <View style={{ backgroundColor: '#F8FAFC', padding: 24, borderRadius: 16, marginBottom: 24 }}>
                <Text style={{ fontSize: 24, fontWeight: '800', color: '#0F172A' }}>Welcome back, {userInstitution} Alumni!</Text>
                <Text style={{ fontSize: 16, color: '#64748B', marginTop: 8 }}>Here&apos;s what&apos;s happening in your network today.</Text>
              </View>
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                {posts.map(post => renderPostCard(post))}
              </ScrollView>
            </View>

            {/* Right Column: Widgets */}
            <View style={{ flex: 4 }}>
              {/* Suggestions Widget */}
              <View style={{ backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 24, elevation: 2, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.05, shadowRadius: 3 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: '#0F172A' }}>People you may know</Text>
                  <Text style={{ fontSize: 13, color: '#003366', fontWeight: '600' }}>See all</Text>
                </View>
                {suggestions.map(s => (
                  <View key={s.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                      <Text style={{ fontWeight: '700', color: '#64748B' }}>{s.avatar}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, fontWeight: '600', color: '#0F172A' }}>{s.name}</Text>
                      <Text style={{ fontSize: 12, color: '#64748B' }}>Alumni</Text>
                    </View>
                    <TouchableOpacity 
                      style={[styles.suggestionFollowBtn, followedSuggestions[s.id] && styles.suggestionFollowBtnActive, { paddingHorizontal: 12, paddingVertical: 6 }]}
                      onPress={() => toggleSuggestionFollow(s.id)}
                    >
                      <Text style={[styles.suggestionFollowText, followedSuggestions[s.id] && styles.suggestionFollowTextActive]}>{followedSuggestions[s.id] ? 'Following' : 'Follow'}</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              {/* Events & Jobs Widget */}
              <View style={{ backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, elevation: 2, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.05, shadowRadius: 3 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: '#0F172A' }}>Upcoming & Opportunities</Text>
                  <Text style={{ fontSize: 13, color: '#003366', fontWeight: '600' }}>See all</Text>
                </View>
                {eventsAndJobs.map(ev => (
                  <View key={ev.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
                    <Image source={{ uri: ev.image }} style={{ width: 60, height: 60, borderRadius: 8, marginRight: 12 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, fontWeight: '600', color: '#0F172A', marginBottom: 4 }}>{ev.title}</Text>
                      <TouchableOpacity style={{ backgroundColor: '#F1F5F9', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 }}>
                        <Text style={{ fontSize: 11, fontWeight: '600', color: '#003366' }}>View Details</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ) : (
          // MOBILE LAYOUT (Current)
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {renderPostCard(posts[0])}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Suggestions for you</Text>
                <TouchableOpacity><Text style={styles.seeAllText}>See all</Text></TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionsScroll}>
                {suggestions.map((s) => (
                  <View key={s.id} style={styles.suggestionCard}>
                    <TouchableOpacity style={styles.suggestionRemove}><Ionicons name="close" size={14} color="#94A3B8" /></TouchableOpacity>
                    <View style={styles.suggestionAvatar}><Text style={styles.avatarText}>{s.avatar}</Text></View>
                    <Text style={styles.suggestionName} numberOfLines={1}>{s.name}</Text>
                    <Text style={styles.suggestSubText}>Lorem Ipsum</Text>
                    <TouchableOpacity
                      style={[styles.suggestionFollowBtn, followedSuggestions[s.id] && styles.suggestionFollowBtnActive]}
                      onPress={() => toggleSuggestionFollow(s.id)}
                    >
                      <Text style={[styles.suggestionFollowText, followedSuggestions[s.id] && styles.suggestionFollowTextActive]}>
                        {followedSuggestions[s.id] ? 'Following' : 'Follow'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
            {renderPostCard(posts[1])}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Events & Job Suggestions</Text>
                <TouchableOpacity><Text style={styles.seeAllText}>See all</Text></TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.eventsScroll}>
                {eventsAndJobs.map((ev) => (
                  <View key={ev.id} style={[styles.eventRowCard, { width: contentWidth * 0.76 }]}>
                    <Image source={{ uri: ev.image }} style={styles.eventRowImage} />
                    <View style={styles.eventRowContent}>
                      <Text style={styles.eventRowTitle} numberOfLines={1}>{ev.title}</Text>
                      <Text style={styles.eventRowSub} numberOfLines={1}>Lorem Ipsum</Text>
                      <TouchableOpacity style={styles.eventRowBtn}><Text style={styles.eventRowBtnText}>Lorem Ipsum</Text></TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.eventRowClose}><Ionicons name="close" size={14} color="#94A3B8" /></TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
            <View style={{ height: 30 }} />
          </ScrollView>
        )}
      </View>

      {/* ── Modals ────────────────────────────────────────────── */}
      {/* Comments Modal */}
      <Modal visible={activeModal === 'comments'} animationType="slide" transparent={true}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={isWeb ? styles.webModalOverlay : styles.modalOverlay}>
          <View style={isWeb ? styles.webModalContainer : styles.bottomSheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Comments</Text>
              <TouchableOpacity onPress={closeModal}><Ionicons name="close" size={24} color="#0F172A" /></TouchableOpacity>
            </View>
            <FlatList
              data={mockComments}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <View style={styles.commentRow}>
                  <Text style={styles.commentUser}>{item.user}</Text>
                  <Text style={styles.commentText}>{item.text}</Text>
                  <Text style={styles.commentTime}>{item.time}</Text>
                </View>
              )}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            />
            <View style={styles.commentInputRow}>
              <TextInput style={styles.commentInput} placeholder="Add a comment..." value={commentText} onChangeText={setCommentText} />
              <TouchableOpacity onPress={() => setCommentText('')}><Text style={styles.commentPostBtn}>Post</Text></TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Share Modal */}
      <Modal visible={activeModal === 'share'} animationType="slide" transparent={true}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={isWeb ? styles.webModalOverlay : styles.modalOverlay}>
          <View style={isWeb ? styles.webModalContainer : styles.bottomSheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Share to...</Text>
              <TouchableOpacity onPress={closeModal}><Ionicons name="close" size={24} color="#0F172A" /></TouchableOpacity>
            </View>
            <View style={styles.shareGrid}>
              <TouchableOpacity style={styles.shareItem} onPress={() => handleShare(selectedPost)}>
                <View style={[styles.shareIconWrap, {backgroundColor:'#25D366'}]}><Ionicons name="logo-whatsapp" size={24} color="#FFF"/></View>
                <Text style={styles.shareText}>WhatsApp</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareItem} onPress={() => handleShare(selectedPost)}>
                <View style={[styles.shareIconWrap, {backgroundColor:'#0077B5'}]}><Ionicons name="logo-linkedin" size={24} color="#FFF"/></View>
                <Text style={styles.shareText}>LinkedIn</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareItem} onPress={() => handleShare(selectedPost)}>
                <View style={[styles.shareIconWrap, {backgroundColor:'#1DA1F2'}]}><Ionicons name="logo-twitter" size={24} color="#FFF"/></View>
                <Text style={styles.shareText}>Twitter</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareItem} onPress={() => handleShare(selectedPost)}>
                <View style={[styles.shareIconWrap, {backgroundColor:'#E2E8F0'}]}><Ionicons name="copy-outline" size={24} color="#0F172A"/></View>
                <Text style={styles.shareText}>Copy Link</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </SafeAreaView>
  );
};

const getStyles = (theme) => StyleSheet.create({
  /* ── Container ──────────────────────────────────────── */
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  /* ── Header ─────────────────────────────────────────── */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
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
    marginRight: 10,
  },
  headerAvatarText: {
    color: theme.card,
    fontSize: 14,
    fontWeight: '700',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 24,
    paddingHorizontal: 14,
    height: 38,
    marginRight: 10,
    borderWidth: 1,
    borderColor: theme.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: theme.text,
    paddingVertical: 0,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconBtn: {
    position: 'relative',
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.danger,
    borderWidth: 1.5,
    borderColor: theme.card,
  },

  /* ── Post Card ──────────────────────────────────────── */
  postCard: {
    backgroundColor: theme.card,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  postUserAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    color: theme.card,
    fontSize: 14,
    fontWeight: '700',
  },
  postUserInfo: {
    flex: 1,
  },
  postUserName: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.text,
  },
  postUserRole: {
    fontSize: 12,
    color: theme.textSecondary,
    marginTop: 1,
  },
  followBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  followBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.primary,
  },
  postImage: {
    backgroundColor: theme.border,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  actionBtn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  postFooter: {
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  likesText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.text,
  },
  postContent: {
    fontSize: 13.5,
    color: theme.inputBackground,
    lineHeight: 19,
    marginTop: 4,
  },
  commentBtn: {
    marginTop: 4,
  },
  viewCommentsText: {
    fontSize: 13,
    color: theme.textSecondary,
  },
  timeText: {
    fontSize: 11,
    color: theme.textMuted,
    marginTop: 6,
  },

  /* ── Section (Suggestions / Events) ─────────────────── */
  sectionContainer: {
    backgroundColor: theme.card,
    paddingVertical: 16,
    marginBottom: 8,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.text,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.primary,
  },

  /* ── Suggestions ────────────────────────────────────── */
  suggestionsScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  suggestionCard: {
    width: 110,
    backgroundColor: theme.card,
    borderRadius: 14,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: theme.border,
    shadowColor: theme.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  suggestionAvatar: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  suggestionAvatarText: {
    color: theme.card,
    fontSize: 16,
    fontWeight: '700',
  },
  suggestionName: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  suggestionFollowBtn: {
    backgroundColor: theme.primary,
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 8,
  },
  suggestionFollowBtnActive: {
    backgroundColor: theme.border,
  },
  suggestionFollowText: {
    color: theme.card,
    fontSize: 12,
    fontWeight: '700',
  },
  suggestionFollowTextActive: {
    color: theme.textSecondary,
  },

  /* ── Events & Jobs ──────────────────────────────────── */
  eventsScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  eventRowCard: {
    flexDirection: 'row',
    height: 110,
    backgroundColor: theme.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 10,
    marginRight: 4,
    position: 'relative',
  },
  eventRowImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  eventRowContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  eventRowTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: theme.text,
    paddingRight: 16,
  },
  eventRowSub: {
    fontSize: 11,
    color: theme.textSecondary,
  },
  eventRowBtn: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  eventRowBtnText: {
    color: theme.card,
    fontSize: 9.5,
    fontWeight: '700',
  },
  eventRowClose: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  suggestCloseBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  suggestSubText: {
    fontSize: 11,
    color: theme.textSecondary,
    marginBottom: 8,
  },

  /* ── Modals ──────────────────────────────────────────── */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: theme.card,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: '60%',
    paddingBottom: 20,
  },
  bottomSheetMini: {
    backgroundColor: theme.card,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 30,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.text,
  },
  commentRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.background,
  },
  commentUser: {
    fontWeight: '700',
    fontSize: 13,
    color: theme.text,
    marginRight: 8,
  },
  commentText: {
    flex: 1,
    fontSize: 13,
    color: theme.inputBackground,
  },
  commentTime: {
    fontSize: 11,
    color: theme.textMuted,
    marginLeft: 8,
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 40,
    fontSize: 14,
  },
  commentPostBtn: {
    color: theme.primary,
    fontWeight: '700',
    marginLeft: 12,
  },
  sheetActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  sheetActionText: {
    fontSize: 16,
    marginLeft: 12,
    color: theme.text,
  },
  shareGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  shareUserAvatar: {
    alignItems: 'center',
    width: 60,
  },
  shareAvatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  shareAvatarText: {
    color: theme.text,
    fontWeight: '700',
    fontSize: 16,
  },
  shareUserName: {
    fontSize: 11,
    color: '#475569',
    textAlign: 'center',
  },
  systemShareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    marginHorizontal: 16,
    marginTop: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
  },
  systemShareText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.text,
  },
  webModalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.5)', justifyContent: 'center', alignItems: 'center' },
  webModalContainer: { width: 500, backgroundColor: theme.card, borderRadius: 16, paddingBottom: 16, maxHeight: '80%', overflow: 'hidden' },
});

export default DashboardScreen;
