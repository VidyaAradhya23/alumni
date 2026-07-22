const dns = require('dns').promises;
const User = require('../models/User');

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
        return { valid: false, message: 'Email address is required' };
    }

    const emailClean = email.trim().toLowerCase();

    // 1. Format Validation (RFC 5322 regex compliant)
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!emailRegex.test(emailClean)) {
        return { valid: false, message: 'Invalid email address format' };
    }

    const parts = emailClean.split('@');
    if (parts.length !== 2) {
        return { valid: false, message: 'Invalid email address structure' };
    }

    const domain = parts[1];

    // 2. Check Disposable / Temporary Email Domain
    if (DISPOSABLE_DOMAINS.has(domain)) {
        return { valid: false, message: 'Disposable or temporary email addresses are not allowed. Please use a permanent email.' };
    }

    // 3. Check Domain Exists & Has Valid MX (Mail Exchange) Records
    try {
        const mxRecords = await dns.resolveMx(domain);
        if (!mxRecords || mxRecords.length === 0) {
            return { valid: false, message: `Domain '@${domain}' does not have valid mail server (MX) records to receive emails.` };
        }
    } catch (dnsErr) {
        // Fallback: Check A/AAAA record if MX check fails or times out
        try {
            const aRecords = await dns.resolve(domain);
            if (!aRecords || aRecords.length === 0) {
                return { valid: false, message: `Domain '@${domain}' could not be resolved on DNS. Please check for typos.` };
            }
        } catch (e) {
            return { valid: false, message: `Email domain '@${domain}' does not exist or has no active mail server.` };
        }
    }

    // 4. Check Duplicate Email in Database
    const existingUser = await User.findOne({ email: emailClean });
    if (existingUser) {
        return { valid: false, message: 'An account with this email address already exists.' };
    }

    return {
        valid: true,
        message: 'Email address is valid, available, and verified for registration.'
    };
};

module.exports = { validateEmailFull, DISPOSABLE_DOMAINS };
