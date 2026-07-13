const axios = require('axios');

async function seedData() {
    try {
        console.log("Creating test user...");
        const res = await axios.post('http://localhost:5000/api/auth/register', {
            name: "Test User",
            email: "test@example.com",
            password: "TestPassword123!",
            joiningYear: "2020",
            graduationYear: "2024"
        });
        console.log("User created!", res.data);
    } catch (e) {
        console.log("Error creating user (might already exist):", e.response?.data || e.message);
    }
}

seedData();
