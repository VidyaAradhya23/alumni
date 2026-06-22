const express = require('express');
const { registerUser, loginUser, updateUserProfile, getUsers, oauthLogin, linkedinAuthCallback } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/oauth', oauthLogin);
router.get('/linkedin/callback', linkedinAuthCallback);
router.put('/profile', protect, updateUserProfile);
router.get('/users', protect, getUsers);

module.exports = router;
