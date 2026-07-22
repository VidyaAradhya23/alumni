const User = require('../models/User');
const Post = require('../models/Post');
const Event = require('../models/Event');
const Report = require('../models/Report');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
exports.getStats = async (req, res) => {
    try {
        // Multi-tenant Scoping: If Admin (not Super Admin), force filter to req.user.institution
        const effectiveInstitution = req.user && req.user.role === 'Admin' 
            ? (req.user.institution || 'Media Cell Institution')
            : (req.query.institution || null);
        
        const userFilter = {};
        const pendingUserFilter = { is_approved: false };
        const activeAlumniFilter = { is_approved: true, role: 'Alumni' };

        if (effectiveInstitution && effectiveInstitution !== 'All') {
            userFilter.institution = effectiveInstitution;
            pendingUserFilter.institution = effectiveInstitution;
            activeAlumniFilter.institution = effectiveInstitution;
        }

        const totalUsers = await User.countDocuments(userFilter);
        const pendingUsers = await User.countDocuments(pendingUserFilter);
        const totalAlumni = await User.countDocuments(activeAlumniFilter);
        const totalPosts = await Post.countDocuments();
        const totalEvents = await Event.countDocuments();
        const pendingReports = await Report.countDocuments({ status: 'pending' });

        res.json({
            totalUsers,
            pendingUsers,
            totalAlumni,
            totalPosts,
            totalEvents,
            pendingReports
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users pending approval
// @route   GET /api/admin/pending-users
exports.getPendingUsers = async (req, res) => {
    try {
        // Multi-tenant Scoping: If Admin (not Super Admin), force filter to req.user.institution
        const effectiveInstitution = req.user && req.user.role === 'Admin' 
            ? (req.user.institution || 'Media Cell Institution')
            : (req.query.institution || null);

        let filter = { is_approved: false };
        if (effectiveInstitution && effectiveInstitution !== 'All') {
            filter.institution = effectiveInstitution;
        }

        const pendingUsers = await User.find(filter)
            .select('-password -passwordResetToken -passwordResetExpires')
            .sort({ created_at: -1 });
        res.json(pendingUsers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Approve a user
// @route   PUT /api/admin/users/:id/approve
exports.approveUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.is_approved = true;
        await user.save();

        res.json({ message: 'User approved successfully', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reject/Delete a pending user
// @route   DELETE /api/admin/users/:id/reject
exports.rejectUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await User.findByIdAndDelete(req.params.id);

        res.json({ message: 'User rejected and deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        
        // Basic validation
        if (!['Alumni', 'Admin', 'Super Admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        // Only super admin can make other super admins
        if (role === 'Super Admin' && req.user.role !== 'Super Admin') {
             return res.status(403).json({ message: 'Only Super Admins can assign the Super Admin role' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Cannot modify own role here to prevent self-demotion
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'Cannot modify your own role' });
        }

        user.role = role;
        await user.save();

        res.json({ message: 'User role updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const StudentData = require('../models/StudentData');
const Message = require('../models/Message');

// @desc    Get all messages stored in MongoDB (Admin view)
// @route   GET /api/admin/messages
exports.getAllMessages = async (req, res) => {
    try {
        const messages = await Message.find()
            .populate('sender receiver', 'name email role institution department')
            .sort({ createdAt: -1 })
            .limit(100);
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Check potential Mediacell matches for a user
// @route   GET /api/admin/users/:id/check-match
exports.checkMatch = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Search for matches in StudentData based on joiningYear or leavingYear
        // We'll search for partial name match or exact year match
        let query = {};
        if (user.name) {
            query.name = { $regex: user.name.trim(), $options: 'i' };
        }
        
        let matches = await StudentData.find(query);
        
        if (matches.length === 0) {
            // Fallback: search by batchYear or joiningYear
            let yearQuery = { $or: [] };
            if (user.joiningYear) yearQuery.$or.push({ joiningYear: user.joiningYear.trim() });
            if (user.batchYear) yearQuery.$or.push({ leavingYear: user.batchYear.trim() });
            
            if (yearQuery.$or.length > 0) {
                 matches = await StudentData.find(yearQuery).limit(5); // Return up to 5 suggested matches based on year
            }
        }

        res.json({ matches });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
