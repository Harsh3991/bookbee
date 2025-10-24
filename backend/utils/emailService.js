const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

const sendWelcomeEmail = async (to, name) => {
  const subject = 'Welcome to BookBee!';
  const text = `Hi ${name}, welcome to BookBee! Start reading amazing stories.`;
  const html = `<h1>Welcome to BookBee, ${name}!</h1><p>Start reading amazing stories.</p>`;

  return sendEmail(to, subject, text, html);
};

const sendPasswordResetEmail = async (to, resetToken) => {
  const subject = 'Password Reset Request';
  const text = `Click here to reset your password: ${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  const html = `<p>Click <a href="${process.env.FRONTEND_URL}/reset-password/${resetToken}">here</a> to reset your password.</p>`;

  return sendEmail(to, subject, text, html);
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
};
