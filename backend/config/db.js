const mongoose = require('mongoose');

let isConnected = false;

// Attach event listeners for robust database monitoring
mongoose.connection.on('connected', () => {
    console.log('MongoDB connection established successfully.');
});

mongoose.connection.on('error', (err) => {
    console.error(`MongoDB Connection Error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB connection lost. Attempting to reconnect...');
    isConnected = false;
});

mongoose.connection.on('reconnected', () => {
    console.log('MongoDB connection restored.');
    isConnected = true;
});

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
            maxPoolSize: 10,
            minPoolSize: 2,
            socketTimeoutMS: 45000,
            autoIndex: true
        });
        isConnected = true;
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Database Connection Error: ${error.message}`);
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
    }
};

module.exports = connectDB;
