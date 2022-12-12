import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addProductModificator,
    decreaseProductModificator,
} from "../../redux/actions/modificators";
import Button from "@mui/material/Button";
import "../../css/product.css";
import "../../css/addon-product.css";
import soon from "../../img/photo-soon.svg";

const ModificatorProduct = ({ product, disabledAddButton }) => {
    const dispatch = useDispatch();

    const { choosenModificators } = useSelector((state) => state.modificators);

    const existModificator = useMemo(
        () => choosenModificators.find((el) => el.id === product.id),
        [choosenModificators]
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
            onClick={handleAddModificator}
        >
            <div className="modificator-product--image">
                <img
                    className="lazyload-image"
                    src={product.img ? product.img : soon}
                    alt={product.title}
                />
            </div>

            <h4 className="modificator-product--title">{product.title}</h4>
            <div className="modificator-product--buying">
                <div className="modificator-product--price">
                    {product.options._price} &#8381;
                </div>
                {!existModificator ? (
                    <Button
                        className="btn--outline btn-buy"
                        onClick={(event) => {
                            event.stopPropagation();
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
                                event.stopPropagation();
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
                            onClick={(event) => {
                                event.stopPropagation();
                            }}
                        />
                        <Button
                            className="btn--default product-add"
                            onClick={(event) => {
                                event.stopPropagation();
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
