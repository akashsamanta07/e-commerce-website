import React, { useState, useEffect } from 'react';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import Card from './Order/Card.jsx';
import { Button } from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';
import getImageUrl from './getImageUrl.js';
import API_BASE from '../utils/API_BASE';

// Local categories/subcategories definition
const localCategories = [
  { name: 'Fashion', sub: ['Men', 'Women', 'Kids'] },
  { name: 'Electronics', sub: ['Mobiles', 'Laptops', 'Smart Watch'] },
  { name: 'Bags', sub: ['Men Bags', 'Women Bags'] },
  { name: 'Footwear', sub: ['Men Footwears', 'Women Footwear', 'Kids Footwear'] },
  { name: 'Groceries', sub: ['Vegetables', 'Fruits', 'Others'] },
  { name: 'Beauty', sub: ['Skincare', 'Makeup', 'Fragrance'] },
  { name: 'Wellness', sub: ['Supplements', 'Yoga Mats', 'Personal Care'] },
  { name: 'Jewellery', sub: ['Necklaces', 'Rings', 'Bracelets'] },
];

export function SlideDrawer({ open, side, onClose, children }) {
  // Add DB logo support
  const [logoUrl, setLogoUrl] = useState();

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
    // Only fetch logo if left drawer (menu)
    if (side === 'left') {
      fetchLogo();
    }
    return () => {
      isMounted = false;
    };
    // Only refetch if side changes to left
    // eslint-disable-next-line
  }, [side]);

  const fnlogo = () => (
    <div className="flex justify-center py-4 border-b">
      <img
        src={logoUrl}
        alt="Logo"
        className="h-8 w-auto object-contain md:h-10"
      />
    </div>
  );
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
        <div className="flex justify-between items-center px-6 py-3 border-b">
          <span className="font-bold text-lg ps-2 text-pink-600">{side === 'left' ? 'Shop by Categories' : 'Cart Items'}</span>
          <button onClick={onClose} className="text-gray-500 hover:text-pink-600 text-2xl">&times;</button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </>
  );
}

export function DrawerContentMenu({ menuobj, setOpenMenu }) {
  let { setmenu, setsubcategory, categories } = menuobj;
  // categories is an array of objects, each with at least a 'name' property

  // Build a Set of category names from the prop categories array of objects
  const categoryNamesSet = new Set(
    Array.isArray(categories)
      ? categories.map(catObj => typeof catObj === 'object' && catObj.name ? catObj.name : null).filter(Boolean)
      : []
  );

  // Only show categories that are present in the prop categories array (by name)
  const filteredCategories = localCategories.filter(localCat =>
    categoryNamesSet.has(localCat.name)
  );

  const [expanded, setExpanded] = useState(null);

  const toggleExpand = (index, item) => {
    setExpanded(expanded === index ? null : index);
    setmenu(item);
    setsubcategory('');
  };

  return (
    <div className="space-y-4">
      {/* Categories */}
      <ul className="space-y-2 px-4">
        {filteredCategories.map((cat, index) => (
          <li key={index}>
            <Link to={`/menu/${cat.name.toLowerCase()}`}>
              <button
                className="flex justify-between items-center w-full text-gray-700 hover:text-pink-600 font-medium"
                onClick={() => toggleExpand(index, cat.name)}
              >
                {cat.name}
                <span
                  className={`border border-gray-400 rounded-full p-1 flex items-center justify-center 
                    ${expanded === index ? 'text-pink-600 border-pink-600' : 'text-gray-500'} 
                    hover:border-pink-600 hover:text-pink-600 transition-colors duration-200`}
                >
                  {expanded === index ? (
                    <AiOutlineMinus className="font-bold text-lg" />
                  ) : (
                    <AiOutlinePlus className="font-bold text-lg" />
                  )}
                </span>
              </button>
            </Link>
            {expanded === index && (
              <ul className="pl-4 mt-2 space-y-1 text-sm text-gray-600">
                {cat.sub.map((subItem, subIndex) => (
                  <li
                    key={subIndex}
                    className="hover:text-pink-500 cursor-pointer"
                    onClick={() => {
                      setmenu(cat.name);
                      setsubcategory(subItem);
                      setOpenMenu(false);
                    }}
                  >
                    {subItem}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      {/* Add a MI (Material UI) Button for Login */}
      <div className="px-4 pt-4">
        <Link to="/login" style={{ textDecoration: 'none' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<LoginIcon />}
            sx={{
              backgroundColor: "#ec4899",
              color: "#fff",
              "&:hover": { backgroundColor: "black" },
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "1rem",
              width: "100%",
              boxShadow: 1,
              textTransform: "none"
            }}
            fullWidth
            onClick={()=>{setOpenMenu(false)}}
          >
            Login
          </Button>
        </Link>
      </div>
    </div>
  );
}

// DrawerContentCart component
export function DrawerContentCart({ header2, onClose }) {
  // You can add cart items here for non-empty cart
  return (
    <div>
      <Card header2={header2} onClose={onClose}/>
    </div>
  );
}
