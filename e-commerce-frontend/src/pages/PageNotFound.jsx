import React from 'react';
import { MdErrorOutline } from 'react-icons/md';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

function PageNotFound() {
  return (
    <div className="my-8 mx-5 #f5f0f0 flex items-center justify-center ">
      <div className="flex flex-col items-center">
        <MdErrorOutline className="text-pink-500 text-7xl mb-4" />
        <h1 className="text-5xl font-bold text-gray-800 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Page Not Found</h2>
        <p className="text-gray-500 mb-6 text-center max-w-md">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button
            className="!bg-pink-600 hover:!bg-black !text-white !font-semibold !rounded-md !shadow-md"
            size="large"
          >
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default PageNotFound;