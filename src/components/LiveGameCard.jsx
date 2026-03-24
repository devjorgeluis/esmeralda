import { useContext } from 'react';
import { AppContext } from '../AppContext';

const LiveGameCard = (props) => {
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
        <div className="col-8 offset-2 col-sm-3 offset-sm-0 my-2 mt-sm-0 view overlay zoom game-item" onClick={handleGameClick}>
            <img src={props.imageSrc} className="img-fluid z-depth-1" title={props.title}></img>
            <div className="footer-name">{props.title}</div>
            <div className="mask flex-center waves-effect waves-light">
                <p className="white-text"><i className="far fa-play-circle"></i></p>
            </div>
        </div>
    );
};

export default LiveGameCard;