import React, { useRef, useEffect, useState } from 'react';
import { HiMenuAlt2 } from 'react-icons/hi';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { FaPlane } from 'react-icons/fa';
import { Button } from '@mui/material';
import { SlideDrawer } from '../Slideber.jsx';
import { DrawerContentMenu } from '../Slideber.jsx';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { IconButton } from '@mui/material';
import { useNavigate } from "react-router-dom";


function Header3({ header3 }) {
  let { setmenu, setsubcategory, search, setSearch, is, categories } = header3;
  const [openMenu, setOpenMenu] = useState(false);
  let menuobj = {
    setmenu,
    setsubcategory,
    categories
  };
  const navigate=useNavigate();
  // Helper to get the link path for each category
  const getCategoryLink = (item) => {
    if (
      typeof item === 'string' &&
      (item.toLowerCase() === 'home' || item === 'Home')
    )
      return '/';
    // If item is an object with a name property, use that
    if (typeof item === 'object' && item && item.name) {
      return `/menu/${encodeURIComponent(item.name)}`;
    }
    // Otherwise, treat as string
    return `/menu/${encodeURIComponent(item)}`;
  };

  // Helper to get the display name for each category
  const getCategoryName = (item) => {
    if (typeof item === 'string') return item;
    if (typeof item === 'object' && item && item.name) return item.name;
    return String(item);
  };

  // Compose the list of categories to display
  // Always include "Home" as the first item, then all categories from the categories prop
  const categoryItems = [
    'Home',
    ...(Array.isArray(categories)
      ? categories.map((cat) =>
          typeof cat === 'string'
            ? cat
            : cat && cat.name
            ? cat.name
            : ''
        ).filter(Boolean)
      : [])
  ];

  const inputRef = useRef(null);

  useEffect(() => {
    if (is !== 0 && inputRef.current) {
      // Small timeout helps on mobile to ensure keyboard opens
      setTimeout(() => {
        inputRef.current.focus();
      }, 50);
    }
  }, [is]);

  const onsubmit = (event) => {
    event.preventDefault();
    setSearch(event.target.value);
    setmenu('Home');
    setsubcategory('');
    // You can add search logic here
  };

  return (
    <div className="shadow-b shadow-md bg-white border-b-[1px]">
      <SlideDrawer open={openMenu} side="left" onClose={() => setOpenMenu(false)}>
        <DrawerContentMenu menuobj={menuobj} setOpenMenu={setOpenMenu} />
      </SlideDrawer>
      <div className=" flex items-center justify-between py-2 px-1 Container">
        {/* Left: Shop by Categories (hidden on small/tab screens) */}
        <div className="hidden xl:flex items-center gap-2">
          <button
            className="flex items-center gap-1 px-3 py-1 rounded-md  hover:bg-gray-100 transition text-gray-700 font-medium text-sm md:text-base"
            onClick={() => setOpenMenu(true)}
          >
            <HiMenuAlt2 className="text-lg" />
            <span className="ml-1 whitespace-nowrap">Shop by Categories</span>
            <MdKeyboardArrowDown className="ml-1 text-xl" />
          </button>
        </div>

        {/* Middle: Category Buttons - all in one line, scrollable on small/tab screens */}
        <div
          className={`${
            is === 1 ? 'hidden' : 'block'
          } flex
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
            whitespace-nowrap`}
          style={{
            gap: window.innerWidth < 640 ? '0' : '0.75rem',
          }}
        >
          {categoryItems.map((item) => (
            <Link
              to={getCategoryLink(item)}
              key={getCategoryName(item)}
              style={{ textDecoration: 'none' }}
              onClick={() => {
                setmenu(getCategoryName(item));
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
                <span className="font-bold">{getCategoryName(item)}</span>
              </Button>
            </Link>
          ))}
        </div>
        <div className={`${is === 0 ? 'hidden' : 'block'} w-full max-w-md`}>
          <form
            className="flex items-center bg-gray-100 rounded-md px-2 py-1"
            onSubmit={onsubmit}
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for products..."
              aria-label="search"
              className="flex-1 px-2 bg-transparent outline-none"
              value={search}
              onChange={onsubmit}
              onClick={()=>{navigate("/menu/Search")}}
            />
            <IconButton type="submit" aria-label="search" className="p-2">
              <FaSearch className="text-gray-500 text-[16px]" />
            </IconButton>
          </form>
        </div>

        {/* Right: Free International Delivery (hidden on small/tab screens) */}
        <div className="hidden xl:flex items-center gap-2 whitespace-nowrap">
          <FaPlane className="text-pink-600 text-lg" />
          <span className="text-gray-700 font-medium text-sm md:text-base">
            Free International Delivery
          </span>
        </div>
      </div>
    </div>
  );
}

export default Header3;