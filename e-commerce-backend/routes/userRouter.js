const express = require("express");
const userRouter = express.Router();

const userController = require("../controllers/userController.jsx");

// Registration
userRouter.post("/register", userController.registerUser);

// Email verification
userRouter.post("/verify-email", userController.verifyEmail);

// Login
userRouter.post("/login", userController.loginUser);

// Forgot password: send OTP
userRouter.post("/forgot-password/send-otp", userController.forgotPasswordSendOtp);

// Forgot password: verify OTP
userRouter.post("/forgot-password/verify-otp", userController.forgotPasswordVerifyOtp);

// Forgot password: set new password
userRouter.post("/forgot-password/set-new", userController.forgotPasswordSetNew);

module.exports = userRouter;