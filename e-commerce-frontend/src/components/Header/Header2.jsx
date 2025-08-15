import React, { useState } from 'react';
import { FaSearch, FaHeart, FaShoppingCart } from 'react-icons/fa';
import { HiMenuAlt2 } from 'react-icons/hi';
import { IconButton, Badge } from '@mui/material';
import logo from '../../assets/logo/logo1.jpg';
import { SlideDrawer } from '../Slideber.jsx';
import { DrawerContentMenu } from '../Slideber.jsx';
import { DrawerContentCart } from '../Slideber.jsx';
import { Link } from "react-router-dom";

function Header2({ header2 }) {
  let { cartCount, search, setSearch, wishlistcount, setmenu, setsubcategory: setsubcategory } = header2;
  const [openMenu, setOpenMenu] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  let menuobj = {
    setmenu,
    setsubcategory
  };

  const onsubmit = (event) => {
    event.preventDefault();
    setSearch(event.target.value);
    setmenu("Home");
    setsubcategory("");
    // You can add search logic here
  };

  // Handler for "Continue Shopping" button
  const handleContinueShopping = () => {
    setOpenCart(false);
    // Optionally, navigate to shop or home page
    window.location.href = '/';
  };

  return (
    <div className='bg-white border-b border-gray-200'>
      {/* Drawers */}
      <SlideDrawer open={openMenu} side="left" onClose={() => setOpenMenu(false)}>
        <DrawerContentMenu menuobj={menuobj} />
      </SlideDrawer>
      <SlideDrawer open={openCart} side="right" onClose={() => setOpenCart(false)}>
        <DrawerContentCart cartCount={cartCount} onContinueShopping={handleContinueShopping} />
      </SlideDrawer>
      <div className="Container border-b border-gray-200 py-2 md:py-3">
        <div className="w-full flex items-center justify-between gap-[10px]">
          {/* Menu icon (HiMenuAlt2) always visible on left, no search button on mobile */}
          {/* Desktop: Search box in exact center, Logo left on desktop, center on mobile */}
          <div className="flex items-center flex-shrink-0 md:hidden">
            <IconButton aria-label="menu" onClick={() => setOpenMenu(true)}>
              <HiMenuAlt2 className="text-gray-600" />
            </IconButton>
          </div>

          {/* Logo */}
          <div>
            <img
              src={logo}
              alt="Logo"
              className="h-8 w-auto object-contain md:h-10"
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
                // You can add value/onChange here for state management
              />
              <IconButton
                type="submit"
                aria-label="search"
                className="p-2"
                // You can handle onClick or onSubmit at the form level
              >
                <FaSearch className="text-gray-500 text-[16px]" />
              </IconButton>
            </form>
          </div>

          {/* Right: Auth and user actions (desktop), Cart (mobile) */}
          <div className="flex items-center gap-2">
            {/* Desktop: Register/Login/Wishlist/Cart */}
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
            <div className="relative group hidden md:flex items-center">
              <IconButton aria-label="cart" onClick={() => setOpenCart(true)}>
                <Badge badgeContent={cartCount} color="primary">
                  <FaShoppingCart className="text-gray-600" />
                </Badge>
              </IconButton>
              <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                Cart
              </span>
            </div>
            {/* Mobile: Cart icon on right */}
            <div className="md:hidden flex items-center">
              <IconButton aria-label="cart" onClick={() => setOpenCart(true)}>
                <Badge badgeContent={cartCount} color="primary">
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