// CategoryNavBar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import fashion from '../../assets/menu/fashion.png';
import electronics from '../../assets/menu/electronics.png';
import bags from '../../assets/menu/bags.png';
import footwear from '../../assets/menu/footwear.png';
import groceries from '../../assets/menu/groceries.png';
import beauty from '../../assets/menu/beauty.png';
import wellness from '../../assets/menu/wellness.png';
import jewellery from '../../assets/menu/jewellery.png';

const categories = [
  { name: 'Fashion', icon: fashion },
  { name: 'Electronics', icon: electronics },
  { name: 'Bags', icon: bags },
  { name: 'Footwear', icon: footwear },
  { name: 'Groceries', icon: groceries },
  { name: 'Beauty', icon: beauty },
  { name: 'Wellness', icon: wellness },
  { name: 'Jewellery', icon: jewellery },
];

const CategoryNavBar = () => {
  // To ensure horizontal scroll works, wrap the scrollable area in a div with overflow-x-auto and a fixed width on small screens.
  // Also, remove min-w-max which can break scrolling, and ensure the inner flex is wide enough.
  return (
    <div className="Container py-2">
        <div
          className="
          w-full
            flex
            gap-3
            px-2
            md:gap-6
            md:px-6
            py-2
            md:py-4
            items-center
            justify-start
            md:justify-center
            overflow-x-auto scrollbar-none
          "
        >
          {categories.map((category, idx) => (
            <Link
              to={`/${category.name.toLowerCase()}`}
              key={idx}
              className={`
                flex flex-col items-center justify-center
                bg-white
                rounded-xl
                shadow
                px-3 py-2
                min-w-[70px] md:min-w-[100px]
                text-center flex-shrink-0
                transition
                hover:shadow-lg hover:bg-pink-50
                focus:outline-none focus:ring-2 focus:ring-pink-300
                group
                no-underline
              `}
              style={{
                border: "1px solid #f3f3f3",
              }}
            >
              <div
                className="
                  mb-1
                  flex items-center justify-center
                  w-12 h-12 md:w-16 md:h-16
                  rounded-full
                  bg-gradient-to-tr from-pink-100 to-white
                  group-hover:from-pink-200 group-hover:to-pink-50
                  transition
                  shadow-sm
                "
              >
                <img
                  src={category.icon}
                  alt={category.name}
                  className="h-8 w-8 md:h-12 md:w-12 object-contain mx-auto"
                  loading="lazy"
                />
              </div>
              <div className="text-xs md:text-base font-semibold text-gray-700 group-hover:text-pink-600 transition">
                {category.name}
              </div>
            </Link>
          ))}
        </div>
    </div>
  );
};

export default CategoryNavBar;
