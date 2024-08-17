const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

router.post('/send-email', async (req, res) => {
    const { name, email, subject, message } = req.body;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-gmail-password'
        }
    });

    let mailOptions = {
        from: `"${name}" <${email}>`,
        to: 'recipient@example.com', // Your email address
        subject: subject,
        text: message,
        html: `<p>You have a new contact request</p>
               <h3>Contact Details</h3>
               <ul>
                 <li>Name: ${name}</li>
                 <li>Email: ${email}</li>
                 <li>Subject: ${subject}</li>
               </ul>
               <h3>Message</h3>
               <p>${message}</p>`
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send email' });
    }
});

module.exports = router;
