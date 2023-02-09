import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    addBonusProductToCart,
    addProductToCart,
    addPromocode,
    clearCart,
} from "../redux/actions/cart";
import { _clone, _getDomain } from "./helpers";
import { LoadingButton } from "@mui/lab";

const UserOrder = ({
    order,
    setDisableRepeatButtons,
    disableRepeatButtons,
}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [showFullInfo, setShowFullInfo] = useState(false);
    const [loading, setLoading] = useState(false);
    const [cartItemsUpdated, setCartItemsUpdated] = useState(false);

    const { user, products, bonuses_products, cart } = useSelector(
        ({ user, products, cart }) => {
            return {
                user: user.user,
                products: products.items,
                bonuses_products: products.bonuses_items,
                cart: cart,
            };
        }
    );

    const handleToggleOrderInfo = () => {
        setShowFullInfo(!showFullInfo);
    };

    const handleRepeatOrder = useCallback(() => {
        dispatch(clearCart());
        let cartTotalAmount = 0;
        Object.values(order.products).forEach((item) => {
            if (
                item.type === "variations" &&
                item.parent &&
                products[item.parent] &&
                products[item.parent].variants[item.id]
            ) {
                let product = _clone(products[item.parent]);
                product.options._price =
                    products[item.parent].variants[item.id].price;
                product.variant = products[item.parent].variants[item.id];
                const modificatorsAmount = item.modificators.reduce(
                    (acc, modificator) => acc + parseInt(modificator.price),
                    0
                );
                dispatch(
                    addProductToCart({
                        ...product,
                        choosenModificators: item.modificators,
                        modificatorsAmount: modificatorsAmount,
                    })
                );
                cartTotalAmount +=
                    products[item.parent].variants[item.id].price +
                    modificatorsAmount;
            }

            if (
                item.type === "simple" &&
                products[item.id] !== undefined &&
                item.price === item.total_price
            ) {
                let product = _clone(products[item.id]);
                const modificatorsAmount = item.modificators.reduce(
                    (acc, modificator) => acc + parseInt(modificator.price),
                    0
                );
                dispatch(
                    addProductToCart({
                        ...product,
                        choosenModificators: item.modificators,
                        modificatorsAmount: modificatorsAmount,
                    })
                );
                cartTotalAmount += products[item.id].options._price;
            }
        });

        if (order.bonusProduct.id !== undefined) {
            Object.values(bonuses_products).forEach((item) => {
                if (
                    item.id === order.bonusProduct.id &&
                    item.limit <= cartTotalAmount
                )
                    dispatch(addBonusProductToCart(item));
            });
        }
        setCartItemsUpdated(true);
    }, []);

    useEffect(() => {
        if (cartItemsUpdated) {
            if (order.promocode.code !== undefined) {
                setLoading(true);
                setDisableRepeatButtons(true);
                axios
                    .post(
                        "https://" + _getDomain() + "/?rest-api=usePromocode",
                        {
                            promocode: order.promocode.code,
                            cartProducts: cart.items,
                            token: user.token ? user.token : false,
                            phone: user.phone ? user.phone : false,
                        }
                    )
                    .then((resp) => {
                        setLoading(false);
                        if (resp.data.status === "error") {
                            console.log(resp.data.message);
                        } else {
                            dispatch(addPromocode(resp.data.promocode));
                        }

                        navigate("/checkout", { replace: true });
                    });
            } else {
                navigate("/checkout", { replace: true });
            }
        }
    }, [cartItemsUpdated]);

    return (
        <div className="account--user-order">
            <div className="account--user-order--header">
                <div className="account--user-order--time">{order.time}</div>
                <div className="account--user-order--status">
                    {order.status}
                </div>
            </div>

            {order.typeDelivery === "delivery" ? (
                <div className="account--user-order--delivery">
                    <div className="account--user-order--delivery-type">
                        Доставка
                    </div>
                    <div className="account--user-order--delivery-address">
                        {order.addressDelivery}
                    </div>
                </div>
            ) : (
                <div className="account--user-order--delivery">
                    <div className="account--user-order--delivery-type">
                        Самовывоз
                    </div>
                    <div className="account--user-order--delivery-address">
                        {order.selfDelivery}
                    </div>
                </div>
            )}

            {order.products && (
                <div
                    className={`account--user-order--products ${
                        showFullInfo ? "active" : "no-active"
                    }`}
                >
                    {Object.values(order.products).map((product, index) => {
                        if ((!showFullInfo && index <= 2) || showFullInfo) {
                            return (
                                <div
                                    className="account--user-order--product"
                                    key={`${order.ID}-${product.id}-${index}`}
                                >
                                    <div>
                                        <div className="account--user-order--product-name">
                                            {product.name}
                                        </div>
                                        {product.modificators.length ? (
                                            <div className="account--user-order--product-modificators">
                                                +
                                                {product.modificators.map(
                                                    (el, inx, array) =>
                                                        inx !==
                                                        array.length - 1 ? (
                                                            <span
                                                                key={el.id}
                                                                className="account--user-order--product-modificator"
                                                            >
                                                                {" "}
                                                                {el.title}{" "}
                                                                {el.count} шт.,
                                                            </span>
                                                        ) : (
                                                            <span
                                                                key={el.id}
                                                                className="account--user-order--product-modificator"
                                                            >
                                                                {" "}
                                                                {el.title}{" "}
                                                                {el.count}
                                                                шт.
                                                            </span>
                                                        )
                                                )}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="account--user-order--product-price">
                                        {product.total_price !==
                                        product.price ? (
                                            <>
                                                <span className="default-price">
                                                    {product.price} ₽
                                                </span>
                                                <span className="sale-price">
                                                    {product.total_price} ₽
                                                </span>
                                            </>
                                        ) : (
                                            `${product.total_price} ₽`
                                        )}
                                    </div>
                                </div>
                            );
                        } else {
                            return null;
                        }
                    })}

                    {order.bonusProduct.id !== undefined && (
                        <div
                            className="account--user-order--product"
                            key={order.bonusProduct.id}
                        >
                            <div className="account--user-order--product-name">
                                {order.bonusProduct.name}
                            </div>
                            <div className="account--user-order--product-price main-color">
                                Подарок
                            </div>
                        </div>
                    )}
                </div>
            )}

            {Object.values(order.products).length > 3 && (
                <div
                    className="account--user-order--product-toggle-more"
                    onClick={() => handleToggleOrderInfo(order.ID)}
                >
                    {showFullInfo ? "Скрыть" : "Подробнее"}
                </div>
            )}

            {order.promocode.code !== undefined &&
            order.subtotal - parseInt(order.total) > 0 ? (
                <>
                    <div className="account--user-order--subtotal">
                        <b>Сумма заказа:</b> <b>{order.subtotal} ₽</b>
                    </div>

                    <div className="account--user-order--promocode">
                        <b>
                            Промокод{" "}
                            <span className="main-color">
                                {order.promocode.code}
                            </span>
                            :
                        </b>
                        <div className="account--user-order--promocode-discount main-color">
                            - {order.subtotal - parseInt(order.total)} ₽
                        </div>
                    </div>
                </>
            ) : (
                ""
            )}
            <div className="account--user-order--total">
                {order.deliveryPrice ? (
                    <div className="account--user-order--total-delivery">
                        <span>Доставка</span>
                        <span>{order.deliveryPrice} ₽</span>
                    </div>
                ) : null}
                <div className="account--user-order--total-amount">
                    <span>Итого:</span>{" "}
                    <span className="main-color">
                        {parseInt(order.total).toLocaleString()} ₽
                    </span>
                </div>
            </div>

            <LoadingButton
                loading={loading}
                size="small"
                variant="button"
                className="btn btn--dark repeat-order"
                onClick={disableRepeatButtons ? null : handleRepeatOrder}
                loadingPosition="start"
            >
                Повторить заказ
            </LoadingButton>
        </div>
    );
};

export default UserOrder;
