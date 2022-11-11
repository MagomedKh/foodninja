import React from "react";
import "../../css/product.css";
import "../../css/bonus-product.css";
import soon from "../../img/photo-soon.svg";

export default function BonusProduct({ product }) {
    return (
        <div className="bonus-product">
            <div className="bonus-product--image">
                <img
                    className="lazyload-image"
                    src={product.img ? product.img : soon}
                    alt={product.title}
                />
            </div>

            <div>
                <h4 className="bonus-product--title">{product.title}</h4>
                <div className="bonus-product--info">
                    {product.options.weight ? (
                        <div className="weight">
                            {product.options.weight} гр.
                        </div>
                    ) : (
                        ""
                    )}
                    {product.options.count_rolls ? (
                        <div className="count-rolls">
                            {product.options.count_rolls} шт.
                        </div>
                    ) : (
                        ""
                    )}
                </div>
            </div>
        </div>
    );
}
