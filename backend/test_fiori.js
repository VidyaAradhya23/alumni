const crypto = require('crypto');

const secret = process.env.FIORI_SECRET || 'dev_secret_please_change';

const payload = {
    email: 'test@example.com', // Replace with an email in the DB
    iat: Math.floor(Date.now() / 1000),
    nonce: crypto.randomBytes(16).toString('hex')
};

const payloadString = JSON.stringify(payload);
const payloadBase64 = Buffer.from(payloadString, 'utf8').toString('base64');
const payloadBase64Url = payloadBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

const signature = crypto.createHmac('sha256', secret).update(payloadBase64Url).digest('hex');

const url = `http://localhost:5000/api/auth/fiori-sso?d=${payloadBase64Url}&s=${signature}`;

console.log("To test locally, open this URL in your browser:");
console.log(url);
