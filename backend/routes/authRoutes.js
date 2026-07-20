const express = require('express');
const { 
    registerUser, 
    loginUser, 
    updateUserProfile, 
    getUsers, 
    getSuggestions,
    oauthLogin, 
    linkedinAuthCallback,
    checkEmailExists,
    getProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    deleteAccount
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/check-email', checkEmailExists);
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

module.exports = router;
