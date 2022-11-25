import React from "react";
import { useSelector } from "react-redux";
import "../../css/checkout.css";

export default function CheckoutProduct({
    productCart,
    productCount,
    productTotalPrice,
    productIndex,
}) {
    let dataAttributes = {};
    if (productCart.attributes) {
        Object.values(productCart.attributes).forEach((value, index) => {
            dataAttributes[index] = value.name;
        });
    }

    const { promocodeProducts, promocode } = useSelector(({ cart }) => {
        return {
            promocodeProducts: cart.promocodeProducts,
            promocode: cart.promocode,
        };
    });

    return (
        <div className="checkout--product" data-product_id={productCart.id}>
            <div className="checkout--product-name">
                {productCart.title} x {productCount} шт.
                <br />
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
                {productCart.choosenModificators?.length ? (
                    <div className="minicart--product-attributes">
                        +{" "}
                        {productCart.choosenModificators.map((el, inx, array) =>
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

            <div className="checkout--product-result">
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
                                    {parseInt(productTotalPrice).toLocaleString(
                                        "ru-RU"
                                    )}{" "}
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
                                                (productCart.options._price -
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
                        {productTotalPrice ? (
                            parseInt(productTotalPrice).toLocaleString(
                                "ru-RU"
                            ) + " ₽"
                        ) : (
                            <span className="main-color">Подарок</span>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
