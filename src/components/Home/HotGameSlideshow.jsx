import { useContext, useCallback, useRef, useEffect, useState } from "react";
import { AppContext } from "../../AppContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const HotGameSlideshow = ({ games, name, title, onGameClick }) => {
    const { contextData } = useContext(AppContext);
    const swiperRef = useRef(null);
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const [isPrevDisabled, setIsPrevDisabled] = useState(true);
    const [isNextDisabled, setIsNextDisabled] = useState(false);

    const handleGameClick = (game, isDemo = false) => {
        if (onGameClick) {
            onGameClick(game, isDemo);
        }
    };

    const handleNext = useCallback(() => {
        if (!swiperRef.current?.swiper || isNextDisabled) return;
        swiperRef.current.swiper.slideNext();
    }, [isNextDisabled]);

    const handlePrev = useCallback(() => {
        if (!swiperRef.current?.swiper || isPrevDisabled) return;
        swiperRef.current.swiper.slidePrev();
    }, [isPrevDisabled]);

    const updateNavigationState = useCallback(() => {
        if (!swiperRef.current?.swiper) return;

        const swiper = swiperRef.current.swiper;
        setIsPrevDisabled(swiper.isBeginning);
        setIsNextDisabled(swiper.isEnd);
    }, []);

    useEffect(() => {
        if (!swiperRef.current?.swiper) return;

        const swiper = swiperRef.current.swiper;

        updateNavigationState();

        swiper.on("slideChange", updateNavigationState);
        swiper.on("reachBeginning", () => setIsPrevDisabled(true));
        swiper.on("reachEnd", () => setIsNextDisabled(true));
        swiper.on("fromEdge", () => {
            setIsPrevDisabled(false);
            setIsNextDisabled(false);
        });

        return () => {
            swiper.off("slideChange", updateNavigationState);
            swiper.off("reachBeginning", () => setIsPrevDisabled(true));
            swiper.off("reachEnd", () => setIsNextDisabled(true));
            swiper.off("fromEdge", () => {
                setIsPrevDisabled(false);
                setIsNextDisabled(false);
            });
        };
    }, [updateNavigationState]);

    useEffect(() => {
        setTimeout(updateNavigationState, 100);
    }, [games, updateNavigationState]);

    return (
        <section className="livecasino-lobby col-12 order-4">
            <div className="section team-section wow fadeIn" data-wow-delay="0.3s">
                <h3 className="text-left mt-5 mb-4 h1 category-title">{title}</h3>
            </div>
            <div className="swiper-container swiper-livecasino swiper-initialized swiper-horizontal swiper-backface-hidden">
                <div
                    className={`swiper-button-prev ${isPrevDisabled ? "disabled" : ""}`}
                    onClick={handlePrev}
                    role="button"
                    tabIndex={0}
                    aria-disabled={isPrevDisabled}
                >
                    <svg className="swiper-navigation-icon" width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor"></path></svg>
                </div>
                <div
                    className={`swiper-button-next ${isNextDisabled ? "disabled" : ""}`}
                    onClick={handleNext}
                    role="button"
                    tabIndex={0}
                    aria-disabled={isNextDisabled}
                >
                    <svg className="swiper-navigation-icon" width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor"></path></svg>
                </div>

                <Swiper
                    ref={swiperRef}
                    modules={[Navigation]}
                    spaceBetween={20}
                    slidesPerView={5}
                    breakpoints={{
                        320: { slidesPerView: 3.3 },
                        768: { slidesPerView: 4 },
                    }}
                    navigation={{
                        prevEl: prevRef.current,
                        nextEl: nextRef.current,
                    }}
                    className="swiper-wrapper"
                    onInit={updateNavigationState}
                >
                    {games.slice(0, 20)?.map((game, index) => (
                        <SwiperSlide
                            key={`hot-${title}-${name}-${game.id ?? index}-${index}`}
                            className="swiper-slide hot-slide"
                        >
                            <img 
                                src={game.image_local !== null ? contextData.cdnUrl + game.image_local : game.image_url} 
                                className="img-fluid img-fluid z-depth-4 rounded cursor-pointer link-item"
                                onClick={() => handleGameClick(game)}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default HotGameSlideshow;
