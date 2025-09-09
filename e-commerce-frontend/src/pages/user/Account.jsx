import React from "react";
import { Avatar, Button, Divider } from "@mui/material";
import { MdEdit, MdLocationOn, MdFavorite, MdListAlt, MdLock, MdLogout } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import getImageUrl from "../../components/getImageUrl.js"; // assumes this helper exists

const defaultProfilePic = (
  <FaUserCircle className="text-gray-400" style={{ fontSize: 90 }} />
);

function Account({ auth }) {
  // Use DB data from auth prop
  // Fallbacks for missing fields
  const name = auth?.name || "User";
  const email = auth?.email || "";
  const avatar = auth?.avatar || "";
  const profilePic = avatar ? getImageUrl(avatar) : "";
  return (
    <div className="my-8 mx-5 #f5f0f0 flex items-center justify-center">
      <div className="p-4 md:p-8 pb-3 md:pb-5 bg-white rounded-lg shadow">
        {/* Profile Section */}
        <div className="flex flex-col items-center w-full">
          <div className="mb-3">
            {profilePic ? (
              <Avatar
                src={profilePic}
                alt={name}
                sx={{ width: 90, height: 90 }}
              />
            ) : (
              defaultProfilePic
            )}
          </div>
          <div className="text-xl font-semibold text-gray-800">{name}</div>
          <div className="text-gray-500 text-sm mb-2">{email}</div>
        </div>

        <Divider className="w-full my-4" />

        {/* Button Section */}
        <div className="flex flex-col  gap-1 w-full my-2">
          <Link to="/change-profile" className="w-full">
            <Button
              fullWidth
              startIcon={<MdEdit className="text-pink-600 text-xl" />}
              className="rounded-lg hover:bg-pink-50 transition !ps-5 !justify-start !items-start"
              variant="text"
            >
              Change Profile
            </Button>
          </Link>
          <Link to="/address" className="w-full">
            <Button
              fullWidth
              startIcon={<MdLocationOn className="text-pink-600 text-xl" />}
              className="rounded-lg hover:bg-pink-50 transition !ps-5 !justify-start !items-start"
              variant="text"
            >
              Address
            </Button>
          </Link>
          <Link to="/my-list" className="w-full">
            <Button
              fullWidth
              startIcon={<MdFavorite className="text-pink-600 text-xl" />}
              className="rounded-lg hover:bg-pink-50 transition !ps-5 !justify-start !items-start"
              variant="text"
            >
              My List
            </Button>
          </Link>
          <Link to="/my-order" className="w-full">
            <Button
              fullWidth
              startIcon={<MdListAlt className="text-pink-600 text-xl" />}
              className="rounded-lg hover:bg-pink-50 transition !ps-5 !justify-start !items-start"
              variant="text"
            >
              My Orders
            </Button>
          </Link>
          <Link to="/change-password" className="w-full">
            <Button
              fullWidth
              startIcon={<MdLock className="text-pink-600 text-xl" />}
              className="rounded-lg hover:bg-pink-50 transition !ps-5 !justify-start !items-start"
              variant="text"
            >
              Change Password
            </Button>
          </Link>
          <Divider className="my-2" />
          <Link to="/logout" className="w-full">
            <Button
              fullWidth
              startIcon={<MdLogout className="text-red-500 text-xl" />}
              className="rounded-lg hover:bg-red-50 transition"
              variant="text"
            >
              <span className="text-red-600 font-bold">Logout</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Account;
