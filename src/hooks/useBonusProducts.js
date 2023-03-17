import { useEffect, useMemo } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { getTotalPrice } from "../redux/reducers/cart";
import { addBonusProductToCart } from "../redux/actions/cart";

const useBonusProducts = () => {
    const dispatch = useDispatch();

    const {
        bonuses_items,
        promocode,
        cartProducts,
        productCategories,
        cartBonusProduct,
    } = useSelector(({ products, cart }) => {
        return {
            bonuses_items: products.bonuses_items,
            cartProducts: cart.items,
            promocode: cart.promocode,
            productCategories: products.categories,
            cartBonusProduct: cart.bonusProduct,
        };
    }, shallowEqual);
    const {
        CONFIG_free_products_program_status,
        CONFIG_promocode_with_bonus_program,
        CONFIG_bonuses_not_allowed_categories: disabledCategories,
        CONFIG_bonuses_not_allowed_categories_hardmode: bonusesHardmod,
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
                return `"${category.name}"`;
            } else {
                return "";
            }
        })
        .filter((el) => el);

    const cartTotalPrice = getTotalPrice(productsWithoutCategories);

    const bonusesDisabled = useMemo(
        () =>
            CONFIG_free_products_program_status !== "on" ||
            !bonuses_items ||
            !bonuses_items.length ||
            (CONFIG_promocode_with_bonus_program !== "on" &&
                promocode &&
                Object.keys(promocode).length > 0),
        [
            promocode,
            bonuses_items,
            CONFIG_free_products_program_status,
            CONFIG_promocode_with_bonus_program,
        ]
    );

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
        if (
            promocode &&
            Object.keys(promocode).length > 0 &&
            CONFIG_promocode_with_bonus_program !== "on"
        ) {
            dispatch(addBonusProductToCart({}));
        }
    }, [promocode]);

    return {
        cartTotalPrice,
        programStatus,
        bonusesHardmod,
        bonusesDisabledByCategory,
        disabledCategories,
        disabledCategoriesNames,
        bonusesDisabled,
    };
};

export default useBonusProducts;
