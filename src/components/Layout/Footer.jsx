import { useNavigate } from "react-router-dom";
import ImgLogo from "/src/assets/svg/logo.svg";

const Footer = ({ isSlotsOnly }) => {
    const navigate = useNavigate();
    const isSlotsOnlyMode = isSlotsOnly === "true" || isSlotsOnly === true;

    const menuItems = !isSlotsOnlyMode ? [
        {
            id: 'home',
            name: 'Home',
            href: '/'
        },
        {
            id: 'casino',
            name: 'Casino',
            href: '/casino'
        },
        {
            id: 'live-casino',
            name: 'Casino En Vivo',
            href: '/live-casino',
        },
        {
            id: 'sports',
            name: 'Deportes',
            href: '/sports'
        },
        {
            id: 'live-sports',
            name: 'Deportes En Vivo',
            href: '/live-sports'
        }
    ] : [
        {
            id: 'casino',
            name: 'Casino',
            href: '/casino'
        }
    ];

    return (
        <footer className="footer-cs">
            <div className="footer-mobile-menu mobile-item">
                <div className="logo">
                    <img src={ImgLogo} alt="Logo" />
                </div>
                <p className="text-center mt-3 mb-3">
                    2026 All right reserved. Site operated under License from Curaçao <span className="fi fi-ar ml-3"></span>
                </p>
            </div>
            <div className="footer-top-container">
                <div className="footer-top">
                    <div className="principal desktop-item">
                        <div className="footer-top-item">
                            <div className="logo">
                                <img src={ImgLogo} alt="Logo" />
                            </div>
                            <p className="text-justify mt-3 mb-3 text-copyright">
                                2026 All right reserved. Site operated under License from Curaçao <span className="fi fi-ar ml-3"></span>
                            </p>
                        </div>
                    </div>
                    <div className="nav-items flex-wrap align-items-start">
                        <div className="d-flex w-100">
                            <div className="footer-top-item">
                                <h2 className="title">
                                    <span>Páginas</span>
                                </h2>
                                <div className="options-items">
                                    {menuItems.map((menu, index) => (
                                        <div className="option" key={index}>
                                            <a
                                                onClick={() => navigate(menu.href)}
                                            >
                                                {menu.name}
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;