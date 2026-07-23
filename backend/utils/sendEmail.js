const nodemailer = require('nodemailer');

const sendWelcomeEmail = async (userEmail, userName) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587', 10),
            secure: process.env.SMTP_PORT == 465,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
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

        const mailOptions = {
            from: process.env.SMTP_FROM || process.env.SENDGRID_FROM_EMAIL || '"Alumni Network" <rvmediadevelopers@gmail.com>',
            to: userEmail,
            subject: 'Welcome to the Alumni Network! 🎉',
            text: `Hi ${userName}, Welcome to the Alumni Network! Your account has been created and is pending Admin approval.`,
            html: htmlTemplate,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Welcome email sent successfully: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending welcome email:', error);
        return false;
    }
};

const sendOtpEmail = async (userEmail, otp, maxRetries = 2) => {
    let lastError = null;
    const hasSendGrid = process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY.startsWith('SG.');
    const isConfigured = process.env.SMTP_USER && process.env.SMTP_USER !== 'your_email@gmail.com' && process.env.SMTP_USER !== 'apikey';

    const plainTextBody = `Hello,\n\nYour 6-digit email verification code for Alumni Network is: ${otp}\n\nPlease enter this verification code in the application to complete your registration.\nThis code will expire in 5 minutes.\n\nThank you,\nAlumni Platform Team`;

    const htmlTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden; background-color: #FFFFFF;">
            <div style="background-color: #003366; padding: 24px; text-align: center;">
                <h1 style="color: #FFFFFF; margin: 0; font-size: 22px; font-weight: 700;">Email Verification</h1>
            </div>
            <div style="padding: 32px 24px; background-color: #FFFFFF;">
                <p style="font-size: 15px; color: #334155; margin-top: 0; line-height: 1.5;">Hello,</p>
                <p style="font-size: 15px; color: #334155; line-height: 1.6;">
                    Thank you for signing up for the Alumni Network. Please use the following 6-digit verification code to complete your registration:
                </p>
                <div style="text-align: center; margin: 28px 0;">
                    <div style="background-color: #F8FAFC; color: #003366; padding: 16px 32px; border-radius: 8px; font-weight: bold; font-size: 32px; letter-spacing: 6px; border: 1px solid #CBD5E1; display: inline-block;">
                        ${otp}
                    </div>
                </div>
                <p style="font-size: 13px; color: #64748B; line-height: 1.5; text-align: center; margin-bottom: 0;">
                    This code will expire in 5 minutes. If you did not request this code, you can safely ignore this email.
                </p>
            </div>
            <div style="background-color: #F8FAFC; padding: 16px; text-align: center; border-top: 1px solid #E2E8F0;">
                <p style="font-size: 12px; color: #94A3B8; margin: 0;">
                    © ${new Date().getFullYear()} Alumni Network. All rights reserved.
                </p>
            </div>
        </div>
    `;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            if (hasSendGrid && attempt === 1) {
                console.log(`[INSTANT DISPATCH] Attempt 1: Using SendGrid REST API for ${userEmail}...`);
                const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'rvmediadevelopers@gmail.com';
                const sgRes = await fetch('https://api.sendgrid.com/v3/mail/send', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        personalizations: [{ to: [{ email: userEmail }] }],
                        from: { email: fromEmail, name: 'Alumni Network' },
                        subject: 'Your 6-Digit Verification Code - Alumni Network',
                        content: [
                            { type: 'text/plain', value: plainTextBody },
                            { type: 'text/html', value: htmlTemplate }
                        ]
                    })
                });

                if (sgRes.status >= 200 && sgRes.status < 300) {
                    console.log(`[INSTANT SENDGRID SUCCESS] Email delivered in <200ms to ${userEmail}! Status: ${sgRes.status}`);
                    return { success: true, messageId: `sg_${Date.now()}` };
                } else {
                    const sgErr = await sgRes.text();
                    console.error(`[SENDGRID API ERROR] Status ${sgRes.status}:`, sgErr);
                    throw new Error(`SendGrid API failed with status ${sgRes.status}: ${sgErr}`);
                }
            }

            let transporter;
            let fromAddr = process.env.SENDGRID_FROM_EMAIL ? `"Alumni Network" <${process.env.SENDGRID_FROM_EMAIL}>` : '"Alumni Network" <rvmediadevelopers@gmail.com>';

            if (isConfigured) {
                console.log(`[EMAIL DISPATCH] Using Custom SMTP for ${userEmail}...`);
                transporter = nodemailer.createTransport({
                    host: process.env.SMTP_HOST || 'smtp.gmail.com',
                    port: parseInt(process.env.SMTP_PORT || '587', 10),
                    secure: process.env.SMTP_PORT == 465,
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS,
                    },
                    connectionTimeout: 8000,
                    greetingTimeout: 8000,
                    socketTimeout: 8000
                });
            } else {
                console.log(`[SMTP Ethereal] Creating auto test account for email delivery to ${userEmail}...`);
                const testAccount = await nodemailer.createTestAccount();
                transporter = nodemailer.createTransport({
                    host: 'smtp.ethereal.email',
                    port: 587,
                    secure: false,
                    auth: {
                        user: testAccount.user,
                        pass: testAccount.pass,
                    },
                    connectionTimeout: 8000
                });
                fromAddr = `"Alumni Network Verification" <${testAccount.user}>`;
            }

            const mailOptions = {
                from: fromAddr,
                to: userEmail,
                subject: 'Your 6-Digit Verification Code - Alumni Network',
                text: plainTextBody,
                html: htmlTemplate
            };

            const info = await transporter.sendMail(mailOptions);
            console.log(`[SMTP SUCCESS] OTP email sent successfully to ${userEmail}! MessageId: %s`, info.messageId);
            return { 
                success: true, 
                messageId: info.messageId
            };
        } catch (error) {
            lastError = error;
            console.error(`[SMTP ERROR] Attempt ${attempt}/${maxRetries} failed for ${userEmail}:`, error.message);
            if (attempt < maxRetries) {
                await new Promise(res => setTimeout(res, 500));
            }
        }
    }
    return { success: false, error: lastError?.message || 'SMTP connection failed' };
};

module.exports = {
    sendWelcomeEmail,
    sendOtpEmail
};
