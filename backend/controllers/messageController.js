const Message = require('../models/Message');
const User = require('../models/User');
const { encrypt, decrypt } = require('../utils/encryption');

// @desc    Send a message
// @route   POST /api/messages/:userId
exports.sendMessage = async (req, res) => {
    try {
        const { text } = req.body;
        const receiverId = req.params.userId;
        const senderId = req.user._id;

        if (!text) return res.status(400).json({ message: 'Message text is required' });

        const message = await Message.create({
            sender: senderId,
            receiver: receiverId,
            text: encrypt(text)
        });

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get conversation with a user
// @route   GET /api/messages/:userId
exports.getConversation = async (req, res) => {
    try {
        const otherUserId = req.params.userId;
        const currentUserId = req.user._id;

        const messages = await Message.find({
            $or: [
                { sender: currentUserId, receiver: otherUserId },
                { sender: otherUserId, receiver: currentUserId }
            ]
        }).sort('createdAt'); // oldest to newest for chat UI

        // Mark received messages as read
        await Message.updateMany(
            { sender: otherUserId, receiver: currentUserId, read: false },
            { $set: { read: true } }
        );
        
        // Decrypt messages before sending to client
        const decryptedMessages = messages.map(msg => {
            const msgObj = msg.toObject();
            msgObj.text = decrypt(msgObj.text);
            return msgObj;
        });

        res.json(decryptedMessages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get recent chat history (list of conversations)
// @route   GET /api/messages/history/recent
exports.getChatHistory = async (req, res) => {
    try {
        const currentUserId = req.user._id;

        // Find all messages involving the current user
        const messages = await Message.find({
            $or: [{ sender: currentUserId }, { receiver: currentUserId }]
        }).sort('-createdAt').populate('sender receiver', 'name email avatar_url role degree institution department');

        // Group by user
        const chatsMap = new Map();

        messages.forEach(msg => {
            const isSender = msg.sender._id.toString() === currentUserId.toString();
            const otherUser = isSender ? msg.receiver : msg.sender;

            if (!otherUser) return; // defensive

            const otherUserIdStr = otherUser._id.toString();

            if (!chatsMap.has(otherUserIdStr)) {
                // Decrypt the last message preview
                const msgObj = msg.toObject();
                msgObj.text = decrypt(msgObj.text);

                chatsMap.set(otherUserIdStr, {
                    user: otherUser,
                    lastMessage: msgObj,
                    unreadCount: (!isSender && !msg.read) ? 1 : 0
                });
            } else {
                if (!isSender && !msg.read) {
                    chatsMap.get(otherUserIdStr).unreadCount += 1;
                }
            }
        });

        // Convert map to array
        const chatHistory = Array.from(chatsMap.values());
        res.json(chatHistory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
