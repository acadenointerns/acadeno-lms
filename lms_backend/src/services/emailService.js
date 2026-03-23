require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

async function sendOTPEmail(toEmail, otp, purpose) {
  const subjects = {
    reset: 'Your Password Reset OTP - Acadeno LMS',
    mfa: 'Your Login Verification Code - Acadeno LMS',
  };

  const messages = {
    reset: `Your password reset OTP is: ${otp}\n\nThis code is valid for 10 minutes.\nIf you did not request this, ignore this email.`,
    mfa: `Your login verification code is: ${otp}\n\nThis code is valid for 10 minutes.\nIf you did not attempt to login, secure your account immediately.`,
  };

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject: subjects[purpose],
    text: messages[purpose],
  });
}

async function sendLockoutEmail(toEmail, lockedUntil) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject: 'Your Account Has Been Locked - Acadeno LMS',
    text: `Your account has been locked due to 5 consecutive failed login attempts.\n\nYour account will be automatically unlocked at: ${lockedUntil}\n\nIf this was not you, please contact support immediately.`,
  });
}

async function sendLeadArchiveEmail(toEmail, leadName, lastActivityDate) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject: `Lead Auto-Archived: ${leadName}`,
    text: `The lead "${leadName}" has been automatically archived to "cold" status due to 90 days of inactivity.\n\nLast Activity Date: ${lastActivityDate}\nReason: 90 days of inactivity rule (BR-L03).`,
  });
}

async function sendFollowUpReminderEmail(toEmail, leadName, lastNote, followUpDate, leadLink) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject: `Follow-up Reminder: ${leadName}`,
    text: `Daily Reminder: You have a scheduled follow-up for the lead "${leadName}".\n\nFollow-up Date: ${followUpDate}\nLast Note from BDA: ${lastNote || 'No notes available.'}\n\nDirect Link to Lead: ${leadLink}`,
  });
}

module.exports = { sendOTPEmail, sendLockoutEmail, sendLeadArchiveEmail, sendFollowUpReminderEmail };
