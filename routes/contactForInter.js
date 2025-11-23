// backend/routes/contact.js
const express = require("express");
const nodemailer = require("nodemailer");
const ContactInfoInter = require("../models/interContactInfo");

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, phone, message } = req.body;

  try {
    // 1. Get the dynamic email from database
    const contactInfo = await ContactInfoInter.findOne();
    if (!contactInfo) {
      return res
        .status(404)
        .json({ success: false, message: "No contact email found" });
    }

    const toEmail = contactInfo.email; // dynamic email

    // 2. Configure Gmail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ebmo3112002@gmail.com",
        pass: "pzyb xfvv tnuz imim", // app password
      },
    });

    // 3. Email options
    const mailOptions = {
      from: email, // sender: user who submitted the form
      to: toEmail, // dynamic recipient
      subject: `Contact Form Submission from ${name}`,
      text: `
Name: ${name}
Email: ${email}
Phone: ${phone}
Message: ${message}
      `,
    };

    // 4. Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Email sent!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to send email.",
      error: error.message,
    });
  }
});

module.exports = router;
