const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const mentorshipRoutes = require('./routes/mentorshipRoutes');
const eventRoutes = require('./routes/eventRoutes');
const reportRoutes = require('./routes/reportRoutes');
const blockRoutes = require('./routes/blockRoutes');
const adminRoutes = require('./routes/adminRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const activityRoutes = require('./routes/activityRoutes');
const messageRoutes = require('./routes/messageRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const jobRoutes = require('./routes/jobRoutes');
const activityLogger = require('./middleware/activityLogger');

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Setup Socket.IO for WSS real-time bidirectional communication
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
});

// Socket.IO JWT Authentication Middleware
io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
    if (!token) {
        return next(); // Allow guest/anonymous for public notifications, room joins enforce auth
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        socket.user = decoded;
        next();
    } catch (err) {
        next();
    }
});

// Real-Time WebSocket Event Handlers
io.on('connection', (socket) => {
    console.log(`[Socket.IO WSS] Client connected: ${socket.id}`);

    socket.on('join_user_room', (userId) => {
        if (userId) {
            socket.join(`user_${userId}`);
            console.log(`[Socket.IO WSS] User ${userId} joined room: user_${userId}`);
        }
    });

    socket.on('typing', ({ senderId, receiverId }) => {
        socket.to(`user_${receiverId}`).emit('user_typing', { senderId });
    });

    socket.on('stop_typing', ({ senderId, receiverId }) => {
        socket.to(`user_${receiverId}`).emit('user_stop_typing', { senderId });
    });

    socket.on('send_realtime_message', (messageData) => {
        const { receiver } = messageData;
        if (receiver) {
            const receiverId = typeof receiver === 'object' ? (receiver._id || receiver.id) : receiver;
            io.to(`user_${receiverId}`).emit('receive_realtime_message', messageData);
        }
    });

    socket.on('disconnect', () => {
        console.log(`[Socket.IO WSS] Client disconnected: ${socket.id}`);
    });
});

app.use(cors());
app.use(express.json());

// Ensure database is connected before handling any requests
app.use(async (req, res, next) => {
    await connectDB();
    next();
});
app.use(activityLogger);

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/mentorship', mentorshipRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/blocks', blockRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/jobs', jobRoutes);

// System Health & Architectural Flow Status Check
app.get('/api/system-status', async (req, res) => {
    const mongoose = require('mongoose');
    res.json({
        status: 'healthy',
        architecture: {
            transport: 'HTTPS / WSS (Load Balancer & Nginx Proxy Ready)',
            clients: ['Web Application (React/Next.js)', 'Mobile Application (Flutter)'],
            modules: [
                'Authentication Module',
                'User Management Module',
                'Alumni Directory Module',
                'Profile Management Module',
                'Event Management Module',
                'Job Portal Module',
                'Mentorship Module',
                'Chat Module (Socket.IO)',
                'Notification Module (FCM Admin SDK)',
                'Admin Module',
                'Reports & Analytics Module'
            ],
            database: 'MongoDB Atlas',
            dbState: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
            storage: 'Cloudinary / GridFS / AWS S3',
            realtime: 'Socket.IO WSS Active'
        },
        timestamp: new Date().toISOString()
    });
});

// Temporary endpoint to grant Admin access to an account
app.get('/api/make-admin/:email', async (req, res) => {
    try {
        const User = require('./models/User');
        const user = await User.findOne({ email: req.params.email.toLowerCase() });
        if (!user) return res.send('User not found in live database.');
        
        user.role = 'Super Admin';
        user.isAdmin = true;
        user.is_approved = true;
        await user.save();
        res.send('Success! User is now a Super Admin. You can now log in normally without bypasses.');
    } catch (e) {
        res.send('Error: ' + e.message);
    }
});

app.get('/', (req, res) => {
    res.send('RVITM Alumni API is running with HTTPS, WSS (Socket.IO), JWT Auth & MongoDB Atlas...');
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message });
});

if (!process.env.VERCEL) {
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT} (HTTP & Socket.IO WSS)`);
    });
}

module.exports = app;
