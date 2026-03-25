import { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../../AppContext";

const MyProfileModal = ({ isOpen, onClose }) => {
    const { contextData } = useContext(AppContext);
    const navigate = useNavigate();
    const location = useLocation();

    const formatBalance = (value) => {
        const num = value > 0 ? parseFloat(value) : Math.abs(value);
        if (isNaN(num)) return "";
        return num.toLocaleString("de-DE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    useEffect(() => {
        if (!contextData?.session) {
            navigate("/");
        }
    }, [contextData?.session, navigate]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    if (!isOpen) return null;

    return (
        <>
            <div className="modal fade show" id="ModalOwnLimits" style={{ paddingRight: 4, display: "block", zIndex: 1050 }}>
                <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered cascading-modal modal-md" role="document">
                    <div className="modal-content">
                        <div className="modal-header text-center gradient-card-header red-gradient">
                            <h6 className="modal-title w-100 font-weight-bold text-left ml-2">Mis datos</h6>
                            <button type="button" className="close" onClick={onClose}>
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body p-4 white-text font-size-custom" id="ModalOwnLimitsContent">
                            <div className="row py-1">
                                <div className="col">Id</div>
                                <div className="col text-right">{contextData?.session?.user?.id || "-"}</div>
                            </div>
                            <div className="row py-1">
                                <div className="col">Email</div>
                                <div className="col text-right">{contextData?.session?.user?.email || "-"}</div>
                            </div>
                            <div className="row py-1">
                                <div className="col">Usuario</div>
                                <div className="col text-right">{contextData?.session?.user?.username || "-"}</div>
                            </div>
                            <div className="row py-1">
                                <div className="col">Saldo</div>
                                <div className="col text-right">${formatBalance(contextData?.session?.user?.balance)}</div>
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

export default MyProfileModal;