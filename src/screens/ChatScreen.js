import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StatusBar, Image, Alert, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { getConversation, sendMessage as sendApiMessage } from '../services/messageService';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

const ChatScreen = ({ route, navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const styles = getStyles(theme);

  const { user } = route?.params || {};
  
  // Default fallback if someone opens this without a user
  const chatUser = user || { name: 'Unknown User', role: '', initials: '?' };

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [pendingAttachment, setPendingAttachment] = useState(null); // { url, type, name }
  const [previewImageModal, setPreviewImageModal] = useState(null);
  const flatListRef = useRef(null);

  const storageKey = `chat_messages_${chatUser.id || 'default'}`;

  useEffect(() => {
    AsyncStorage.getItem('userInfo').then(raw => {
      if (raw) {
        try {
          const info = JSON.parse(raw);
          if (info._id || info.id) {
            setCurrentUserId((info._id || info.id).toString());
          }
        } catch (e) {}
      }
    });
  }, []);

  const getIsMe = (item) => {
    if (item.sender === 'me') return true;
    const senderIdStr = typeof item.sender === 'object' ? (item.sender?._id || item.sender?.id) : item.sender;
    if (!senderIdStr) return false;
    
    if (currentUserId && senderIdStr.toString() === currentUserId.toString()) {
      return true;
    }
    
    const chatUserIdStr = (chatUser.id || chatUser._id || '').toString();
    if (chatUserIdStr && senderIdStr.toString() !== chatUserIdStr.toString()) {
      return true;
    }
    
    return false;
  };

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
              const map = new Map();
              prev.forEach(m => {
                const k = (m._id || m.id || '').toString();
                if (k) map.set(k, m);
              });
              msgs.forEach(m => {
                const k = (m._id || m.id || '').toString();
                if (k) map.set(k, m);
              });
              const merged = Array.from(map.values()).sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
              AsyncStorage.setItem(storageKey, JSON.stringify(merged)).catch(() => {});
              return merged;
            });
          } else {
            setMessages([]);
            AsyncStorage.removeItem(storageKey).catch(() => {});
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

  const handlePickImage = async () => {
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            setPendingAttachment({
              url: event.target.result,
              type: 'image',
              name: file.name || 'Image'
            });
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
      return;
    }

    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        const dataUrl = asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri;
        setPendingAttachment({
          url: dataUrl,
          type: 'image',
          name: asset.fileName || 'Image'
        });
      }
    } catch (err) {
      console.log('Image picker error:', err);
    }
  };

  const handlePickDocument = async () => {
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '*/*';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const isImg = file.type.startsWith('image/');
            setPendingAttachment({
              url: event.target.result,
              type: isImg ? 'image' : 'document',
              name: file.name || 'Document'
            });
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
      return;
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        const isImg = asset.mimeType && asset.mimeType.startsWith('image/');
        setPendingAttachment({
          url: asset.uri,
          type: isImg ? 'image' : 'document',
          name: asset.name || 'Document'
        });
      }
    } catch (err) {
      console.log('Document picker error:', err);
    }
  };

  const sendMessage = async () => {
    if ((!inputText.trim() && !pendingAttachment) || !chatUser.id) return;
    const textToSend = inputText.trim();
    const attachmentToSend = pendingAttachment;

    setInputText('');
    setPendingAttachment(null);
    setIsEmojiPickerVisible(false);
    
    // Optimistic UI update
    const optimisticMsg = { 
      _id: Date.now().toString(), 
      text: textToSend, 
      attachment: attachmentToSend,
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
      const realMsg = await sendApiMessage(chatUser.id, textToSend, attachmentToSend);
      if (realMsg) {
        setMessages(prev => {
          const updated = prev.map(m => (m._id === optimisticMsg._id || m.id === optimisticMsg._id) ? realMsg : m);
          AsyncStorage.setItem(storageKey, JSON.stringify(updated)).catch(() => {});
          return updated;
        });
      }
    } catch(err) {
      console.log('Failed to send msg to server:', err);
    }
  };

  const renderMessageAttachment = (attachment, isMe) => {
    if (!attachment || !attachment.url) return null;

    if (attachment.type === 'image') {
      return (
        <TouchableOpacity 
          style={{ marginBottom: 6, borderRadius: 12, overflow: 'hidden' }}
          activeOpacity={0.9}
          onPress={() => setPreviewImageModal(attachment.url)}
        >
          <Image 
            source={{ uri: attachment.url }} 
            style={{ width: 210, height: 160, borderRadius: 12, backgroundColor: '#E2E8F0' }} 
            resizeMode="cover" 
          />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity 
        style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          backgroundColor: isMe ? 'rgba(255,255,255,0.15)' : '#F1F5F9', 
          padding: 10, 
          borderRadius: 10, 
          marginBottom: 6,
          borderWidth: 1,
          borderColor: isMe ? 'rgba(255,255,255,0.3)' : '#CBD5E1'
        }}
        onPress={() => {
          if (attachment.url.startsWith('http') || attachment.url.startsWith('data:')) {
            if (Platform.OS === 'web') {
              window.open(attachment.url, '_blank');
            } else {
              Linking.openURL(attachment.url).catch(() => {});
            }
          }
        }}
      >
        <Ionicons name="document-text" size={24} color={isMe ? '#FFFFFF' : '#003366'} style={{ marginRight: 8 }} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: isMe ? '#FFFFFF' : '#1E293B' }} numberOfLines={1}>
            {attachment.name || 'Attachment File'}
          </Text>
          <Text style={{ fontSize: 11, color: isMe ? 'rgba(255,255,255,0.8)' : '#64748B' }}>
            Tap to open
          </Text>
        </View>
        <Ionicons name="download-outline" size={18} color={isMe ? '#FFFFFF' : '#003366'} />
      </TouchableOpacity>
    );
  };

  const renderMessage = ({ item }) => {
    const senderIdStr = typeof item.sender === 'object' ? (item.sender._id || item.sender.id) : item.sender;
    const chatUserIdStr = (chatUser.id || chatUser._id || '').toString();

    const isMe = item.sender === 'me' || (senderIdStr && senderIdStr.toString() !== chatUserIdStr);
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

  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState({});
  const [isTyping, setIsTyping] = useState(false);

  const addEmoji = (emoji) => {
    setInputText(prev => prev + emoji);
    setIsEmojiPickerVisible(false);
  };

  const handleReaction = (msgId, emoji) => {
    setSelectedReaction(prev => ({ ...prev, [msgId]: emoji }));
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
            <Text style={[styles.headerRole, { color: '#10B981', fontWeight: '600' }]} numberOfLines={1}>
              {inputText.trim().length > 0 ? 'typing...' : 'Online'}
            </Text>
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
          renderItem={({ item }) => {
            const isMe = getIsMe(item);
            const msgId = item._id || item.id;
            const reaction = selectedReaction[msgId];

            return (
              <View style={[styles.messageWrapper, isMe ? styles.messageWrapperMe : styles.messageWrapperThem]}>
                {!isMe && (
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{chatUser.initials}</Text>
                  </View>
                )}
                <View style={{ maxWidth: '78%' }}>
                  <View style={[styles.messageBubble, isMe ? styles.messageBubbleMe : styles.messageBubbleThem]}>
                    {renderMessageAttachment(item.attachment, isMe)}
                    {item.text ? (
                      <Text style={[styles.messageText, isMe ? styles.messageTextMe : styles.messageTextThem]}>{item.text}</Text>
                    ) : null}
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

                  {/* Reaction badge */}
                  {reaction ? (
                    <View style={[{ alignSelf: isMe ? 'flex-end' : 'flex-start', marginTop: -8, backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 6, paddingVertical: 2, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 }]}>
                      <Text style={{ fontSize: 12 }}>{reaction}</Text>
                    </View>
                  ) : (
                    <View style={{ flexDirection: 'row', alignSelf: isMe ? 'flex-end' : 'flex-start', marginTop: 2, gap: 8 }}>
                      <TouchableOpacity onPress={() => handleReaction(msgId, '❤️')} activeOpacity={0.6}>
                        <Text style={{ fontSize: 10, opacity: 0.5 }}>❤️</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleReaction(msgId, '👍')} activeOpacity={0.6}>
                        <Text style={{ fontSize: 10, opacity: 0.5 }}>👍</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleReaction(msgId, '🔥')} activeOpacity={0.6}>
                        <Text style={{ fontSize: 10, opacity: 0.5 }}>🔥</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            );
          }}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
        />

        {/* Pending Attachment Preview Bar */}
        {pendingAttachment && (
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6FF', paddingHorizontal: 16, paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#DBEAFE' }}>
            {pendingAttachment.type === 'image' ? (
              <Image source={{ uri: pendingAttachment.url }} style={{ width: 44, height: 44, borderRadius: 8, marginRight: 10 }} />
            ) : (
              <View style={{ width: 44, height: 44, borderRadius: 8, backgroundColor: '#003366', justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
                <Ionicons name="document-text" size={22} color="#FFFFFF" />
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#003366' }} numberOfLines={1}>
                {pendingAttachment.name || 'Attachment attached'}
              </Text>
              <Text style={{ fontSize: 11, color: '#64748B' }}>Ready to send</Text>
            </View>
            <TouchableOpacity onPress={() => setPendingAttachment(null)} style={{ padding: 4 }}>
              <Ionicons name="close-circle" size={22} color="#EF4444" />
            </TouchableOpacity>
          </View>
        )}

        {/* Emoji Quick Picker Row */}
        {isEmojiPickerVisible && (
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', backgroundColor: isDarkMode ? '#1E293B' : '#F1F5F9', paddingVertical: 8, borderTopWidth: 1, borderColor: '#E2E8F0' }}>
            {['😊', '❤️', '👍', '🔥', '🎉', '😂', '👏', '🙏'].map((emoji) => (
              <TouchableOpacity key={emoji} onPress={() => addEmoji(emoji)} style={{ padding: 6 }}>
                <Text style={{ fontSize: 22 }}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Responsive Input Area */}
        <View style={styles.inputArea}>
          <TouchableOpacity style={styles.attachBtn} onPress={() => setIsEmojiPickerVisible(!isEmojiPickerVisible)}>
            <Ionicons name={isEmojiPickerVisible ? "close-circle-outline" : "happy-outline"} size={24} color={isEmojiPickerVisible ? "#3B82F6" : "#64748B"} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.attachBtn} onPress={handlePickImage}>
            <Ionicons name="image-outline" size={22} color="#003366" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.attachBtn} onPress={handlePickDocument}>
            <Ionicons name="attach-outline" size={24} color="#003366" />
          </TouchableOpacity>

          <TextInput
            style={styles.textInput}
            placeholder="Type a message or attach files..."
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
            style={[styles.sendBtn, (inputText.trim().length > 0 || pendingAttachment) && styles.sendBtnActive]} 
            onPress={sendMessage}
            disabled={!inputText.trim() && !pendingAttachment}
          >
            <Ionicons name="send" size={16} color="#FFFFFF" style={{ marginLeft: 2 }} />
          </TouchableOpacity>
        </View>

        {/* Image Full Preview Modal */}
        {previewImageModal && (
          <TouchableOpacity 
            style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center', zIndex: 999 }}
            activeOpacity={1}
            onPress={() => setPreviewImageModal(null)}
          >
            <TouchableOpacity 
              style={{ position: 'absolute', top: 40, right: 20, zIndex: 1000 }}
              onPress={() => setPreviewImageModal(null)}
            >
              <Ionicons name="close" size={32} color="#FFFFFF" />
            </TouchableOpacity>
            <Image 
              source={{ uri: previewImageModal }} 
              style={{ width: '90%', height: '80%' }} 
              resizeMode="contain" 
            />
          </TouchableOpacity>
        )}
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
