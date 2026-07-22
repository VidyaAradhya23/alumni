import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { getConversation, sendMessage as sendApiMessage } from '../services/messageService';

const ChatScreen = ({ route, navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const styles = getStyles(theme);

  const { user } = route?.params || {};
  
  // Default fallback if someone opens this without a user
  const chatUser = user || { name: 'Unknown User', role: '', initials: '?' };

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);

  const storageKey = `chat_messages_${chatUser.id || 'default'}`;

  useEffect(() => {
    let isMounted = true;
    
    // Immediately load locally saved messages from AsyncStorage on refresh/mount
    const loadCachedMessages = async () => {
      try {
        const cached = await AsyncStorage.getItem(storageKey);
        if (cached && isMounted) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed);
          }
        }
      } catch (err) {
        console.log('Error loading local cached messages:', err);
      }
    };

    loadCachedMessages();

    // Fetch live messages from server & update local storage
    const fetchMsgs = async () => {
      if (!chatUser.id) return;
      try {
        const msgs = await getConversation(chatUser.id);
        if (msgs && Array.isArray(msgs) && isMounted) {
          if (msgs.length > 0) {
            setMessages(prev => {
              // Merge live server msgs with local optimistic msgs to ensure nothing is lost
              const map = new Map();
              prev.forEach(m => map.set(m._id || m.id, m));
              msgs.forEach(m => map.set(m._id || m.id, m));
              const merged = Array.from(map.values()).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
              AsyncStorage.setItem(storageKey, JSON.stringify(merged)).catch(() => {});
              return merged;
            });
          }
        }
      } catch(err) {
        console.log('Failed to load live chat:', err);
      }
    };

    fetchMsgs();
    const interval = setInterval(fetchMsgs, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [chatUser.id]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  const sendMessage = async () => {
    if (!inputText.trim() || !chatUser.id) return;
    const textToSend = inputText.trim();
    setInputText('');
    
    // Optimistic UI update
    const optimisticMsg = { 
      _id: Date.now().toString(), 
      text: textToSend, 
      sender: 'me',
      read: false,
      createdAt: new Date().toISOString()
    };
    
    setMessages(prev => {
      const updated = [...prev, optimisticMsg];
      AsyncStorage.setItem(storageKey, JSON.stringify(updated)).catch(() => {});
      return updated;
    });
    
    try {
      const realMsg = await sendApiMessage(chatUser.id, textToSend);
      if (realMsg) {
        setMessages(prev => {
          const updated = prev.map(m => m._id === optimisticMsg._id ? realMsg : m);
          AsyncStorage.setItem(storageKey, JSON.stringify(updated)).catch(() => {});
          return updated;
        });
      }
    } catch(err) {
      console.log('Failed to send msg to server:', err);
    }
  };

  const renderMessage = ({ item }) => {
    const isMe = item.sender === 'me' || (item.sender !== chatUser.id && item.sender?._id !== chatUser.id);
    return (
      <View style={[styles.messageWrapper, isMe ? styles.messageWrapperMe : styles.messageWrapperThem]}>
        {!isMe && (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{chatUser.initials}</Text>
          </View>
        )}
        <View style={[styles.messageBubble, isMe ? styles.messageBubbleMe : styles.messageBubbleThem]}>
          <Text style={[styles.messageText, isMe ? styles.messageTextMe : styles.messageTextThem]}>{item.text}</Text>
          <View style={styles.messageMeta}>
            <Text style={[styles.messageTime, isMe ? styles.messageTimeMe : styles.messageTimeThem]}>
              {item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
            </Text>
            {isMe && (
              <Ionicons 
                name={item.read ? "checkmark-done" : "checkmark-done-outline"} 
                size={14} 
                color={item.read ? "#60A5FA" : "rgba(255,255,255,0.7)"} 
                style={{ marginLeft: 4 }} 
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  const isWeb = Platform.OS === 'web';
  const webContainerStyle = isWeb ? { alignSelf: 'center', width: '100%', maxWidth: 800, flex: 1 } : { flex: 1 };

  return (
    <SafeAreaView style={styles.container}>
      <View style={webContainerStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      {/* Responsive Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('Messages');
            }
          }} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#002144" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
          activeOpacity={0.8}
          onPress={() => {
            if (chatUser.id) {
              navigation.navigate('Profile', { userId: chatUser.id });
            }
          }}
        >
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>{chatUser.initials}</Text>
            <View style={styles.onlineStatusDot} />
          </View>
          <View style={styles.headerUserInfo}>
            <Text style={styles.headerName} numberOfLines={1}>{chatUser.name}</Text>
            {!!chatUser.role && <Text style={styles.headerRole} numberOfLines={1}>{chatUser.role}</Text>}
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.infoButton} onPress={() => {
          if (chatUser.id) {
            navigation.navigate('Profile', { userId: chatUser.id });
          }
        }}>
          <Ionicons name="information-circle-outline" size={24} color="#003366" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardAvoid} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item._id || item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
        />

        {/* Responsive Input Area */}
        <View style={styles.inputArea}>
          <TouchableOpacity style={styles.attachBtn}>
            <Ionicons name="happy-outline" size={24} color="#64748B" />
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            placeholderTextColor="#94A3B8"
            value={inputText}
            onChangeText={setInputText}
            multiline
            onKeyPress={(e) => {
              if (Platform.OS === 'web' && e.nativeEvent.key === 'Enter' && !e.nativeEvent.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <TouchableOpacity 
            style={[styles.sendBtn, inputText.trim().length > 0 && styles.sendBtnActive]} 
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <Ionicons name="send" size={16} color="#FFFFFF" style={{ marginLeft: 2 }} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
    </SafeAreaView>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: theme.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  backButton: {
    padding: 4,
    marginRight: 6,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#003366',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    position: 'relative',
  },
  onlineStatusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  headerAvatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  headerUserInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 15.5,
    fontWeight: '700',
    color: theme.text,
  },
  headerRole: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '600',
  },
  infoButton: {
    padding: 4,
  },
  keyboardAvoid: {
    flex: 1,
  },
  messageList: {
    padding: 16,
    paddingBottom: 24,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  messageWrapperMe: {
    justifyContent: 'flex-end',
  },
  messageWrapperThem: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: {
    color: theme.card,
    fontSize: 10,
    fontWeight: '700',
  },
  messageBubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  messageBubbleMe: {
    backgroundColor: '#003366',
    borderBottomRightRadius: 4,
  },
  messageBubbleThem: {
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14.5,
    lineHeight: 20,
  },
  messageTextMe: {
    color: '#FFFFFF',
  },
  messageTextThem: {
    color: theme.text,
  },
  messageMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  messageTime: {
    fontSize: 10,
  },
  messageTimeMe: {
    color: 'rgba(255,255,255,0.7)',
  },
  messageTimeThem: {
    color: theme.textMuted,
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: theme.card,
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  attachBtn: {
    padding: 6,
    marginRight: 2,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 8,
    maxHeight: 100,
    fontSize: 14.5,
    color: theme.text,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.textMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
    marginBottom: 1,
  },
  sendBtnActive: {
    backgroundColor: '#003366',
  }
});

export default ChatScreen;
