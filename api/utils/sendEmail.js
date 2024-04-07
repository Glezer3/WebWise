import nodemailer from "nodemailer";

export const sendEmail = async (option) => {
    const transporter = nodemailer.createTransport({
        service: process.env.MAIL_SERVICE,
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: true,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
        },
        tls: {
            ciphers: "SSLv3",
            rejectUnauthorized: false,
        },
    });

    const emailOptions = {
        from: "WebWiseSupport@webwise.com",
        to: option.email,
        subject: option.subject,
        text: option.message,
        html: option.html,
    };

    await transporter.sendMail(emailOptions);
}

export const generateEmailTemplateVerify = code => {
    return `
        <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <style>
                @media only screen and (max-width: 620px) {
                    h1 {
                        font-size: 20px;
                        padding: 5px;
                    }
                }
                </style>
            </head>
                <body>
                <div>
                <div style="max-width: 800px; margin: 0 auto; font-family: sans-serif; color: #272727;>
                    <h1 style="background: #f6f6f6; padding: 10px; text-align: center; color: #272727;">
                    Email verification request</h1>
                    <p>We have received an email verification request. Please use the link below to verify your email:</p><br><br>
                    <p style="max-width: 100%; min-height: fit-content; margin: 0 auto; font-weight: bold; text-align: center; background: #f6f6f6; border-radius: 5px; font-size: 30px; word-break: break-word"><a href="${code}" style="color: #272727; text-decoration: none">Verify email</a></p><br><br>
                    <p>Please remember that this link for email verification will be valid only for 1 hour.</p>
                </div>
                </div>
                </body>

            </html>`
};

export const generateEmailTemplateReset = code => {
    return `
        <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <style>
                @media only screen and (max-width: 620px) {
                    h1 {
                        font-size: 20px;
                        padding: 5px;
                    }
                }
                </style>
            </head>
                <body>
                <div>
                <div style="max-width: 800px; margin: 0 auto; font-family: sans-serif; color: #272727;>
                    <h1 style="background: #f6f6f6; padding: 10px; text-align: center; color: #272727;">
                    Password reset request</h1>
                    <p>We have received a password reset request. Please use the link below to reset your password:</p><br><br>
                    <p style="max-width: 100%; min-height: fit-content; margin: 0 auto; font-weight: bold; text-align: center; background: #f6f6f6; border-radius: 5px; font-size: 30px; word-break: break-word"><a href="${code}" style="color: #272727; text-decoration: none">Reset Password</a></p><br><br>
                    <p>Please remember that this link for password reset will be valid only for 10 minutes.</p>
                </div>
                </div>
                </body>

            </html>`
};