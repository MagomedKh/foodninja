import React from "react";
import { useDispatch } from "react-redux";
import { addBonusProductToCart } from "../../redux/actions/cart";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import "../../css/cart.css";
import soon from "../../img/photo-soon.svg";

export default function MiniCartBonusProduct({
    productCart,
    productCount,
    productTotalPrice,
}) {
    const dispatch = useDispatch();

    const handleChooseBonusProduct = (item) => {
        dispatch(addBonusProductToCart(item));
    };

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
                    {/* <div className="minicart--product-price">{productCart.options._price.toLocaleString('ru-RU')} &#8381;</div> */}

                    <div
                        className="minicart--product-remove"
                        onClick={() => handleChooseBonusProduct({})}
                        data-product_id={productCart.id}
                    >
                        <CloseIcon />
                    </div>
                </div>
            </div>
            <div className="minicart--product-result">
                <span>
                    <strike>
                        {parseInt(productTotalPrice).toLocaleString("ru-RU")}{" "}
                        &#8381;
                    </strike>{" "}
                    <span className="main-color">Подарок</span>
                </span>

                <div className="minicart--product-quantity">
                    <Button
                        className="btn--default product-decrease"
                        onClick={() => handleChooseBonusProduct({})}
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
                    <Button className="btn--default product-add" disabled>
                        +
                    </Button>
                </div>
            </div>
        </div>
    );
}
