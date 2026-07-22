import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
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

  useEffect(() => {
    const fetchMsgs = async () => {
      if (!chatUser.id) return;
      try {
        const msgs = await getConversation(chatUser.id);
        if (msgs) setMessages(msgs);
      } catch(err) {
        console.log('Failed to load chat:', err);
      }
    };
    fetchMsgs();
  }, [chatUser.id]);

  const sendMessage = async () => {
    if (!inputText.trim() || !chatUser.id) return;
    const textToSend = inputText.trim();
    setInputText('');
    
    // Optimistic UI update
    const optimisticMsg = { 
      _id: Date.now().toString(), 
      text: textToSend, 
      sender: 'me', // placeholder for me
      createdAt: new Date().toISOString()
    };
    setMessages([...messages, optimisticMsg]);
    
    try {
      const realMsg = await sendApiMessage(chatUser.id, textToSend);
      // Replace optimistic msg with real one if needed, or just let it be
      setMessages(prev => prev.map(m => m._id === optimisticMsg._id ? realMsg : m));
    } catch(err) {
      console.log('Failed to send msg:', err);
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
          <Text style={[styles.messageTime, isMe ? styles.messageTimeMe : styles.messageTimeThem]}>
            {item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
          </Text>
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
      
      {/* Header */}
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
        <View style={styles.headerUserInfo}>
          <Text style={styles.headerName}>{chatUser.name}</Text>
          <Text style={styles.headerRole}>{chatUser.role}</Text>
        </View>
        <TouchableOpacity style={styles.infoButton}>
          <Ionicons name="information-circle-outline" size={24} color="#003366" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardAvoid} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          data={messages}
          keyExtractor={item => item._id || item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
        />

        {/* Input Area */}
        <View style={styles.inputArea}>
          <TouchableOpacity style={styles.attachBtn}>
            <Ionicons name="add" size={26} color="#64748B" />
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            placeholderTextColor="#94A3B8"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendBtn, inputText.trim().length > 0 && styles.sendBtnActive]} 
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <Ionicons name="send" size={18} color="#FFFFFF" style={{ marginLeft: 2 }} />
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
    paddingVertical: 12,
    backgroundColor: theme.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  backButton: {
    padding: 4,
    marginRight: 8,
  },
  headerUserInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.text,
  },
  headerRole: {
    fontSize: 12,
    color: theme.textSecondary,
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
    marginBottom: 16,
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
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  messageBubbleMe: {
    backgroundColor: theme.primary,
    borderBottomRightRadius: 4,
  },
  messageBubbleThem: {
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  messageTextMe: {
    color: theme.card,
  },
  messageTextThem: {
    color: theme.text,
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
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
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: theme.card,
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  attachBtn: {
    padding: 8,
    marginRight: 4,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    maxHeight: 100,
    fontSize: 14,
    color: theme.text,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.textMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    marginBottom: 2,
  },
  sendBtnActive: {
    backgroundColor: theme.primary,
  }
});

export default ChatScreen;
