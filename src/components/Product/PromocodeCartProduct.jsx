import React from "react";
import { useDispatch } from "react-redux";
import { removePromocode } from "../../redux/actions/cart";
import DeleteIcon from "@mui/icons-material/Delete";
import "../../css/cart.css";
import soon from "../../img/photo-soon.svg";

export default function PromocodeCartProduct({
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
        <div
            className="cart--product promocode-product"
            data-product-id={productCart.id}
        >
            <div className="cart--product-image">
                <img
                    src={productCart.img ? productCart.img : soon}
                    alt={productCart.title}
                />
            </div>

            <div className="cart--product-inner">
                <div className="cart--product-name">
                    {productCart.title}

                    <div className="product--info">
                        {productCart.type === "variations" ? (
                            <div className="cart--product-attributes">
                                {Object.values(
                                    productCart.variant.attributes
                                ).map((attribute, keyAttr) => (
                                    <div
                                        className="cart--product-attribute"
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
                </div>

                <div className="product--quantity"></div>

                <div className="cart--product-result">
                    <span className="before-promocode-price">
                        {productCart.options._price} &#8381;
                    </span>
                    <br />
                    <span className="main-color">
                        {parseInt(productTotalPrice).toLocaleString("ru-RU")}{" "}
                        &#8381;
                    </span>
                </div>

                <div
                    className="cart--product-remove"
                    onClick={handleRemovePromocodeProduct}
                    data-product-id={productCart.id}
                >
                    <DeleteIcon />
                </div>
            </div>
        </div>
    );
}
