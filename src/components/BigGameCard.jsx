import { useContext } from 'react';
import { AppContext } from '../AppContext';

const BigGameCard = (props) => {
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
        <div
            className="swiper-slide"
            onClick={handleGameClick}
            data-game-id={props.id || props.gameId}
        >
            {
                <a>
                    <img src={props.imageSrc} alt={props.title}  />
                </a>
            }
        </div>
    );
};

export default BigGameCard;