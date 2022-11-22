import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addProductToCart,
    decreaseProductInCart,
    removeProductFromCart,
} from "../../redux/actions/cart";
import { Button, Alert } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "../../css/cart.css";
import soon from "../../img/photo-soon.svg";
import { updateAlerts } from "../../redux/actions/systemAlerts";

export default function MiniCartProduct({
    productCart,
    productCount,
    productTotalPrice,
    productIndex,
    disabled,
}) {
    const dispatch = useDispatch();
    const { promocodeProducts, promocode } = useSelector(({ cart }) => {
        return {
            promocodeProducts: cart.promocodeProducts,
            promocode: cart.promocode,
        };
    });

    const handleAddProduct = () => {
        dispatch(addProductToCart(productCart));
    };
    const handleDecreaseProduct = () => {
        dispatch(decreaseProductInCart(productCart));
    };
    const handleRemoveProduct = () => {
        dispatch(removeProductFromCart(productCart));
    };

    let dataAttributes = {};
    if (productCart.attributes) {
        Object.values(productCart.attributes).forEach((value, index) => {
            dataAttributes[index] = value.name;
        });
    }

    const renderMinicartProductResult = () => {
        if (disabled) {
            return (
                <Alert severity="error" sx={{ width: "100%" }}>
                    Товар недоступен в данный момент
                </Alert>
            );
        }
        if (promocodeProducts && promocodeProducts.id === productCart.id) {
            if (
                productCart.type === "variations" &&
                promocodeProducts.type === "variations"
            ) {
                if (
                    productCart.variant.variant_id ==
                    promocodeProducts.variant.variant_id
                ) {
                    if (
                        productCart.options._promocode_price ||
                        productCart.options._promocode_price == 0
                    ) {
                        return (
                            <>
                                <span>
                                    <span className="old-price">
                                        {productCart.options._price} ₽
                                    </span>
                                    &nbsp;
                                    <span className="main-color">
                                        {productCart.options._promocode_price} ₽
                                    </span>
                                </span>
                            </>
                        );
                    } else {
                        return (
                            <span>
                                {parseInt(
                                    productCart.options._price
                                ).toLocaleString("ru-RU")}{" "}
                                &#8381;
                            </span>
                        );
                    }
                } else {
                    return (
                        <span>
                            {parseInt(
                                productCart.options._price
                            ).toLocaleString("ru-RU")}{" "}
                            &#8381;
                        </span>
                    );
                }
            } else {
                return (
                    <span>
                        <span className="old-price">
                            {productCart.options._price * productCount} ₽
                        </span>
                        &nbsp;
                        <span className="main-color">
                            {productTotalPrice} ₽
                        </span>
                    </span>
                );
            }
        }

        if (parseInt(productCart.options._promocode_price)) {
            if (productCart.type === "variations") {
                return (
                    <span>
                        <span className="old-price">
                            {productCart.options._price} ₽
                        </span>
                        &nbsp;
                        <span className="main-color">
                            {Math.ceil(productCart.options._promocode_price)} ₽
                        </span>
                    </span>
                );
            } else {
                return (
                    <span>
                        <span className="old-price">
                            {productCart.options._price * productCount} ₽
                        </span>
                        &nbsp;
                        <span className="main-color">
                            {productTotalPrice} ₽
                        </span>
                    </span>
                );
            }
        }
        if (
            parseInt(productCart.options._regular_price) >
            parseInt(productCart.options._price)
        ) {
            return (
                <span>
                    <span className="old-price">
                        {productCart.options._regular_price * productCount} ₽
                    </span>
                    &nbsp;
                    <span className="main-color">{productTotalPrice} ₽</span>
                </span>
            );
        }

        if (productCart.type === "variations") {
            return (
                <span>
                    {parseInt(productCart.options._price).toLocaleString(
                        "ru-RU"
                    )}{" "}
                    &#8381;
                </span>
            );
        }
        return (
            <span>
                {parseInt(productTotalPrice).toLocaleString("ru-RU")} &#8381;
            </span>
        );
    };

    const minicartProductResult = renderMinicartProductResult();

    return (
        <div className="minicart--product" data-product_id={productCart.id}>
            <div className="minicart--product-info">
                <div className="minicart--product-image">
                    <img
                        src={productCart.img ? productCart.img : soon}
                        alt={productCart.title}
                    />
                </div>
                <div className="minicart--product-inner">
                    <div className="minicart--product-name">
                        {productCart.title}
                    </div>
                    <div className="minicart--product-info">
                        {productCart.type === "variations" ? (
                            <div className="minicart--product-attributes">
                                {Object.values(
                                    productCart.variant.attributes
                                ).map((attribute, keyAttr) => (
                                    <div
                                        className="minicart--product-attribute"
                                        key={keyAttr}
                                    >
                                        {dataAttributes[keyAttr]}: {attribute}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <>
                                {productCart.options.weight ? (
                                    <div className="weight">
                                        {productCart.options.weight} гр.
                                    </div>
                                ) : (
                                    ""
                                )}
                                {productCart.options.count_rolls ? (
                                    <div className="count-rolls">
                                        {productCart.options.count_rolls} шт.
                                    </div>
                                ) : (
                                    ""
                                )}
                            </>
                        )}
                    </div>
                    {/* <div className="minicart--product-price">{productCart.options._price.toLocaleString('ru-RU')} &#8381;</div> */}

                    <div
                        className="minicart--product-remove"
                        onClick={handleRemoveProduct}
                        data-product_id={productCart.id}
                    >
                        <CloseIcon />
                    </div>
                </div>
            </div>
            {/* <div className="minicart--product-result">
                {disabled ? (
                    <Alert severity="error" sx={{ width: "100%" }}>
                        Товар недоступен в данный момент
                    </Alert>
                ) : promocodeProducts.id !== undefined &&
                  promocodeProducts.id === productCart.id ? (
                    productCart.type === "variations" &&
                    promocodeProducts.type === "variations" &&
                    productCart.variant.variant_id ==
                        promocodeProducts.variant.variant_id &&
                    !productIndex ? (
                        <>
                            <span>
                                <span className="old-price">
                                    {productCart.options._price} ₽
                                </span>
                                &nbsp;
                                <span className="main-color">
                                    {productCart.options._promocode_price} ₽
                                </span>
                            </span>
                        </>
                    ) : (
                        <>
                            {productCart.type !== "variations" &&
                            productCart.id === promocodeProducts.id ? (
                                <span>
                                    <span className="old-price">
                                        {productCart.options._price *
                                            productCount}{" "}
                                        ₽
                                    </span>
                                    &nbsp;
                                    <span className="main-color">
                                        {productTotalPrice} ₽
                                    </span>
                                </span>
                            ) : (
                                <span>
                                    {parseInt(productTotalPrice).toLocaleString(
                                        "ru-RU"
                                    )}{" "}
                                    &#8381;
                                </span>
                            )}

                            {productCart.type !== "variations" && (
                                <div className="minicart--product-quantity">
                                    <Button
                                        className="btn--default product-decrease"
                                        onClick={handleDecreaseProduct}
                                    >
                                        -
                                    </Button>
                                    <input
                                        className="quantity"
                                        type="text"
                                        readOnly
                                        value={productCount}
                                        data-product_id={productCart.id}
                                    />
                                    <Button
                                        className="btn--default product-add"
                                        onClick={handleAddProduct}
                                    >
                                        +
                                    </Button>
                                </div>
                            )}
                        </>
                    )
                ) : (
                    <>
                        {parseInt(productCart.options._promocode_price) ? (
                            <span>
                                <span className="old-price">
                                    {productCart.options._price * productCount}{" "}
                                    ₽
                                </span>
                                &nbsp;
                                <span className="main-color">
                                    {productTotalPrice} ₽
                                </span>
                            </span>
                        ) : parseInt(productCart.options._regular_price) >
                          parseInt(productCart.options._price) ? (
                            <span>
                                <span className="old-price">
                                    {productCart.options._regular_price *
                                        productCount}{" "}
                                    ₽
                                </span>
                                &nbsp;
                                <span className="main-color">
                                    {productTotalPrice} ₽
                                </span>
                            </span>
                        ) : productCart.type === "variations" ? (
                            <span>
                                {parseInt(
                                    productCart.options._price
                                ).toLocaleString("ru-RU")}{" "}
                                &#8381;
                            </span>
                        ) : (
                            <span>
                                {parseInt(productTotalPrice).toLocaleString(
                                    "ru-RU"
                                )}{" "}
                                &#8381;
                            </span>
                        )}

                        {productCart.type !== "variations" && (
                            <div className="minicart--product-quantity">
                                <Button
                                    className="btn--default product-decrease"
                                    onClick={handleDecreaseProduct}
                                >
                                    -
                                </Button>
                                <input
                                    className="quantity"
                                    type="text"
                                    readOnly
                                    value={productCount}
                                    data-product_id={productCart.id}
                                />
                                <Button
                                    className="btn--default product-add"
                                    onClick={handleAddProduct}
                                >
                                    +
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div> */}
            <div className="minicart--product-result">
                {minicartProductResult}
                {productCart.type !== "variations" && (
                    <div className="minicart--product-quantity">
                        <Button
                            className="btn--default product-decrease"
                            onClick={handleDecreaseProduct}
                        >
                            -
                        </Button>
                        <input
                            className="quantity"
                            type="text"
                            readOnly
                            value={productCount}
                            data-product_id={productCart.id}
                        />
                        <Button
                            className="btn--default product-add"
                            onClick={handleAddProduct}
                        >
                            +
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
