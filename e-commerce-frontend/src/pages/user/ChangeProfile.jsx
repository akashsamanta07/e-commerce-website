import React, { useState } from "react";
import { Avatar, Button, TextField, InputAdornment } from "@mui/material";
import { FaUserCircle } from "react-icons/fa";
import { MdPerson, MdEmail, MdPhone } from "react-icons/md";

const defaultProfilePic = (
  <FaUserCircle className="text-gray-400" style={{ fontSize: 90 }} />
);


function ChangeProfile() {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "9876543210",
    profilePic: "", // If empty, show default
  });
  const [profilePic, setProfilePic] = useState(user.profilePic);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle profile pic change (simulate upload)
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For preview only, not uploading to server
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
        setUser((prev) => ({
          ...prev,
          profilePic: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle save (for now, just alert)
  const handleSave = (e) => {
    e.preventDefault();
    // Here you would send updated data to backend
    alert("Profile updated!\n");
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
            />
            <span
              className="text-pink-600 cursor-pointer text-sm underline"
              onClick={() =>
                document.getElementById("profile-pic-upload").click()
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
        >
          Save
        </Button>
      </form>
    </div>
  );
}

export default ChangeProfile;
