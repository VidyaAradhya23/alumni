const express = require('express');
const { getStats, getPendingUsers, approveUser, rejectUser, updateUserRole } = require('../controllers/adminController');
const { protect, adminOnly, superAdminOnly } = require('../middleware/authMiddleware');
const { syncStudents } = require('../controllers/syncController');
const router = express.Router();

// All admin routes must be protected and restricted to admin/super admin
router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/pending-users', getPendingUsers);
router.put('/users/:id/approve', approveUser);
router.delete('/users/:id/reject', rejectUser);

// Role updating is only for Super Admins in our controller logic, but we can protect it here as well
router.put('/users/:id/role', superAdminOnly, updateUserRole);

// Sync students from Mediacell Google Sheet
router.post('/sync-students', superAdminOnly, syncStudents);

module.exports = router;
