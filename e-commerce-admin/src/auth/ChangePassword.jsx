import React, { useState } from "react";
import { Button, TextField, InputAdornment, Paper, CircularProgress } from "@mui/material";
import { MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md";
import notify from "../components/Notification/notify";
import API_BASE from "../utils/API_BASE";
import { useNavigate } from "react-router-dom";

function ChangePassword() {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      notify("warning", "Fill all fields");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      notify("warning", "Passwords do not match");
      return;
    }

    if (form.newPassword.length < 6) {
      notify("warning", "New password must be 6 digits");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          oldPassword: form.oldPassword,
          newPassword: form.newPassword,
          confirmPassword: form.confirmPassword,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        notify("success", "Password changed");
        setForm({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 1000);
      } else {
        notify("error", data.message || "Change failed");
      }
    } catch (err) {
      notify("error", "Server error");
    } finally {
      setLoading(false);
    }
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
            name="oldPassword"
            type={showPassword.old ? "text" : "password"}
            value={form.oldPassword}
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
                    onClick={() => handleClickShowPassword("old")}
                  >
                    {showPassword.old ? (
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
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? "Changing..." : "Change Password"}
          </Button>
        </form>
      </Paper>
    </div>
  );
}

export default ChangePassword;
