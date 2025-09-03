import nodemailer from 'nodemailer';
import https from 'https';
import FormData from 'form-data';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  try {
    const { email, name, address, pdfBase64 } = req.body;

    if (!email || !name || !address || !pdfBase64) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Convert base64 to Buffer
    const pdfBuffer = Buffer.from(pdfBase64, 'base64');

    // Upload to file.io using native https + form-data
    const form = new FormData();
    form.append('file', pdfBuffer, { filename: 'document.pdf', contentType: 'application/pdf' });
    form.append('expires', '1d');

    const fileUrl = await new Promise((resolve, reject) => {
      const request = https.request(
        {
          method: 'POST',
          hostname: 'file.io',
          path: '/',
          headers: form.getHeaders(),
        },
        (response) => {
          let data = '';
          response.on('data', (chunk) => (data += chunk));
          response.on('end', () => {
            try {
              const result = JSON.parse(data);
              resolve(result.link);
            } catch (err) {
              reject(err);
            }
          });
        }
      );

      request.on('error', reject);
      form.pipe(request);
    });

    // Send email using nodemailer
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: 'newkings53@ethereal.email',
        pass: 'jn7jnAPss4f63QBp6D',
      },
    });

    await transporter.sendMail({
      from: '"New Kings Loan Builder" <newkings53@ethereal.email>',
      to: `${email}, llogixit@gmail.com`,
      subject: 'Your PDF Document',
      html: `
        <p>Hi ${name},</p>
        <p>Here is the PDF document associated with your address: ${address}</p>
        <p><a href="${fileUrl}">Download PDF</a></p>
      `,
    });

    return res.status(200).json({ message: 'Email sent successfully', link: fileUrl });
  } catch (err) {
    console.error('Upload or email failed:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
