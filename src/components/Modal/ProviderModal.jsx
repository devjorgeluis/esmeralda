const ProviderModal = ({
    isOpen,
    onClose,
    onSelectProvider,
    contextData,
    categories = [],
}) => {
    if (!isOpen) return null;

    return (
        <>
            <div className="modal modal-default fade all-providers-modal show" style={{ display: "block" }} onClick={onClose}>
                <div className="modal-dialog">
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-title"></div>
                            <button type="button" className="close" onClick={onClose}>
                                <span>Close</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="list-providers-container">
                                <ul className="list-providers beauty-scroll">
                                    {categories.map((p, idx) => {
                                        const imageDataSrc = p.image_local != null
                                            ? contextData.cdnUrl + p.image_local
                                            : p.image_url;

                                        return (
                                            <li
                                                className="provider"
                                                key={p.id || idx}
                                                onClick={() => {
                                                    onSelectProvider && onSelectProvider(p);
                                                }}
                                            >
                                                <div className="provider-data">
                                                    <div className="provider-logo">
                                                        {imageDataSrc && <img src={imageDataSrc} alt={p.name} />}
                                                    </div>
                                                    <span className="provider-name">{p.name}</span>
                                                </div>
                                                <i className="fa-solid fa-fire-flame-curved fa-fw icon-promoted"></i>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show"></div>
        </>
    );
};

export default ProviderModal;