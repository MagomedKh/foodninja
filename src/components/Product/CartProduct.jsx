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

                    {productCart.type === "variations" && (
                        <div className="minicart--product-attributes">
                            {productCart.variant.mini_description ? (
                                <>{productCart.variant.mini_description}</>
                            ) : (
                                Object.values(
                                    productCart.variant.attributes
                                ).map((attribute, keyAttr) => (
                                    <div
                                        className="minicart--product-attribute"
                                        key={keyAttr}
                                    >
                                        {dataAttributes[keyAttr]}: {attribute}
                                    </div>
                                ))
                            )}
                        </div>
                    )}

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

                <div className="cart--product-result">
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
                            {parseInt(productCart.options._regular_price) >
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
                </div>

                <a
                    className="cart--product-remove"
                    onClick={handleRemoveProduct}
                    data-product_id={productCart.id}
                >
                    <CloseIcon />
                </a>
            </div>
        </div>
    );
}
