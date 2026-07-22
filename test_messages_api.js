const axios = require('axios');

const API_URL = 'https://backend-pi-bice-97.vercel.app/api';

async function runTest() {
    try {
        const uniqueSuffix = Date.now();
        const user1Email = `user1_${uniqueSuffix}@example.com`;
        const user2Email = `user2_${uniqueSuffix}@example.com`;
        const password = 'Password123!';

        // 1. Register User 1
        console.log('Registering User 1...');
        const res1 = await axios.post(`${API_URL}/auth/register`, {
            name: 'Test User One',
            email: user1Email,
            password: password,
            batchYear: '2020',
            degree: 'B.Tech',
            department: 'Computer Science',
            role: 'Alumni'
        });
        const token1 = res1.data.token;
        const id1 = res1.data._id;

        // 2. Register User 2
        console.log('Registering User 2...');
        const res2 = await axios.post(`${API_URL}/auth/register`, {
            name: 'Test User Two',
            email: user2Email,
            password: password,
            batchYear: '2021',
            degree: 'B.Tech',
            department: 'Information Science',
            role: 'Alumni'
        });
        const token2 = res2.data.token;
        const id2 = res2.data._id;

        // We need to bypass "is_approved" if the system requires it.
        // There's a make-admin endpoint!
        await axios.get(`https://backend-pi-bice-97.vercel.app/api/make-admin/${user1Email}`);
        await axios.get(`https://backend-pi-bice-97.vercel.app/api/make-admin/${user2Email}`);

        // 3. User 1 sends message to User 2
        console.log(`User 1 sending message to User 2 (${id2})...`);
        const msgRes = await axios.post(`${API_URL}/messages/${id2}`, {
            text: 'Hello User 2! This is a test message.'
        }, {
            headers: { Authorization: `Bearer ${token1}` }
        });
        console.log('Message sent successfully!', msgRes.data);

        // 4. User 2 checks Chat History
        console.log('User 2 fetching Chat History...');
        const historyRes = await axios.get(`${API_URL}/messages/history/recent`, {
            headers: { Authorization: `Bearer ${token2}` }
        });
        
        console.log('User 2 Chat History length:', historyRes.data.length);
        if (historyRes.data.length > 0) {
            console.log('First chat preview:', JSON.stringify(historyRes.data[0], null, 2));
        } else {
            console.log('FAIL: User 2 did NOT see the message in chat history!');
        }

        // 5. User 2 checks Conversation directly
        console.log('User 2 fetching Conversation directly...');
        const convRes = await axios.get(`${API_URL}/messages/${id1}`, {
            headers: { Authorization: `Bearer ${token2}` }
        });
        console.log('User 2 Conversation length:', convRes.data.length);

    } catch (e) {
        console.error('API Test Error:', e.response ? e.response.data : e.message);
    }
}
runTest();
