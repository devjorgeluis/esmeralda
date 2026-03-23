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
        <div className="search">
            <input
                ref={searchRef}
                placeholder="Busca..."
                value={txtSearch}
                onChange={handleChange}
                onKeyUp={search}
            />
            <i className="fa fa-search Centered" onClick={() => { if (typeof onSearchClick === 'function') onSearchClick(txtSearch); else if (typeof search === 'function') search(txtSearch); }}></i>
        </div>
    );
};

export default SearchInput;
