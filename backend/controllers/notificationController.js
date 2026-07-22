const Notification = require('../models/Notification');
const { sendFCMNotification } = require('../utils/fcmService');

// @desc    Get user notifications
// @route   GET /api/notifications
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id })
            .populate('sender', 'name profilePicture role')
            .sort({ createdAt: -1 })
            .limit(50);

        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        if (notification.recipient.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        notification.isRead = true;
        await notification.save();

        res.json({ message: 'Notification marked as read', notification });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Send custom push notification (Admin / System)
// @route   POST /api/notifications/send
exports.sendNotification = async (req, res) => {
    try {
        const { recipientId, title, message, type, fcmToken } = req.body;

        const newNotification = await Notification.create({
            recipient: recipientId || req.user._id,
            sender: req.user._id,
            type: type || 'announcement',
            title,
            message
        });

        // Trigger Firebase Cloud Messaging (FCM) push notification
        if (fcmToken) {
            await sendFCMNotification(fcmToken, title, message, { type: type || 'announcement' });
        }

        res.status(201).json({ message: 'Notification sent successfully', notification: newNotification });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
