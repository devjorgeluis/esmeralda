const SearchInput = ({
    txtSearch,
    setTxtSearch,
    searchRef,
    search,
    onSearchClick
}) => {
    const handleChange = (event) => {
        const value = event.target.value;
        setTxtSearch(value);
        if (typeof search === 'function') search(value);
    };

    return (
        <div id="games_btn_group">
            <div className="games_btn">
                <input
                    id="search-text"
                    className="input_txt"
                    ref={searchRef}
                    placeholder="Busca..."
                    value={txtSearch}
                    onChange={handleChange}
                    onKeyUp={search}
                />
                <div
                    className="btn-list-item d-inline-block"
                    id="cat_list_search_2"
                    onClick={() => { if (typeof onSearchClick === 'function') onSearchClick(txtSearch); else if (typeof search === 'function') search(txtSearch); }}
                >
                    <i className="fas fa-search"></i>
                </div>
            </div>
        </div>
    );
};

export default SearchInput;
