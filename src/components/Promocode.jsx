import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    addPromocode,
    clearConditionalPromocode,
    removePromocode,
    setConditionalPromocode,
} from "../redux/actions/cart";
import axios from "axios";
import LoadingButton from "@mui/lab/LoadingButton";
import {
    Alert,
    AlertTitle,
    Collapse,
    IconButton,
    TextField,
    InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WarningIcon from "@mui/icons-material/Warning";
import CheckIcon from "@mui/icons-material/Check";
import { _checkPromocode, _getDomain, _getPlatform } from "./helpers.js";
import { updateAlerts } from "../redux/actions/systemAlerts";
import "../css/promocode.css";
import usePromocodeErrors from "../hooks/usePromocodeErrors";

export default function Promocode({ onCheckout = false }) {
    const dispatch = useDispatch();
    const {
        user,
        config,
        cartPromocode,
        conditionalPromocode,
        cartProducts,
        userCartBonusProduct,
        canPromocodeWithBonus,
        cartSubTotalPrice,
    } = useSelector(({ user, cart, config }) => {
        return {
            user: user.user,
            config: config.data,
            canPromocodeWithBonus: config.CONFIG_promocode_with_bonus_program,
            cartPromocode: cart.promocode,
            conditionalPromocode: cart.conditionalPromocode,
            cartProducts: cart.items,
            cartTotal: cart.totalPrice,
            cartSubTotalPrice: cart.subTotalPrice,
            userCartBonusProduct: cart.bonusProduct,
        };
    });

    const promocodeErrors = usePromocodeErrors();

    const [loading, setLoading] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState("");
    const [showAlertMessage, setShowAlertMessage] = React.useState("");
    const [typeAlert, setTypeAlert] = React.useState(false);
    const [promocode, setPromocode] = React.useState(
        cartPromocode ? cartPromocode.code : ""
    );

    const handleChangePromocode = (e) => {
        setPromocode(e.target.value);
    };
    const handleApplyPromocode = () => {
        setLoading(true);
        axios
            .post(
                "https://" +
                    _getDomain() +
                    "/?rest-api=getPromocode" +
                    "&platform=" +
                    _getPlatform(),
                {
                    promocode: promocode,
                    cartProducts: cartProducts,
                    token: user.token ? user.token : false,
                    phone: user.phone ? user.phone : false,
                }
            )
            .then((resp) => {
                setLoading(false);
                if (resp.data.status === "error") {
                    setTypeAlert("error");
                    setAlertMessage(resp.data.message);
                    setShowAlertMessage(true);
                } else {
                    setTypeAlert("success");
                    setAlertMessage("");
                    setShowAlertMessage(false);
                    const resultCheckPromocode = _checkPromocode({
                        promocode: resp.data.promocode,
                        items: cartProducts,
                        cartTotal: cartSubTotalPrice,
                        config,
                        isInitial: true,
                    });
                    if (resultCheckPromocode.status === "error") {
                        dispatch(setConditionalPromocode(resp.data.promocode));
                    } else {
                        dispatch(addPromocode(resp.data.promocode));
                        setTypeAlert("success");
                        setAlertMessage("");
                        setShowAlertMessage(false);
                    }
                }
            });
    };

    const handleDisablePromocode = () => {
        dispatch(removePromocode());
        dispatch(clearConditionalPromocode());
        dispatch(
            updateAlerts({
                open: true,
                message: "Промокод отменен.",
            })
        );
        setPromocode("");
    };

    return (
        <div className="promocode-wrapper">
            <div className="promocode--input-wrapper">
                <TextField
                    size="small"
                    id="promocode"
                    label="Промокод"
                    onInput={handleChangePromocode}
                    onKeyPress={(e) => {
                        if (e.key === "Enter") {
                            handleApplyPromocode();
                        }
                    }}
                    value={
                        promocode ||
                        cartPromocode?.code ||
                        conditionalPromocode?.code ||
                        ""
                    }
                    disabled={
                        (cartPromocode.code !== undefined &&
                            cartPromocode.code) ||
                        conditionalPromocode?.code ||
                        (Object.keys(userCartBonusProduct).length &&
                            canPromocodeWithBonus !== "on")
                            ? true
                            : false
                    }
                    InputProps={
                        conditionalPromocode?.code || cartPromocode.code
                            ? {
                                  startAdornment: (
                                      <InputAdornment position="start">
                                          {conditionalPromocode?.code ? (
                                              <WarningIcon color="error" />
                                          ) : cartPromocode.code ? (
                                              <CheckIcon color="success" />
                                          ) : null}
                                      </InputAdornment>
                                  ),
                              }
                            : {}
                    }
                />
                {(cartPromocode.code !== undefined && cartPromocode.code) ||
                conditionalPromocode?.code ? (
                    <LoadingButton
                        loading={loading}
                        size="small"
                        variant="button"
                        className="btn--action promocode-button"
                        onClick={handleDisablePromocode}
                    >
                        Отменить
                    </LoadingButton>
                ) : (
                    <LoadingButton
                        loading={loading}
                        size="small"
                        variant="button"
                        disabled={
                            Object.keys(userCartBonusProduct).length &&
                            canPromocodeWithBonus !== "on"
                                ? true
                                : false
                        }
                        className="btn--action promocode-button"
                        onClick={handleApplyPromocode}
                    >
                        Применить
                    </LoadingButton>
                )}
            </div>

            {!onCheckout &&
            !cartPromocode?.code &&
            conditionalPromocode?.code ? (
                <Alert severity="error" className="custom-alert" sx={{ mt: 2 }}>
                    Промокод «{conditionalPromocode?.code}» не применён:
                    {promocodeErrors?.length
                        ? promocodeErrors.map((error) => <div>{error}</div>)
                        : null}
                </Alert>
            ) : null}

            {Object.keys(userCartBonusProduct).length &&
            canPromocodeWithBonus !== "on" ? (
                <Alert severity="info" className="custom-alert" sx={{ mt: 2 }}>
                    Промокоды нельзя применять с подарками.
                </Alert>
            ) : (
                ""
            )}
            {cartPromocode.description !== undefined &&
                cartPromocode.description && (
                    <Collapse sx={{ mt: 1 }} in={true}>
                        <Alert severity="success">
                            <AlertTitle>Акция активирована!</AlertTitle>
                            {cartPromocode.description}
                        </Alert>
                    </Collapse>
                )}
            {alertMessage && (
                <Collapse
                    sx={{ mt: !!showAlertMessage ? 1 : 0 }}
                    in={!!showAlertMessage}
                >
                    <Alert
                        severity={typeAlert}
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    setShowAlertMessage(false);
                                }}
                            >
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                        sx={{ mb: onCheckout ? 0 : 2 }}
                    >
                        {alertMessage}
                    </Alert>
                </Collapse>
            )}
        </div>
    );
}
