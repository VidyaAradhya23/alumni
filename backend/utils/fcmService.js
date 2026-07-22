// Firebase Cloud Messaging (FCM) Push Notification Utility
const axios = require('axios');

/**
 * Send a push notification using Firebase Cloud Messaging (FCM) API v1
 * @param {string} fcmToken - Recipient's FCM device token
 * @param {string} title - Notification title
 * @param {string} body - Notification message body
 * @param {object} dataPayload - Optional data key-value pairs
 */
const sendFCMNotification = async (fcmToken, title, body, dataPayload = {}) => {
    if (!fcmToken) {
        console.log('[FCM] No device token provided, skipping push notification.');
        return false;
    }

    try {
        const serverKey = process.env.FCM_SERVER_KEY;
        if (!serverKey) {
            console.log('[FCM] FCM_SERVER_KEY not set. Simulating push notification output:');
            console.log(`[FCM Notification] TO: ${fcmToken} | TITLE: "${title}" | BODY: "${body}"`);
            return true;
        }

        const message = {
            to: fcmToken,
            notification: {
                title,
                body,
                sound: 'default',
                badge: '1'
            },
            data: dataPayload,
            priority: 'high'
        };

        const response = await axios.post('https://fcm.googleapis.com/fcm/send', message, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `key=${serverKey}`
            }
        });

        console.log('[FCM] Notification sent successfully:', response.data);
        return true;
    } catch (error) {
        console.error('[FCM] Error sending push notification:', error.message);
        return false;
    }
};

module.exports = { sendFCMNotification };
