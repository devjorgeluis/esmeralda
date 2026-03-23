import { useContext, useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../../AppContext";
import { callApi } from "../../utils/Utils";

const MyProfileModal = ({ isMobile, isOpen, onClose, handleLogoutClick = () => { } }) => {
    const { contextData } = useContext(AppContext);
    const navigate = useNavigate();
    const location = useLocation();

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('transactions');
    const [pagination, setPagination] = useState({
        start: 0,
        length: 10,
        totalRecords: 0,
        currentPage: 1,
    });

    // Format balance helper
    const formatBalance = (value) => {
        const num = value > 0 ? parseFloat(value) : Math.abs(value);
        if (isNaN(num)) return "";
        return num.toLocaleString("de-DE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    // Format date helper
    const formatDateTime = useCallback((dateString) => {
        if (!dateString) return "—";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "—";

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }, []);

    // Redirect if no session
    useEffect(() => {
        if (!contextData?.session) {
            navigate("/");
        }
    }, [contextData?.session, navigate]);

    // Scroll to top on location change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    const fetchHistory = (type) => {
        setLoading(true);

        let queryParams;
        let apiEndpoint;

        if (type === 'history') {
            queryParams = new URLSearchParams({
                start: pagination.start,
                length: pagination.length,
                type: "slot"
            }).toString();
            apiEndpoint = `/get-history?${queryParams}`;
        } else {
            queryParams = new URLSearchParams({
                start: pagination.start,
                length: pagination.length,
            }).toString();
            apiEndpoint = `/get-transactions?${queryParams}`;
        }

        callApi(
            contextData,
            "GET",
            apiEndpoint,
            (response) => {
                if (response.status === "0") {
                    setTransactions(response.data);
                    setPagination((prev) => ({
                        ...prev,
                        totalRecords: response.recordsTotal || 0,
                    }));
                } else {
                    setTransactions([]);
                    console.error("API error:", response);
                }
                setLoading(false);
            },
            null
        );
    };

    useEffect(() => {
        fetchHistory(activeTab);
    }, [pagination.start, pagination.length, activeTab]);

    // Handle tab change
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setPagination((prev) => ({ ...prev, start: 0, currentPage: 1 }));
    };

    // Handle page change
    const handlePageChange = (page) => {
        setPagination((prev) => ({
            ...prev,
            start: (page - 1) * prev.length,
            currentPage: page,
        }));
    };

    // Calculate total pages
    const totalPages = useMemo(() => 
        Math.ceil(pagination.totalRecords / pagination.length),
        [pagination.totalRecords, pagination.length]
    );

    // Get transaction type and amount
    const getTransactionInfo = (item) => {
        if (activeTab === 'transactions') {
            const type = item.type === 'add' ? 'Depósito' : 'Retiro';
            const amount = formatBalance(item.amount);
            const isDeposit = item.type === 'add';
            return { type, amount, isDeposit };
        } else {
            const value = parseFloat(item.value);
            const type = value > 0 ? 'Ganancia' : 'Jugada';
            const amount = formatBalance(Math.abs(value));
            const isDeposit = value > 0;
            return { type, amount, isDeposit };
        }
    };

    // Generate visible pages for pagination
    const getVisiblePages = () => {
        const delta = 2;
        const visiblePages = [];
        let startPage = Math.max(1, pagination.currentPage - delta);
        let endPage = Math.min(totalPages, pagination.currentPage + delta);

        if (endPage - startPage + 1 < 2 * delta + 1) {
            if (startPage === 1) {
                endPage = Math.min(totalPages, startPage + 2 * delta);
            } else {
                startPage = Math.max(1, endPage - 2 * delta);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            visiblePages.push(i);
        }

        return visiblePages;
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content account-modal" onClick={(e) => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="modal-header">
                    <div className="header-top">
                        <h2>
                            Mi Cuenta
                        </h2>
                    </div>

                    {/* User Info Section */}
                    <div className="user-info-section">
                        <div className="info-grid">
                            <div className="info-row">
                                <span className="info-label">Id:</span>
                                <span className="info-value">
                                    {contextData?.session?.user?.id || "No disponible"}
                                </span>
                            </div>
                            {
                                !isMobile && 
                                <div className="info-row">
                                    <span className="info-label">Email:</span>
                                    <span className="info-value">
                                        {contextData?.session?.user?.email || "No disponible"}
                                    </span>
                                </div>
                            }
                            <div className="info-row">
                                <span className="info-label">Usuario:</span>
                                <span className="info-value">
                                    {contextData?.session?.user?.username || "No disponible"}
                                </span>
                            </div>
                            {
                                !isMobile && 
                                <div className="info-row">
                                    <span className="info-label">Saldo:</span>
                                    <span className="info-value balance">
                                        $ {formatBalance(contextData?.session?.user?.balance)}
                                    </span>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfileModal;