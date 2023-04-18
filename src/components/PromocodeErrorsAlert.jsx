import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Alert } from "@mui/material";
import usePromocodeErrors from "../hooks/usePromocodeErrors";

const PromocodeErrorsAlert = ({
    ignoreMinPrice = false,
    onlyMinPrice = false,
    typeDelivery,
}) => {
    const conditionalPromocode = useSelector(
        (state) => state.cart.conditionalPromocode
    );

    const cartPromocode = useSelector((state) => state.cart.promocode);

    const promocodeErrors = usePromocodeErrors(typeDelivery);

    if (!promocodeErrors) {
        return null;
    }

    const errorMessages = promocodeErrors
        .map((error) => {
            if (onlyMinPrice) {
                if (error.code === "minPrice") {
                    return error.message;
                } else {
                    return null;
                }
            } else if (ignoreMinPrice) {
                if (error.code === "minPrice") {
                    return null;
                } else {
                    return error.message;
                }
            } else {
                return error.message;
            }
        })
        .filter((el) => el);

    if (
        !errorMessages.length ||
        cartPromocode?.code ||
        !conditionalPromocode?.code
    ) {
        return null;
    }

    return (
        <Alert severity="error" sx={{ mt: 2 }}>
            Промокод «{conditionalPromocode?.code}» не применён:
            {errorMessages.map((error) => (
                <div>{error}</div>
            ))}
        </Alert>
    );
};

export default PromocodeErrorsAlert;
