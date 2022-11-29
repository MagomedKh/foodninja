import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addProductModificator,
    decreaseProductModificator,
} from "../../redux/actions/productModal";
import Button from "@mui/material/Button";
import "../../css/product.css";
import "../../css/addon-product.css";
import soon from "../../img/photo-soon.svg";

const ModificatorProduct = ({ product, disabledAddButton }) => {
    const dispatch = useDispatch();

    const { productModal } = useSelector((state) => state.productModal);

    const existModificator = useMemo(
        () =>
            productModal.choosenModificators.find((el) => el.id === product.id),
        [productModal]
    );

    const handleAddModificator = () => {
        if (disabledAddButton) {
            return;
        }
        dispatch(addProductModificator({ ...product, count: 1 }));
    };
    const handleDecreaseModificator = () => {
        dispatch(decreaseProductModificator(product));
    };

    return (
        <div
            className={`modificator-product modificator-product-modal ${
                existModificator ? "modificator-product-active" : ""
            }`}
        >
            <div
                className="modificator-product--image"
                onClick={handleAddModificator}
            >
                <img
                    className="lazyload-image"
                    src={product.img ? product.img : soon}
                    alt={product.title}
                />
            </div>

            <h4
                className="modificator-product--title"
                onClick={handleAddModificator}
            >
                {product.title}
            </h4>
            <div className="modificator-product--buying">
                <div
                    className="modificator-product--price"
                    onClick={handleAddModificator}
                >
                    {product.options._price} &#8381;
                </div>
                {!existModificator ? (
                    <Button
                        className="btn--outline btn-buy"
                        onClick={(event) => {
                            handleAddModificator();
                        }}
                        disabled={disabledAddButton}
                    >
                        Хочу
                    </Button>
                ) : (
                    <div className="product--quantity">
                        <Button
                            className="btn--default product-decrease"
                            onClick={(event) => {
                                handleDecreaseModificator();
                            }}
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
                            onClick={(event) => {
                                handleAddModificator();
                            }}
                            disabled={disabledAddButton}
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
