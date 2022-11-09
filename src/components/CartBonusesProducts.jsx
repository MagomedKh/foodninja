import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { styled } from "@mui/material/styles";
import { addBonusProductToCart } from "../redux/actions/cart";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import {
    Alert,
    FormControlLabel,
    Grid,
    Radio,
    RadioGroup,
} from "@mui/material";
import CartBonusProduct from "../components/Product/CartBonusProduct";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect } from "react";

const BootstrapTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
        color: theme.palette.common.black,
    },
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.black,
    },
}));

export default function CartBonusesProducts(minicart = false) {
    const dispatch = useDispatch();
    const {
        cart,
        config,
        bonuses_items,
        userCartBonusProduct,
        cartTotalPrice,
    } = useSelector(({ config, cart, products }) => {
        return {
            cart: cart,
            config: config.data,
            bonuses_items: products.bonuses_items,
            cartTotalPrice: cart.totalPrice,
            userCartBonusProduct: cart.bonusProduct,
        };
    });
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
                    !cart.discount) ||
                    config.CONFIG_promocode_with_bonus_program === "on") &&
                cartTotalPrice >= product.limit
            ) {
                dispatch(addBonusProductToCart(product));
                setChoosenProductId(product.id);
            }
        }
    };

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
                            sx={{ mb: 4 }}
                        >
                            Бонусные товары нельзя выбрать при использовании
                            промокода.
                        </Alert>
                    ) : (
                        ""
                    )}

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
                                >
                                    <BootstrapTooltip
                                        placement="left"
                                        title={
                                            cartTotalPrice <= product.limit
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
                                                cartTotalPrice <=
                                                    product.limit ||
                                                (cart.discount &&
                                                    config.CONFIG_promocode_with_bonus_program !==
                                                        "on")
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
                                                    cartTotalPrice <=
                                                        product.limit ||
                                                    (cart.discount &&
                                                        config.CONFIG_promocode_with_bonus_program !==
                                                            "on")
                                                }
                                                value={product.id}
                                                control={<Radio />}
                                            />
                                            <CartBonusProduct
                                                product={product}
                                            />
                                            {choosenProductId === product.id ? (
                                                <CloseIcon />
                                            ) : null}
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
