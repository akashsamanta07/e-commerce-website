const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ACCESS_SECRET = process.env.ACCESS_TOKEN_KEY;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_KEY;
const { uploadToCloudinary, deleteFromCloudinary } = require("../cloudinary");

const isProduction = true;
const cookieOptions = {
    httpOnly: true,
    secure: isProduction,                  
    sameSite: isProduction ? "none" : "lax",
    path: "/",        
};

// Import mail verification helpers
const { generateVerificationCode, sendVerificationEmail } = require("./mailVerification");

// Import authenticateToken middleware
const authenticateToken = require("./authenticateToken");

// Logout controller
exports.logoutUser = async (req, res) => {
    try {
        res.clearCookie("accessToken", cookieOptions);
        res.clearCookie("refreshToken", cookieOptions);
        return res.status(200).json({ success: true, message: "Logged out successfully." });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Logout failed.", error: error.message });
    }
};

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
        const { password: _, ...userData } = user.toObject();
        // Create access token and refresh token
        const accessToken = jwt.sign(
            userData,
            ACCESS_SECRET,
            { expiresIn: "15m" }
        );
        const refreshToken = jwt.sign(
            userData,
            REFRESH_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("accessToken", accessToken, {
            ...cookieOptions,
            maxAge: 15 * 60 * 1000, // 15 minutes
        });
        
        res.cookie("refreshToken", refreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(200).json({
            message: "Login successful.",
            userData,
        });
    } catch (error) {
        res.status(500).json({ message: "An error occurred during login.", error: error.message });
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh token required." });
        }
        jwt.verify(refreshToken, REFRESH_SECRET, async (err, payload) => {
            if (err) {
                return res.status(403).json({ message: "Invalid or expired refresh token." });
            }
            // Fetch all fields except password
            const user = await userModel.findById(payload._id).select("-password");
            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }
            if (user.status && user.status !== "Active") {
                return res.status(403).json({ message: "User account is not active." });
            }
            // Exclude password from userData
            const userObj = user.toObject();
            delete userObj.password;

            const newAccessToken = jwt.sign(
                userObj,
                ACCESS_SECRET,
                { expiresIn: "15m" }
            );

            res.cookie("accessToken", newAccessToken, {
                ...cookieOptions,
                maxAge: 15 * 60 * 1000, // 15 minutes
            });            
            return res.status(200).json({
                message: "Access token refreshed.",
                accessToken: newAccessToken,
                userData: userObj,
            });
        });
    } catch (error) {
        res.status(500).json({ message: "An error occurred during token refresh.", error: error.message });
    }
};

exports.forgotPasswordSendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await userModel.findOne({ email });
        if (!user || !user.verify_email) {
            return res.status(404).json({ message: "User not found." });
        }

        const otp = generateVerificationCode();
        user.forgot_password_otp = otp;
        user.forgot_password_expiry = Date.now() + 10 * 60 * 1000;
        await user.save();

        await sendVerificationEmail(email, otp);

        res.status(200).json({
            message: "OTP sent to email.",
            otp, // REMOVE in production
        });
    } catch (error) {
        res.status(500).json({ message: "An error occurred while sending OTP.", error: error.message });
    }
};

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
        res.status(500).json({ message: "An error occurred while verifying OTP.", error: error.message });
    }
};

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
        res.status(500).json({ message: "An error occurred while resetting password.", error: error.message });
    }
};

// --- Add changePassword controller ---

/**
 * Change password controller
 * Expects: { oldPassword, newPassword, confirmPassword }
 * User must be authenticated and provide correct old password.
 * The user id is taken from req.user (set by authenticateToken).
 */
exports.changePassword = [
    authenticateToken,
    async (req, res) => {
        try {
            const { oldPassword, newPassword, confirmPassword } = req.body;
            const userId = req.user && req.user._id ? req.user._id : req.user && req.user.id ? req.user.id : null;

            if (!userId) {
                return res.status(401).json({ success: false, message: "Unauthorized. User not found in token." });
            }

            if (!oldPassword || !newPassword || !confirmPassword) {
                return res.status(400).json({ success: false, message: "All fields are required." });
            }

            if (newPassword !== confirmPassword) {
                return res.status(400).json({ success: false, message: "New passwords do not match." });
            }

            const user = await userModel.findById(userId);
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found." });
            }

            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: "Old password is incorrect." });
            }

            if (oldPassword === newPassword) {
                return res.status(400).json({ success: false, message: "New password must be different." });
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
            await user.save();

            return res.status(200).json({ success: true, message: "Password changed successfully." });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Password change failed.", error: error.message });
        }
    }
];

/**
 * Update user profile (name, email, phone, profilePic)
 * Expects: { id, name, email, phone, profilePic }
 */
// Update user profile (name, email, phone, photo via multer/cloudinary)
exports.updateProfile = async (req, res) => {
    try {
        const { id, name, email, phone } = req.body;

        if (!id) {
            return res.status(400).json({ success: false, message: "User id is required." });
        }

        // Only allow updating these fields
        const updateFields = {};
        if (name !== undefined) updateFields.name = name;
        if (email !== undefined) updateFields.email = email;
        if (phone !== undefined) updateFields.mobile = phone;

        // Fetch user first to check for previous pic if needed
        let user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // Handle photo (profilePic) via cloudinary
        if (req.file) {
            // Remove previous pic from cloudinary if exists
            if (user.avatar && user.avatar_public_id) {
                try {
                    await deleteFromCloudinary(user.avatar_public_id);
                } catch (err) {
                }
            }
            // Upload new image to cloudinary
            console.log(req.file)
            const uploadResult = await uploadToCloudinary(req.file.buffer, "user_avatars");
            console.log(uploadResult)
            updateFields.avatar = uploadResult.secure_url;
            updateFields.avatar_public_id = uploadResult.public_id;
        }

        // Prevent empty update
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ success: false, message: "No fields to update." });
        }

        // If email is being updated, check for duplicate
        if (email) {
            const existing = await userModel.findOne({ email, _id: { $ne: id } });
            if (existing) {
                return res.status(409).json({ success: false, message: "Email already in use." });
            }
        }

        user = await userModel.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        const { password: _, ...userData } = user.toObject();
        // If photo was updated, return the new profilePic url as well
        let response = {
            success: true,
            message: "Profile updated successfully.",
            user: userData,
        };
        if (req.file) {
            response.profilePicUrl = user.avatar;
        }
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ success: false, message: "Profile update failed.", error: error.message });
    }
};
