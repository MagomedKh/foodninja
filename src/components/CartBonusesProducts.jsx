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
    const { cart, config, bonuses_items, userCartBonusProduct } = useSelector(
        ({ config, cart, products }) => {
            return {
                cart: cart,
                config: config.data,
                bonuses_items: products.bonuses_items,
                userCartBonusProduct: cart.bonusProduct,
            };
        }
    );

    const {
        programStatus,
        cartTotalPrice,
        bonusesDisabledByCategory,
        disabledCategoriesNames,
    } = useBonusProducts();

    const [choosenProductId, setChoosenProductId] = useState(null);

    useEffect(() => {
        if (cart.bonusProduct) {
            setChoosenProductId(cart.bonusProduct.id);
        } else {
            setChoosenProductId(null);
        }
    }, [cart.bonusProduct]);

    const handleChooseBonusProduct = (product) => {
        if (
            Object.keys(userCartBonusProduct).length &&
            userCartBonusProduct.id === product.id
        ) {
            dispatch(addBonusProductToCart({}));
            setChoosenProductId(null);
        } else {
            if (
                ((config.CONFIG_promocode_with_bonus_program !== "on" &&
                    (!cart.promocode ||
                        Object.keys(cart.promocode).length === 0)) ||
                    config.CONFIG_promocode_with_bonus_program === "on") &&
                cartTotalPrice >= product.limit &&
                !bonusesDisabledByCategory
            ) {
                dispatch(addBonusProductToCart(product));
                setChoosenProductId(product.id);
            }
        }
    };

    if (!programStatus) {
        return null;
    }

    return (
        <div>
            {bonuses_items.length ? (
                <div className="cart--bonuses-products">
                    <h2 className="bonuses-products--title">
                        Выберите подарок
                    </h2>

                    {cart.discount &&
                    config.CONFIG_promocode_with_bonus_program !== "on" ? (
                        <Alert
                            severity="info"
                            className="custom-alert"
                            sx={{ mb: 4, mr: 2, ml: 2 }}
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
                            sx={{ mb: 4, mr: 2, ml: 2 }}
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
                            Object.keys(userCartBonusProduct).length
                                ? userCartBonusProduct.id
                                : ""
                        }
                    >
                        <Grid container spacing={4}>
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
                                                    (cart.promocode &&
                                                        Object.keys(
                                                            cart.promocode
                                                        ).length > 0 &&
                                                        config.CONFIG_promocode_with_bonus_program !==
                                                            "on") ||
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
                                                        (cart.promocode &&
                                                            Object.keys(
                                                                cart.promocode
                                                            ).length > 0 &&
                                                            config.CONFIG_promocode_with_bonus_program !==
                                                                "on") ||
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
