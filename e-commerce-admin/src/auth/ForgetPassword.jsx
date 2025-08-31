import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import notify from "../components/Notification/notify.jsx";

const API_BASE = "http://localhost:3005";

function ForgetPassword() {
  const [step, setStep] = useState(1); // 1: enter email, 2: enter OTP, 3: reset password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handler for sending OTP via API (now uses userRouter endpoint)
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    if (!email) {
      setError("Enter email address.");
      notify("error", "Email required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/forgot-password/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg("OTP sent to email.");
        notify("success", "OTP sent");
        setStep(2);
      } else {
        setError(data.message || "Failed to send OTP.");
        notify("error", data.message || "OTP failed");
      }
    } catch (err) {
      setError("Network error. Try again.");
      notify("error", "Network error");
    } finally {
      setLoading(false);
    }
  };

  // Handler for verifying OTP via API (now uses userRouter endpoint)
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    if (!otp) {
      setError("Enter OTP sent to email.");
      notify("error", "OTP required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/forgot-password/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg("OTP verified. Reset password.");
        notify("success", "OTP verified");
        setStep(3);
      } else {
        setError(data.message || "Invalid OTP.");
        notify("error", data.message || "OTP invalid");
      }
    } catch (err) {
      setError("Network error. Try again.");
      notify("error", "Network error");
    } finally {
      setLoading(false);
    }
  };

  // Handler for resetting password via API (now uses userRouter endpoint)
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    if (!password || !confirmPassword) {
      setError("Fill both password fields.");
      notify("error", "Password required");
      return;
    }
    if (password.length < 6) {
      setError("Password at least 6 chars.");
      notify("error", "Password short");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      notify("error", "No match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/forgot-password/set-new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg("Password reset! Login now.");
        notify("success", "Reset done");
        setStep(1);
        setEmail("");
        setOtp("");
        setPassword("");
        setConfirmPassword("");
      } else {
        setError(data.message || "Reset failed.");
        notify("error", data.message || "Reset fail");
      }
    } catch (err) {
      setError("Network error. Try again.");
      notify("error", "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-8 mx-5 #f5f0f0">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgcolor="#f5f0f0"
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            width: "100%",
            maxWidth: 400,
            boxSizing: "border-box",
          }}
        >
          <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
            <MdOutlineMarkEmailRead size={38} color="#db2777" style={{ marginBottom: 4 }} />
            <Typography
              variant="h5"
              fontWeight="bold"
              color="secondary"
              sx={{ color: "#db2777", mb: 1 }}
              align="center"
            >
              Forgot Password
            </Typography>
          </Box>
          {error && (
            <Alert severity="error" sx={{ mb: 2, fontSize: "0.95rem" }}>
              {error}
            </Alert>
          )}
          {successMsg && (
            <Alert severity="success" sx={{ mb: 2, fontSize: "0.95rem" }}>
              {successMsg}
            </Alert>
          )}
          {step === 1 && (
            <form onSubmit={handleSendOtp} autoComplete="off">
              <TextField
                label="Enter your email address"
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                margin="normal"
                autoComplete="email"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon className="text-pink-600" />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                fullWidth
                sx={{
                  mt: 2,
                  py: 1.2,
                  fontWeight: "bold",
                  borderRadius: 2,
                  backgroundColor: "#db2777",
                  "&:hover": { backgroundColor: "#000" },
                  textTransform: "none",
                  fontSize: "1rem",
                }}
                startIcon={<MdOutlineMarkEmailRead size={22} />}
                disabled={loading}
              >
                {loading ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "Send OTP"}
              </Button>
            </form>
          )}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} autoComplete="off">
              <TextField
                label="Enter OTP sent to your email"
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                fullWidth
                required
                margin="normal"
                inputProps={{ maxLength: 6, inputMode: "numeric", pattern: "[0-9]*" }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOpenOutlinedIcon className="text-pink-600" />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                fullWidth
                sx={{
                  mt: 2,
                  py: 1.2,
                  fontWeight: "bold",
                  borderRadius: 2,
                  backgroundColor: "#db2777",
                  "&:hover": { backgroundColor: "#000" },
                  textTransform: "none",
                  fontSize: "1rem",
                }}
                startIcon={<LockOpenOutlinedIcon />}
                disabled={loading}
              >
                {loading ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "Verify OTP"}
              </Button>
              <Button
                type="button"
                fullWidth
                sx={{
                  mt: 2,
                  color: "#db2777",
                  textTransform: "none",
                  fontSize: "0.98rem",
                  fontWeight: 500,
                  "&:hover": { textDecoration: "underline", background: "none" },
                  background: "none",
                  boxShadow: "none",
                }}
                startIcon={<ArrowBackIcon />}
                onClick={() => {
                  setStep(1);
                  setOtp("");
                  setSuccessMsg("");
                  setError("");
                }}
                disabled={loading}
              >
                Change Email
              </Button>
            </form>
          )}
          {step === 3 && (
            <form onSubmit={handleResetPassword} autoComplete="off">
              <TextField
                label="New Password"
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
                margin="normal"
                autoComplete="new-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <RiLockPasswordLine size={22} color="#db2777" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                        size="small"
                        tabIndex={-1}
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Confirm New Password"
                type={showConfirm ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                required
                margin="normal"
                autoComplete="new-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <RiLockPasswordLine size={22} color="#db2777" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                        onClick={() => setShowConfirm((prev) => !prev)}
                        edge="end"
                        size="small"
                        tabIndex={-1}
                      >
                        {showConfirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                fullWidth
                sx={{
                  mt: 2,
                  py: 1.2,
                  fontWeight: "bold",
                  borderRadius: 2,
                  backgroundColor: "#db2777",
                  "&:hover": { backgroundColor: "#000" },
                  textTransform: "none",
                  fontSize: "1rem",
                }}
                startIcon={<RiLockPasswordLine size={22} />}
                disabled={loading}
              >
                {loading ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "Reset Password"}
              </Button>
              <Button
                type="button"
                fullWidth
                sx={{
                  mt: 2,
                  color: "#db2777",
                  textTransform: "none",
                  fontSize: "0.98rem",
                  fontWeight: 500,
                  "&:hover": { textDecoration: "underline", background: "none" },
                  background: "none",
                  boxShadow: "none",
                }}
                startIcon={<ArrowBackIcon />}
                onClick={() => {
                  setStep(2);
                  setPassword("");
                  setConfirmPassword("");
                  setSuccessMsg("");
                  setError("");
                }}
                disabled={loading}
              >
                Back to OTP
              </Button>
            </form>
          )}
        </Paper>
      </Box>
    </div>
  );
}

export default ForgetPassword;