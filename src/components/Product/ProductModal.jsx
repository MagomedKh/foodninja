import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { _clone, _getPlatform, _isMobile } from "../../components/helpers.js";
import {
    addProductToCart,
    decreaseProductInCart,
} from "../../redux/actions/cart";
import {
    setModalProduct,
    clearModalProduct,
    setOpenModal,
} from "../../redux/actions/productModal";
import { clearModificators } from "../../redux/actions/modificators";
import AddonProductModal from "../../components/Product/AddonProductModal";
import ModificatorCategory from "./ModificatorCategory.jsx";
import {
    Alert,
    Button,
    Collapse,
    Dialog,
    IconButton,
    Slide,
    ToggleButtonGroup,
    ToggleButton,
    Zoom,
    Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "../../css/product-modal.css";
import soon from "../../img/photo-soon.svg";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function ProductModal() {
    const dispatch = useDispatch();

    const { productModal, openProductModal, addon_products, cartProducts } =
        useSelector(({ productModal, products, cart }) => {
            return {
                productModal: productModal.productModal,
                openProductModal: productModal.openProductModal,
                addon_products: products.addon_items,
                cartProducts: cart.items,
            };
        });
    const {
        choosenModificators,
        emptyModificatorCategories,
        modificatorsAmount,
        modificatorsCondition,
    } = useSelector((state) => state.modificators);
    const { config } = useSelector(({ config }) => {
        return {
            config: config.data,
        };
    });
    const [choosenAttributes, setChoosenAttributes] = useState({});
    const [activeVariant, setActiveVariant] = useState(false);
    const [wrongVariant, setWrongVariant] = useState(false);

    useEffect(() => {
        let dataAttributes = {};
        if (productModal.type === "variations" && productModal.attributes) {
            Object.keys(productModal.attributes).forEach((value, index) => {
                dataAttributes[index] = Object.values(productModal.attributes)[
                    index
                ].options[0];
            });
            setChoosenAttributes(dataAttributes);
        }
        if (productModal.type === "variations" && productModal.variants) {
            let shouldSkip = false;
            let foundVariant = false;
            Object.values(productModal.variants).forEach(
                (variant, indexVariant) => {
                    let checkVariant = true;
                    if (shouldSkip) {
                        return;
                    }
                    Object.values(variant.attributes).forEach(
                        (attr, attrIndex) => {
                            if (dataAttributes[attrIndex] !== attr)
                                checkVariant = false;
                        }
                    );
                    if (checkVariant) {
                        setActiveVariant(variant);
                        shouldSkip = foundVariant = true;
                    }
                }
            );
            if (foundVariant) setWrongVariant(false);
            else setWrongVariant(true);
        }

        return;
    }, [productModal.attributes]);

    const handleChooseAttribute = (attribute, value) => {
        let dataAttributes = choosenAttributes;
        dataAttributes[attribute] = value;
        setChoosenAttributes({ ...choosenAttributes, dataAttributes });
        let shouldSkip = false;
        let foundVariant = false;
        Object.values(productModal.variants).forEach(
            (variant, indexVariant) => {
                let checkVariant = true;
                if (shouldSkip) {
                    return;
                }
                Object.values(variant.attributes).forEach((attr, attrIndex) => {
                    if (dataAttributes[attrIndex] !== attr)
                        checkVariant = false;
                });
                if (checkVariant) {
                    setActiveVariant(variant);
                    shouldSkip = foundVariant = true;
                }
            }
        );
        if (foundVariant) setWrongVariant(false);
        else setWrongVariant(true);
    };

    const handleClose = () => {
        dispatch(clearModalProduct());
        dispatch(clearModificators());
        setActiveVariant(false);
        setWrongVariant(false);
        dispatch(setOpenModal(false));
    };
    const handleAddProduct = () => {
        let product = _clone(productModal);
        dispatch(
            addProductToCart({
                ...product,
                choosenModificators: choosenModificators,

                modificatorsAmount: modificatorsAmount,
            })
        );
        dispatch(clearModificators());
        handleClose();
    };
    const handleAddVariantProduct = () => {
        let product = _clone(productModal);
        product.options._price = activeVariant.price;
        product.variant = activeVariant;
        dispatch(
            addProductToCart({
                ...product,
                choosenModificators: choosenModificators,
                modificatorsAmount: modificatorsAmount,
            })
        );
        dispatch(clearModificators());
        handleClose();
    };
    const handleDecreaseProduct = (productModal) => {
        dispatch(decreaseProductInCart(productModal));
    };

    let dialogProps = {
        open: openProductModal,
        maxWidth: "md",
    };
    if (_isMobile()) {
        dialogProps.TransitionComponent = Transition;
        dialogProps.fullScreen = true;
        dialogProps.scroll = "body";
    }

    const productPriceRender = () => {
        if (activeVariant) {
            if (
                parseInt(activeVariant._regular_price) >
                parseInt(activeVariant.price)
            ) {
                return (
                    <>
                        <span className="product--old-price">
                            {parseInt(activeVariant._regular_price) +
                                modificatorsAmount}
                            ₽
                        </span>
                        <span className="product--sale-price main-color">
                            {parseInt(activeVariant.price) + modificatorsAmount}{" "}
                            ₽
                        </span>
                    </>
                );
            } else {
                return (
                    <span>{activeVariant.price + modificatorsAmount} ₽</span>
                );
            }
        } else {
            if (
                parseInt(productModal.options?._regular_price) >
                parseInt(productModal.options?._price)
            ) {
                return (
                    <>
                        <span className="product--old-price">
                            {parseInt(productModal.options._regular_price) +
                                modificatorsAmount}{" "}
                            ₽
                        </span>
                        <span className="product--sale-price main-color">
                            {productModal.options._price + modificatorsAmount} ₽
                        </span>
                    </>
                );
            } else {
                return (
                    <span>
                        {parseInt(productModal.options._price) +
                            modificatorsAmount}{" "}
                        ₽
                    </span>
                );
            }
        }
    };

    return (
        <Dialog
            {...dialogProps}
            className={"product-modal-dialog"}
            onClose={(event, reason) => {
                if (reason === "escapeKeyDown") {
                    handleClose();
                }
            }}
        >
            {" "}
            {productModal ? (
                <div className="product-modal-wrapper">
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                        className={`modal-close ${
                            _getPlatform() === "vk" ? "vk" : ""
                        }`}
                        sx={{ zIndex: 1 }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <div className="product-modal">
                        <div className="product-modal--image">
                            <Zoom in={true}>
                                <img
                                    src={
                                        activeVariant && activeVariant.img
                                            ? activeVariant.img
                                            : productModal.img
                                            ? productModal.img
                                            : soon
                                    }
                                    alt={productModal.title}
                                    style={{
                                        filter: productModal.disabled
                                            ? "grayscale(1)"
                                            : "",
                                    }}
                                />
                            </Zoom>
                        </div>
                        <div className="product-modal--info">
                            <div className="product-modal--scrolling">
                                <h2 className="product-modal--title">
                                    {productModal.title}
                                </h2>

                                {productModal.type === "variations" ? (
                                    <>
                                        {activeVariant &&
                                        activeVariant.description ? (
                                            <div
                                                className="product-modal--description"
                                                data-product-id={
                                                    productModal.id
                                                }
                                                dangerouslySetInnerHTML={{
                                                    __html: activeVariant.description,
                                                }}
                                            ></div>
                                        ) : (
                                            <div
                                                className="product-modal--description"
                                                data-product-id={
                                                    productModal.id
                                                }
                                                dangerouslySetInnerHTML={{
                                                    __html: productModal.content.replace(
                                                        /\n/g,
                                                        "<br />"
                                                    ),
                                                }}
                                            ></div>
                                        )}

                                        <div className="product-modal--attributes">
                                            {Object.values(
                                                productModal.attributes
                                            ).map((attribute, keyAttr) => (
                                                <div
                                                    className="product-modal--attribute"
                                                    key={keyAttr}
                                                >
                                                    <div className="attribute--name">
                                                        {attribute.name}
                                                    </div>
                                                    <ToggleButtonGroup
                                                        color="primary"
                                                        value={
                                                            choosenAttributes[
                                                                keyAttr
                                                            ]
                                                        }
                                                        exclusive
                                                        className="attribute--variations"
                                                    >
                                                        {Object.values(
                                                            attribute.options
                                                        ).map((opt, key) => (
                                                            <ToggleButton
                                                                className="btn--variation"
                                                                onClick={() =>
                                                                    handleChooseAttribute(
                                                                        keyAttr,
                                                                        opt
                                                                    )
                                                                }
                                                                key={key}
                                                                value={opt}
                                                            >
                                                                {opt}
                                                            </ToggleButton>
                                                        ))}
                                                    </ToggleButtonGroup>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div
                                        className="product-modal--description"
                                        data-product-id={productModal.id}
                                        dangerouslySetInnerHTML={{
                                            __html: productModal.content.replace(
                                                /\n/g,
                                                "<br />"
                                            ),
                                        }}
                                    ></div>
                                )}

                                {wrongVariant ? (
                                    <Collapse sx={{ mt: 1 }} in={true}>
                                        <Alert
                                            severity="error"
                                            className="alert--wrong-variant"
                                        >
                                            Данный вариант недоступен
                                        </Alert>
                                    </Collapse>
                                ) : (
                                    ""
                                )}

                                {productModal.disabled ? (
                                    <Collapse sx={{ mt: 1 }} in={true}>
                                        <Alert
                                            severity="error"
                                            className="alert--wrong-variant"
                                        >
                                            Товар недоступен в данный момент
                                        </Alert>
                                    </Collapse>
                                ) : (
                                    ""
                                )}

                                {productModal.product_addons?.map(
                                    (category) => (
                                        <ModificatorCategory
                                            category={category}
                                            key={category.category_id}
                                        />
                                    )
                                )}

                                {!addon_products.length ||
                                config.CONFIG_addons_category_in_product ===
                                    "hide" ||
                                (config.CONFIG_addons_category_in_product ===
                                    "without_modificators" &&
                                    productModal.product_addons
                                        .length) ? null : (
                                    <div className="addon-products">
                                        <div className="addon-products--title">
                                            {config.CONFIG_addons_category_name}
                                        </div>
                                        <Grid
                                            container
                                            spacing={1}
                                            sx={{ mt: "6px" }}
                                        >
                                            {addon_products.map((product) => (
                                                <Grid
                                                    item
                                                    mobilexs={6}
                                                    mobilesm={4}
                                                    mobilemd={3}
                                                    mobilelg={2}
                                                    desctop={4}
                                                >
                                                    <AddonProductModal
                                                        key={product.id}
                                                        product={product}
                                                    />
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </div>
                                )}
                            </div>
                            <div className="product-modal--variations-buying">
                                <div className="product-modal--price-wrapper">
                                    <div className="product-modal--price">
                                        {productPriceRender()}
                                    </div>
                                    <div className="product-modal--stats">
                                        {productModal.type === "variations" ? (
                                            <>
                                                {activeVariant &&
                                                activeVariant.weight ? (
                                                    <div className="weight">
                                                        {activeVariant.weight}{" "}
                                                        гр.
                                                    </div>
                                                ) : (
                                                    ""
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                {productModal.options.weight ? (
                                                    <div className="weight">
                                                        {
                                                            productModal.options
                                                                .weight
                                                        }{" "}
                                                        гр.
                                                    </div>
                                                ) : (
                                                    ""
                                                )}
                                                {productModal.options
                                                    .count_rolls ? (
                                                    <div className="count-rolls">
                                                        {
                                                            productModal.options
                                                                .count_rolls
                                                        }{" "}
                                                        шт.
                                                    </div>
                                                ) : (
                                                    ""
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                                {productModal.type === "variations" ? (
                                    <Button
                                        variant="button"
                                        className="btn--action btn-buy"
                                        onClick={handleAddVariantProduct}
                                        disabled={
                                            productModal.disabled ||
                                            wrongVariant ||
                                            !modificatorsCondition
                                        }
                                    >
                                        Хочу
                                    </Button>
                                ) : (
                                    <Button
                                        variant="button"
                                        className="btn--action btn-buy"
                                        onClick={handleAddProduct}
                                        disabled={
                                            productModal.disabled ||
                                            !modificatorsCondition
                                        }
                                    >
                                        Хочу
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                ""
            )}
        </Dialog>
    );
}
