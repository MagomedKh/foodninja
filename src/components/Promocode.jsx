import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { addPromocode, removePromocode } from "../redux/actions/cart";
import axios from "axios";
import LoadingButton from "@mui/lab/LoadingButton";
import {
    Alert,
    AlertTitle,
    Collapse,
    IconButton,
    TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { _getDomain } from "./helpers.js";
import { updateAlerts } from "../redux/actions/systemAlerts";
import "../css/promocode.css";

export default function Promocode() {
    const dispatch = useDispatch();
    const {
        user,
        cartPromocode,
        cartProducts,
        userCartBonusProduct,
        canPromocodeWithBonus,
    } = useSelector(({ user, cart, config }) => {
        return {
            user: user.user,
            canPromocodeWithBonus: config.CONFIG_promocode_with_bonus_program,
            cartPromocode: cart.promocode,
            cartProducts: cart.items,
            cartTotal: cart.totalPrice,
            userCartBonusProduct: cart.bonusProduct,
        };
    });

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
            .post("https://" + _getDomain() + "/?rest-api=usePromocode", {
                promocode: promocode,
                cartProducts: cartProducts,
                token: user.token ? user.token : false,
                phone: user.phone ? user.phone : false,
            })
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
                    dispatch(addPromocode(resp.data.promocode));
                }
            });
    };
    const handleDisablePromocode = () => {
        dispatch(removePromocode());
        dispatch(
            updateAlerts({
                open: true,
                message: "Промокод отменен.",
            })
        );
        setPromocode("");
    };

    const alertProps = { severity: typeAlert };

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
                    value={promocode || ""}
                    disabled={
                        (cartPromocode.code !== undefined &&
                            cartPromocode.code) ||
                        (Object.keys(userCartBonusProduct).length &&
                            canPromocodeWithBonus !== "on")
                            ? true
                            : false
                    }
                />
                {cartPromocode.code !== undefined && cartPromocode.code ? (
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
                <Collapse sx={{ mt: 1 }} in={!!showAlertMessage}>
                    <Alert
                        {...alertProps}
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
                        sx={{ mb: 2 }}
                    >
                        {alertMessage}
                    </Alert>
                </Collapse>
            )}
        </div>
    );
}
