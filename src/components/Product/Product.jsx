import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addProductToCart,
    decreaseProductInCart,
    removeProductFromCart,
} from "../../redux/actions/cart";
import {
    setModalProduct,
    setOpenModal,
} from "../../redux/actions/productModal";
import { Button } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import ProductImage from "./ProductImage";
import PlaceholderImageProduct from "./PlaceholderImageProduct";
import LazyLoad from "react-lazyload";
import { _getPlatform, _isMobile } from "../helpers";
import "../../css/product.css";
import soon from "../../img/photo-soon.svg";
import clsx from "clsx";

export default function Product({ product, disabled }) {
    const dispatch = useDispatch();

    const { cartProducts, categoryNew, categoryHit, productLayout } =
        useSelector(({ cart, config }) => {
            return {
                cartProducts: cart.items,
                categoryNew: config.data.CONFIG_new_category,
                categoryHit: config.data.CONFIG_hit_category,
                productLayout: config.data.CONFIG_type_products,
            };
        });

    const openModalBtnClick = () => {
        window.location.hash = "product-modal";
        dispatch(
            setModalProduct({
                ...product,
                disabled: disabled,
            })
        );
        dispatch(setOpenModal(true));
    };

    const handleAddProduct = () => {
        dispatch(addProductToCart(product));
    };
    const handleDecreaseProduct = () => {
        dispatch(decreaseProductInCart(product));
    };

    const hasRequiredModificator = product.product_addons?.find(
        (modificator) => modificator.required === "yes"
    );

    return (
        <div
            className={clsx(
                "product-grid-item",
                productLayout === "one" && "one-layout"
            )}
        >
            <div className="product product-item">
                <div className="product--labels-wrapper">
                    {product.options?._count_peoples ? (
                        <div className="product--label peoples">
                            <GroupIcon />
                            {product.options._count_peoples}
                        </div>
                    ) : null}
                    {product.categories.includes(parseInt(categoryHit)) && (
                        <div className="product--label hit">ХИТ</div>
                    )}
                    {product.categories.includes(parseInt(categoryNew)) && (
                        <div className="product--label new">NEW</div>
                    )}
                    {/* { product.tags && (
            <div className="product--stickers">
                { Object.values(product.tags).map( (tag) =>
                  <div 
                    className="product--label peoples"
                    style={{backgroundColor: tag.tag_color ? tag.tag_color : '#F3F3F3', color: tag.tag_font_color ? tag.tag_font_color : '#000000'}}>
                    {tag.name}
                  </div>
                ) }
            </div>
          ) } */}
                </div>
                <div
                    className="product--image viewProduct"
                    onClick={openModalBtnClick}
                >
                    {_getPlatform() === "vk" ? (
                        <img alt={product.title} src={product.img} />
                    ) : (
                        <LazyLoad
                            height={210}
                            placeholder={<PlaceholderImageProduct />}
                            once
                            offset={500}
                        >
                            <ProductImage
                                product={product}
                                disabled={disabled}
                            />
                        </LazyLoad>
                    )}
                </div>

                <div className="product--inner-wrapper">
                    <h4
                        className="product--title viewProduct"
                        onClick={openModalBtnClick}
                    >
                        {product.title}
                    </h4>
                    <div
                        className="product--description viewProduct"
                        onClick={openModalBtnClick}
                    >
                        <div
                            dangerouslySetInnerHTML={{
                                __html: product.content,
                            }}
                        ></div>
                        <div className="short-fade"></div>
                    </div>
                    <div className="action viewProduct">
                        <span
                            onClick={openModalBtnClick}
                            data-product-id={product.id}
                        >
                            Подробнее
                        </span>
                    </div>
                    <div className="product--buying">
                        <div className="product--price-wrapper">
                            <div className="product--price">
                                {product.type === "variations" ||
                                hasRequiredModificator ? (
                                    <span className="product--standart-price">
                                        от {product.options._price} ₽
                                    </span>
                                ) : parseInt(product.options._regular_price) >
                                  parseInt(product.options._price) ? (
                                    <span className="product--sales">
                                        <span className="product--old-price">
                                            {product.options._regular_price} ₽
                                        </span>
                                        <span className="product--sale-price main-color">
                                            {product.options._price} ₽
                                        </span>
                                    </span>
                                ) : (
                                    <span className="product--standart-price">
                                        {product.options._price} ₽
                                    </span>
                                )}
                            </div>
                            <div className="product--info">
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
                        {product.type === "variations" ||
                        hasRequiredModificator ? (
                            <Button
                                variant="button"
                                className="btn--action btn-buy"
                                onClick={openModalBtnClick}
                                disabled={disabled}
                            >
                                {_isMobile() ? "Хочу" : "Выбрать"}
                            </Button>
                        ) : !cartProducts[product.id] ? (
                            <Button
                                variant="button"
                                className="btn--action btn-buy"
                                onClick={handleAddProduct}
                                disabled={disabled}
                            >
                                Хочу
                            </Button>
                        ) : (
                            <div className="product--quantity">
                                <Button
                                    className="btn--default product-decrease"
                                    onClick={handleDecreaseProduct}
                                    disabled={disabled}
                                >
                                    -
                                </Button>
                                <input
                                    className="quantity"
                                    type="text"
                                    readOnly
                                    value={
                                        cartProducts[product.id].items.length
                                    }
                                    data-product_id={product.id}
                                />
                                <Button
                                    className="btn--default product-add"
                                    onClick={handleAddProduct}
                                    disabled={disabled}
                                >
                                    +
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
