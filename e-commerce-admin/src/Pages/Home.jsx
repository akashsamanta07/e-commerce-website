import React from 'react';
import { Button, Divider } from '@mui/material';
import { MdDashboard, MdCategory, MdShoppingCart, MdViewCarousel, MdImage, MdLogout, MdStore } from 'react-icons/md';
import { FaRegImages } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const sidebarItems = [
  {
    label: 'Dashboard',
    icon: <MdDashboard className="text-xl" />,
    to: '/admin/dashboard',
  },
  {
    label: 'Home Slider',
    icon: <MdViewCarousel className="text-xl" />,
    to: '/admin/slider',
  },
  {
    label: 'Category',
    icon: <MdCategory className="text-xl" />,
    to: '/admin/category',
  },
  {
    label: 'Products',
    icon: <MdStore className="text-xl" />,
    to: '/admin/products',
  },
  {
    label: 'Orders',
    icon: <MdShoppingCart className="text-xl" />,
    to: '/admin/orders',
  },
  {
    label: 'Banner',
    icon: <FaRegImages className="text-xl" />,
    to: '/admin/banner',
  },
  {
    label: 'Manage Logo',
    icon: <MdImage className="text-xl" />,
    to: '/admin/logo',
  },
];

function Home({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add logout logic here
    // e.g., clear tokens, redirect, etc.
    navigate('/admin/login');
  };

  // The main fix: set the right part to be a flex column with min-h-0 and the content to flex-1 and overflow-y-auto.
  // This ensures the overflow-y-auto works as expected.
  return (
    <div className="lg:flex lg:h-[96vh]">
      {/* Left part: only show on large screens */}
      <div className="hidden lg:flex flex-col w-72 bg-white h-full border-r">
        {/* Sidebar Navigation */}
        <nav className="flex-1 flex flex-col gap-1 px-3 py-4">
          {sidebarItems.map((item) => (
            <Link to={item.to} key={item.label}>
              <Button
                fullWidth
                startIcon={item.icon}
                className="justify-start !ps-5 !items-center rounded-lg hover:bg-pink-50 transition text-gray-700 font-medium"
                variant="text"
                sx={{
                  textTransform: 'none',
                  justifyContent: 'flex-start',
                  color: '#374151',
                  fontWeight: 500,
                  fontSize: 16,
                  mb: 0.5,
                }}
              >
                {item.label}
              </Button>
            </Link>
          ))}
          <Divider className="my-2" />
          <Button
            fullWidth
            startIcon={<MdLogout className="text-red-500 text-xl" />}
            className="justify-start !ps-5 !items-center rounded-lg hover:bg-red-50 transition"
            variant="text"
            sx={{
              textTransform: 'none',
              justifyContent: 'flex-start',
              color: '#dc2626',
              fontWeight: 600,
              fontSize: 16,
              mt: 1,
            }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </nav>
      </div>
      {/* Right part: always visible, takes remaining width */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Home;