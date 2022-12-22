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

    const renderCheckoutProductResult = () => {
        // Цена по промокоду на товар в подарок
        if (promocodeProducts && promocodeProducts.id === productCart.id) {
            if (
                productCart.type === "variations" &&
                promocodeProducts.type === "variations"
            ) {
                if (
                    productCart.variant.variant_id ==
                    promocodeProducts.variant.variant_id
                ) {
                    if (productCart.options._promocode_price >= 0) {
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
                    }
                }
            } else if (
                productCart.choosenModificators?.length &&
                productCart.options._promocode_price
            ) {
                return (
                    <span>
                        <span className="old-price">
                            {productCart.options._price * productCount} ₽
                        </span>
                        &nbsp;
                        <span className="main-color">
                            {productCart.options._promocode_price} ₽
                        </span>
                    </span>
                );
            } else if (productCart.options._promocode_price >= 0) {
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

        // Цена по промокоду на %
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

        // Цена товара со скидкой
        if (
            productCart.type === "simple" &&
            parseInt(productCart.options._regular_price) >
                parseInt(productCart.options._sale_price)
        ) {
            return (
                <span>
                    <span className="old-price">
                        {productCart.options._regular_price * productCount +
                            (productCart.modificatorsAmount ?? 0)}{" "}
                        ₽
                    </span>
                    &nbsp;
                    <span className="main-color">{productTotalPrice} ₽</span>
                </span>
            );
        }
        if (
            productCart.type === "variations" &&
            parseInt(productCart.variant?._regular_price) >
                parseInt(productCart.variant?.price)
        ) {
            return (
                <span>
                    <span className="old-price">
                        {parseInt(productCart.variant?._regular_price) +
                            productCart.modificatorsAmount}{" "}
                        ₽
                    </span>
                    &nbsp;
                    <span className="main-color">
                        {productCart.options._price} ₽
                    </span>
                </span>
            );
        }

        // Цена без скидкой и промокодов
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
                {productCart.type === "variations" ? (
                    productCart.variant.weight && (
                        <div className="minicart--product-attributes">
                            <div className="weight">
                                {productCart.variant.weight} гр.
                            </div>
                        </div>
                    )
                ) : (
                    <div className="minicart--product-attributes">
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
                )}
            </div>

            {/* <div className="checkout--product-result">
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
            </div> */}
            <div className="checkout--product-result">
                {renderCheckoutProductResult()}
            </div>
        </div>
    );
}
