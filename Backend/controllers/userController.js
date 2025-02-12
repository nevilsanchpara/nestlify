const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});


// @desc    Register User
exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    if (!firstName || !lastName || !email || !password) return res.status(400).json({ message: "All fields required" });

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    user = new User({ firstName, lastName, email, password, phone });
    user.generateEmailToken();
    await user.save();

    const verificationLink = `${process.env.BASE_URL}/api/users/verify/${user.emailVerificationToken}`;
    await transporter.sendMail({
      to: user.email,
      subject: "Verify Your Email",
      html: `<p>Thank you for choosing Nestlify!! Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
    });

    res.status(201).json({ message: "Verification email sent. Please check your inbox." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify Email
exports.verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({ emailVerificationToken: req.params.token });
    if (!user) return res.status(400).json({ message: "Invalid token" });

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ message: "User not found" });

    user.generatePasswordResetToken();
    await user.save();

    const resetLink = `${process.env.BASE_URL}/api/users/reset-password/${user.resetPasswordToken}`;
    await transporter.sendMail({
      to: user.email,
      subject: "Reset Your Password",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    });

    res.json({ message: "Password reset email sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload Profile Image
exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.profileImage = `/uploads/${req.file.filename}`;
    await user.save();

    res.json({ message: "Profile image updated successfully", profileImage: user.profileImage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
