import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    try {
      window.scrollTo(0, 0);
    } catch (error) {
      // Optionally log or handle the error
      // console.error('ScrollToTop error:', error);
    }
  }, [location.pathname]);

  return null;
}
