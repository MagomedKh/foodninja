import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPromocode, removePromocode } from "../redux/actions/cart";
import { Link, useNavigate } from "react-router-dom";
import {
    Alert,
    Button,
    Container,
    Dialog,
    FormControlLabel,
    IconButton,
    Grid,
    MenuItem,
    Radio,
    RadioGroup,
    Switch,
    Select,
    Slider,
    Slide,
    TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LoadingButton from "@mui/lab/LoadingButton";
import { CheckoutProduct, Footer, Header } from "../components";
import { _checkPromocode, _declension } from "../components/helpers.js";
import { _isMobile, _getDomain } from "../components/helpers.js";
import axios from "axios";
import { clearCart, addBonusProductToCart } from "../redux/actions/cart";
import "../css/checkout.css";
import CheckoutFreeAddons from "../components/Product/CheckoutFreeAddons";
import { updateAlerts } from "../redux/actions/systemAlerts";
import PreorderForm from "../components/Product/PreorderForm";
import {
    getHours,
    getMinutes,
    set,
    setDayOfYear,
    addDays,
    format,
    getDay,
} from "date-fns";
const formatingStrPhone = (inputNumbersValue) => {
    var formattedPhone = "";
    if (["7", "8", "9"].indexOf(inputNumbersValue[0]) > -1) {
        if (inputNumbersValue[0] === "9")
            inputNumbersValue = "7" + inputNumbersValue;
        var firstSymbols = inputNumbersValue[0] === "8" ? "8" : "+7";
        formattedPhone = firstSymbols + " ";
        if (inputNumbersValue.length > 1) {
            formattedPhone += "(" + inputNumbersValue.substring(1, 4);
        }
        if (inputNumbersValue.length >= 5) {
            formattedPhone += ") " + inputNumbersValue.substring(4, 7);
        }
        if (inputNumbersValue.length >= 8) {
            formattedPhone += "-" + inputNumbersValue.substring(7, 9);
        }
        if (inputNumbersValue.length >= 10) {
            formattedPhone += "-" + inputNumbersValue.substring(9, 11);
        }
    } else {
        formattedPhone = "+" + inputNumbersValue.substring(0, 16);
    }
    return formattedPhone;
};

const getNumbersValue = function (input) {
    return input.replace(/\D/g, "");
};

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function Checkout() {
    const dispatch = useDispatch();
    const {
        user,
        config,
        cart,
        cartProducts,
        items,
        promocode,
        promocodeProducts,
        userCartBonusProduct,
        cartSubTotalPrice,
        cartTotalPrice,
        gateways,
    } = useSelector(({ user, config, cart, gateways, orderTime, products }) => {
        return {
            user: user.user,
            config: config.data,
            gateways: gateways.gateways,
            cart: cart,
            cartProducts: cart.items,
            items: products.items,
            promocode: cart.promocode,
            promocodeProducts: cart.promocodeProducts,
            userCartBonusProduct: cart.bonusProduct,
            cartTotalPrice: cart.totalPrice,
            cartSubTotalPrice: cart.subTotalPrice,
        };
    });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [validate, setValidate] = useState(true);
    const [error, setError] = useState(null);
    const [userName, setUserName] = useState(user.name ? user.name : "");
    const [userPhone, setUserPhone] = useState(
        user.phone ? formatingStrPhone(user.phone) : ""
    );
    const [typeDelivery, setTypeDelivery] = useState(
        config.CONFIG_order_receiving === "selfdelivery"
            ? "self"
            : promocode && promocode.typeDelivery === "self"
            ? "self"
            : "delivery"
    );
    const [deliveryAddress, setDeliveryAddress] = useState(
        user.addresses ? 0 : "new"
    );
    const [selfDeliveryAddress, setSelfDeliveryAddress] = useState("main");
    const [activeGateway, setActiveGateway] = useState("card");
    const [openAlert, setOpenAlert] = useState(false);
    const [preorderDate, setPreorderDate] = useState(null);
    const [preorderTime, setPreorderTime] = useState("");
    const [asSoonAsPosible, setAsSoonAsPosible] = useState(false);
    const [newUserAddressStreet, setNewUserAddressStreet] = useState("");
    const [newUserAddressHome, setNewUserAddressHome] = useState("");
    const [newUserAddressPorch, setNewUserAddressPorch] = useState("");
    const [newUserAddressFloor, setNewUserAddressFloor] = useState("");
    const [newUserAddressApartment, setNewUserAddressApartment] = useState("");
    const [commentOrder, setCommentOrder] = useState("");
    const [usedBonuses, setUsedBonuses] = useState(0);
    const [countUsers, setCountUsers] = useState(1);
    const [moneyBack, setMoneyBack] = useState("");
    const [dontRecall, setDontRecall] = useState(false);

    const handleAlertClose = () => {
        setOpenAlert(false);
    };

    useEffect(() => {
        if (config.CONFIG_work_status !== "closed") {
            handlePreorderDateChange("Как можно скорее");
        }
    }, [config.CONFIG_work_status]);

    useEffect(() => {
        if (config.CONFIG_free_products_program_status !== "on") {
            dispatch(addBonusProductToCart({}));
        }
    }, [config.CONFIG_free_products_program_status]);

    const handlePreorderDateChange = (date) => {
        if (date === "Как можно скорее") {
            setPreorderDate(new Date());
            setAsSoonAsPosible(date);
            return;
        } else {
            setAsSoonAsPosible(false);
        }
        if (preorderTime) {
            setPreorderDate(
                set(setDayOfYear(new Date(), date), {
                    hours: getHours(preorderTime),
                    minutes: getMinutes(preorderTime),
                    seconds: 0,
                    milliseconds: 0,
                })
            );
        }
        if (!preorderTime) {
            setPreorderDate(setDayOfYear(new Date(), date));
        }
    };

    const handlePreorderTimeChange = (time) => {
        setPreorderTime(time);
        if (time && preorderDate) {
            const updatedPreorderDate = set(preorderDate, {
                hours: getHours(new Date(time)),
                minutes: getMinutes(new Date(time)),
                seconds: 0,
                milliseconds: 0,
            });
            setPreorderDate(updatedPreorderDate);
        } else if (time) {
            const newPreorderDate = addDays(new Date(), 1);

            const updatedPreorderDate = set(newPreorderDate, {
                hours: getHours(new Date(time)),
                minutes: getMinutes(new Date(time)),
                seconds: 0,
                milliseconds: 0,
            });
            setPreorderDate(updatedPreorderDate);
        }
    };

    const handleChangeName = (e) => {
        setUserName(e.target.value);
    };

    const handleChooseSelfDeliveryAddress = (e, value) => {
        setSelfDeliveryAddress(value);
    };

    const handleChooseDeliveryAddress = (e, value) => {
        setDeliveryAddress(value);
    };

    const handleChangeNewUserAddress = (e) => {
        switch (e.target.id) {
            case "street":
                setNewUserAddressStreet(e.target.value);
                break;
            case "home":
                setNewUserAddressHome(e.target.value);
                break;
            case "porch":
                setNewUserAddressPorch(e.target.value);
                break;
            case "floor":
                setNewUserAddressFloor(e.target.value);
                break;
            case "apartment":
                setNewUserAddressApartment(e.target.value);
                break;
            default:
                break;
        }
    };
    const handleChangeCommentOrder = (e, value) => {
        setCommentOrder(e.target.value);
    };

    const handleSetActiveGateway = (e, value) => {
        setActiveGateway(value);
    };

    const handleChangeCountUsers = (e, value) => {
        setCountUsers(e.target.value);
    };

    const handleChangeMoneyBack = (e, value) => {
        setMoneyBack(e.target.value);
    };

    const handlePhonePaste = function (e) {
        var input = e.target,
            inputNumbersValue = getNumbersValue(input.value);
        var pasted = e.clipboardData || window.clipboardData;
        if (pasted) {
            var pastedText = pasted.getData("Text");
            if (/\D/g.test(pastedText)) {
                input.value = inputNumbersValue;
                return;
            }
        }
    };

    const handlePhoneInput = function (e) {
        var input = e.target,
            inputNumbersValue = getNumbersValue(input.value),
            selectionStart = input.selectionStart,
            formattedInputValue = "";
        if (!inputNumbersValue) {
            return (input.value = "");
        }
        if (input.value.length !== selectionStart) {
            if (e.data && /\D/g.test(e.data)) {
                input.value = inputNumbersValue;
            }
            return;
        }
        formattedInputValue = formatingStrPhone(inputNumbersValue);
        input.value = formattedInputValue;
        setUserPhone(formattedInputValue);
    };

    const handlePhoneKeyDown = function (e) {
        var inputValue = e.target.value.replace(/\D/g, "");
        if (e.keyCode === 8 && inputValue.length === 1) {
            e.target.value = "";
        }
    };

    const handleMakeOrder = () => {
        let currentValidation = true;
        setValidate(true);
        setError(null);

        if (!userName || getNumbersValue(userPhone).length !== 11) {
            currentValidation = false;
            setValidate(false);
            setError("Заполните все обязательные поля");
            return;
        }

        if (
            typeDelivery === "delivery" &&
            deliveryAddress === "new" &&
            (!newUserAddressStreet || !newUserAddressHome)
        ) {
            currentValidation = false;
            setValidate(false);
            setError("Заполните все обязательные поля");
            return;
        }

        if (!preorderDate || (!preorderTime && !asSoonAsPosible)) {
            currentValidation = false;
            setValidate(false);
            setError("Заполните все обязательные поля");
            return;
        }

        if (currentValidation) {
            console.log(userName);
            setLoading(true);
            axios
                .post("https://" + _getDomain() + "/?rest-api=makeOrder", {
                    name: userName,
                    phone: getNumbersValue(userPhone),
                    token: user.token,
                    typeDelivery: typeDelivery,
                    deliveryAddress: deliveryAddress,
                    selfDeliveryAddress: selfDeliveryAddress,
                    newUserAddressStreet: newUserAddressStreet,
                    newUserAddressHome: newUserAddressHome,
                    newUserAddressPorch: newUserAddressPorch,
                    newUserAddressFloor: newUserAddressFloor,
                    newUserAddressApartment: newUserAddressApartment,
                    orderTime: format(preorderDate, "dd.MM.yyyy HH:mm"),
                    commentOrder: commentOrder,
                    activeGateway: activeGateway,
                    countUsers: countUsers,
                    promocode: promocode.code,
                    promocodeProducts: promocodeProducts,
                    moneyBack: moneyBack,
                    products: cartProducts,
                    bonusProduct: userCartBonusProduct,
                    bonuses: usedBonuses,
                    dontRecall: dontRecall,
                })
                .then((resp) => {
                    setLoading(false);
                    if (resp.data.status === "success") {
                        dispatch(clearCart());
                        window.scrollTo(0, 0);
                        navigate("/order-complete", { replace: true });
                    } else if (resp.data.status === "need_payment") {
                        window.location.href = resp.data.redirect;
                        dispatch(clearCart());
                    } else {
                        // Всплывающй алерт
                        setError(resp.data.text);
                    }
                });
        }
    };

    const handleChangeTypeDelivery = (e, value) => {
        if (value === "self") {
            if (config.selfDeliveryCoupon && cart.discount) setOpenAlert(true);
            else {
                if (config.selfDeliveryCoupon)
                    dispatch(addPromocode(config.selfDeliveryCoupon));
                setTypeDelivery(value);
            }
        } else {
            if (
                config.selfDeliveryCoupon &&
                cart.promocode &&
                config.selfDeliveryCoupon.code === cart.promocode.code
            )
                dispatch(removePromocode());
            setTypeDelivery(value);
        }
    };

    if (
        config.selfDeliveryCoupon &&
        cart.promocode &&
        config.selfDeliveryCoupon.code === cart.promocode.code &&
        typeDelivery !== "self"
    )
        setTypeDelivery("self");

    const renderTypeOrdering = () => {
        if (typeof config.CONFIG_order_receiving !== "undefined") {
            switch (config.CONFIG_order_receiving) {
                case "delivery":
                    return (
                        <RadioGroup
                            row
                            value="delivery"
                            aria-labelledby="typeDelivery-label"
                            name="typeDelivery"
                        >
                            <FormControlLabel
                                className="custom-radio"
                                value="delivery"
                                control={<Radio />}
                                label="Доставка"
                            />
                        </RadioGroup>
                    );
                case "selfdelivery": {
                    return (
                        <RadioGroup
                            row
                            value="self"
                            aria-labelledby="typeDelivery-label"
                            name="typeDelivery"
                        >
                            <FormControlLabel
                                className="custom-radio"
                                value="self"
                                control={<Radio />}
                                label="Самовывоз"
                            />
                        </RadioGroup>
                    );
                }
                case "both": {
                    const selfDeliveryLabel = config.selfDeliveryCoupon
                        ? "Самовывоз (Скидка -" +
                          config.selfDeliveryCoupon.amount +
                          "%)"
                        : "Самовывоз";
                    return (
                        <div>
                            <ModalAlert />
                            <RadioGroup
                                row
                                value={typeDelivery}
                                aria-labelledby="typeDelivery-label"
                                name="typeDelivery"
                                onChange={handleChangeTypeDelivery}
                            >
                                <FormControlLabel
                                    className="custom-radio"
                                    value="delivery"
                                    control={<Radio />}
                                    label="Доставка"
                                />
                                <FormControlLabel
                                    className="custom-radio"
                                    value="self"
                                    control={<Radio />}
                                    label={selfDeliveryLabel}
                                />
                            </RadioGroup>
                        </div>
                    );
                }
                default:
                    return;
            }
        } else return;
    };

    let dialogAlertProps = { open: openAlert };
    if (_isMobile()) {
        dialogAlertProps.TransitionComponent = Transition;
        dialogAlertProps.fullScreen = true;
    }
    const ModalAlert = () => {
        return (
            <Dialog
                maxWidth="md"
                className="selfelivery-promocode-alert"
                open={openAlert}
            >
                <div className="modal-alert--wrapper">
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleAlertClose}
                        aria-label="close"
                        className="modal-close"
                    >
                        <CloseIcon />
                    </IconButton>
                    <h2 className="modal-alert--title">Внимание</h2>
                    <div className="modal-alert--inner">
                        <p>Скидка на самовывоз отменит ваш текущий промокод.</p>

                        <div className="modal-alert--buttons">
                            <Button
                                variant="button"
                                className="btn--action"
                                onClick={handleConfirmSelfDeliveryPromocode}
                            >
                                Я согласен
                            </Button>
                            <Button
                                variant="button"
                                className="btn--outline-dark"
                                onClick={handleAlertClose}
                            >
                                Отмена
                            </Button>
                        </div>
                    </div>
                </div>
            </Dialog>
        );
    };
    const handleConfirmSelfDeliveryPromocode = () => {
        handleAlertClose();
        dispatch(addPromocode(config.selfDeliveryCoupon));
        setTypeDelivery("self");
    };

    const handleChangeCheckoutBonus = (e, value) => {
        setUsedBonuses(value);
    };

    const handleBackToMenu = useCallback(() => {
        window.scrollTo(0, 0);
        navigate("/", { replace: true });
    }, [navigate]);

    if (
        Object.keys(promocode).length !== 0 &&
        promocode.constructor === Object
    ) {
        if (
            config.selfDeliveryCoupon.code !== undefined &&
            promocode.code === config.selfDeliveryCoupon.code
        ) {
            dispatch(removePromocode());
        } else {
            const resultCheckPromocode = _checkPromocode(
                promocode,
                cartProducts,
                cartSubTotalPrice,
                config
            );
            if (resultCheckPromocode.status === "error") {
                dispatch(removePromocode());
                dispatch(
                    updateAlerts({
                        open: true,
                        message: resultCheckPromocode.message,
                    })
                );
            }
        }
    }

    const userNameProps = {
        error: !userName && !validate ? true : false,
        helperText:
            !userName && !validate
                ? "Поле обязательно для заполнения"
                : "Как к вам обращаться?",
    };
    const userPhoneProps = {
        error:
            getNumbersValue(userPhone).length !== 11 && !validate
                ? true
                : false,
        helperText:
            getNumbersValue(userPhone).length !== 11 && !validate
                ? "Номер указан неверно"
                : "С вами свяжется оператор для уточнения заказа",
    };
    const streetProps = {
        error:
            !newUserAddressStreet && deliveryAddress === "new" && !validate
                ? true
                : false,
        helperText:
            !newUserAddressStreet && deliveryAddress === "new" && !validate
                ? "Поле обязательно для заполнения"
                : "",
    };
    const homeProps = {
        error:
            !newUserAddressHome && deliveryAddress === "new" && !validate
                ? true
                : false,
        helperText:
            !newUserAddressHome && deliveryAddress === "new" && !validate
                ? "Поле обязательно для заполнения"
                : "",
    };

    const preorderFormProps = {
        error:
            !validate && (!preorderDate || (!preorderTime && !asSoonAsPosible)),

        helperText: !validate ? "Выберите дату и время" : "",
    };

    if (typeof user.addresses !== "undefined" && user.addresses.length) {
        user.addresses.map((address, index) => {
            let formateAddress = address.street + ", д. " + address.home;
            formateAddress += address.porch ? ", под. " + address.porch : "";
            formateAddress += address.floor ? ", этаж " + address.floor : "";
            formateAddress += address.apartment
                ? ", кв. " + address.apartment
                : "";
            user.addresses[index].formate = formateAddress;
        });
    }

    let maxBonuses =
        user.bonuses >=
        parseInt(
            (cartTotalPrice / 100) * config.CONFIG_bonus_program_order_limit
        )
            ? parseInt(
                  (cartTotalPrice / 100) *
                      config.CONFIG_bonus_program_order_limit
              )
            : user.bonuses;
    if (
        config.CONFIG_order_min_price !== undefined &&
        config.CONFIG_order_min_price > 0
    )
        if (cartTotalPrice - maxBonuses < config.CONFIG_order_min_price) {
            maxBonuses = cartTotalPrice - config.CONFIG_order_min_price;
            if (maxBonuses < 0) maxBonuses = 0;
        }

    const currentDayOfWeek =
        getDay(new Date()) === 0 ? 6 : getDay(new Date()) - 1;
    const renderFilialLabel = (filial) => {
        return (
            <div>
                <span>{filial.address}</span>
                {
                    // Если у филиала свой график работы
                    filial.workingTime ? (
                        filial.workingTime[currentDayOfWeek][0] &&
                        filial.workingTime[currentDayOfWeek][1] ? (
                            <div className="adress-schdedule">
                                <span>Сегодня с</span>{" "}
                                {filial.workingTime[currentDayOfWeek][0]} до{" "}
                                {filial.workingTime[currentDayOfWeek][1]}
                            </div>
                        ) : (
                            <div>
                                <span>Сегодня закрыто</span>
                            </div>
                        )
                    ) : // Если график работы филиала совпадает с основным
                    config.CONFIG_format_start_work &&
                      config.CONFIG_format_end_work ? (
                        <div className="adress-schdedule">
                            <span>Сегодня с</span>{" "}
                            {config.CONFIG_format_start_work} до{" "}
                            {config.CONFIG_format_end_work}
                        </div>
                    ) : (
                        <div>
                            <span>Сегодня закрыто</span>
                        </div>
                    )
                }
            </div>
        );
    };
    return (
        <>
            <Header />
            <Container className="checkout checkout-wrapper">
                <h1>Оформление заказа</h1>
                <Grid container spacing={5}>
                    <Grid item sm={12} md={7}>
                        <div className="checkout--user">
                            <Grid container spacing={4}>
                                <Grid item sm={12} md={6} sx={{ width: 1 }}>
                                    <div className="checkout--user-name">
                                        <TextField
                                            size="small"
                                            id="userName"
                                            label="Ваше имя"
                                            onInput={handleChangeName}
                                            value={userName}
                                            sx={{ width: 1 }}
                                            {...userNameProps}
                                        />
                                    </div>
                                </Grid>
                                <Grid item sm={12} md={6} sx={{ width: 1 }}>
                                    <div className="checkout--user-phone">
                                        <TextField
                                            size="small"
                                            id="userPhone"
                                            label="Номер телефона"
                                            onKeyDown={handlePhoneKeyDown}
                                            onInput={handlePhoneInput}
                                            onPaste={handlePhonePaste}
                                            value={userPhone}
                                            sx={{ width: 1 }}
                                            {...userPhoneProps}
                                        />
                                    </div>
                                </Grid>
                            </Grid>
                        </div>

                        <div className="checkout--type-delivery">
                            <div className="checkout--choose-type-panel">
                                <h3>Как хотите получить заказ?</h3>
                                <p>Выберите удобный для вас способ.</p>
                                {renderTypeOrdering()}
                            </div>

                            {typeDelivery === "delivery" ? (
                                <div className="checkout--address-panel">
                                    <h4>Укажите адрес</h4>

                                    {config.CONFIG_delivery_info_text !==
                                        undefined &&
                                        config.CONFIG_delivery_info_text && (
                                            <Alert
                                                severity="info"
                                                sx={{ mt: 2, mb: 2 }}
                                            >
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: config.CONFIG_delivery_info_text,
                                                    }}
                                                ></div>
                                            </Alert>
                                        )}

                                    <RadioGroup
                                        value={deliveryAddress}
                                        aria-labelledby="deliveryAddress-label"
                                        name="deliveryAddress"
                                        onChange={handleChooseDeliveryAddress}
                                    >
                                        {user.addresses &&
                                            Object.values(user.addresses).map(
                                                (address, index) => (
                                                    <FormControlLabel
                                                        key={index}
                                                        className="custom-radio"
                                                        value={index}
                                                        control={
                                                            <Radio size="small" />
                                                        }
                                                        label={address.formate}
                                                    />
                                                )
                                            )}
                                        <FormControlLabel
                                            className="custom-radio new-address"
                                            value="new"
                                            control={<Radio size="small" />}
                                            label="Новый адрес"
                                        />
                                    </RadioGroup>

                                    {deliveryAddress === "new" && (
                                        <div className="checkout--form-new-address">
                                            <Grid container spacing={2}>
                                                <Grid
                                                    item
                                                    xs={8}
                                                    md={6}
                                                    sx={{ width: 1 }}
                                                >
                                                    <TextField
                                                        size="small"
                                                        id="street"
                                                        label="Улица"
                                                        value={
                                                            newUserAddressStreet
                                                        }
                                                        onChange={
                                                            handleChangeNewUserAddress
                                                        }
                                                        sx={{ width: 1 }}
                                                        {...streetProps}
                                                    />
                                                </Grid>
                                                <Grid
                                                    item
                                                    xs={4}
                                                    md={6}
                                                    sx={{ width: 1 }}
                                                >
                                                    <TextField
                                                        size="small"
                                                        id="home"
                                                        label="Дом"
                                                        value={
                                                            newUserAddressHome
                                                        }
                                                        onChange={
                                                            handleChangeNewUserAddress
                                                        }
                                                        sx={{ width: 1 }}
                                                        {...homeProps}
                                                    />
                                                </Grid>
                                                {config.CONFIG_checkout_hide_porch ===
                                                "yes" ? null : (
                                                    <Grid item xs={4} md={4}>
                                                        <TextField
                                                            size="small"
                                                            id="porch"
                                                            label="Подъезд"
                                                            value={
                                                                newUserAddressPorch
                                                            }
                                                            onChange={
                                                                handleChangeNewUserAddress
                                                            }
                                                            sx={{ width: 1 }}
                                                        />
                                                    </Grid>
                                                )}
                                                {config.CONFIG_checkout_hide_floor ===
                                                "yes" ? null : (
                                                    <Grid item xs={4} md={4}>
                                                        <TextField
                                                            size="small"
                                                            id="floor"
                                                            label="Этаж"
                                                            value={
                                                                newUserAddressFloor
                                                            }
                                                            onChange={
                                                                handleChangeNewUserAddress
                                                            }
                                                            sx={{ width: 1 }}
                                                        />
                                                    </Grid>
                                                )}
                                                {config.CONFIG_checkout_hide_apartment ===
                                                "yes" ? null : (
                                                    <Grid item xs={4} md={4}>
                                                        <TextField
                                                            size="small"
                                                            id="apartment"
                                                            label="Кв./Офис"
                                                            value={
                                                                newUserAddressApartment
                                                            }
                                                            onChange={
                                                                handleChangeNewUserAddress
                                                            }
                                                            sx={{ width: 1 }}
                                                        />
                                                    </Grid>
                                                )}
                                            </Grid>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                typeDelivery === "self" && (
                                    <div className="checkout--self-address-panel">
                                        <h4>Выберите адрес</h4>
                                        <RadioGroup
                                            value={selfDeliveryAddress}
                                            aria-labelledby="selfDeliveryAddress-label"
                                            name="selfDeliveryAddress"
                                            onChange={
                                                handleChooseSelfDeliveryAddress
                                            }
                                            sx={{ mb: 2 }}
                                        >
                                            <FormControlLabel
                                                className="custom-radio"
                                                value="main"
                                                control={<Radio size="small" />}
                                                label={
                                                    <div>
                                                        <span>
                                                            {
                                                                config.CONFIG_address
                                                            }
                                                        </span>
                                                        {config.CONFIG_format_start_work &&
                                                        config.CONFIG_format_end_work ? (
                                                            <div>
                                                                <div className="adress-schdedule">
                                                                    <span>
                                                                        Сегодня
                                                                        с
                                                                    </span>{" "}
                                                                    {
                                                                        config.CONFIG_format_start_work
                                                                    }{" "}
                                                                    до{" "}
                                                                    {
                                                                        config.CONFIG_format_end_work
                                                                    }
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <span>
                                                                    Сегодня
                                                                    закрыто
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                }
                                            />
                                            {config.CONFIG_filials &&
                                                config.CONFIG_filials.map(
                                                    (filial, index) => (
                                                        <FormControlLabel
                                                            key={index}
                                                            className="custom-radio"
                                                            value={index}
                                                            control={
                                                                <Radio size="small" />
                                                            }
                                                            label={renderFilialLabel(
                                                                filial
                                                            )}
                                                        />
                                                    )
                                                )}
                                        </RadioGroup>
                                    </div>
                                )
                            )}
                        </div>

                        <div className="checkout--order-time">
                            <h3>Когда приготовить заказ?</h3>

                            <PreorderForm
                                preorderDate={preorderDate}
                                preorderTime={preorderTime}
                                handlePreorderDateChange={
                                    handlePreorderDateChange
                                }
                                handlePreorderTimeChange={
                                    handlePreorderTimeChange
                                }
                                asSoonAsPosible={asSoonAsPosible}
                                {...preorderFormProps}
                            />
                        </div>

                        <div className="checkout--comment-order">
                            <h3>Комментарий к заказу</h3>
                            <TextField
                                id="commentOrder"
                                label="Введите пожелание к заказу"
                                multiline
                                maxRows={8}
                                value={commentOrder}
                                onInput={handleChangeCommentOrder}
                                sx={{ width: 1 }}
                            />
                        </div>
                    </Grid>

                    <Grid item sm={12} md={5} sx={{ width: 1 }}>
                        <div className="checkout--total-panel">
                            <h3 className="checkout--total-panel--title">
                                Ваш заказ{" "}
                                <Link onClick={handleBackToMenu} to={"/"}>
                                    Изменить
                                </Link>
                            </h3>

                            <div className="checkout--products">
                                {/* { Object.keys(cartProducts).map( (key, index) => 
								<CheckoutProduct key={cartProducts[key].items[0].id} productCart={cartProducts[key].items[0]} productCount={cartProducts[key].items.length} productTotalPrice={cartProducts[key].totalPrice} />
							) } */}

                                {Object.keys(cartProducts).map((key, index) =>
                                    items[key] &&
                                    items[key].type !== undefined &&
                                    items[key].type === "variations" ? (
                                        cartProducts[key].items.map(
                                            (
                                                keyVariantProduct,
                                                indexVariantProduct
                                            ) => (
                                                <CheckoutProduct
                                                    key={indexVariantProduct}
                                                    productIndex={
                                                        indexVariantProduct
                                                    }
                                                    productCart={
                                                        cartProducts[key].items[
                                                            indexVariantProduct
                                                        ]
                                                    }
                                                    productCount={1}
                                                    productTotalPrice={
                                                        cartProducts[key].items[
                                                            indexVariantProduct
                                                        ].options._price
                                                    }
                                                />
                                            )
                                        )
                                    ) : (
                                        <CheckoutProduct
                                            key={cartProducts[key].items[0].id}
                                            productIndex={0}
                                            productCart={
                                                cartProducts[key].items[0]
                                            }
                                            productCount={
                                                cartProducts[key].items.length
                                            }
                                            productTotalPrice={
                                                cartProducts[key].totalPrice
                                            }
                                        />
                                    )
                                )}

                                {/* { Object.keys(promocodeProducts).map( (key, index) => items[key] !== undefined &&
                                <PromocodeCheckoutProduct productCart={promocodeProducts[key]} productCount="1" productTotalPrice={promocodeProducts[key].options._price-promocode.amount} />
                             ) } */}

                                {userCartBonusProduct.id && (
                                    <CheckoutProduct
                                        productCart={userCartBonusProduct}
                                        productCount={1}
                                        productTotalPrice={0}
                                    />
                                )}

                                <CheckoutFreeAddons />
                            </div>

                            <hr className="checkout--total-panel--separator" />

                            {cart.discount ? (
                                <div>
                                    <div className="checkout--subtotal-price">
                                        <div className="price">
                                            Сумма заказа:{" "}
                                            <span className="money">
                                                {cart.subTotalPrice.toLocaleString(
                                                    "ru-RU"
                                                )}{" "}
                                                &#8381;
                                            </span>
                                        </div>
                                        <div className="promocode">
                                            <span>
                                                Промокод{" "}
                                                <span className="main-color">
                                                    {promocode.code}
                                                </span>
                                                :{" "}
                                            </span>

                                            {promocode.type === "percent" ? (
                                                <span className="money main-color">
                                                    -{promocode.amount}%
                                                </span>
                                            ) : (
                                                <span className="money main-color">
                                                    -
                                                    {cart.discount.toLocaleString(
                                                        "ru-RU"
                                                    )}{" "}
                                                    &#8381;
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <hr className="checkout--total-panel--separator" />
                                </div>
                            ) : (
                                ""
                            )}

                            <div className="checkout--total-panel--result">
                                <span className="price-title">Итого</span>
                                <span className="money">
                                    {(
                                        cartTotalPrice - usedBonuses
                                    ).toLocaleString("ru-RU")}{" "}
                                    &#8381;
                                </span>
                            </div>

                            {config.CONFIG_bonuses_program_status === "on" && (
                                <div className="checkout--user-bonuses">
                                    <div className="checkout--user-bonuses-info">
                                        У вас{" "}
                                        <span className="main-color">{`${
                                            user.bonuses
                                        } ${_declension(user.bonuses, [
                                            "бонус",
                                            "бонуса",
                                            "бонусов",
                                        ])}`}</span>
                                    </div>

                                    <Slider
                                        onChange={handleChangeCheckoutBonus}
                                        defaultValue={0}
                                        aria-label="Default"
                                        valueLabelDisplay="auto"
                                        min={0}
                                        max={maxBonuses}
                                    />

                                    <div className="checkout--bonuses-payming">
                                        <span className="title">
                                            Оплата бонусами
                                        </span>
                                        <span className="bonuses-price">
                                            <span className="money">
                                                {usedBonuses.toLocaleString(
                                                    "ru-RU"
                                                )}
                                            </span>{" "}
                                            &#8381;
                                        </span>
                                    </div>

                                    <small>
                                        Бонусами можно оплатить до{" "}
                                        <span className="main-color">
                                            {
                                                config.CONFIG_bonus_program_order_limit
                                            }
                                            %
                                        </span>{" "}
                                        от общей суммы заказа.
                                    </small>
                                    {config.CONFIG_order_min_price !==
                                        undefined &&
                                        config.CONFIG_order_min_price > 0 && (
                                            <div>
                                                <small>
                                                    Минимальная сумма заказа{" "}
                                                    <b className="main-color">
                                                        {
                                                            config.CONFIG_order_min_price
                                                        }{" "}
                                                        ₽
                                                    </b>
                                                    .
                                                </small>
                                            </div>
                                        )}
                                </div>
                            )}

                            <hr className="checkout--total-panel--separator" />

                            {gateways && (
                                <div className="checkout--gateways">
                                    <h4>Способ оплаты</h4>

                                    <RadioGroup
                                        defaultValue={activeGateway}
                                        aria-labelledby="activeGateway-label"
                                        name="activeGateway"
                                        onChange={handleSetActiveGateway}
                                        sx={{ mb: 2 }}
                                    >
                                        {gateways.map((key, index) => (
                                            <FormControlLabel
                                                key={index}
                                                className="custom-radio"
                                                value={key.id}
                                                control={<Radio size="small" />}
                                                label={key.title}
                                            />
                                        ))}
                                    </RadioGroup>

                                    <Grid container spacing={4}>
                                        {config.CONFIG_checkout_hide_count_person ===
                                        "yes" ? null : (
                                            <Grid
                                                item
                                                sm={12}
                                                md={6}
                                                sx={{ width: 1 }}
                                            >
                                                {config.CONFIG_checkout_count_person_name ? (
                                                    <b>
                                                        {
                                                            config.CONFIG_checkout_count_person_name
                                                        }
                                                    </b>
                                                ) : (
                                                    <b>Количество персон</b>
                                                )}
                                                <Select
                                                    id="count_peoples"
                                                    value={countUsers}
                                                    sx={{ width: 1, mt: 0.5 }}
                                                    size="small"
                                                    onChange={
                                                        handleChangeCountUsers
                                                    }
                                                >
                                                    <MenuItem value={1}>
                                                        1
                                                    </MenuItem>
                                                    <MenuItem value={2}>
                                                        2
                                                    </MenuItem>
                                                    <MenuItem value={3}>
                                                        3
                                                    </MenuItem>
                                                    <MenuItem value={4}>
                                                        4
                                                    </MenuItem>
                                                    <MenuItem value={5}>
                                                        5
                                                    </MenuItem>
                                                    <MenuItem value={6}>
                                                        6
                                                    </MenuItem>
                                                    <MenuItem value={7}>
                                                        7
                                                    </MenuItem>
                                                    <MenuItem value={8}>
                                                        8
                                                    </MenuItem>
                                                    <MenuItem value={9}>
                                                        9
                                                    </MenuItem>
                                                    <MenuItem value={10}>
                                                        10
                                                    </MenuItem>
                                                </Select>
                                            </Grid>
                                        )}

                                        {activeGateway === "cash" && (
                                            <Grid
                                                item
                                                sm={12}
                                                md={6}
                                                sx={{ width: 1 }}
                                            >
                                                <b>Приготовить сдачу с</b>
                                                <TextField
                                                    size="small"
                                                    id="money_back"
                                                    value={moneyBack}
                                                    type="number"
                                                    onChange={
                                                        handleChangeMoneyBack
                                                    }
                                                    sx={{ width: 1, mt: 0.5 }}
                                                />
                                            </Grid>
                                        )}
                                    </Grid>
                                </div>
                            )}

                            {config.CONFIG_checkout_dont_recall === "on" ? (
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={dontRecall}
                                            onChange={() =>
                                                setDontRecall(!dontRecall)
                                            }
                                            name="gilad"
                                        />
                                    }
                                    label="Не перезванивайте мне"
                                />
                            ) : null}

                            {error && (
                                <Alert
                                    action={
                                        <IconButton
                                            aria-label="close"
                                            color="inherit"
                                            size="small"
                                            onClick={() => {
                                                setError("");
                                            }}
                                        >
                                            <CloseIcon fontSize="inherit" />
                                        </IconButton>
                                    }
                                    severity="error"
                                    sx={{ mt: 2 }}
                                >
                                    {error}
                                </Alert>
                            )}

                            <LoadingButton
                                loading={loading}
                                sx={{ width: 1, mt: 1.5 }}
                                variant="button"
                                className="btn--action makeOrder"
                                onClick={handleMakeOrder}
                            >
                                Подтвердить заказ
                            </LoadingButton>
                        </div>
                    </Grid>
                </Grid>

                <div className=""></div>
            </Container>
            <Footer />
        </>
    );
}
