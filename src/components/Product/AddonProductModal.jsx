import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addProductToCart,
    decreaseProductInCart,
} from "../../redux/actions/cart";
import Button from "@mui/material/Button";
import "../../css/product.css";
import soon from "../../img/photo-soon.svg";

export default function AddonProductModal({ product }) {
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
        <div
            className={`addon-product addon-product-modal ${
                cartProducts[product.id] ? "addon-product-active" : ""
            }`}
            onClick={handleAddProduct}
        >
            <div className="addon-product--image">
                <img
                    className="lazyload-image"
                    src={product.img ? product.img : soon}
                    alt={product.title}
                />
            </div>

            <h4 className="addon-product--title">{product.title}</h4>
            <div className="addon-product--buying">
                <div className="addon-product--price">
                    +{product.options._price} &#8381;
                </div>
                {!cartProducts[product.id] ? (
                    <Button
                        className="btn--outline btn-buy"
                        onClick={(event) => {
                            event.stopPropagation();
                            handleAddProduct();
                        }}
                    >
                        Хочу
                    </Button>
                ) : (
                    <div className="product--quantity">
                        <Button
                            className="btn--default product-decrease"
                            onClick={(event) => {
                                event.stopPropagation();
                                handleDecreaseProduct();
                            }}
                        >
                            -
                        </Button>
                        <input
                            className="quantity"
                            type="text"
                            readOnly
                            value={cartProducts[product.id].items.length}
                        />
                        <Button
                            className="btn--default product-add"
                            onClick={(event) => {
                                event.stopPropagation();
                                handleAddProduct();
                            }}
                        >
                            +
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
