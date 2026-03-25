import { useContext, useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../AppContext";
import { LayoutContext } from "./LayoutContext";
import { callApi } from "../../utils/Utils";
import Header from "./Header";
import Footer from "./Footer";
import SupportModal from "../Modal/SupportModal";
import MyProfileModal from "../Modal/MyProfileModal";
import MyProfileHistoryModal from "../Modal/MyProfileHistoryModal";
import MyProfileTransactionModal from "../Modal/MyProfileTransactionModal";
import { NavigationContext } from "./NavigationContext";
import FullDivLoading from "../Loading/FullDivLoading";

const Layout = () => {
    const { contextData } = useContext(AppContext);
    const [selectedPage, setSelectedPage] = useState("lobby");
    const [isLogin, setIsLogin] = useState(contextData.session !== null);
    const [isMobile, setIsMobile] = useState(false);
    const [userBalance, setUserBalance] = useState(0);
    const [supportWhatsApp, setSupportWhatsApp] = useState("");
    const [supportTelegram, setSupportTelegram] = useState("");
    const [supportEmail, setSupportEmail] = useState("");
    const [supportParent, setSupportParent] = useState("");
    const [isSlotsOnly, setIsSlotsOnly] = useState("");
    const [showMyProfileModal, setShowMyProfileModal] = useState(false);
    const [showMyProfileHistoryModal, setShowMyProfileHistoryModal] = useState(false);
    const [showMyProfileTransactionModal, setShowMyProfileTransactionModal] = useState(false);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [showSupportModal, setShowSupportModal] = useState(false);
    const [supportParentOnly, setSupportParentOnly] = useState(false);
    const [showFullDivLoading, setShowFullDivLoading] = useState(false);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsSidebarExpanded(!isSidebarExpanded);
    };

    const location = useLocation();
    const isSportsPage = location.pathname === "/sports" || location.pathname === "/live-sports";  
    const isHomePage = location.pathname === "/" || location.pathname === "/home";
    const isLoginPage = location.pathname === "/login";

    useEffect(() => {
        if (contextData.session != null) {
            setIsLogin(true);
            if (contextData.session.user && contextData.session.user.balance) {
                const parsed = parseFloat(contextData.session.user.balance);
                setUserBalance(Number.isFinite(parsed) ? parsed : 0);

                setSupportWhatsApp(contextData.session.support_whatsapp || "");
                setSupportTelegram(contextData.session.support_telegram || "");
                setSupportEmail(contextData.session.support_email || "");
                setSupportParent(contextData.session.support_parent || "");
            }

            refreshBalance();
        }
        getStatus();
    }, [contextData.session]);

    useEffect(() => {
        const checkIsMobile = () => {
            return window.innerWidth <= 767;
        };
        setIsMobile(checkIsMobile());

        const handleResize = () => {
            setIsMobile(checkIsMobile());
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (!isHomePage) {
            document.body.classList.add("white-skin");
        } else {
            document.body.classList.remove("white-skin");
        }
    }, [isHomePage]);

    const refreshBalance = (callback) => {
        setUserBalance(0);
        callApi(contextData, "GET", "/get-user-balance", (result) => {
            callbackRefreshBalance(result);
            if (callback) callback();
        }, null);
    };

    const callbackRefreshBalance = (result) => {
        const parsed = result && result.balance ? parseFloat(result.balance) : 0;
        setUserBalance(Number.isFinite(parsed) ? parsed : 0);
    };

    const getStatus = () => {
        callApi(contextData, "GET", "/get-status", callbackGetStatus, null);
    };

    const getPage = (page) => {
        setSelectedPage(page);
        setShowFullDivLoading(true);
        callApi(contextData, "GET", "/get-page?page=" + page, callbackGetPage, null);
        navigate("/" + (page === "home" ? "" : page));
    };

    const callbackGetPage = () => {
        setShowFullDivLoading(false);
    };

    const callbackGetStatus = (result) => {
        if ((result && result.slots_only == null) || (result && result.slots_only == false)) {
            setIsSlotsOnly("false");
        } else {
            setIsSlotsOnly("true");
        }

        setSupportWhatsApp(result && result.support_whatsapp ? result.support_whatsapp : "");
        setSupportTelegram(result && result.support_telegram ? result.support_telegram : "");
        setSupportEmail(result && result.support_email ? result.support_email : "");
        setSupportParent(result && result.support_parent ? result.support_parent : "");

        if (result && result.user === null) {
            localStorage.removeItem("session");
        }
    };

    const handleLoginClick = () => {
        navigate("/login");
    };

    const openSupportModal = (parentOnly = false) => {
        setSupportParentOnly(Boolean(parentOnly));
        setShowSupportModal(true);
    };

    const closeSupportModal = () => {
        setShowSupportModal(false);
        setSupportParentOnly(false);
    };

    const handleLogoutClick = () => {
        callApi(contextData, "POST", "/logout", (result) => {
            if (result.status === "success") {
                setTimeout(() => {
                    localStorage.removeItem("session");
                    window.location.href = "/";
                }, 200);
            }
        }, null);
    };

    const handleMyProfileClick = () => {
        setShowMyProfileModal(true);
    };

    const handleMyProfileHistoryClick = () => {
        setShowMyProfileHistoryModal(true);
    };

    const handleMyProfileTransactionClick = () => {
        setShowMyProfileTransactionModal(true);
    };

    const layoutContextValue = {
        isLogin,
        userBalance,
        supportWhatsApp,
        supportTelegram,
        supportEmail,
        handleLogoutClick,
        refreshBalance,
        isSidebarExpanded,
        toggleSidebar,
        openSupportModal
    };

    return (
        <LayoutContext.Provider value={layoutContextValue}>
            <NavigationContext.Provider
                value={{ selectedPage, setSelectedPage, getPage, showFullDivLoading, setShowFullDivLoading }}
            >
                <>             
                    {/* <FullDivLoading show={showFullDivLoading} /> */}
                    {showMyProfileModal && (
                        <MyProfileModal
                            isMobile={isMobile}
                            isOpen={showMyProfileModal}
                            onClose={() => setShowMyProfileModal(false)}
                        />
                    )}
                    {showMyProfileHistoryModal && (
                        <MyProfileHistoryModal
                            isMobile={isMobile}
                            isOpen={showMyProfileHistoryModal}
                            onClose={() => setShowMyProfileHistoryModal(false)}
                        />
                    )}
                    {showMyProfileTransactionModal && (
                        <MyProfileTransactionModal
                            isMobile={isMobile}
                            isOpen={showMyProfileTransactionModal}
                            onClose={() => setShowMyProfileTransactionModal(false)}
                        />
                    )}
                    {
                        !isLoginPage && 
                        <Header
                            isLogin={isLogin}
                            isSlotsOnly={isSlotsOnly}
                            userBalance={userBalance}
                            handleLoginClick={handleLoginClick}
                            handleLogoutClick={handleLogoutClick}
                            handleMyProfileClick={handleMyProfileClick}
                            handleMyProfileHistoryClick={handleMyProfileHistoryClick}
                            handleMyProfileTransactionClick={handleMyProfileTransactionClick}
                            supportParent={supportParent}
                            openSupportModal={openSupportModal}
                            refreshBalance={refreshBalance}
                        />
                    }
                    {/* Sidebar is rendered inside Header; no duplicate here. */}
                    <Outlet context={{ isSlotsOnly, isLogin, isMobile }} />
                    {!isSportsPage && !isLoginPage && <Footer isLogin={isLogin} isSlotsOnly={isSlotsOnly} /> }
                    <SupportModal
                        isOpen={showSupportModal}
                        onClose={closeSupportModal}
                        supportWhatsApp={supportWhatsApp}
                        supportTelegram={supportTelegram}
                        supportEmail={supportEmail}
                        supportParentOnly={supportParentOnly}
                        supportParent={supportParent}
                    />
                </>
            </NavigationContext.Provider>
        </LayoutContext.Provider>
    );
};

export default Layout;
