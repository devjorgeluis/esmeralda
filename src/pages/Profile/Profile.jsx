import { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../../AppContext";
import { LayoutContext } from "../../components/Layout/LayoutContext";

const Profile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { contextData } = useContext(AppContext);

    useEffect(() => {
        if (!contextData?.session) {
            navigate("/");
        }
    }, [contextData?.session, navigate]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <div className="wallet-default-container wallet-default-container-single">
                        <div className="wallet-body">
                            <div className="wallet-section-body profile-wallet-body">
                                <div className="title-wallet-body">
                                    <span>
                                        <i className="fa fa-user mr-2" aria-hidden="true"></i>
                                        Perfil
                                    </span>
                                </div>
                                <div className="form-profile-wallet">
                                    <form method="post" id="profile-form">
                                        <div className="form-group">
                                            <div className="col-lg-3 text-form-wallet">
                                                Id
                                            </div>
                                            <div className="col-lg-9">
                                                {contextData?.session?.user?.id}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-lg-3 text-form-wallet">
                                                Nombre
                                            </div>
                                            <div className="col-lg-9">
                                                {contextData?.session?.user?.username}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-lg-3 text-form-wallet">
                                                Apellido
                                            </div>
                                            <div className="col-lg-9">
                                                {contextData?.session?.user?.last_name || "-"}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-lg-3 text-form-wallet">
                                                Teléfono móvil
                                            </div>
                                            <div className="col-lg-9">
                                                {contextData?.session?.user?.phone || "-"}
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;