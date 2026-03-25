import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";
import { callApi } from "../utils/Utils";
import "../css/login-min.css";

const Login = () => {
    const { contextData, updateSession } = useContext(AppContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isUsernameFocused, setIsUsernameFocused] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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

    const callbackSubmitLogin = (result) => {
        setIsLoading(false);
        if (result.status === "success") {
            localStorage.setItem("session", JSON.stringify(result));
            updateSession(result);

            setTimeout(() => {
                const canGoBack = window.history.length > 1;
                if (canGoBack) {
                    navigate(-1);
                } else {
                    navigate("/");
                }
            }, 1000);
        } else if (result.status === "country") {
            setErrorMsg(result.message);
        } else {
            setErrorMsg("Usuario o contraseña incorrecto.");
        }
    };

    return (
        <header className="login-page">
            <section className="view">
                <div className="mask rgba-stylish-strong h-100 d-flex justify-content-center align-items-center">
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-5 col-lg-6 col-md-10 col-sm-12 mx-auto">
                                <form onSubmit={handleSubmit} className="card">
                                    <div className="card-body">
                                        <div className="form-header red-gradient">
                                            <h3 className="font-weight-500 my-2 py-1">
                                                <i className="fas fa-user"></i>Ingreso
                                            </h3>
                                        </div>
                                        <div className="md-form">
                                            <i className={`fas fa-user prefix white-text ${isUsernameFocused ? "active" : ""}`}></i>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={username}
                                                onFocus={() => setIsUsernameFocused(true)}
                                                onBlur={() => setIsUsernameFocused(false)}
                                                onChange={(e) => setUsername(e.target.value)}
                                            />
                                            <label htmlFor="user" className={isUsernameFocused || username !== "" ? "active" : ""}>Nombre de usuario</label>
                                        </div>
                                        <div className="md-form">
                                            <i className={`fas fa-lock prefix white-text ${isPasswordFocused ? "active" : ""}`}></i>
                                            <input
                                                type="password"
                                                className="form-control"
                                                value={password}
                                                onFocus={() => setIsPasswordFocused(true)}
                                                onBlur={() => setIsPasswordFocused(false)}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <label htmlFor="passwd" className={isPasswordFocused || password !== "" ? "active" : ""}>Contraseña</label>
                                        </div>
                                        {
                                            errorMsg &&
                                            <div className="text-center">
                                                <div className="col-12 mt-3 mb-3 text-center">{errorMsg}</div>
                                            </div>
                                        }
                                        <div className="text-center">
                                            <button
                                                id="dologin"
                                                type="submit"
                                                className="btn red-gradient btn-lg waves-effect waves-light"
                                                disabled={isLoading}
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <i className="fa fa-spin fa-spinner"></i>
                                                        &nbsp; Ingresar
                                                    </>
                                                ) : (
                                                    "Ingresar"
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </header>
    );
};

export default Login;