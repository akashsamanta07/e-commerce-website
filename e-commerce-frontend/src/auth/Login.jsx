import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IconButton, InputAdornment, CircularProgress, Button } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import { RiLockPasswordLine } from "react-icons/ri";
import notify from "../components/Notification/notify";
import API_BASE from "../utils/API_BASE";

function Login({ auth, setAuth }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (auth && auth._id != null) {
      navigate("/");
    }
    // eslint-disable-next-line
  }, [auth, navigate]);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      notify("warning", "Fill all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        notify("error", data.message || "Login failed");
        setLoading(false);
        return;
      }

      notify("success", "Login success");
      setLoading(false);
      setAuth(data.userData);
      navigate("/");
    } catch (err) {
      notify("error", "Network error");
      setLoading(false);
    }
  };

  return (
    <div className="my-8 mx-5 flex items-center justify-center">
      <form
        className="bg-white p-5 rounded-lg shadow-md w-full max-w-sm"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-center text-pink-600 flex items-center justify-center gap-2">
          <LoginIcon sx={{ color: "#db2777", fontSize: 32 }} />
          Login
        </h2>
        {/* Email Field */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 font-medium mb-1 ps-1"
          >
            Email
          </label>
          <div className="relative">
            <span
              style={{
                position: "absolute",
                left: 8,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                pointerEvents: "none"
              }}
            >
              <EmailOutlinedIcon color="secondary" sx={{ color: "#db2777" }} />
            </span>
            <input
              type="email"
              name="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-10 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Enter your email"
              autoComplete="username"
              required
              style={{ paddingLeft: 40 }}
            />
          </div>
        </div>
        {/* Password Field */}
        <div className="mb-2">
          <label
            htmlFor="password"
            className="block text-gray-700 font-medium mb-1 ps-1"
          >
            Password
          </label>
          <div className="relative">
            <span
              style={{
                position: "absolute",
                left: 8,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                pointerEvents: "none"
              }}
            >
              <RiLockPasswordLine size={22} color="#db2777" />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-10 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Enter your password"
              autoComplete="new-password"
              required
              style={{ paddingLeft: 40, paddingRight: 40 }}
            />
            <IconButton
              type="button"
              className="!absolute right-2 top-2 text-gray-500 text-sm"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
              size="small"
              aria-label={showPassword ? "Hide password" : "Show password"}
              sx={{
                position: "absolute",
                right: 4,
                top: 6,
                zIndex: 20,
                background: "transparent"
              }}
            >
              {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
            </IconButton>
          </div>
        </div>
        <div className="flex justify-end mb-4">
          <Link
            to="/forgot-password"
            className="text-pink-600 hover:underline text-sm flex items-center gap-1"
          >
            <LockOpenOutlinedIcon sx={{ fontSize: 18, color: "#db2777" }} />
            Forgot password?
          </Link>
        </div>
        <div className="flex justify-center mb-2">
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            className="w-full !bg-pink-600 !text-white py-2 rounded font-semibold hover:!bg-black transition"
            startIcon={<LoginIcon />}
            fullWidth
            disableElevation
            disabled={loading}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : "Login"}
          </Button>
        </div>
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-200" />
          <span className="mx-2 text-gray-400 text-xs">or</span>
          <div className="flex-grow border-t border-gray-200" />
        </div>
        {/* <Button
          variant="outlined"
          startIcon={<FcGoogle size={22} />}
          onClick={handleGoogleLogin}
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
          disabled={loading}
        >
          Login with Google
        </Button> */}
        <div className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-pink-600 hover:underline">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;