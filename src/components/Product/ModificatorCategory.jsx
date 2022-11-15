import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addProductToCart,
    decreaseProductInCart,
} from "../../redux/actions/cart";
import Button from "@mui/material/Button";
import "../../css/product.css";
import "../../css/addon-product.css";
import soon from "../../img/photo-soon.svg";
import ModificatorProduct from "./ModificatorProduct";

const ModificatorCategory = ({ category }) => {
    const { items: products } = useSelector((state) => state.products);

    const modificatorProducts = [].concat.apply(
        [],
        Object.values(products).filter((obj) =>
            category.products.includes(obj.id)
        )
    );

    return (
        <div className="addon-products" key={category.category_id}>
            <h3 className="addon-products--title">{category.category_title}</h3>
            <div className="addon-products--grid-list">
                {modificatorProducts.map((product) => (
                    <ModificatorProduct key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default ModificatorCategory;
