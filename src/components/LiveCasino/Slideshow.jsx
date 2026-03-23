import { useRef } from 'react';
import { useOutletContext } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import ImgBanner1 from "/src/assets/img/banner1.jpg";
import ImgBanner2 from "/src/assets/img/live-banner1.jpg";
import ImgMobileBanner1 from "/src/assets/img/mobile-banner1.jpg";
import ImgMobileBanner2 from "/src/assets/img/mobile-live-banner1.jpg";

const Slideshow = () => {
  const swiperRef = useRef(null);
  const { isMobile } = useOutletContext();

  const slides = isMobile ? [
    { id: 0, image: ImgMobileBanner1 },
    { id: 1, image: ImgMobileBanner2 },
  ] : [
    { id: 0, image: ImgBanner1 },
    { id: 1, image: ImgBanner2 },
  ];

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  return (
    <div className="home-section-module">
      <div className="home-section-module-important home-section-module-1 loaded">
        <div className="swiper-container">
          <Swiper
            ref={swiperRef}
            modules={[Autoplay]}
            slidesPerView={1}
            centeredSlides={true}
            spaceBetween={0}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            className="swiper-wrapper"
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.id} className="swiper-slide">
                <img
                  className="banner-image"
                  src={slide.image}
                  alt={`Banner ${slide.id + 1}`}
                  title={`Banner ${slide.id + 1}`}
                  loading="lazy"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="swiper-navigation">
          <div className="swiper-button-prev" onClick={handlePrev}>
            <i className="fa fa-chevron-circle-left"></i>
          </div>
          <div className="swiper-button-next" onClick={handleNext}>
            <i className="fa fa-chevron-circle-right"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slideshow;