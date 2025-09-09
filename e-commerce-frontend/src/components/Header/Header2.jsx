import React, { useState, useEffect } from 'react';
import { FaSearch, FaHeart, FaShoppingCart } from 'react-icons/fa';
import { HiMenuAlt2 } from 'react-icons/hi';
import { IconButton, Badge, Avatar, Button, Popover, Typography, Box, Divider } from '@mui/material';
import { SlideDrawer } from '../Slideber.jsx';
import { DrawerContentMenu } from '../Slideber.jsx';
import { DrawerContentCart } from '../Slideber.jsx';
import { Link, useNavigate } from "react-router-dom";
import getImageUrl from '../getImageUrl.js';
import API_BASE from '../../utils/API_BASE';

// Helper to get first letter of name, fallback to "A"
const getInitial = (name) => {
  if (!name || typeof name !== 'string') return 'A';
  return name.trim().charAt(0).toUpperCase();
};

function Header2({ header2 }) {
  let { cartlist, search, setSearch, wishlistcount, setmenu, setsubcategory, setis, categories, auth } = header2;
  const [openMenu, setOpenMenu] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [logoUrl, setLogoUrl] = useState();
  let menuobj = {
    setmenu,
    setsubcategory,
    categories
  };
  const navigate = useNavigate();

  // Fetch logo from DB
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
            setLogoUrl();
          }
        }
      } catch (err) {
        if (isMounted) {
          setLogoUrl();
        }
      }
    };
    fetchLogo();
    return () => {
      isMounted = false;
    };
  }, []);

  const onsubmit = (event) => {
    event.preventDefault();
    setSearch(event.target.value);
    setmenu("Home");
    setsubcategory("");
    // You can add search logic here
  };

  // For popover open/close
  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const openPopover = Boolean(anchorEl);

  // User info
  const userName = auth && (auth.name || auth.fullName || auth.username || auth.email || "");
  const userEmail = auth && (auth.email || "");
  const userImg = getImageUrl(auth?.avatar) || null;
  const userInitial = getInitial(userName);

  return (
    <div className='bg-white border-b border-gray-200'>
      {/* Drawers */}
      <SlideDrawer open={openMenu} side="left" onClose={() => setOpenMenu(false)}>
        <DrawerContentMenu menuobj={menuobj} setOpenMenu={setOpenMenu}/>
      </SlideDrawer>
      <SlideDrawer open={openCart} side="right" onClose={() => setOpenCart(false)}>
        <DrawerContentCart header2={header2} onClose={() => setOpenCart(false)} />
      </SlideDrawer>
      <div className="Container border-b border-gray-200 py-2 md:py-3">
        <div className="w-full flex items-center justify-between gap-[10px]">
          {/* Menu icon (HiMenuAlt2) always visible on left, no search button on mobile */}
          <div className="flex items-center flex-shrink-0 md:hidden" onClick={() => { setis(0) }}>
            <IconButton aria-label="menu" onClick={() => setOpenMenu(true)}>
              <HiMenuAlt2 className="text-gray-600" />
            </IconButton>
          </div>

          {/* Logo */}
          <div>
            <img
              src={logoUrl}
              alt="Logo"
              className="h-8 w-auto object-contain md:h-10"
              onError={e => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/120x60?text=No+Logo";
              }}
            />
          </div>
          {/* Desktop: Search box absolutely centered */}
          <div className="hidden md:block w-full max-w-md">
            <form className="flex items-center bg-gray-100 rounded-md px-2 py-1" onSubmit={onsubmit}>
              <input
                type="text"
                placeholder="Search for products..."
                aria-label="search"
                className="flex-1 px-2 bg-transparent outline-none"
                value={search}
                onChange={onsubmit}
                onClick={()=>{navigate("/menu/Search")}}
              />
              <IconButton
                type="submit"
                aria-label="search"
                className="p-2"
              >
                <FaSearch className="text-gray-500 text-[16px]" />
              </IconButton>
            </form>
          </div>

          {/* Right: Auth and user actions (desktop), Cart (mobile) */}
          <div className="flex items-center gap-2">
            {/* If not logged in: Register/Login */}
            {!auth || Object.keys(auth).length === 0 ? (
              <>
                <Link
                  to="/register"
                  className="text-gray-700 hover:text-pink-600 font-medium hidden md:inline"
                >
                  Register
                </Link>
                <span className="hidden md:inline text-gray-300 text-lg select-none">|</span>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-pink-600 font-medium hidden md:inline"
                >
                  Login
                </Link>
              </>
            ) : (
              // If logged in: Avatar (desktop only)
              <div className="hidden md:flex items-center">
                <IconButton onClick={handleAvatarClick} size="small" sx={{ ml: 1 }}>
                  {userImg ? (
                    <Avatar src={userImg} alt={userName} sx={{ width: 32, height: 32, mx: 0 }} />
                  ) : (
                    <Avatar sx={{ width: 32, height: 32, mx: 0, bgcolor: "#e5e7eb", color: "#6b7280", fontWeight: 600, fontSize: 18 }}>
                      {userInitial}
                    </Avatar>
                  )}
                </IconButton>
                <Popover
                  open={openPopover}
                  anchorEl={anchorEl}
                  onClose={handlePopoverClose}
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
                  <Box display="flex" alignItems="center" py={1} px={2}>
                    {userImg ? (
                      <Avatar src={userImg} alt={userName} sx={{ width: 40, height: 40, mx: 0 }} />
                    ) : (
                      <Avatar sx={{ width: 40, height: 40, mx: 0, bgcolor: "#e5e7eb", color: "#6b7280", fontWeight: 700, fontSize: 22 }}>
                        {userInitial}
                      </Avatar>
                    )}
                    <Box ml={2}>
                      <Typography variant="subtitle1" fontWeight={600} color="text.primary" align="right">
                        {userName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="right">
                        {userEmail}
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box px={2} pb={1}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      component={Link}
                      to="/my-account"
                      onClick={handlePopoverClose}
                      sx={{ textTransform: 'none', fontWeight: 600 }}
                    >
                      My Account
                    </Button>
                  </Box>
                </Popover>
              </div>
            )}

            {/* Wishlist (desktop only) */}
            <Link to='/my-list'>
              <div className="relative group hidden md:flex items-center">
                <IconButton aria-label="wishlist">
                  <Badge badgeContent={wishlistcount} color="error">
                    <FaHeart className="text-gray-600" />
                  </Badge>
                </IconButton>
                <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  Wishlist
                </span>
              </div>
            </Link>
            {/* Cart (desktop only) */}
            <div className="relative group hidden md:flex items-center" onClick={() => { setis(0) }}>
              <IconButton aria-label="cart" onClick={() => setOpenCart(true)}>
                <Badge badgeContent={cartlist.length} color="primary">
                  <FaShoppingCart className="text-gray-600" />
                </Badge>
              </IconButton>
              <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                Cart
              </span>
            </div>
            {/* Mobile: Cart icon on right */}
            <div className="md:hidden flex items-center" onClick={() => { setis(0) }}>
              <IconButton aria-label="cart" onClick={() => setOpenCart(true)}>
                <Badge badgeContent={cartlist.length} color="primary">
                  <FaShoppingCart className="text-gray-600" />
                </Badge>
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header2;