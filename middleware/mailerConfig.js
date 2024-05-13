// mailerConfig.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "mail.exchangeincloud.ch",
  port: 587,
  auth: {
    user: "sofitech_mails@sofitech.pro",
    pass: "Gd2Bc19*",
  },
});

const logoUrl = "https://sofitech.pro/wp-content/uploads/2018/12/Groupe-1.png";

const createMailOptions = (recipientEmail, subject, htmlContent,cc) => ({
  from: "sofitech_mail_automatique@sofitech.pro",
  to: recipientEmail,
  cc: cc, 
  subject: subject,
  html: htmlContent,
});

module.exports = { transporter, logoUrl, createMailOptions };