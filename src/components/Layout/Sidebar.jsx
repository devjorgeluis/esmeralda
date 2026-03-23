import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ImgHome from "/src/assets/svg/home.svg";
import ImgCasino from "/src/assets/svg/casino.svg";
import ImgLiveCasino from "/src/assets/svg/live-casino.svg";
import ImgSports from "/src/assets/svg/sports.svg";
import ImgLiveSports from "/src/assets/svg/live-sports.svg";

const Sidebar = ({
    isLogin,
    isSlotsOnly,
    show,
    supportParent,
    handleLogoutClick,
    openSupportModal,
    onClose
}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const pathname = location?.pathname ?? "";

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    useEffect(() => {
        if (show) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [show]);

    const isSlotsOnlyMode = isSlotsOnly === "true" || isSlotsOnly === true;
    const navItems = !isSlotsOnlyMode
        ? [
            { path: ["/", "/home"], label: "INICIO", image: ImgHome },
            { path: ["/casino"], label: "CASINO", image: ImgCasino },
            { path: ["/live-casino"], label: "CASINO EN VIVO", image: ImgLiveCasino },
            { path: ["/sports"], label: "DEPORTES", image: ImgSports },
            { path: ["/live-sports"], label: "DEPORTES EN VIVO", image: ImgLiveSports }
        ]
        : [
            { path: ["/", "/home"], label: "INICIO", image: ImgHome },
            { path: ["/casino"], label: "CASINO", image: ImgCasino }
        ];

    const isActive = (paths) => {
        if (Array.isArray(paths)) {
            return paths.some(p => p === "/" ? pathname === "/" : pathname.startsWith(p));
        }
        return pathname.startsWith(paths);
    };        

    return (
        <div className="menu-mobile" style={{ display: show ? "block" : "none" }}>
            <div className="menu-container">
                <div className="menu">
                    <div className="sections-header beauty-scroll">
                        <div className="menu-item">
                            {
                                isLogin && 
                                <div className="sesion-buttons">
                                    <a
                                        onClick={() => {
                                            navigate("/profile");
                                            onClose && onClose();
                                        }} className="btn btn-theme outline"
                                    >
                                        <i className="fa-solid fa-user"></i>
                                        <span>Profile</span>
                                    </a>
                                    <a
                                        onClick={() => {
                                            navigate("/profile/transaction");
                                            onClose && onClose();
                                        }} className="btn btn-theme outline"
                                    >
                                        <i className="fa-solid fa-clock-rotate-left fa-fw"></i>
                                        <span>Transactions</span>
                                    </a>
                                    <a
                                        onClick={() => {
                                            navigate("/profile/history");
                                            onClose && onClose();
                                        }} className="btn btn-theme outline"
                                    >
                                        <i className="fa-solid fa-clock-rotate-left fa-fw"></i>
                                        <span>Historial de cuenta</span>
                                    </a>
                                    <a
                                        onClick={() => {
                                            onClose && onClose();
                                            handleLogoutClick();
                                        }} className="btn btn-theme outline"
                                    >
                                        <i className="fa-solid fa-right-from-bracket"></i>
                                        <span>Logout</span>
                                    </a>
                                </div>
                            }

                            <div className="menu-navs">
                                <ul className="links">
                                    {navItems.map((item, idx) => (
                                        <li key={idx} className="nav-item link">
                                            <a
                                                className={"nav-link" + (isActive(item.path) ? " active" : "")}
                                                style={{ textTransform: "uppercase" }}
                                                onClick={() => {
                                                    navigate(Array.isArray(item.path) ? item.path[item.path.length - 1] : item.path);
                                                    onClose && onClose();
                                                }}
                                            >
                                                <img src={item.image} className="image-icon mr-1" />
                                                <span>{item.label}</span>
                                            </a>
                                        </li>
                                    ))}
                                    {supportParent && (
                                        <li className="nav-item link">
                                            <a
                                                className="nav-link"
                                                onClick={() => openSupportModal(true)}
                                            >
                                                <i className="fa fa-phone-flip"></i> 
                                                <span>Contactá a Tu Cajero</span>
                                            </a>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {
                        isLogin && 
                        <a
                            className="logout-button" onClick={() => {
                                handleLogoutClick();
                                onClose && onClose();
                            }}
                        >
                            <i className="fa-solid fa-right-from-bracket"></i>
                            <span>Logout</span>
                        </a>
                    }
                </div>
            </div>
            <div className="close-menu-mobile"></div>
        </div>
    );
};

export default Sidebar;
