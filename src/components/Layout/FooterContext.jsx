import { createContext, useContext, useState } from 'react';

const FooterContext = createContext();

export const FooterProvider = ({ children }) => {
    const [hideFooter, setHideFooter] = useState(false);
    
    return (
        <FooterContext.Provider value={{ hideFooter, setHideFooter }}>
            {children}
        </FooterContext.Provider>
    );
};

export const useFooter = () => {
    const context = useContext(FooterContext);
    if (!context) {
        throw new Error('useFooter must be used within a FooterProvider');
    }
    return context;
};