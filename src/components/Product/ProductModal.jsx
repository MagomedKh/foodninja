import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    _clone,
    _getPlatform,
    _isCategoryDisabled,
    _isMobile,
} from "../../components/helpers.js";
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
import { BootstrapTooltip } from "../index";
import ModificatorCategory from "./ModificatorCategory.jsx";
import { styled } from "@mui/material/styles";
import { tooltipClasses } from "@mui/material/Tooltip";
import {
    Alert,
    Button,
    Collapse,
    Dialog,
    IconButton,
    Slide,
    ToggleButtonGroup,
    Tooltip,
    ToggleButton,
    Zoom,
    Grid,
} from "@mui/material";
import ClickAwayListener from "@mui/base/ClickAwayListener";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
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

    const categories = useSelector((state) => state.products.categories);
    const products = useSelector((state) => state.products.items);

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
    const [tooltipOpen, setTooltipOpen] = useState(false);

    const disabled = !!productModal.categories?.find((productCategoryId) => {
        const category = categories.find(
            (category) => category.term_id === productCategoryId
        );
        if (category) {
            return _isCategoryDisabled(category).disabled;
        }
        return false;
    });

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

    const urlChangeEventListener = () => {
        let url = new URL(window.location.href);
        if (!url.searchParams.has("product_id")) {
            handleClose();
        }
    };

    useEffect(() => {
        window.addEventListener("popstate", urlChangeEventListener);
        return () => {
            window.removeEventListener("popstate", urlChangeEventListener);
        };
    }, []);

    useEffect(() => {
        const urlParams = new URL(window.location.href).searchParams;
        const paramsProductID = urlParams.get("product_id");
        if (paramsProductID) {
            console.log(paramsProductID);
            const product = products[paramsProductID];
            if (product && !openProductModal) {
                dispatch(setModalProduct({ ...product }));
                dispatch(setOpenModal(true));
            } else if (!product && openProductModal) {
                handleClose();
            }
        }
    }, [products, openProductModal]);

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
        let url = new URL(window.location.href);
        if (url.searchParams.has("product_id")) {
            url.searchParams.delete("product_id");
            window.history.replaceState(
                "",
                document.title,
                window.location.pathname
            );
        }
        dispatch(clearModalProduct());
        dispatch(clearModificators());
        setActiveVariant(false);
        setWrongVariant(false);
        setTooltipOpen(false);
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

    const productOptions = activeVariant
        ? activeVariant.options
        : productModal.options;

    const renderTooltipContent = () => {
        if (
            !productOptions.energy_value &&
            !productOptions.protein &&
            !productOptions.fat &&
            !productOptions.carbohydrate
        ) {
            return null;
        }
        return (
            <div className="product-modal--tooltip">
                <div className="product-modal--tooltip-title">
                    Пищевая ценность на 100 г. :
                </div>
                {!!productOptions.energy_value && (
                    <div className="product-modal--tooltip-option">
                        <div>Энерг. ценность</div>
                        <div>{productOptions.energy_value} ккал.</div>
                    </div>
                )}
                {!!productOptions.protein && (
                    <div className="product-modal--tooltip-option">
                        <div>Белки</div>
                        <div>{productOptions.protein} г.</div>
                    </div>
                )}
                {!!productOptions.fat && (
                    <div className="product-modal--tooltip-option">
                        <div>Жиры</div>
                        <div>{productOptions.fat} г.</div>
                    </div>
                )}
                {!!productOptions.carbohydrate && (
                    <div className="product-modal--tooltip-option">
                        <div>Углеводы</div>
                        <div>{productOptions.carbohydrate} г.</div>
                    </div>
                )}
            </div>
        );
    };

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
                                        filter: disabled ? "grayscale(1)" : "",
                                    }}
                                />
                            </Zoom>
                        </div>
                        <div className="product-modal--info">
                            <div className="product-modal--scrolling">
                                <div className="product-modal--title-container">
                                    <h2 className="product-modal--title">
                                        {productModal.title}
                                    </h2>
                                    {renderTooltipContent() && (
                                        <ClickAwayListener
                                            onClickAway={() =>
                                                setTooltipOpen(false)
                                            }
                                        >
                                            <div>
                                                <BootstrapTooltip
                                                    placement="bottom-end"
                                                    title={renderTooltipContent()}
                                                    disableTouchListener
                                                    disableHoverListener
                                                    open={tooltipOpen}
                                                >
                                                    <InfoOutlinedIcon
                                                        className="product-modal--title-info"
                                                        onClick={() =>
                                                            setTooltipOpen(
                                                                (state) =>
                                                                    !state
                                                            )
                                                        }
                                                    />
                                                </BootstrapTooltip>
                                            </div>
                                        </ClickAwayListener>
                                    )}
                                </div>

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

                                {disabled ? (
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
                                                    key={product.id}
                                                >
                                                    <AddonProductModal
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
                                            disabled ||
                                            wrongVariant ||
                                            !modificatorsCondition
                                        }
                                        data-product-id={productModal.id}
                                    >
                                        Хочу
                                    </Button>
                                ) : (
                                    <Button
                                        variant="button"
                                        className="btn--action btn-buy"
                                        onClick={handleAddProduct}
                                        disabled={
                                            disabled || !modificatorsCondition
                                        }
                                        data-product-id={productModal.id}
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
