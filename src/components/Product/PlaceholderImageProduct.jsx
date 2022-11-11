import React from "react";
import LazyLoadImageSvg from "../../img/lazy-load.svg";

export default function PlaceholderImageProduct() {
    return (
        <div className="placeholder">
            <img src={LazyLoadImageSvg} alt={"LazyImgPlaceholder"} />
        </div>
    );
}
