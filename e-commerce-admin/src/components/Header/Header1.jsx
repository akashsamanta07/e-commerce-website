import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { FiLogIn } from 'react-icons/fi';
import API_BASE from '../../utils/API_BASE';
import getImageUrl from '../getImageUrl';

function Header1({obj}) {
  const [logoUrl, setLogoUrl] = useState('');
  let {data}=obj;

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

  return (
    <header className="bg-white w-full shadow">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-4">
        {/* Logo - left on md+, center on small screens */}
        <div className="flex-1 flex justify-center md:justify-start">
          <img
            src={logoUrl}
            alt="Logo"
            className="h-10 object-contain"
            style={{ maxWidth: 160, minWidth: 60 }}
            onError={e => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/120x60?text=No+Logo";
            }}
          />
        </div>
        {/* Login button - hidden on small screens */}
        <div className="hidden md:flex">
          <Link to="/admin/login">
            <Button
              variant="contained"
              startIcon={<FiLogIn />}
              sx={{
                backgroundColor: '#ec4899',
                color: '#fff',
                textTransform: 'none',
                borderRadius: '0.375rem',
                px: 3,
                py: 1,
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: '#000',
                  color: '#fff',
                },
              }}
            >
              Login
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header1;