import React from "react";
import { useDispatch } from "react-redux";
import { removePromocode } from "../../redux/actions/cart";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import soon from "../../img/photo-soon.svg";

export default function PromocodeMiniCartProduct({
    productCart,
    productCount,
    productTotalPrice,
}) {
    const dispatch = useDispatch();

    const handleRemovePromocodeProduct = () => {
        dispatch(removePromocode());
    };

    let dataAttributes = {};
    if (productCart.attributes) {
        Object.values(productCart.attributes).forEach((value, index) => {
            dataAttributes[index] = value.name;
        });
    }

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
                        onClick={handleRemovePromocodeProduct}
                        data-product_id={productCart.id}
                    >
                        <CloseIcon />
                    </div>
                </div>
            </div>
            <div className="minicart--product-result">
                <span>
                    <span className="product--old-price">
                        {parseInt(productCart.options._price).toLocaleString(
                            "ru-RU"
                        )}{" "}
                        ₽
                    </span>{" "}
                    <span className="main-color">
                        {parseInt(productTotalPrice).toLocaleString("ru-RU")}{" "}
                        &#8381;
                    </span>
                </span>

                <div className="minicart--product-quantity"></div>
            </div>
        </div>
    );
}
