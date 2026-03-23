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
        <a className="GameContainer game-opened-iframe" onClick={handleGameClick}>
            <div className="Game">
                <div className="Image">
                    <img src={props.imageSrc} alt={props.title} />
                </div>
                <div className="FavoriteContainer">
                    <div className="Favorite Centered">
                        <i className="fa-regular fa-heart fa-fw"></i>
                    </div>
                </div>
            </div>
        </a>
    );
};

export default GameCard;