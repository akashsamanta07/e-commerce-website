import React, { useMemo, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import notify from '../Notification/notify';

// Custom hook to detect if screen width is less than 765px
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 765);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 765);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
}

const NAV_ITEMS = [
  {
    label: 'Home',
    icon: <HomeIcon sx={{ fontSize: '1.7rem', p: '4px' }} />,
    to: '/',
    onClick: setis => setis(0),
    sx: { px: 1.5 },
  },
  {
    label: 'Search',
    icon: <SearchIcon sx={{ fontSize: '1.7rem', p: '4px' }} />,
    to: '/menu/Search',
    onClick: setis => setis(1),
  },
  {
    label: 'Wishlist',
    icon: <FavoriteBorderIcon sx={{ fontSize: '1.7rem', p: '4px' }} />,
    to: '/my-list',
    onClick: (setis, auth) => {
      if (auth && auth._id) {
        setis(0);
      } else {
        notify("error", "You are not logged in");
      }
    },
  },
  {
    label: 'Order',
    icon: <ListAltIcon sx={{ fontSize: '1.7rem', p: '4px' }} />,
    to: '/my-order',
    onClick: (setis, auth) => {
      if (auth && auth._id) {
        setis(0);
      } else {
        notify("error", "You are not logged in");
      }
    },
  },
  {
    label: 'Account',
    icon: <AccountCircleIcon sx={{ fontSize: '1.7rem', p: '4px' }} />,
    to: '/my-account',
    onClick: (setis, auth) => {
      if (auth && auth._id) {
        setis(0);
      } else {
        notify("error", "You are not logged in");
      }
    },
    sx: { px: 1.5 },
  },
];

const routeToIndex = {
  '/': 0,
  '/menu/Search': 1,
  '/my-list': 2,
  '/my-order': 3,
  '/my-account': 4,
};

function getCurrentIndex(pathname) {
  // Exact match or startsWith for subroutes
  for (const [route, idx] of Object.entries(routeToIndex)) {
    if (route === '/') {
      if (pathname === '/') return idx;
    } else if (pathname.startsWith(route)) {
      return idx;
    }
  }
  return 0;
}

function FixedBar({ setis, auth }) {
  const isMobile = useIsMobile();
  const location = useLocation();
  const currentIndex = useMemo(() => getCurrentIndex(location.pathname), [location.pathname]);
  const [value, setValue] = useState(currentIndex);

  useEffect(() => {
    setValue(currentIndex);
  }, [currentIndex]);

  const actionSx = {
    padding: '8px 0 4px 0',
    minWidth: 0,
    flex: 1,
    '& .MuiBottomNavigationAction-label': {
      fontSize: '12px',
      fontWeight: 500,
      paddingTop: '2px',
      transition: 'color 0.2s',
    },
    '& .MuiSvgIcon-root': {
      fontSize: '1.7rem',
      padding: '4px',
      transition: 'color 0.2s',
    },
    '&:hover .MuiSvgIcon-root, &:hover .MuiBottomNavigationAction-label': {
      color: '#e11d48',
    },
    '&.Mui-selected .MuiSvgIcon-root, &.Mui-selected .MuiBottomNavigationAction-label': {
      color: '#e11d48',
    },
  };

  if (!isMobile) return null;

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: 'block',
        pb: 'env(safe-area-inset-bottom)',
      }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(_, newValue) => setValue(newValue)}
        sx={{
          px: 0,
          py: 0.5,
          '& .MuiBottomNavigationAction-root': actionSx,
        }}
      >
        {NAV_ITEMS.map((item, idx) => (
          <BottomNavigationAction
            key={item.label}
            label={item.label}
            icon={item.icon}
            component={Link}
            to={item.to}
            sx={{ ...actionSx, ...(item.sx || {}) }}
            onClick={() => item.onClick(setis, auth)}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}

export default FixedBar;