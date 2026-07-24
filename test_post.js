const axios = require('axios');

async function test() {
  try {
    // 1. Login to get token
    console.log('Logging in...');
    const loginRes = await axios.post('https://backend-pi-bice-97.vercel.app/api/auth/login', {
      email: 'alumni@rvitm.edu.in',
      password: 'Password123'
    });
    const token = loginRes.data.token;
    console.log('Got token:', token.substring(0, 20) + '...');

    // 2. Try creating a post
    console.log('Creating post...');
    const postRes = await axios.post('https://backend-pi-bice-97.vercel.app/api/posts', {
      content: "",
      image: "https://via.placeholder.com/150",
      fileType: "image/jpeg",
      fileName: "test.jpg",
      tags: ["669a8b1b2c3d4e5f6a7b8c9d"] // Dummy objectId
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Success:', postRes.data);
  } catch (error) {
    if (error.response) {
      console.error('Error from server:', error.response.status, error.response.data);
    } else {
      console.error('Network error:', error.message);
    }
  }
}

test();
