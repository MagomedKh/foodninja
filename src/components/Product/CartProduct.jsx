import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addProductToCart,
    decreaseProductInCart,
    removeProductFromCart,
} from "../../redux/actions/cart";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import "../../css/cart.css";
import soon from "../../img/photo-soon.svg";

export default function CartProduct({
    productCart,
    productCount,
    productTotalPrice,
    productIndex,
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
        <div className="cart--product" data-product_id={productCart.id}>
            <div className="cart--product-image">
                <img
                    src={productCart.img ? productCart.img : soon}
                    alt={productCart.title}
                />
            </div>

            <div className="cart--product-inner">
                <div className="cart--product-name">
                    {productCart.title}

                    <div className="cart--product-description">
                        {productCart.type === "variations" && (
                            <div>
                                {productCart.variant.mini_description ? (
                                    <>{productCart.variant.mini_description}</>
                                ) : (
                                    Object.values(
                                        productCart.variant.attributes
                                    ).map((attribute, keyAttr) => (
                                        <div key={keyAttr}>
                                            {dataAttributes[keyAttr]}:{" "}
                                            {attribute}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {productCart.choosenModificators?.length ? (
                            <div>
                                +{" "}
                                {productCart.choosenModificators.map(
                                    (el, inx, array) =>
                                        inx !== array.length - 1 ? (
                                            <span key={el.id}>
                                                {el.title} {el.count} шт,{" "}
                                            </span>
                                        ) : (
                                            <span key={el.id}>
                                                {el.title} {el.count} шт
                                            </span>
                                        )
                                )}
                            </div>
                        ) : null}
                    </div>

                    <div className="product--info">
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
                    </div>
                </div>

                <div className="product--quantity">
                    {productCart.type !== "variations" && (
                        <>
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
                        </>
                    )}
                </div>

                {/* <div className="cart--product-result">
                    {promocodeProducts.id !== undefined &&
                    promocodeProducts.id === productCart.id ? (
                        productCart.type === "variations" &&
                        promocodeProducts.type === "variations" &&
                        productCart.variant.variant_id ==
                            promocodeProducts.variant.variant_id &&
                        !productIndex ? (
                            <>
                                <span>
                                    <span className="old-price">
                                        {parseInt(
                                            productTotalPrice
                                        ).toLocaleString("ru-RU")}{" "}
                                        &#8381;
                                    </span>
                                    &nbsp;
                                    <span className="main-color">
                                        {parseInt(
                                            productTotalPrice -
                                                (productCart.options._price -
                                                    promocode.productPrice)
                                        ).toLocaleString("ru-RU")}{" "}
                                        &#8381;
                                    </span>
                                </span>
                            </>
                        ) : (
                            <>
                                {productCart.type !== "variations" &&
                                productCart.id === promocodeProducts.id ? (
                                    <span>
                                        <span className="old-price">
                                            {parseInt(
                                                productTotalPrice
                                            ).toLocaleString("ru-RU")}{" "}
                                            &#8381;
                                        </span>
                                        &nbsp;
                                        <span className="main-color">
                                            {parseInt(
                                                productTotalPrice -
                                                    (productCart.options
                                                        ._price -
                                                        promocode.productPrice)
                                            ).toLocaleString("ru-RU")}{" "}
                                            &#8381;
                                        </span>
                                    </span>
                                ) : productTotalPrice ? (
                                    parseInt(productTotalPrice).toLocaleString(
                                        "ru-RU"
                                    ) + " ₽"
                                ) : (
                                    <span className="main-color">Подарок</span>
                                )}
                            </>
                        )
                    ) : (
                        <>
                            {parseInt(productCart.options._promocode_price) ? (
                                <span>
                                    <span className="old-price">
                                        {productCart.options._price *
                                            productCount}{" "}
                                        ₽
                                    </span>
                                    &nbsp;
                                    <span className="main-color">
                                        {productCart.options._promocode_price *
                                            productCount}{" "}
                                        ₽
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
                                        {productCart.options._price *
                                            productCount}{" "}
                                        ₽
                                    </span>
                                </span>
                            ) : (
                                <>
                                    {productTotalPrice ? (
                                        parseInt(
                                            productTotalPrice
                                        ).toLocaleString("ru-RU") + " ₽"
                                    ) : (
                                        <span className="main-color">
                                            Подарок
                                        </span>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div> */}
                <div className="cart--product-result">
                    {minicartProductResult}
                </div>

                <div
                    className="cart--product-remove"
                    onClick={handleRemoveProduct}
                    data-product_id={productCart.id}
                >
                    <CloseIcon />
                </div>
            </div>
        </div>
    );
}
