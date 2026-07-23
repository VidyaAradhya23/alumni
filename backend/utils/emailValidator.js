const dns = require('dns').promises;

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

// Well-known email domains — guaranteed valid, skip DNS lookup entirely
const TRUSTED_DOMAINS = new Set([
    'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.in', 'yahoo.co.in',
    'outlook.com', 'hotmail.com', 'live.com', 'msn.com',
    'icloud.com', 'me.com', 'mac.com',
    'protonmail.com', 'proton.me',
    'rediffmail.com', 'rediff.com',
    'aol.com',
    'zoho.com',
    'yandex.com', 'yandex.ru',
    'tutanota.com', 'gmx.com', 'mail.com'
]);

// DNS MX lookup with a hard 2-second timeout
const resolveMxWithTimeout = (domain, timeoutMs = 2000) => {
    return new Promise((resolve) => {
        let settled = false;

        const timer = setTimeout(() => {
            if (!settled) {
                settled = true;
                resolve(null); // Timed out — treat as valid (pass through)
            }
        }, timeoutMs);

        dns.resolveMx(domain)
            .then((records) => {
                if (!settled) {
                    settled = true;
                    clearTimeout(timer);
                    resolve(records);
                }
            })
            .catch(() => {
                if (!settled) {
                    settled = true;
                    clearTimeout(timer);
                    resolve(null); // DNS failed — treat as valid (pass through)
                }
            });
    });
};

/**
 * Validates email format, disposable email check, MX domain record existence.
 * Skips DNS lookup entirely for trusted/popular domains to eliminate cold-start delay.
 * @param {string} email 
 * @returns {Promise<{ valid: boolean, message?: string }>}
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

    // 2. Check Disposable / Temporary Email Domain (O(1) Set lookup — instant)
    if (DISPOSABLE_DOMAINS.has(domain)) {
        return { valid: false, message: 'Temporary Emails Not Allowed' };
    }

    // 3. Skip DNS lookup for trusted popular providers (avoids 2-5s cold DNS delay)
    if (!TRUSTED_DOMAINS.has(domain)) {
        const mxRecords = await resolveMxWithTimeout(domain, 2000);
        if (mxRecords !== null && mxRecords.length === 0) {
            return { valid: false, message: 'Email Domain Not Valid' };
        }
        // null = timeout / DNS error = allow through (fail-open for user experience)
    }

    return {
        valid: true,
        message: 'Email address is valid and verified for registration.'
    };
};

module.exports = { validateEmailFull, DISPOSABLE_DOMAINS };
