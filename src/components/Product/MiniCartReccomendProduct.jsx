import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProductToCart } from "../../redux/actions/cart";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import "../../css/recommend-product.css";
import soon from "../../img/photo-soon.svg";
import {
    setModalProduct,
    setOpenModal,
} from "../../redux/actions/productModal";
import clsx from "clsx";

export default function MiniCartReccomendProduct({ product }) {
    const dispatch = useDispatch();

    const handleAddProduct = () => {
        dispatch(addProductToCart(product));
    };

    const openModalBtnClick = () => {
        window.location.hash = "product-modal";
        dispatch(
            setModalProduct({
                ...product,
            })
        );
        dispatch(setOpenModal(true));
    };

    return (
        <div
            className={clsx(
                product.type === "simple" && "btn-buy",
                "product recommend-product"
            )}
            data-product-id={product.id}
            onClick={
                product.type === "variations"
                    ? openModalBtnClick
                    : handleAddProduct
            }
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
                        {product.type === "variations" && "от "}
                        {product.options._price.toLocaleString("ru-RU")} &#8381;
                    </div>
                </div>
            </div>
        </div>
    );
}
