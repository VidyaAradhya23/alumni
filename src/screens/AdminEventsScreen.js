import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, StatusBar, Alert, Modal, FlatList, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const AdminEventsScreen = ({ navigation, route }) => {
  const isSuperAdmin = route?.params?.isSuperAdmin || false;
  const [selectedInstitution, setSelectedInstitution] = useState('All');
  const [showEditor, setShowEditor] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [commentModalEvent, setCommentModalEvent] = useState(null);
  const [newComment, setNewComment] = useState('');

  // Event form states
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventAttachment, setEventAttachment] = useState(null);

  const [eventList, setEventList] = useState([
    {
      id: 'e1',
      title: 'Alumni Gala Night 2026',
      date: 'Dec 18, 2026',
      location: 'RVITM Campus Auditorium, Bengaluru',
      description: 'Join us for an unforgettable evening celebrating the achievements of our alumni community. Network with fellow graduates, enjoy cultural performances, and participate in the annual awards ceremony.',
      views: 342,
      likes: 87,
      liked: false,
      attachment: 'gala_agenda.pdf',
      comments: [
        { id: 'c1', user: 'Priya S.', text: 'Can\'t wait for this! 🎉', time: '2h ago' },
        { id: 'c2', user: 'Rahul V.', text: 'Will there be online participation?', time: '5h ago' },
      ],
      reshares: 24,
      institution: 'RVCE',
    },
    {
      id: 'e2',
      title: 'Startup Panel Discussion',
      date: 'Jan 15, 2027',
      location: 'Virtual / Zoom',
      description: 'Hear from RVITM alumni who have founded successful startups. Topics include fundraising, scaling, and building a team. Open Q&A session at the end.',
      views: 218,
      likes: 56,
      liked: true,
      attachment: null,
      comments: [
        { id: 'c3', user: 'Arjun R.', text: 'Great lineup of speakers!', time: '1d ago' },
      ],
      reshares: 12,
      institution: 'RVITM',
    },
    {
      id: 'e3',
      title: 'Career Mentorship Workshop',
      date: 'Feb 8, 2027',
      location: 'RVITM Seminar Hall B',
      description: 'A hands-on workshop where senior alumni mentor current students and recent graduates on career planning, resume building, and interview preparation.',
      views: 156,
      likes: 43,
      liked: false,
      attachment: 'mentorship_guidelines.docx',
      comments: [],
      reshares: 8,
      institution: 'RVPU',
    },
  ]);

  const handleLike = (eventId) => {
    setEventList(prev => prev.map(ev => {
      if (ev.id === eventId) {
        return {
          ...ev,
          liked: !ev.liked,
          likes: ev.liked ? ev.likes - 1 : ev.likes + 1,
        };
      }
      return ev;
    }));
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !commentModalEvent) return;
    setEventList(prev => prev.map(ev => {
      if (ev.id === commentModalEvent.id) {
        return {
          ...ev,
          comments: [
            { id: Date.now().toString(), user: 'Admin', text: newComment.trim(), time: 'Just now' },
            ...ev.comments,
          ],
        };
      }
      return ev;
    }));
    setNewComment('');
  };

  const handlePostEvent = () => {
    if (!eventTitle.trim() || !eventDate.trim()) {
      Alert.alert('Required', 'Please fill in at least the title and date.');
      return;
    }
    const newEvent = {
      id: Date.now().toString(),
      title: eventTitle,
      date: eventDate,
      location: eventLocation || 'TBD',
      description: eventDescription || 'No description provided.',
      views: 0,
      likes: 0,
      liked: false,
      comments: [],
      reshares: 0,
      attachment: eventAttachment,
      institution: isSuperAdmin ? selectedInstitution === 'All' ? 'RVCE' : selectedInstitution : 'RVITM',
    };
    setEventList([newEvent, ...eventList]);
    setEventTitle('');
    setEventDate('');
    setEventLocation('');
    setEventDescription('');
    setEventAttachment(null);
    setShowEditor(false);
    Alert.alert('Success', 'Your event has been posted!');
  };

  const handleReshare = (eventTitle) => {
    Alert.alert('Reshared', `"${eventTitle}" has been reshared to your feed.`);
  };

  const handleShare = (eventTitle) => {
    Alert.alert('Share', `Share link for "${eventTitle}" copied to clipboard.`);
  };

  const filteredEvents = useMemo(() => {
    let data = eventList;
    if (isSuperAdmin && selectedInstitution !== 'All') {
      data = data.filter((event) => event.institution === selectedInstitution);
    }
    return data;
  }, [eventList, isSuperAdmin, selectedInstitution]);

  // Get the latest comment data for the modal
  const currentModalEvent = commentModalEvent ? eventList.find(e => e.id === commentModalEvent.id) : null;

  // ===== EVENT DETAIL VIEW =====
  if (selectedEvent) {
    const ev = eventList.find(e => e.id === selectedEvent.id) || selectedEvent;
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.editorHeader}>
          <TouchableOpacity onPress={() => setSelectedEvent(null)}>
            <Ionicons name="arrow-back" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.editorTitleText}>Event Details</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
          <View style={styles.detailTopCard}>
            <View style={styles.detailIconCircle}>
              <Ionicons name="calendar" size={32} color="#003366" />
            </View>
            <Text style={styles.detailTitle}>{ev.title}</Text>
            <View style={styles.detailBadgeRow}>
              <View style={styles.detailBadge}>
                <Ionicons name="calendar-outline" size={14} color="#64748B" style={{marginRight:4}} />
                <Text style={styles.detailBadgeText}>{ev.date}</Text>
              </View>
              <View style={styles.detailBadge}>
                <Ionicons name="location-outline" size={14} color="#64748B" style={{marginRight:4}} />
                <Text style={styles.detailBadgeText}>{ev.location}</Text>
              </View>
            </View>
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.detailSectionTitle}>About this Event</Text>
            <Text style={styles.detailDescText}>{ev.description}</Text>
          </View>

          {ev.attachment && (
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Attachments</Text>
              <View style={styles.attachmentDownloadCard}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <Ionicons name="document-text-outline" size={24} color="#003366" style={{ marginRight: 10 }} />
                  <Text style={styles.attachmentDownloadName} numberOfLines={1}>{ev.attachment}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.downloadIconBtn} 
                  onPress={() => Alert.alert('Downloading', `Downloading ${ev.attachment}...`)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="download-outline" size={20} color="#003366" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.detailStatsRow}>
            <View style={styles.detailStatItem}>
              <Ionicons name="eye-outline" size={20} color="#64748B" />
              <Text style={styles.detailStatValue}>{ev.views}</Text>
              <Text style={styles.detailStatLabel}>Views</Text>
            </View>
            <View style={styles.detailStatItem}>
              <Ionicons name="heart-outline" size={20} color="#EF4444" />
              <Text style={styles.detailStatValue}>{ev.likes}</Text>
              <Text style={styles.detailStatLabel}>Likes</Text>
            </View>
            <View style={styles.detailStatItem}>
              <Ionicons name="chatbubble-outline" size={20} color="#003366" />
              <Text style={styles.detailStatValue}>{ev.comments.length}</Text>
              <Text style={styles.detailStatLabel}>Comments</Text>
            </View>
            <View style={styles.detailStatItem}>
              <Ionicons name="repeat-outline" size={20} color="#16A34A" />
              <Text style={styles.detailStatValue}>{ev.reshares}</Text>
              <Text style={styles.detailStatLabel}>Reshares</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ===== EDITOR VIEW =====
  if (showEditor) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.editorHeader}>
          <TouchableOpacity onPress={() => setShowEditor(false)}>
            <Ionicons name="close" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.editorTitleText}>Create Event</Text>
          <TouchableOpacity style={styles.postBtn} onPress={handlePostEvent}>
            <Text style={styles.postBtnText}>Post</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.editorBody} showsVerticalScrollIndicator={false}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Event Title *</Text>
            <TextInput style={styles.textInput} placeholder="e.g. Alumni Gala Night" placeholderTextColor="#94A3B8" value={eventTitle} onChangeText={setEventTitle} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Date *</Text>
            <TextInput style={styles.textInput} placeholder="e.g. Dec 18, 2026" placeholderTextColor="#94A3B8" value={eventDate} onChangeText={setEventDate} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Location</Text>
            <TextInput style={styles.textInput} placeholder="e.g. RVITM Campus, Bengaluru" placeholderTextColor="#94A3B8" value={eventLocation} onChangeText={setEventLocation} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput style={[styles.textInput, { height: 120, textAlignVertical: 'top' }]} placeholder="Describe your event..." placeholderTextColor="#94A3B8" value={eventDescription} onChangeText={setEventDescription} multiline />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Event Flyer / Attachment</Text>
            {eventAttachment ? (
              <View style={styles.attachmentPreview}>
                <Ionicons name="document-text-outline" size={20} color="#003366" />
                <Text style={styles.attachmentName} numberOfLines={1}>{eventAttachment}</Text>
                <TouchableOpacity onPress={() => setEventAttachment(null)}>
                  <Ionicons name="close-circle" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.attachBtn}
                activeOpacity={0.7}
                onPress={() => {
                  Alert.alert('Attach File', 'Select a file to attach:', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'event_flyer.pdf', onPress: () => setEventAttachment('event_flyer.pdf') },
                    { text: 'campus_map.png', onPress: () => setEventAttachment('campus_map.png') },
                    { text: 'agenda.docx', onPress: () => setEventAttachment('agenda.docx') },
                  ]);
                }}
              >
                <Ionicons name="attach" size={20} color="#003366" style={{ marginRight: 6 }} />
                <Text style={styles.attachBtnText}>Attach Document/Image</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ===== MAIN LIST VIEW =====
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerAvatar} activeOpacity={0.8} onPress={() => navigation && navigation.navigate('AdminProfile')}>
          <Text style={styles.headerAvatarText}>AD</Text>
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#94A3B8" style={{ marginRight: 6 }} />
          <Text style={styles.searchPlaceholder}>Search events</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.headerIconBtn} onPress={() => navigation && navigation.navigate('Messages')}>
            <Ionicons name="chatbubble-ellipses-outline" size={22} color="#003366" />
            <View style={styles.dot} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconBtn} onPress={() => navigation && navigation.navigate('Notifications')}>
            <Ionicons name="notifications-outline" size={22} color="#003366" />
            <View style={styles.dot} />
          </TouchableOpacity>
        </View>
      </View>
      {isSuperAdmin && (
        <View style={styles.superAdminSelector}>
          <Text style={styles.selectorLabel}>Institution:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectorScroll}>
            {['All', 'RVCE', 'RVITM', 'RVPU', 'RVIS'].map((inst) => (
              <TouchableOpacity
                key={inst}
                style={[
                  styles.selectorChip,
                  selectedInstitution === inst && styles.selectorChipActive
                ]}
                onPress={() => setSelectedInstitution(inst)}
              >
                <Text style={[
                  styles.selectorChipText,
                  selectedInstitution === inst && styles.selectorChipTextActive
                ]}>{inst}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <FlatList
        data={filteredEvents}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            {/* Event Info */}
            <TouchableOpacity activeOpacity={0.8} onPress={() => setSelectedEvent(item)}>
              <View style={styles.eventCardHeader}>
                <View style={styles.eventIconCircle}>
                  <Ionicons name="calendar" size={20} color="#003366" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.eventTitle}>{item.title}</Text>
                  <Text style={styles.eventMeta}>{item.date} • {item.location}</Text>
                </View>
              </View>
              <Text style={styles.eventDesc} numberOfLines={2}>{item.description}</Text>
            </TouchableOpacity>

            {/* Social Interaction Row */}
            <View style={styles.socialRow}>
              <View style={styles.socialItem}>
                <Ionicons name="eye-outline" size={18} color="#64748B" />
                <Text style={styles.socialText}>{item.views}</Text>
              </View>

              <TouchableOpacity style={styles.socialItem} onPress={() => handleLike(item.id)}>
                <Ionicons name={item.liked ? "heart" : "heart-outline"} size={18} color={item.liked ? "#EF4444" : "#64748B"} />
                <Text style={[styles.socialText, item.liked && { color: '#EF4444' }]}>{item.likes}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialItem} onPress={() => setCommentModalEvent(item)}>
                <Ionicons name="chatbubble-outline" size={18} color="#64748B" />
                <Text style={styles.socialText}>{item.comments.length}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialItem} onPress={() => handleReshare(item.title)}>
                <Ionicons name="repeat-outline" size={18} color="#64748B" />
                <Text style={styles.socialText}>{item.reshares}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialItem} onPress={() => handleShare(item.title)}>
                <Ionicons name="share-social-outline" size={18} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>No Events Yet</Text>
            <Text style={styles.emptySubtitle}>Tap the button below to create your first event.</Text>
          </View>
        }
      />

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowEditor(true)} activeOpacity={0.85}>
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Comment Modal */}
      <Modal visible={!!commentModalEvent} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => { setCommentModalEvent(null); setNewComment(''); }} />
          <View style={styles.commentModal}>
            <View style={styles.commentModalHeader}>
              <Text style={styles.commentModalTitle}>Comments</Text>
              <TouchableOpacity onPress={() => { setCommentModalEvent(null); setNewComment(''); }}>
                <Ionicons name="close" size={24} color="#0F172A" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.commentList}>
              {currentModalEvent && currentModalEvent.comments.length > 0 ? (
                currentModalEvent.comments.map(c => (
                  <View key={c.id} style={styles.commentItem}>
                    <View style={styles.commentAvatar}>
                      <Text style={styles.commentAvatarText}>{c.user.charAt(0)}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.commentUser}>{c.user} <Text style={styles.commentTime}>{c.time}</Text></Text>
                      <Text style={styles.commentText}>{c.text}</Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.noComments}>No comments yet. Be the first!</Text>
              )}
            </ScrollView>

            <View style={styles.commentInputRow}>
              <TextInput
                style={styles.commentInput}
                placeholder="Add a comment..."
                placeholderTextColor="#94A3B8"
                value={newComment}
                onChangeText={setNewComment}
              />
              <TouchableOpacity style={styles.commentSendBtn} onPress={handleAddComment}>
                <Ionicons name="send" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#003366', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  headerAvatarText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 10, paddingHorizontal: 12, height: 36 },
  searchPlaceholder: { color: '#94A3B8', fontSize: 14 },
  headerIcons: { flexDirection: 'row', alignItems: 'center', marginLeft: 10 },
  headerIconBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center', marginLeft: 4 },
  dot: { position: 'absolute', top: 6, right: 6, width: 7, height: 7, borderRadius: 4, backgroundColor: '#EF4444' },
  listContent: { padding: 16, paddingBottom: 100 },
  eventCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 },
  eventCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  eventIconCircle: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F0F9FF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  eventTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  eventMeta: { fontSize: 12, color: '#64748B', marginTop: 2 },
  eventDesc: { fontSize: 13, color: '#475569', lineHeight: 19, marginBottom: 14 },
  socialRow: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 12 },
  socialItem: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
  socialText: { fontSize: 13, color: '#64748B', fontWeight: '600', marginLeft: 5 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#94A3B8', marginTop: 12 },
  emptySubtitle: { fontSize: 13, color: '#CBD5E1', marginTop: 4, textAlign: 'center' },
  fab: { position: 'absolute', bottom: 24, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: '#003366', justifyContent: 'center', alignItems: 'center', shadowColor: '#003366', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  editorHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  editorTitleText: { fontSize: 17, fontWeight: '700', color: '#0F172A' },
  postBtn: { backgroundColor: '#003366', paddingHorizontal: 18, paddingVertical: 8, borderRadius: 8 },
  postBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  editorBody: { flex: 1, padding: 20 },
  inputGroup: { marginBottom: 18 },
  inputLabel: { fontSize: 13, fontWeight: '700', color: '#475569', marginBottom: 8 },
  textInput: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 16, height: 48, fontSize: 15, color: '#0F172A' },
  // Detail View
  detailTopCard: { alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 24, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  detailIconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#F0F9FF', justifyContent: 'center', alignItems: 'center', marginBottom: 16, borderWidth: 2, borderColor: '#E0F2FE' },
  detailTitle: { fontSize: 20, fontWeight: '800', color: '#0F172A', textAlign: 'center', marginBottom: 12 },
  detailBadgeRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  detailBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, marginRight: 8, marginBottom: 6, borderWidth: 1, borderColor: '#E2E8F0' },
  detailBadgeText: { fontSize: 12, color: '#64748B', fontWeight: '600' },
  detailSection: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  detailSectionTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 10 },
  detailDescText: { fontSize: 14, color: '#475569', lineHeight: 22 },
  detailStatsRow: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  detailStatItem: { alignItems: 'center' },
  detailStatValue: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginTop: 4 },
  detailStatLabel: { fontSize: 11, color: '#94A3B8', fontWeight: '600', marginTop: 2 },
  // Attachment Styles
  attachBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#003366',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 14,
    backgroundColor: '#F8FAFC',
  },
  attachBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#003366',
  },
  attachmentPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  attachmentName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#003366',
    marginLeft: 8,
  },
  attachmentDownloadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  attachmentDownloadName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  downloadIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Comment Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  commentModal: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '70%', minHeight: 300 },
  commentModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  commentModalTitle: { fontSize: 17, fontWeight: '700', color: '#0F172A' },
  commentList: { padding: 16, maxHeight: 300 },
  commentItem: { flexDirection: 'row', marginBottom: 16 },
  commentAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  commentAvatarText: { fontSize: 14, fontWeight: '700', color: '#64748B' },
  commentUser: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  commentTime: { fontSize: 11, fontWeight: '500', color: '#94A3B8' },
  commentText: { fontSize: 13, color: '#475569', marginTop: 2, lineHeight: 18 },
  noComments: { textAlign: 'center', color: '#94A3B8', fontSize: 14, paddingVertical: 30 },
  commentInputRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  commentInput: { flex: 1, backgroundColor: '#F1F5F9', borderRadius: 20, paddingHorizontal: 16, height: 40, fontSize: 14, color: '#0F172A', marginRight: 10 },
  commentSendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#003366', justifyContent: 'center', alignItems: 'center' },
  superAdminSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
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
});

export default AdminEventsScreen;
