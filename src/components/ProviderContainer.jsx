import { useLocation } from "react-router-dom";

const ProviderContainer = ({
    categories,
    selectedProvider,
    onProviderSelect,
    onOpenProviders
}) => {
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

    return (
        <div className="cat-list-inside">
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