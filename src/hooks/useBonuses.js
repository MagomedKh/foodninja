import { useSelector } from "react-redux";
import { _cartHasDiscountProduct } from "../components/helpers";

const useBonuses = ({ typeDelivery, deliveryZone }) => {
    const useBonusesLimit = useSelector(
        (state) => state.config.data.CONFIG_bonus_program_order_limit
    );
    const cartTotalPrice = useSelector((state) => state.cart.totalPrice);
    const userBonuses = useSelector((state) => state.user.user.bonuses);
    const promocode = useSelector((state) => state.cart.promocode);

    const configOrderMinPrice = useSelector((state) =>
        parseInt(state.config.data.CONFIG_order_min_price)
    );
    const configSelfOrderMinPrice = useSelector((state) =>
        parseInt(state.config.data.CONFIG_selforder_min_price)
    );

    const orderBonusesLimit = Math.min(
        parseInt((cartTotalPrice / 100) * useBonusesLimit),
        userBonuses
    );

    let maxBonuses =
        userBonuses >= orderBonusesLimit ? orderBonusesLimit : userBonuses;

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

    if (orderMinPrice)
        if (cartTotalPrice - maxBonuses < orderMinPrice) {
            maxBonuses = cartTotalPrice - orderMinPrice;
            if (maxBonuses < 0) maxBonuses = 0;
        }

    return {
        userBonuses,
        useBonusesLimit,
        maxBonuses,
        orderBonusesLimit,
    };
};

export default useBonuses;
