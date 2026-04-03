import { useContext, useState, useEffect, useRef } from "react";
import { useOutletContext, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";
import { NavigationContext } from "../components/Layout/NavigationContext";
import { callApi } from "../utils/Utils";
import Slideshow from "../components/Home/Slideshow";
import BannerContainer from "../components/Home/BannerContainer";
import HotGameSlideshow from "../components/Home/HotGameSlideshow";
import CasinoGameSlideshow from "../components/Home/CasinoGameSlideshow";
import GameModal from "../components/Modal/GameModal";

let selectedGameId = null;
let selectedGameType = null;
let selectedGameLauncher = null;
let selectedGameName = null;
let selectedGameImg = null;

const Home = () => {
  const { contextData } = useContext(AppContext);
  const { setShowFullDivLoading } = useContext(NavigationContext);
  const [topGames, setTopGames] = useState([]);
  const [topArcade, setTopArcade] = useState([]);
  const [topCasino, setTopCasino] = useState([]);
  const [topLiveCasino, setTopLiveCasino] = useState([]);
  const [gameUrl, setGameUrl] = useState("");
  const [shouldShowGameModal, setShouldShowGameModal] = useState(false);
  const refGameModal = useRef();
  const pendingPageRef = useRef(new Set());
  const lastProcessedPageRef = useRef({ page: null, ts: 0 });
  const { isSlotsOnly, isLogin, isMobile } = useOutletContext();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const currentPath = window.location.pathname;
        if (currentPath === "/" || currentPath === "") {
          pendingPageRef.current.clear();
          lastProcessedPageRef.current = { page: null, ts: 0 };

          getStatus();

          selectedGameId = null;
          selectedGameType = null;
          selectedGameLauncher = null;
          setShouldShowGameModal(false);
          setGameUrl("");
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    selectedGameId = null;
    selectedGameType = null;
    selectedGameLauncher = null;
    selectedGameName = null;
    selectedGameImg = null;
    setGameUrl("");
    setShouldShowGameModal(false);

    getStatus();

    window.scrollTo(0, 0);
  }, [location.pathname]);

  const getStatus = () => {
    callApi(contextData, "GET", "/get-status", callbackGetStatus, null);
  };

  const callbackGetStatus = (result) => {
    if (result.status === 500 || result.status === 422) {
      // Handle error
    } else {
      setTopGames(result.top_hot);
      setTopArcade(result.top_arcade);
      setTopCasino(result.top_slot);
      setTopLiveCasino(result.top_livecasino);
      contextData.slots_only = result && result.slots_only;
    }
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const launchGame = (game, type, launcher) => {
    setShouldShowGameModal(true);
    setShowFullDivLoading(true);
    selectedGameId = game.id !== null ? game.id : selectedGameId;
    selectedGameType = type !== null ? type : selectedGameType;
    selectedGameLauncher = launcher !== null ? launcher : selectedGameLauncher;
    selectedGameName = game?.name;
    selectedGameImg =
      game?.image_local != null ? contextData.cdnUrl + game?.image_local : null;
    callApi(
      contextData,
      "GET",
      "/get-game-url?game_id=" + selectedGameId,
      callbackLaunchGame,
      null,
    );
  };

  const callbackLaunchGame = (result) => {
    setShowFullDivLoading(false);
    if (result.status === "0") {
      switch (selectedGameLauncher) {
        case "modal":
        case "tab":
          setGameUrl(result.url);
          break;
      }
    } else {
      setIsGameLoadingError(true);
    }
  };

  const closeGameModal = () => {
    selectedGameId = null;
    selectedGameType = null;
    selectedGameLauncher = null;
    selectedGameName = null;
    selectedGameImg = null;
    setGameUrl("");
    setShouldShowGameModal(false);
  };

  return (
    <>
      {shouldShowGameModal && selectedGameId !== null ? (
        <GameModal
          gameUrl={gameUrl}
          gameName={selectedGameName}
          gameImg={selectedGameImg}
          reload={launchGame}
          launchInNewTab={() => launchGame(null, null, "tab")}
          ref={refGameModal}
          onClose={closeGameModal}
          isMobile={isMobile}
        />
      ) : (
        <main className="home">
          <Slideshow />

          <div className="container px-0 pb-5">
            <div className="col-12 p-0 m-0 row d-flex">
              <BannerContainer isSlotsOnly={isSlotsOnly} />
              {topGames.length > 0 && (
                <CasinoGameSlideshow
                  games={topGames}
                  name="games"
                  title="Juegos populares"
                  link="/casino"
                  onGameClick={(game) => {
                    if (isLogin) {
                      launchGame(game, "slot", "modal");
                    } else {
                      handleLoginClick();
                    }
                  }}
                />
              )}
              {topArcade.length > 0 &&
                isSlotsOnly === "false" && (
                  <HotGameSlideshow
                    games={topArcade}
                    name="arcade"
                    title="Tragamonedas"
                    link="/casino"
                    onGameClick={(game) => {
                      if (isLogin) {
                        launchGame(game, "slot", "modal");
                      } else {
                        handleLoginClick();
                      }
                    }}
                  />
                )}
              {topCasino.length > 0 &&
                isSlotsOnly === "false" && (
                  <HotGameSlideshow
                    games={topCasino}
                    name="casino"
                    title="Casino"
                    link="/casino"
                    onGameClick={(game) => {
                      if (isLogin) {
                        launchGame(game, "slot", "modal");
                      } else {
                        handleLoginClick();
                      }
                    }}
                  />
                )}
              {topLiveCasino.length > 0 &&
                isSlotsOnly === "false" && (
                  <HotGameSlideshow
                    games={topLiveCasino}
                    name="liveCasino"
                    title="Casino en Vivo"
                    link="/live-casino"
                    onGameClick={(game) => {
                      if (isLogin) {
                        launchGame(game, "slot", "modal");
                      } else {
                        handleLoginClick();
                      }
                    }}
                  />
                )}
            </div>
          </div>
        </main>
      )}
    </>
  );
};

export default Home;
