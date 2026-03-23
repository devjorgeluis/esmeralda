import { useContext, useState, useEffect, useRef } from "react";
import { useLocation, useOutletContext, useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";
import { LayoutContext } from "../components/Layout/LayoutContext";
import { NavigationContext } from "../components/Layout/NavigationContext";
import { callApi } from "../utils/Utils";
import Slideshow from "../components/Home/Slideshow";
import HotGameSlideshow from "../components/Home/HotGameSlideshow";
import GameCard from "/src/components/GameCard";
import GameModal from "../components/Modal/GameModal";
import ProviderModal from "../components/Modal/ProviderModal";
import CategoryContainer from "../components/CategoryContainer";
import ProviderContainer from "../components/ProviderContainer";
import SearchInput from "../components/SearchInput";
import LoadApi from "../components/Loading/LoadApi";
import "animate.css";

let selectedGameId = null;
let selectedGameType = null;
let selectedGameLauncher = null;
let selectedGameName = null;
let selectedGameImg = null;
let pageCurrent = 0;

import ImgCategoryHome from "/src/assets/svg/home.svg";
import ImgCategoryPopular from "/src/assets/svg/new.svg";
import ImgCategoryBlackjack from "/src/assets/svg/jackpots.svg";
import ImgCategoryRoulette from "/src/assets/svg/roulette.svg";
import ImgCategoryCrash from "/src/assets/svg/crash.svg";
import ImgCategoryMegaways from "/src/assets/svg/megaways.svg";
import Img777 from "/src/assets/svg/casino.svg";

const Casino = () => {
  const pageTitle = "Casino";
  const { contextData } = useContext(AppContext);
  const { isLogin } = useContext(LayoutContext);
  const { setShowFullDivLoading } = useContext(NavigationContext);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [txtSearch, setTxtSearch] = useState("");
  const [tags, setTags] = useState([]);
  const [games, setGames] = useState([]);
  const [firstFiveCategoriesGames, setFirstFiveCategoriesGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState({});
  const [categoryType, setCategoryType] = useState("");
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [pageData, setPageData] = useState({});
  const [gameUrl, setGameUrl] = useState("");
  const [shouldShowGameModal, setShouldShowGameModal] = useState(false);
  const [isSingleCategoryView, setIsSingleCategoryView] = useState(false);
  const [isExplicitSingleCategoryView, setIsExplicitSingleCategoryView] =
    useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [isLoadingGames, setIsLoadingGames] = useState(false);
  const refGameModal = useRef();
  const location = useLocation();
  const { isSlotsOnly, isMobile } = useOutletContext();
  const lastLoadedTagRef = useRef("");
  const pendingCategoryFetchesRef = useRef(0);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.hash || tags.length === 0) return;
    const hashCode = location.hash.replace("#", "");
    const tagIndex = tags.findIndex((t) => t.code === hashCode);

    if (tagIndex !== -1 && selectedCategoryIndex !== tagIndex) {
      setSelectedCategoryIndex(tagIndex);
      setIsSingleCategoryView(false);
      setIsExplicitSingleCategoryView(false);
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
    setIsSingleCategoryView(false);
    setIsExplicitSingleCategoryView(false);
    getPage("casino");
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const isSlotsOnlyFalse = isSlotsOnly === false || isSlotsOnly === "false";
    let tmpTags = isSlotsOnlyFalse
      ? [
        { name: "Lobby", code: "home", image: ImgCategoryHome },
        { name: "Hot", code: "hot", image: ImgCategoryPopular },
        { name: "Jokers", code: "joker", image: ImgCategoryBlackjack },
        { name: "Ruletas", code: "roulette", image: ImgCategoryRoulette },
        { name: "Crash", code: "arcade", image: ImgCategoryCrash },
        { name: "Megaways", code: "megaways", image: ImgCategoryMegaways },
      ]
      : [
        { name: "Lobby", code: "home", image: ImgCategoryHome },
        { name: "Hot", code: "hot", image: ImgCategoryPopular },
        { name: "Jokers", code: "joker", image: ImgCategoryBlackjack },
        { name: "Megaways", code: "megaways", image: ImgCategoryMegaways },
      ];

    setTags(tmpTags);
  }, [isSlotsOnly]);

  const getPage = (page) => {
    setIsLoadingGames(true);
    setShowFullDivLoading(true);
    setGames([]);
    setFirstFiveCategoriesGames([]);
    setIsSingleCategoryView(false);
    setIsExplicitSingleCategoryView(false);
    callApi(
      contextData,
      "GET",
      "/get-page?page=" + page,
      (result) => callbackGetPage(result, page),
      null,
    );
  };

  const callbackGetPage = (result, page) => {
    if (result.status === 500 || result.status === 422) {
      setIsLoadingGames(false);
      setShowFullDivLoading(false);
    } else {
      setCategoryType(result.data.page_group_type);
      setSelectedProvider(null);
      setPageData(result.data);

      const hashCode = location.hash.replace("#", "");
      const tagIndex = tags.findIndex((t) => t.code === hashCode);
      setSelectedCategoryIndex(tagIndex !== -1 ? tagIndex : 0);

      if (
        result.data &&
        result.data.page_group_type === "categories" &&
        result.data.categories &&
        result.data.categories.length > 0
      ) {
        setCategories(result.data.categories);
        if (page === "casino") {
          setMainCategories(result.data.categories);
        }
        const firstCategory = result.data.categories[0];
        setActiveCategory(firstCategory);

        const firstFiveCategories = result.data.categories.slice(0, 5);
        if (firstFiveCategories.length > 0) {
          setFirstFiveCategoriesGames([]);
          pendingCategoryFetchesRef.current = firstFiveCategories.length;
          setShowFullDivLoading(true);
          firstFiveCategories.forEach((item, index) => {
            fetchContentForCategory(
              item,
              item.id,
              item.table_name,
              index,
              true,
              result.data.page_group_code,
            );
          });
        }
      } else if (result.data && result.data.page_group_type === "games") {
        setIsSingleCategoryView(true);
        setIsExplicitSingleCategoryView(false);
        setCategories(mainCategories.length > 0 ? mainCategories : []);
        configureImageSrc(result);
        setGames(result.data.categories || []);
        setActiveCategory(tags[tagIndex] || { name: page });
        pageCurrent = 1;
      }

      setShowFullDivLoading(false);
      setIsLoadingGames(false);
    }
  };

  const fetchContentForCategory = (
    category,
    categoryId,
    tableName,
    categoryIndex,
    resetCurrentPage,
    pageGroupCode = null,
  ) => {
    const pageSize = 10;
    const groupCode = pageGroupCode || pageData.page_group_code;
    const apiUrl =
      "/get-content?page_group_type=categories&page_group_code=" +
      groupCode +
      "&table_name=" +
      tableName +
      "&apigames_category_id=" +
      categoryId +
      "&page=0&length=" +
      pageSize +
      (selectedProvider && selectedProvider.id
        ? "&provider=" + selectedProvider.id
        : "");

    callApi(
      contextData,
      "GET",
      apiUrl,
      (result) =>
        callbackFetchContentForCategory(result, category, categoryIndex),
      null,
    );
  };

  const callbackFetchContentForCategory = (result, category, categoryIndex) => {
    if (result.status === 500 || result.status === 422) {
      pendingCategoryFetchesRef.current = Math.max(
        0,
        pendingCategoryFetchesRef.current - 1,
      );
      if (pendingCategoryFetchesRef.current === 0) {
        setShowFullDivLoading(false);
      }
    } else {
      const content = result.content || [];
      configureImageSrc(result);

      const gamesWithImages = content.map((game) => ({
        ...game,
        imageDataSrc:
          game.image_local !== null
            ? contextData.cdnUrl + game.image_local
            : game.image_url,
      }));

      const categoryGames = {
        category: category,
        games: gamesWithImages,
      };

      setFirstFiveCategoriesGames((prev) => {
        const updated = [...prev];
        updated[categoryIndex] = categoryGames;
        return updated;
      });

      pendingCategoryFetchesRef.current = Math.max(
        0,
        pendingCategoryFetchesRef.current - 1,
      );
      if (pendingCategoryFetchesRef.current === 0) {
        setShowFullDivLoading(false);
      }
    }
  };

  const loadMoreContent = (category, categoryIndex) => {
    if (!category) return;
    setIsSingleCategoryView(true);
    setIsExplicitSingleCategoryView(true);
    setSelectedCategoryIndex(categoryIndex);
    setActiveCategory(category);
    fetchContent(
      category,
      category.id,
      category.table_name,
      categoryIndex,
      true,
    );
    lastLoadedTagRef.current = category.code || "";
    window.scrollTo(0, 0);
  };

  const loadMoreGames = () => {
    if (!activeCategory) return;
    setIsLoadingGames(true);
    fetchContent(
      activeCategory,
      activeCategory.id,
      activeCategory.table_name,
      selectedCategoryIndex,
      false,
    );
  };

  const fetchContent = (
    category,
    categoryId,
    tableName,
    categoryIndex,
    resetCurrentPage,
    pageGroupCode,
  ) => {
    let pageSize = 30;
    setIsLoadingGames(true);

    if (resetCurrentPage) {
      pageCurrent = 0;
      setGames([]);
    }

    setActiveCategory(category);
    setSelectedCategoryIndex(categoryIndex);

    const groupCode =
      categoryType === "categories"
        ? pageGroupCode || pageData.page_group_code
        : "default_pages_home";

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
      setShowFullDivLoading(false);
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
    }
    setShowFullDivLoading(false);
    setIsLoadingGames(false);
  };

  const configureImageSrc = (result) => {
    (result.content || []).forEach((element) => {
      element.imageDataSrc =
        element.image_local !== null
          ? contextData.cdnUrl + element.image_local
          : element.image_url;
    });
  };

  const launchGame = (game, type, launcher) => {
    // Only show modal when explicitly using modal launcher
    if (launcher === "modal") {
      setShouldShowGameModal(true);
    } else {
      setShouldShowGameModal(false);
    }
    setShowFullDivLoading(true);
    selectedGameId = game?.id != null ? game.id : selectedGameId;
    selectedGameType = type != null ? type : selectedGameType;
    selectedGameLauncher = launcher != null ? launcher : selectedGameLauncher;
    selectedGameName = game?.name || selectedGameName;
    selectedGameImg =
      game?.image_local != null
        ? contextData.cdnUrl + game.image_local
        : selectedGameImg;
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
    if (result.status == "0") {
      if (isMobile) {
        try {
          window.location.href = result.url;
        } catch (err) {
          try {
            window.open(result.url, "_blank", "noopener,noreferrer");
          } catch (err) { }
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
    try {
      getPage("casino");
    } catch (e) { }
  };

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    setSelectedProvider(null);
    setShowFilterModal(false);
    setTxtSearch("");
  };

  const handleProviderSelect = (provider, index = 0) => {
    setSelectedProvider(provider);
    setTxtSearch("");
    setIsExplicitSingleCategoryView(true);

    if (provider) {
      setActiveCategory(null);
      setSelectedCategoryIndex(-1);

      fetchContent(provider, provider.id, provider.table_name, index, true);
    } else {
      const firstCategory = categories[0];
      if (firstCategory) {
        setActiveCategory(firstCategory);
        setSelectedCategoryIndex(0);
        fetchContent(
          firstCategory,
          firstCategory.id,
          firstCategory.table_name,
          0,
          true,
        );
      }
    }
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const search = (e) => {
    const keyword = typeof e === "string" ? e : (e?.target?.value ?? "");
    setTxtSearch(keyword);

    if (typeof e === "string") {
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
      // Optional: reset to lobby view
      setIsSingleCategoryView(false);
      setIsExplicitSingleCategoryView(false);
      setGames([]);
      getPage("casino");
      return;
    }

    setTxtSearch(keyword.trim());
    setGames([]);
    setIsSingleCategoryView(true); // Prepare UI for single grid
    setIsExplicitSingleCategoryView(true);
    setActiveCategory({ name: `Búsqueda: "${keyword.trim()}"` });
    setSelectedProvider(null);
    setShowFullDivLoading(true);

    let pageSize = 30;

    callApi(
      contextData,
      "GET",
      "/search-content?keyword=" +
      encodeURIComponent(keyword.trim()) +
      "&page_group_code=" +
      pageData.page_group_code +
      "&length=" +
      pageSize,
      callbackSearch,
      null,
    );
  };

  const callbackSearch = (result) => {
    setShowFullDivLoading(false);

    if (result.status === 500 || result.status === 422) {
      setGames([]);
    } else {
      configureImageSrc(result);
      setGames(result.content || []);
      pageCurrent = 1;
    }

    setIsSingleCategoryView(true);
    setIsExplicitSingleCategoryView(true);
    setActiveCategory({ name: `Búsqueda: "${txtSearch}"` });
    setSelectedProvider(null);
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
        <div className="home-section-module">
          <Slideshow />

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
              <div
                className="btn filter-all provider-item"
                onClick={() => setShowFilterModal(true)}
              >
                <img src={Img777} />
                <span className="name">Proveedores</span>
              </div>
            </div>
            <CategoryContainer
              categories={tags}
              selectedCategoryIndex={selectedCategoryIndex}
              selectedProvider={selectedProvider}
              onCategoryClick={(tag, _id, _table, index) => {
                setTxtSearch("");
                setShowFullDivLoading(true);
                setIsExplicitSingleCategoryView(false);
                if (window.location.hash !== `#${tag.code}`) {
                  window.location.hash = `#${tag.code}`;
                  getPage(tag.code);
                } else {
                  setSelectedCategoryIndex(index);
                  getPage(tag.code);
                }
              }}
              onCategorySelect={handleCategorySelect}
              isMobile={isMobile}
              pageType="casino"
            />
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

            {selectedProvider || isExplicitSingleCategoryView ? (
              <>
                {
                  games.length > 0 &&
                  <div className="AllGames">
                    {games.map((game) => (
                      <GameCard
                        key={game.id}
                        id={game.id}
                        provider={activeCategory?.name || "Casino"}
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

                {(isExplicitSingleCategoryView || selectedProvider) &&
                  games.length > 0 && (
                    <div className="btn-footer-sg">
                      <button className="btn btn-theme02" onClick={loadMoreGames}>
                        <span>VER MÁS {isLoadingGames && <LoadApi />}</span>
                      </button>
                    </div>
                  )}
              </>
            ) : (
              <>
                {isSingleCategoryView ? (
                  <>
                    {
                      games.length > 0 &&
                      <div className="AllGames">
                        {games.map((game) => (
                          <GameCard
                            key={game.id}
                            id={game.id}
                            provider={activeCategory?.name || "Casino"}
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
                      <div className="btn-footer-sg">
                        <button className="btn btn-theme02" onClick={loadMoreGames}>
                          <span>VER MÁS {isLoadingGames && <LoadApi />}</span>
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {firstFiveCategoriesGames.map((entry, catIndex) => {
                      if (!entry || !entry.games) return null;

                      return (
                        <HotGameSlideshow
                          key={entry?.category?.id || catIndex}
                          games={entry.games}
                          name={entry?.category?.name}
                          title={entry?.category?.name}
                          icon=""
                          slideshowKey={entry?.category?.id}
                          loadMoreContent={() =>
                            loadMoreContent(entry.category, catIndex)
                          }
                          onGameClick={(g) => {
                            if (isLogin) {
                              launchGame(g, "slot", "modal");
                            } else {
                              handleLoginClick();
                            }
                          }}
                        />
                      );
                    })}
                  </>
                )}
              </>
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
      )}
    </>
  );
};

export default Casino;
