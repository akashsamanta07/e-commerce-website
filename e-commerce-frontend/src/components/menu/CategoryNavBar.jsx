// CategoryNavBar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import getImageUrl from '../getImageUrl';

const CategoryNavBar = ({ categories }) => {
  // categories is expected to be an array of objects from the DB, each with at least { name, image }
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
        {categories && categories.length > 0 ? (
          categories.map((category, idx) => {
            const catName = typeof category === 'string' ? category : category.name;
            const iconSrc = category && category.image ? getImageUrl(category.image) : '';
            return (
              <Link
                to={`/menu/${catName ? catName.toLowerCase() : ''}`}
                key={catName || idx}
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
                    src={iconSrc}
                    alt={catName}
                    className="h-8 w-8 md:h-12 md:w-12 object-contain mx-auto"
                    loading="lazy"
                  />
                </div>
                <div className="text-xs md:text-base font-semibold text-gray-700 group-hover:text-pink-600 transition">
                  {catName}
                </div>
              </Link>
            );
          })
        ) : (
          <div className="text-gray-400 text-sm">No categories found.</div>
        )}
      </div>
    </div>
  );
};

export default CategoryNavBar;
