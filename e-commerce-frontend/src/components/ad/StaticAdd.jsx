import React, { useRef, useEffect, useState } from 'react';
import API_BASE from '../../utils/API_BASE';
import getImageUrl from '../getImageUrl.js';

// Fallback static ads in case API fails or is empty
import s1 from '../../assets/default/add/s1.jpg';
import s2 from '../../assets/default/add/s2.jpg';
import s3 from '../../assets/default/add/s3.jpg';
import s4 from '../../assets/default/add/s4.jpg';

const fallbackAds = [
  { src: s1, alt: 'Ad 1' },
  { src: s2, alt: 'Ad 2' },
  { src: s3, alt: 'Ad 3' },
  { src: s4, alt: 'Ad 4' },
];

function StaticAdd() {
  const scrollRef = useRef(null);
  const [ads, setAds] = useState(fallbackAds);
  const [loading, setLoading] = useState(true);

  // Fetch ads from API
  useEffect(() => {
    async function fetchAds() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/admin/get-banners`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setAds(
            data.data.map((banner, idx) => ({
              src: getImageUrl(banner.image),
              alt: banner.title || `Ad ${idx + 1}`,
            }))
          );
        } else {
          setAds(fallbackAds);
        }
      } catch (err) {
        setAds(fallbackAds);
      }
      setLoading(false);
    }
    fetchAds();
  }, []);

  // Enable drag-to-scroll for mouse users
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    const mouseDownHandler = (e) => {
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
      const walk = (x - startX) * 1.2;
      el.scrollLeft = scrollLeft - walk;
    };

    el.addEventListener('mousedown', mouseDownHandler);
    el.addEventListener('mouseleave', mouseLeaveHandler);
    el.addEventListener('mouseup', mouseUpHandler);
    el.addEventListener('mousemove', mouseMoveHandler);

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
        }}
      >
        {loading ? (
          <div className="w-full flex items-center justify-center h-40 text-gray-400 text-lg">
            Loading...
          </div>
        ) : (
          ads.map((ad, idx) => (
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
          ))
        )}
      </div>
    </div>
  );
}

export default StaticAdd;