const BlockedUser = require('../models/BlockedUser');

// @desc    Block a user
// @route   POST /api/blocks
exports.blockUser = async (req, res) => {
    try {
        const { blockedId } = req.body;

        if (req.user._id.toString() === blockedId) {
            return res.status(400).json({ message: 'You cannot block yourself' });
        }

        const existingBlock = await BlockedUser.findOne({ blocker: req.user._id, blocked: blockedId });
        if (existingBlock) {
            return res.status(400).json({ message: 'User is already blocked' });
        }

        await BlockedUser.create({
            blocker: req.user._id,
            blocked: blockedId
        });

        res.status(201).json({ message: 'User blocked successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Unblock a user
// @route   DELETE /api/blocks/:blockedId
exports.unblockUser = async (req, res) => {
    try {
        const { blockedId } = req.params;

        const result = await BlockedUser.findOneAndDelete({ blocker: req.user._id, blocked: blockedId });
        
        if (!result) {
            return res.status(404).json({ message: 'Block record not found' });
        }

        res.json({ message: 'User unblocked successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get blocked users list
// @route   GET /api/blocks
exports.getBlockedUsers = async (req, res) => {
    try {
        const blockedUsers = await BlockedUser.find({ blocker: req.user._id }).populate('blocked', 'name email avatar_url');
        res.json(blockedUsers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
