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
            from: process.env.SMTP_FROM || '"Alumni Network" <noreply@alumni.edu>',
            to: userEmail,
            subject: 'Welcome to the Alumni Network! 🎉',
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
    const isConfigured = process.env.SMTP_USER && process.env.SMTP_USER !== 'your_email@gmail.com';

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            let transporter;
            let fromAddr = process.env.SMTP_FROM || '"Alumni Network" <noreply@alumni.edu>';

            if (isConfigured) {
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

                try {
                    await transporter.verify();
                    console.log("[SMTP CONNECTED] Real SMTP Transporter Verified Successfully!");
                } catch (vErr) {
                    console.error("[SMTP VERIFY NOTICE]:", vErr.message);
                }
            } else {
                console.log(`[SMTP Ethereal] Creating auto test account for real SMTP email delivery to ${userEmail}...`);
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

            const htmlTemplate = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #003366; padding: 24px; text-align: center;">
                        <h1 style="color: #FFFFFF; margin: 0; font-size: 24px;">Verify Your Email</h1>
                    </div>
                    <div style="padding: 32px; background-color: #FFFFFF;">
                        <p style="font-size: 16px; color: #334155; line-height: 1.6;">
                            Hi there,
                        </p>
                        <p style="font-size: 16px; color: #334155; line-height: 1.6;">
                            Thank you for registering. Please use the 6-digit verification code below to complete your registration:
                        </p>
                        <div style="text-align: center; margin: 32px 0;">
                            <span style="background-color: #F8FAFC; color: #003366; padding: 16px 32px; border-radius: 8px; font-weight: bold; font-size: 32px; letter-spacing: 6px; border: 1px solid #E2E8F0; display: inline-block;">
                                ${otp}
                            </span>
                        </div>
                        <p style="font-size: 14px; color: #64748B; line-height: 1.5; margin-top: 32px; text-align: center;">
                            This code will expire in 5 minutes. If you didn't request this, you can safely ignore this email.
                        </p>
                    </div>
                </div>
            `;

            const mailOptions = {
                from: fromAddr,
                to: userEmail,
                subject: 'Your 6-Digit Verification Code',
                html: htmlTemplate,
            };

            const info = await transporter.sendMail(mailOptions);
            const previewUrl = nodemailer.getTestMessageUrl(info);
            console.log(`[SMTP SUCCESS] OTP email sent successfully to ${userEmail}! MessageId: %s`, info.messageId);
            if (previewUrl) {
                console.log(`[SMTP EMAIL PREVIEW LINK]: ${previewUrl}`);
            }

            return { 
                success: true, 
                messageId: info.messageId,
                previewUrl: previewUrl || null
            };
        } catch (error) {
            lastError = error;
            console.error(`[SMTP ERROR] Attempt ${attempt}/${maxRetries} failed for ${userEmail}:`, error.message);
            if (attempt < maxRetries) {
                await new Promise(res => setTimeout(res, 1000));
            }
        }
    }
    return { success: false, error: lastError?.message || 'SMTP connection failed' };
};

module.exports = {
    sendWelcomeEmail,
    sendOtpEmail
};
