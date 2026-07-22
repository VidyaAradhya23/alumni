const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const User = require('./models/User');

const seedUsers = [
    {
        name: 'System Admin',
        email: 'admin@alumni.org',
        password: 'Password123!',
        institution: 'Alumni Association Network',
        branch: 'Computer Science',
        department: 'Computer Science',
        degree: 'M.Tech',
        batchYear: '2020',
        joiningYear: '2016',
        role: 'Admin',
        is_approved: true,
        bio: 'Platform administrator and alumni coordinator.',
        location: 'Bangalore, India',
        company: 'Alumni Tech Network',
        designation: 'Lead Administrator'
    },
    {
        name: 'Ananya Sharma',
        email: 'ananya.sharma@example.com',
        password: 'Password123!',
        institution: 'Indian Institute of Technology, Bombay',
        branch: 'Computer Science',
        department: 'Computer Science',
        degree: 'B.Tech',
        batchYear: '2021',
        joiningYear: '2017',
        role: 'Alumni',
        is_approved: true,
        bio: 'Senior Software Engineer working on distributed systems.',
        location: 'Mumbai, India',
        company: 'Google',
        designation: 'Senior Software Engineer'
    },
    {
        name: 'Rahul Verma',
        email: 'rahul.verma@example.com',
        password: 'Password123!',
        institution: 'Indian Institute of Technology, Delhi',
        branch: 'Electrical Engineering',
        department: 'Electrical Engineering',
        degree: 'B.Tech',
        batchYear: '2022',
        joiningYear: '2018',
        role: 'Alumni',
        is_approved: true,
        bio: 'AI researcher and hardware architecture enthusiast.',
        location: 'New Delhi, India',
        company: 'NVIDIA',
        designation: 'Hardware Engineer'
    },
    {
        name: 'Priya Patel',
        email: 'priya.patel@example.com',
        password: 'Password123!',
        institution: 'BITS Pilani',
        branch: 'Information Systems',
        department: 'Information Systems',
        degree: 'M.S.',
        batchYear: '2020',
        joiningYear: '2018',
        role: 'Alumni',
        is_approved: true,
        bio: 'Product manager passionate about scaling user-first mobile applications.',
        location: 'Hyderabad, India',
        company: 'Microsoft',
        designation: 'Product Manager'
    },
    {
        name: 'Vikram Singh',
        email: 'vikram.singh@example.com',
        password: 'Password123!',
        institution: 'National Institute of Technology, Surathkal',
        branch: 'Mechanical Engineering',
        department: 'Mechanical Engineering',
        degree: 'B.Tech',
        batchYear: '2019',
        joiningYear: '2015',
        role: 'Alumni',
        is_approved: true,
        bio: 'Robotics tech lead focusing on autonomous navigation.',
        location: 'Pune, India',
        company: 'Tesla',
        designation: 'Robotics Engineer'
    },
    {
        name: 'Neha Gupta',
        email: 'neha.gupta@example.com',
        password: 'Password123!',
        institution: 'Indian Institute of Science, Bangalore',
        branch: 'Data Science',
        department: 'Data Science',
        degree: 'Ph.D.',
        batchYear: '2023',
        joiningYear: '2019',
        role: 'Student',
        is_approved: true,
        bio: 'Research scholar working on NLP and Large Language Models.',
        location: 'Bangalore, India',
        company: 'IISc Research Labs',
        designation: 'Research Fellow'
    }
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for user seeding...');

        for (const userData of seedUsers) {
            const existing = await User.findOne({ email: userData.email });
            if (!existing) {
                const user = new User(userData);
                await user.save();
                console.log(`Created MongoDB user: ${userData.name} (${userData.email})`);
            } else {
                console.log(`User already in MongoDB: ${userData.name} (${userData.email})`);
            }
        }

        console.log('MongoDB user seeding complete!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
};

seed();
