import React, { useState } from 'react';
import { HiMenuAlt2 } from 'react-icons/hi';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { FaPlane } from 'react-icons/fa';
import { Button } from '@mui/material';
import { SlideDrawer } from '../Slideber.jsx';
import { DrawerContentMenu } from '../Slideber.jsx';
import { Link } from 'react-router-dom';

// Create an array of category items
const categoryItems = [
  'Home',
  'Fashion',
  'Electronics',
  'Bags',
  'Footwear',
  'Groceries',
  'Beauty',
  'Wellness',
  'Jewellery',
];

function Header3({ header3 }) {
  let { setmenu, setsubcategory } = header3;
  const [openMenu, setOpenMenu] = useState(false);
  let menuobj = {
    setmenu,
    setsubcategory,
  };

  // Helper to get the link path for each category
  const getCategoryLink = (item) => {
    if (item === 'Home') return '/';
    return `/${item.toLowerCase()}`;
  };

  return (
    <div className="shadow-b shadow-md bg-white border-b-[1px]">
      <SlideDrawer open={openMenu} side="left" onClose={() => setOpenMenu(false)}>
        <DrawerContentMenu menuobj={menuobj} />
      </SlideDrawer>
      <div className=" flex items-center justify-between py-2 px-1 Container">
        {/* Left: Shop by Categories (hidden on small/tab screens) */}
        <div className="hidden xl:flex items-center gap-2">
          <button className="flex items-center gap-1 px-3 py-1 rounded-md  hover:bg-gray-100 transition text-gray-700 font-medium text-sm md:text-base" onClick={() => setOpenMenu(true)}>
            <HiMenuAlt2 className="text-lg" />
            <span className="ml-1 whitespace-nowrap">Shop by Categories</span>
            <MdKeyboardArrowDown className="ml-1 text-xl" />
          </button>
        </div>

        {/* Middle: Category Buttons - all in one line, scrollable on small/tab screens */}
        <div
          className="
            flex
            flex-nowrap
            overflow-x-auto
            scrollbar-none
            focus:outline-none
            border-0
            shadow-none
            w-full
            justify-start
            md:justify-center
            no-underline
            px-1
            items-center
            whitespace-nowrap
          "
          style={{
            gap: window.innerWidth < 640 ? '0' : '0.75rem',
          }}
        >
          {categoryItems.map((item) => (
            <Link
              to={getCategoryLink(item)}
              key={item}
              style={{ textDecoration: 'none' }}
              onClick={() => {
                setmenu(item);
                setsubcategory('');
              }}
            >
              <Button
                variant="text"
                className="!capitalize !text-gray-700 !font-bold hover:!text-pink-600 !text-sm md:!text-base"
                size="medium"
                style={{
                  whiteSpace: 'nowrap',
                  fontSize: '0.98rem',
                  flex: '0 0 auto',
                }}
              >
                <span className="font-bold">{item}</span>
              </Button>
            </Link>
          ))}
        </div>

        {/* Right: Free International Delivery (hidden on small/tab screens) */}
        <div className="hidden xl:flex items-center gap-2 whitespace-nowrap">
          <FaPlane className="text-pink-600 text-lg" />
          <span className="text-gray-700 font-medium text-sm md:text-base">Free International Delivery</span>
        </div>
      </div>
    </div>
  );
}

export default Header3;