const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Check if admin exists
        const existingAdmin = await User.findOne({ email: 'admin@mediacell.com' });
        if (existingAdmin) {
            console.log('Admin already exists, updating role/institution...');
            existingAdmin.role = 'Admin';
            existingAdmin.institution = 'Media Cell Institution';
            existingAdmin.password = 'admin123'; // It will hash via pre-save
            await existingAdmin.save();
            console.log('Admin updated successfully.');
        } else {
            console.log('Creating Media Cell Admin...');
            await User.create({
                name: 'Media Cell Admin',
                email: 'admin@mediacell.com',
                password: 'admin123',
                institution: 'Media Cell Institution',
                role: 'Admin',
                isAdmin: true,
                verified: true,
                is_approved: true
            });
            console.log('Admin created successfully.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
