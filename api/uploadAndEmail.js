import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  try {
    const { email, name, address, pdfBase64 } = req.body;

    if (!email || !name || !address || !pdfBase64) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Convert base64 to Buffer
    const pdfBuffer = Buffer.from(pdfBase64, 'base64');

    // Upload to file.io (demo purpose, expires after 1 download)
    const uploadRes = await axios.post('https://file.io', pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
      },
      params: {
        expires: '1d',
      },
    });

    const fileUrl = uploadRes.data.link;
    const nodemailer = require("nodemailer");

    // Create a test account or replace with real credentials.
    const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "newkings53@ethereal.email",
        pass: "jn7jnAPss4f63QBp6D",
    },
    });

    // Wrap in an async IIFE so we can use await.
    (async () => {
    const info = await transporter.sendMail({
        from: '"New Kings Loan Builder" <@ethereal.email>',
        to: email+",llogixit@gmail.com",
        subject: "Your PDF Document",
//text: "Hello world?", // plain‑text body
        html: `   <p>Hi ${name},</p><p>Here is the PDF document associated with your address: ${address}</p><p><a href="${fileUrl}">Download PDF</a></p>`, // HTML body
    });

    console.log("Message sent:", info.messageId);
    })();

    /*

    // Send email using nodemailer (or swap with SendGrid/Resend)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS, // your app password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your PDF Document',
      html: `
        <p>Hi ${name},</p>
        <p>Here is the PDF document associated with your address: ${address}</p>
        <p><a href="${fileUrl}">Download PDF</a></p>
      `,
    };

    await transporter.sendMail(mailOptions);
    */

    return res.status(200).json({ message: 'Email sent successfully', link: fileUrl });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
