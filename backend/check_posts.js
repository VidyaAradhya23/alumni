const mongoose = require('mongoose');

async function test() {
  await mongoose.connect('mongodb+srv://rveducational_db_user:Alumni%40123@cluster0.xk6n9j6.mongodb.net/?appName=Cluster0');
  const posts = await mongoose.connection.collection('posts').find().sort({createdAt: -1}).limit(5).toArray();
  console.log(JSON.stringify(posts, null, 2));
  process.exit(0);
}
test();
