// mailerConfig.js
const nodemailer = require('nodemailer');
require('dotenv').config();
const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

const logoUrl = "https://sofitech.pro/wp-content/uploads/2018/12/Groupe-1.png";

const createMailOptions = (recipientEmail, subject, htmlContent,cc) => ({
  from : `Sofitech <${process.env.MAIL_USER}>`,
  to: recipientEmail,
  cc: cc, 
  subject: subject,
  html: htmlContent,
});

module.exports = { transporter, logoUrl, createMailOptions };