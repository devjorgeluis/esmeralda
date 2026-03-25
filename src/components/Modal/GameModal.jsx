import { useState, useEffect, useContext } from "react";
import { NavigationContext } from "../Layout/NavigationContext";

const GameModal = (props) => {
  const [url, setUrl] = useState(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExpandActive, setIsExpandActive] = useState(false);
  const { setShowFullDivLoading } = useContext(NavigationContext);

  useEffect(() => {
    if (props.gameUrl !== null && props.gameUrl !== "") {
      if (props.isMobile) {
        window.location.href = props.gameUrl;
      } else {
        const container = document.querySelector(".preview-games-iframe");
        if (container) {
          container.style.display = "block";
          container.classList.add("expand-active");
        }
        setUrl(props.gameUrl);
        setIsExpandActive(true);
      }
    }
  }, [props.gameUrl, props.isMobile]);

  useEffect(() => {
    return () => {
      const container = document.querySelector(".preview-games-iframe");
      if (container) {
        container.style.display = "none";
        container.classList.remove("expand-active");
      }
      setUrl(null);
      setIframeLoaded(false);
      setIsFullscreen(false);
      setIsExpandActive(false);
    };
  }, []);

  const toggleFullScreen = () => {
    const iframe = document.getElementById("game-iframe");

    if (!isFullscreen) {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else if (iframe.mozRequestFullScreen) {
        iframe.mozRequestFullScreen();
      } else if (iframe.webkitRequestFullscreen) {
        iframe.webkitRequestFullscreen();
      } else if (iframe.msRequestFullscreen) {
        iframe.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const exitHandler = () => {
    if (
      !document.fullscreenElement &&
      !document.webkitIsFullScreen &&
      !document.mozFullScreen &&
      !document.msFullscreenElement
    ) {
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("fullscreenchange", exitHandler);
    document.addEventListener("webkitfullscreenchange", exitHandler);
    document.addEventListener("mozfullscreenchange", exitHandler);
    document.addEventListener("MSFullscreenChange", exitHandler);

    return () => {
      document.removeEventListener("fullscreenchange", exitHandler);
      document.removeEventListener("webkitfullscreenchange", exitHandler);
      document.removeEventListener("mozfullscreenchange", exitHandler);
      document.removeEventListener("MSFullscreenChange", exitHandler);
    };
  }, []);

  const handleIframeLoad = () => {
    if (url != null) {
      setIframeLoaded(true);
      setShowFullDivLoading(false);

      const loadingEl = document.getElementById("game-window-loading");
      if (loadingEl) {
        loadingEl.style.display = "none";
      }
    }
  };

  const handleIframeError = () => {
    console.error("Error loading game iframe");
    setIframeLoaded(false);
    setShowFullDivLoading(false);

    const loadingEl = document.getElementById("game-window-loading");
    if (loadingEl) {
      loadingEl.innerHTML = '<div class="error-message">Error loading game. Please try again.</div>';
    }
  };

  const handleClose = () => {
    const container = document.querySelector(".preview-games-iframe");
    if (container) {
      container.style.display = "none";
      container.classList.remove("expand-active");
    }
    setIsExpandActive(false);
    if (typeof props.onClose === 'function') {
      props.onClose();
    }
  };

  if (!isExpandActive && !props.gameUrl) return null;

  return (
    <main id="main">
      <div className="col-12 justify-content-center" id="current_container">
        <div className="d-flex">
          <div id="current_container_game">
            <iframe
              src={url}
              id="game-iframe"
              allowFullScreen
              allow="camera;microphone;fullscreen *; autoplay; payment; clipboard-read; clipboard-write"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              style={{ display: iframeLoaded ? 'block' : 'none' }}
            />
          </div>
          <div id="current_container_menu">
            <ul>
              <li title="Pantalla completa" onClick={toggleFullScreen} style={{ cursor: 'pointer' }}>
                <i className="fas fa-expand-arrows-alt"></i>
              </li>
              <li title="Recargar" onClick={() => {
                const iframe = document.getElementById('game-iframe');
                if (iframe) {
                  iframe.src = iframe.src;
                }
              }} style={{ cursor: 'pointer' }}>
                <i className="fas fa-redo"></i>
              </li>
              <li title="Cerca" onClick={handleClose} style={{ cursor: 'pointer' }}>
                <i className="fas fa-times"></i>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
};

export default GameModal;