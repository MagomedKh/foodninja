import { useSelector } from "react-redux";
import { _cartHasDiscountProduct } from "../components/helpers";

const useBonuses = ({
    userBonuses,
    typeDelivery,
    deliveryZone,
    autoDiscountAmount,
}) => {
    const categories = useSelector((state) => state.products.categories);
    const cartProducts = useSelector((state) =>
        Object.values(state.cart.items)
    );
    const cartTotalPrice = useSelector((state) =>
        autoDiscountAmount
            ? state.cart.totalPrice - autoDiscountAmount
            : state.cart.totalPrice
    );

    const promocode = useSelector((state) => state.cart.promocode);
    const bonusProduct = useSelector((state) => state.cart.bonusProduct);

    const configOrderMinPrice = useSelector((state) =>
        parseInt(state.config.data.CONFIG_order_min_price)
    );
    const configSelfOrderMinPrice = useSelector((state) =>
        parseInt(state.config.data.CONFIG_selforder_min_price)
    );

    const {
        programStatus,
        useBonusesLimit,
        specifiedCategories,
        excludeCategories,
        disableMinPrice,
        allowWithPromocode,
        allowWithBonusProduct,
        allowWithDiscountProducts,
    } = useSelector(
        ({
            config: {
                data: { bonusProgramm, CONFIG_bonus_program_order_limit },
            },
        }) => {
            return {
                programStatus: bonusProgramm.status === "active",
                useBonusesLimit:
                    bonusProgramm.status === "active"
                        ? bonusProgramm.paymentPercent
                        : CONFIG_bonus_program_order_limit,
                specifiedCategories: bonusProgramm.paymentCategories,
                excludeCategories:
                    bonusProgramm.paymentExcludeCategories === "yes",
                disableMinPrice:
                    bonusProgramm.paymentIgnoreMinimalPrice === "active",
                allowWithPromocode:
                    bonusProgramm.paymentDisableWithPromocode !== "active",
                allowWithBonusProduct:
                    bonusProgramm.paymentDisableWithBonusProduct !== "active",
                allowWithDiscountProducts:
                    bonusProgramm.paymentDisableWithSaleProduct !== "active",
            };
        }
    );

    // Определяем действующий минимальный заказ
    let orderMinPrice = 0;
    if (typeDelivery === "delivery") {
        if (deliveryZone) {
            orderMinPrice = Math.max(
                deliveryZone?.orderMinPrice ? deliveryZone?.orderMinPrice : 0,
                promocode?.coupon_min_price ? promocode?.coupon_min_price : 0
            );
        } else {
            orderMinPrice = Math.max(
                configOrderMinPrice ? configOrderMinPrice : 0,
                promocode?.coupon_min_price ? promocode?.coupon_min_price : 0
            );
        }
    }
    if (typeDelivery === "self") {
        orderMinPrice = Math.max(
            configSelfOrderMinPrice ? configSelfOrderMinPrice : 0,
            promocode?.coupon_selfdelivery_min_price
                ? promocode?.coupon_selfdelivery_min_price
                : 0
        );
    }

    // Количество бонусов доступное для списания на данный заказ
    let maxBonuses = Math.min(
        Math.floor((cartTotalPrice / 100) * parseInt(useBonusesLimit)),
        userBonuses
    );
    // Ограничение бонусов минимальной суммой заказа
    if (!disableMinPrice || !programStatus)
        if (cartTotalPrice - maxBonuses < orderMinPrice) {
            maxBonuses = cartTotalPrice - orderMinPrice;
            if (maxBonuses < 0) maxBonuses = 0;
        }

    let disabledByExcludedCategory = false;
    let disabledByOnlyCategories = false;
    const excludedCategoriesNamesInCart = [];
    const specifiedCategoriesNames = [];
    if (specifiedCategories?.length && programStatus) {
        // Исключение категорий
        if (excludeCategories) {
            const specifiedCategoriesInCart = specifiedCategories.filter(
                (specifiedCategoryId) => {
                    return cartProducts.find((cartProduct) => {
                        return cartProduct.items[0].categories.includes(
                            specifiedCategoryId
                        );
                    });
                }
            );
            if (specifiedCategoriesInCart.length) {
                disabledByExcludedCategory = true;
                specifiedCategoriesInCart.forEach((specifiedCategoryId) => {
                    const specifiedCategory = categories.find(
                        (category) => category.term_id === specifiedCategoryId
                    );
                    if (specifiedCategory) {
                        excludedCategoriesNamesInCart.push(
                            `«${specifiedCategory.name}»`
                        );
                    }
                });
            }
        }

        // Только указанные категории
        else {
            const notSpecifiedCategoryInCart = cartProducts.find(
                (cartProduct) => {
                    return !cartProduct.items[0].categories?.some((id) =>
                        specifiedCategories.includes(id)
                    );
                }
            );
            if (notSpecifiedCategoryInCart) {
                disabledByOnlyCategories = true;
                specifiedCategories.forEach((specifiedCategoryId) => {
                    const specifiedCategory = categories.find(
                        (category) => category.term_id === specifiedCategoryId
                    );
                    if (specifiedCategory) {
                        specifiedCategoriesNames.push(
                            `«${specifiedCategory.name}»`
                        );
                    }
                });
            }
        }
    }

    const disabledByPromocode =
        !allowWithPromocode && !!promocode.code && programStatus;
    const disabledByBonusProduct =
        !allowWithBonusProduct && !!bonusProduct.id && programStatus;
    const disabledByDiscountProduct =
        !allowWithDiscountProducts &&
        _cartHasDiscountProduct(cartProducts, promocode) &&
        programStatus;

    if (
        disabledByPromocode ||
        disabledByBonusProduct ||
        disabledByDiscountProduct ||
        disabledByExcludedCategory ||
        disabledByOnlyCategories
    ) {
        maxBonuses = 0;
    }

    return {
        userBonuses,
        useBonusesLimit,
        maxBonuses,
        disabledByPromocode,
        disabledByBonusProduct,
        disabledByDiscountProduct,
        disabledByExcludedCategory,
        disabledByOnlyCategories,
    };
};

export default useBonuses;
