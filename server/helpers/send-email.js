const nodemailer = require('nodemailer');
const config = require('config.json');

module.exports = sendEmail;

async function sendEmail({ to, subject, html, from = config.emailFrom }) {
    const transporter = nodemailer.createTransport({
        ...config.smtpOptions,
        tls: {
            rejectUnauthorized: false // Disable SSL verification for development
        }
    });
    await transporter.sendMail({ from, to, subject, html });
}
