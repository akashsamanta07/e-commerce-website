import React, { useState } from "react";
import { Avatar, Button, TextField, InputAdornment, CircularProgress } from "@mui/material";
import { FaUserCircle } from "react-icons/fa";
import { MdPerson, MdEmail, MdPhone } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import notify from "../components/Notification/notify.jsx";
import API_BASE from "../utils/API_BASE";
import getImageurl from "../components/getImageUrl.js"; // <-- import getImageurl

const defaultProfilePic = (
  <FaUserCircle className="text-gray-400" style={{ fontSize: 90 }} />
);

function ChangeProfile({obj, auth }) {
  let {setData}=obj;
  const [user, setUser] = useState({
    name: auth.name || "",
    email: auth.email || "",
    phone: auth.mobile || "",
    profilePic: auth.avatar || "",
  });
  // Use getImageurl for initial profilePic if available
  const [profilePic, setProfilePic] = useState(getImageurl(auth.avatar || ""));
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle profile pic change (preview only, upload on save)
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle save (update profile via single API call)
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let formData;
      let isMultipart = false;
      if (selectedFile) {
        // If a new profile picture is selected, use FormData
        formData = new FormData();
        formData.append("id", auth._id);
        formData.append("name", user.name);
        formData.append("email", user.email);
        formData.append("phone", user.phone);
        formData.append("photo", selectedFile);
        isMultipart = true;
      } else {
        // No new profile picture, send JSON
        formData = JSON.stringify({
          id:auth._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          photo: user.profilePic,
        });
      }

      const res = await fetch(`${API_BASE}/auth/update-profile`, {
        method: "PUT",
        credentials: "include",
        headers: isMultipart
          ? undefined
          : {
              "Content-Type": "application/json",
            },
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.profilePicUrl) {
          setUser((prev) => ({
            ...prev,
            profilePic: data.profilePicUrl,
          }));
          setProfilePic(getImageurl(data.profilePicUrl));
        }
        notify("success", "Profile updated!");
        setData((prev) => ({ ...prev, update: !prev.update }));
        navigate("/admin/dashboard");
      } else {
        notify("error", data.message || "Failed to update profile");
      }
    } catch (err) {
      notify("error", "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-8 mx-5 flex items-center justify-center">
      <form
        className="p-6 md:p-10 bg-white rounded-lg shadow flex flex-col items-center w-full max-w-md"
        onSubmit={handleSave}
      >
        <div className="mb-4 flex flex-col items-center">
          <div className="mb-2">
            {profilePic ? (
              <Avatar
                src={profilePic}
                alt={user.name}
                sx={{ width: 90, height: 90 }}
              />
            ) : (
              defaultProfilePic
            )}
          </div>
          <label className="block">
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              className="hidden"
              id="profile-pic-upload"
              disabled={loading}
            />
            <span
              className="text-pink-600 cursor-pointer text-sm underline"
              onClick={() =>
                !loading && document.getElementById("profile-pic-upload").click()
              }
            >
              Change Profile Picture
            </span>
          </label>
        </div>
        <TextField
          label="Name"
          name="name"
          value={user.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
          disabled={loading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MdPerson className="text-pink-500" />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Email"
          name="email"
          value={user.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
          disabled={loading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MdEmail className="text-pink-500" />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Phone No"
          name="phone"
          value={user.phone}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
          disabled={loading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MdPhone className="text-pink-500" />
              </InputAdornment>
            ),
          }}
        />
        <Button
          type="submit"
          variant="contained"
          className="!bg-pink-600 hover:!bg-black !text-white !font-semibold !rounded-md mt-4"
          fullWidth
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Save"}
        </Button>
      </form>
    </div>
  );
}

export default ChangeProfile;
