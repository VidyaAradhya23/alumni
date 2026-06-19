import React, { useState } from 'react';
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
import { Ionicons } from '@expo/vector-icons';

const SELECTED_STUDENTS = [
  { id: 'ss1', name: 'Sarthak Banka', placement: 'Qualcomm', branch: 'CSE', batch: '2023', avatar: 'SB' },
  { id: 'ss2', name: 'Manjunath N', placement: 'Maverik', branch: 'MBA', batch: '2015', avatar: 'MN' },
  { id: 'ss3', name: 'Priya Sharma', placement: 'Google', branch: 'CSE', batch: '2020', avatar: 'PS' },
  { id: 'ss4', name: 'Rahul Verma', placement: 'Apple', branch: 'ECE', batch: '2019', avatar: 'RV' },
];

const FEED_POSTS = [
  {
    id: '1',
    user: 'Dr. Satish Kumar',
    role: 'Dean of Academics @ Institution',
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
    role: 'SDE-2 @ Microsoft (Alumni)',
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

const EVENTS_AND_JOBS = [
  {
    id: 'ej1',
    title: 'Alumni Gala Night 2026',
    image:
      'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=400&h=260&q=80',
    type: 'Event',
  },
  {
    id: 'ej2',
    title: 'SDE Intern @ Amazon',
    image:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&h=260&q=80',
    type: 'Job',
  },
  {
    id: 'ej3',
    title: 'Tech Talk: AI in 2026',
    image:
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=400&h=260&q=80',
    type: 'Event',
  },
];

const MOCK_COMMENTS = [
  { id: '1', user: 'Rohan K.', text: 'Outstanding! Proud of the continuous growth.', time: '1h' },
  { id: '2', user: 'Priya S.', text: 'Will definitely attend the Bay Area meetup.', time: '2h' }
];

const MOCK_USERS = [
  { id: 'u1', name: 'Rohan K.', avatar: 'RK' },
  { id: 'u2', name: 'Priya S.', avatar: 'PS' },
  { id: 'u3', name: 'Rahul M.', avatar: 'RM' },
  { id: 'u4', name: 'Amit Shah', avatar: 'AS' },
];

export default function AdminHomeScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const [likedPosts, setLikedPosts] = useState({});
  const [bookmarkedPosts, setBookmarkedPosts] = useState({});
  const [followedUsers, setFollowedUsers] = useState({});
  const [searchText, setSearchText] = useState('');
  const [postsList, setPostsList] = useState(FEED_POSTS);

  // Modal States
  const [activeModal, setActiveModal] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentText, setCommentText] = useState('');

  const openModal = (type, post) => {
    setSelectedPost(post);
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedPost(null);
    setCommentText('');
  };

  const toggleLike = (postId) => {
    setLikedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const toggleBookmark = (postId) => {
    setBookmarkedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const toggleFollow = (postId) => {
    setFollowedUsers((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleShare = async (post) => {
    try {
      await Share.share({
        message: `Share post from ${post.user} on Institution Admin Portal:\n"${post.content}"`,
      });
    } catch (_error) {
      Alert.alert('Error', 'Could not share this post');
    }
  };

  const handlePostComment = () => {
    if (!commentText.trim()) return;
    Alert.alert('Success', 'Comment posted!');
    setCommentText('');
  };

  const renderPostCard = (post) => (
    <View key={post.id} style={styles.postCard}>
      {/* Header */}
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

      {/* Image */}
      <Image source={{ uri: post.image }} style={[styles.postImage, { width: width, height: width * 0.65 }]} />

      {/* Actions */}
      <View style={styles.postActions}>
        <View style={styles.leftActions}>
          <TouchableOpacity onPress={() => toggleLike(post.id)} activeOpacity={0.6}>
            <Ionicons
              name={likedPosts[post.id] ? 'heart' : 'heart-outline'}
              size={26}
              color={likedPosts[post.id] ? '#EF4444' : '#0F172A'}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.6} onPress={() => openModal('comments', post)}>
            <Ionicons name="chatbubble-outline" size={24} color="#0F172A" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.6} onPress={() => openModal('reshare', post)}>
            <Ionicons name="repeat-outline" size={26} color="#0F172A" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.6} onPress={() => openModal('share', post)}>
            <Ionicons name="paper-plane-outline" size={24} color="#0F172A" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => toggleBookmark(post.id)} activeOpacity={0.6}>
          <Ionicons
            name={bookmarkedPosts[post.id] ? 'bookmark' : 'bookmark-outline'}
            size={24}
            color={bookmarkedPosts[post.id] ? '#003366' : '#0F172A'}
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerAvatar}
          activeOpacity={0.8}
          onPress={() => navigation && navigation.navigate('AdminProfile')}
        >
          <Text style={styles.headerAvatarText}>AD</Text>
        </TouchableOpacity>

        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#94A3B8" style={{ marginRight: 6 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Institution Feed..."
            placeholderTextColor="#94A3B8"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => navigation && navigation.navigate('Messages')}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={24} color="#003366" />
            <View style={styles.dot} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => navigation && navigation.navigate('Notifications')}
          >
            <Ionicons name="notifications-outline" size={24} color="#003366" />
            <View style={styles.dot} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Welcome Message */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Institution Admin Portal</Text>
          <Text style={styles.welcomeSubtitle}>Active Session • Institution Bangalore</Text>
        </View>

        {/* First Post */}
        {renderPostCard(postsList[0])}

        {/* Selected Students suggestions */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Selected Students (Institution)</Text>
            <TouchableOpacity onPress={() => navigation && navigation.navigate('AdminUsers')}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestionsScroll}
          >
            {SELECTED_STUDENTS.map((student) => (
              <View key={student.id} style={styles.suggestionCard}>
                <View style={styles.suggestionAvatar}>
                  <Text style={styles.suggestionAvatarText}>{student.avatar}</Text>
                </View>
                <Text style={styles.suggestionName} numberOfLines={1}>
                  {student.name}
                </Text>
                <Text style={styles.placementText} numberOfLines={1}>
                  Placed @ {student.placement}
                </Text>
                <Text style={styles.suggestSubText}>
                  {student.branch} • {student.batch}
                </Text>
                <TouchableOpacity
                  style={styles.suggestionFollowBtn}
                  activeOpacity={0.7}
                  onPress={() => Alert.alert('Selected Student', `${student.name} is placed at ${student.placement}.`)}
                >
                  <Text style={styles.suggestionFollowText}>Details</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Second Post */}
        {postsList.length > 1 && renderPostCard(postsList[1])}

        {/* Events & Job Suggestions */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Events & Job Opportunities</Text>
            <TouchableOpacity onPress={() => navigation && navigation.navigate('AdminEvents')}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.eventsScroll}
          >
            {EVENTS_AND_JOBS.map((ev) => (
              <View key={ev.id} style={[styles.eventRowCard, { width: width * 0.76 }]}>
                <Image source={{ uri: ev.image }} style={styles.eventRowImage} />
                <View style={styles.eventRowContent}>
                  <Text style={styles.eventRowTitle} numberOfLines={1}>
                    {ev.title}
                  </Text>
                  <Text style={styles.eventRowSub} numberOfLines={1}>
                    Upcoming {ev.type}
                  </Text>
                  <TouchableOpacity 
                    style={styles.eventRowBtn}
                    onPress={() => {
                      if (ev.type === 'Job') {
                        navigation && navigation.navigate('AdminJobs');
                      } else {
                        navigation && navigation.navigate('AdminEvents');
                      }
                    }}
                  >
                    <Text style={styles.eventRowBtnText}>Manage {ev.type}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Modals */}
      {/* Comments Modal */}
      <Modal visible={activeModal === 'comments'} animationType="slide" transparent={true}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Comments</Text>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={24} color="#0F172A" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={MOCK_COMMENTS}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.commentRow}>
                  <Text style={styles.commentUser}>{item.user}</Text>
                  <Text style={styles.commentText}>{item.text}</Text>
                  <Text style={styles.commentTime}>{item.time}</Text>
                </View>
              )}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            />
            <View style={styles.commentInputRow}>
              <TextInput
                style={styles.commentInput}
                placeholder="Add a comment..."
                placeholderTextColor="#94A3B8"
                value={commentText}
                onChangeText={setCommentText}
              />
              <TouchableOpacity onPress={handlePostComment}>
                <Text style={styles.commentPostBtn}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Repost Modal */}
      <Modal visible={activeModal === 'reshare'} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheetMini}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Repost</Text>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={24} color="#0F172A" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.sheetActionRow} onPress={() => { closeModal(); Alert.alert('Success', 'Reposted successfully!'); }}>
              <Ionicons name="repeat" size={24} color="#0F172A" />
              <Text style={styles.sheetActionText}>Repost</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sheetActionRow} onPress={() => { closeModal(); Alert.alert('Success', 'Quoted successfully!'); }}>
              <Ionicons name="pencil" size={24} color="#0F172A" />
              <Text style={styles.sheetActionText}>Quote Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Share Modal */}
      <Modal visible={activeModal === 'share'} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Share</Text>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={24} color="#0F172A" />
              </TouchableOpacity>
            </View>

            <View style={styles.shareGrid}>
              {MOCK_USERS.map((u) => (
                <TouchableOpacity 
                  key={u.id} 
                  style={styles.shareUserAvatar}
                  onPress={() => { closeModal(); Alert.alert('Sent', `Sent to ${u.name}`); }}
                >
                  <View style={styles.shareAvatarCircle}>
                    <Text style={styles.shareAvatarText}>{u.avatar}</Text>
                  </View>
                  <Text style={styles.shareUserName} numberOfLines={1}>
                    {u.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.systemShareBtn}
              onPress={() => {
                const post = selectedPost;
                closeModal();
                if (post) handleShare(post);
              }}
            >
              <Ionicons name="share-social-outline" size={20} color="#0F172A" style={{ marginRight: 8 }} />
              <Text style={styles.systemShareText}>Share via...</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 20,
  },
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
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#003366',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  headerAvatarText: {
    color: '#FFFFFF',
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
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
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
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  welcomeContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#002144',
  },
  welcomeSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
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
    backgroundColor: '#003366',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    shadowColor: '#003366',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
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
    color: '#003366',
  },
  postImage: {
    backgroundColor: '#E2E8F0',
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
    color: '#0F172A',
  },
  postContent: {
    fontSize: 13.5,
    color: '#334155',
    lineHeight: 19,
    marginTop: 4,
  },
  commentBtn: {
    marginTop: 4,
  },
  viewCommentsText: {
    fontSize: 13,
    color: '#64748B',
  },
  timeText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 6,
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    marginBottom: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
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
    color: '#0F172A',
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#003366',
  },
  suggestionsScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  suggestionCard: {
    width: 130,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  suggestionAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#003366',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  suggestionAvatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  suggestionName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
    textAlign: 'center',
  },
  placementText: {
    fontSize: 11,
    color: '#16A34A',
    fontWeight: '700',
    marginBottom: 2,
    textAlign: 'center',
  },
  suggestSubText: {
    fontSize: 10.5,
    color: '#64748B',
    marginBottom: 8,
    textAlign: 'center',
  },
  suggestionFollowBtn: {
    backgroundColor: '#003366',
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 8,
  },
  suggestionFollowText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  eventsScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  eventRowCard: {
    flexDirection: 'row',
    height: 110,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 10,
    marginRight: 4,
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
    color: '#0F172A',
  },
  eventRowSub: {
    fontSize: 11,
    color: '#64748B',
  },
  eventRowBtn: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  eventRowBtnText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: '60%',
    paddingBottom: 20,
  },
  bottomSheetMini: {
    backgroundColor: '#FFFFFF',
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
    color: '#0F172A',
  },
  commentRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
    alignItems: 'center',
  },
  commentUser: {
    fontWeight: '700',
    fontSize: 13,
    color: '#0F172A',
    marginRight: 8,
  },
  commentText: {
    flex: 1,
    fontSize: 13,
    color: '#334155',
  },
  commentTime: {
    fontSize: 11,
    color: '#94A3B8',
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
    color: '#0F172A',
  },
  commentPostBtn: {
    color: '#003366',
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
    color: '#0F172A',
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
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  shareAvatarText: {
    color: '#0F172A',
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
    color: '#0F172A',
  },
});
