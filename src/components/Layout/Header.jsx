import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../../AppContext";
import Sidebar from "./Sidebar";
import ImgLogo from "/src/assets/svg/logo.svg";
import ImgSupport from "/src/assets/svg/support-black.svg";

import ImgHome from "/src/assets/svg/home.svg";
import ImgCasino from "/src/assets/svg/casino.svg";
import ImgLiveCasino from "/src/assets/svg/live-casino.svg";
import ImgSports from "/src/assets/svg/sports.svg";
import ImgLiveSports from "/src/assets/svg/live-sports.svg";

const Header = ({
    isLogin,
    isSlotsOnly,
    userBalance,
    supportParent,
    handleLoginClick,
    handleLogoutClick,
    openSupportModal
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const pathname = location?.pathname ?? "";
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { contextData } = useContext(AppContext);
    const [showSidebar, setShowSidebar] = useState(false);

    const navItems = isSlotsOnly === "false" ? [
        { path: ["/", "/home"], label: "INICIO", image: ImgHome },
        { path: ["/casino"], label: "CASINO", image: ImgCasino },
        { path: ["/live-casino"], label: "CASINO EN VIVO", image: ImgLiveCasino },
        { path: ["/sports"], label: "DEPORTES", image: ImgSports },
        { path: ["/live-sports"], label: "DEPORTES EN VIVO", image: ImgLiveSports }
    ] : [
        { path: ["/", "/home"], label: "INICIO", image: ImgHome },
        { path: ["/casino"], label: "CASINO", image: ImgCasino }
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

    return (
        <>
            <header className="cs-header-19">
                <div className="cs-header-top">
                    <div className="container-fluid">
                        <div className="row">
                            <nav className="navbar navbar-expand-lg desktop-item">
                                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                    <ul className="navbar-nav navbar-logo">
                                        <li className="nav-item">
                                            <a className="nav-link" onClick={() => navigate("/")}>
                                                <img src={ImgLogo} alt="Site" title="Site" className="logo-header" />
                                            </a>
                                        </li>
                                    </ul>
                                    <ul className="nav navbar-nav navbar-right navbar-links">
                                        {navItems.map((item, idx) => (
                                            <li key={idx} role="presentation" className="nav-item link">
                                                <a
                                                    className={"nav-link" + (isActive(item.path) ? " active" : "")}
                                                    style={{ textTransform: "uppercase" }}
                                                    onClick={() => navigate(Array.isArray(item.path) ? item.path[item.path.length - 1] : item.path)}
                                                >
                                                    <img src={item.image} className="image-icon mr-1" />
                                                    <span>{item.label}</span>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                    <ul className="nav navbar-nav navbar-right options-user">
                                        <button className="button-support" onClick={() => { openSupportModal(false); }}>
                                            <img src={ImgSupport} />
                                        </button>
                                        {
                                            isLogin ? <div className="nav-item nav-items-extra login">
                                                <div className="user-info-balance">
                                                    <span>{contextData?.session?.user?.username} </span>
                                                    <span className="text-theme span-user-info-balance ml-1">${formatBalance(userBalance)}</span>
                                                </div>
                                                <button className="navbar-toggler show-menu-mobile d-flex" type="button" onClick={() => setShowSidebar(!showSidebar)}>
                                                    <span className="navbar-toggler-icon"></span>
                                                </button>
                                            </div> :
                                                <div className="nav-item nav-items-extra no-login">
                                                    <button className="btn btn-theme outline" onClick={handleLoginClick}>
                                                        <span>Acceder</span>
                                                    </button>
                                                </div>
                                        }
                                    </ul>
                                </div>
                            </nav>
                            <div className="cs-header-top-mobile">
                                <a onClick={() => navigate("/")} className="d-flex mr-auto">
                                    <img src={ImgLogo} alt="Site" title="Site" className="logo-header-mobile" />
                                </a>
                                <button className="button-support" onClick={() => { openSupportModal(false); }}>
                                    <img src={ImgSupport} />
                                </button>
                                {
                                    isLogin ? <div className="user-information">
                                        <span>{contextData?.session?.user?.username} </span>
                                        <span className="span-user-info-balance-mobile">${formatBalance(userBalance)}</span>
                                    </div> :
                                        <div className="btn btn-theme outline" onClick={handleLoginClick}>
                                            <span>Acceder</span>
                                        </div>
                                }
                                <button className="navbar-toggler show-menu-mobile" type="button" onClick={() => setShowSidebar(!showSidebar)}>
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {
                    showSidebar &&
                    <Sidebar
                        isSlotsOnly={isSlotsOnly}
                        isLogin={isLogin}
                        show={showSidebar}
                        supportParent={supportParent}
                        handleLogoutClick={handleLogoutClick}
                        openSupportModal={openSupportModal}
                        onClose={() => setShowSidebar(false)}
                    />
                }
            </header>
        </>
    );
};

export default Header;