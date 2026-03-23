import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

import ImgCasino from "/src/assets/img/casino-item.jpg";
import ImgLiveCasino from "/src/assets/img/live-casino-item.jpg";
import ImgSport from "/src/assets/img/sports-item.jpg";
import ImgMobileCasino from "/src/assets/img/mobile-casino-item.jpg";
import ImgMobileLiveCasino from "/src/assets/img/mobile-live-casino-item.jpg";
import ImgMobileSport from "/src/assets/img/mobile-sports-item.jpg";

const BannerContainer = ({ isSlotsOnly }) => {
    const navigate = useNavigate();
    const { isMobile } = useOutletContext();
    const isSlotsOnlyMode = isSlotsOnly === "true" || isSlotsOnly === true;

    const menuItems = !isSlotsOnlyMode ? [
        {
            id: 'casino',
            name: 'Casino',
            image: isMobile ? ImgMobileCasino : ImgCasino,
            href: '/casino'
        },
        {
            id: 'live-casino',
            name: 'Casino En Vivo',
            image: isMobile ? ImgMobileLiveCasino : ImgLiveCasino,
            href: '/live-casino',
        },
        {
            id: 'sports',
            name: 'Deportes',
            image: isMobile ? ImgMobileSport : ImgSport,
            href: '/sports'
        }
    ] : [
        {
            id: 'casino',
            name: 'Casino',
            image: isMobile ? ImgMobileCasino : ImgCasino,
            href: '/casino'
        }
    ];

    return (
        <>
            <div className="home-section-module-important home-section-module-3 loaded">
                <div className="home-section-module-container">
                    <div className="dw-home-middle">
                        {menuItems.map((menu, index) => (
                            <div className="dw-item-figure" key={index}>
                                <figure>
                                    <img src={menu.image} alt={menu.name} />
                                    <div className="over-hover">
                                        <section>
                                            <div className="over-hover-bottom">
                                                <button className="btn btn-theme" onClick={() => navigate(menu.href)}>
                                                    <span>{menu.name}</span>
                                                </button>
                                            </div>
                                        </section>
                                    </div>
                                    <a onClick={() => navigate(menu.href)}></a>
                                </figure>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default BannerContainer