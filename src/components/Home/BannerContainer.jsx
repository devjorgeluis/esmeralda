import { useNavigate } from "react-router-dom";
import ImgCasino from "/src/assets/img/casino-item.png";
import ImgLiveCasino from "/src/assets/img/live-casino-item.png";
import ImgSport from "/src/assets/img/sports-item.png";

const BannerContainer = ({ isSlotsOnly }) => {
    const navigate = useNavigate();
    const isSlotsOnlyMode = isSlotsOnly === "true" || isSlotsOnly === true;

    return (
        <>
            {
                !isSlotsOnlyMode &&
                <>
                    <section id="double-lobby" data-section="livecasino" className="double-lobby col-12">
                        <div className="section team-section wow fadeIn" data-wow-delay="0.3s">
                            <h2 className="text-left mt-5 mb-4 h1 category-title ">Nuestra selección para tí</h2>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-4">
                                <div className="card collection-card z-depth-4">
                                    <div className="view zoom cursor-pointer link-item accept-guest" onClick={() => navigate("/casino")}>
                                        <img id="double-rectangle-1" src={ImgCasino} className="img-fluid z-depth-4 rounded" />
                                        <div className="mask p-3">
                                            <p className="title-action">GRAND<br />CASINO ROULETTE</p>
                                            <p className="grey-text text-action">En vivo desde los<br />mas grandes Casinos</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {
                                !isSlotsOnlyMode && 
                                <div className="col-md-6 mb-4">
                                    <div className="card collection-card z-depth-4">
                                        <div className="view zoom cursor-pointer link-item accept-guest" onClick={() => navigate("/live-casino")}>
                                            <img id="double-rectangle-2" src={ImgLiveCasino} className="img-fluid z-depth-4 rounded" />
                                            <div className="mask p-3">
                                                <p className="title-action">BLACKJACK Y<br />BACCARAT</p>
                                                <p className="grey-text text-action">Los más completos <br />Juegos de carta</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </section>
                    <section id="sports-lobby" data-section="sports" className="sports-lobby col-12 order-2">
                        <div className="section team-section wow fadeIn" data-wow-delay="0.3s">
                            <h2 className="text-left mt-5 mb-4 h1 category-title ">Deportivas</h2>
                        </div>
                        <div className="row" onClick={() => navigate("/sports")}>
                            <div className="col-lg-12 col-md-12 mb-12">
                                <img src={ImgSport} className="img-fluid z-depth-3 rounded hoverable cursor-pointer link-item" />
                            </div>
                        </div>
                    </section>
                </>
            }
        </>
    )
}

export default BannerContainer