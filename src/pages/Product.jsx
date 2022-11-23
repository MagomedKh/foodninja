import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Container from "@mui/material/Container";
import { Link } from "react-router-dom";
import { addProductToCart, decreaseProductInCart } from "../redux/actions/cart";
import AddonProductModal from "../components/Product/AddonProductModal";
import Collapse from "@mui/material/Collapse";
import Alert from "@mui/material/Alert";
import { ToggleButtonGroup, ToggleButton, Button } from "@mui/material";
import Zoom from "@mui/material/Zoom";
import { Header, Footer } from "../components";

export default function Product() {
    const dispatch = useDispatch();

    const { addon_products, cartProducts, products } = useSelector(
        ({ products, cart }) => {
            return {
                products: products.items,
                addon_products: products.addon_items,
                cartProducts: cart.items,
            };
        }
    );
    const [choosenAttributes, setChoosenAttributes] = React.useState({});
    const [activeVariant, setActiveVariant] = React.useState(false);
    const [wrongVariant, setWrongVariant] = React.useState(false);
    let productSlug = window.location.pathname.split("/");
    const [product] = React.useState(
        Object.values(products).find((item) => item.slug === productSlug[2])
    );

    React.useEffect(() => {
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

    const handleAddProduct = (product) => {
        dispatch(addProductToCart(product));
    };
    const handleAddVariantProduct = () => {
        let _product = product;
        _product.options._price = activeVariant.price;
        _product.variant = activeVariant;
        dispatch(addProductToCart(_product));
    };
    const handleDecreaseProduct = (product) => {
        dispatch(decreaseProductInCart(product));
    };

    return (
        <>
            <Header />
            <Container>
                {product !== undefined ? (
                    <div className="product-modal">
                        <div className="product-modal--image">
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
                                    {activeVariant &&
                                    activeVariant.description ? (
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

                            {!wrongVariant ? (
                                <div className="product-modal--buying">
                                    {activeVariant && activeVariant.price ? (
                                        parseInt(activeVariant._regular_price) >
                                        parseInt(activeVariant.price) ? (
                                            <div className="product-modal--price">
                                                <span className="product--old-price">
                                                    {
                                                        activeVariant._regular_price
                                                    }{" "}
                                                    ₽
                                                </span>
                                                <span className="product--sale-price main-color">
                                                    {activeVariant.price} ₽
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="product-modal--price">
                                                {activeVariant.price} ₽
                                            </div>
                                        )
                                    ) : (
                                        <div className="product-modal--price">
                                            {product.options._price} ₽
                                        </div>
                                    )}
                                    <div className="product-modal--stats">
                                        {product.options.weight ? (
                                            <div className="weight">
                                                {product.options.weight} гр.
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                        {product.options.count_rolls ? (
                                            <div className="count-rolls">
                                                {product.options.count_rolls}{" "}
                                                шт.
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                    {product.type === "variations" ? (
                                        <Button
                                            variant="button"
                                            className="btn--action btn-buy"
                                            onClick={handleAddVariantProduct}
                                        >
                                            Хочу
                                        </Button>
                                    ) : !cartProducts[product.id] ? (
                                        <Button
                                            variant="button"
                                            className="btn--action btn-buy"
                                            onClick={() =>
                                                handleAddProduct(product)
                                            }
                                        >
                                            Хочу
                                        </Button>
                                    ) : (
                                        <div className="product-modal--quantity">
                                            <Button
                                                className="btn--default product-decrease"
                                                onClick={() =>
                                                    handleDecreaseProduct(
                                                        product
                                                    )
                                                }
                                            >
                                                -
                                            </Button>
                                            <input
                                                className="quantity"
                                                type="text"
                                                readOnly
                                                value={
                                                    cartProducts[product.id]
                                                        .items.length
                                                }
                                                data-product_id={product.id}
                                            />
                                            <Button
                                                className="btn--default product-add"
                                                onClick={() =>
                                                    handleAddProduct(product)
                                                }
                                            >
                                                +
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                ""
                            )}

                            {addon_products.length ? (
                                <div className="addon-products">
                                    <h3 className="addon-products--title">
                                        Соусы и дополнения
                                    </h3>
                                    <div className="addon-products--grid-list">
                                        {addon_products.map((product) => (
                                            <AddonProductModal
                                                key={product.id}
                                                product={product}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                ""
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        <h1>Товар не найден</h1>
                        <p>
                            Вернитесь на <Link to="/">главную страницу</Link>.
                        </p>
                    </>
                )}
            </Container>
            <Footer />
        </>
    );
}
