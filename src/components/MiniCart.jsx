import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setOpenModalAuth } from "../redux/actions/user";
import { updateAlerts } from "../redux/actions/systemAlerts";
import {
    removePromocode,
    addBonusProductToCart,
    setConditionalPromocode,
    addPromocode,
    clearConditionalPromocode,
} from "../redux/actions/cart";
import { openMiniCart, closeMiniCart } from "../redux/actions/miniCart";
import { getItemTotalPrice } from "../redux/reducers/cart";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Divider, Drawer, IconButton } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import CloseIcon from "@mui/icons-material/Close";
import MiniCartProduct from "../components/Product/MiniCartProduct";
import MiniCartBonusProduct from "../components/Product/MiniCartBonusProduct";
import MiniCartFreeAddons from "./Product/MiniCartFreeAddons";
import { MiniCartBonuses, Promocode } from "../components";
import MiniCartReccomends from "./MiniCartRecommends";
import CartBonusesProducts from "./CartBonusesProducts";
import {
    _checkPromocode,
    _getPlatform,
    _isMobile,
} from "../components/helpers.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import emptyCartImg from "../img/empty-cart.svg";
import "../css/minicart.css";
import clsx from "clsx";

function MiniCart() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {
        config,
        cart,
        items,
        bonuses_items,
        cartProducts,
        cartSubTotalPrice,
        promocode,
        conditionalPromocode,
        cartTotalPrice,
        cartCountItems,
        promocodeProducts,
        recommend_items,
        addon_items,
        userCartBonusProduct,
        user,
    } = useSelector(({ config, cart, products, user }) => {
        return {
            config: config.data,
            cart: cart,
            items: products.items,
            bonuses_items: products.bonuses_items,
            cartProducts: cart.items,
            promocode: cart.promocode,
            conditionalPromocode: cart.conditionalPromocode,
            cartTotalPrice: cart.totalPrice,
            cartSubTotalPrice: cart.subTotalPrice,
            cartCountItems: cart.countItems,
            promocodeProducts: cart.promocodeProducts,
            recommend_items: products.recommend_items,
            addon_items: products.addon_items,
            userCartBonusProduct: cart.bonusProduct,
            user: user.user,
        };
    });

    const { miniCartOpen } = useSelector((state) => state.miniCart);

    const hashEventListener = (event) => {
        if (
            window.location.hash !== "minicart-sidebar" &&
            event.oldURL.includes("#minicart-sidebar")
        ) {
            handleCloseMiniCart();
        }
    };

    useEffect(() => {
        window.addEventListener("hashchange", hashEventListener);
        return () => {
            window.removeEventListener("hashchange", hashEventListener);
        };
    }, []);

    if (!miniCartOpen && window.location.hash === "minicart-sidebar") {
        window.history.replaceState(
            "",
            document.title,
            window.location.pathname
        );
    }

    const handleOpenMiniCart = () => {
        window.location.hash = "minicart-sidebar";
        dispatch(openMiniCart());
    };

    const handleCloseMiniCart = () => {
        if (window.location.hash === "#minicart-sidebar") {
            window.history.replaceState(
                "",
                document.title,
                window.location.pathname
            );
        }
        dispatch(closeMiniCart());
    };

    function _declension(value, words) {
        value = Math.abs(value) % 100;
        var num = value % 10;
        if (value > 10 && value < 20) return words[2];
        if (num > 1 && num < 5) return words[1];
        if (num === 1) return words[0];
        return words[2];
    }

    const handleMakeOrder = () => {
        // Проверка авторизации
        if (!user.token && config.CONFIG_auth_type !== "noauth")
            dispatch(setOpenModalAuth(true));
        else {
            dispatch(closeMiniCart());
            window.scrollTo(0, 0);
            navigate("/checkout", { replace: true });
        }
    };

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
        });
        if (resultCheckPromocode.status !== "error") {
            dispatch(addPromocode(conditionalPromocode));
            dispatch(clearConditionalPromocode());
        }
    }

    useEffect(() => {
        if (config.CONFIG_free_products_program_status !== "on") {
            dispatch(addBonusProductToCart({}));
        }
    }, [config.CONFIG_free_products_program_status]);

    return (
        <div
            className={
                bonuses_items !== undefined && bonuses_items.length
                    ? "minicart--wrapper active-bonuses"
                    : "minicart--wrapper"
            }
        >
            {_isMobile() ? null : (
                <button
                    className="btn--action minicart openMiniCart"
                    onClick={handleOpenMiniCart}
                >
                    <ShoppingCartIcon className="minicart--cart-icon" />
                    <div className="minicart--separator"></div>
                    <div className="minicart--topcart--total">
                        <span className="minicart--topcart--count-item">
                            {cartCountItems}{" "}
                            {_declension(cartCountItems, [
                                "товар",
                                "товара",
                                "товаров",
                            ])}
                        </span>
                        <span className="minicart--topcart--price-total">
                            {cartTotalPrice.toLocaleString("ru-RU")} &#8381;
                        </span>
                    </div>
                </button>
            )}
            <Drawer
                anchor="right"
                open={miniCartOpen}
                onClose={handleCloseMiniCart}
            >
                {cartCountItems && Object.keys(cartProducts).length ? (
                    <div className="minicart--inner">
                        <div className="minicart--product-list">
                            <h2
                                className={clsx(
                                    "minicart--inner-title",
                                    _getPlatform() === "vk" && "vk"
                                )}
                            >
                                <div>Корзина</div>
                                <IconButton
                                    color="inherit"
                                    onClick={handleCloseMiniCart}
                                    className="minicart--close"
                                >
                                    {_getPlatform() === "vk" ? (
                                        <FontAwesomeIcon
                                            icon={faAngleLeft}
                                            className={"minicart--angle-icon"}
                                        />
                                    ) : (
                                        <CloseIcon />
                                    )}
                                </IconButton>
                            </h2>

                            {config.CONFIG_cart_info_text !== undefined &&
                                config.CONFIG_cart_info_text && (
                                    <Alert
                                        className="minicart--text-info"
                                        severity="info"
                                        sx={{ mb: 2, mr: 2, ml: 2 }}
                                    >
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: config.CONFIG_cart_info_text,
                                            }}
                                        ></div>
                                    </Alert>
                                )}
                            {Object.keys(cartProducts).map((key, index) => {
                                if (
                                    items[key] &&
                                    items[key].type !== undefined &&
                                    items[key].type === "variations"
                                ) {
                                    return cartProducts[key].items.map(
                                        (
                                            keyVariantProduct,
                                            indexVariantProduct
                                        ) => (
                                            <MiniCartProduct
                                                disabled={
                                                    cartProducts[key].disabled
                                                }
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
                                                    cartProducts[key].totalPrice
                                                }
                                            />
                                        )
                                    );
                                } else {
                                    const itemsWithoutModificators =
                                        cartProducts[key].items?.filter(
                                            (el) =>
                                                !el.choosenModificators?.length
                                        );
                                    const itemsWithoutModificatorsTotal =
                                        getItemTotalPrice(
                                            itemsWithoutModificators
                                        );
                                    let itemWithoutModificatorRendered = false;
                                    return cartProducts[key].items.map(
                                        (el, inx) => {
                                            if (
                                                el.choosenModificators?.length
                                            ) {
                                                return (
                                                    <MiniCartProduct
                                                        disabled={
                                                            cartProducts[key]
                                                                .disabled
                                                        }
                                                        key={inx}
                                                        productIndex={inx}
                                                        productCart={el}
                                                        productCount={1}
                                                        productTotalPrice={
                                                            el.options
                                                                ._promocode_price
                                                                ? Math.ceil(
                                                                      el.options
                                                                          ._promocode_price
                                                                  )
                                                                : el.options
                                                                      ._price
                                                        }
                                                    />
                                                );
                                            } else if (
                                                !itemWithoutModificatorRendered
                                            ) {
                                                itemWithoutModificatorRendered = true;
                                                return (
                                                    <MiniCartProduct
                                                        disabled={
                                                            cartProducts[key]
                                                                .disabled
                                                        }
                                                        key={inx}
                                                        productIndex={inx}
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
                                        }
                                    );
                                }
                            })}

                            {/* { Object.keys(promocodeProducts).map( (key, index) => items[key] !== undefined &&
                                    <PromocodeMiniCartProduct productCart={promocodeProducts[key]} productCount="1" productTotalPrice={promocode.productPrice} />
                                ) } */}

                            {userCartBonusProduct.id && (
                                <MiniCartBonusProduct
                                    productCart={userCartBonusProduct}
                                    productCount={1}
                                    productTotalPrice={
                                        userCartBonusProduct.options._price
                                    }
                                />
                            )}

                            <MiniCartFreeAddons />

                            <CartBonusesProducts minicart={true} />

                            <MiniCartReccomends />
                        </div>

                        <div className="minicart--total-wrapper">
                            {config.CONFIG_disable_promocodes !== "on" && (
                                <div className="minicart--promocode">
                                    <Promocode />
                                </div>
                            )}

                            <div className="minicart--subtotal-price">
                                {cart.discount ? (
                                    <>
                                        <div className="price">
                                            Сумма заказа{" "}
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
                                            </span>

                                            <span className="money main-color">
                                                -
                                                {cart.discount.toLocaleString(
                                                    "ru-RU"
                                                )}{" "}
                                                &#8381;
                                            </span>
                                        </div>
                                    </>
                                ) : null}
                                {config.bonusProgramm?.status === "active" ? (
                                    <MiniCartBonuses />
                                ) : null}
                            </div>

                            <Divider
                                className="minicart--total-divider"
                                sx={{ mb: "10px" }}
                            />

                            <div className="minicart--total-block">
                                <span className="minicart--total-title">
                                    Итого
                                </span>
                                <span className="minicart--total-price">
                                    {cartTotalPrice.toLocaleString("ru-RU")}{" "}
                                    &#8381;
                                </span>
                            </div>

                            <Button
                                variant="button"
                                onClick={handleMakeOrder}
                                className="btn--action openCheckout"
                                sx={{ mt: 2 }}
                            >
                                К оформлению заказа
                                <NavigateNextIcon className="button-arrow-icon" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="minicart--inner">
                        <IconButton
                            color="inherit"
                            onClick={handleCloseMiniCart}
                            className="minicart--close"
                            sx={{
                                position: "absolute",
                                right: _getPlatform() === "vk" ? "auto" : 25,
                                left: _getPlatform() === "vk" ? 25 : "auto",
                                top: 10,
                            }}
                        >
                            {_getPlatform() === "vk" ? (
                                <FontAwesomeIcon
                                    icon={faAngleLeft}
                                    className={"minicart--angle-icon"}
                                />
                            ) : (
                                <CloseIcon />
                            )}
                        </IconButton>
                        <div className="minicart--empty">
                            <img
                                src={emptyCartImg}
                                className="minicart--empty-logo"
                                alt="Логотип"
                            />
                            <h4>Ой, пусто!</h4>
                            <div className="minicart--empty-text">
                                Добавьте товары в корзину.
                            </div>
                        </div>
                    </div>
                )}
            </Drawer>
        </div>
    );
}

export default MiniCart;
