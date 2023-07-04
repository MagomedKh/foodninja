import React, { useState, useEffect } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addProductToCart, decreaseProductInCart } from "../redux/actions/cart";
import AddonProductModal from "../components/Product/AddonProductModal";
import {
    Alert,
    Collapse,
    Container,
    ToggleButtonGroup,
    ToggleButton,
    Button,
    Zoom,
    Grid,
} from "@mui/material";
import {
    Header,
    Footer,
    ModificatorCategory,
    TopCategoriesMenu,
} from "../components";
import { _clone, _isCategoryDisabled } from "../components/helpers";
import "../css/product-page.css";
import useModificators from "../hooks/useModificators";

export default function Product() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { addon_products, cartProducts, products } = useSelector(
        ({ products, cart }) => {
            return {
                products: products.items,
                addon_products: products.addon_items,
                cartProducts: cart.items,
            };
        }
    );
    const {
        choosenModificators,
        modificatorsAmount,
        modificatorsCondition,
        addEmptyRequiredCategory,
        deleteEmptyRequiredCategory,
        addProductModificator,
        decreaseProductModificator,
    } = useModificators(product?.id);

    const { config } = useSelector(({ config }) => {
        return {
            config: config.data,
        };
    });
    const { categories } = useSelector((state) => state.products, shallowEqual);
    const [choosenAttributes, setChoosenAttributes] = useState({});
    const [activeVariant, setActiveVariant] = useState(false);
    const [wrongVariant, setWrongVariant] = useState(false);
    const [disabledProductCategory, setDisabledProductCategory] =
        useState(null);
    let productSlug = window.location.pathname.split("/");
    const [product] = useState(
        Object.values(products).find((item) => item.slug === productSlug[2])
    );

    useEffect(() => {
        if (product) {
            let dataAttributes = {};
            if (product.type === "variations" && product.attributes) {
                Object.keys(product.attributes).forEach((value, index) => {
                    dataAttributes[index] = Object.values(product.attributes)[
                        index
                    ].options[0];
                });
                setChoosenAttributes(dataAttributes);
            }
            if (product.type === "variations" && product.variants) {
                let shouldSkip = false;
                let foundVariant = false;
                Object.values(product.variants).forEach(
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
        }
        return;
    }, [product]);

    // Создаем массив недоступных на данное время категорий
    useEffect(() => {
        if (categories) {
            const disabledCategoriesResults = categories
                .map((category) => {
                    const result = _isCategoryDisabled(category);
                    if (result.disabled) {
                        return { category: category, message: result.message };
                    } else {
                        return null;
                    }
                })
                .filter((el) => el);
            // Если одна из категорий товара недоступна по времени, блокируем товар
            if (disabledCategoriesResults.length) {
                const disabledCategoryResult = disabledCategoriesResults.find(
                    (result) =>
                        product.categories.includes(result.category.term_id)
                );
                if (disabledCategoryResult) {
                    setDisabledProductCategory(disabledCategoryResult);
                }
            } else {
                setDisabledProductCategory(null);
            }
        }
    }, [categories]);

    if (!product) {
        if (config.CONFIG_empty_page_redirect === "on") {
            navigate("/");
        } else {
            navigate("/not-found");
        }
        return null;
    }

    const handleChooseAttribute = (attribute, value) => {
        let dataAttributes = choosenAttributes;
        dataAttributes[attribute] = value;
        setChoosenAttributes({ ...choosenAttributes, dataAttributes });
        let shouldSkip = false;
        let foundVariant = false;
        Object.values(product.variants).forEach((variant, indexVariant) => {
            let checkVariant = true;
            if (shouldSkip) {
                return;
            }
            Object.values(variant.attributes).forEach((attr, attrIndex) => {
                if (dataAttributes[attrIndex] !== attr) checkVariant = false;
            });
            if (checkVariant) {
                setActiveVariant(variant);
                shouldSkip = foundVariant = true;
            }
        });
        if (foundVariant) setWrongVariant(false);
        else setWrongVariant(true);
    };

    const handleAddProduct = () => {
        let _product = _clone(product);
        dispatch(
            addProductToCart({
                ..._product,
                choosenModificators: choosenModificators,
                modificatorsAmount: modificatorsAmount,
            })
        );
    };
    const handleAddVariantProduct = () => {
        let _product = _clone(product);
        _product.options._price = activeVariant.price;
        _product.variant = activeVariant;
        dispatch(
            addProductToCart({
                ..._product,
                choosenModificators: choosenModificators,
                modificatorsAmount: modificatorsAmount,
            })
        );
    };
    const handleDecreaseProduct = (product) => {
        dispatch(decreaseProductInCart(product));
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
                parseInt(product.options?._regular_price) >
                parseInt(product.options?._price)
            ) {
                return (
                    <>
                        <span className="product--old-price">
                            {parseInt(product.options._regular_price) +
                                modificatorsAmount}{" "}
                            ₽
                        </span>
                        <span className="product--sale-price main-color">
                            {product.options._price + modificatorsAmount} ₽
                        </span>
                    </>
                );
            } else {
                return (
                    <span>
                        {parseInt(product.options._price) + modificatorsAmount}{" "}
                        ₽
                    </span>
                );
            }
        }
    };

    return (
        <>
            <Header />
            <TopCategoriesMenu />
            <Container>
                <div className="product-modal">
                    <div className="product-page--image">
                        <Zoom in={true}>
                            <img
                                src={
                                    activeVariant
                                        ? activeVariant.img
                                        : product.img
                                }
                                alt={product.title}
                            />
                        </Zoom>
                    </div>
                    <div className="product-modal--info no-bg">
                        <h1
                            className="product-modal--title"
                            style={{ marginBottom: 5 }}
                        >
                            {product.title}
                        </h1>

                        {product.type === "variations" ? (
                            <>
                                {activeVariant && activeVariant.description ? (
                                    <div
                                        className="product-modal--description"
                                        data-product-id={product.id}
                                        dangerouslySetInnerHTML={{
                                            __html: activeVariant.description,
                                        }}
                                    ></div>
                                ) : (
                                    <div
                                        className="product-modal--description"
                                        data-product-id={product.id}
                                        dangerouslySetInnerHTML={{
                                            __html: product.content.replace(
                                                /\n/g,
                                                "<br />"
                                            ),
                                        }}
                                    ></div>
                                )}

                                <div className="product-modal--attributes">
                                    {Object.values(product.attributes).map(
                                        (attribute, keyAttr) => (
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
                                                            sx={{
                                                                mr: "20px",
                                                            }}
                                                        >
                                                            {opt}
                                                        </ToggleButton>
                                                    ))}
                                                </ToggleButtonGroup>
                                            </div>
                                        )
                                    )}
                                </div>
                            </>
                        ) : (
                            <div
                                className="product-modal--description"
                                data-product-id={product.id}
                                dangerouslySetInnerHTML={{
                                    __html: product.content.replace(
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

                        <div className="variations-buying">
                            <div className="product-modal--price-wrapper">
                                <div className="product-modal--price">
                                    {productPriceRender()}
                                </div>
                                <div className="product-modal--stats">
                                    {product.type === "variations" ? (
                                        <>
                                            {activeVariant &&
                                            activeVariant.weight ? (
                                                <div className="weight">
                                                    {activeVariant.weight} гр.
                                                </div>
                                            ) : (
                                                ""
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            {product.options.weight ? (
                                                <div className="weight">
                                                    {product.options.weight} гр.
                                                </div>
                                            ) : (
                                                ""
                                            )}
                                            {product.options.count_rolls ? (
                                                <div className="count-rolls">
                                                    {
                                                        product.options
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
                            {product.type === "variations" ? (
                                <Button
                                    variant="button"
                                    className="btn--action btn-buy"
                                    onClick={handleAddVariantProduct}
                                    disabled={
                                        disabledProductCategory ||
                                        !modificatorsCondition
                                    }
                                    data-product-id={product.id}
                                >
                                    Хочу
                                </Button>
                            ) : (
                                <Button
                                    variant="button"
                                    className="btn--action btn-buy"
                                    onClick={handleAddProduct}
                                    disabled={
                                        disabledProductCategory ||
                                        !modificatorsCondition
                                    }
                                    data-product-id={product.id}
                                >
                                    Хочу
                                </Button>
                            )}
                        </div>

                        {disabledProductCategory ? (
                            <Collapse sx={{ mt: 1 }} in={true}>
                                <Alert
                                    severity="error"
                                    className="alert--wrong-variant"
                                >
                                    {disabledProductCategory.message}
                                </Alert>
                            </Collapse>
                        ) : (
                            ""
                        )}

                        {product.product_addons?.map((category) => (
                            <ModificatorCategory
                                category={category}
                                key={category.category_id}
                                choosenModificators={choosenModificators}
                                addEmptyRequiredCategory={
                                    addEmptyRequiredCategory
                                }
                                deleteEmptyRequiredCategory={
                                    deleteEmptyRequiredCategory
                                }
                                addProductModificator={addProductModificator}
                                decreaseProductModificator={
                                    decreaseProductModificator
                                }
                            />
                        ))}

                        {!addon_products.length ||
                        config.CONFIG_addons_category_in_product === "hide" ||
                        (config.CONFIG_addons_category_in_product ===
                            "without_modificators" &&
                            product.product_addons.length) ? null : (
                            <div className="addon-products">
                                <div className="addon-products--title">
                                    {config.CONFIG_addons_category_name}
                                </div>
                                <Grid container spacing={1} sx={{ mt: "6px" }}>
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
                </div>
            </Container>
            <Footer />
        </>
    );
}
