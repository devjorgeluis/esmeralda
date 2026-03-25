import { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../../AppContext";
import { callApi } from "../../utils/Utils";

const MyProfileHistoryModal = ({ isOpen, onClose }) => {
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

    const fetchHistory = () => {
        if (!contextData?.session) return;

        setLoading(true);

        let queryParams = new URLSearchParams({
            start: pagination.start,
            length: pagination.length,
            type: "slot"
        }).toString();

        let apiEndpoint = `/get-history?${queryParams}`;

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
            <div className="dataTables_paginate paging_simple_numbers" id="HistoryTable_paginate">
                <ul className="pagination">
                    <li
                        className={`paginate_button page-item previous ${isFirstPage ? "disabled" : ""}`}
                        onClick={handleFirstPage}
                        disabled={isFirstPage}
                    >
                        <a className="page-link">«</a>
                    </li>

                    <li
                        className={`paginate_button page-item ${isFirstPage ? "disabled" : ""}`}
                        onClick={handlePrevPage}
                        disabled={isFirstPage}
                    >
                        <a className="page-link">‹</a>
                    </li>

                    {visiblePages.map((page) => (
                        <li
                            key={page}
                            className={`paginate_button page-item ${pagination.currentPage === page ? "active" : ""
                                }`}
                            onClick={() => handlePageChange(page)}
                        >
                            <a href="#" className="page-link">{page}</a>
                        </li>
                    ))}

                    <li
                        className={`paginate_button page-item next ${isLastPage ? "disabled" : ""}`}
                        onClick={handleNextPage}
                        disabled={isLastPage}
                    >
                        <a className="page-link">›</a>
                    </li>

                    <li
                        className={`paginate_button page-item next ${isLastPage ? "disabled" : ""}`}
                        onClick={handleLastPage}
                        disabled={isLastPage}
                    >
                        <a className="page-link">»</a>
                    </li>
                </ul>
            </div>
        );
    };


    if (!isOpen) return null;

    return (
        <>
            <div className="modal fade show" id="ModalHistory" style={{ paddingRight: 4, display: "block", zIndex: 1050 }}>
                <div className="modal-dialog modal-dialog-scrollable cascading-modal modal-lg modal-dialog-custom" role="document">
                    <div className="modal-content">
                        <div className="modal-header text-center gradient-card-header red-gradient">
                            <h6 className="modal-title w-100 font-weight-bold text-left ml-2">Historial del Juego</h6>
                            <button type="button" className="close" onClick={onClose}>
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body modal-body-custom white-text">
                            <div id="HistoryTable_wrapper" className="dataTables_wrapper dt-bootstrap4 no-footer">
                                {loading ? (
                                    <div className="text-center">
                                        <div id="HistoryTable_processing" className="dataTables_processing card">Procesando...</div>
                                    </div>
                                ) : (
                                    <>
                                        <table id="HistoryTable" className="table table-sm table-striped table-hover w-100 white-text dataTable no-footer" cellspacing="0" role="grid">
                                            <thead>
                                                <tr role="row">
                                                    <th className="sorting_disabled dt-date text-center" rowspan="1" colspan="1">Fecha</th>
                                                    <th className="sorting_disabled dt-provider text-center" rowspan="1" colspan="1">Id</th>
                                                    <th className="sorting_disabled dt-reason text-center" rowspan="1" colspan="1">Monto</th>
                                                    <th className="sorting_disabled dt-amount text-center" rowspan="1" colspan="1">Balance Previo</th>
                                                    <th className="sorting_disabled dt-before text-center" rowspan="1" colspan="1">Balance Posterior</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {transactions.length > 0 ? (
                                                    transactions.map((transaction, index) => (
                                                        <tr key={transaction.id || index} className={`${index % 2 === 0 ? "odd" : "even"}`}>
                                                            <td className="text-center">{formatDateDisplay(transaction.created_at)}</td>
                                                            <td className="text-center">{transaction.txn_id}</td>
                                                            <td className="text-center">
                                                                {formatBalance(transaction.value || transaction.amount || 0)}
                                                            </td>
                                                            <td className="text-center">{formatBalance(transaction.value_before)}</td>
                                                            <td className="text-center">{formatBalance(transaction.value_after)}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="5" className="dataTables_empty text-center">
                                                            No data available in table
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>

                                        {totalPages > 1 && renderPagination()}
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer justify-content-center py-2">
                            <button type="button" className="btn btn-danger px-3 waves-effect waves-light" onClick={onClose}>Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-backdrop fade show"></div>
        </>
    );
};

export default MyProfileHistoryModal;