const nodemailer = require("nodemailer");
const UserModel = require("../models/userModel");

require("dotenv").config();
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendVerificationEmail(userEmail, verificationCode) {
  const mailOptions = {
    from: EMAIL_USER,
    to: userEmail,
    subject: "Verify your email address",
    html: `
      <h2>Email Verification</h2>
      <p>Your verification code is: <b>${verificationCode}</b></p>
      <p>Please enter this code in the app to verify your email address.</p>
    `,
  };
    await transporter.sendMail(mailOptions);
}

module.exports = {
  generateVerificationCode,
  sendVerificationEmail,
};
