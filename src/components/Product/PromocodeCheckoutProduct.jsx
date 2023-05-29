import React from "react";
import "../../css/checkout.css";

export default function PromocodeCheckoutProduct({
    productCart,
    productCount,
    productTotalPrice,
}) {
    let dataAttributes = {};
    if (productCart.attributes) {
        Object.values(productCart.attributes).forEach((value, index) => {
            dataAttributes[index] = value.name;
        });
    }

    return (
        <div className="checkout--product" data-product-id={productCart.id}>
            <div className="checkout--product-name">
                {productCart.title} x {productCount} шт.
                {productCart.type === "variations" && (
                    <div className="minicart--product-attributes">
                        {Object.values(productCart.variant.attributes).map(
                            (attribute, keyAttr) => (
                                <div
                                    className="minicart--product-attribute"
                                    key={keyAttr}
                                >
                                    {dataAttributes[keyAttr]}: {attribute}
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>

            <div className="checkout--product-result">
                <span className="before-promocode-price">
                    {productCart.options._price} &#8381;
                </span>{" "}
                <span className="main-color">
                    {parseInt(productTotalPrice).toLocaleString("ru-RU")}{" "}
                    &#8381;
                </span>
            </div>
        </div>
    );
}
