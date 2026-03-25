import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../../AppContext";

import ImgPromo from "/src/assets/img/promo.png";
import ImgHome from "/src/assets/img/home.png";
import ImgCasino from "/src/assets/img/casino.png";
import ImgLiveCasino from "/src/assets/img/live-casino.png";
import ImgSports from "/src/assets/img/sports.png";
import ImgLiveSports from "/src/assets/img/sports.png";

const Header = ({
    isLogin,
    isSlotsOnly,
    userBalance,
    supportParent,
    handleLoginClick,
    handleLogoutClick,
    handleMyProfileClick,
    handleMyProfileHistoryClick,
    handleMyProfileTransactionClick,
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
    const toggleRef = useRef(null);
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
            if (dropdownRef.current && !dropdownRef.current.contains(e.target) && (!toggleRef.current || !toggleRef.current.contains(e.target))) {
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
                            {navItems.map((item, idx) => (
                                <li key={idx}>
                                    <a
                                        className={"collapsible-header waves-effect side-menu-nav-link nav-link-index" + (isActive(item.path) ? " active" : "")}
                                        onClick={() => {
                                            setSidebarOpen(false);
                                            navigate(Array.isArray(item.path) ? item.path[item.path.length - 1] : item.path);
                                        }}
                                    >
                                        <img src={item.image} />
                                        <span>{item.label}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </li>
                </ul>
                <img src={ImgPromo} id="sidenav-promo-banner" className="cursor-pointer" />
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
                        <a className="nav-link waves-effect" id="navbarSupportMenuLink">
                            <i className="far fa-comment-dots" onClick={() => { openSupportModal(false); }}></i>
                        </a>
                    </li>
                    <li className="nav-item dropdown user-custom-dropdown">
                        {
                            isLogin ? <a className="nav-link waves-effect" ref={toggleRef} onClick={() => setDropdownOpen(!dropdownOpen)}>
                                <i className="far fa-user"></i>
                                <span className="clearfix d-none d-xl-inline-block own-username">{contextData?.session?.user?.username}</span>
                            </a> : <a className="nav-link waves-effect" onClick={handleLoginClick}>
                                <i className="far fa-user"></i>
                                <span className="clearfix d-none d-xl-inline-block own-username">Acceder</span>
                            </a>
                        }
                        {
                            isLogin && <>
                                <div className="dropdown-menu dropdown-menu-right user-profile-dropdown" ref={dropdownRef} style={{ display: dropdownOpen && "block" }}>
                                    <a className="dropdown-item waves-effect waves-light" onClick={() => {
                                        setDropdownOpen(false);
                                        handleMyProfileClick();
                                    }}>Mis datos</a>
                                    <a className="dropdown-item waves-effect waves-light" onClick={() => {
                                        setDropdownOpen(false);
                                        handleMyProfileHistoryClick();
                                    }}>Historial del Juego</a>
                                    <a className="dropdown-item waves-effect waves-light" onClick={() => {
                                        setDropdownOpen(false);
                                        handleMyProfileTransactionClick();
                                    }}>Transacciones</a>
                                    {
                                        supportParent &&
                                        <a className="dropdown-item waves-effect waves-light" onClick={() => {
                                            setDropdownOpen(false);
                                            openSupportModal(true);
                                        }}>Soporte 24/7</a>
                                    }
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