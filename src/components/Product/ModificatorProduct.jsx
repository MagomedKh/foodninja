import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addProductModificator,
    decreaseProductModificator,
} from "../../redux/actions/productModal";
import Button from "@mui/material/Button";
import "../../css/product.css";
import "../../css/addon-product.css";
import soon from "../../img/photo-soon.svg";

const ModificatorProduct = ({ product }) => {
    const dispatch = useDispatch();

    const { cartProducts } = useSelector(({ cart }) => {
        return {
            cartProducts: cart.items,
        };
    });

    const { productModal } = useSelector((state) => state.productModal);

    const existModificator = productModal.choosenModificators.find(
        (el) => el.id === product.id
    );

    const handleAddModificator = () => {
        dispatch(addProductModificator({ ...product, count: 1 }));
    };
    const handleDecreaseModificator = () => {
        dispatch(decreaseProductModificator(product));
    };

    return (
        <div className="addon-product addon-product-modal">
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
                    {product.options._price} &#8381;
                </div>
                {!existModificator ? (
                    <Button
                        className="btn--outline btn-buy"
                        onClick={handleAddModificator}
                    >
                        Хочу
                    </Button>
                ) : (
                    <div className="product--quantity">
                        <Button
                            className="btn--default product-decrease"
                            onClick={handleDecreaseModificator}
                        >
                            -
                        </Button>
                        <input
                            className="quantity"
                            type="text"
                            readOnly
                            value={existModificator.count}
                        />
                        <Button
                            className="btn--default product-add"
                            onClick={handleAddModificator}
                        >
                            +
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModificatorProduct;
