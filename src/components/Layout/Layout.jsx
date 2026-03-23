import { useContext, useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../AppContext";
import { LayoutContext } from "./LayoutContext";
import { callApi } from "../../utils/Utils";
import Header from "./Header";
import SupportModal from "../Modal/SupportModal";
import Footer from "./Footer";
import LoginModal from "../Modal/LoginModal";
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
    const [showLoginModal, setShowLoginModal] = useState(false);
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

    const refreshBalance = () => {
        setUserBalance(0);
        callApi(contextData, "GET", "/get-user-balance", callbackRefreshBalance, null);
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
        setShowLoginModal(true);
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

    const handleLoginSuccess = (balance) => {
        const parsed = balance ? parseFloat(balance) : 0;
        setUserBalance(Number.isFinite(parsed) ? parsed : 0);
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
                    <FullDivLoading show={showFullDivLoading} />
                    {showLoginModal && (
                        <LoginModal
                            isMobile={isMobile}
                            isOpen={showLoginModal}
                            onClose={() => setShowLoginModal(false)}
                            onLoginSuccess={handleLoginSuccess}
                        />
                    )}
                    <Header
                        isLogin={isLogin}
                        isSlotsOnly={isSlotsOnly}
                        userBalance={userBalance}
                        handleLoginClick={handleLoginClick}
                        handleLogoutClick={handleLogoutClick}
                        supportParent={supportParent}
                        openSupportModal={openSupportModal}
                    />
                    {/* Sidebar is rendered inside Header; no duplicate here. */}
                    <Outlet context={{ isSlotsOnly, isLogin, isMobile }} />
                    {!isSportsPage &&  <Footer isLogin={isLogin} isSlotsOnly={isSlotsOnly} /> }
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
