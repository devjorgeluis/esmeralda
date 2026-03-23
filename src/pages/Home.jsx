import { useContext, useState, useEffect, useRef } from "react";
import { useOutletContext, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";
import { NavigationContext } from "../components/Layout/NavigationContext";
import { callApi } from "../utils/Utils";
import Slideshow from "../components/Home/Slideshow";
import CategoryContainer from "../components/CategoryContainer";
import ProviderContainer from "../components/ProviderContainer";
import BannerContainer from "../components/Home/BannerContainer";
import HotGameSlideshow from "../components/Home/HotGameSlideshow";
import GameModal from "../components/Modal/GameModal";
import ProviderModal from "../components/Modal/ProviderModal";
import SearchInput from "../components/SearchInput";
import GameCard from "../components/GameCard";
import LoadApi from "../components/Loading/LoadApi";

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

const Home = () => {
  const { contextData } = useContext(AppContext);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const { setShowFullDivLoading } = useContext(NavigationContext);
  const [games, setGames] = useState([]);
  const [topGames, setTopGames] = useState([]);
  const [topArcade, setTopArcade] = useState([]);
  const [topCasino, setTopCasino] = useState([]);
  const [topLiveCasino, setTopLiveCasino] = useState([]);
  const [categories, setCategories] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [firstFiveCategoriesGames, setFirstFiveCategoriesGames] = useState([]);
  const [activeCategory, setActiveCategory] = useState({});
  const [categoryType, setCategoryType] = useState("");
  const [txtSearch, setTxtSearch] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [pageData, setPageData] = useState({});
  const [gameUrl, setGameUrl] = useState("");
  const [isSingleCategoryView, setIsSingleCategoryView] = useState(false);
  const [shouldShowGameModal, setShouldShowGameModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [isLoadingGames, setIsLoadingGames] = useState(false);
  const refGameModal = useRef();
  const pendingPageRef = useRef(new Set());
  const pendingCategoryFetchesRef = useRef(0);
  const lastLoadedTagRef = useRef("");
  const lastProcessedPageRef = useRef({ page: null, ts: 0 });
  const { isSlotsOnly, isLogin, isMobile } = useOutletContext();
  const location = useLocation();
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const currentPath = window.location.pathname;
        if (currentPath === "/" || currentPath === "") {
          setShowFullDivLoading(true);
          pendingPageRef.current.clear();
          lastProcessedPageRef.current = { page: null, ts: 0 };

          getPage("home");
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
    if (!location.hash || tags.length === 0) return;
    const hashCode = location.hash.replace("#", "");
    const tagIndex = tags.findIndex((t) => t.code === hashCode);

    if (tagIndex !== -1 && selectedCategoryIndex !== tagIndex) {
      setSelectedCategoryIndex(tagIndex);
      setIsSingleCategoryView(false);
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

    getPage("home");
    getStatus();

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

  const getPage = (page) => {
    if (pendingPageRef.current.has(page)) return;
    pendingPageRef.current.add(page);

    setIsLoadingGames(true);
    setShowFullDivLoading(true);
    setCategories([]);
    setGames([]);
    setFirstFiveCategoriesGames([]);
    setIsSingleCategoryView(false);

    callApi(
      contextData,
      "GET",
      "/get-page?page=" + page,
      (result) => callbackGetPage(result, page),
      null,
    );
  };

  const callbackGetPage = (result, page) => {
    pendingPageRef.current.delete(page);

    if (result.status === 500 || result.status === 422) {
      setIsLoadingGames(false);
      setShowFullDivLoading(false);
      return;
    }

    const now = Date.now();
    if (
      lastProcessedPageRef.current.page === page &&
      now - lastProcessedPageRef.current.ts < 3000
    ) {
      setShowFullDivLoading(false);
      setIsLoadingGames(false);
      return;
    }
    lastProcessedPageRef.current = { page, ts: now };

    setCategoryType(result.data?.page_group_type);
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
      if (page === "home") {
        setMainCategories(result.data.categories);
      }
      const firstCategory = result.data.categories[0];
      setActiveCategory(firstCategory);

      const firstFiveCategories = result.data.categories.slice(0, 5);
      if (firstFiveCategories.length > 0) {
        setFirstFiveCategoriesGames([]);
        pendingCategoryFetchesRef.current = firstFiveCategories.length;
        setIsLoadingGames(true);
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
      // If the requested page is a tag (e.g. 'arcade') and the server returned categories,
      // find the matching category and open it directly in single-category view.
      if (
        page &&
        (page === "arcade" ||
          (tags[tagIndex] && tags[tagIndex].code === "arcade"))
      ) {
        const matchIndex = result.data.categories.findIndex(
          (c) =>
            c.table_name === "arcade" ||
            (c.name && c.name.toLowerCase().includes("arcade")) ||
            (c.name && c.name.toLowerCase().includes("crash")),
        );
        const categoryToShow =
          matchIndex !== -1
            ? result.data.categories[matchIndex]
            : result.data.categories[0];
        if (categoryToShow) {
          setIsSingleCategoryView(true);
          setActiveCategory(categoryToShow);
          setSelectedCategoryIndex(tagIndex !== -1 ? tagIndex : 0);
          fetchContent(
            categoryToShow,
            categoryToShow.id,
            categoryToShow.table_name,
            0,
            true,
            result.data.page_group_code,
          );
        }
      }
    } else if (result.data && result.data.page_group_type === "games") {
      setIsSingleCategoryView(true);
      setCategories(mainCategories.length > 0 ? mainCategories : []);
      configureImageSrc(result);
      setGames(result.data.content || result.data.categories || []);
      setActiveCategory(tags[tagIndex] || { name: page });
      pageCurrent = 1;
      setShowFullDivLoading(false);
    }

    setIsLoadingGames(false);
    setShowFullDivLoading(false);
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    setSelectedProvider(null);
    setShowFilterModal(false);
    setIsLoadingGames(false);
    setTxtSearch("");
  };

  const fetchContentForCategory = (
    category,
    categoryId,
    tableName,
    categoryIndex,
    resetCurrentPage,
    pageGroupCode = null,
  ) => {
    const pageSize = 12;
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
    }

    pendingCategoryFetchesRef.current = Math.max(
      0,
      pendingCategoryFetchesRef.current - 1,
    );
    if (pendingCategoryFetchesRef.current === 0) {
      setIsLoadingGames(false);
      setShowFullDivLoading(false);
    }
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

  const loadMoreContent = (category, categoryIndex) => {
    if (!category) return;
    setIsSingleCategoryView(true);
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
      let imageDataSrc = element.image_url;
      if (element.image_local !== null) {
        imageDataSrc = contextData.cdnUrl + element.image_local;
      }
      element.imageDataSrc = imageDataSrc;
    });
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
    // setShowFullDivLoading(false);
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

  const handleProviderSelect = (provider, index = 0) => {
    setSelectedProvider(provider);
    setTxtSearch("");

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
      return;
    }

    setGames([]);
    setIsSingleCategoryView(true);
    setShowFullDivLoading(true);

    let pageSize = 30;

    callApi(
      contextData,
      "GET",
      "/search-content?keyword=" +
      encodeURIComponent(keyword) +
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
    setIsSingleCategoryView(false);
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
                <div className="btn filter-all provider-item" onClick={() => setShowFilterModal(true)}>
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
              {txtSearch !== "" ||
                selectedProvider ||
                isSingleCategoryView ? (
                <>
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
                    <div className="AllGames">
                      {games.map((game, idx) => (
                        <GameCard
                          key={`list-${activeCategory?.id || "search"}-${game.id}-${idx}`}
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
              ) : isSingleCategoryView ? (
                <>
                  {
                    games.length > 0 &&
                    <div className="AllGames">
                      {games.map((game, idx) => (
                        <GameCard
                          key={`cat-${selectedCategoryIndex}-${game.id}-${idx}`}
                          id={game.id}
                          title={game.name}
                          text={isLogin ? "Jugar" : "Ingresar"}
                          imageSrc={
                            game.image_local !== null
                              ? contextData.cdnUrl + game.image_local
                              : game.image_url
                          }
                          onClick={() =>
                            isLogin
                              ? launchGame(game, "slot", "modal")
                              : handleLoginClick()
                          }
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
                <div className="home-section">
                  <div className="home-item">
                    {tags[selectedCategoryIndex]?.code === "home" && (
                      <>
                        {topGames.length > 0 && (
                          <HotGameSlideshow
                            games={topGames}
                            name="games"
                            title="Juegos"
                            icon=""
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
                              icon="cherry"
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
                              icon="cherry"
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
                              icon="spades"
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
                      </>
                    )}

                    {tags[selectedCategoryIndex]?.code !== "home" &&
                      firstFiveCategoriesGames.length > 0 &&
                      firstFiveCategoriesGames.map((entry, catIndex) => {
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
                  </div>
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

            <div className="games-container">
              <div className="home-section-container">
                {!isSingleCategoryView && !selectedProvider && (
                  <BannerContainer isSlotsOnly={isSlotsOnly} />
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
