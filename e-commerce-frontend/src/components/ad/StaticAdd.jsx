import React, { useRef } from 'react'

import s1 from '../../assets/default/add/s1.jpg'
import s2 from '../../assets/default/add/s2.jpg'
import s3 from '../../assets/default/add/s3.jpg'
import s4 from '../../assets/default/add/s4.jpg'

const ads = [
  { src: s1, alt: 'Ad 1' },
  { src: s2, alt: 'Ad 2' },
  { src: s3, alt: 'Ad 3' },
  { src: s4, alt: 'Ad 4' },
  // Add more images here if needed
];

function StaticAdd() {
  const scrollRef = useRef(null);

  // Enable drag-to-scroll for mouse users
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    const mouseDownHandler = (e) => {
      // Only left mouse button
      if (e.button !== 0) return;
      isDown = true;
      el.classList.add('cursor-grabbing');
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };

    const mouseLeaveHandler = () => {
      isDown = false;
      el.classList.remove('cursor-grabbing');
    };

    const mouseUpHandler = () => {
      isDown = false;
      el.classList.remove('cursor-grabbing');
    };

    const mouseMoveHandler = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.2; // scroll-fast
      el.scrollLeft = scrollLeft - walk;
    };

    el.addEventListener('mousedown', mouseDownHandler);
    el.addEventListener('mouseleave', mouseLeaveHandler);
    el.addEventListener('mouseup', mouseUpHandler);
    el.addEventListener('mousemove', mouseMoveHandler);

    // Clean up
    return () => {
      el.removeEventListener('mousedown', mouseDownHandler);
      el.removeEventListener('mouseleave', mouseLeaveHandler);
      el.removeEventListener('mouseup', mouseUpHandler);
      el.removeEventListener('mousemove', mouseMoveHandler);
    };
  }, []);

  return (
    <div className='bg-white '>
      <div
        ref={scrollRef}
        className="bg-white 
          Container
          flex
          lg:justify-center
          gap-3
          overflow-x-scroll
          scrollbar-none
          py-4
          px-2
          cursor-grab
        "
        style={{
          WebkitOverflowScrolling: 'touch',
          // Optionally, you can add 'scrollbarWidth: "thin"' for Firefox
        }}
      >
        {ads.map((ad, idx) => (
          <div
            key={idx}
            className="
              flex-shrink-0
              w-full
              sm:w-[90%]
              md:w-1/2
              lg:w-1/5
              max-w-[400px]
              rounded-md
              overflow-hidden
              shadow
              bg-white
            "
            style={{
              minWidth: '250px',
              // On large screens, 4 in a row, else scrollable
            }}
          >
            <img
              src={ad.src}
              alt={ad.alt}
              className="w-full h-40 object-cover select-none"
              style={{ display: 'block', userSelect: 'none', pointerEvents: 'none' }}
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default StaticAdd;