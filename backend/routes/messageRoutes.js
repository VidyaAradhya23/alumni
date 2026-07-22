const express = require('express');
const { 
    sendMessage, 
    getConversation, 
    getChatHistory,
    reactMessage
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/history/recent', protect, getChatHistory);
router.put('/:messageId/react', protect, reactMessage);
router.route('/:userId')
    .post(protect, sendMessage)
    .get(protect, getConversation);

module.exports = router;
