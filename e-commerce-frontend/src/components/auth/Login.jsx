import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IconButton } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function Login({ onLogin }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setError("");
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple validation
    if (!form.email || !form.password) {
      setError("Please enter both email and password.");
      return;
    }
    // Dummy login logic (replace with real API call)
    if (form.email === "user@example.com" && form.password === "password") {
      setError("");
      if (onLogin) onLogin(form);
      // You can redirect or set auth state here
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="my-10 mx-5 flex items-center justify-center #f5f0f0">
      <form
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Login
        </h2>
        {error && (
          <div className="mb-4 text-red-600 text-sm text-center">{error}</div>
        )}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 font-medium mb-1"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Enter your email"
            autoComplete="username"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 font-medium mb-1"
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
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Enter your password"
              autoComplete="new-password"
              required
            />
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
        <div className="flex justify-center mb-2">
          <IconButton
            type="submit"
            color="primary"
            size="large"
            aria-label="login"
            sx={{
              backgroundColor: "#ec4899",
              color: "#fff",
              "&:hover": { backgroundColor: "#db2777" },
              borderRadius: "8px",
              padding: "10px 24px",
              fontWeight: "bold",
              fontSize: "1rem",
              boxShadow: 1,
              transition: "background 0.2s",
              width: "100%", // Make button full width
              justifyContent: "center",
              display: "flex"
            }}
            className="w-full"
          >
            <LoginIcon sx={{ mr: 1 }} />
            Login
          </IconButton>
        </div>
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
