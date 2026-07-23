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

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            let transporter;
            let fromAddr = process.env.SENDGRID_FROM_EMAIL || process.env.SMTP_FROM || '"Alumni Network" <rvmediadevelopers@gmail.com>';

            if (hasSendGrid && attempt === 1) {
                console.log(`[EMAIL DISPATCH] Attempt 1: Using SendGrid API for ${userEmail}...`);
                transporter = nodemailer.createTransport({
                    host: 'smtp.sendgrid.net',
                    port: 587,
                    secure: false,
                    auth: {
                        user: 'apikey',
                        pass: process.env.SENDGRID_API_KEY
                    }
                });
                fromAddr = process.env.SENDGRID_FROM_EMAIL ? `"Alumni Network" <${process.env.SENDGRID_FROM_EMAIL}>` : '"Alumni Network" <rvmediadevelopers@gmail.com>';
            } else if (isConfigured) {
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

                try {
                    await transporter.verify();
                    console.log("[SMTP CONNECTED] Real SMTP Transporter Verified Successfully!");
                } catch (vErr) {
                    console.error("[SMTP VERIFY NOTICE]:", vErr.message);
                }
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

            const plainTextBody = `Your Alumni Network Email Verification Code is: ${otp}\n\nPlease enter this 6-digit code in the app to complete your registration.\nThis code will expire in 5 minutes.\n\nIf you did not request this code, please ignore this email.`;

            const htmlTemplate = `
                <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 580px; margin: 0 auto; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; background-color: #FFFFFF;">
                    <div style="background: linear-gradient(135deg, #003366 0%, #002244 100%); padding: 30px 24px; text-align: center;">
                        <h1 style="color: #FFFFFF; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px;">Alumni Network Verification</h1>
                    </div>
                    <div style="padding: 36px 28px; background-color: #FFFFFF;">
                        <p style="font-size: 16px; color: #1E293B; margin-top: 0; line-height: 1.5;">Hello,</p>
                        <p style="font-size: 15px; color: #334155; line-height: 1.6;">
                            Your 6-digit verification code is below. Please enter this code into the registration form to verify your email address:
                        </p>
                        <div style="text-align: center; margin: 28px 0;">
                            <div style="background-color: #F1F5F9; color: #003366; padding: 18px 36px; border-radius: 10px; font-weight: 800; font-size: 34px; letter-spacing: 8px; border: 2px dashed #003366; display: inline-block; font-family: monospace;">
                                ${otp}
                            </div>
                        </div>
                        <p style="font-size: 13px; color: #64748B; line-height: 1.5; text-align: center; margin-bottom: 0;">
                            ⏱️ This verification code is valid for <strong>5 minutes</strong>.
                        </p>
                    </div>
                    <div style="background-color: #F8FAFC; padding: 16px; text-align: center; border-top: 1px solid #E2E8F0;">
                        <p style="font-size: 12px; color: #94A3B8; margin: 0;">
                            © ${new Date().getFullYear()} RV Educational Alumni Platform. All rights reserved.
                        </p>
                    </div>
                </div>
            `;

            const mailOptions = {
                from: fromAddr,
                to: userEmail,
                replyTo: 'rvmediadevelopers@gmail.com',
                subject: `${otp} is your Alumni Network Verification Code`,
                text: plainTextBody,
                html: htmlTemplate,
                headers: {
                    'X-Priority': '1',
                    'Importance': 'high'
                }
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
