import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    // type: 'OAuth2',
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    // clientId: process.env.GOOGLE_CLIENT_ID,
    // clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
});

export const sendEmail = async (to, subject, html, text, attachments) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to || '',
      subject: subject || 'No Subject',
      html: html || '',
      text: text || '',
      attachments: attachments || [],
      headers: {
        'X-Custom-Header': 'CustomHeaderValue'
      }
    };
    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};
