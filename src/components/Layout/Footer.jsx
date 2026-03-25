import { useNavigate } from "react-router-dom";
import Img18 from "/src/assets/svg/18.svg";
import ImgLogo from "/src/assets/img/gt-logo.png";

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
        <footer className="page-footer font-small unique-color-dark">
            <div className="container text-center text-md-left pt-4">
                <div className="row mt-3">
                    <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                        <p>© Esmeralda </p>
                    </div>
                    <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                        <h6 className="text-uppercase font-weight-bold">Productos</h6>
                        <hr className="deep-purple accent-2 mb-4 mt-0 d-inline-block mx-auto" style={{ width: 60 }} />
                        {menuItems.map((menu, index) => (
                            <p key={index}>
                                <a
                                    className="side-menu-nav-link"
                                    onClick={() => navigate(menu.href)}
                                >
                                    {menu.name}
                                </a>
                            </p>
                        ))}
                    </div>
                </div>
            </div>
            <div className="footer-copyright text-center py-3">
                <img src={Img18} width="30px" />
                <img src={ImgLogo} width="50" alt="" />
                Juega responsablemente. Para mayor información visita:
                <a href="https://www.gamblingtherapy.org/es" target="_new"> GamblingTherapy.org</a>
            </div>
        </footer>
    );
};

export default Footer;