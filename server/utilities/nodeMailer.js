import nodemailer from "nodemailer";

// Create transporter
export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true only for port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Optional: verify connection (recommended for debugging)
export const verifyEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log("✅ Email server is ready");
  } catch (error) {
    console.error("❌ Email config error:", error);
  }
};

export const sendOTPEmail = async (to, otp) => {
  try {
    // 🚨 Validate input early
    if (!to) throw new Error("Recipient email is missing");
    if (!otp) throw new Error("OTP is missing");

    const mailOptions = {
      from: `"Health App" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Your OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 10px;">
          <h2>Password Reset OTP</h2>
          <p>Your OTP is:</p>
          <h1 style="letter-spacing: 2px;">${otp}</h1>
          <p>This OTP will expire in 10 minutes.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("📧 Email sent:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };

  } catch (error) {
    console.error("❌ Email send failed:", error.message);

    // ⚠️ Do NOT crash entire API
    return {
      success: false,
      error: error.message,
    };
  }
};