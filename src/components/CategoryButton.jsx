const CategoryButton = (props) => {
    let customClass = "cat-list-item d-inline-block";
    if (props.active == true) {
        customClass += " active";
    }

    return (
        <div className={customClass} onClick={props.onClick}>
            {props.name}
        </div>
    );
};

export default CategoryButton;
