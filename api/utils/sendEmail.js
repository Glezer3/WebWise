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
};

export const generateEmailTemplateVerify = (code) => {
  return `
        <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          color: #333333;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #4c8bf5;
          padding: 15px;
          text-align: center;
          color: #ffffff;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .content {
          padding: 20px;
          text-align: center;
          color: #333333;
        }
        .content p {
          font-size: 16px;
          line-height: 1.6;
          color: #555555;
        }
        .verify-link {
          display: inline-block;
          margin: 20px 0;
          padding: 15px 25px;
          background-color: #4c8bf5;
          color: #ffffff !important;
          font-weight: bold;
          font-size: 18px;
          text-decoration: none;
          border-radius: 5px;
        }
        .footer {
          font-size: 12px;
          color: #888888;
          text-align: center;
          padding: 15px 0;
          border-top: 1px solid #eeeeee;
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Email Verification Request</h1>
        </div>
        <div class="content">
          <p>We have received a request to verify your <strong>email address</strong>. Please click the link below to confirm your email:</p>
          <a href="${code}" class="verify-link">Verify Email</a>
          <p>This verification link is valid for 1 hour.</p>
        </div>
        <div class="footer">
          This is an automated message. Please do not reply.
        </div>
      </div>
    </body>
    </html>
  `;
};

export const generateNewEmailTemplateVerify = (code) => {
  return `
        <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          color: #333333;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #4c8bf5;
          padding: 15px;
          text-align: center;
          color: #ffffff;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .content {
          padding: 20px;
          text-align: center;
          color: #333333;
        }
        .content p {
          font-size: 16px;
          line-height: 1.6;
          color: #555555;
        }
        .verify-link {
          display: inline-block;
          margin: 20px 0;
          padding: 15px 25px;
          background-color: #4c8bf5;
          color: #ffffff !important;
          font-weight: bold;
          font-size: 18px;
          text-decoration: none;
          border-radius: 5px;
        }
        .footer {
          font-size: 12px;
          color: #888888;
          text-align: center;
          padding: 15px 0;
          border-top: 1px solid #eeeeee;
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Email Verification Request</h1>
        </div>
        <div class="content">
          <p>We have received a request to verify your <strong>new email address</strong>. Please click the link below to confirm your new email:</p>
          <a href="${code}" class="verify-link">Verify New Email</a>
          <p>This verification link is valid for 1 hour.</p>
        </div>
        <div class="footer">
          This is an automated message. Please do not reply.
        </div>
      </div>
    </body>
    </html>
  `;
};

export const generateEmailTemplateReset = (code) => {
  return `
        <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          color: #333333;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #4c8bf5;
          padding: 15px;
          text-align: center;
          color: #ffffff;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .content {
          padding: 20px;
          text-align: center;
          color: #333333;
        }
        .content p {
          font-size: 16px;
          line-height: 1.6;
          color: #555555;
        }
        .reset-link {
          display: inline-block;
          margin: 20px 0;
          padding: 15px 25px;
          background-color: #4c8bf5;
          color: #ffffff !important;
          font-weight: bold;
          font-size: 18px;
          text-decoration: none;
          border-radius: 5px;
        }
        .footer {
          font-size: 12px;
          color: #888888;
          text-align: center;
          padding: 15px 0;
          border-top: 1px solid #eeeeee;
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <p>We have received a request to <strong>reset your password</strong>. Please click the link below to proceed:</p>
          <a href="${code}" class="reset-link">Reset Password</a>
          <p>This password reset link is valid for 10 minutes.</p>
        </div>
        <div class="footer">
          This is an automated message. Please do not reply.
        </div>
      </div>
    </body>
    </html>
  `;
};

export const generateEmailTemplateAlert = (alerts) => {
  const parameters = alerts.map(({ parameter }) => parameter).join(", ");
  const alert = alerts
    .map(
      ({ parameter, value, safeRange }) => `
    <div class="alert-box">
      <strong>${parameter}</strong>
      <p style="margin: 10px 0 0 0;"></p>
      Current Level: ${value}
      <p></p>
      Safe Range: ${safeRange[0]} - ${safeRange[1]}
    </div>
  `
    )
    .join("");

  return `  
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          color: #333333;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #4c8bf5;
          padding: 15px;
          text-align: center;
          color: #ffffff;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .content {
          padding: 20px;
          text-align: center;
          color: #333333;
        }
        .content p {
          font-size: 16px;
          line-height: 1.6;
          color: #555555;
        }
        .alert-box {
          background-color: #f4f4f4;
          padding: 15px;
          border: 2px solid #4c8bf5;
          border-radius: 5px;
          font-weight: bold;
          font-size: 18px;
          color: #4c8bf5 !important;
          margin: 20px 0;
        }
        .alert-box strong {
          font-size: 22px;
        }
        .alert-box p {
          margin: 5px auto;
        }
        .footer {
          font-size: 12px;
          color: #888888;
          text-align: center;
          padding: 15px 0;
          border-top: 1px solid #eeeeee;
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⚠️ Alert: ${parameters} ${
    alerts.length === 1 ? "Level" : "Levels"
  } Exceeded</h1>
        </div>
        <div class="content">
          <p>Dear User,</p>
          <p>We have detected that the <strong>${parameters}</strong> ${
    alerts.length === 1 ? "level has" : "levels have"
  } exceeded the safe range in your monitored environment.</p>
            ${alert}
          <p>Please take immediate action to ensure a safe environment.</p>
        </div>
        <div class="footer">
          This is an automated message. Please do not reply.
        </div>
      </div>
    </body>
    </html>
  `;
};
