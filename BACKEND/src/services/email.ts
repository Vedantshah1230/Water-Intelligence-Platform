import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configure the email transporter using environment variables
// For hackathon purposes, you can use Gmail or a service like Ethereal (fake SMTP)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || 'ethereal_user', // Replace in .env
    pass: process.env.EMAIL_PASS || 'ethereal_pass', // Replace in .env
  },
});

/**
 * Send an email alert to the authorities
 */
export const sendAlertEmail = async (subject: string, message: string) => {
  try {
    const mailOptions = {
      from: '"AquaSense AI 🚨" <alerts@aquasense.ai>',
      to: process.env.ALERT_EMAIL_RECIPIENT || 'authorities@city.gov',
      subject: subject,
      text: message,
      html: `<h2>AquaSense AI Alert</h2><p><b>Status:</b> Critical</p><p>${message}</p>`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Service] Alert sent successfully: ${info.messageId}`);
    
    // If using Ethereal, you can view the fake email URL here:
    if (process.env.EMAIL_HOST === 'smtp.ethereal.email') {
        console.log(`[Email Service] Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
  } catch (error: any) {
    console.error(`[Email Service] Failed to send email: ${error.message}`);
  }
};
