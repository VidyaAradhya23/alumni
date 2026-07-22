const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY ? Buffer.from(process.env.ENCRYPTION_KEY, 'hex') : Buffer.alloc(32); // 32 bytes (must be provided via env!)
const IV_LENGTH = 16; // For AES, this is always 16

const encrypt = (text) => {
    if (!process.env.ENCRYPTION_KEY) {
        console.warn('ENCRYPTION_KEY is not set! Messages are not being properly encrypted.');
    }
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
};

const decrypt = (text) => {
    if (!text || typeof text !== 'string') return text;
    
    const parts = text.split(':');
    // If it doesn't look like an encrypted format (iv:cipher), return original text for backward compatibility
    if (parts.length !== 2 || parts[0].length !== 32) {
        return text; 
    }

    try {
        const iv = Buffer.from(parts[0], 'hex');
        const encryptedText = Buffer.from(parts[1], 'hex');
        const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        console.error('Decryption failed for a message, falling back to original string', error.message);
        return text; // Return original if decryption fails (might be a false positive on the format)
    }
};

module.exports = { encrypt, decrypt };
