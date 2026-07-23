const dns = require('dns').promises;
const User = require('../models/User');
const connectDB = require('../config/db');

// Common Disposable / Temporary Email Provider Domains
const DISPOSABLE_DOMAINS = new Set([
    'mailinator.com',
    'tempmail.com',
    'temp-mail.org',
    '10minutemail.com',
    'guerrillamail.com',
    'guerrillamail.net',
    'guerrillamail.org',
    'yopmail.com',
    'trashmail.com',
    'dispostable.com',
    'sharklasers.com',
    'getnada.com',
    'boun.cr',
    'crazymailing.com',
    'fakeinbox.com',
    'generator.email',
    'maildrop.cc',
    'inboxalias.com',
    'throwawaymail.com',
    'tempail.com',
    'mohmal.com',
    'mytemp.email'
]);

/**
 * Validates email format, disposable email check, MX domain record existence, and DB availability.
 * @param {string} email 
 * @returns {Promise<{ valid: boolean, message?: string, errors?: string[] }>}
 */
const validateEmailFull = async (email) => {
    if (!email || typeof email !== 'string') {
        return { valid: false, message: 'Enter a Valid Email' };
    }

    const emailClean = email.trim().toLowerCase();

    // 1. Format Validation (RFC 5322 regex compliant)
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!emailRegex.test(emailClean)) {
        return { valid: false, message: 'Enter a Valid Email' };
    }

    const parts = emailClean.split('@');
    if (parts.length !== 2) {
        return { valid: false, message: 'Enter a Valid Email' };
    }

    const domain = parts[1];

    // 2. Check Domain Exists & Has Valid MX (Mail Exchange) Records
    try {
        const mxRecords = await dns.resolveMx(domain);
        if (!mxRecords || mxRecords.length === 0) {
            return { valid: false, message: 'Email Domain Not Valid' };
        }
    } catch (dnsErr) {
        // Fallback: Check A/AAAA record if MX check fails or times out
        try {
            const aRecords = await dns.resolve(domain);
            if (!aRecords || aRecords.length === 0) {
                return { valid: false, message: 'Email Domain Not Valid' };
            }
        } catch (e) {
            return { valid: false, message: 'Email Domain Not Valid' };
        }
    }

    // 3. Check Disposable / Temporary Email Domain
    if (DISPOSABLE_DOMAINS.has(domain)) {
        return { valid: false, message: 'Temporary Emails Not Allowed' };
    }

    // 4. Check Duplicate Email in Database
    try {
        await connectDB();
    } catch (e) {
        console.error('Database connection note in validator:', e);
    }
    const existingUser = await User.findOne({ email: emailClean });
    if (existingUser) {
        return { valid: false, message: 'Email Already Exists' };
    }

    return {
        valid: true,
        message: 'Email address is valid and verified for registration.'
    };
};

module.exports = { validateEmailFull, DISPOSABLE_DOMAINS };
