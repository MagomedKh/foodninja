import { useEffect, useMemo } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { getTotalPrice } from "../redux/reducers/cart";
import { addBonusProductToCart } from "../redux/actions/cart";
import { getDay } from "date-fns";
import { _checkWorkingInterval } from "../components/helpers";

const useBonusProducts = () => {
    const dispatch = useDispatch();

    const {
        bonuses_items,
        promocode,
        conditionalPromocode,
        cartProducts,
        productCategories,
        cartBonusProduct,
    } = useSelector(({ products, cart }) => {
        return {
            bonuses_items: products.bonuses_items,
            cartProducts: cart.items,
            promocode: cart.promocode,
            conditionalPromocode: cart.conditionalPromocode,
            productCategories: products.categories,
            cartBonusProduct: cart.bonusProduct,
        };
    }, shallowEqual);
    const {
        CONFIG_free_products_program_status,
        CONFIG_promocode_with_bonus_program,
        CONFIG_bonuses_not_allowed_categories: disabledCategories,
        CONFIG_bonuses_not_allowed_categories_hardmode: bonusesHardmod,
        CONFIG_bonuses_use_limit_time,
        CONFIG_bonuses_start_active,
        CONFIG_bonuses_end_active,
        CONFIG_bonuses_days,
    } = useSelector((state) => {
        return state.config.data;
    }, shallowEqual);

    const programStatus = CONFIG_free_products_program_status === "on";

    const allProducts = [].concat.apply(
        [],
        Object.values(cartProducts).map((obj) => obj.items)
    );

    const productsWithoutCategories = allProducts.filter((product) => {
        if (disabledCategories?.length) {
            if (
                product.categories?.some((category) =>
                    disabledCategories.includes(category)
                )
            ) {
                return false;
            }
        }
        return true;
    });

    const bonusesDisabledByCategory =
        bonusesHardmod === "yes" &&
        !!allProducts.find((product) => {
            if (disabledCategories?.length) {
                if (
                    product.categories?.some((category) =>
                        disabledCategories.includes(category)
                    )
                ) {
                    return true;
                }
            }
            return false;
        });

    const disabledCategoriesNames = disabledCategories
        ?.map((id) => {
            const category = productCategories.find(
                (category) => category.term_id === id
            );
            if (category) {
                return `«${category.name}»`;
            } else {
                return "";
            }
        })
        .filter((el) => el);

    const cartTotalPrice = getTotalPrice(productsWithoutCategories);

    //Проверяем работают ли бонусные товары в текущий день недели
    let bonusesDisabledByDays = false;

    if (
        CONFIG_bonuses_use_limit_time &&
        CONFIG_bonuses_days &&
        CONFIG_bonuses_days.length
    ) {
        const currentDayOfWeek =
            getDay(new Date()) === 0 ? 6 : getDay(new Date()) - 1;
        if (CONFIG_bonuses_days[currentDayOfWeek] == 0) {
            bonusesDisabledByDays = true;
        }
    }

    //Проверяем работают ли бонусные товары в текущее время
    let bonusesDisabledByTime =
        CONFIG_bonuses_use_limit_time &&
        !_checkWorkingInterval(
            CONFIG_bonuses_start_active,
            CONFIG_bonuses_end_active
        );

    const bonusesDisabled =
        CONFIG_free_products_program_status !== "on" ||
        !bonuses_items ||
        !bonuses_items.length ||
        bonusesDisabledByDays ||
        bonusesDisabledByTime;

    const bonusesDisabledByPromocode =
        CONFIG_promocode_with_bonus_program !== "on" &&
        (Object.keys(promocode).length || conditionalPromocode);

    useEffect(() => {
        if (cartBonusProduct.id && bonusesDisabledByCategory) {
            dispatch(addBonusProductToCart({}));
        }
    }, [bonusesDisabledByCategory]);

    useEffect(() => {
        if (cartBonusProduct.id && cartBonusProduct.limit > cartTotalPrice) {
            dispatch(addBonusProductToCart({}));
        }
    }, [cartTotalPrice]);

    useEffect(() => {
        if (cartBonusProduct.id && bonusesDisabledByPromocode) {
            dispatch(addBonusProductToCart({}));
        }
    }, [promocode, bonusesDisabledByPromocode]);

    return {
        cartTotalPrice,
        programStatus,
        bonusesHardmod,
        disabledCategories,
        disabledCategoriesNames,
        bonusesDisabled,
        bonusesDisabledByCategory,
        bonusesDisabledByPromocode,
    };
};

export default useBonusProducts;
