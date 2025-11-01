import nodemailer from "nodemailer";

export default async function handler(req, res) {
  try {
    // Transporter setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your Gmail
        pass: process.env.EMAIL_PASS, // your App Password
      },
    });

    // Test mail options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // send it to yourself for testing
      subject: "✅ Gmail Test Successful",
      text: "This is a test email sent from your website hosted on Vercel!",
    };

    // Send mail
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: "Email sent successfully ✅" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
