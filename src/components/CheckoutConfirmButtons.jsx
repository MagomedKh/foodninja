import React from "react";
import { useSelector } from "react-redux";
import { Alert, Button, Collapse, IconButton } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import PromocodeErrorsAlert from "./PromocodeErrorsAlert";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import CloseIcon from "@mui/icons-material/Close";

const CheckoutConfirmButtons = ({
    error,
    loading,
    activeGateway,
    typeDelivery,
    deliveryZone,
    yandexApiError,
    handleSetError,
    handleBackToMenu,
    handleMakeOrder,
    handleOpenBeforePaymentModal,
}) => {
    const config = useSelector((state) => state.config.data);
    const cartTotalPrice = useSelector((state) => state.cart.totalPrice);
    const promocode = useSelector((state) => state.cart.promocode);
    const conditionalPromocode = useSelector(
        (state) => state.cart.conditionalPromocode
    );
    const deliveryOrderLess =
        config.CONFIG_order_min_price &&
        typeDelivery === "delivery" &&
        config.deliveryZones.deliveryPriceType === "fixedPrice" &&
        cartTotalPrice < config.CONFIG_order_min_price;
    const selfDeliveryOrderLess =
        config.CONFIG_selforder_min_price &&
        typeDelivery === "self" &&
        cartTotalPrice < config.CONFIG_selforder_min_price;

    return (
        <>
            <div className="checkout--errors-container">
                {error && (
                    <Alert
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    handleSetError("");
                                }}
                            >
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                        severity="error"
                        sx={{ mb: 1 }}
                    >
                        {error}
                    </Alert>
                )}

                <Collapse
                    sx={{ mb: 1 }}
                    in={selfDeliveryOrderLess}
                    unmountOnExit
                >
                    <Alert severity="error">
                        Минимальная сумма заказа на самовывоз{" "}
                        <span style={{ whiteSpace: "nowrap" }}>
                            {config.CONFIG_selforder_min_price} ₽
                        </span>
                    </Alert>
                </Collapse>

                <Collapse sx={{ mb: 1 }} in={deliveryOrderLess} unmountOnExit>
                    <Alert severity="error">
                        Минимальная сумма заказа на доставку{" "}
                        <span style={{ whiteSpace: "nowrap" }}>
                            {config.CONFIG_order_min_price} ₽
                        </span>
                    </Alert>
                </Collapse>

                <Collapse
                    sx={{ mb: 1 }}
                    in={
                        deliveryZone &&
                        deliveryZone.orderMinPrice > cartTotalPrice
                    }
                    unmountOnExit
                >
                    <Alert severity="error">
                        Сумма заказа меньше минимальной для доставки по
                        указанному адресу
                    </Alert>
                </Collapse>

                <Collapse
                    sx={{ mb: 1 }}
                    in={!promocode?.code && !!conditionalPromocode?.code}
                    unmountOnExit
                >
                    <PromocodeErrorsAlert
                        onlyMinPrice={true}
                        typeDelivery={typeDelivery}
                    />
                </Collapse>
            </div>

            <div className="checkout--button-container">
                <Button
                    className="btn--outline-dark"
                    variant="button"
                    onClick={handleBackToMenu}
                    sx={{ bgcolor: "#fff !important" }}
                >
                    Изменить заказ
                    <NavigateBeforeIcon className="button-prev-arrow-icon" />
                </Button>

                <LoadingButton
                    loading={loading}
                    variant="button"
                    className="btn--action makeOrder"
                    onClick={() => {
                        activeGateway !== "card" &&
                        activeGateway !== "cash" &&
                        config.CONFIG_order_text_before_payment
                            ? handleOpenBeforePaymentModal(true)
                            : handleMakeOrder();
                    }}
                    disabled={
                        conditionalPromocode ||
                        selfDeliveryOrderLess ||
                        deliveryOrderLess ||
                        (typeDelivery === "delivery" &&
                            config.deliveryZones.deliveryPriceType ===
                                "areaPrice" &&
                            yandexApiError) ||
                        (config.deliveryZones.deliveryPriceType ===
                            "areaPrice" &&
                            deliveryZone &&
                            deliveryZone.orderMinPrice > cartTotalPrice)
                    }
                >
                    Оформить заказ
                    <NavigateNextIcon className="button-arrow-icon" />
                </LoadingButton>
            </div>
        </>
    );
};

export default CheckoutConfirmButtons;
