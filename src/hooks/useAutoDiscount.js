import { useSelector } from "react-redux";
import { _checkAutoDiscount } from "../components/helpers";

const useAutoDiscount = (typeDelivery) => {
    const autoDiscounts = useSelector(
        (state) => state.autoDiscounts.autoDiscounts
    );
    const cartProducts = useSelector((state) => state.cart.items);
    const promocode = useSelector((state) => state.cart.promocode);
    const bonusProduct = useSelector((state) => state.cart.bonusProduct);
    const cartTotal = useSelector((state) => state.cart.subTotalPrice);

    let autoDiscount = null;
    let autoDiscountAmount = 0;

    if (autoDiscounts && autoDiscounts.length) {
        autoDiscounts.forEach((discount) => {
            if (
                !autoDiscount &&
                _checkAutoDiscount(
                    discount,
                    cartProducts,
                    cartTotal,
                    promocode,
                    bonusProduct,
                    typeDelivery
                )
            ) {
                autoDiscount = discount;
            }
        });
    }

    if (autoDiscount) {
        if (autoDiscount.type === "fixed") {
            autoDiscountAmount = autoDiscount.amount;
        } else if (autoDiscount.type === "percent") {
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

                cartItem.items.forEach((product) => {
                    // Если скидка не действует на товары по скидке
                    if (
                        autoDiscount.excludeSaleProduct &&
                        product.options._sale_price &&
                        parseInt(product.options._regular_price) >
                            parseInt(product.options._sale_price)
                    ) {
                        return;
                    }

                    let productPrice;
                    if (product.type === "variations") {
                        productPrice = product.variant.price;
                    } else {
                        productPrice = product.options._price;
                    }
                    if (product.modificatorsAmount) {
                        productPrice += product.modificatorsAmount;
                    }
                    autoDiscountAmount += Math.floor(
                        product.options._price * (autoDiscount.amount / 100)
                    );
                });
            });
        }
    }

    return { autoDiscountAmount, autoDiscount };
};

export default useAutoDiscount;
