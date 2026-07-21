const express = require('express');
const { 
    sendMessage, 
    getConversation, 
    getChatHistory 
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/history/recent', protect, getChatHistory);
router.route('/:userId')
    .post(protect, sendMessage)
    .get(protect, getConversation);

module.exports = router;
