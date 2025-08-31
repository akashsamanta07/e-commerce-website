
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IconButton, Button, InputAdornment, CircularProgress } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { FcGoogle } from "react-icons/fc";
import { RiLockPasswordLine } from "react-icons/ri";
import notify from "../components/Notification/notify";

const API_BASE = "http://localhost:3005";

// Helper to always show small notification
const notifySmall = (type, message) => {
  notify(type, message, { fontSize: "0.85rem" });
};

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);

  // Email verification state
  const [step, setStep] = useState("register"); // "register" | "verify"
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");

  const navigate = useNavigate();

  const handleTermsChange = (e) => {
    setTermsChecked(e.target.checked);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simple validation
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      notifySmall("warning", "Fill all fields");
      return;
    }
    if (!termsChecked) {
      notifySmall("warning", "Agree to terms");
      return;
    }
    if (form.password.length < 6) {
      notifySmall("warning", "Password too short");
      return;
    }
    if (form.password !== form.confirmPassword) {
      notifySmall("error", "Passwords mismatch");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          confirmPassword: form.confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        notifySmall("error", data.message || "Register failed");
        setLoading(false);
        return;
      }

      setRegisteredEmail(form.email);
      setStep("verify");
      setLoading(false);
      notifySmall("success", "Check your email");
    } catch (err) {
      notifySmall("error", "Network error");
      setLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp) {
      notifySmall("warning", "Enter OTP code");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/user/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: registeredEmail,
          code: otp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        notifySmall("error", data.message || "Verify failed");
        setLoading(false);
        return;
      }

      notifySmall("success", "Email verified");
      setLoading(false);
      navigate("/login");
    } catch (err) {
      notifySmall("error", "Network error");
      setLoading(false);
    }
  };

  // Dummy Google register handler
  const handleGoogleRegister = (e) => {
    e.preventDefault();
    notifySmall("info", "Not implemented");
  };

  const handleResendCode = async () => {
    setLoading(true);
    try {
      // Re-trigger registration to resend code (or you can create a dedicated endpoint)
      const res = await fetch(`${API_BASE}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: form.name || "User",
          email: registeredEmail,
          password: form.password || "dummyPassword123",
          confirmPassword: form.confirmPassword || "dummyPassword123",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        notifySmall("error", data.message || "Resend failed");
        setLoading(false);
        return;
      }

      notifySmall("success", "Code resent");
      setLoading(false);
    } catch (err) {
      notifySmall("error", "Network error");
      setLoading(false);
    }
  };

  return (
    <div className="my-8 mx-5 flex items-center justify-center #f5f0f0">
      <form
        className="bg-white p-5 rounded-lg shadow-md w-full max-w-sm"
        onSubmit={step === "register" ? handleSubmit : handleOtpSubmit}
      >
        <h2 className="text-2xl font-bold  text-center text-pink-600 pb-2">
          Register
        </h2>
        {step === "register" && (
          <>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-700 font-medium mb-1"
              >
                Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500 pl-10"
                  placeholder="Enter your name"
                  autoComplete="name"
                  required
                  style={{ paddingLeft: "2.5rem" }}
                />
                <InputAdornment position="start" style={{ position: "absolute", left: 8, top: 8 }}>
                  <AccountCircleOutlinedIcon className="text-pink-600" />
                </InputAdornment>
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-1 ps-1"
              >
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500 pl-10"
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                  style={{ paddingLeft: "2.5rem" }}
                />
                <InputAdornment position="start" style={{ position: "absolute", left: 8, top: 8 }}>
                  <EmailOutlinedIcon className="text-pink-600" />
                </InputAdornment>
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-1 ps-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500 pl-10"
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  required
                  style={{ paddingLeft: "2.5rem" }}
                />
                <InputAdornment position="start" style={{ position: "absolute", left: 8, top: 8 }}>
                  <RiLockPasswordLine size={22} color="#db2777" />
                </InputAdornment>
                <IconButton
                  type="button"
                  className="!absolute right-2 top-2 text-gray-500 text-sm"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                  size="small"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </IconButton>
              </div>
            </div>
            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 font-medium mb-1 ps-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500 pl-10"
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  required
                  style={{ paddingLeft: "2.5rem" }}
                />
                <InputAdornment position="start" style={{ position: "absolute", left: 8, top: 8 }}>
                  <RiLockPasswordLine size={22} color="#db2777" />
                </InputAdornment>
                <IconButton
                  type="button"
                  className="!absolute right-2 top-2 text-gray-500 text-sm"
                  onClick={() => setShowConfirm((prev) => !prev)}
                  tabIndex={-1}
                  size="small"
                  aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </IconButton>
              </div>
            </div>
            <div className="mb-6 flex items-center">
              <input
                type="checkbox"
                id="terms"
                checked={termsChecked}
                onChange={handleTermsChange}
                className="mr-2"
                required
              />
              <label htmlFor="terms" className="text-gray-700 text-sm select-none">
                I agree to the{" "}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:underline"
                >
                  Terms and Conditions
                </a>
              </label>
            </div>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              className="w-full !bg-pink-600 !text-white py-2 rounded font-semibold hover:!bg-black transition"
              startIcon={<PersonAddAlt1Icon />}
              fullWidth
              disableElevation
              disabled={loading}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : "Register"}
            </Button>
            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-200" />
              <span className="mx-2 text-gray-400 text-xs">or</span>
              <div className="flex-grow border-t border-gray-200" />
            </div>
            <Button
              variant="outlined"
              startIcon={<FcGoogle size={22} />}
              onClick={handleGoogleRegister}
              className="w-full"
              sx={{
                borderColor: "#db2777",
                color: "#db2777",
                fontWeight: "bold",
                textTransform: "none",
                borderRadius: "8px",
                padding: "10px 24px",
                fontSize: "1rem",
                width: "100%",
                justifyContent: "center",
                mb: 1,
                "&:hover": {
                  borderColor: "#ec4899",
                  backgroundColor: "#fdf2f8",
                },
              }}
            >
              Register with Google
            </Button>
            <div className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-pink-600 hover:underline">
                Login
              </Link>
            </div>
          </>
        )}
        {step === "verify" && (
          <>
            <div className="mb-4">
              <label
                htmlFor="otp"
                className="block text-gray-700 font-medium mb-1"
              >
                Email Verification Code
              </label>
              <input
                type="text"
                name="otp"
                id="otp"
                value={otp}
                onChange={handleOtpChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Enter the code sent to your email"
                autoComplete="one-time-code"
                required
                maxLength={8}
              />
            </div>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              className="w-full !bg-pink-600 !text-white py-2 rounded font-semibold hover:!bg-black transition"
              fullWidth
              disableElevation
              disabled={loading}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : "Verify Email"}
            </Button>
            <div className="mt-4 text-center text-sm text-gray-600">
              Didn't receive the code?{" "}
              <button
                type="button"
                className="text-pink-600 hover:underline"
                disabled={loading}
                onClick={handleResendCode}
              >
                Resend Code
              </button>
            </div>
            <div className="mt-4 text-center text-sm text-gray-600">
              Already verified?{" "}
              <Link to="/login" className="text-pink-600 hover:underline">
                Login
              </Link>
            </div>
          </>
        )}
      </form>
    </div>
  );
}

export default Register;
