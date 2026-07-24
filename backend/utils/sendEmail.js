const nodemailer = require('nodemailer');

// ─── Welcome Email ───────────────────────────────────────────────────────────
const sendWelcomeEmail = async (userEmail, userName) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.sendgrid.net',
            port: parseInt(process.env.SMTP_PORT || '587', 10),
            secure: false,
            auth: {
                user: 'apikey',
                pass: process.env.SENDGRID_API_KEY,
            },
        });

        const htmlTemplate = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #003366; padding: 24px; text-align: center;">
                    <h1 style="color: #FFFFFF; margin: 0; font-size: 24px;">Welcome to the Alumni Network!</h1>
                </div>
                <div style="padding: 32px; background-color: #FFFFFF;">
                    <p style="font-size: 16px; color: #334155; line-height: 1.6;">
                        Hi <strong>${userName}</strong>,
                    </p>
                    <p style="font-size: 16px; color: #334155; line-height: 1.6;">
                        We are thrilled to welcome you to our official Alumni platform. Your account has been successfully created and is awaiting administrator approval.
                    </p>
                </div>
                <div style="background-color: #F8FAFC; padding: 16px; text-align: center; border-top: 1px solid #E2E8F0;">
                    <p style="font-size: 12px; color: #94A3B8; margin: 0;">
                        © ${new Date().getFullYear()} Alumni Network. All rights reserved.
                    </p>
                </div>
            </div>
        `;

        await transporter.sendMail({
            from: process.env.SMTP_FROM || `"Alumni Network" <${process.env.SENDGRID_FROM_EMAIL}>`,
            to: userEmail,
            subject: 'Welcome to the Alumni Network!',
            text: `Hi ${userName}, Welcome to the Alumni Network! Your account has been created and is pending Admin approval.`,
            html: htmlTemplate,
        });

        console.log(`[WELCOME EMAIL] Sent to ${userEmail}`);
        return true;
    } catch (error) {
        console.error('[WELCOME EMAIL ERROR]:', error.message);
        return false;
    }
};

// ─── OTP Email via SendGrid REST API (fastest path) ──────────────────────────
const sendOtpEmail = async (userEmail, otp) => {
    const apiKey = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'rvmediadevelopers@gmail.com';

    const plainText = `Your Alumni Network verification code is: ${otp}\n\nThis code expires in 5 minutes. Do not share it with anyone.`;

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; border: 1px solid #E2E8F0; border-radius: 10px; overflow: hidden;">
            <div style="background-color: #003366; padding: 22px; text-align: center;">
                <h1 style="color: #FFFFFF; margin: 0; font-size: 20px; font-weight: 700;">Email Verification</h1>
            </div>
            <div style="padding: 32px 28px; background-color: #FFFFFF;">
                <p style="font-size: 15px; color: #334155; margin-top: 0;">Hello,</p>
                <p style="font-size: 15px; color: #334155; line-height: 1.6;">
                    Use the code below to verify your email for Alumni Network registration:
                </p>
                <div style="text-align: center; margin: 28px 0;">
                    <div style="background-color: #F1F5F9; color: #003366; padding: 16px 32px; border-radius: 8px; font-weight: bold; font-size: 34px; letter-spacing: 8px; border: 2px solid #CBD5E1; display: inline-block;">
                        ${otp}
                    </div>
                </div>
                <p style="font-size: 13px; color: #64748B; text-align: center; margin-bottom: 0;">
                    This code expires in <strong>5 minutes</strong>. If you did not request this, ignore this email.
                </p>
            </div>
            <div style="background-color: #F8FAFC; padding: 14px; text-align: center; border-top: 1px solid #E2E8F0;">
                <p style="font-size: 12px; color: #94A3B8; margin: 0;">© ${new Date().getFullYear()} Alumni Network. All rights reserved.</p>
            </div>
        </div>
    `;

    // Primary: SendGrid REST API (fastest, no SMTP handshake)
    if (apiKey && apiKey.startsWith('SG.')) {
        try {
            const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    personalizations: [{ to: [{ email: userEmail }] }],
                    from: { email: fromEmail, name: 'Alumni Network' },
                    subject: 'Your Verification Code - Alumni Network',
                    content: [
                        { type: 'text/plain', value: plainText },
                        { type: 'text/html', value: html }
                    ]
                })
            });

            if (response.status >= 200 && response.status < 300) {
                console.log(`[SENDGRID OK] OTP sent to ${userEmail} — status ${response.status}`);
                return { success: true };
            }

            const errBody = await response.text();
            console.error(`[SENDGRID ERROR] Status ${response.status}:`, errBody);
            // Fall through to SMTP fallback
        } catch (fetchErr) {
            console.error('[SENDGRID FETCH ERROR]:', fetchErr.message);
            // Fall through to SMTP fallback
        }
    }

    // Fallback: SMTP via SendGrid (same credentials, SMTP protocol)
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.sendgrid.net',
            port: 587,
            secure: false,
            auth: { user: 'apikey', pass: apiKey },
            connectionTimeout: 6000,
            greetingTimeout: 6000,
            socketTimeout: 10000
        });

        await transporter.sendMail({
            from: `"Alumni Network" <${fromEmail}>`,
            to: userEmail,
            subject: 'Your Verification Code - Alumni Network',
            text: plainText,
            html
        });

        console.log(`[SMTP FALLBACK OK] OTP sent to ${userEmail}`);
        return { success: true };
    } catch (smtpErr) {
        console.error('[SMTP FALLBACK ERROR]:', smtpErr.message);
        return { success: false, error: smtpErr.message };
    }
};

module.exports = { sendWelcomeEmail, sendOtpEmail };
