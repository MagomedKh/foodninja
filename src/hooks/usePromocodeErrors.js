import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { _checkPromocode } from "../components/helpers";

const usePromocodeErrors = (typeDelivery) => {
    const [promocodeErrors, setPromocodeErrors] = useState(null);

    const conditionalPromocode = useSelector(
        (state) => state.cart.conditionalPromocode
    );

    const items = useSelector((state) => state.cart.items);

    const categories = useSelector((state) => state.products.categories);

    const config = useSelector((state) => state.config.data);

    const cartTotal = useSelector((state) => state.cart.subTotalPrice);

    useEffect(() => {
        if (conditionalPromocode) {
            const resultCheckPromocode = _checkPromocode({
                promocode: conditionalPromocode,
                items,
                cartTotal,
                config,
                categories,
                typeDelivery,
            });
            setPromocodeErrors(resultCheckPromocode.errors);
        }
    }, [
        conditionalPromocode,
        items,
        cartTotal,
        config,
        categories,
        typeDelivery,
    ]);

    return promocodeErrors;
};

export default usePromocodeErrors;
