const express = require('express');
const router = express.Router();
const db = require('../db');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

router.post('/reset-password-request', async (req, res) => {
  const { email } = req.body;

  try {
    // Zoek het account op in alle mogelijke tabellen (of kies er één afhankelijk van je projectstructuur)
    const [student] = await db.query('SELECT * FROM Studenten WHERE email = ?', [email]);
    const [bedrijf] = await db.query('SELECT * FROM Bedrijven WHERE email = ?', [email]);
    const [admin] = await db.query('SELECT * FROM Admins WHERE email = ?', [email]);
    const [zoekende] = await db.query('SELECT * FROM Werkzoekenden WHERE email = ?', [email]);

    const account = student[0] || bedrijf[0] || admin[0] || zoekende[0];

     // Altijd dezelfde response sturen voor privacy (niet verklappen of e-mail bestaat)
    res.json({ message: 'Als dit e-mailadres bestaat, sturen we je een resetlink.' });

    if (!account) {
      return;
    }

    // Genereer token en sla op
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = Date.now() + 3600000; // 1 uur geldig

    if (student[0]) {
      await db.query('UPDATE Studenten SET resetToken = ?, resetTokenExpires = ? WHERE email = ?', [resetToken, resetTokenExpires, email]);
    } else if (bedrijf[0]) {
      await db.query('UPDATE Bedrijven SET resetToken = ?, resetTokenExpires = ? WHERE email = ?', [resetToken, resetTokenExpires, email]);
    } else if (admin[0]) {
      await db.query('UPDATE Admins SET resetToken = ?, resetTokenExpires = ? WHERE email = ?', [resetToken, resetTokenExpires, email]);
    } else if (zoekende[0]) {
      await db.query('UPDATE Werkzoekenden SET resetToken = ?, resetTokenExpires = ? WHERE email = ?', [resetToken, resetTokenExpires, email]);
    }

    // Stuur de mail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'jouwgmail@gmail.com',
        pass: 'jouw-app-wachtwoord',
      },
    });
    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;
    const mailOptions = {
      from: 'jouwgmail@gmail.com',
      to: email,
      subject: 'Wachtwoord resetten',
      text: `Klik op deze link om je wachtwoord te resetten: ${resetLink}`,
      html: `<a href="${resetLink}">Wachtwoord resetten</a>`
    };
    await transporter.sendMail(mailOptions);


  } catch (error) {
    console.error('Fout bij wachtwoord vergeten:', error);
    res.status(500).json({ error: 'Serverfout bij verzoek.' });
  }
});

module.exports = router;