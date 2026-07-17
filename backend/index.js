const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
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
const activityLogger = require('./middleware/activityLogger');

dotenv.config();

// We will connect inside a middleware to ensure Serverless cold starts wait for DB
// connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

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

app.get('/', (req, res) => {
    res.send('RVITM Alumni API is running...');
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message });
});

if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;
