import { useState } from "react";
import { useLocation } from "react-router-dom";

const ProviderContainer = ({
    categories,
    selectedProvider,
    onProviderSelect,
    onOpenProviders
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const location = useLocation();
    const providers = categories.filter(cat => cat.code !== "home" && cat.code);

    const handleClick = (e, provider) => {
        e.preventDefault();
        onProviderSelect(provider);
    };

    const isSelected = (provider) => {
        const hashCode = location.hash.substring(1);
        return (selectedProvider && selectedProvider.id === provider.id) ||
            (hashCode === provider.code);
    };

    const handleToggleProviders = (e) => {
        e.preventDefault();
        setIsExpanded((previous) => !previous);
        if (onOpenProviders) onOpenProviders();
    };

    return (
        <div className={`cat-list-inside ${isExpanded ? "cat-list-inside-expand" : ""}`} style={{ maxHeight : isExpanded && "70vh" }}>
            <div className="btn-list-item d-inline-block" id="cat_list_more" onClick={handleToggleProviders}>
                <i className={`fas ${isExpanded ? "fa-chevron-up" : "fa-chevron-down"}`}></i>
            </div>
            {
                providers.map((provider, idx) => {
                    // const imageUrl = provider.image_local
                    //     ? `${contextData.cdnUrl}${provider.image_local}`
                    //     : provider.image_url;

                    return (
                        <div key={idx} className={`cat-list-item d-inline-block ${isSelected(provider) && "active"}`} onClick={(e) => handleClick(e, provider)}>
                            {provider?.name}
                        </div>
                    )
                })
            }
        </div>
    );
};

export default ProviderContainer;