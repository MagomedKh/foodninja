import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { _cartHasDiscountProduct } from "../components/helpers";

const useAccrueBonuses = (usedBonuses = 0) => {
    const cartProducts = useSelector((state) =>
        Object.values(state.cart.items)
    );
    const promocode = useSelector((state) => state.cart.promocode);
    const bonusProduct = useSelector((state) => state.cart.bonusProduct);

    const {
        programStatus,
        deliveryCashback,
        selfDeliveryCashback,
        specifiedCategories,
        excludeCategories,
        allowWithPromocode,
        allowWithBonusProduct,
        allowWithDiscountProducts,
        allowWithBonuses,
    } = useSelector(
        ({
            config: {
                data: { bonusProgramm },
            },
        }) => {
            return {
                programStatus: bonusProgramm.status === "active",
                deliveryCashback: bonusProgramm.deliveryPercent,
                selfDeliveryCashback: bonusProgramm.selfDeliveryPercent,
                specifiedCategories: bonusProgramm.categories,
                excludeCategories: bonusProgramm.excludeCategories === "yes",
                allowWithPromocode: bonusProgramm.allowPromocode === "active",
                allowWithBonusProduct:
                    bonusProgramm.allowBonusProduct === "active",
                allowWithDiscountProducts:
                    bonusProgramm.allowSaleProduct === "active",
                allowWithBonuses: bonusProgramm.allowWithBonuses === "active",
            };
        }
    );

    let accrualBase = 0;

    const disabledByPromocode = !allowWithPromocode && promocode.code;
    const disabledByBonusProduct = !allowWithBonusProduct && bonusProduct.id;
    const disabledByUsedBonuses = !allowWithBonuses && usedBonuses;

    const disabled =
        disabledByPromocode || disabledByBonusProduct || disabledByUsedBonuses;

    if (!disabled && programStatus) {
        cartProducts.forEach((cartProduct) => {
            // Проверяем исключена ли категория товара из начисления бонусов
            if (specifiedCategories?.length && excludeCategories) {
                const excludedCategoryId = cartProduct.items[0].categories.find(
                    (productCategoryId) =>
                        specifiedCategories.includes(productCategoryId)
                );
                if (excludedCategoryId) {
                    return;
                }
            } else if (specifiedCategories?.length) {
                if (
                    !cartProduct.items[0].categories.some((id) =>
                        specifiedCategories.includes(id)
                    )
                ) {
                    return;
                }
            }

            let promocodeProductWasExcluded = false;

            cartProduct.items.forEach((item) => {
                // Если товар по промокоду и еще не был исключен, исключаем его из подсчета бонусов
                if (
                    item.id === promocode?.promocodeProducts?.id &&
                    !promocodeProductWasExcluded
                ) {
                    promocodeProductWasExcluded = true;
                    return;
                }

                // Если начисление не действует на товары по скидке
                if (
                    !allowWithDiscountProducts &&
                    item.options._sale_price &&
                    parseInt(item.options._regular_price) >
                        parseInt(item.options._sale_price)
                ) {
                    return;
                }

                if (item.type === "simple") {
                    accrualBase += item.options._price;
                } else if (item.type === "variations" && item.variant) {
                    accrualBase += item.variant.price;
                }
            });
        });
    }

    const deliveryAccruedBonuses = Math.floor(
        accrualBase * (deliveryCashback / 100)
    );
    const selfDeliveryAccruedBonuses = Math.floor(
        accrualBase * (selfDeliveryCashback / 100)
    );

    return {
        deliveryAccruedBonuses,
        selfDeliveryAccruedBonuses,
        disabledByPromocode,
        disabledByBonusProduct,
        disabledByUsedBonuses,
    };
};

export default useAccrueBonuses;
