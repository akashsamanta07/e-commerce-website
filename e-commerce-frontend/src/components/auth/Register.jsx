import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IconButton, Button } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";

function Register({ onRegister }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [termsChecked, setTermsChecked] = useState(false);

  const handleTermsChange = (e) => {
    setTermsChecked(e.target.checked);
    setError("");
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setError("");
    setSuccess("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple validation
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (!termsChecked) {
        setError("You must agree to the Terms and Conditions.");
        return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    // Dummy register logic (replace with real API call)
    setError("");
    setSuccess("Registration successful! You can now log in.");
    if (onRegister) onRegister(form);
    // Optionally, clear form
    setForm({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="my-10 mx-5 mt-6 lg:my-10 flex items-center justify-center #f5f0f0">
      <form
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold  text-center text-gray-800">
          Register
        </h2>
        {error && (
          <div className="mb-4 text-red-600 text-sm text-center">{error}</div>
        )}
        {success && (
          <div className="mb-4 text-green-600 text-sm text-center">{success}</div>
        )}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 font-medium mb-1"
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Enter your name"
            autoComplete="name"
            required
          />
        </div>
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
            autoComplete="email"
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
        <div className="mb-6">
          <label
            htmlFor="confirmPassword"
            className="block text-gray-700 font-medium mb-1"
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
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Confirm your password"
              autoComplete="new-password"
              required
            />
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
          className="w-full !bg-pink-600 !text-white py-2 rounded font-semibold hover:!bg-pink-700 transition"
          startIcon={<PersonAddAlt1Icon />}
          fullWidth
          disableElevation
        >
          Register
        </Button>
        <div className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-pink-600 hover:underline">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
