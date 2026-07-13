const express = require('express');
const { blockUser, unblockUser, getBlockedUsers } = require('../controllers/blockController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, blockUser);
router.get('/', protect, getBlockedUsers);
router.delete('/:blockedId', protect, unblockUser);

module.exports = router;
