import React, { useState, useEffect } from "react";
import soon from "../../img/photo-soon.svg";
import PlaceholderImageProduct from "./PlaceholderImageProduct";

const ProductImage = ({ product, disabled }) => {
    const [imageStatus, setImageStatus] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.src = product.img ? product.img : soon;
        img.onload = () => {
            setImageStatus(true);
        };
        return () => {
            img.src = "";
        };
    }, []);

    return (
        <>
            {!imageStatus ? (
                <PlaceholderImageProduct />
            ) : (
                <img
                    alt={product.title}
                    src={product.img ? product.img : soon}
                    style={{
                        filter: disabled ? "grayscale(1)" : "",
                    }}
                />
            )}
        </>
    );
};

export default ProductImage;
