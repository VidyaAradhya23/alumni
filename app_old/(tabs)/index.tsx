import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ScrollView, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FeedScreen() {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Updates', 'Giving', 'Campus', 'Memoirs'];

  const [posts, setPosts] = useState([
    {
      id: '1',
      author: 'Dr. K. N. Subramanya',
      role: 'Principal, RVCE',
      time: '2h ago',
      content: 'Great to see the next generation of RVCEians winning the National Smart India Hackathon! Innovation has always been in our DNA. 🏆',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80',
      likes: 450,
      comments: 67,
      verified: true,
      liked: false,
      category: 'Updates'
    },
    {
      id: 'memoir_1',
      author: 'Prof. S. R. Hegde',
      role: 'Professor Emeritus',
      time: '4h ago',
      content: 'Thinking back to the Batch of 1995. The old mechanical workshop has seen so many dreams take flight. Truly a nostalgic journey for all of us.',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
      likes: 320,
      comments: 15,
      verified: true,
      liked: false,
      category: 'Memoirs'
    },
    {
      id: 'campus_1',
      author: 'Campus News',
      role: 'Official',
      time: '6h ago',
      content: 'New Sustainable Solar Grid installed at the RVCE Main Block! Reducing our carbon footprint by 40% annually.',
      image: 'https://images.unsplash.com/photo-1509391366360-fe5bb60583d0?w=800&q=80',
      likes: 210,
      comments: 8,
      verified: true,
      liked: false,
      category: 'Campus'
    },
    {
      id: 'donate_1',
      isDonation: true,
      title: 'RVCE Sports Complex Modernization',
      goal: '₹1,00,00,000',
      raised: '₹45,00,000',
      description: 'Join us in upgrading our sports facilities to international standards. Your contribution shapes the future champions of RVCE.',
      image: 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=800&q=80',
      category: 'Giving'
    },
    {
      id: '2',
      author: 'Rohan Murty',
      role: 'Distinguished Alumnus',
      time: '10h ago',
      content: 'Excited to visit the campus next week for a guest lecture on AI Ethics. Looking forward to sharing industry insights with the CSE department.',
      likes: 1200,
      comments: 89,
      verified: true,
      liked: false,
      category: 'Updates'
    },
    {
      id: '3',
      author: 'Placement Cell',
      role: 'Official',
      time: '1d ago',
      content: 'Record placement season! 150+ companies visited RVCE this month. Highest package reached ₹92 LPA. Proud of how our alma mater continues to excel.',
      image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80',
      likes: 890,
      comments: 112,
      verified: true,
      liked: false,
      category: 'Updates'
    }
  ]);

  const handleLike = (id) => {
    setPosts(posts.map(post => {
      if (post.id === id) {
        return { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 };
      }
      return post;
    }));
  };

  const handleAction = (type) => {
    Alert.alert('Network Interaction', `Action verified: ${type}. Feedback sent to RVCE Alumni Hub.`);
  };

  const filteredPosts = posts.filter(post => activeCategory === 'All' || post.category === activeCategory);

  const renderPost = ({ item }) => {
    if (item.isDonation) {
      return (
        <View style={styles.donationCard}>
          <Image source={{ uri: item.image }} style={styles.donationImage} />
          <View style={styles.donationOverlay}>
            <View style={styles.donationBadge}><Text style={styles.donationBadgeText}>INSTITUTIONAL FUNDRAISER</Text></View>
          </View>
          <View style={styles.donationContent}>
            <Text style={styles.donationTitle}>{item.title}</Text>
            <Text style={styles.donationDesc}>{item.description}</Text>
            <View style={styles.progressRow}>
              <View style={styles.progressBar}><View style={[styles.progressFill, { width: '45%' }]} /></View>
              <Text style={styles.progressText}>45% Funded</Text>
            </View>
            <View style={styles.donationStats}>
              <Text style={styles.donStatLabel}>Target: <Text style={styles.donStatVal}>{item.goal}</Text></Text>
              <TouchableOpacity style={styles.donateBtn} onPress={() => Alert.alert('Donation', 'Redirecting to secure gateway...')}>
                <Text style={styles.donateBtnText}>Contribute</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.postCard}>
        <View style={styles.postHeader}>
          <View style={styles.authorInfo}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{item.author.charAt(0)}</Text></View>
            <View>
              <View style={styles.nameRow}>
                <Text style={styles.authorName}>{item.author}</Text>
                {item.verified && <Ionicons name="checkmark-circle" size={16} color="#002144" />}
              </View>
              <Text style={styles.authorRole}>{item.role} • {item.time}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => handleAction('Options')}><Ionicons name="ellipsis-horizontal" size={20} color="#94A3B8" /></TouchableOpacity>
        </View>

        <Text style={styles.postContent}>{item.content}</Text>
        {item.image && <Image source={{ uri: item.image }} style={styles.postImage} resizeMode="cover" />}

        <View style={styles.postStats}><Text style={styles.statsText}>{item.likes} likes • {item.comments} comments</Text></View>
        <View style={styles.postActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => handleLike(item.id)}>
            <Ionicons name={item.liked ? "heart" : "heart-outline"} size={22} color={item.liked ? "#EF4444" : "#475569"} />
            <Text style={[styles.actionBtnText, item.liked && {color: "#EF4444"}]}>Like</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => handleAction('Comment')}><Ionicons name="chatbubble-outline" size={20} color="#475569" /><Text style={styles.actionBtnText}>Comment</Text></TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => handleAction('Share')}><Ionicons name="share-outline" size={22} color="#475569" /><Text style={styles.actionBtnText}>Share</Text></TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.logo}>RVCE <Text style={styles.logoAlumni}>Alumni</Text></Text>
        <View style={styles.topIcons}>
          <TouchableOpacity style={styles.iconCircle} onPress={() => handleAction('Search')}><Ionicons name="search" size={20} color="#002144" /></TouchableOpacity>
          <TouchableOpacity style={styles.iconCircle} onPress={() => handleAction('Messages')}><Ionicons name="chatbubbles" size={20} color="#002144" /></TouchableOpacity>
          <TouchableOpacity style={styles.iconCircle} onPress={() => handleAction('Notifications')}><Ionicons name="notifications" size={20} color="#002144" /></TouchableOpacity>
        </View>
      </View>

      <View style={styles.categoryBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
          {categories.map(cat => (
            <TouchableOpacity key={cat} style={[styles.catBtn, activeCategory === cat && styles.catBtnActive]} onPress={() => setActiveCategory(cat)}>
              <Text style={[styles.catText, activeCategory === cat && styles.catTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList data={filteredPosts} renderItem={renderPost} keyExtractor={item => item.id} contentContainerStyle={styles.feedList} showsVerticalScrollIndicator={false} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9' },
  topBar: { backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  logo: { fontSize: 22, fontWeight: '900', color: '#002144' },
  logoAlumni: { color: '#FFD700' },
  topIcons: { flexDirection: 'row', gap: 10 },
  iconCircle: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  categoryBar: { backgroundColor: '#FFFFFF', paddingVertical: 12 },
  catScroll: { paddingHorizontal: 15, gap: 10 },
  catBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F1F5F9' },
  catBtnActive: { backgroundColor: '#002144' },
  catText: { color: '#64748B', fontWeight: '600', fontSize: 13 },
  catTextActive: { color: '#FFD700' },
  feedList: { paddingBottom: 20 },
  postCard: { backgroundColor: '#FFFFFF', marginTop: 10, paddingVertical: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#E2E8F0' },
  postHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 12 },
  authorInfo: { flexDirection: 'row', gap: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#002144', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#FFD700', fontWeight: 'bold', fontSize: 18 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  authorName: { fontSize: 16, fontWeight: 'bold', color: '#0F172A' },
  authorRole: { fontSize: 12, color: '#64748B' },
  postContent: { paddingHorizontal: 16, fontSize: 15, color: '#334155', lineHeight: 22, marginBottom: 12 },
  postImage: { width: '100%', height: 250, marginBottom: 12 },
  postStats: { paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  statsText: { fontSize: 12, color: '#94A3B8' },
  postActions: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: 12 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  actionBtnText: { fontSize: 14, color: '#475569', fontWeight: '600' },
  donationCard: { backgroundColor: '#FFFFFF', marginTop: 10, borderRadius: 16, overflow: 'hidden', marginHorizontal: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  donationImage: { width: '100%', height: 180 },
  donationOverlay: { position: 'absolute', top: 15, left: 15 },
  donationBadge: { backgroundColor: '#002144', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  donationBadgeText: { color: '#FFD700', fontSize: 10, fontWeight: 'bold' },
  donationContent: { padding: 16 },
  donationTitle: { fontSize: 18, fontWeight: 'bold', color: '#0F172A', marginBottom: 8 },
  donationDesc: { fontSize: 13, color: '#64748B', lineHeight: 18, marginBottom: 15 },
  progressRow: { marginBottom: 12 },
  progressBar: { height: 8, backgroundColor: '#F1F5F9', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#10B981' },
  progressText: { fontSize: 10, color: '#10B981', fontWeight: 'bold', marginTop: 5, textAlign: 'right' },
  donationStats: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  donStatLabel: { fontSize: 12, color: '#94A3B8' },
  donStatVal: { color: '#002144', fontWeight: 'bold' },
  donateBtn: { backgroundColor: '#002144', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  donateBtnText: { color: '#FFD700', fontWeight: 'bold', fontSize: 14 }
});
