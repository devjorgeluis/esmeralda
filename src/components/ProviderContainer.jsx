import { useContext, useCallback, useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { AppContext } from "../AppContext";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const ProviderContainer = ({
    categories,
    selectedProvider,
    onProviderSelect,
    onOpenProviders
}) => {
    const { contextData } = useContext(AppContext);
    const swiperRef = useRef(null);
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const [isPrevDisabled, setIsPrevDisabled] = useState(true);
    const [isNextDisabled, setIsNextDisabled] = useState(false);

    const location = useLocation();
    const providers = categories.filter(cat => cat.code !== "home" && cat.code);

    const handleClick = (e, provider) => {
        e.preventDefault();
        onProviderSelect(provider);
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

        swiper.on('slideChange', updateNavigationState);
        swiper.on('reachBeginning', () => setIsPrevDisabled(true));
        swiper.on('reachEnd', () => setIsNextDisabled(true));
        swiper.on('fromEdge', () => {
            setIsPrevDisabled(false);
            setIsNextDisabled(false);
        });

        return () => {
            swiper.off('slideChange', updateNavigationState);
            swiper.off('reachBeginning', () => setIsPrevDisabled(true));
            swiper.off('reachEnd', () => setIsNextDisabled(true));
            swiper.off('fromEdge', () => {
                setIsPrevDisabled(false);
                setIsNextDisabled(false);
            });
        };
    }, [updateNavigationState]);

    useEffect(() => {
        setTimeout(updateNavigationState, 100);
    }, [providers, updateNavigationState]);


    const isSelected = (provider) => {
        const hashCode = location.hash.substring(1);
        return (selectedProvider && selectedProvider.id === provider.id) ||
            (hashCode === provider.code);
    };

    return (
        <div className="providers-container desktop-item">
            <div className="providers">
                <div className="filter-all provider-item" role="button" tabIndex={0} onClick={(e) => { e.preventDefault(); if (onOpenProviders) onOpenProviders(); }} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (onOpenProviders) onOpenProviders(); } }}>
                    <span className="name">Ver todos</span>
                </div>
                {
                    providers.length > 15 &&
                    <div
                        className={`button-prev ${isPrevDisabled ? 'swiper-button-disabled' : ''}`}
                        onClick={handlePrev}
                    >
                        <i className="fa-solid fa-circle-arrow-left"></i>
                    </div>
                }

                {
                    providers.length > 15 ?
                        <Swiper
                            ref={swiperRef}
                            modules={[Navigation]}
                            spaceBetween={15}
                            slidesPerView={15}
                            navigation={{
                                prevEl: prevRef.current,
                                nextEl: nextRef.current,
                            }}
                            breakpoints={{
                                320: { slidesPerView: 2.8 },
                                768: { slidesPerView: 5.8 },
                                1280: { slidesPerView: 15 },
                            }}
                        >
                            {
                                providers.map((provider, idx) => {
                                    const imageUrl = provider.image_local
                                        ? `${contextData.cdnUrl}${provider.image_local}`
                                        : provider.image_url;

                                    return (
                                        <SwiperSlide key={idx} className="swiper-slide">
                                            <div key={idx} className={`provider-item ${isSelected(provider) ? 'Active' : ''}`} onClick={(e) => handleClick(e, provider)}>
                                                <div className="provider-img">
                                                    {
                                                        imageUrl ? <img src={imageUrl} /> : <>{provider?.name}</>
                                                    }
                                                </div>
                                                <span className="provider-name">{provider?.name}</span>
                                            </div>
                                        </SwiperSlide>
                                    )
                                })
                            }
                        </Swiper> : <>
                            {
                                providers.map((provider, idx) => {
                                    const imageUrl = provider.image_local
                                        ? `${contextData.cdnUrl}${provider.image_local}`
                                        : provider.image_url;

                                    return (
                                        <div key={idx} className="swiper-slide">
                                            <div className={`provider-item ${isSelected(provider) ? 'Active' : ''}`} onClick={(e) => handleClick(e, provider)}>
                                                <div className="provider-img">
                                                    {
                                                        imageUrl && <img src={imageUrl} />
                                                    }
                                                </div>
                                                <span className="provider-name">{provider?.name}</span>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </>
                }

                {
                    providers.length > 15 &&
                    <div
                        className={`button-next ${isNextDisabled ? 'swiper-button-disabled' : ''}`}
                        onClick={handleNext}
                    >
                        <i className="fa-solid fa-circle-arrow-right"></i>
                    </div>
                }
            </div>
        </div>
    );
};

export default ProviderContainer;