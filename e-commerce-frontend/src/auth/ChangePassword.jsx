import React, { useState } from "react";
import { Button, TextField, InputAdornment, Paper } from "@mui/material";
import { MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md";

function ChangePassword() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleClickShowPassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would handle password change logic (API call, etc.)
    if (form.newPassword !== form.confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }
    alert("Password changed successfully!");
    setForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="my-8 mx-5 flex items-center justify-center">
      <Paper elevation={4} className="p-6 rounded-lg shadow-lg bg-white w-full max-w-md">
        <h2 className="text-2xl font-bold text-pink-600 mb-6 flex items-center gap-2">
          <MdLock className="text-pink-500" size={28} />
          Change Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <TextField
            label="Current Password"
            name="currentPassword"
            type={showPassword.current ? "text" : "password"}
            value={form.currentPassword}
            onChange={handleChange}
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MdLock className="text-pink-500" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <span
                    className="cursor-pointer"
                    onClick={() => handleClickShowPassword("current")}
                  >
                    {showPassword.current ? (
                      <MdVisibilityOff className="text-gray-500" />
                    ) : (
                      <MdVisibility className="text-gray-500" />
                    )}
                  </span>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="New Password"
            name="newPassword"
            type={showPassword.new ? "text" : "password"}
            value={form.newPassword}
            onChange={handleChange}
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MdLock className="text-pink-500" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <span
                    className="cursor-pointer"
                    onClick={() => handleClickShowPassword("new")}
                  >
                    {showPassword.new ? (
                      <MdVisibilityOff className="text-gray-500" />
                    ) : (
                      <MdVisibility className="text-gray-500" />
                    )}
                  </span>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Confirm New Password"
            name="confirmPassword"
            type={showPassword.confirm ? "text" : "password"}
            value={form.confirmPassword}
            onChange={handleChange}
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MdLock className="text-pink-500" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <span
                    className="cursor-pointer"
                    onClick={() => handleClickShowPassword("confirm")}
                  >
                    {showPassword.confirm ? (
                      <MdVisibilityOff className="text-gray-500" />
                    ) : (
                      <MdVisibility className="text-gray-500" />
                    )}
                  </span>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            className="!bg-pink-600 hover:!bg-black !text-white !font-semibold !rounded-md"
            fullWidth
          >
            Change Password
          </Button>
        </form>
      </Paper>
    </div>
  );
}

export default ChangePassword;

