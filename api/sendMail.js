import nodemailer from "nodemailer";

export default async function handler(req, res) {
  // ✅ Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { name, email, phone, subject, message } = req.body;

  // ✅ Basic field validation
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: "Missing required fields" });
  }

  try {
    // ✅ Create a transporter using Gmail + App Password
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail ID
        pass: process.env.EMAIL_PASS, // Your Gmail App Password
      },
    });

    // ✅ Construct the email
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER, // Send all contact form emails to your own inbox
      subject: subject
        ? `📩 New Inquiry: ${subject}`
        : "📩 New Inquiry from Contact Form",
      html: `
        <h2>New Contact Form Submission</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone || "Not provided"}</p>
        <p><b>Subject:</b> ${subject || "Not specified"}</p>
        <p><b>Message:</b></p>
        <p style="white-space: pre-line;">${message}</p>
        <hr>
        <p style="font-size: 12px; color: #666;">This email was sent automatically from the Markifly contact form.</p>
      `,
    };

    // ✅ Send the email
    await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully");
    return res.status(200).json({ success: true, message: "Email sent successfully ✅" });

  } catch (error) {
    console.error("❌ Email sending failed:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
}
