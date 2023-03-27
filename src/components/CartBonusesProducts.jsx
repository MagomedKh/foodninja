import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addBonusProductToCart } from "../redux/actions/cart";
import {
    Alert,
    FormControlLabel,
    Grid,
    Radio,
    RadioGroup,
} from "@mui/material";
import CartBonusProduct from "../components/Product/CartBonusProduct";
import { BootstrapTooltip } from "./index";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect } from "react";
import useBonusProducts from "../hooks/useBonusProducts";

export default function CartBonusesProducts(minicart = false) {
    const dispatch = useDispatch();
    const { bonuses_items, cartBonusProduct } = useSelector(
        ({ cart, products }) => {
            return {
                bonuses_items: products.bonuses_items,
                cartBonusProduct: cart.bonusProduct,
            };
        }
    );

    const {
        programStatus,
        cartTotalPrice,
        disabledCategoriesNames,
        bonusesDisabled,
        bonusesDisabledByCategory,
        bonusesDisabledByPromocode,
    } = useBonusProducts();

    const [choosenProductId, setChoosenProductId] = useState(null);

    useEffect(() => {
        if (cartBonusProduct) {
            setChoosenProductId(cartBonusProduct.id);
        } else {
            setChoosenProductId(null);
        }
    }, [cartBonusProduct]);

    const handleChooseBonusProduct = (product) => {
        if (
            Object.keys(cartBonusProduct).length &&
            cartBonusProduct.id === product.id
        ) {
            dispatch(addBonusProductToCart({}));
            setChoosenProductId(null);
        } else {
            if (
                !bonusesDisabledByPromocode &&
                !bonusesDisabledByCategory &&
                cartTotalPrice >= product.limit
            ) {
                dispatch(addBonusProductToCart(product));
                setChoosenProductId(product.id);
            }
        }
    };

    if (bonusesDisabled) {
        return null;
    }

    return (
        <div>
            {bonuses_items.length ? (
                <div className="cart--bonuses-products">
                    <h2 className="bonuses-products--title">
                        Выберите подарок
                    </h2>

                    {bonusesDisabledByPromocode ? (
                        <Alert
                            severity="info"
                            className="custom-alert"
                            sx={{ mb: 2, mr: 2, ml: 2 }}
                        >
                            Бонусные товары нельзя выбрать при использовании
                            промокода.
                        </Alert>
                    ) : (
                        ""
                    )}

                    {bonusesDisabledByCategory ? (
                        <Alert
                            severity="info"
                            sx={{ mb: 2, mr: 2, ml: 2 }}
                            className="custom-alert"
                        >
                            Товары из категории:{" "}
                            {disabledCategoriesNames.join(", ")} нельзя
                            использовать вместе со шкалой подарков.
                        </Alert>
                    ) : null}

                    <RadioGroup
                        name="bonusesProducts"
                        value={
                            Object.keys(cartBonusProduct).length
                                ? cartBonusProduct.id
                                : ""
                        }
                    >
                        <Grid container spacing={2}>
                            {Object.values(bonuses_items).map((product) => (
                                <Grid
                                    key={product.id}
                                    item
                                    md={minicart ? 12 : 6}
                                    sm={12}
                                    sx={{ width: "100%" }}
                                >
                                    <BootstrapTooltip
                                        placement="left"
                                        title={
                                            cartTotalPrice < product.limit
                                                ? "От " +
                                                  product.limit +
                                                  " ₽ (не хватает " +
                                                  (product.limit -
                                                      cartTotalPrice) +
                                                  " ₽)"
                                                : "Выбрать"
                                        }
                                    >
                                        <div
                                            disabled={
                                                !!(
                                                    cartTotalPrice <
                                                        product.limit ||
                                                    bonusesDisabledByPromocode ||
                                                    bonusesDisabledByCategory
                                                )
                                            }
                                            className="bonus-product-choose"
                                            onClick={() =>
                                                handleChooseBonusProduct(
                                                    product
                                                )
                                            }
                                        >
                                            <FormControlLabel
                                                disabled={
                                                    !!(
                                                        cartTotalPrice <
                                                            product.limit ||
                                                        bonusesDisabledByPromocode ||
                                                        bonusesDisabledByCategory
                                                    )
                                                }
                                                value={product.id}
                                                control={<Radio />}
                                            />
                                            <div className="bonus-product-choose-content">
                                                <CartBonusProduct
                                                    product={product}
                                                />
                                                {choosenProductId ===
                                                product.id ? (
                                                    <div className="cart--product-remove">
                                                        <CloseIcon />
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </BootstrapTooltip>
                                </Grid>
                            ))}
                        </Grid>
                    </RadioGroup>
                </div>
            ) : (
                ""
            )}
        </div>
    );
}
