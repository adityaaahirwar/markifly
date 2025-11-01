import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { name, email, phone, subject, message } = req.body;

  try {
    // Configure your transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // stored in Vercel Environment Variables
        pass: process.env.EMAIL_PASS, // Gmail App Password
      },
    });

    // Send the email
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: `New Message: ${subject || "No Subject"}`,
      text: `
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Message: ${message}
      `,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Email sending failed:", error);
    res.status(500).json({ success: false, error: "Email sending failed" });
  }
}
