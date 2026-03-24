import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import ImgHeaderLogo from "/src/assets/img/header_logo_pts.png";
import ImgBanner1 from "/src/assets/img/banner1.jpg";
import ImgBanner2 from "/src/assets/img/banner2.jpg";

const Slideshow = () => {
  const swiperRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 0, image: ImgBanner1 },
    { id: 1, image: ImgBanner2 }
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

  const handleSlideChange = (swiper) => {
    setCurrentSlide(swiper.realIndex);
  };

  const handleIndicatorClick = (index) => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideToLoop(index);
    }
  };

  return (
    <div id="header-lobby" className="animated-background">
      <div className="carousel">
        <Swiper
          ref={swiperRef}
          modules={[Autoplay]}
          slidesPerView={1}
          centeredSlides={true}
          spaceBetween={0}
          loop={true}
          autoplay={{
            delay: 500000,
            disableOnInteraction: false,
          }}
          onSlideChange={handleSlideChange}
          className="swiper-wrapper"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id} className="swiper-slide">
              <div className="view jarallax">
                <img
                  className="jarallax-img"
                  src={slide.image}
                  alt={`Banner ${slide.id + 1}`}
                  title={`Banner ${slide.id + 1}`}
                  loading="lazy"
                />
                <div className="mask">
                  <div className="container flex-center text-center">
                    <div className="row mt-5">
                      <div className="col-md-12 col-xl-12 mx-auto wow fadeIn cursor-pointer link-item">
                        <img className="img-fluid wow fadeInDown" data-wow-delay="0.8s" src={ImgHeaderLogo} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <a className="carousel-control-prev" onClick={handlePrev}>
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        </a>

        <a className="carousel-control-next" onClick={handleNext}>
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
        </a>

        <ol className="carousel-indicators">
          {slides.map((slide, index) => (
            <li
              key={slide.id}
              data-target="#header-lobby-carousel"
              data-slide-to={index}
              className={currentSlide === index ? "active" : ""}
              onClick={() => handleIndicatorClick(index)}
              style={{ cursor: 'pointer' }}
            ></li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default Slideshow;