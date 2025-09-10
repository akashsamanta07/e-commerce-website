import React, { useEffect, useState } from 'react';
import logoFallback from '../assets/logo/logo1.jpg';
import { Button, Divider } from '@mui/material';
import { MdDashboard, MdCategory, MdShoppingCart, MdViewCarousel, MdImage, MdLogout, MdStore } from 'react-icons/md';
import { FaRegImages } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import API_BASE from '../utils/API_BASE';
import getImageUrl from './getImageUrl';

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

function Slideber({ open, side, onClose }) {
  const [logoUrl, setLogoUrl] = useState(logoFallback);
  const navigate = useNavigate();

  // Fetch logo from API (like in Home.jsx/Header2.jsx)
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
  }, []);

  const fnlogo = () => (
    <div className="flex justify-center py-4 border-b">
      <img
        src={logoUrl}
        alt="Logo"
        className="h-8 w-auto object-contain md:h-10"
        onError={e => {
          e.target.onerror = null;
          setLogoUrl('');
        }}
      />
    </div>
  );

  const handleLogout = () => {
    onClose();
    navigate('/logout');
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-30 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      {/* Drawer */}
      <div
        className={`
          fixed top-0 ${side === 'left' ? 'left-0 w-72' : 'right-0 w-[21rem] lg:w-[25rem]'}
          h-full bg-white shadow-lg z-50
          transform transition-transform duration-300
          ${open
            ? 'translate-x-0'
            : side === 'left'
              ? '-translate-x-full'
              : 'translate-x-full'
          }
        `}
      >
        {side === 'left' ? fnlogo() : ""}
        <div className="p-4">
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
                  onClick={() => { onClose(); }}
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
      </div>
    </>
  );
}

export default Slideber;