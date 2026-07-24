const axios = require('axios');

async function test() {
  try {
    // 1. Login
    const loginRes = await axios.post('https://backend-pi-bice-97.vercel.app/api/auth/login', {
      email: 'ruchi@example.com',
      password: 'Password@123'
    });
    const token = loginRes.data.token;
    
    // 2. Create post with isReshare: true
    const postRes = await axios.post('https://backend-pi-bice-97.vercel.app/api/posts', {
      content: 'Test reshare',
      isReshare: true
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Created post:', postRes.data.isReshare);
    
    // 3. Get posts
    const getRes = await axios.get('https://backend-pi-bice-97.vercel.app/api/posts', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const myPost = getRes.data.find(p => p._id === postRes.data._id);
    console.log('Fetched post isReshare:', myPost.isReshare);
    
  } catch (e) {
    console.error(e.response ? e.response.data : e.message);
  }
}
test();
