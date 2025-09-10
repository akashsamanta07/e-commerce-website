import React, { useState, useEffect } from 'react';
import { IconButton, Badge, Avatar, Menu, MenuItem, Tooltip, Divider, Typography, Box } from '@mui/material';
import { MdNotificationsNone, MdMenu, MdLockReset } from 'react-icons/md';
import { FiUser, FiLogOut } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import Slideber from '../Slideber';
import API_BASE from '../../utils/API_BASE';
import getImageUrl from '../getImageUrl';

// Helper to get first letter of name, fallback to "A"
const getInitial = (name) => {
  if (!name || typeof name !== 'string') return 'A';
  return name.trim().charAt(0).toUpperCase();
};

function Header2({ auth, obj }) {
  let { data } = obj;
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchLogo = async () => {
      try {
        const res = await fetch(`${API_BASE}/admin/get-logo`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (isMounted) {
          if (data.success && data.data && data.data.image) {
            setLogoUrl(getImageUrl(data.data.image));
          } else {
            setLogoUrl('');
          }
        }
      } catch (err) {
        if (isMounted) {
          setLogoUrl('');
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
    setAnchorEl(null);
    navigate("/logout");
  };

  // Use auth for user info
  const userName = auth?.name || "Admin User";
  const userEmail = auth?.email || "admin@admin.com";
  const userImg = getImageUrl(auth?.avatar) || null;
  const userInitial = getInitial(userName);

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
            className="h-10 object-contain hidden xl:block"
            onError={e => {
              e.target.onerror = null;
              e.target.src = "";
            }}
          />
          {/* Menu icon: only visible on small screens */}
          <IconButton
            sx={{ display: { xs: 'block', sm: 'block', xl: 'none' } }}
            aria-label="menu"
            onClick={() => setOpenMenu(true)}
          >
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
              {userImg ? (
                <Avatar src={userImg} alt={userName} sx={{ width: 32, height: 32, mx: 0 }} />
              ) : (
                <Avatar sx={{ width: 32, height: 32, mx: 0, bgcolor: "#e5e7eb", color: "#6b7280", fontWeight: 600, fontSize: 18 }}>
                  {userInitial}
                </Avatar>
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
                {userImg ? (
                  <Avatar src={userImg} alt={userName} sx={{ width: 40, height: 40, mx: 0 }} />
                ) : (
                  <Avatar sx={{ width: 40, height: 40, mx: 0, bgcolor: "#e5e7eb", color: "#6b7280", fontWeight: 700, fontSize: 22 }}>
                    {userInitial}
                  </Avatar>
                )}
              </Box>
              <Box textAlign="right" ml={2}>
                <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                  {userName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {userEmail}
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
            <MenuItem
              component={Link}
              to="/auth/change-password"
              onClick={handleProfileClose}
            >
              <MdLockReset size={18} className="mr-2" />
              Change Password
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