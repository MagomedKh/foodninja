import { useSelector } from "react-redux";
import { _checkAutoDiscount } from "../components/helpers";

const useAutoDiscount = (typeDelivery, usedBonuses) => {
    const autoDiscounts = useSelector(
        (state) => state.autoDiscounts.autoDiscounts
    );
    const cartProducts = useSelector((state) => state.cart.items);
    const promocode = useSelector((state) => state.cart.promocode);
    const bonusProduct = useSelector((state) => state.cart.bonusProduct);
    const cartSubTotal = useSelector((state) => state.cart.subTotalPrice);
    const cartTotal = useSelector((state) => state.cart.totalPrice);

    let autoDiscount = null;
    let autoDiscountAmount = 0;

    if (autoDiscounts && autoDiscounts.length) {
        autoDiscounts.forEach((discount) => {
            if (
                !autoDiscount &&
                _checkAutoDiscount({
                    discount,
                    cartProducts,
                    cartTotal: cartSubTotal,
                    promocode,
                    bonusProduct,
                    typeDelivery,
                })
            ) {
                autoDiscount = discount;
            }
        });
    }

    if (autoDiscount) {
        if (autoDiscount.type === "fixed") {
            autoDiscountAmount = autoDiscount.amount;
        } else if (autoDiscount.type === "percent") {
            let autoDiscountBase = 0;
            Object.values(cartProducts).forEach((cartItem) => {
                // Если скидка только на выбранные категории
                if (
                    autoDiscount.categories.length &&
                    !autoDiscount.excludeCategories
                ) {
                    if (
                        !cartItem.items[0].categories?.some((id) =>
                            autoDiscount.categories.includes(id)
                        )
                    ) {
                        return;
                    }
                }

                // Если скидка на все, кроме исключенных категорий
                if (
                    autoDiscount.categories.length &&
                    autoDiscount.excludeCategories === "yes"
                ) {
                    if (
                        cartItem.items[0].categories?.some((id) =>
                            autoDiscount.categories.includes(id)
                        )
                    ) {
                        return;
                    }
                }

                let promocodeProductWasExcluded = false;

                cartItem.items.forEach((product) => {
                    // Если товар по промокоду и еще не был исключен, исключаем его из подсчета автоскидки
                    if (
                        product.id === promocode?.promocodeProducts?.id &&
                        !promocodeProductWasExcluded
                    ) {
                        promocodeProductWasExcluded = true;
                        return;
                    }

                    // Если скидка не действует на товары по скидке
                    if (
                        autoDiscount.excludeSaleProduct !== "yes" &&
                        product.options._sale_price &&
                        parseInt(product.options._regular_price) >
                            parseInt(product.options._sale_price)
                    ) {
                        return;
                    }

                    // Если включена опция считать автоскидку с учётом применных промокодов и использованных бонусов
                    if (
                        autoDiscount.useTotalOrderPrice === "on" &&
                        (usedBonuses ||
                            promocode.type === "fixed_cart" ||
                            promocode.type === "percent")
                    ) {
                        // Определяем % на сколько уменьшилась корзина после использования бонусов
                        let paidWithBonusesPercent = 0;
                        if (usedBonuses) {
                            paidWithBonusesPercent = usedBonuses / cartTotal;
                            if (paidWithBonusesPercent > 1) {
                                paidWithBonusesPercent = 1;
                            }
                        }

                        if (promocode.type === "fixed_cart") {
                            const paidWithPromocodePercent =
                                promocode.amount / cartSubTotal;

                            autoDiscountBase +=
                                parseInt(product.options._price) *
                                (1 - paidWithPromocodePercent) *
                                (1 - paidWithBonusesPercent);
                        } else if (promocode.type === "percent") {
                            if (product.options._promocode_price) {
                                autoDiscountBase +=
                                    Math.ceil(
                                        product.options._promocode_price
                                    ) *
                                    (1 - paidWithBonusesPercent);
                            } else {
                                autoDiscountBase +=
                                    parseInt(product.options._price) *
                                    (1 - paidWithBonusesPercent);
                            }
                        } else {
                            autoDiscountBase +=
                                parseInt(product.options._price) *
                                (1 - paidWithBonusesPercent);
                        }
                    } else {
                        autoDiscountBase += parseInt(product.options._price);
                    }
                });
            });
            autoDiscountAmount = Math.floor(
                autoDiscountBase * (autoDiscount.amount / 100)
            );
        }
    }

    if (autoDiscountAmount > cartTotal) {
        autoDiscountAmount = cartTotal;
    }

    return { autoDiscountAmount, autoDiscount };
};

export default useAutoDiscount;
