import React, { useEffect, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import getImageUrl from '../getImageUrl.js';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

import './style.css';

// import required modules
import { Navigation, Autoplay } from 'swiper/modules';
import API_BASE from '../../utils/API_BASE';

function duplicateSlides(slides, minCount = 3) {
  // Swiper loop mode needs at least 2-3 slides to work properly.
  // If not enough slides, duplicate them to reach minCount.
  if (slides.length >= minCount) return slides;
  let result = [];
  while (result.length < minCount) {
    result = result.concat(slides);
  }
  return result.slice(0, minCount);
}

function Slider() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch slider images from backend and sort ascending by updatedAt (oldest first)
    async function fetchSlides() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/admin/get-home-sliders`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          // Sort ascending by updatedAt (oldest first)
          const sortedSlides = [...data.data].sort((a, b) => {
            const dateA = new Date(a.updatedAt);
            const dateB = new Date(b.updatedAt);
            return dateA - dateB;
          });
          setSlides(sortedSlides);
        } else {
          setSlides([]);
        }
      } catch (err) {
        setSlides([]);
      }
      setLoading(false);
    }
    fetchSlides();
  }, []);

  // Swiper loop mode needs at least 2-3 slides to work properly.
  // We'll duplicate slides if not enough, but only if not loading and there is at least 1 slide.
  const slidesForSwiper = !loading && slides.length > 0 ? duplicateSlides(slides, 3) : slides;

  // Only enable loop if there are at least 2 slides (after duplication)
  const enableLoop = slidesForSwiper.length > 1;

  return (
    <>
      <Swiper
        navigation={true}
        modules={[Navigation, Autoplay]}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={enableLoop}
        className="mySwiper"
      >
        {loading ? (
          // Optionally show a loading placeholder
          <SwiperSlide>
            <div style={{ minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Loading...
            </div>
          </SwiperSlide>
        ) : slidesForSwiper.length > 0 ? (
          slidesForSwiper.map((slide, idx) => (
            <SwiperSlide key={slide._id ? slide._id + '-' + idx : idx}>
              <img src={getImageUrl(slide.image)} alt="" style={{ width: '100%', objectFit: 'cover' }} />
            </SwiperSlide>
          ))
        ) : (
          <SwiperSlide>
            <div style={{ minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              No slides found.
            </div>
          </SwiperSlide>
        )}
      </Swiper>
    </>
  );
}

export default Slider;