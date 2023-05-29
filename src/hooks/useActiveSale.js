import React, { useState, useCallback } from "react";

const useActiveSale = () => {
    const [activeSale, setActiveSale] = useState(false);
    const [saleOpenModal, setSaleOpenModal] = useState(false);

    const handleCloseSaleModal = useCallback(() => {
        let url = new URL(window.location.href);
        if (url.searchParams.has("sale_id")) {
            url.searchParams.delete("sale_id");
            window.history.replaceState(
                "",
                document.title,
                window.location.pathname
            );
        }
        setSaleOpenModal(false);
    }, []);

    const handleSetActiveSale = useCallback((sale) => {
        let url = new URL(window.location.href);
        if (!url.searchParams.has("sale_id")) {
            url.searchParams.append("sale_id", sale.saleID);
            window.history.pushState({}, "", url.href);
        }
        setSaleOpenModal(true);
        setActiveSale(sale);
    }, []);

    return {
        activeSale,
        saleOpenModal,
        handleCloseSaleModal,
        handleSetActiveSale,
    };
};

export default useActiveSale;
