import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProductToCart } from "../../redux/actions/cart";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import "../../css/recommend-product.css";
import soon from "../../img/photo-soon.svg";

export default function MiniCartReccomendProduct({ product }) {
    const dispatch = useDispatch();
    const { cartProducts } = useSelector(({ cart }) => {
        return {
            cartProducts: cart.items,
        };
    });

    const handleAddProduct = () => {
        dispatch(addProductToCart(product));
    };

    return (
        <div
            className="product recommend-product"
            data-product_id={product.id}
            onClick={handleAddProduct}
        >
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
                </div>
            </div>
        </div>
    );
}
