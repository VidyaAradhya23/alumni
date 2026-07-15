import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, Alert, StatusBar } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { uploadFile } from '../services/uploadService';
import { createPost } from '../services/postService';

const hashtags = ['#Institution', '#AlumniMeet', '#Mentorship', '#TechTalk', '#Careers', '#ClassOf2024'];

const PostCreationScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const styles = getStyles(theme);

  const [content, setContent] = useState('');
  const [audience, setAudience] = useState('All Alumni');
  const [localImageUri, setLocalImageUri] = useState(null);
  const [mimeType, setMimeType] = useState('image/jpeg');
  const [fileName, setFileName] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        const userStr = await AsyncStorage.getItem('userInfo');
        if (userStr) {
          setCurrentUser(JSON.parse(userStr));
        }
      } catch (err) {}
    };
    fetchUser();
  }, []);

  const handlePost = async () => {
    if (!content.trim() && !localImageUri) {
      Alert.alert('Empty Post', 'Please enter some text or attach an image.');
      return;
    }

    setIsUploading(true);
    try {
      let imageUrl = null;
      if (localImageUri) {
        imageUrl = await uploadFile(localImageUri, mimeType, fileName || 'post-image.jpg');
      }

      await createPost({
        content: content.trim(),
        image: imageUrl,
        fileType: mimeType,
        fileName: fileName
      });

      setIsUploading(false);
      Alert.alert(
        'Success',
        'Your post has been shared with the community!',
        [{ text: 'OK', onPress: () => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            navigation.navigate('Main');
          }
        } }]
      );
    } catch (error) {
      console.error('Error creating post:', error);
      setIsUploading(false);
      Alert.alert('Error', 'Failed to create post. Please try again later.');
    }
  };

  const handleAddHashtag = (tag) => {
    if (content.includes(tag)) return;
    setContent(prev => prev + (prev.endsWith(' ') || prev.length === 0 ? '' : ' ') + tag + ' ');
  };

  const handleToggleAudience = () => {
    Alert.alert(
      'Select Audience',
      'Choose who can see this post',
      [
        { text: 'All Alumni', onPress: () => setAudience('All Alumni') },
        { text: 'My Batch Only', onPress: () => setAudience('Batch of 2023') },
        { text: 'Department Only', onPress: () => setAudience('CSE Department') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleSelectMedia = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setLocalImageUri(result.assets[0].uri);
        setMimeType(result.assets[0].mimeType || 'image/jpeg');
        setFileName(result.assets[0].fileName || 'image.jpg');
      }
    } catch (err) {
      console.error('Image picker error:', err);
      Alert.alert('Error', 'Could not open image picker: ' + err.message);
    }
  };

  const handleSelectDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setLocalImageUri(file.uri);
        setMimeType(file.mimeType || 'application/octet-stream');
        setFileName(file.name);
      }
    } catch (err) {
      console.error('Document picker error:', err);
      Alert.alert('Error', 'Could not open document picker: ' + err.message);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const url = URL.createObjectURL(file);
      setLocalImageUri(url);
      setMimeType(file.type);
      setFileName(file.name);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

    const isWeb = Platform.OS === 'web';
  const webContainerStyle = isWeb ? { alignSelf: 'center', width: '100%', maxWidth: 800, flex: 1 } : { flex: 1 };

  return (
    <SafeAreaView style={styles.container}>
      <View style={webContainerStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        {...(isWeb ? { onDrop: handleDrop, onDragOver: handleDragOver } : {})}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else {
                navigation.navigate('Main');
              }
            }} 
            style={styles.cancelBtn}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Post</Text>
          <TouchableOpacity 
            style={[styles.postBtn, (!content.trim() && !localImageUri || isUploading) && styles.disabledPostBtn]}
            disabled={(!content.trim() && !localImageUri) || isUploading}
            onPress={handlePost}
          >
            <Text style={styles.postBtnText}>{isUploading ? 'Posting...' : 'Post'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* User Header */}
          <View style={styles.userSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{currentUser?.name ? currentUser.name.substring(0, 2).toUpperCase() : 'ME'}</Text>
            </View>
            <View>
              <Text style={styles.userName}>{currentUser?.name || 'User'}</Text>
              <TouchableOpacity style={styles.audienceSelector} onPress={handleToggleAudience} activeOpacity={0.6}>
                <Ionicons name="people-outline" size={12} color="#003366" />
                <Text style={styles.audienceText}>{audience}</Text>
                <Ionicons name="chevron-down" size={12} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          </View>

          {/* TextInput */}
          <TextInput
            style={styles.input}
            placeholder="Share an update, request a referral, or post an achievement..."
            multiline
            maxLength={280}
            value={content}
            onChangeText={setContent}
            placeholderTextColor="#94A3B8"
            autoFocus
            spellCheck={false}
            autoCorrect={false}
            // For Edge specific blocking if possible via data attributes on web:
            {...(Platform.OS === 'web' ? { 'data-ms-editor': false } : {})}
          />

          {/* Attached Image Preview */}
          {localImageUri ? (
            <View style={styles.previewContainer}>
              {mimeType && mimeType.startsWith('image/') ? (
                <Image source={{ uri: localImageUri }} style={styles.previewImage} />
              ) : (
                <View style={styles.documentPreview}>
                  <Ionicons name="document-text" size={48} color="#003366" />
                  <Text style={styles.documentName} numberOfLines={2}>{fileName || 'Document'}</Text>
                </View>
              )}
              <TouchableOpacity style={styles.removeImageBtn} onPress={() => { setLocalImageUri(null); setFileName(null); setMimeType('image/jpeg'); }}>
                <Ionicons name="close-circle" size={26} color="rgba(15, 23, 42, 0.8)" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.mediaSection}>
              <TouchableOpacity style={styles.mediaPlaceholder} onPress={handleSelectMedia} activeOpacity={0.7}>
                <Ionicons name="image-outline" size={28} color="#003366" />
                <Text style={styles.mediaLabel}>Add Photo/Video to Post</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.mediaPlaceholder, {marginTop: 10}]} onPress={handleSelectDocument} activeOpacity={0.7}>
                <Ionicons name="document-attach-outline" size={28} color="#003366" />
                <Text style={styles.mediaLabel}>Attach Document / PDF (or Drag & Drop here)</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Quick Hashtags */}
          <View style={styles.hashtagSection}>
            <Text style={styles.hashtagLabel}>Quick Tags:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hashtagScroll}>
              {hashtags.map(tag => (
                <TouchableOpacity key={tag} style={styles.tagChip} onPress={() => handleAddHashtag(tag)}>
                  <Text style={styles.tagText}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </ScrollView>

        {/* Character Count & Bottom Toolbar */}
        <View style={styles.footerContainer}>
          <Text style={[styles.charCount, content.length >= 250 && styles.charCountWarning]}>
            {content.length}/280
          </Text>
          <View style={styles.toolbar}>
            <TouchableOpacity style={styles.toolBtn} onPress={handleSelectMedia}>
              <Ionicons name="image" size={24} color="#003366" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.toolBtn} onPress={handleSelectDocument}>
              <Ionicons name="add" size={26} color="#003366" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.toolBtn} onPress={handleToggleAudience}>
              <Ionicons name="people" size={24} color="#003366" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.toolBtn} onPress={() => handleAddHashtag('#Institution')}>
              <Ionicons name="hash" size={24} color="#003366" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  cancelBtn: {
    paddingVertical: 4,
  },
  cancelText: {
    fontSize: 15.5,
    color: theme.textSecondary,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: theme.text,
  },
  postBtn: {
    backgroundColor: theme.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  disabledPostBtn: {
    backgroundColor: theme.border,
  },
  postBtnText: {
    color: theme.card,
    fontWeight: '700',
    fontSize: 14,
  },
  scrollContent: {
    padding: 20,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: theme.card,
    fontWeight: '800',
    fontSize: 15,
  },
  userName: {
    fontSize: 15.5,
    fontWeight: '700',
    color: theme.text,
  },
  audienceSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 4,
    gap: 4,
    alignSelf: 'flex-start',
  },
  audienceText: {
    fontSize: 11,
    color: theme.primary,
    fontWeight: '700',
  },
  input: {
    fontSize: 16.5,
    color: theme.text,
    minHeight: 120,
    textAlignVertical: 'top',
    lineHeight: 22,
  },
  mediaSection: {
    marginTop: 20,
  },
  mediaPlaceholder: {
    width: '100%',
    height: 100,
    backgroundColor: theme.background,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: theme.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  mediaLabel: {
    fontSize: 13,
    color: theme.textSecondary,
    fontWeight: '600',
  },
  previewContainer: {
    position: 'relative',
    marginTop: 16,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
  },
  previewImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  documentPreview: {
    width: '100%',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E2E8F0',
  },
  documentName: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#003366',
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  removeImageBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  hashtagSection: {
    marginTop: 24,
  },
  hashtagLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.textSecondary,
    marginBottom: 8,
  },
  hashtagScroll: {
    gap: 8,
  },
  tagChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  tagText: {
    fontSize: 12,
    color: theme.primary,
    fontWeight: '600',
  },
  footerContainer: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  charCount: {
    alignSelf: 'flex-end',
    marginRight: 20,
    marginTop: 8,
    fontSize: 12,
    color: theme.textMuted,
    fontWeight: '600',
  },
  charCountWarning: {
    color: theme.danger,
  },
  toolbar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 24,
  },
  toolBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PostCreationScreen;
