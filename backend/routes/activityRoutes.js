const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const ActivityLog = require('../models/ActivityLog');

// @route   POST /api/activity/track
// @desc    Track custom frontend activity (e.g. page views)
// @access  Private
router.post('/track', protect, async (req, res) => {
    try {
        const { actionType, metadata } = req.body;
        
        await ActivityLog.create({
            user: req.user._id,
            actionType: actionType || 'CUSTOM_FRONTEND_EVENT',
            method: 'FRONTEND',
            endpoint: req.originalUrl,
            metadata: metadata || {},
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('user-agent'),
            status: 200
        });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Track Activity Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/activity
// @desc    Get activity logs (Admin only ideally, but keeping it open for now for testing)
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        // Find recent 50 activities
        const activities = await ActivityLog.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(50);
        res.json(activities);
    } catch (error) {
        console.error('Get Activity Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
