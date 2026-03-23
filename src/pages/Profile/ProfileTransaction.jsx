import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../../AppContext";
import { callApi } from "../../utils/Utils";
import LoadApi from "../../components/Loading/LoadApi";
import ImgArrowLeft from "/src/assets/svg/arrow-left.svg";
import ImgDoubleArrowLeft from "/src/assets/svg/double-arrow-left.svg";
import ImgArrowRight from "/src/assets/svg/arrow-right.svg";
import ImgDoubleArrowRight from "/src/assets/svg/double-arrow-right.svg";

const ProfileTransaction = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { contextData } = useContext(AppContext);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        start: 0,
        length: 10,
        totalRecords: 0,
        currentPage: 1,
    });

    const formatDateDisplay = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "-";

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}.${month}.${year}`;
    };

    const formatBalance = (value) => {
        const num = parseFloat(value);
        return num.toLocaleString('de-DE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const handlePageChange = (page) => {
        setPagination((prev) => ({
            ...prev,
            start: (page - 1) * prev.length,
            currentPage: page,
        }));
    };

    const handleLengthChange = (e) => {
        const newLength = parseInt(e.target.value, 10);
        setPagination((prev) => ({
            ...prev,
            length: newLength,
            start: 0,
            currentPage: 1,
        }));
    };

    const fetchHistory = () => {
        if (!contextData?.session) return;
        
        setLoading(true);

        let queryParams = new URLSearchParams({
            start: pagination.start,
            length: pagination.length,
        }).toString();

        let apiEndpoint = `/get-transactions?${queryParams}`;

        callApi(
            contextData,
            "GET",
            apiEndpoint,
            (response) => {
                if (response.status === "0" || response.status === 0) {
                    setTransactions(response.data || []);
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
        if (!contextData?.session) {
            navigate("/");
        }
    }, [contextData?.session, navigate]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    useEffect(() => {
        fetchHistory();
    }, [pagination.start, pagination.length]);

    const totalPages = Math.ceil(pagination.totalRecords / pagination.length);

    const getVisiblePages = () => {
        const delta = 1;
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

        return { visiblePages, startPage, endPage };
    };

    const { visiblePages } = getVisiblePages();

    const handleFirstPage = () => handlePageChange(1);
    const handlePrevPage = () => handlePageChange(Math.max(1, pagination.currentPage - 1));
    const handleNextPage = () => handlePageChange(Math.min(totalPages, pagination.currentPage + 1));
    const handleLastPage = () => handlePageChange(totalPages);

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const isFirstPage = pagination.currentPage === 1;
        const isLastPage = pagination.currentPage === totalPages;

        return (
            <nav className="p-paginator-bottom">
                <div className="p-paginator p-component">
                    <button
                        className={`p-paginator-first p-paginator-element p-link ${isFirstPage ? "p-disabled" : ""}`}
                        onClick={handleFirstPage}
                        disabled={isFirstPage}
                    >
                        <img src={ImgDoubleArrowLeft} alt="First" />
                    </button>

                    <button
                        className={`p-paginator-prev p-paginator-element p-link ${isFirstPage ? "p-disabled" : ""}`}
                        onClick={handlePrevPage}
                        disabled={isFirstPage}
                    >
                        <img src={ImgArrowLeft} alt="Previous" />
                    </button>

                    <span className="p-paginator-pages">
                        {visiblePages.map((page) => (
                            <button
                                key={page}
                                className={`p-paginator-page p-paginator-element p-link ${pagination.currentPage === page ? "p-highlight" : ""
                                    }`}
                                onClick={() => handlePageChange(page)}
                            >
                                {page}
                            </button>
                        ))}
                    </span>

                    <button
                        className={`p-paginator-next p-paginator-element p-link ${isLastPage ? "p-disabled" : ""}`}
                        onClick={handleNextPage}
                        disabled={isLastPage}
                    >
                        <img src={ImgArrowRight} alt="Next" />
                    </button>

                    <button
                        className={`p-paginator-last p-paginator-element p-link ${isLastPage ? "p-disabled" : ""}`}
                        onClick={handleLastPage}
                        disabled={isLastPage}
                    >
                        <img src={ImgDoubleArrowRight} alt="Last" />
                    </button>
                </div>
            </nav>
        );
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <div className="wallet-default-container wallet-default-container-single">
                        <div className="wallet-body">
                            <div className="wallet-section-body profile-wallet-body">
                                <div className="title-wallet-body">
                                    <span>
                                        <i className="fa fa-history mr-2" aria-hidden="true"></i>
                                        Transacciones
                                    </span>
                                </div>
                                
                                {loading ? (
                                    <div className="text-center">
                                        <LoadApi />
                                    </div>
                                ) : (
                                    <div className="table-container" id="wallet-table-container">
                                        <div id="wallet-table_wrapper" className="dataTables_wrapper no-footer">
                                            <div className="dataTables_length d-flex justify-content-between align-items-center" id="wallet-table_length">
                                                <div>
                                                    <label>
                                                        Mostrar
                                                        <select 
                                                            className="form-select form-select-sm ms-2 me-2"
                                                            name="wallet-table_length"
                                                            value={pagination.length}
                                                            onChange={handleLengthChange}
                                                        >
                                                            <option value="5">5</option>
                                                            <option value="10">10</option>
                                                            <option value="20">20</option>
                                                            <option value="50">50</option>
                                                        </select>
                                                        registros
                                                    </label>
                                                </div>
                                            </div>
                                            
                                            <table id="wallet-table" className="nowrap dataTable no-footer dtr-inline">
                                                <thead>
                                                    <tr>
                                                        <th className="sorting_disabled">Fecha</th>
                                                        <th className="sorting_disabled">Id</th>
                                                        <th className="sorting_disabled">Monto</th>
                                                        <th className="sorting_disabled">Balance Previo</th>
                                                        <th className="sorting_disabled d-sm-table-cell">Balance Posterior</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {transactions.length > 0 ? (
                                                        transactions.map((transaction, index) => (
                                                            <tr key={transaction.id || index} className="tr">
                                                                <td>{formatDateDisplay(transaction.created_at)}</td>
                                                                <td>{transaction.id}</td>
                                                                <td className={parseFloat(transaction.to_current_balance) < parseFloat(transaction.to_new_balance) ? 'text-success' : 'text-danger'}>
                                                                    {formatBalance(transaction.value || transaction.amount || 0)}
                                                                </td>
                                                                <td>{formatBalance(transaction.to_current_balance)}</td>
                                                                <td>{formatBalance(transaction.to_new_balance)}</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="4" className="dataTables_empty text-center">
                                                                No data available in table
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>

                                            {totalPages > 1 && renderPagination()}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileTransaction;