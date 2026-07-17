const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        console.warn("WARNING: MONGO_URI is not set. Database operations will fail.");
        return;
    }
    
    if (isConnected) {
        return;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        isConnected = true;
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
    }
};

module.exports = connectDB;
