const nodemailer = require('nodemailer');

const sendWelcomeEmail = async (userEmail, userName) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // Email HTML Template
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
                    <p style="font-size: 16px; color: #334155; line-height: 1.6;">
                        Once approved, you'll be able to connect with fellow graduates, explore job opportunities, and engage with the community.
                    </p>
                    <div style="text-align: center; margin: 32px 0;">
                        <a href="https://alumni-app-nine.vercel.app" style="background-color: #003366; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">
                            Go to Dashboard
                        </a>
                    </div>
                    <p style="font-size: 14px; color: #64748B; line-height: 1.5; margin-top: 32px;">
                        If you have any questions or need support, feel free to reply directly to this email.
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

module.exports = {
    sendWelcomeEmail
};
