const Message = require('../models/Message');
const User = require('../models/User');
const { encrypt, decrypt } = require('../utils/encryption');

const mongoose = require('mongoose');

// Helper to resolve target user ObjectId
const resolveUserId = async (idParam) => {
    if (!idParam) return null;
    if (mongoose.Types.ObjectId.isValid(idParam)) {
        return idParam;
    }
    const foundUser = await User.findOne({ 
        $or: [{ username: idParam }, { email: idParam }, { name: idParam }] 
    });
    return foundUser ? foundUser._id : null;
};

// @desc    Send a message
// @route   POST /api/messages/:userId
exports.sendMessage = async (req, res) => {
    try {
        const { text } = req.body;
        const targetId = await resolveUserId(req.params.userId);
        const senderId = req.user._id;

        if (!text) return res.status(400).json({ message: 'Message text is required' });
        if (!targetId) return res.status(400).json({ message: 'Target user not found' });

        const message = await Message.create({
            sender: senderId,
            receiver: targetId,
            text: encrypt(text)
        });

        const responseMsg = message.toObject();
        responseMsg.text = text;

        res.status(201).json(responseMsg);
    } catch (error) {
        console.error('sendMessage error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get conversation with a user
// @route   GET /api/messages/:userId
exports.getConversation = async (req, res) => {
    try {
        const targetId = await resolveUserId(req.params.userId);
        const currentUserId = req.user._id;

        if (!targetId) {
            return res.json([]);
        }

        const messages = await Message.find({
            $or: [
                { sender: currentUserId, receiver: targetId },
                { sender: targetId, receiver: currentUserId }
            ]
        }).sort('createdAt'); // oldest to newest for chat UI

        // Mark received messages as read
        await Message.updateMany(
            { sender: targetId, receiver: currentUserId, read: false },
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
        console.error('getConversation error:', error);
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
        })
        .sort('-createdAt')
        .populate('sender receiver', 'name email avatar_url role degree institution department');

        // Group by user
        const chatsMap = new Map();

        messages.forEach(msg => {
            if (!msg || !msg.sender || !msg.receiver) return;

            const senderIdStr = msg.sender._id ? msg.sender._id.toString() : msg.sender.toString();
            const currentUserIdStr = currentUserId.toString();

            const isSender = senderIdStr === currentUserIdStr;
            const otherUser = isSender ? msg.receiver : msg.sender;

            if (!otherUser || typeof otherUser !== 'object') return;

            const otherUserIdStr = otherUser._id ? otherUser._id.toString() : otherUser.toString();

            if (!chatsMap.has(otherUserIdStr)) {
                // Decrypt the last message preview
                const msgObj = msg.toObject ? msg.toObject() : { ...msg };
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
        console.error('getChatHistory error:', error);
        res.status(500).json({ message: error.message });
    }
};
