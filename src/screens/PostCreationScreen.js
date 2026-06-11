import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, Alert, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const hashtags = ['#RVCE', '#AlumniMeet', '#Mentorship', '#TechTalk', '#Careers', '#ClassOf2024'];

const PostCreationScreen = ({ navigation }) => {
  const [content, setContent] = useState('');
  const [audience, setAudience] = useState('All Alumni');
  const [attachedImage, setAttachedImage] = useState(null);

  const handlePost = () => {
    if (!content.trim()) {
      Alert.alert('Empty Post', 'Please enter some text before posting.');
      return;
    }
    Alert.alert(
      'Success',
      'Your post has been shared with the community!',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
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

  const handleSelectMedia = () => {
    setAttachedImage('https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&h=400&q=80');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Post</Text>
          <TouchableOpacity 
            style={[styles.postBtn, !content.trim() && styles.disabledPostBtn]}
            disabled={!content.trim()}
            onPress={handlePost}
          >
            <Text style={styles.postBtnText}>Post</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* User Header */}
          <View style={styles.userSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AJ</Text>
            </View>
            <View>
              <Text style={styles.userName}>Abhishek Jaiswal</Text>
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
          />

          {/* Attached Image Preview */}
          {attachedImage ? (
            <View style={styles.previewContainer}>
              <Image source={{ uri: attachedImage }} style={styles.previewImage} />
              <TouchableOpacity style={styles.removeImageBtn} onPress={() => setAttachedImage(null)}>
                <Ionicons name="close-circle" size={26} color="rgba(15, 23, 42, 0.8)" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.mediaSection}>
              <TouchableOpacity style={styles.mediaPlaceholder} onPress={handleSelectMedia} activeOpacity={0.7}>
                <Ionicons name="image-outline" size={28} color="#003366" />
                <Text style={styles.mediaLabel}>Add Photo/Video to Post</Text>
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
            <TouchableOpacity style={styles.toolBtn} onPress={handleSelectMedia}>
              <Ionicons name="videocam" size={24} color="#003366" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.toolBtn} onPress={handleToggleAudience}>
              <Ionicons name="people" size={24} color="#003366" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.toolBtn} onPress={() => handleAddHashtag('#RVCE')}>
              <Ionicons name="hash" size={24} color="#003366" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  cancelBtn: {
    paddingVertical: 4,
  },
  cancelText: {
    fontSize: 15.5,
    color: '#64748B',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  postBtn: {
    backgroundColor: '#003366',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  disabledPostBtn: {
    backgroundColor: '#E2E8F0',
  },
  postBtnText: {
    color: '#FFFFFF',
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
    backgroundColor: '#003366',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
  userName: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#0F172A',
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
    color: '#003366',
    fontWeight: '700',
  },
  input: {
    fontSize: 16.5,
    color: '#0F172A',
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
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  mediaLabel: {
    fontSize: 13,
    color: '#64748B',
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
    color: '#64748B',
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
    borderColor: '#E2E8F0',
  },
  tagText: {
    fontSize: 12,
    color: '#003366',
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
    color: '#94A3B8',
    fontWeight: '600',
  },
  charCountWarning: {
    color: '#EF4444',
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
