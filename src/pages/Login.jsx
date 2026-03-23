import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";
import { callApi } from "../utils/Utils";
import AuthErrorModal from "../components/Modal/AuthErrorModal";

const Login = () => {
    const { contextData, updateSession } = useContext(AppContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({
        username: "",
        password: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showAuthError, setShowAuthError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const validateForm = () => {
        const newErrors = {
            username: "",
            password: ""
        };
        let isValid = true;

        if (!username.trim()) {
            newErrors.username = "Campo vacío";
            isValid = false;
        }

        if (!password.trim()) {
            newErrors.password = "Campo vacío";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        
        if (validateForm()) {
            setIsLoading(true);
            let body = {
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
        }
    };

    const callbackSubmitLogin = (result) => {
        setIsLoading(false);
        if (result.status === "success") {
            localStorage.setItem("session", JSON.stringify(result));
            updateSession(result);

            setTimeout(() => {
                navigate(-1);
            }, 1000);
        } else {
            setShowAuthError(true);
        }
    };

    return (
        <div className="form-templates-v3">
            <div className="form-templates-container">
                <div className="module-two">
                    <form onSubmit={handleSubmit} className="form-content">
                        <div className="stabilizer-content">
                            <div className="form-title"> Acceder </div>
                            <div className="md-form md-form-icon">
                                <div className="md-form-relative">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Nombre de usuario"
                                        value={username}
                                        onChange={(e) => {
                                            setUsername(e.target.value);
                                            if (errors.username) {
                                                setErrors({...errors, username: ""});
                                            }
                                        }}
                                    />
                                    <div className="md-icon"><i className="fa fa-user" aria-hidden="true"></i></div>
                                </div>
                            </div>
                            <div className="md-form md-form-icon">
                                <div className="md-form-relative">
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Contraseña"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            if (errors.password) {
                                                setErrors({...errors, password: ""});
                                            }
                                        }}
                                    />
                                    <div className="md-icon"><i className="fa fa-lock" aria-hidden="true"></i></div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="md-button-submit">
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
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <AuthErrorModal
                isOpen={showAuthError}
                onClose={() => setShowAuthError(false)}
            />
        </div>
    );
};

export default Login;