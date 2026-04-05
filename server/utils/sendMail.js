import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create a transporter using SMTP credentials from environment variables.
// For production, replace with your actual SMTP server details.
const port = parseInt(process.env.SMTP_PORT) || 465;

// Create a transporter using SMTP credentials from environment variables.
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: port,
  secure: port === 465, // true for 465, false for 587 (TLS)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
});

// Send an email using async/await
export const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: 'suryansh1440@gmail.com', // sender address
      to,  // list of receivers
      subject,  // Subject line
      // text, // Plain-text version of the message
      html // HTML version of the message
    });
    console.log("Message sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
    // Do not throw, just log. This prevents crash during dev if creds are wrong.
  }
};