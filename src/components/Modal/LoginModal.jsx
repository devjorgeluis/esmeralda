import { useContext, useState, useEffect, useRef } from "react";
import { AppContext } from "../../AppContext";
import { callApi } from "../../utils/Utils";
import Swal from 'sweetalert2';

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
    const { contextData, updateSession } = useContext(AppContext);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const usernameRef = useRef(null);

    useEffect(() => {
        if (isOpen && usernameRef.current) usernameRef.current.focus();
    }, [isOpen]);

    useEffect(() => {
        function onKey(e) {
            if (e.key === 'Escape') onClose();
        }
        if (isOpen) document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [isOpen, onClose]);

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsLoading(true);

        const body = {
            username: username,
            password: password,
            site_label: "main",
        };

        callApi(
            contextData,
            "POST",
            "/login/",
            callbackSubmitLogin,
            JSON.stringify(body)
        );
    };

    const showErrorSwal = (message) => {
        Swal.fire({
            icon: 'error',
            title: 'Error de autenticación',
            html: message,
            confirmButtonColor: 'rgb(218, 65, 103)',
            background: 'rgb(4, 7, 19)',
            color: '#fff',
            confirmButtonText: 'Cerrar'
        });
    };

    const callbackSubmitLogin = (result) => {
        setIsLoading(false);
        if (result.status === "success") {
            localStorage.setItem("session", JSON.stringify(result));
            updateSession(result);

            if (onLoginSuccess) {
                onLoginSuccess(result.user.balance);
            }
            setTimeout(() => {
                onClose();
            }, 1000);
        } else if (result.status === "country") {
            showErrorSwal(result.message);
        } else if (result.errors) {
            const errorMessages = Object.values(result.errors).flat().join('<br>');
            showErrorSwal(errorMessages || "Combinación de nombre de usuario y contraseña no válida.");
        } else {
            const errorMessage = "Combinación de nombre de usuario y contraseña no válida.";
            showErrorSwal(errorMessage);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            id="login"
            tabIndex={-1}
            aria-labelledby="loginLabel"
            data-bs-backdrop="true"
            className="modal fade show"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', display: 'block' }}
            aria-modal="true"
            role="dialog"
        >
            <div className="modal-dialog modal-dialog-lg modal-dialog-centered">
                <div
                    className="modal-content exo-2"
                    style={{ borderRadius: '20px', backgroundColor: 'rgb(4, 7, 19)', fontFamily: '"Exo 2", sans-serif' }}
                >
                    <button
                        id="closeLogin1"
                        type="button"
                        aria-label="Close"
                        className="btn-close"
                        onClick={() => onClose()}
                        style={{ position: 'absolute', right: '15px', top: '15px', zIndex: 10 }}
                    >
                        <i className="fas fa-times" style={{ color: '#fff' }}></i>
                    </button>
                    <h6 id="exampleModalLabel" className="modal-title text-center mt-4 p-0" style={{ color: '#fff' }}>
                        Ingrese su usuario y contraseña para<br />
                        empezar a jugar.
                    </h6>
                    <div className="modal-body p-1">
                        <div className="text-center">
                            <form className="p-2 my-3" onSubmit={handleSubmit}>
                                <div className="w-100">
                                    <div className="pb-2 font-size-custom mb-2 my-1 d-flex justify-content-center w-100">
                                        <input
                                            id="username"
                                            type="text"
                                            placeholder="Usuario"
                                            autoComplete="username"
                                            className="form-control input-login mr-sm-2 my-sm-0"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            ref={usernameRef}
                                            required
                                            style={{ backgroundColor: '#1a1e2b', border: 'none', color: '#fff', padding: '12px', borderRadius: '10px' }}
                                        />
                                    </div>
                                    <div className="pb-2 font-size-custom mb-3 my-1 d-flex justify-content-center">
                                        <input
                                            id="password"
                                            type="password"
                                            placeholder="Contraseña"
                                            maxLength={64}
                                            autoComplete="current-password"
                                            className="form-control input-login mr-sm-2 my-sm-0"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            style={{ backgroundColor: '#1a1e2b', border: 'none', color: '#fff', padding: '12px', borderRadius: '10px' }}
                                        />
                                    </div>
                                </div>
                                <div className="d-flex mb-3 align-content-center justify-content-center">
                                    <button
                                        id="submit_btn"
                                        type="submit"
                                        className="btn p-2 login-btn btn btn-theme w-100"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <i className="fa fa-spin fa-spinner"></i>
                                                &nbsp;Por favor espere...
                                            </>
                                        ) : (
                                            "INGRESAR"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;