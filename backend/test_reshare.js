const axios = require('axios');

async function test() {
  const ts = Date.now();
  const email = `test${ts}@example.com`;
  const password = 'Password@123';
  
  try {
    console.log(`Registering ${email}...`);
    const regRes = await axios.post('https://backend-pi-bice-97.vercel.app/api/auth/register', {
      name: 'Test User',
      email: email,
      password: password,
      batchYear: '2024',
      department: 'CSE'
    });
    
    const token = regRes.data.token;
    console.log('Registered successfully, token:', token.substring(0, 10) + '...');
    
    console.log('Creating reshared post...');
    const postRes = await axios.post('https://backend-pi-bice-97.vercel.app/api/posts', {
      content: 'This is a test reshare',
      isReshare: true
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Post created, isReshare in response:', postRes.data.isReshare);
    const postId = postRes.data._id;
    
    console.log('Fetching all posts...');
    const getRes = await axios.get('https://backend-pi-bice-97.vercel.app/api/posts', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const myPost = getRes.data.find(p => p._id === postId);
    if (myPost) {
      console.log('Fetched post isReshare:', myPost.isReshare);
    } else {
      console.log('Post not found in feed');
    }
    
  } catch (e) {
    console.error('Error:', e.response ? JSON.stringify(e.response.data) : e.message);
  }
}
test();
