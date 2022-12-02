import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import CartProduct from "../components/Product/CartProduct";
import MiniCartReccomends from "../components/MiniCartRecommends";
import PromocodeCartProduct from "../components/Product/PromocodeCartProduct";
import CartBonusesProducts from "../components/CartBonusesProducts";
import { Button, Container, Alert, Collapse } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { TransitionGroup } from "react-transition-group";
import { Promocode, Header, Footer } from "../components";
import CartFreeAddons from "../components/Product/CartFreeAddons";
import { _checkPromocode } from "../components/helpers";
import { removePromocode, addBonusProductToCart } from "../redux/actions/cart";
import { setOpenModalAuth } from "../redux/actions/user";
import { updateAlerts } from "../redux/actions/systemAlerts";
import emptyCartImg from "../img/empty-cart.svg";
import "swiper/modules/navigation/navigation.min.css";
import "swiper/swiper.min.css";
import { getItemTotalPrice } from "../redux/reducers/cart";

export default function Cart() {
    const dispatch = useDispatch();
    const {
        config,
        cart,
        promocode,
        promocodeProducts,
        cartProducts,
        cartSubTotalPrice,
        cartTotalPrice,
        cartCountItems,
        user,
        items,
    } = useSelector(({ config, cart, products, user }) => {
        return {
            config: config.data,
            cart: cart,
            promocode: cart.promocode,
            promocodeProducts: cart.promocodeProducts,
            cartProducts: cart.items,
            cartTotalPrice: cart.totalPrice,
            cartSubTotalPrice: cart.subTotalPrice,
            cartCountItems: cart.countItems,
            items: products.items,
            user: user.user,
        };
    });

    const navigate = useNavigate();
    const handleClickBackToMenu = useCallback(() => {
        window.scrollTo(0, 0);
        navigate("/", { replace: true });
    }, [navigate]);

    const handleMakeOrder = () => {
        // Проверка авторизации
        if (!user.token && config.CONFIG_auth_type !== "noauth")
            dispatch(setOpenModalAuth(true));
        else {
            window.scrollTo(0, 0);
            navigate("/checkout", { replace: true });
        }
    };

    if (promocode) {
        if (
            config.selfDeliveryCoupon.code !== undefined &&
            promocode.code === config.selfDeliveryCoupon.code
        )
            dispatch(removePromocode());
        else {
            const resultCheckPromocode = _checkPromocode(
                promocode,
                cartProducts,
                cartSubTotalPrice
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

    useEffect(() => {
        if (config.CONFIG_free_products_program_status !== "on") {
            dispatch(addBonusProductToCart({}));
        }
    }, [config.CONFIG_free_products_program_status]);

    return (
        <>
            <Header />
            <Container className="cart-container">
                <h1>Корзина</h1>
                {cartCountItems && cartProducts ? (
                    <div>
                        <div className="cart-product-list">
                            <h2 className="cart-products--title">Ваш заказ</h2>

                            {config.CONFIG_cart_info_text !== undefined &&
                                config.CONFIG_cart_info_text && (
                                    <Alert
                                        className="minicart--text-info"
                                        severity="info"
                                        sx={{ mb: 2 }}
                                    >
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: config.CONFIG_cart_info_text,
                                            }}
                                        ></div>
                                    </Alert>
                                )}

                            <TransitionGroup>
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
                                                <Collapse
                                                    key={indexVariantProduct}
                                                    className="collapse-cart-product"
                                                >
                                                    <CartProduct
                                                        disabled={
                                                            cartProducts[key]
                                                                .disabled
                                                        }
                                                        key={
                                                            indexVariantProduct
                                                        }
                                                        productIndex={
                                                            indexVariantProduct
                                                        }
                                                        productCart={
                                                            cartProducts[key]
                                                                .items[
                                                                indexVariantProduct
                                                            ]
                                                        }
                                                        productCount={1}
                                                        productTotalPrice={
                                                            cartProducts[key]
                                                                .totalPrice
                                                        }
                                                    />
                                                </Collapse>
                                            )
                                        );
                                    } else {
                                        const itemsWithoutModificators =
                                            cartProducts[key].items?.filter(
                                                (el) =>
                                                    !el.choosenModificators
                                                        ?.length
                                            );
                                        const itemsWithoutModificatorsTotal =
                                            getItemTotalPrice(
                                                itemsWithoutModificators
                                            );
                                        let itemWithoutModificatorRendered = false;
                                        return cartProducts[key].items.map(
                                            (el, inx) => {
                                                if (
                                                    el.choosenModificators
                                                        ?.length
                                                ) {
                                                    return (
                                                        <Collapse
                                                            key={inx}
                                                            className="collapse-cart-product"
                                                        >
                                                            <CartProduct
                                                                disabled={
                                                                    cartProducts[
                                                                        key
                                                                    ].disabled
                                                                }
                                                                key={inx}
                                                                productIndex={
                                                                    inx
                                                                }
                                                                productCart={el}
                                                                productCount={1}
                                                                productTotalPrice={
                                                                    el.options
                                                                        ._promocode_price ??
                                                                    el.options
                                                                        ._price
                                                                }
                                                            />
                                                        </Collapse>
                                                    );
                                                } else if (
                                                    !itemWithoutModificatorRendered
                                                ) {
                                                    itemWithoutModificatorRendered = true;
                                                    return (
                                                        <Collapse
                                                            key={inx}
                                                            className="collapse-cart-product"
                                                        >
                                                            <CartProduct
                                                                disabled={
                                                                    cartProducts[
                                                                        key
                                                                    ].disabled
                                                                }
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
                                                            />{" "}
                                                        </Collapse>
                                                    );
                                                }
                                            }
                                        );
                                    }
                                })}

                                {Object.keys(promocodeProducts).map(
                                    (key, index) =>
                                        items[key] !== undefined && (
                                            <PromocodeCartProduct
                                                productCart={
                                                    promocodeProducts[key]
                                                }
                                                productCount="1"
                                                productTotalPrice={
                                                    promocodeProducts[key]
                                                        .options._price -
                                                    promocode.amount
                                                }
                                            />
                                        )
                                )}
                                <CartFreeAddons />
                            </TransitionGroup>

                            <CartBonusesProducts />

                            <MiniCartReccomends />

                            <Promocode />

                            {cart.discount ? (
                                <div className="cart--subtotal-price">
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
                                        Промокод{" "}
                                        <span className="main-color">
                                            {promocode.code}
                                        </span>
                                        :
                                        {promocode.type === "percent" ? (
                                            <span className="money main-color">
                                                -{cart.discount} ₽
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
                            ) : (
                                ""
                            )}

                            <div className="cart--total-price">
                                <div className="finish-price">
                                    Итого:{" "}
                                    <span className="money">
                                        {cartTotalPrice.toLocaleString("ru-RU")}{" "}
                                        &#8381;
                                    </span>
                                </div>
                                {config.CONFIG_order_min_price ? (
                                    cartTotalPrice <
                                    config.CONFIG_order_min_price ? (
                                        <Alert severity="error" sx={{ mt: 2 }}>
                                            Минимальная сумма для заказа -{" "}
                                            {config.CONFIG_order_min_price} ₽
                                        </Alert>
                                    ) : (
                                        ""
                                    )
                                ) : (
                                    ""
                                )}
                            </div>

                            <div className="cart--bottom-buttons">
                                <Button
                                    onClick={handleClickBackToMenu}
                                    className="btn btn--outline-dark"
                                >
                                    Вернуться в меню
                                </Button>

                                {config.CONFIG_order_min_price ? (
                                    cartTotalPrice <
                                    config.CONFIG_order_min_price ? (
                                        <Button
                                            disabled
                                            variant="button"
                                            onClick={handleMakeOrder}
                                            className="btn--action button-arrow btn-arrow-action"
                                        >
                                            К оформлению заказа
                                            <NavigateNextIcon className="button-arrow-icon" />
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="button"
                                            onClick={handleMakeOrder}
                                            className="btn--action button-arrow openCheckout"
                                        >
                                            К оформлению заказа
                                            <NavigateNextIcon className="button-arrow-icon" />
                                        </Button>
                                    )
                                ) : (
                                    <Button
                                        variant="button"
                                        onClick={handleMakeOrder}
                                        className="btn--action button-arrow openCheckout"
                                    >
                                        К оформлению заказа
                                        <NavigateNextIcon className="button-arrow-icon" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="cart--empty">
                        <img
                            src={emptyCartImg}
                            className="minicart--empty-logo"
                            alt="Логотип"
                        />
                        <h4>Ой, пусто!</h4>
                        <p className="minicart--empty-text">
                            Добавьте товары в корзину.
                        </p>
                        <a href="/">Вернуться к меню</a>
                    </div>
                )}
            </Container>
            <Footer />
        </>
    );
}
