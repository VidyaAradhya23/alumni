const express = require('express');
const { 
    registerUser, 
    loginUser, 
    updateUserProfile, 
    getUsers, 
    getSuggestions,
    sendOtp,
    oauthLogin, 
    linkedinAuthCallback,
    checkEmailExists,
    getProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    deleteAccount,
    toggleFollow,
    getFollowers,
    getFollowing,
    getNotifications,
    markNotificationsRead
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/check-email', checkEmailExists);
router.post('/send-otp', sendOtp);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/oauth', oauthLogin);
router.get('/linkedin/callback', linkedinAuthCallback);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/change-password', protect, changePassword);
router.delete('/account', protect, deleteAccount);
router.get('/users', protect, getUsers);
router.get('/suggestions', protect, getSuggestions);

router.post('/follow/:id', protect, toggleFollow);
router.get('/followers', protect, getFollowers);
router.get('/following', protect, getFollowing);

router.get('/notifications', protect, getNotifications);
router.put('/notifications/:id/read', protect, markNotificationsRead);

module.exports = router;
