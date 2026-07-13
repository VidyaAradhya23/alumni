const mongoose = require('mongoose');
const User = require('./models/User');

const uri = "mongodb+srv://rveducational_db_user:Alumni%40123@cluster0.xk6n9j6.mongodb.net/?appName=Cluster0";

async function approveUser() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
        
        const res = await User.updateOne({ email: "test@example.com" }, { $set: { is_approved: true } });
        console.log("User approved result:", res);
        
        mongoose.disconnect();
    } catch (e) {
        console.error("Error", e);
    }
}

approveUser();
