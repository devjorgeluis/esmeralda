import { useContext, useState, useEffect, useRef } from "react";
import { useLocation, useOutletContext, useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";
import { callApi } from "../utils/Utils";
// import Slideshow from "../components/LiveCasino/Slideshow";
import LiveGameCard from "/src/components/LiveGameCard";
import GameModal from "../components/Modal/GameModal";
import ProviderModal from "../components/Modal/ProviderModal";
import ProviderContainer from "../components/ProviderContainer";
import SearchInput from "../components/SearchInput";
import LoadApi from "../components/Loading/LoadApi";
import Img777 from "/src/assets/svg/casino.svg";

let selectedGameId = null;
let selectedGameType = null;
let selectedGameLauncher = null;
let selectedGameName = null;
let selectedGameImg = null;
let pageCurrent = 0;


const LiveCasino = () => {
  const pageTitle = "Live Casino";
  const { contextData } = useContext(AppContext);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [txtSearch, setTxtSearch] = useState("");
  const [tags, setTags] = useState([]);
  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState({});
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [pageData, setPageData] = useState({});
  const [gameUrl, setGameUrl] = useState("");
  const [shouldShowGameModal, setShouldShowGameModal] = useState(false);
  const [isLoadingGames, setIsLoadingGames] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const refGameModal = useRef();
  const location = useLocation();
  const { isSlotsOnly, isLogin, isMobile } = useOutletContext();
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.hash || tags.length === 0) return;
    const hashCode = location.hash.replace('#', '');
    const tagIndex = tags.findIndex(t => t.code === hashCode);

    if (tagIndex !== -1 && selectedCategoryIndex !== tagIndex) {
      setSelectedCategoryIndex(tagIndex);
      getPage(hashCode);
    }
  }, [location.hash, tags]);

  useEffect(() => {
    selectedGameId = null;
    selectedGameType = null;
    selectedGameLauncher = null;
    selectedGameName = null;
    selectedGameImg = null;
    setGameUrl("");
    setShouldShowGameModal(false);
    setActiveCategory({});
    getPage("livecasino");
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const isSlotsOnlyFalse = isSlotsOnly === false || isSlotsOnly === "false";
    let tmpTags = isSlotsOnlyFalse
      ? [
        { name: "Lobby", code: "home", icon: "icon-all" },
        { name: "Hot", code: "hot", icon: "icon-favorites" },
        { name: "Jokers", code: "joker", icon: "icon-videopoker" },
        { name: "Ruletas", code: "roulette", icon: "icon-table" },
        { name: "Crash", code: "arcade", icon: "icon-crash" },
        { name: "Megaways", code: "megaways", icon: "icon-instant" },
      ]
      : [
        { name: "Lobby", code: "home", icon: "icon-all" },
        { name: "Hot", code: "hot", icon: "icon-favorites" },
        { name: "Jokers", code: "joker", icon: "icon-videopoker" },
        { name: "Megaways", code: "megaways", icon: "icon-instant" },
      ];

    setTags(tmpTags);
  }, [isSlotsOnly]);

  const getPage = (page) => {
    setIsLoadingGames(true);
    setGames([]);
    setSelectedProvider(null);
    callApi(contextData, "GET", "/get-page?page=" + page, (result) => callbackGetPage(result, page), null);
  };

  const callbackGetPage = (result, page) => {
    if (result.status === 500 || result.status === 422) {
      setIsLoadingGames(false);
    } else {
      setPageData(result.data);

      const hashCode = location.hash.replace('#', '');
      const tagIndex = tags.findIndex(t => t.code === hashCode);
      setSelectedCategoryIndex(tagIndex !== -1 ? tagIndex : 0);

      if (result.data && result.data.page_group_type === "categories" && result.data.categories && result.data.categories.length > 0) {
        setCategories(result.data.categories);
        if (page === "casino") {
          setMainCategories(result.data.categories);
        }

        // Get first category
        const firstCategory = result.data.categories[0];
        setActiveCategory(firstCategory);

        // Fetch games for the first category
        if (firstCategory) {
          fetchContent(firstCategory, firstCategory.id, firstCategory.table_name, 0, true, result.data.page_group_code);
        }
      } else if (result.data && result.data.page_group_type === "games") {
        setCategories(mainCategories.length > 0 ? mainCategories : []);
        configureImageSrc(result);
        setGames(result.data.categories || []);
        setActiveCategory(tags[tagIndex] || { name: page });
        pageCurrent = 1;
        setIsLoadingGames(false);
      }
    }
  };

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    setSelectedProvider(null);
    setShowFilterModal(false);
    setIsLoadingGames(false);
    setTxtSearch("");
  };

  const loadMoreGames = () => {
    if (!activeCategory) return;
    setIsLoadingGames(true);
    fetchContent(activeCategory, activeCategory.id, activeCategory.table_name, selectedCategoryIndex, false);
  };

  const fetchContent = (category, categoryId, tableName, categoryIndex, resetCurrentPage, pageGroupCode) => {
    let pageSize = 30;
    setIsLoadingGames(true);

    if (resetCurrentPage) {
      pageCurrent = 0;
      setGames([]);
    }

    setActiveCategory(category);
    setSelectedCategoryIndex(categoryIndex);

    const groupCode = pageGroupCode || pageData.page_group_code;

    let apiUrl =
      "/get-content?page_group_type=categories&page_group_code=" +
      groupCode +
      "&table_name=" +
      tableName +
      "&apigames_category_id=" +
      categoryId +
      "&page=" +
      pageCurrent +
      "&length=" +
      pageSize;

    if (selectedProvider && selectedProvider.id) {
      apiUrl += "&provider=" + selectedProvider.id;
    }

    callApi(contextData, "GET", apiUrl, callbackFetchContent, null);
  };

  const callbackFetchContent = (result) => {
    if (result.status === 500 || result.status === 422) {
      setIsLoadingGames(false);
    } else {
      if (pageCurrent == 0) {
        configureImageSrc(result);
        setGames(result.content);
      } else {
        configureImageSrc(result);
        setGames([...games, ...result.content]);
      }
      pageCurrent += 1;
      setIsLoadingGames(false);
    }
  };

  const configureImageSrc = (result) => {
    (result.content || []).forEach((element) => {
      element.imageDataSrc = element.image_local !== null ? contextData.cdnUrl + element.image_local : element.image_url;
    });
  };

  const launchGame = (game, type, launcher) => {
    // Only show modal when explicitly using modal launcher
    if (launcher === "modal") {
      setShouldShowGameModal(true);
    } else {
      setShouldShowGameModal(false);
    }
    setIsLoadingGames(true);
    selectedGameId = game?.id != null ? game.id : selectedGameId;
    selectedGameType = type != null ? type : selectedGameType;
    selectedGameLauncher = launcher != null ? launcher : selectedGameLauncher;
    selectedGameName = game?.name || selectedGameName;
    selectedGameImg = game?.image_local != null ? contextData.cdnUrl + game.image_local : selectedGameImg;
    callApi(contextData, "GET", "/get-game-url?game_id=" + selectedGameId, callbackLaunchGame, null);
  };

  const callbackLaunchGame = (result) => {
    setIsLoadingGames(false);
    if (result.status == "0") {
      if (isMobile) {
        try {
          window.location.href = result.url;
        } catch (err) {
          try { window.open(result.url, "_blank", "noopener,noreferrer"); } catch (err) { }
        }
        selectedGameId = null;
        selectedGameType = null;
        selectedGameLauncher = null;
        selectedGameName = null;
        selectedGameImg = null;
        setGameUrl("");
        setShouldShowGameModal(false);
        return;
      }

      if (selectedGameLauncher === "tab") {
        try {
          window.open(result.url, "_blank", "noopener,noreferrer");
        } catch (err) {
          window.location.href = result.url;
        }
        selectedGameId = null;
        selectedGameType = null;
        selectedGameLauncher = null;
        selectedGameName = null;
        selectedGameImg = null;
        setGameUrl("");
        setShouldShowGameModal(false);
      } else {
        setGameUrl(result.url);
        setShouldShowGameModal(true);
      }
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

    try {
      const el = document.getElementsByClassName("game-view-container")[0];
      if (el) {
        el.classList.add("d-none");
        el.classList.remove("fullscreen");
        el.classList.remove("with-background");
      }
      const iframeWrapper = document.getElementById("game-window-iframe");
      if (iframeWrapper) iframeWrapper.classList.add("d-none");
    } catch (err) {
      // ignore DOM errors
    }
    try { getPage('livecasino'); } catch (e) { }
  };

  const handleProviderSelect = (provider, index = 0) => {
    setSelectedProvider(provider);
    setTxtSearch("");

    if (provider) {
      setActiveCategory(null);
      setSelectedCategoryIndex(-1);

      fetchContent(
        provider,
        provider.id,
        provider.table_name,
        index,
        true
      );
    } else {
      const firstCategory = categories[0];
      if (firstCategory) {
        setActiveCategory(firstCategory);
        setSelectedCategoryIndex(0);
        fetchContent(firstCategory, firstCategory.id, firstCategory.table_name, 0, true);
      }
    }
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const search = (e) => {
    const keyword = typeof e === 'string' ? e : (e?.target?.value ?? '');
    setTxtSearch(keyword);

    if (typeof e === 'string') {
      performSearch(keyword);
      return;
    }

    if (e.key === "Enter" || e.keyCode === 13) {
      performSearch(keyword);
      searchRef.current?.blur();
    }

    if (e.key === "Escape" || e.keyCode === 27) {
      searchRef.current?.blur();
    }
  };

  const performSearch = (keyword) => {
    if (keyword.trim() === "") {
      return;
    }

    setGames([]);
    setIsLoadingGames(true);

    let pageSize = 30;

    callApi(
      contextData,
      "GET",
      "/search-content?keyword=" + encodeURIComponent(keyword) +
      "&page_group_code=" + pageData.page_group_code +
      "&length=" + pageSize,
      callbackSearch,
      null
    );
  };

  const callbackSearch = (result) => {
    setIsLoadingGames(false);
    if (result.status === 500 || result.status === 422) {
      // Handle error
    } else {
      configureImageSrc(result);
      setGames(result.content);
      pageCurrent = 0;
    }
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
        <>
          <div className="home-section-module">
            {/* <Slideshow /> */}

            <div className="home-section-module-important home-section-module-39 loaded">
              <div className="casino-filters-mobile mobile-item">
                <div className="SearchContainer">
                  <SearchInput
                    txtSearch={txtSearch}
                    setTxtSearch={setTxtSearch}
                    searchRef={searchRef}
                    search={search}
                    isMobile={isMobile}
                  />
                </div>
                <div className="btn filter-all provider-item" onClick={() => setShowFilterModal(true)}>
                  <img src={Img777} />
                  <span className="name">Proveedores</span>
                </div>
              </div>

              <ProviderContainer
                categories={categories}
                selectedProvider={selectedProvider}
                setSelectedProvider={setSelectedProvider}
                onProviderSelect={handleProviderSelect}
                onOpenProviders={() => setShowFilterModal(true)}
              />
            </div>

            <div className="dw-casino-11 showLobby">
              <div className="SearchContainer desktop-item">
                {!isMobile && (
                  <SearchInput
                    txtSearch={txtSearch}
                    setTxtSearch={setTxtSearch}
                    searchRef={searchRef}
                    search={search}
                    isMobile={isMobile}
                  />
                )}
              </div>
              {
                games.length > 0 &&
                <div className="Live-AllGames AllGames">
                  {games.map((game) => (
                    <LiveGameCard
                      key={game.id}
                      id={game.id}
                      provider={activeCategory?.name || "Live Casino"}
                      title={game.name}
                      imageSrc={
                        game.image_local !== null
                          ? contextData.cdnUrl + game.image_local
                          : game.image_url
                      }
                      game={game}
                      onGameClick={(g) => {
                        if (isLogin) {
                          launchGame(g, "slot", "modal");
                        } else {
                          handleLoginClick();
                        }
                      }}
                    />
                  ))}
                </div>
              }

              {!isLoadingGames && games.length === 0 && (
                <div className="GamesEmptyContainer">
                  <div className="GamesEmpty">
                    <span>Sin Juegos</span>
                  </div>
                </div>
              )}

              {games.length > 0 && (
                <div className="text-center">
                  <button className="load-more" onClick={loadMoreGames}>
                    <span>VER MÁS {isLoadingGames && <LoadApi />}</span>
                  </button>
                </div>
              )}

              <ProviderModal
                isOpen={showFilterModal}
                onClose={() => setShowFilterModal(false)}
                onCategorySelect={(category) => {
                  handleCategorySelect(category);
                }}
                onCategoryClick={(tag, _id, _table, index) => {
                  setTxtSearch("");
                  setShowFullDivLoading(true);
                  if (window.location.hash !== `#${tag.code}`) {
                    window.location.hash = `#${tag.code}`;
                    getPage(tag.code);
                  } else {
                    setSelectedCategoryIndex(index);
                    setIsSingleCategoryView(false);
                    setIsExplicitSingleCategoryView(false);
                    getPage(tag.code);
                  }
                }}
                onSelectProvider={(provider) => {
                  handleProviderSelect(provider);
                  setShowFilterModal(false);
                }}
                contextData={contextData}
                tags={tags}
                categories={categories}
                selectedCategoryIndex={selectedCategoryIndex}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default LiveCasino;