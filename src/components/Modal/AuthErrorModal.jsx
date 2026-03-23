const AuthErrorModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="auth-error-modal-overlay">
            <div className="auth-error-modal">
                <h2 className="auth-error-title">Error de autorización</h2>
                <p className="auth-error-message">¡Usuario o contraseña incorrectos!</p>
                
                <button 
                    className="auth-error-button"
                    onClick={onClose}
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default AuthErrorModal;