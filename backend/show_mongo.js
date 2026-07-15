const mongoose = require('mongoose');
require('dotenv').config();

const Post = require('./models/Post');
const User = require('./models/User');

async function showMongoData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('### 👥 Registered Users\n');
    console.log('| Name | Email | Role | Approved? |');
    console.log('|---|---|---|---|');
    const users = await User.find().sort({ createdAt: -1 }).limit(10);
    if (users.length === 0) {
      console.log('| *(No users found)* | | | |');
    } else {
      users.forEach(user => {
        console.log(`| ${user.name} | ${user.email} | ${user.role} | ${user.is_approved ? '✅ Yes' : '❌ No'} |`);
      });
    }

    console.log('\n### 📝 Recent Posts\n');
    console.log('| Date | Author | Content | Attachments |');
    console.log('|---|---|---|---|');
    const posts = await Post.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(10);
    if (posts.length === 0) {
      console.log('| *(No posts found)* | | | |');
    } else {
      posts.forEach(post => {
        const date = new Date(post.createdAt).toLocaleDateString();
        const author = post.user ? post.user.name : 'Unknown';
        
        let attachments = [];
        if (post.image) attachments.push('Image');
        if (post.fileName) attachments.push(`File (${post.fileName})`);
        const attachmentStr = attachments.length > 0 ? attachments.join(', ') : '*None*';

        console.log(`| ${date} | ${author} | ${post.content || '*Empty*'} | ${attachmentStr} |`);
      });
    }

  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

showMongoData();
