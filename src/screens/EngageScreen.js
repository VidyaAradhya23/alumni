import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, useWindowDimensions, Image, StatusBar, Modal, TextInput, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const EngageScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const [currentView, setCurrentView] = useState('feed');
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [jobPreference, setJobPreference] = useState('Full-Time');
  const [jobPrefModalVisible, setJobPrefModalVisible] = useState(false);
  const [reshareModalVisible, setReshareModalVisible] = useState(false);
  const [likedPosts, setLikedPosts] = useState({});
  const [postText, setPostText] = useState('');
  const [eventForm, setEventForm] = useState({
    name: '',
    date: 'July 18, 2025',
    startTime: '09:00am',
    endTime: '10:00am',
    notifyPhone: true,
    notifyEmail: false,
    reminder: '1 hour before event',
    description: '',
  });

  const [postsList, setPostsList] = useState([
    {
      id: '1',
      user: 'Dr. Satish Kumar',
      subtitle: 'Staff Engineer @ Google',
      avatar: 'SK',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&h=400&q=80',
      likes: 124,
      time: '2h',
      content: 'Truly honored to be back on campus for the Institution Alumni Gala. The growth of our network is incredible! Inspiring to see the next generation of leaders. #Institution #AlumniMeet',
    },
    {
      id: '2',
      user: 'Ananya Joshi',
      subtitle: 'SDE-2 @ Microsoft',
      avatar: 'AJ',
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&h=400&q=80',
      likes: 89,
      time: '5h',
      content: 'Our Silicon Valley Institution chapter is hosting a meetup next month. Anyone in the Bay Area, please join us for coffee and mentorship talks! ☕️ #Mentorship #BayArea',
    },
  ]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setCurrentView('feed');
      setActionSheetVisible(true);
    });
    return unsubscribe;
  }, [navigation]);

  const handleDismiss = () => {
    setActionSheetVisible(false);
    navigation.navigate('Home');
  };

  const handleCreatePost = () => {
    if (!postText.trim()) {
      Alert.alert('Required', 'Please enter some thoughts to share.');
      return;
    }
    const newPost = {
      id: Date.now().toString(),
      user: 'Abhishek Jaiswal',
      subtitle: `Senior Software Engineer • ${jobPreference}`,
      avatar: 'AJ',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&h=400&q=80',
      likes: 0,
      time: 'Just now',
      content: postText,
    };
    setPostsList([newPost, ...postsList]);
    setPostText('');
    setCurrentView('feed');
    Alert.alert('Success', 'Your post has been shared successfully!');
  };

  const suggestions = [
    { id: '1', name: 'Rohan K.', avatar: 'RK' },
    { id: '2', name: 'Priya S.', avatar: 'PS' },
    { id: '3', name: 'Rahul M.', avatar: 'RM' },
    { id: '4', name: 'Karan G.', avatar: 'KG' },
  ];

  const events = [
    { id: '1', title: 'Kannada Rajyotsava', date: 'November 1, 2025', location: 'Bengaluru, India', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=300&h=200&q=80' },
    { id: '2', title: 'Kannada Rajyotsava', date: 'November 1, 2025', location: 'Bengaluru, India', image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=300&h=200&q=80' },
    { id: '3', title: 'Kannada Rajyotsava', date: 'November 1, 2025', location: 'Bengaluru, India', image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=300&h=200&q=80' },
    { id: '4', title: 'Kannada Rajyotsava', date: 'November 1, 2025', location: 'Bengaluru, India', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=300&h=200&q=80' },
  ];

  const [followedSuggestions, setFollowedSuggestions] = useState({});

  const toggleLike = (id) => setLikedPosts(prev => ({ ...prev, [id]: !prev[id] }));

  // ===== WRITE POST VIEW =====
  if (currentView === 'writePost') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.writePostHeader}>
          <TouchableOpacity onPress={() => setCurrentView('feed')}>
            <Ionicons name="close" size={24} color="#002144" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.writePostHeaderCenter} 
            onPress={() => setJobPrefModalVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.smallAvatar}><Text style={styles.smallAvatarText}>AJ</Text></View>
            <Text style={styles.anyoneText}>{jobPreference}</Text>
            <Ionicons name="chevron-down" size={16} color="#002144" />
          </TouchableOpacity>
          <View style={styles.writePostHeaderRight}>
            <TouchableOpacity><Ionicons name="time-outline" size={22} color="#64748B" /></TouchableOpacity>
            <TouchableOpacity style={styles.postButton} onPress={handleCreatePost}>
              <Text style={styles.postButtonText}>Post</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.writePostBody}>
          <TextInput
            style={styles.writePostInput}
            placeholder="Share your thoughts..."
            placeholderTextColor="#94A3B8"
            multiline
            textAlignVertical="top"
            value={postText}
            onChangeText={setPostText}
            autoFocus
          />
        </View>
        <View style={styles.writePostFooter}>
          <TouchableOpacity style={styles.aiButton}>
            <Ionicons name="sparkles" size={16} color="#003366" />
            <Text style={styles.aiButtonText}>Rewrite with AI</Text>
          </TouchableOpacity>
          <View style={styles.writePostFooterIcons}>
            <TouchableOpacity style={styles.footerIconBtn}>
              <Ionicons name="image-outline" size={24} color="#64748B" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerIconBtn}>
              <Ionicons name="add-outline" size={24} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Job Preference Modal */}
        <Modal visible={jobPrefModalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => setJobPrefModalVisible(false)} />
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Job Preference</Text>
                <TouchableOpacity onPress={() => setJobPrefModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#0F172A" />
                </TouchableOpacity>
              </View>
              {['Full-Time', 'Part-Time', 'Internship', 'Freelance', 'Contract', 'Open to Referrals'].map((pref) => (
                <TouchableOpacity
                  key={pref}
                  style={[
                    styles.modalItem,
                    jobPreference === pref && styles.selectedModalItem
                  ]}
                  onPress={() => {
                    setJobPreference(pref);
                    setJobPrefModalVisible(false);
                  }}
                >
                  <Text style={[
                    styles.modalItemText,
                    jobPreference === pref && styles.selectedModalItemText
                  ]}>
                    {pref}
                  </Text>
                  {jobPreference === pref && <Ionicons name="checkmark" size={20} color="#003366" />}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  // ===== CREATE EVENT VIEW =====
  if (currentView === 'createEvent') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.subScreenHeader}>
          <TouchableOpacity onPress={() => setCurrentView('feed')}>
            <Ionicons name="close" size={24} color="#002144" />
          </TouchableOpacity>
          <Text style={styles.subScreenTitle}>Create Event</Text>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView contentContainerStyle={styles.createEventBody}>
          <Text style={styles.fieldLabel}>Event Name</Text>
          <TextInput style={styles.fieldInput} placeholder="Enter event name" placeholderTextColor="#94A3B8" value={eventForm.name} onChangeText={t => setEventForm({...eventForm, name: t})} />

          <View style={styles.dateTimeRow}>
            <View style={styles.dateField}>
              <Ionicons name="calendar-outline" size={18} color="#64748B" />
              <Text style={styles.dateTimeText}>{eventForm.date}</Text>
            </View>
            <View style={styles.colorDots}>
              <View style={[styles.colorDot, { backgroundColor: '#CBD5E1' }]} />
              <View style={[styles.colorDot, { backgroundColor: '#003366' }]} />
              <View style={[styles.colorDot, { backgroundColor: '#CBD5E1' }]} />
              <View style={[styles.colorDot, { backgroundColor: '#CBD5E1' }]} />
            </View>
          </View>

          <View style={styles.timeRow}>
            <View style={styles.timeField}>
              <Ionicons name="time-outline" size={18} color="#64748B" />
              <Text style={styles.dateTimeText}>{eventForm.startTime}</Text>
            </View>
            <Ionicons name="arrow-forward" size={16} color="#94A3B8" />
            <View style={styles.timeField}>
              <Text style={styles.dateTimeText}>{eventForm.endTime}</Text>
            </View>
          </View>

          <View style={styles.hostRow}>
            <View style={styles.hostAvatar}><Text style={styles.hostAvatarText}>AJ</Text></View>
            <Text style={styles.hostName}>Name</Text>
            <Ionicons name="chevron-down" size={16} color="#002144" />
          </View>

          <Text style={styles.fieldLabel}>Get notified on</Text>
          <View style={styles.notifyRow}>
            <TouchableOpacity style={[styles.notifyOption, eventForm.notifyPhone && styles.notifyActive]} onPress={() => setEventForm({...eventForm, notifyPhone: !eventForm.notifyPhone})}>
              <Text style={[styles.notifyText, eventForm.notifyPhone && styles.notifyActiveText]}>On phone</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.notifyOption, eventForm.notifyEmail && styles.notifyActive]} onPress={() => setEventForm({...eventForm, notifyEmail: !eventForm.notifyEmail})}>
              <Text style={[styles.notifyText, eventForm.notifyEmail && styles.notifyActiveText]}>Email</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.fieldLabel}>Set reminder</Text>
          <View style={styles.fieldInput}><Text style={{ color: '#002144', fontSize: 15 }}>{eventForm.reminder}</Text></View>

          <Text style={styles.fieldLabel}>Add description</Text>
          <View style={styles.descriptionWrapper}>
            <TextInput style={[styles.fieldInput, { height: 100, textAlignVertical: 'top', paddingTop: 12, flex: 1 }]} placeholder="Add description" placeholderTextColor="#94A3B8" multiline value={eventForm.description} onChangeText={t => setEventForm({...eventForm, description: t})} />
            <Ionicons name="pencil-outline" size={16} color="#94A3B8" style={styles.descPencilIcon} />
          </View>

          <TouchableOpacity style={styles.createEventButton} onPress={() => {
            setCurrentView('feed');
            Alert.alert('Success', 'Event created successfully!');
          }}>
            <Text style={styles.createEventButtonText}>Create Event</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ===== JOIN EVENT VIEW =====
  if (currentView === 'joinEvent') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.subScreenHeader}>
          <TouchableOpacity onPress={() => setCurrentView('feed')}>
            <Ionicons name="arrow-back" size={24} color="#002144" />
          </TouchableOpacity>
          <Text style={styles.subScreenTitle}>Join Event</Text>
          <TouchableOpacity onPress={() => setCurrentView('createEvent')}>
            <Ionicons name="add" size={26} color="#002144" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={events}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 20 }}
          renderItem={({ item }) => (
            <View style={styles.joinEventCard}>
              <Image source={{ uri: item.image }} style={styles.joinEventImage} />
              <View style={styles.joinEventInfo}>
                <Text style={styles.joinEventTitle}>{item.title}</Text>
                <Text style={styles.joinEventDate}>{item.date}</Text>
                <Text style={styles.joinEventLocation}>{item.location}</Text>
              </View>
              <TouchableOpacity style={styles.joinBtn}>
                <Text style={styles.joinBtnText}>Join</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </SafeAreaView>
    );
  }

  // ===== MAIN FEED VIEW =====
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* First Post */}
        {postsList.slice(0, 1).map(post => (
          <View key={post.id} style={styles.postCard}>
            <View style={styles.postHeader}>
              <View style={styles.postAvatar}><Text style={styles.postAvatarText}>{post.avatar}</Text></View>
              <View style={styles.postInfo}>
                <Text style={styles.postUserName}>{post.user}</Text>
                <Text style={styles.postSubtitle}>{post.subtitle}</Text>
              </View>
              <TouchableOpacity style={styles.followBtn}>
                <Text style={styles.followBtnText}>+ Follow</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.postContentContainer}>
              <Text style={styles.postContentText}>{post.content}</Text>
            </View>
            <Image source={{ uri: post.image }} style={[styles.postImage, { width: width, height: width * 0.65 }]} />
            <View style={styles.postActions}>
              <View style={styles.leftActions}>
                <TouchableOpacity onPress={() => toggleLike(post.id)}>
                  <Ionicons name={likedPosts[post.id] ? "heart" : "heart-outline"} size={24} color={likedPosts[post.id] ? "#EF4444" : "#0F172A"} />
                </TouchableOpacity>
                <TouchableOpacity><Ionicons name="chatbubble-outline" size={22} color="#0F172A" /></TouchableOpacity>
                <TouchableOpacity onPress={() => setReshareModalVisible(true)}>
                  <Ionicons name="paper-plane-outline" size={22} color="#0F172A" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity><Ionicons name="bookmark-outline" size={22} color="#0F172A" /></TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Suggestions Section */}
        <View style={styles.suggestionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Suggestions for you</Text>
            <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionsScroll}>
            {suggestions.map(s => (
              <View key={s.id} style={styles.suggestionCard}>
                <View style={styles.suggestionAvatar}><Text style={styles.suggestionAvatarText}>{s.avatar}</Text></View>
                <Text style={styles.suggestionName}>{s.name}</Text>
                <TouchableOpacity
                  style={[styles.followSmallBtn, followedSuggestions[s.id] && styles.followedBtn]}
                  onPress={() => setFollowedSuggestions(prev => ({...prev, [s.id]: !prev[s.id]}))}
                >
                  <Text style={[styles.followSmallText, followedSuggestions[s.id] && styles.followedText]}>
                    {followedSuggestions[s.id] ? 'Following' : 'Follow'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Remaining Posts */}
        {postsList.slice(1).map(post => (
          <View key={post.id} style={styles.postCard}>
            <View style={styles.postHeader}>
              <View style={styles.postAvatar}><Text style={styles.postAvatarText}>{post.avatar}</Text></View>
              <View style={styles.postInfo}>
                <Text style={styles.postUserName}>{post.user}</Text>
                <Text style={styles.postSubtitle}>{post.subtitle}</Text>
              </View>
              <TouchableOpacity style={styles.followBtn}>
                <Text style={styles.followBtnText}>+ Follow</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.postContentContainer}>
              <Text style={styles.postContentText}>{post.content}</Text>
            </View>
            <Image source={{ uri: post.image }} style={[styles.postImage, { width: width, height: width * 0.65 }]} />
            <View style={styles.postActions}>
              <View style={styles.leftActions}>
                <TouchableOpacity onPress={() => toggleLike(post.id)}>
                  <Ionicons name={likedPosts[post.id] ? "heart" : "heart-outline"} size={24} color={likedPosts[post.id] ? "#EF4444" : "#0F172A"} />
                </TouchableOpacity>
                <TouchableOpacity><Ionicons name="chatbubble-outline" size={22} color="#0F172A" /></TouchableOpacity>
                <TouchableOpacity onPress={() => setReshareModalVisible(true)}>
                  <Ionicons name="paper-plane-outline" size={22} color="#0F172A" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity><Ionicons name="bookmark-outline" size={22} color="#0F172A" /></TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Rewrite with AI floating button */}
      <TouchableOpacity style={styles.aiFloatingBtn}>
        <Ionicons name="sparkles" size={16} color="#003366" />
        <Text style={styles.aiFloatingText}>Rewrite with AI</Text>
      </TouchableOpacity>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setActionSheetVisible(true)}>
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Action Sheet Modal */}
      <Modal visible={actionSheetVisible} transparent animationType="slide">
        <View style={styles.actionSheetOverlay}>
          <TouchableOpacity style={{ flex: 1 }} onPress={handleDismiss} />
          <View style={styles.actionSheet}>
            <View style={styles.actionSheetHandle} />
            <View style={styles.actionSheetTitleRow}>
              <Text style={styles.actionSheetTitle}>Create New</Text>
            </View>
            <TouchableOpacity style={styles.actionItem} onPress={() => { setActionSheetVisible(false); setCurrentView('writePost'); }}>
              <Ionicons name="create-outline" size={22} color="#003366" style={{ marginRight: 4 }} />
              <Text style={styles.actionItemText}>Post</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem} onPress={() => { setActionSheetVisible(false); setCurrentView('joinEvent'); }}>
              <Ionicons name="calendar-outline" size={22} color="#003366" style={{ marginRight: 4 }} />
              <Text style={styles.actionItemText}>Join Event</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Instagram-style Reshare Modal */}
      <Modal visible={reshareModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setReshareModalVisible(false)} />
          <View style={styles.reshareSheet}>
            <View style={styles.actionSheetHandle} />
            <Text style={styles.reshareTitle}>Share</Text>
            
            {/* Search connection bar */}
            <View style={styles.reshareSearchBar}>
              <Ionicons name="search-outline" size={16} color="#94A3B8" style={{ marginRight: 8 }} />
              <TextInput 
                placeholder="Search connections..." 
                placeholderTextColor="#94A3B8" 
                style={styles.reshareSearchInput}
              />
            </View>

            {/* List of recent posts to reshare to feed */}
            <Text style={styles.reshareSectionHeader}>Reshare Post to Feed</Text>
            {postsList.slice(0, 2).map(post => (
              <View key={post.id} style={styles.reshareRow}>
                <View style={styles.resharePostPreview}>
                  <View style={styles.smallAvatar}><Text style={styles.smallAvatarText}>{post.avatar}</Text></View>
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.reshareUser} numberOfLines={1}>{post.user}</Text>
                    <Text style={styles.reshareContent} numberOfLines={1}>{post.content}</Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.reshareBtn}
                  onPress={() => {
                    setReshareModalVisible(false);
                    const resharedPost = {
                      id: Date.now().toString(),
                      user: 'Abhishek Jaiswal',
                      subtitle: `Reshared from ${post.user}`,
                      avatar: 'AJ',
                      image: post.image,
                      likes: 0,
                      time: 'Just now',
                      content: `🔄 Reshared: "${post.content}"`,
                    };
                    setPostsList([resharedPost, ...postsList]);
                    Alert.alert('Success', 'Post reshared to your feed successfully!');
                  }}
                >
                  <Text style={styles.reshareBtnText}>Reshare</Text>
                </TouchableOpacity>
              </View>
            ))}

            {/* Simulated DM connection list */}
            <Text style={styles.reshareSectionHeader}>Send to Connections</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dmScroll}>
              {[
                { id: '1', name: 'Rohan K.', avatar: 'RK' },
                { id: '2', name: 'Priya S.', avatar: 'PS' },
                { id: '3', name: 'Rahul M.', avatar: 'RM' },
                { id: '4', name: 'Karan G.', avatar: 'KG' },
              ].map(connection => (
                <TouchableOpacity 
                  key={connection.id} 
                  style={styles.dmCard}
                  onPress={() => {
                    setReshareModalVisible(false);
                    Alert.alert('Sent', `Post sent to ${connection.name}`);
                  }}
                >
                  <View style={[styles.suggestionAvatar, { marginBottom: 4 }]}><Text style={styles.suggestionAvatarText}>{connection.avatar}</Text></View>
                  <Text style={styles.dmName}>{connection.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { paddingBottom: 100 },

  // Post Card
  postCard: { backgroundColor: '#FFFFFF', marginBottom: 8, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  postHeader: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  postAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#003366', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  postAvatarText: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
  postInfo: { flex: 1 },
  postUserName: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  postSubtitle: { fontSize: 12, color: '#64748B', marginTop: 1 },
  followBtn: { paddingHorizontal: 12, paddingVertical: 6 },
  followBtnText: { color: '#003366', fontWeight: '700', fontSize: 13 },
  postImage: { backgroundColor: '#F1F5F9' },
  postActions: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 12 },
  leftActions: { flexDirection: 'row', alignItems: 'center', gap: 18 },

  // Suggestions
  suggestionsSection: { backgroundColor: '#FFFFFF', paddingVertical: 16, marginBottom: 8, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 14 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  seeAll: { fontSize: 13, color: '#003366', fontWeight: '600' },
  suggestionsScroll: { paddingHorizontal: 20, gap: 12 },
  suggestionCard: { width: 120, backgroundColor: '#F8FAFC', borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  suggestionAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#64748B', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  suggestionAvatarText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  suggestionName: { fontSize: 13, fontWeight: '600', color: '#0F172A', marginBottom: 8 },
  followSmallBtn: { backgroundColor: '#003366', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 6 },
  followSmallText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  followedBtn: { backgroundColor: '#F1F5F9' },
  followedText: { color: '#64748B' },

  // FAB
  fab: { position: 'absolute', bottom: 20, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: '#003366', justifyContent: 'center', alignItems: 'center', elevation: 6, shadowColor: '#003366', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  aiFloatingBtn: { position: 'absolute', bottom: 24, left: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0', gap: 6, elevation: 3 },
  aiFloatingText: { fontSize: 12, fontWeight: '600', color: '#003366' },

  // Action Sheet
  actionSheetOverlay: { flex: 1, backgroundColor: 'rgba(15,23,42,0.4)', justifyContent: 'flex-end' },
  actionSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingBottom: 40 },
  actionSheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#CBD5E1', alignSelf: 'center', marginTop: 12, marginBottom: 16 },
  actionItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  actionItemText: { fontSize: 16, fontWeight: '600', color: '#0F172A' },

  // Write Post
  writePostHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  writePostHeaderCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  writePostHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  smallAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#003366', justifyContent: 'center', alignItems: 'center' },
  smallAvatarText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  anyoneText: { fontSize: 14, fontWeight: '700', color: '#002144' },
  postButton: { backgroundColor: '#003366', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  postButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  writePostBody: { flex: 1, padding: 20 },
  writePostInput: { fontSize: 16, color: '#002144', lineHeight: 24, flex: 1 },
  writePostFooter: { padding: 20, borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  aiButton: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start', borderWidth: 1, borderColor: '#003366', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  aiButtonText: { fontSize: 13, fontWeight: '600', color: '#003366' },

  // Create Event
  subScreenHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  subScreenTitle: { fontSize: 18, fontWeight: '800', color: '#002144' },
  createEventBody: { padding: 20, paddingBottom: 40 },
  fieldLabel: { fontSize: 14, fontWeight: '600', color: '#475569', marginBottom: 8, marginTop: 16 },
  fieldInput: { backgroundColor: '#F8FAFC', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 16, height: 48, justifyContent: 'center', fontSize: 15, color: '#002144' },
  dateTimeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
  dateField: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F8FAFC', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 16, height: 48, flex: 1, marginRight: 12 },
  colorDots: { flexDirection: 'row', gap: 6 },
  colorDot: { width: 16, height: 16, borderRadius: 8 },
  dateTimeText: { fontSize: 15, color: '#002144', fontWeight: '500' },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12 },
  timeField: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F8FAFC', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 16, height: 48, flex: 1 },
  hostRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  hostAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#003366', justifyContent: 'center', alignItems: 'center' },
  hostAvatarText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  hostName: { fontSize: 15, fontWeight: '600', color: '#002144' },
  notifyRow: { flexDirection: 'row', gap: 10 },
  notifyOption: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#FFFFFF' },
  notifyActive: { backgroundColor: '#003366', borderColor: '#003366' },
  notifyText: { fontSize: 13, fontWeight: '600', color: '#475569' },
  notifyActiveText: { color: '#FFFFFF' },
  createEventButton: { backgroundColor: '#003366', height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  createEventButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },

  // Join Event
  joinEventCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  joinEventImage: { width: 70, height: 70, borderRadius: 8, backgroundColor: '#F1F5F9', marginRight: 12 },
  joinEventInfo: { flex: 1 },
  joinEventTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  joinEventDate: { fontSize: 12, color: '#64748B', marginTop: 2 },
  joinEventLocation: { fontSize: 12, color: '#94A3B8', marginTop: 1 },
  joinBtn: { backgroundColor: '#003366', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  joinBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },

  // Custom alignment styles
  writePostFooterIcons: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  footerIconBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  descriptionWrapper: { position: 'relative', justifyContent: 'flex-end' },
  descPencilIcon: { position: 'absolute', bottom: 16, right: 16 },
  actionSheetTitleRow: { paddingVertical: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  actionSheetTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', textAlign: 'center' },

  // New Modals Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', marginBottom: 10 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#002144' },
  modalItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingHorizontal: 8 },
  modalItemText: { fontSize: 16, fontWeight: '600', color: '#0F172A' },
  selectedModalItem: { backgroundColor: '#F8FAFC' },
  selectedModalItemText: { color: '#003366', fontWeight: '700' },

  reshareSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingBottom: 40, minHeight: 420 },
  reshareTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', textAlign: 'center', marginTop: 16, marginBottom: 16 },
  reshareSearchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 10, paddingHorizontal: 12, height: 38, marginBottom: 16 },
  reshareSearchInput: { flex: 1, fontSize: 14, color: '#0F172A', paddingVertical: 0 },
  reshareSectionHeader: { fontSize: 14, fontWeight: '700', color: '#64748B', marginTop: 12, marginBottom: 10 },
  reshareRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  resharePostPreview: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 12 },
  reshareUser: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  reshareContent: { fontSize: 12, color: '#64748B', marginTop: 2 },
  reshareBtn: { backgroundColor: '#003366', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16 },
  reshareBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  dmScroll: { gap: 12, paddingVertical: 4 },
  dmCard: { alignItems: 'center', width: 70 },
  dmName: { fontSize: 11, color: '#475569', textAlign: 'center', marginTop: 4 },
  postContentContainer: { paddingHorizontal: 14, paddingVertical: 10 },
  postContentText: { fontSize: 14, color: '#0F172A', lineHeight: 20 },
});

export default EngageScreen;
