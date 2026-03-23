import { useContext, useCallback, useRef, useState } from "react";
import { AppContext } from "../../AppContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const CasinoGameSlideshow = ({ games, name, title, onGameClick }) => {
    const { contextData } = useContext(AppContext);
    const swiperRef = useRef(null);
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleGameClick = (game, isDemo = false) => {
        if (onGameClick) {
            onGameClick(game, isDemo);
        }
    };

    const handleSlideChange = useCallback((swiper) => {
        setCurrentSlide(swiper.realIndex);
    }, []);

    const handleIndicatorClick = (index) => {
        if (swiperRef.current?.swiper) {
            swiperRef.current.swiper.slideToLoop(index);
        }
    };

    return (
        <section className="casino-lobby col-12 order-3">
            <div className="heading">
                <h2>{title}</h2>
            </div>
            <section className="blog">
                <div className="swiper-container blog-slider swiper-initialized swiper-horizontal">
                    <Swiper
                        ref={swiperRef}
                        modules={[Navigation]}
                        spaceBetween={10}
                        slidesPerView={4}
                        onSlideChange={handleSlideChange}
                        onInit={(swiper) => handleSlideChange(swiper)}
                        breakpoints={{
                            320: { slidesPerView: 1.1, spaceBetween: 10 },
                            768: { slidesPerView: 2.1, spaceBetween: 10 },
                            1200: { slidesPerView: 4.1, spaceBetween: 20 },
                        }}
                        navigation={{
                            prevEl: prevRef.current,
                            nextEl: nextRef.current,
                        }}
                        className="swiper-wrapper"
                    >
                        {games?.map((game, index) => (
                            <SwiperSlide
                                key={`hot-${title}-${name}-${game.id ?? index}-${index}`}
                                className="swiper-slide blog-item"
                            >
                                <div className="image">
                                    <a>
                                        <img 
                                            src={game.image_local !== null ? contextData.cdnUrl + game.image_local : game.image_url} 
                                            onClick={() => handleGameClick(game)}
                                        />
                                    </a>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <div className="swiper-pagination swiper-pagination2 swiper-pagination-clickable swiper-pagination-bullets swiper-pagination-horizontal">
                        {games.map((slide, index) => (
                            <span
                                key={slide.id ?? index}
                                data-slide-to={index}
                                className={`swiper-pagination-bullet ${currentSlide === index ? "swiper-pagination-bullet-active" : ""}`}
                                onClick={() => handleIndicatorClick(index)}
                                style={{ cursor: 'pointer' }}
                            ></span>
                        ))}
                    </div>
                </div>
            </section>
        </section>
    );
};

export default CasinoGameSlideshow;
