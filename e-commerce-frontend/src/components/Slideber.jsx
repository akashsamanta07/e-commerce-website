import { FaShoppingCart } from 'react-icons/fa';
import React, { useState } from 'react';
import logo from '../assets/logo/logo1.jpg'
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { Link } from 'react-router-dom';

export function SlideDrawer({ open, side, onClose, children }) {
  const fnlogo = () => {
    return (
      <div className="flex justify-center py-4 border-b">
        <img
          src={logo}
          alt="Logo"
          className="h-8 w-auto object-contain md:h-10"
        />
      </div>
    )
  }
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
          fixed top-0 ${side === 'left' ? 'left-0' : 'right-0'}
          h-full w-72 bg-white shadow-lg z-50
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
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <span className="font-bold text-lg">{side === 'left' ? 'Shop by Categories' : 'Cart'}</span>
          <button onClick={onClose} className="text-gray-500 hover:text-pink-600 text-2xl">&times;</button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </>
  );
}

export function DrawerContentMenu({ menuobj }) {
  let { setmenu, setsubcategory } = menuobj;
  const categories = [
    { name: 'Fashion', sub: ['Men', 'Women', 'Kids'] },
    { name: 'Electronics', sub: ['Mobiles', 'Laptops', 'Smart Watch'] },
    { name: 'Bags', sub: ['Men Bags', 'Women Bags'] },
    { name: 'Footwear', sub: ['Men Footwears', 'Women Footwear', 'Kids Footwear'] },
    { name: 'Groceries', sub: ['Vegetables', 'Fruits', 'Others'] },
    { name: 'Beauty', sub: ['Skincare', 'Makeup', 'Fragrance'] },
    { name: 'Wellness', sub: ['Supplements', 'Yoga Mats', 'Personal Care'] },
    { name: 'Jewellery', sub: ['Necklaces', 'Rings', 'Bracelets'] },
  ];

  const [expanded, setExpanded] = useState(null);

  const toggleExpand = (index, item) => {
    setExpanded(expanded === index ? null : index);
    setmenu(item)
    setsubcategory('')
  };

  return (
    <div className="space-y-4">
      {/* Categories */}
      <ul className="space-y-2 px-4">
        {categories.map((cat, index) => (
          <li key={index}>
            <Link to={`/${cat.name.toLowerCase()}`}>
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
                  <li key={subIndex} className="hover:text-pink-500 cursor-pointer" onClick={() => { setmenu(cat.name);setsubcategory(subItem) }}>
                    {subItem}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// DrawerContentCart component
export function DrawerContentCart({ cartCount, onContinueShopping }) {
  if (cartCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-60">
        <FaShoppingCart className="text-gray-300" style={{ fontSize: '72px' }} />
        <p className="text-gray-700 mt-4 mb-4 text-lg font-semibold">Your cart is empty.</p>
        <button
          onClick={onContinueShopping}
          className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-6 rounded transition"
        >
          Continue Shopping
        </button>
      </div>
    );
  }
  // You can add cart items here for non-empty cart
  return (
    <div>
      <p className="text-gray-700 mb-2">Your cart has {cartCount} item(s).</p>
      {/* Render cart items here */}
    </div>
  );
}
