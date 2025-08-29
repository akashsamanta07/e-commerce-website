import React from 'react';
import { Link } from 'react-router-dom';
import logo1 from '../../assets/logo/logo1.jpg';
import { Button } from '@mui/material';
import { FiLogIn } from 'react-icons/fi';

function Header1() {
  return (
    <header className="bg-white w-full shadow">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-4">
        {/* Logo - left on md+, center on small screens */}
        <div className="flex-1 flex justify-center md:justify-start">
          <img
            src={logo1}
            alt="Logo"
            className="h-10 object-contain"
          />
        </div>
        {/* Login button - hidden on small screens */}
        <div className="hidden md:flex">
          <Link to="/login">
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