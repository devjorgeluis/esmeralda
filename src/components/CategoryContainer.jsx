import CategoryButton from "./CategoryButton";

const CategoryContainer = (props) => {
    if (!props.categories || props.categories.length === 0) {
        return null;
    }

    const handleCategoryClick = (category, index) => {
        if (props.onCategoryClick) {
            props.onCategoryClick(category, category.id, category.table_name, index, true);
        }
        if (props.onCategorySelect) {
            props.onCategorySelect(category);
        }
    };

    return (
        <div className="cat-list-inside">
            {props.categories.map((category, index) => (
                <CategoryButton
                    key={category.id ?? category.code ?? index}
                    name={category.name}
                    code={category.code}
                    image={category.image}
                    count={category.element_count}
                    active={
                        props.selectedProvider === null &&
                        props.selectedCategoryIndex === index
                    }
                    onClick={() => handleCategoryClick(category, index)}
                />
            ))}
        </div>
    )
}

export default CategoryContainer