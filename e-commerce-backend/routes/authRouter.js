// this is outh router
const express = require("express");
const authRouter = express.Router();

const authController = require("../controllers/authController");

// Registration
authRouter.post("/register", authController.registerUser);

// Email verification
authRouter.post("/verify-email", authController.verifyEmail);

// Login
authRouter.post("/login", authController.loginUser);

// Forgot password: send OTP
authRouter.post("/forgot-password/send-otp", authController.forgotPasswordSendOtp);

// Forgot password: verify OTP
authRouter.post("/forgot-password/verify-otp", authController.forgotPasswordVerifyOtp);

// Forgot password: set new password
authRouter.post("/forgot-password/set-new", authController.forgotPasswordSetNew);

module.exports = authRouter;