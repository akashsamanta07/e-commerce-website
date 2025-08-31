import React, { useState, useEffect } from 'react';
import { IconButton, Badge, Avatar, Menu, MenuItem, Tooltip, Divider, Typography, Box } from '@mui/material';
import { MdNotificationsNone, MdMenu } from 'react-icons/md';
import { FaUserCircle } from 'react-icons/fa';
import { FiUser, FiLogOut } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Slideber from '../Slideber';
import API_BASE from '../../utils/API_BASE';
import getImageUrl from '../getImageUrl';

// Use the same defaultProfilePic logic as in Account.jsx
const defaultProfilePic = (
  <FaUserCircle className="text-gray-400" style={{ fontSize: 32 }} />
);

const defaultMenuProfilePic = (
  <FaUserCircle className="text-gray-400" style={{ fontSize: 40 }} />
);

const mockUser = {
  name: "Admin User",
  email: "admin@admin.com",
  img: null, // set to a url string to test with image
};

function Header2({obj}) {
  let {data}=obj;
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchLogo = async () => {
      try {
        const res = await fetch(`${API_BASE}/admin/get-logo`);
        const data = await res.json();
        if (isMounted) {
          if (data.success && data.data && data.data.image) {
            setLogoUrl(getImageUrl(data.data.image));
          } else {
            setLogoUrl('https://via.placeholder.com/120x60?text=No+Logo');
          }
        }
      } catch (err) {
        if (isMounted) {
          setLogoUrl('https://via.placeholder.com/120x60?text=No+Logo');
        }
      }
    };
    fetchLogo();
    return () => {
      isMounted = false;
    };
  }, [data.logo]);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    // Add sign out logic here
    alert("Signed out!");
    setAnchorEl(null);
  };

  return (
    <header className="bg-white w-full shadow">
      <Slideber open={openMenu} side="left" onClose={() => setOpenMenu(false)} />
      <div className="Container mx-auto flex items-center justify-between py-2">
        {/* Left: Logo on md+, Menu icon always visible */}
        <div className="flex-1 flex items-center">
          {/* Logo: hidden on small screens, show on md+ */}
          <img
            src={logoUrl}
            alt="Logo"
            className="h-10 object-contain hidden md:block"
            onError={e => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/120x60?text=No+Logo";
            }}
          />
          {/* Menu icon: only visible on small screens */}
          <IconButton sx={{ display: { xs: 'block', md: 'none' } }} aria-label="menu" onClick={() => setOpenMenu(true)}>
            <MdMenu size={30} color="#000" />
          </IconButton>
        </div>
        {/* Right section: notification + profile */}
        <div className="flex items-center gap-4">
          {/* Notification Icon */}
          <Tooltip title="Notifications">
            <IconButton>
              <Badge badgeContent={10} color="error">
                <MdNotificationsNone size={26} color="#000" />
              </Badge>
            </IconButton>
          </Tooltip>
          {/* Profile Icon */}
          <Tooltip title="Profile">
            <IconButton onClick={handleProfileClick} size="large">
              {mockUser.img ? (
                <Avatar src={mockUser.img} alt={mockUser.name} sx={{ width: 32, height: 32, mx: 0 }} />
              ) : (
                defaultProfilePic
              )}
            </IconButton>
          </Tooltip>
          {/* Profile Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              sx: { minWidth: 240, borderRadius: 2, p: 1 }
            }}
          >
            {/* First section: Profile summary */}
            <Box display="flex" alignItems="center" justifyContent="space-between" py={1} px={2}>
              <Box display="flex" alignItems="center" gap={1.5}>
                {mockUser.img ? (
                  <Avatar src={mockUser.img} alt={mockUser.name} sx={{ width: 40, height: 40, mx: 0 }} />
                ) : (
                  defaultMenuProfilePic
                )}
              </Box>
              <Box textAlign="right" ml={2}>
                <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                  {mockUser.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {mockUser.email}
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 1 }} />
            {/* Second section: Actions */}
            <MenuItem
              component={Link}
              to="/admin/profile"
              onClick={handleProfileClose}
            >
              <FiUser size={18} className="mr-2" />
              Profile
            </MenuItem>
            <MenuItem onClick={handleSignOut}>
              <FiLogOut size={18} className="mr-2" />
              Logout
            </MenuItem>
          </Menu>
        </div>
      </div>
    </header>
  );
}

export default Header2;