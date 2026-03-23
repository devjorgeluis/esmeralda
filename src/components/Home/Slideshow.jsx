import { useRef } from 'react';
import { useOutletContext } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import ImgBanner1 from "/src/assets/img/banner1.jpg";
import ImgBanner2 from "/src/assets/img/banner2.png";
import ImgBanner3 from "/src/assets/img/banner3.jpg";
import ImgBanner4 from "/src/assets/img/banner4.jpg";
import ImgBanner5 from "/src/assets/img/banner5.jpg";
import ImgBanner6 from "/src/assets/img/banner6.png";
import ImgBanner7 from "/src/assets/img/banner7.jpg";
import ImgBanner8 from "/src/assets/img/banner8.png";
import ImgBanner9 from "/src/assets/img/banner9.png";
import ImgBanner10 from "/src/assets/img/banner10.jpg";
import ImgBanner11 from "/src/assets/img/banner11.png";
import ImgMobileBanner1 from "/src/assets/img/mobile-banner1.jpg";
import ImgMobileBanner2 from "/src/assets/img/mobile-banner2.png";
import ImgMobileBanner3 from "/src/assets/img/mobile-banner3.jpg";
import ImgMobileBanner4 from "/src/assets/img/mobile-banner4.jpg";
import ImgMobileBanner5 from "/src/assets/img/mobile-banner5.jpg";
import ImgMobileBanner6 from "/src/assets/img/mobile-banner6.png";
import ImgMobileBanner7 from "/src/assets/img/mobile-banner7.png";
import ImgMobileBanner8 from "/src/assets/img/mobile-banner8.png";
import ImgMobileBanner9 from "/src/assets/img/mobile-banner9.jpg";
import ImgMobileBanner10 from "/src/assets/img/mobile-banner10.png";
import ImgMobileBanner11 from "/src/assets/img/mobile-banner11.jpg";

const Slideshow = () => {
  const swiperRef = useRef(null);
  const { isMobile } = useOutletContext();

  const slides = isMobile ? [
    { id: 0, image: ImgMobileBanner1 },
    { id: 1, image: ImgMobileBanner2 },
    { id: 2, image: ImgMobileBanner3 },
    { id: 3, image: ImgMobileBanner4 },
    { id: 4, image: ImgMobileBanner5 },
    { id: 5, image: ImgMobileBanner6 },
    { id: 6, image: ImgMobileBanner7 },
    { id: 7, image: ImgMobileBanner8 },
    { id: 8, image: ImgMobileBanner9 },
    { id: 9, image: ImgMobileBanner10 },
    { id: 10, image: ImgMobileBanner11 }
  ] : [
    { id: 0, image: ImgBanner1 },
    { id: 1, image: ImgBanner2 },
    { id: 2, image: ImgBanner3 },
    { id: 3, image: ImgBanner4 },
    { id: 4, image: ImgBanner5 },
    { id: 5, image: ImgBanner6 },
    { id: 6, image: ImgBanner7 },
    { id: 7, image: ImgBanner8 },
    { id: 8, image: ImgBanner9 },
    { id: 9, image: ImgBanner10 },
    { id: 10, image: ImgBanner11 }
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