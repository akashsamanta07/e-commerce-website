const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Import mail verification helpers
const { generateVerificationCode, sendVerificationEmail } = require("./mailVerification");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields required." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    let user = await userModel.findOne({ email });

    if (user && user.verify_email) {
      return res.status(409).json({ message: "Email already registered." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const verificationExpiry = new Date(Date.now() + 15 * 60 * 1000);

    let userToReturn;

    if (!user) {
      // Create new user
      const newUser = new userModel({
        name,
        email,
        password: hashedPassword,
        verify_email: false,
        forgot_password_otp: verificationCode,
        forgot_password_expiry: verificationExpiry,
      });
      await newUser.save();
      userToReturn = newUser;
    } else {
      // Update existing (unverified) user with new data
      user.name = name;
      user.password = hashedPassword;
      user.verify_email = false;
      user.forgot_password_otp = verificationCode;
      user.forgot_password_expiry = verificationExpiry;
      await user.save();
      userToReturn = user;
    }

    try {
      await sendVerificationEmail(email, verificationCode);
    } catch (mailErr) {
        await userModel.findByIdAndDelete(userToReturn._id);
      return res.status(500).json({ message: "Email send fail." });
    }

    const { password: _, ...userData } = userToReturn.toObject();
    res.status(201).json({
      message: "Check email for code.",
      user: userData,
    });
  } catch (error) {
    res.status(500).json({ message: "Register error.", error: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: "Email and code required." });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.verify_email) {
      return res.status(400).json({ message: "Already verified." });
    }

    if (
      !user.forgot_password_otp ||
      !user.forgot_password_expiry ||
      user.forgot_password_otp !== code
    ) {
      return res.status(400).json({ message: "Code invalid." });
    }

    if (user.forgot_password_expiry < new Date()) {
      return res.status(400).json({ message: "Code expired." });
    }

    user.verify_email = true;
    user.forgot_password_otp = null;
    user.forgot_password_expiry = null;
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "7d" }
    );

    const { password: _, ...userData } = user.toObject();
    res.status(200).json({
      message: "Verified.",
      user: userData,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Verify error.", error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    if (user.verify_email === false) {
      return res.status(403).json({ message: "Email not verified Register again." });
    }


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password." });
    }

    if (user.status && user.status !== "Active") {
      return res.status(403).json({ message: "User account is not active." });
    }
   
    user.last_login_date = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "7d" }
    );

    const { password: _, ...userData } = user.toObject();
    res.status(200).json({
      message: "Login successful.",
      user: userData,
      token,
    });
  } catch (error) {
    // Catch any error and return a generic error message
    res.status(500).json({ message: "An error occurred during login.", error: error.message });
  }
};


// Forgot Password: Send OTP
exports.forgotPasswordSendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });
    if (!user || !user.verify_email) {
      return res.status(404).json({ message: "User not found." });
    }

    const otp = generateVerificationCode();
    user.forgot_password_otp = otp;
    user.forgot_password_expiry = Date.now() + 10 * 60 * 1000; // 10 min expiry
    await user.save();

    await sendVerificationEmail(email, otp);

    res.status(200).json({
      message: "OTP sent to email.",
      otp, // REMOVE in production
    });
  } catch (error) {
    // Catch any error and return a generic error message
    res.status(500).json({ message: "An error occurred while sending OTP.", error: error.message });
  }
};

// Forgot Password: Verify OTP
exports.forgotPasswordVerifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (
      user.forgot_password_otp === otp &&
      user.forgot_password_expiry &&
      user.forgot_password_expiry > Date.now()
    ) {
      return res.status(200).json({ message: "OTP verified. You can reset password." });
    } else {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }
  } catch (error) {
    // Catch any error and return a generic error message
    res.status(500).json({ message: "An error occurred while verifying OTP.", error: error.message });
  }
};

// Forgot Password: Set New Password
exports.forgotPasswordSetNew = async (req, res) => {
  try {
    const { email, otp, password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return res.status(400).json({ message: "Enter new and confirm password." });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords not match." });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if new password is same as old password
    const isSame = await bcrypt.compare(password, user.password);
    if (isSame) {
      return res.status(400).json({ message: "Password same as old." });

    }

    if (
      user.forgot_password_otp === otp &&
      user.forgot_password_expiry &&
      user.forgot_password_expiry > Date.now()
    ) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      user.forgot_password_otp = null;
      user.forgot_password_expiry = null;
      await user.save();
      return res.status(200).json({ message: "Password reset done." });
    } else {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }
  } catch (error) {
    // Catch any error and return a generic error message
    res.status(500).json({ message: "An error occurred while resetting password.", error: error.message });
  }
};
