import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../../AppContext";

import ImgHome from "/src/assets/svg/home.svg";
import ImgCasino from "/src/assets/svg/casino.svg";
import ImgLiveCasino from "/src/assets/svg/live-casino.svg";
import ImgSports from "/src/assets/svg/sports.svg";
import ImgLiveSports from "/src/assets/svg/live-sports.svg";

const Header = ({
    isLogin,
    isSlotsOnly,
    userBalance,
    handleLoginClick,
    handleLogoutClick,
    handleMyProfileClick,
    openSupportModal,
    refreshBalance
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const pathname = location?.pathname ?? "";
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { contextData } = useContext(AppContext);

    const navItems = isSlotsOnly === "false" ? [
        { path: ["/", "/home"], label: "Inicio", image: ImgHome },
        { path: ["/casino"], label: "Casino", image: ImgCasino },
        { path: ["/live-casino"], label: "Casino En Vivo", image: ImgLiveCasino },
        { path: ["/sports"], label: "Deportes", image: ImgSports },
        { path: ["/live-sports"], label: "Deportes En Vivo", image: ImgLiveSports }
    ] : [
        { path: ["/", "/home"], label: "Inicio", image: ImgHome },
        { path: ["/casino"], label: "Casino", image: ImgCasino }
    ];

    const isActive = (paths) => {
        if (Array.isArray(paths)) {
            return paths.some(p => p === "/" ? pathname === "/" : pathname.startsWith(p));
        }
        return pathname.startsWith(paths);
    };

    useEffect(() => {
        function handleDocClick(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        }

        function handleKey(e) {
            if (e.key === "Escape") setDropdownOpen(false);
        }

        document.addEventListener("click", handleDocClick);
        document.addEventListener("keydown", handleKey);
        return () => {
            document.removeEventListener("click", handleDocClick);
            document.removeEventListener("keydown", handleKey);
        };
    }, []);


    const formatBalance = (value) => {
        const num = parseFloat(value);
        return num.toLocaleString('de-DE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const handleRefreshBalance = () => {
        if (isRefreshing) return;
        setIsRefreshing(true);
        refreshBalance(() => {
            setIsRefreshing(false);
        });
    };

    const MobileSidebar = () => (
        <>
            <div id="slide-out" className="side-nav fixed d-lg-none" style={{ transform: "translateX(0px)" }}>
                <ul className="custom-scrollbar ps ps--theme_default" data-ps-id="7dd99edb-02e5-67f4-e139-01cacf9476ba">
                    <li>
                        <ul id="sidemenu_global_ul" className="collapsible collapsible-accordion">
                            <li className="side-menu-li-index">
                                <a href="index.php" className="collapsible-header waves-effect side-menu-nav-link nav-link-index active">
                                    <img src="https://cdn.esmeralda.world/images/side_menu/index.png" /><span>Inicio</span>
                                </a>
                            </li>
                            <li className="side-menu-li-sports">
                                <a href="sports.php" className="collapsible-header waves-effect side-menu-nav-link nav-link-sports">
                                    <img src="https://cdn.esmeralda.world/images/side_menu/sports.png" /><span>Deportes</span>
                                </a>
                            </li>
                            <li className="side-menu-li-casino">
                                <a href="casino.php" className="collapsible-header waves-effect side-menu-nav-link nav-link-casino">
                                    <img src="https://cdn.esmeralda.world/images/side_menu/casino.png" /><span>Slots</span>
                                </a>
                            </li>
                            <li className="side-menu-li-livecasino">
                                <a href="livecasino.php" className="collapsible-header waves-effect side-menu-nav-link nav-link-livecasino">
                                    <img src="https://cdn.esmeralda.world/images/side_menu/livecasino.png" /><span>Casino Vivo</span>
                                </a>
                            </li>
                            <li className="side-menu-li-horses">
                                <a href="horses.php" className="collapsible-header waves-effect side-menu-nav-link nav-link-horses">
                                    <img src="https://cdn.esmeralda.world/images/side_menu/horses.png" /><span>Caballos</span>
                                </a>
                            </li>
                            <li className="side-menu-li-crazzy_win">
                                <a href="crazzy_win.php" className="collapsible-header waves-effect side-menu-nav-link nav-link-crazzy_win">
                                    <img src="https://cdn.esmeralda.world/images/side_menu/crazzy_win.png" /><span>CrazZy Win!</span>
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
                <img src="https://cdn.esmeralda.world/mkt/images/es/sidenav_promo.png" id="sidenav-promo-banner" className="cursor-pointer" />
                    <div className="sidenav-bg mask-strong"></div>
            </div>
            <div id="sidenav-overlay" onClick={() => setSidebarOpen(false)}></div>
        </>
    )

    return (
        <>
            <nav id="MainNavBar" className="navbar fixed-top navbar-expand-lg scrolling-navbar double-nav py-0 pr-2 px-lg-0 px-xl-3">
                <div className="float-left d-lg-none" onClick={() => setSidebarOpen(true)}>
                    <a className="button-collapse"><i className="fas fa-bars"></i></a>
                </div>
                <div className="float-left d-none d-lg-block">
                    <ul className="nav navbar-nav nav-flex-icons navbar-items-top ml-auto">
                        {navItems.map((item, idx) => (
                            <li key={idx} className="nav-item">
                                <a
                                    className={"nav-link waves-effect side-menu-nav-link nav-link-index" + (isActive(item.path) ? " active" : "")}
                                    onClick={() => navigate(Array.isArray(item.path) ? item.path[item.path.length - 1] : item.path)}
                                >
                                    <span>{item.label}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="breadcrumb-dn mr-auto"></div>
                <ul className="nav navbar-nav nav-flex-icons ml-auto pt-lg-1">
                    {
                        isLogin &&
                        <li className="nav-item">
                            <a className={`nav-link waves-effect ${isRefreshing ? "spin" : ""}`} id="OwnBalanceTop" onClick={handleRefreshBalance}>
                                <i className="fas fa-sync-alt pr-0"></i>
                                <span className="clearfix own-balance">${formatBalance(userBalance || 0)}</span>
                            </a>
                        </li>
                    }
                    <li id="support-nav" className="nav-item dropdown notifications-nav support-nav user-custom-dropdown">
                        <a className="nav-link waves-effect" id="navbarSupportMenuLink" onClick={() => { openSupportModal(false); }}>
                            <i className="far fa-comment-dots"></i>
                        </a>
                    </li>
                    <li className="nav-item dropdown user-custom-dropdown">
                        {
                            isLogin ? <a className="nav-link waves-effect" onClick={() => setDropdownOpen(!dropdownOpen)}>
                                <i className="far fa-user"></i>
                                <span className="clearfix d-none d-xl-inline-block own-username">{contextData?.session?.user?.username}</span>
                            </a> : <a className="nav-link waves-effect" onClick={handleLoginClick}>
                                <i className="far fa-user"></i>
                                <span className="clearfix d-none d-xl-inline-block own-username">Acceder</span>
                            </a>
                        }
                        {
                            isLogin && <>
                                <div className="dropdown-menu dropdown-menu-right user-profile-dropdown" style={{ display: dropdownOpen && "block" }}>
                                    <a className="dropdown-item waves-effect waves-light" onClick={handleMyProfileClick}>Mis datos</a>
                                    <a className="dropdown-item waves-effect waves-light">Historial del Juego</a>
                                    <a className="dropdown-item waves-effect waves-light">Transacciones</a>
                                    <a className="dropdown-item waves-effect waves-light" onClick={handleLogoutClick}>Cerrar sesion</a>
                                </div>
                            </>
                        }
                    </li>
                </ul>
            </nav>
            {sidebarOpen && <MobileSidebar />}
        </>
    );
};

export default Header;