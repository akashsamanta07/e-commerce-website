import React from 'react';
import { Button } from '@mui/material';
import { MdErrorOutline } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[90vh] px-4"
      style={{
        background: 'linear-gradient(135deg, #fceabb 0%, #f8b500 100%)',
      }}
    >
      <div className="flex flex-col items-center">
        <MdErrorOutline size={90} className="text-pink-600 mb-4" />
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-2 text-center">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4 text-center">
          Page Not Found
        </h2>
        <p className="text-gray-600 text-center mb-8 max-w-md">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          sx={{
            backgroundColor: '#ec4899',
            color: '#fff',
            textTransform: 'none',
            borderRadius: '0.375rem',
            px: 4,
            py: 1.5,
            fontWeight: 600,
            fontSize: '1rem',
            '&:hover': {
              backgroundColor: '#000',
              color: '#fff',
            },
          }}
          onClick={() => navigate('/admin/dashboard')}
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}

export default PageNotFound;