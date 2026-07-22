// Socket.IO Realtime Messaging Event Handler
const setupSocketIO = (io) => {
    console.log('[Socket.IO] Realtime messaging engine initialized.');

    io.on('connection', (socket) => {
        console.log(`[Socket.IO] Client connected: ${socket.id}`);

        // Join personal user room
        socket.on('join_room', (userId) => {
            if (userId) {
                socket.join(userId);
                console.log(`[Socket.IO] User ${userId} joined room ${userId}`);
            }
        });

        // Send realtime message to target room
        socket.on('send_message', (data) => {
            const { receiverId, message } = data;
            if (receiverId && message) {
                io.to(receiverId).emit('receive_message', message);
                console.log(`[Socket.IO] Message emitted to receiver: ${receiverId}`);
            }
        });

        // Broadcast typing status
        socket.on('typing', (data) => {
            const { receiverId, isTyping } = data;
            if (receiverId) {
                io.to(receiverId).emit('user_typing', { senderId: socket.id, isTyping });
            }
        });

        // Disconnect handler
        socket.on('disconnect', () => {
            console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
        });
    });
};

module.exports = setupSocketIO;
