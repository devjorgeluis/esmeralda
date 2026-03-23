import { useState, useEffect, useContext } from "react";
import LoadApi from "../Loading/LoadApi";
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
        // Show the game container
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

  // Cleanup when the modal unmounts
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
      // Enter fullscreen
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
      // Exit fullscreen
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
      
      // Hide loading container
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
    
    // Show error message
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

  // Don't render anything if not active
  if (!isExpandActive && !props.gameUrl) return null;

  return (
    <div 
      className="preview-games-iframe expand-active" 
      style={{ display: isExpandActive ? 'block' : 'none' }}
    >
      <div className="background-opacity"></div>

      <div className="container-iframe">
        <div className="iframe-header">
          <div className="options-container">
            <div className="close-option close-option-update-balance-modal" onClick={handleClose}>
              <i className="fa fa-close" aria-hidden="true"></i>
            </div>
            <div className="clearfix"></div>
          </div>
          <div className="clearfix"></div>
        </div>

        <iframe 
          src={url} 
          id="game-iframe" 
          className="cs-game-iframe-modal" 
          allowFullScreen
          allow="camera;microphone;fullscreen *; autoplay; payment; clipboard-read; clipboard-write"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          style={{ display: iframeLoaded ? 'block' : 'none' }}
        />
      </div>

      {/* Fullscreen toggle button (optional - can be added if needed) */}
      {iframeLoaded && (
        <div className="fullscreen-toggle" onClick={toggleFullScreen} style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 10000,
          background: 'rgba(0,0,0,0.5)',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
          <i className={`fa ${isFullscreen ? 'fa-compress' : 'fa-expand'}`} aria-hidden="true"></i>
        </div>
      )}
    </div>
  );
};

export default GameModal;