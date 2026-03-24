import { useContext } from 'react';
import { AppContext } from '../AppContext';

const GameCard = (props) => {
    const { contextData } = useContext(AppContext);

    const handleGameClick = (e) => {
        e.stopPropagation();

        const gameData = props.game || {
            id: props.id || props.gameId,
            name: props.title,
            image_local: props.imageSrc?.includes(contextData?.cdnUrl)
                ? props.imageSrc.replace(contextData.cdnUrl, '')
                : null,
            image_url: props.imageSrc?.includes(contextData?.cdnUrl)
                ? null
                : props.imageSrc
        };

        if (props.onGameClick) {
            props.onGameClick(gameData);
        }
    };

    return (
        <div className="col-4 col-sm-3 col-md-2 col-xl-2 d-inline-block view overlay zoom game-item" onClick={handleGameClick}>
            <div className="heart-in-game">
                <i className="fas fa-heart color-uncheck fa-lg"></i>
            </div>
            <img src={props.imageSrc} className="img-fluid z-depth-1" title={props.title}></img>
            <div className="footer-name">{props.title}</div>
            <div className="mask flex-center waves-effect waves-light">
                <p className="white-text"><i className="far fa-play-circle"></i></p>
            </div>
        </div>
    );
};

export default GameCard;