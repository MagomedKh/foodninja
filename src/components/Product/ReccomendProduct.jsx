import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addProductToCart,
    decreaseProductInCart,
} from "../../redux/actions/cart";
import Button from "@mui/material/Button";
import "../../css/recommend-product.css";
import soon from "../../img/photo-soon.svg";

export default function ReccomendProduct({ product }) {
    const dispatch = useDispatch();
    const { cartProducts } = useSelector(({ cart }) => {
        return {
            cartProducts: cart.items,
        };
    });

    const handleAddProduct = () => {
        dispatch(addProductToCart(product));
    };
    const handleDecreaseProduct = () => {
        dispatch(decreaseProductInCart(product));
    };

    return (
        <div className="product recommend-product" data-product-id={product.id}>
            <div className="product-image">
                <img
                    src={product.img ? product.img : soon}
                    alt={product.title}
                />
            </div>

            <div className="right-block">
                <div className="product-name">{product.title}</div>

                <div className="product--buying">
                    <div className="product--price">
                        {product.options._price.toLocaleString("ru-RU")} &#8381;
                    </div>

                    {!cartProducts[product.id] ? (
                        <Button
                            className="btn--outline btn-buy"
                            onClick={handleAddProduct}
                            data-product-id={product.id}
                        >
                            Хочу
                        </Button>
                    ) : (
                        <div className="product--quantity">
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
                                value={cartProducts[product.id].items.length}
                                data-product-id={product.id}
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
        </div>
    );
}
