const CategoryButton = (props) => {
    let customClass = "category";
    if (props.active == true) {
        customClass += " Active";
    }

    return (
        <a className={customClass} onClick={props.onClick}>
            <div className="icon">
                <img src={props.image} />
            </div>
            <span className="game-name">{props.name}</span>
        </a>
    );
};

export default CategoryButton;
