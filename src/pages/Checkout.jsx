import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
    addPromocode,
    removePromocode,
    addBonusProductToCart,
    setConditionalPromocode,
    clearConditionalPromocode,
} from "../redux/actions/cart";
import { updateAlerts } from "../redux/actions/systemAlerts";
import {
    setDeliveryZone,
    setOpenDeliveryModal,
} from "../redux/actions/deliveryAddressModal";
import { saveAddresses } from "../redux/actions/user";
import { getItemTotalPrice } from "../redux/reducers/cart";
import { Link, useNavigate } from "react-router-dom";
import { YMaps } from "react-yandex-maps";
import {
    Alert,
    Button,
    Container,
    Collapse,
    Dialog,
    Divider,
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
    ToggleButtonGroup,
    ToggleButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import LoadingButton from "@mui/lab/LoadingButton";
import {
    BeforePaymentModal,
    CheckoutProduct,
    Footer,
    Header,
    DeliveryAddressModal,
    UserAddressesList,
    Promocode,
    PromocodeErrorsAlert,
    BootstrapTooltip,
} from "../components";
import {
    _checkPromocode,
    _declension,
    _isMobile,
    _getDomain,
    _getPlatform,
} from "../components/helpers.js";
import CheckoutFreeAddons from "../components/Product/CheckoutFreeAddons";
import PreorderForm from "../components/Product/PreorderForm";
import {
    getHours,
    getMinutes,
    set,
    setDayOfYear,
    addDays,
    format,
    getDay,
    isAfter,
} from "date-fns";
import wallet from "../img/wallet.svg";
import creditCard from "../img/credit-card.svg";
import onlineCreditCard from "../img/online-credit-card.svg";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import "../css/checkout.css";
import useAutoDiscount from "../hooks/useAutoDiscount";

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
        categories,
        promocode,
        conditionalPromocode,
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
            categories: products.categories,
            promocode: cart.promocode,
            conditionalPromocode: cart.conditionalPromocode,
            promocodeProducts: cart.promocodeProducts,
            userCartBonusProduct: cart.bonusProduct,
            cartTotalPrice: cart.totalPrice,
            cartSubTotalPrice: cart.subTotalPrice,
        };
    });
    const { deliveryZone } = useSelector(
        (state) => state.deliveryAddressModal,
        shallowEqual
    );

    const navigate = useNavigate();
    const stickedTotalPanel = useRef();
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
    const [deliveryAddress, setDeliveryAddress] = useState(null);
    const [selfDeliveryAddress, setSelfDeliveryAddress] = useState("main");
    const [activeGateway, setActiveGateway] = useState(gateways[0].id);
    const [openAlert, setOpenAlert] = useState(false);
    const [preorderDate, setPreorderDate] = useState(null);
    const [preorderTime, setPreorderTime] = useState("");
    const [asSoonAsPosible, setAsSoonAsPosible] = useState(false);
    const [newUserAddressArea, setNewUserAddressArea] = useState("");
    const [newUserAddressStreet, setNewUserAddressStreet] = useState("");
    const [newUserAddressHome, setNewUserAddressHome] = useState("");
    const [newUserAddressPorch, setNewUserAddressPorch] = useState("");
    const [newUserAddressFloor, setNewUserAddressFloor] = useState("");
    const [newUserAddressApartment, setNewUserAddressApartment] = useState("");
    const [newUserAddressCoordinates, setNewUserAddressCoordinates] =
        useState("");
    const [commentOrder, setCommentOrder] = useState("");
    const [usedBonuses, setUsedBonuses] = useState(0);
    const [countUsers, setCountUsers] = useState(1);
    const [moneyBack, setMoneyBack] = useState("");
    const [dontRecall, setDontRecall] = useState(false);
    const [sticked, setSticked] = useState(false);
    const [openBeforePaymentModal, setOpenBeforePaymentModal] = useState(false);
    const [yandexApiError, setYandexApiError] = useState(false);
    const [choosenAddress, setChoosenAddress] = useState(null);

    const { autoDiscountAmount, autoDiscount } = useAutoDiscount(typeDelivery);

    const handleAlertClose = () => {
        setOpenAlert(false);
    };

    useEffect(() => {
        if (config.CONFIG_free_products_program_status !== "on") {
            dispatch(addBonusProductToCart({}));
        }
    }, [config.CONFIG_free_products_program_status]);

    useEffect(() => {
        if (typeDelivery === "delivery") {
            if (user.addresses && user.addresses.length) {
                if (
                    config.deliveryZones.deliveryPriceType === "areaPrice" &&
                    !yandexApiError
                ) {
                    const addressWithCoordinates = user.addresses.findIndex(
                        (el) => el.coordinates
                    );
                    if (addressWithCoordinates >= 0) {
                        setDeliveryAddress(addressWithCoordinates);
                        setChoosenAddress(
                            user.addresses[addressWithCoordinates]
                        );
                    } else {
                        setDeliveryAddress("new");
                    }
                } else {
                    setDeliveryAddress(0);
                }
            } else {
                setDeliveryAddress("new");
            }
        }
    }, [typeDelivery]);

    // Блокируем предзаказ на все даты если в корзине есть товар с ограничением по вермени/дням недели
    const limitedCategories = categories.filter(
        (category) => category.useTimeLimit
    );
    const limitedCategoriesInCart = limitedCategories.filter((category) =>
        Object.values(cartProducts).find((product) => {
            if (promocode?.promocodeProducts?.id === product.items[0].id) {
                return false;
            }
            return product.items[0].categories.includes(category.term_id);
        })
    );
    const limitedCategoriesNames =
        limitedCategoriesInCart.length &&
        limitedCategoriesInCart
            .map((category) => `«${category.name}»`)
            .join(", ");

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

    const handleChooseDeliveryAddress = (e, index) => {
        setDeliveryAddress(index);
        setChoosenAddress(user.addresses[index]);
    };

    const onYandexApiError = () => {
        setYandexApiError(true);
        dispatch(setDeliveryZone(null));
    };

    const getOrderDeliveryPrice = () => {
        if (typeDelivery === "delivery") {
            if (
                config.deliveryZones.deliveryPriceType === "areaPrice" &&
                deliveryZone &&
                !yandexApiError
            ) {
                if (
                    deliveryZone.freeDeliveryOrder &&
                    cartTotalPrice > deliveryZone.freeDeliveryOrder
                ) {
                    return 0;
                } else {
                    return parseInt(deliveryZone.deliveryPrice);
                }
            } else if (
                config.deliveryZones.deliveryPriceType !== "areaPrice" &&
                config.CONFIG_order_delivery_price
            ) {
                return parseInt(config.CONFIG_order_delivery_price);
            }
        }
        return 0;
    };

    const handleChooseZoneDeliveryAddress = (address) => {
        setChoosenAddress(address);
        setNewUserAddressArea(address.area);
        setNewUserAddressStreet(address.street);
        setNewUserAddressHome(address.home);
        setNewUserAddressApartment(address.apartment);
        setNewUserAddressPorch(address.porch);
        setNewUserAddressFloor(address.floor);
        setNewUserAddressCoordinates(address.coordinates);
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
        if (!value) {
            return;
        }
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

    const beforePaymentConfirm = () => {
        setOpenBeforePaymentModal(false);
        handleMakeOrder();
    };

    const beforePaymentCancel = () => {
        setOpenBeforePaymentModal(false);
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
            ((config.deliveryZones.deliveryPriceType !== "areaPrice" &&
                !newUserAddressStreet) ||
                !newUserAddressHome)
        ) {
            currentValidation = false;
            setValidate(false);
            setError("Заполните все обязательные поля");
            return;
        }

        if (
            typeDelivery === "delivery" &&
            config.deliveryZones.deliveryPriceType === "areaPrice" &&
            !yandexApiError &&
            !deliveryZone
        ) {
            currentValidation = false;
            setValidate(false);
            setError("Выбранный адрес не попадает ни в одну зону доставки");
            return;
        }

        if (!preorderDate || (!preorderTime && !asSoonAsPosible)) {
            currentValidation = false;
            setValidate(false);
            setError("Заполните все обязательные поля");
            return;
        }

        if (currentValidation) {
            setLoading(true);
            axios
                .post(
                    "https://" +
                        _getDomain() +
                        "/?rest-api=makeOrder" +
                        "&platform=" +
                        _getPlatform(),
                    {
                        name: userName,
                        phone: getNumbersValue(userPhone),
                        token: user.token,
                        typeDelivery: typeDelivery,
                        deliveryAddress: deliveryAddress,
                        selfDeliveryAddress: selfDeliveryAddress,
                        newUserAddressArea: newUserAddressArea,
                        newUserAddressStreet: newUserAddressStreet,
                        newUserAddressHome: newUserAddressHome,
                        newUserAddressPorch: newUserAddressPorch,
                        newUserAddressFloor: newUserAddressFloor,
                        newUserAddressApartment: newUserAddressApartment,
                        newUserAddressCoordinates: newUserAddressCoordinates,
                        deliveryZoneIndex: deliveryZone && deliveryZone.index,
                        orderDeliveryPrice: getOrderDeliveryPrice(),
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
                        autoDiscountId: autoDiscount?.id,
                        autoDiscountAmount: autoDiscountAmount,
                    }
                )
                .then((resp) => {
                    setLoading(false);
                    if (resp.data.status === "success") {
                        dispatch(saveAddresses(resp.data.user.addresses));
                        window.scrollTo(0, 0);
                        navigate("/order-complete", { replace: true });
                    } else if (resp.data.status === "need_payment") {
                        window.location.href = resp.data.redirect;
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
            setChoosenAddress(null);
            setNewUserAddressStreet("");
            setNewUserAddressHome("");
            setNewUserAddressApartment("");
            setNewUserAddressPorch("");
            setNewUserAddressFloor("");
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
                            sx={{
                                "& .MuiFormControlLabel-root": {
                                    alignItems: "start",
                                },
                            }}
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
                            sx={{
                                "& .MuiFormControlLabel-root": {
                                    alignItems: "start",
                                },
                            }}
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
                                sx={{
                                    "& .MuiFormControlLabel-root": {
                                        alignItems: "start",
                                    },
                                }}
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

    useEffect(() => {
        if (
            Object.keys(promocode).length !== 0 &&
            promocode.constructor === Object &&
            !conditionalPromocode
        ) {
            if (
                config.selfDeliveryCoupon.code !== undefined &&
                promocode.code === config.selfDeliveryCoupon.code
            )
                dispatch(removePromocode());
            else {
                const resultCheckPromocode = _checkPromocode({
                    promocode,
                    items: cartProducts,
                    cartTotal: cartSubTotalPrice,
                    config,
                    typeDelivery,
                });
                if (resultCheckPromocode.status === "error") {
                    dispatch(removePromocode());
                    dispatch(setConditionalPromocode(promocode));
                    dispatch(
                        updateAlerts({
                            open: true,
                            message: resultCheckPromocode.alert,
                        })
                    );
                }
            }
        }

        if (conditionalPromocode && !Object.keys(promocode).length) {
            const resultCheckPromocode = _checkPromocode({
                promocode: conditionalPromocode,
                items: cartProducts,
                cartTotal: cartSubTotalPrice,
                config,
                typeDelivery,
            });
            if (resultCheckPromocode.status !== "error") {
                dispatch(addPromocode(conditionalPromocode));
                dispatch(clearConditionalPromocode());
            }
        }
    }, [config, promocode, typeDelivery, conditionalPromocode]);

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

    const deliveryTextFieldProps = {
        error:
            (!newUserAddressHome || !deliveryZone) && !validate ? true : false,
        helperText:
            !newUserAddressHome && !validate
                ? "Поле обязательно для заполнения"
                : !deliveryZone && !validate
                ? "Выбранный адрес не попадает ни в одну зону доставки"
                : "",
    };

    const preorderFormProps = {
        error:
            !validate && (!preorderDate || (!preorderTime && !asSoonAsPosible)),

        helperText: !validate ? "Выберите дату и время" : "",
    };

    if (user.addresses && user.addresses.length) {
        user.addresses.map((address, index) => {
            if (!address.formate) {
                let formateAddress = address.street + ", д. " + address.home;
                formateAddress += address.porch
                    ? ", под. " + address.porch
                    : "";
                formateAddress += address.floor
                    ? ", этаж " + address.floor
                    : "";
                formateAddress += address.apartment
                    ? ", кв. " + address.apartment
                    : "";
                user.addresses[index].formate = formateAddress;
            }
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

    const deliveryOrderLess =
        config.CONFIG_order_min_price &&
        typeDelivery === "delivery" &&
        config.deliveryZones.deliveryPriceType === "fixedPrice" &&
        cartTotalPrice < config.CONFIG_order_min_price;
    const selfDeliveryOrderLess =
        config.CONFIG_selforder_min_price &&
        typeDelivery === "self" &&
        cartTotalPrice < config.CONFIG_selforder_min_price;

    const getPromocodeSelfDeliveryMinPrice = () => {
        if (Object.keys(promocode).length > 0) {
            if (
                promocode.coupon_selfdelivery_min_price === "0" ||
                promocode.coupon_selfdelivery_min_price > 0
            ) {
                return promocode.coupon_selfdelivery_min_price;
            } else {
                return promocode.coupon_min_price;
            }
        }
    };

    const promocodeSelfDeliveryMinPrice = getPromocodeSelfDeliveryMinPrice();

    const promocodeSelfDeliveryOrderLess =
        typeDelivery === "self" &&
        Object.keys(promocode).length > 0 &&
        cartTotalPrice < parseInt(promocodeSelfDeliveryMinPrice);

    const promocodeDeliveryOrderLess =
        typeDelivery === "delivery" &&
        Object.keys(promocode).length > 0 &&
        promocode.coupon_min_price &&
        cartTotalPrice < parseInt(promocode.coupon_min_price);

    // Функция рендера графика работы филиала
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

    // Функция отслеживания позиции блока с заказом
    const handleScroll = () => {
        if ((window.scrollY >= stickedTotalPanel.current.offsetTop) & !sticked)
            setSticked(true);
        if ((window.scrollY < stickedTotalPanel.current.offsetTop) & sticked)
            setSticked(false);
    };
    useEffect(() => {
        if (!_isMobile()) {
            window.addEventListener("scroll", handleScroll);
        }
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [sticked]);

    const getGatewayIcon = useCallback(
        (gateway) => {
            if (gateway.id) {
                if (gateway.id === "cash") {
                    return <img src={wallet} alt={gateway.title} />;
                }
                if (gateway.id === "card") {
                    return <img src={creditCard} alt={gateway.title} />;
                }
                return <img src={onlineCreditCard} alt={gateway.title} />;
            }
            return <div></div>;
        },
        [gateways]
    );
    const getResultTotal = () => {
        let result = cartTotalPrice;
        if (usedBonuses) {
            result -= usedBonuses;
        }
        if (autoDiscount && autoDiscountAmount) {
            result -= autoDiscountAmount;
        }
        if (typeDelivery === "delivery") {
            if (
                config.deliveryZones.deliveryPriceType === "areaPrice" &&
                !yandexApiError &&
                deliveryZone &&
                deliveryZone.deliveryPrice &&
                (cartTotalPrice < deliveryZone.freeDeliveryOrder ||
                    !deliveryZone.freeDeliveryOrder)
            ) {
                result += parseInt(deliveryZone?.deliveryPrice);
            } else if (
                config.deliveryZones.deliveryPriceType !== "areaPrice" &&
                config.CONFIG_order_delivery_price
            ) {
                result += parseInt(config.CONFIG_order_delivery_price);
            }
        }
        return result;
    };

    return (
        <>
            <Header />
            <Container className="checkout checkout-wrapper">
                <h1>Оформление заказа</h1>
                <Grid container columnSpacing={5}>
                    <Grid
                        item
                        xs={12}
                        container
                        spacing={5}
                        sx={{ mb: "2rem" }}
                    >
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
                                                sx={{
                                                    width: 1,
                                                    "& .MuiInputBase-root": {
                                                        bgcolor: "#fff",
                                                    },
                                                }}
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
                                                sx={{
                                                    width: 1,
                                                    "& .MuiInputBase-root": {
                                                        bgcolor: "#fff",
                                                    },
                                                }}
                                                {...userPhoneProps}
                                            />
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>

                            <div className="checkout--delivery">
                                <div className="checkout--delivery-type">
                                    <h3>Как хотите получить заказ?</h3>
                                    <p>Выберите удобный для вас способ.</p>
                                    {renderTypeOrdering()}
                                </div>

                                <Divider
                                    sx={{ my: "20px", borderColor: "#ccc" }}
                                />

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

                                        {yandexApiError ? (
                                            <Alert
                                                severity="error"
                                                sx={{
                                                    mt: 2,
                                                    mb: 2,
                                                    "& .MuiAlert-action": {
                                                        flexDirection: "column",
                                                        justifyContent:
                                                            "center",
                                                    },
                                                }}
                                                action={
                                                    _isMobile() ? null : (
                                                        <Button
                                                            variant="button"
                                                            className=" btn--action"
                                                            onClick={() =>
                                                                window.location.reload()
                                                            }
                                                        >
                                                            Обновить
                                                        </Button>
                                                    )
                                                }
                                            >
                                                <div>
                                                    Потеряно соединение с Яндекс
                                                    картами, нажмите кнопку
                                                    «Обновить».
                                                </div>
                                                {_isMobile() ? (
                                                    <Button
                                                        variant="button"
                                                        className=" btn--action"
                                                        onClick={() =>
                                                            window.location.reload()
                                                        }
                                                        sx={{
                                                            width: "100%",
                                                            mt: "8px",
                                                        }}
                                                    >
                                                        Обновить
                                                    </Button>
                                                ) : null}
                                            </Alert>
                                        ) : (
                                            <>
                                                <UserAddressesList
                                                    deliveryAddress={
                                                        deliveryAddress
                                                    }
                                                    handleChooseDeliveryAddress={
                                                        handleChooseDeliveryAddress
                                                    }
                                                />

                                                {config.deliveryZones
                                                    .deliveryPriceType ===
                                                    "areaPrice" &&
                                                deliveryAddress === "new" ? (
                                                    <>
                                                        <TextField
                                                            size="small"
                                                            placeholder="Укажите адрес"
                                                            value={
                                                                choosenAddress?.formate ||
                                                                ""
                                                            }
                                                            multiline
                                                            focused={false}
                                                            fullWidth
                                                            onClick={(
                                                                event
                                                            ) => {
                                                                event.stopPropagation();
                                                                dispatch(
                                                                    setOpenDeliveryModal(
                                                                        true
                                                                    )
                                                                );
                                                            }}
                                                            InputProps={{
                                                                readOnly: true,
                                                                endAdornment: (
                                                                    <span
                                                                        className="text-field__text-adornment"
                                                                        onClick={(
                                                                            event
                                                                        ) => {
                                                                            event.stopPropagation();
                                                                            dispatch(
                                                                                setOpenDeliveryModal(
                                                                                    true
                                                                                )
                                                                            );
                                                                        }}
                                                                    >
                                                                        {choosenAddress?.formate
                                                                            ? "Изменить"
                                                                            : "Указать"}
                                                                    </span>
                                                                ),
                                                            }}
                                                            sx={{
                                                                "& .MuiOutlinedInput-root":
                                                                    {
                                                                        cursor: "pointer",
                                                                    },
                                                                "& .MuiOutlinedInput-input":
                                                                    {
                                                                        cursor: "pointer",
                                                                    },
                                                            }}
                                                            {...deliveryTextFieldProps}
                                                        />
                                                    </>
                                                ) : null}

                                                {deliveryAddress === "new" &&
                                                    config.deliveryZones
                                                        .deliveryPriceType !==
                                                        "areaPrice" && (
                                                        <div className="checkout--form-new-address">
                                                            <Grid
                                                                container
                                                                spacing={2}
                                                            >
                                                                <Grid
                                                                    item
                                                                    xs={8}
                                                                    md={6}
                                                                    sx={{
                                                                        width: 1,
                                                                    }}
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
                                                                        sx={{
                                                                            width: 1,
                                                                        }}
                                                                        {...streetProps}
                                                                    />
                                                                </Grid>
                                                                <Grid
                                                                    item
                                                                    xs={4}
                                                                    md={6}
                                                                    sx={{
                                                                        width: 1,
                                                                    }}
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
                                                                        sx={{
                                                                            width: 1,
                                                                        }}
                                                                        {...homeProps}
                                                                    />
                                                                </Grid>
                                                                {config.CONFIG_checkout_hide_porch ===
                                                                "yes" ? null : (
                                                                    <Grid
                                                                        item
                                                                        xs={4}
                                                                        md={4}
                                                                    >
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
                                                                            sx={{
                                                                                width: 1,
                                                                            }}
                                                                        />
                                                                    </Grid>
                                                                )}
                                                                {config.CONFIG_checkout_hide_floor ===
                                                                "yes" ? null : (
                                                                    <Grid
                                                                        item
                                                                        xs={4}
                                                                        md={4}
                                                                    >
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
                                                                            sx={{
                                                                                width: 1,
                                                                            }}
                                                                        />
                                                                    </Grid>
                                                                )}
                                                                {config.CONFIG_checkout_hide_apartment ===
                                                                "yes" ? null : (
                                                                    <Grid
                                                                        item
                                                                        xs={4}
                                                                        md={4}
                                                                    >
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
                                                                            sx={{
                                                                                width: 1,
                                                                            }}
                                                                        />
                                                                    </Grid>
                                                                )}
                                                            </Grid>
                                                        </div>
                                                    )}
                                            </>
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
                                                sx={{
                                                    mb: 2,
                                                    "& .MuiFormControlLabel-root":
                                                        {
                                                            alignItems: "start",
                                                        },
                                                }}
                                            >
                                                <FormControlLabel
                                                    className="custom-radio"
                                                    value="main"
                                                    control={
                                                        <Radio size="small" />
                                                    }
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
                            <YMaps
                                query={{
                                    apikey: config.deliveryZones
                                        ? config.deliveryZones.apiKey
                                        : "",
                                }}
                            >
                                {config.deliveryZones?.deliveryPriceType ===
                                    "areaPrice" && !yandexApiError ? (
                                    <DeliveryAddressModal
                                        choosenAddress={choosenAddress}
                                        onYandexApiError={onYandexApiError}
                                        handleChooseZoneDeliveryAddress={
                                            handleChooseZoneDeliveryAddress
                                        }
                                    />
                                ) : null}
                            </YMaps>

                            <div className="checkout--order-time">
                                <h3>Когда приготовить заказ?</h3>

                                {limitedCategoriesInCart.length ? (
                                    <Alert
                                        severity="info"
                                        sx={{ mt: 2, mb: 2 }}
                                    >
                                        Заказ по категориям{" "}
                                        {limitedCategoriesNames} возможен только
                                        на текущее время.
                                    </Alert>
                                ) : null}

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
                                    disablePreorderDates={
                                        !!limitedCategoriesInCart.length
                                    }
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
                                    sx={{
                                        width: 1,
                                        "& .MuiInputBase-root": {
                                            bgcolor: "#fff",
                                        },
                                    }}
                                />
                            </div>
                        </Grid>
                        <Grid
                            item
                            sm={12}
                            md={5}
                            sx={{ width: 1 }}
                            className={`checkout--total-wrapper ${
                                sticked && "sticked"
                            }`}
                            ref={stickedTotalPanel}
                        >
                            <div className={"checkout--total-panel"}>
                                <h3 className="checkout--total-panel--title">
                                    Ваш заказ
                                </h3>

                                <div className="checkout--products">
                                    {/* { Object.keys(cartProducts).map( (key, index) => 
                                    <CheckoutProduct key={cartProducts[key].items[0].id} productCart={cartProducts[key].items[0]} productCount={cartProducts[key].items.length} productTotalPrice={cartProducts[key].totalPrice} />
                                ) } */}

                                    {Object.keys(cartProducts).map(
                                        (key, index) => {
                                            if (
                                                items[key] &&
                                                items[key].type !== undefined &&
                                                items[key].type === "variations"
                                            ) {
                                                return cartProducts[
                                                    key
                                                ].items.map(
                                                    (
                                                        keyVariantProduct,
                                                        indexVariantProduct
                                                    ) => (
                                                        <CheckoutProduct
                                                            key={
                                                                indexVariantProduct
                                                            }
                                                            productIndex={
                                                                indexVariantProduct
                                                            }
                                                            productCart={
                                                                cartProducts[
                                                                    key
                                                                ].items[
                                                                    indexVariantProduct
                                                                ]
                                                            }
                                                            productCount={1}
                                                            productTotalPrice={
                                                                cartProducts[
                                                                    key
                                                                ].totalPrice
                                                            }
                                                        />
                                                    )
                                                );
                                            } else {
                                                const itemsWithoutModificators =
                                                    cartProducts[
                                                        key
                                                    ].items?.filter(
                                                        (el) =>
                                                            !el
                                                                .choosenModificators
                                                                ?.length
                                                    );
                                                const itemsWithoutModificatorsTotal =
                                                    getItemTotalPrice(
                                                        itemsWithoutModificators
                                                    );
                                                let itemWithoutModificatorRendered = false;
                                                return cartProducts[
                                                    key
                                                ].items.map((el, inx) => {
                                                    if (
                                                        el.choosenModificators
                                                            ?.length
                                                    ) {
                                                        return (
                                                            <CheckoutProduct
                                                                key={inx}
                                                                productIndex={
                                                                    inx
                                                                }
                                                                productCart={el}
                                                                productCount={1}
                                                                productTotalPrice={
                                                                    el.options
                                                                        ._promocode_price
                                                                        ? Math.ceil(
                                                                              el
                                                                                  .options
                                                                                  ._promocode_price
                                                                          )
                                                                        : el
                                                                              .options
                                                                              ._price
                                                                }
                                                            />
                                                        );
                                                    } else if (
                                                        !itemWithoutModificatorRendered
                                                    ) {
                                                        itemWithoutModificatorRendered = true;
                                                        return (
                                                            <CheckoutProduct
                                                                key={inx}
                                                                productIndex={
                                                                    inx
                                                                }
                                                                productCart={el}
                                                                productCount={
                                                                    itemsWithoutModificators.length
                                                                }
                                                                productTotalPrice={
                                                                    itemsWithoutModificatorsTotal
                                                                }
                                                            />
                                                        );
                                                    }
                                                });
                                            }
                                        }
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

                                {config.CONFIG_disable_promocodes !== "on" && (
                                    <div className="checkout--promocode">
                                        <Promocode
                                            ignoreMinPrice={true}
                                            typeDelivery={typeDelivery}
                                        />
                                    </div>
                                )}

                                <hr className="checkout--total-panel--separator" />

                                {cart.discount || autoDiscountAmount ? (
                                    <div className="checkout--subtotal-price">
                                        Сумма заказа
                                        <span className="money">
                                            {cart.subTotalPrice.toLocaleString(
                                                "ru-RU"
                                            )}{" "}
                                            &#8381;
                                        </span>
                                    </div>
                                ) : null}

                                {promocode.code && cart.discount ? (
                                    <div className="checkout--promocode-total">
                                        <div className="checkout--promocode-name">
                                            Промокод{" "}
                                            <span className="main-color">
                                                {promocode.code}
                                            </span>
                                        </div>

                                        <span className="money main-color">
                                            -
                                            {cart.discount.toLocaleString(
                                                "ru-RU"
                                            )}{" "}
                                            &#8381;
                                        </span>
                                    </div>
                                ) : null}

                                {autoDiscount && autoDiscountAmount ? (
                                    <div className="checkout--auto-discount-container">
                                        <div className="checkout--auto-discount-name">
                                            <span>Скидка</span>
                                            <BootstrapTooltip
                                                placement="top"
                                                title={autoDiscount.name}
                                            >
                                                <HelpOutlineIcon />
                                            </BootstrapTooltip>
                                        </div>

                                        <span className="checkout--auto-discount-amount main-color">
                                            -
                                            {autoDiscountAmount.toLocaleString(
                                                "ru-RU"
                                            )}{" "}
                                            &#8381;
                                        </span>
                                    </div>
                                ) : null}

                                <div className="checkout--total-panel--result">
                                    {typeDelivery === "delivery" &&
                                    deliveryZone &&
                                    !yandexApiError ? (
                                        <div className="result-delivery">
                                            <span className="price-title">
                                                Доставка
                                            </span>
                                            <span>
                                                {(deliveryZone.freeDeliveryOrder &&
                                                    cartTotalPrice >
                                                        deliveryZone.freeDeliveryOrder) ||
                                                !deliveryZone.deliveryPrice
                                                    ? "Бесплатно"
                                                    : `${deliveryZone.deliveryPrice.toLocaleString(
                                                          "ru-RU"
                                                      )} ₽`}
                                            </span>
                                        </div>
                                    ) : typeDelivery === "delivery" &&
                                      config.deliveryZones.deliveryPriceType !==
                                          "areaPrice" &&
                                      config.CONFIG_order_delivery_price ? (
                                        <div className="result-delivery">
                                            <span className="price-title">
                                                Доставка
                                            </span>
                                            <span>
                                                {config.CONFIG_order_delivery_price.toLocaleString(
                                                    "ru-RU"
                                                )}{" "}
                                                ₽
                                            </span>
                                        </div>
                                    ) : null}
                                    <div className="result-total">
                                        <span className="price-title">
                                            Итого
                                        </span>
                                        <span className="money">
                                            {getResultTotal().toLocaleString(
                                                "ru-RU"
                                            )}{" "}
                                            &#8381;
                                        </span>
                                    </div>
                                </div>

                                {config.CONFIG_bonuses_program_status ===
                                    "on" && (
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
                                    </div>
                                )}

                                <hr className="checkout--total-panel--separator" />

                                {gateways && (
                                    <div className="checkout--gateways">
                                        <h4>Способ оплаты</h4>
                                        <ToggleButtonGroup
                                            value={activeGateway}
                                            onChange={handleSetActiveGateway}
                                            orientation="vertical"
                                            exclusive
                                            className="checkout--gateways-btn-group"
                                        >
                                            {gateways.map((key, index) => (
                                                <ToggleButton
                                                    key={index}
                                                    value={key.id}
                                                    label={key.title}
                                                    className="checkout--gateways-btn"
                                                >
                                                    <div className="checkout--gateways-title-container">
                                                        <Radio
                                                            size="small"
                                                            checked={
                                                                activeGateway ===
                                                                key.id
                                                            }
                                                        />
                                                        <div>{key.title}</div>
                                                    </div>
                                                    {getGatewayIcon(key)}
                                                </ToggleButton>
                                            ))}
                                        </ToggleButtonGroup>

                                        <div className="checkout--gateways-inputs">
                                            {config.CONFIG_checkout_hide_count_person ===
                                            "yes" ? null : (
                                                <div className="checkout--gateways-input">
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
                                                        sx={{
                                                            width: 1,
                                                            mt: 0.5,
                                                        }}
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
                                                </div>
                                            )}

                                            {activeGateway === "cash" && (
                                                <div className="checkout--gateways-input">
                                                    <b>Приготовить сдачу с</b>
                                                    <TextField
                                                        size="small"
                                                        id="money_back"
                                                        value={moneyBack}
                                                        type="number"
                                                        onChange={
                                                            handleChangeMoneyBack
                                                        }
                                                        sx={{
                                                            width: 1,
                                                            mt: 0.5,
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
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
                            </div>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={7}>
                        <Grid item sm={12}>
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
                                    sx={{ mb: 1 }}
                                >
                                    {error}
                                </Alert>
                            )}
                            <Collapse
                                sx={{ mb: 1 }}
                                in={promocodeSelfDeliveryOrderLess}
                                unmountOnExit
                            >
                                <Alert severity="error">
                                    Минимальная сумма заказа на самовывоз c
                                    промокодом «{promocode.code}» —{" "}
                                    <span style={{ whiteSpace: "nowrap" }}>
                                        {promocodeSelfDeliveryMinPrice} ₽
                                    </span>
                                </Alert>
                            </Collapse>

                            <Collapse
                                sx={{ mb: 1 }}
                                in={promocodeDeliveryOrderLess}
                                unmountOnExit
                            >
                                <Alert severity="error">
                                    Минимальная сумма заказа на доставку c
                                    промокодом «{promocode.code}» —{" "}
                                    <span style={{ whiteSpace: "nowrap" }}>
                                        {promocode.coupon_min_price} ₽
                                    </span>
                                </Alert>
                            </Collapse>

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

                            <Collapse
                                sx={{ mb: 1 }}
                                in={deliveryOrderLess}
                                unmountOnExit
                            >
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
                                    Сумма заказа меньше минимальной для доставки
                                    по указанному адресу
                                </Alert>
                            </Collapse>

                            <Collapse
                                sx={{ mb: 1 }}
                                in={
                                    !promocode?.code &&
                                    !!conditionalPromocode?.code
                                }
                                unmountOnExit
                            >
                                <PromocodeErrorsAlert onlyMinPrice={true} />
                            </Collapse>

                            <div className="checkout--button-container">
                                <Button
                                    className="btn--outline-dark"
                                    variant="button"
                                    onClick={handleBackToMenu}
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
                                            ? setOpenBeforePaymentModal(true)
                                            : handleMakeOrder();
                                    }}
                                    disabled={
                                        promocodeSelfDeliveryOrderLess ||
                                        promocodeDeliveryOrderLess ||
                                        selfDeliveryOrderLess ||
                                        deliveryOrderLess ||
                                        (typeDelivery === "delivery" &&
                                            config.deliveryZones
                                                .deliveryPriceType ===
                                                "areaPrice" &&
                                            yandexApiError) ||
                                        (config.deliveryZones
                                            .deliveryPriceType ===
                                            "areaPrice" &&
                                            deliveryZone &&
                                            deliveryZone.orderMinPrice >
                                                cartTotalPrice)
                                    }
                                >
                                    Оформить заказ
                                    <NavigateNextIcon className="button-arrow-icon" />
                                </LoadingButton>
                            </div>
                        </Grid>
                    </Grid>
                </Grid>

                <div className=""></div>
            </Container>
            {config.CONFIG_order_text_before_payment ? (
                <BeforePaymentModal
                    openModal={openBeforePaymentModal}
                    beforePaymentConfirm={beforePaymentConfirm}
                    beforePaymentCancel={beforePaymentCancel}
                    content={config.CONFIG_order_text_before_payment}
                />
            ) : null}
            <Footer />
        </>
    );
}
