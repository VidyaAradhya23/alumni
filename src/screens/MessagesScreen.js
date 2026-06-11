import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, TextInput, StatusBar, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const initialChats = [
  {
    id: '1',
    name: 'Rahul Murthy',
    role: 'SDE-3 @ Google',
    lastMessage: "Sure, let's connect this weekend for the referral discussion.",
    time: '10:30 AM',
    unread: 2,
    initials: 'RM',
    online: true,
  },
  {
    id: '2',
    name: 'Sneha Kapur',
    role: 'Product Manager @ MSFT',
    lastMessage: 'The alumni event was amazing! See you next time.',
    time: 'Yesterday',
    unread: 0,
    initials: 'SK',
    online: true,
  },
  {
    id: '3',
    name: 'Placement Cell',
    role: 'Official Coordinator',
    lastMessage: 'Please update your professional details for the yearly audit.',
    time: 'Wed',
    unread: 0,
    initials: 'PC',
    online: false,
  },
  {
    id: '4',
    name: 'Amit Shah',
    role: 'Entrepreneur (Batch 2008)',
    lastMessage: 'Can you mentor some of our junior students in Cloud Architecture?',
    time: 'Mon',
    unread: 1,
    initials: 'AS',
    online: false,
  }
];

const MessagesScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [chatList, setChatList] = useState(initialChats);

  const filteredChats = chatList.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [composeModalVisible, setComposeModalVisible] = useState(false);
  const [composeSearch, setComposeSearch] = useState('');

  const startNewChat = () => {
    if (!composeSearch.trim()) return;
    const newUser = { 
      id: Date.now().toString(), 
      name: composeSearch.trim(), 
      role: 'Alumni', 
      lastMessage: '', 
      time: 'Now', 
      unread: 0, 
      initials: composeSearch.trim().charAt(0).toUpperCase(), 
      online: true 
    };
    setChatList([newUser, ...chatList]);
    setComposeModalVisible(false);
    setComposeSearch('');
    navigation.navigate('Chat', { user: newUser });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header with Back Button */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#002144" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Direct Messages</Text>
        </View>
        <TouchableOpacity style={styles.createBtn} activeOpacity={0.6} onPress={() => setComposeModalVisible(true)}>
          <Ionicons name="create-outline" size={24} color="#003366" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#94A3B8" />
          <TextInput 
            placeholder="Search contacts or chats..." 
            style={styles.searchInput}
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {filteredChats.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="chatbubbles-outline" size={64} color="#CBD5E1" />
          <Text style={styles.emptyTitle}>No Chats Found</Text>
          <Text style={styles.emptySubtitle}>Try searching for a different name or message content.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredChats}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.chatItem} 
              activeOpacity={0.7}
              onPress={() => {
                const updated = chatList.map(c => c.id === item.id ? { ...c, unread: 0 } : c);
                setChatList(updated);
                navigation.navigate('Chat', { user: item });
              }}
            >
              <View style={styles.avatarWrapper}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{item.initials}</Text>
                </View>
                {item.online && <View style={styles.onlineDot} />}
              </View>
              
              <View style={styles.chatInfo}>
                <View style={styles.chatHeader}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={[styles.time, item.unread > 0 && styles.unreadTime]}>{item.time}</Text>
                </View>
                <Text style={styles.role}>{item.role}</Text>
                <View style={styles.messageRow}>
                  <Text 
                    style={[
                      styles.lastMessage, 
                      item.unread > 0 && styles.unreadLastMessage
                    ]} 
                    numberOfLines={1}
                  >
                    {item.lastMessage}
                  </Text>
                  {item.unread > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>{item.unread}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}

      {/* Compose Message Modal */}
      <Modal visible={composeModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Message</Text>
              <TouchableOpacity onPress={() => setComposeModalVisible(false)}>
                <Text style={styles.closeButton}>Cancel</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.modalLabel}>Search Name to Start Chat:</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter name (e.g., John Doe)"
                value={composeSearch}
                onChangeText={setComposeSearch}
                autoFocus
              />
              <TouchableOpacity 
                style={[styles.modalStartBtn, !composeSearch.trim() && { opacity: 0.5 }]} 
                onPress={startNewChat}
                disabled={!composeSearch.trim()}
              >
                <Text style={styles.modalStartBtnText}>Start Chat</Text>
              </TouchableOpacity>
            </View>
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
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#002144',
    letterSpacing: -0.5,
  },
  createBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    marginLeft: 8,
  },
  chatItem: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#003366',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  name: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  time: {
    fontSize: 12,
    color: '#94A3B8',
  },
  unreadTime: {
    color: '#003366',
    fontWeight: '700',
  },
  role: {
    fontSize: 12,
    color: '#003366',
    fontWeight: '600',
    marginBottom: 4,
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 13.5,
    color: '#64748B',
    flex: 1,
    marginRight: 10,
  },
  unreadLastMessage: {
    color: '#0F172A',
    fontWeight: '600',
  },
  unreadBadge: {
    backgroundColor: '#EF4444',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#475569',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13.5,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 300,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  closeButton: {
    color: '#003366',
    fontWeight: '600',
  },
  modalBody: {
    padding: 20,
  },
  modalLabel: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#0F172A',
    marginBottom: 20,
  },
  modalStartBtn: {
    backgroundColor: '#003366',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalStartBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  }
});

export default MessagesScreen;
