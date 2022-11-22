import { _clone } from "../../components/helpers";

const initialState = {
    items: {},
    bonusProduct: {},
    totalRolls: 0,
    freeAddons: {},
    promocode: {},
    promocodeProducts: {},
    discount: 0,
    subTotalPrice: 0,
    countItems: 0,
    totalPrice: 0,
};

const getTotalPrice = (products) =>
    products.reduce((total, item) => total + parseInt(item.options._price), 0);

const getDiscountTotalPrice = (products) =>
    products.reduce((total, item) => total + item.totalPrice, 0);

const getItemTotalPrice = (products) =>
    Math.ceil(
        products.reduce((total, item) => {
            if (
                item.options._promocode_price ||
                item.options._promocode_price === 0
            ) {
                return total + item.options._promocode_price;
            }
            return total + parseInt(item.options._price);
        }, 0)
    );

const getProductsRollsCount = (products) =>
    products.reduce(
        (total, item) =>
            !isNaN(parseInt(item.options.count_rolls))
                ? total + parseInt(item.options.count_rolls)
                : total,
        0
    );
const getTotalRollsCount = (cartProducts, state) => {
    let totalRolls = getProductsRollsCount(cartProducts);
    // console.log(getProductsRollsCount(Object.values(state.promocodeProducts)));
    // totalRolls += Object.values(state.bonusProduct).length ? !isNaN(parseInt(state.bonusProduct.options.count_rolls)) ? parseInt(state.bonusProduct.options.count_rolls) : 0 : 0;
    // totalRolls += Object.values(state.promocodeProducts).length ? getProductsRollsCount(Object.values(state.promocodeProducts)) : 0;
    return totalRolls;
};

const cart = (state = initialState, action) => {
    switch (action.type) {
        case "ADD_PROMOCODE": {
            console.log(action.payload);
            switch (action.payload.type) {
                case "percent": {
                    const percentDiscount = (100 - action.payload.amount) / 100;
                    let productsWithDiscount;

                    //Добавляем к товарам из выбранных категорий свойство "_promocode_price"
                    if (
                        action.payload.excludeCategories &&
                        action.payload.categories.length
                    ) {
                        productsWithDiscount = { ...state.items };
                        for (let el in productsWithDiscount) {
                            productsWithDiscount[el].items.forEach(
                                (elem, index, array) => {
                                    if (
                                        !action.payload.categories?.some((r) =>
                                            elem.categories?.includes(r)
                                        ) &&
                                        (!elem.options._sale_price ||
                                            (action.payload
                                                .categories_hardmode !==
                                                "yes" &&
                                                !action.payload
                                                    .excludeSaleProduct))
                                    ) {
                                        array[index] = {
                                            ...elem,
                                            options: {
                                                ...elem.options,
                                                _promocode_price:
                                                    elem.options._price *
                                                    percentDiscount,
                                            },
                                        };
                                    } else {
                                        array[index] = elem;
                                    }
                                }
                            );
                            productsWithDiscount[el].totalPrice =
                                getItemTotalPrice(
                                    productsWithDiscount[el].items
                                );
                        }
                    } else if (
                        !action.payload.excludeCategories &&
                        action.payload.categories.length
                    ) {
                        productsWithDiscount = { ...state.items };
                        for (let el in productsWithDiscount) {
                            productsWithDiscount[el].items.forEach(
                                (elem, index, array) => {
                                    if (
                                        action.payload.categories?.some((r) =>
                                            elem.categories?.includes(r)
                                        ) &&
                                        (!elem.options._sale_price ||
                                            (action.payload
                                                .categories_hardmode !==
                                                "yes" &&
                                                !action.payload
                                                    .excludeSaleProduct))
                                    ) {
                                        array[index] = {
                                            ...elem,
                                            options: {
                                                ...elem.options,
                                                _promocode_price:
                                                    elem.options._price *
                                                    percentDiscount,
                                            },
                                        };
                                    } else {
                                        array[index] = elem;
                                    }
                                }
                            );
                            productsWithDiscount[el].totalPrice =
                                getItemTotalPrice(
                                    productsWithDiscount[el].items
                                );
                        }
                    } else {
                        productsWithDiscount = { ...state.items };
                        for (let el in productsWithDiscount) {
                            productsWithDiscount[el].items.forEach(
                                (elem, index, array) => {
                                    if (
                                        !elem.options._sale_price ||
                                        (action.payload.categories_hardmode !==
                                            "yes" &&
                                            !action.payload.excludeSaleProduct)
                                    ) {
                                        array[index] = {
                                            ...elem,
                                            options: {
                                                ...elem.options,
                                                _promocode_price:
                                                    elem.options._price *
                                                    percentDiscount,
                                            },
                                        };
                                    } else {
                                        array[index] = elem;
                                    }
                                }
                            );
                            productsWithDiscount[el].totalPrice =
                                getItemTotalPrice(
                                    productsWithDiscount[el].items
                                );
                        }
                    }
                    const allProducts = [].concat.apply(
                        [],
                        Object.values(productsWithDiscount).map(
                            (obj) => obj.items
                        )
                    );
                    const allPrices = [].concat.apply(
                        [],
                        Object.values(productsWithDiscount)
                    );

                    const totalPrice = getDiscountTotalPrice(allPrices);
                    const subTotalPrice = getTotalPrice(allProducts);
                    const discount = subTotalPrice - totalPrice;

                    // Считаем размер скидки как разницу между ценой по промокоду и обычной
                    // const discount = Math.floor(
                    //     allProducts.reduce((total, item) => {
                    //         if (item.options._promocode_price) {
                    //             return (
                    //                 total +
                    //                 (item.options._price -
                    //                     item.options._promocode_price)
                    //             );
                    //         } else {
                    //             return total;
                    //         }
                    //     }, 0)
                    // );
                    return {
                        ...state,
                        items: productsWithDiscount,
                        discount: discount,
                        promocode: action.payload,
                        totalPrice: totalPrice,
                        subTotalPrice: subTotalPrice,
                    };
                }
                case "fixed_cart": {
                    const discount = action.payload.amount;
                    const allProducts = [].concat.apply(
                        [],
                        Object.values(state.items).map((obj) => obj.items)
                    );
                    const totalPrice = getTotalPrice(allProducts);
                    return {
                        ...state,
                        discount: discount,
                        promocode: action.payload,
                        subTotalPrice: totalPrice,
                        totalPrice: totalPrice - discount,
                    };
                }
                case "fixed_product": {
                    const discount =
                        action.payload.promocodeProducts.options._price -
                        action.payload.productPrice;
                    action.payload.promocodeProducts.options._promocode_price =
                        action.payload.productPrice;
                    // Добавляем в корзину если товара нет
                    if (!state.items[action.payload.promocodeProducts.id]) {
                        const updatedItems = {
                            ...state.items,
                            [action.payload.promocodeProducts.id]: {
                                items: [action.payload.promocodeProducts],
                                totalPrice: getItemTotalPrice([
                                    action.payload.promocodeProducts,
                                ]),
                            },
                        };

                        updatedItems[
                            action.payload.promocodeProducts.id
                        ].items.at(-1).options._promocode_price = parseInt(
                            action.payload.productPrice
                        );

                        const allProducts = [].concat.apply(
                            [],
                            Object.values(updatedItems).map((obj) => obj.items)
                        );
                        const allPrices = [].concat.apply(
                            [],
                            Object.values(updatedItems)
                        );
                        const subTotalPrice = getTotalPrice(allProducts);
                        const totalPrice = getDiscountTotalPrice(allPrices);

                        return {
                            ...state,
                            items: updatedItems,
                            discount: discount,
                            promocode: action.payload,
                            promocodeProducts: action.payload.promocodeProducts,
                            subTotalPrice: subTotalPrice,
                            totalPrice: totalPrice,
                        };
                    } else {
                        // Вариативные товары
                        if (
                            action.payload.promocodeProducts.type ===
                            "variations"
                        ) {
                            let find = false;
                            const itemsWithDiscount = { ...state.items };
                            itemsWithDiscount[
                                action.payload.promocodeProducts.id
                            ].items.forEach((element) => {
                                if (
                                    element.variant.variant_id ===
                                    action.payload.promocodeProducts.variant
                                        .variant_id
                                ) {
                                    find = true;
                                }
                            });

                            if (!find) {
                                console.log("find");
                                let buffItems;
                                buffItems = [
                                    ...itemsWithDiscount[
                                        action.payload.promocodeProducts.id
                                    ].items,
                                ];
                                buffItems.push(
                                    _clone(action.payload.promocodeProducts)
                                );
                                let newItems = buffItems;

                                const updatedItems = {
                                    ...itemsWithDiscount,
                                    [action.payload.promocodeProducts.id]: {
                                        items: newItems,
                                        totalPrice: getItemTotalPrice([
                                            action.payload.promocodeProducts,
                                        ]),
                                    },
                                };
                                updatedItems[
                                    action.payload.promocodeProducts.id
                                ].items[0].options._promocode_price = parseInt(
                                    action.payload.productPrice
                                );

                                const allProducts = [].concat.apply(
                                    [],
                                    Object.values(updatedItems).map(
                                        (obj) => obj.items
                                    )
                                );
                                const allPrices = [].concat.apply(
                                    [],
                                    Object.values(updatedItems)
                                );
                                const subTotalPrice =
                                    getTotalPrice(allProducts);
                                const totalPrice =
                                    getDiscountTotalPrice(allPrices);

                                return {
                                    ...state,
                                    items: updatedItems,
                                    discount: discount,
                                    promocode: action.payload,
                                    promocodeProducts:
                                        action.payload.promocodeProducts,
                                    totalPrice: totalPrice,
                                    subTotalPrice: subTotalPrice,
                                };
                            } else {
                                console.log("else");
                                // const updatedItems = {
                                //     ...state.items,
                                //     [action.payload.promocodeProducts.id]: {
                                //         totalPrice: getItemTotalPrice([
                                //             action.payload.promocodeProducts,
                                //         ]),
                                //     },
                                // };
                                // itemsWithDiscount[
                                //     action.payload.promocodeProducts.id
                                // ].totalPrice = getItemTotalPrice(
                                //     itemsWithDiscount[
                                //         action.payload.promocodeProducts.id
                                //     ].items
                                // );
                                let buffItems;
                                buffItems = [
                                    ...itemsWithDiscount[
                                        action.payload.promocodeProducts.id
                                    ].items,
                                ];
                                let newItems = buffItems;

                                const updatedItems = {
                                    ...itemsWithDiscount,
                                    [action.payload.promocodeProducts.id]: {
                                        items: newItems,
                                    },
                                };
                                updatedItems[
                                    action.payload.promocodeProducts.id
                                ].items[0].options._promocode_price = parseInt(
                                    action.payload.productPrice
                                );

                                updatedItems[
                                    action.payload.promocodeProducts.id
                                ].totalPrice = getItemTotalPrice(
                                    updatedItems[
                                        action.payload.promocodeProducts.id
                                    ].items
                                );

                                const allProducts = [].concat.apply(
                                    [],
                                    Object.values(state.items).map(
                                        (obj) => obj.items
                                    )
                                );
                                const allPrices = [].concat.apply(
                                    [],
                                    Object.values(updatedItems)
                                );
                                const subTotalPrice =
                                    getTotalPrice(allProducts);
                                const totalPrice =
                                    getDiscountTotalPrice(allPrices);
                                return {
                                    ...state,
                                    items: updatedItems,
                                    discount: discount,
                                    promocode: action.payload,
                                    promocodeProducts:
                                        action.payload.promocodeProducts,
                                    totalPrice: totalPrice,
                                    subTotalPrice: subTotalPrice,
                                };
                            }
                        } else {
                            const updatedItems = {
                                ...state.items,
                            };

                            updatedItems[
                                action.payload.promocodeProducts.id
                            ].items[0].options._promocode_price = parseInt(
                                action.payload.productPrice
                            );
                            updatedItems[
                                action.payload.promocodeProducts.id
                            ].totalPrice = getItemTotalPrice(
                                updatedItems[
                                    action.payload.promocodeProducts.id
                                ].items
                            );

                            // console.log(
                            //     getItemTotalPrice(
                            //         updatedItems[
                            //             action.payload.promocodeProducts.id
                            //         ].items
                            //     )
                            // );

                            const allProducts = [].concat.apply(
                                [],
                                Object.values(updatedItems).map(
                                    (obj) => obj.items
                                )
                            );
                            const allPrices = [].concat.apply(
                                [],
                                Object.values(updatedItems)
                            );
                            const subTotalPrice = getTotalPrice(allProducts);
                            const totalPrice = getDiscountTotalPrice(allPrices);
                            return {
                                ...state,
                                items: updatedItems,
                                discount: discount,
                                promocode: action.payload,
                                promocodeProducts:
                                    action.payload.promocodeProducts,
                                totalPrice: totalPrice,
                                subTotalPrice: subTotalPrice,
                            };
                        }
                    }
                }
            }
        }
        case "REMOVE_PROMOCODE": {
            const productsWithoutDiscount = { ...state.items };
            for (let el in productsWithoutDiscount) {
                productsWithoutDiscount[el].items.forEach(
                    (elem, index, array) => {
                        delete array[index].options._promocode_price;
                    }
                );
                productsWithoutDiscount[el].totalPrice = getItemTotalPrice(
                    productsWithoutDiscount[el].items
                );
            }
            const allProducts = [].concat.apply(
                [],
                Object.values(productsWithoutDiscount).map((obj) => obj.items)
            );
            const totalPrice = getTotalPrice(allProducts);
            const totalRolls = getTotalRollsCount(allProducts, state);
            return {
                ...state,
                items: productsWithoutDiscount,
                totalRolls: totalRolls,
                discount: 0,
                promocode: {},
                promocodeProducts: {},
                totalPrice: totalPrice,
                subTotalPrice: totalPrice,
            };
        }
        case "ADD_BONUS_PRODUCT_TO_CART": {
            return {
                ...state,
                bonusProduct: action.payload,
            };
        }
        case "ADD_PRODUCT_TO_CART": {
            const newItem = { ...action.payload };

            // Добавляем товар с активным промокодом на %
            if (state.promocode.type === "percent") {
                if (
                    state.promocode?.categories?.length &&
                    state.promocode?.excludeCategories
                ) {
                    if (
                        !state.promocode?.categories?.some((r) =>
                            action.payload.categories.includes(r)
                        ) &&
                        (!action.payload.options._sale_price ||
                            (state.promocode.categories_hardmode !== "yes" &&
                                !state.promocode.excludeSaleProduct))
                    ) {
                        newItem.options = {
                            ...newItem.options,
                            _promocode_price:
                                (newItem.options._price *
                                    (100 - state.promocode.amount)) /
                                100,
                        };
                    }
                } else if (
                    state.promocode?.categories?.length &&
                    !state.promocode?.excludeCategories
                ) {
                    if (
                        state.promocode?.categories?.some((r) =>
                            action.payload.categories.includes(r)
                        ) &&
                        (!action.payload.options._sale_price ||
                            (state.promocode.categories_hardmode !== "yes" &&
                                !state.promocode.excludeSaleProduct))
                    ) {
                        newItem.options = {
                            ...newItem.options,
                            _promocode_price:
                                (newItem.options._price *
                                    (100 - state.promocode.amount)) /
                                100,
                        };
                    }
                } else if (Object.keys(state.promocode).length) {
                    if (
                        !action.payload.options._sale_price ||
                        (state.promocode.categories_hardmode !== "yes" &&
                            !state.promocode.excludeSaleProduct)
                    ) {
                        newItem.options = {
                            ...newItem.options,
                            _promocode_price:
                                (newItem.options._price *
                                    (100 - state.promocode.amount)) /
                                100,
                        };
                    }
                }

                console.log(newItem);

                let newItems;

                newItems = state.items[action.payload.id]
                    ? [...state.items[action.payload.id].items, newItem]
                    : [newItem];

                const updatedItems = {
                    ...state.items,
                    [action.payload.id]: {
                        items: newItems,
                        totalPrice: getItemTotalPrice(newItems),
                    },
                };
                const allProducts = [].concat.apply(
                    [],
                    Object.values(updatedItems).map((obj) => obj.items)
                );
                const allPrices = [].concat.apply(
                    [],
                    Object.values(updatedItems)
                );

                const totalPrice = getDiscountTotalPrice(allPrices);
                const subTotalPrice = getTotalPrice(allProducts);
                const discount = subTotalPrice - totalPrice;
                const totalRolls = getTotalRollsCount(allProducts, state);

                return {
                    ...state,
                    items: updatedItems,
                    discount: discount,
                    totalRolls: totalRolls,
                    countItems: allProducts.length,
                    totalPrice: totalPrice,
                    subTotalPrice: subTotalPrice,
                };
            }

            let newItems;
            if (action.payload.variant) {
                if (!state.items[action.payload.id]) {
                    newItems = [_clone(action.payload)];
                } else {
                    let buffItems;
                    buffItems = [...state.items[action.payload.id].items];
                    buffItems.push(_clone(action.payload));
                    newItems = buffItems;
                }
            } else {
                const newItem = _clone(action.payload);
                delete newItem.options._promocode_price;
                newItems = !state.items[action.payload.id]
                    ? [newItem]
                    : [...state.items[action.payload.id].items, newItem];
            }

            const updatedItems = {
                ...state.items,
            };

            updatedItems[action.payload.id] = {
                items: newItems,
                totalPrice: getItemTotalPrice(newItems),
            };

            console.log(updatedItems);
            const allProducts = [].concat.apply(
                [],
                Object.values(updatedItems).map((obj) => obj.items)
            );
            const allPrices = [].concat.apply([], Object.values(updatedItems));

            const totalPrice = getDiscountTotalPrice(allPrices);
            const subTotalPrice = getTotalPrice(allProducts);
            const discount = subTotalPrice - totalPrice;
            const totalRolls = getTotalRollsCount(allProducts, state);

            // if( state.promocode && !_checkPromocode(state.promocode, updatedItems, getTotalPrice(allProducts) ) ) {
            //     const bonusProduct = state.bonusProduct
            //     return {
            //         ...state,
            //         items: updatedItems,
            //         totalRolls: totalRolls,
            //         bonusProduct: bonusProduct,
            //         countItems: allProducts.length,
            //         subTotalPrice: getTotalPrice(allProducts),
            //         promocode: {},
            //         promocodeProducts: {},
            //         discount: 0,
            //         totalPrice: getTotalPrice(allProducts)
            //     }
            // }

            return {
                ...state,
                items: updatedItems,
                discount: discount,
                totalRolls: totalRolls,
                countItems: allProducts.length,
                totalPrice: totalPrice,
                subTotalPrice: subTotalPrice,
            };
        }
        case "DECREASE_PRODUCT_IN_CART": {
            const oldItems = [...state.items[action.payload.id].items];
            const newItems = [...state.items[action.payload.id].items];
            if (newItems.length > 1) {
                newItems.pop();
            }
            const updatedItems = {
                ...state.items,
                [action.payload.id]: {
                    items: newItems,
                    totalPrice: getItemTotalPrice(newItems),
                },
            };
            if (oldItems.length === 1) delete updatedItems[action.payload.id];

            const allProducts = [].concat.apply(
                [],
                Object.values(updatedItems).map((obj) => obj.items)
            );
            const allPrices = [].concat.apply([], Object.values(updatedItems));

            const totalPrice = getDiscountTotalPrice(allPrices);
            const subTotalPrice = getTotalPrice(allProducts);
            const discount = subTotalPrice - totalPrice;
            const totalRolls = getTotalRollsCount(allProducts, state);

            const bonusProduct = state.bonusProduct
                ? totalPrice >= state.bonusProduct.limit
                    ? state.bonusProduct
                    : {}
                : {};

            // if( state.promocode && !_checkPromocode(state.promocode, updatedItems, cartTotalPrice ) ) {

            //     return {
            //         ...state,
            //         items: updatedItems,
            //         totalRolls: totalRolls,
            //         bonusProduct: bonusProduct,
            //         countItems: allProducts.length,
            //         subTotalPrice: cartTotalPrice,
            //         promocode: {},
            //         promocodeProducts: {},
            //         discount: 0,
            //         totalPrice: cartTotalPrice
            //     }
            // }
            return {
                ...state,
                items: updatedItems,
                totalRolls: totalRolls,
                bonusProduct: bonusProduct,
                countItems: allProducts.length,
                discount: discount,
                totalPrice: totalPrice,
                subTotalPrice: subTotalPrice,
            };
        }
        case "REMOVE_PRODUCT_FROM_CART": {
            const updatedItems = state.items;

            if (action.payload.variant) {
                const indexVar = Object.values(
                    updatedItems[action.payload.id].items
                ).findLastIndex(
                    (element) =>
                        element.variant.variant_id ===
                        action.payload.variant.variant_id
                );
                updatedItems[action.payload.id].items.splice(indexVar, 1);
                updatedItems[action.payload.id].totalPrice = getItemTotalPrice(
                    updatedItems[action.payload.id].items
                );
                if (!updatedItems[action.payload.id].items.length)
                    delete updatedItems[action.payload.id];
            } else delete updatedItems[action.payload.id];

            const allProducts = [].concat.apply(
                [],
                Object.values(updatedItems).map((obj) => obj.items)
            );
            const allPrices = [].concat.apply([], Object.values(updatedItems));

            const totalPrice = getDiscountTotalPrice(allPrices);
            const subTotalPrice = getTotalPrice(allProducts);
            const discount = subTotalPrice - totalPrice;
            const totalRolls = getTotalRollsCount(allProducts, state);
            const bonusProduct = state.bonusProduct
                ? totalPrice >= state.bonusProduct.limit
                    ? state.bonusProduct
                    : {}
                : {};

            // if( state.promocode && !_checkPromocode(state.promocode, updatedItems, cartTotalPrice ) ) {

            //     return {
            //         ...state,
            //         items: updatedItems,
            //         totalRolls: totalRolls,
            //         bonusProduct: bonusProduct,
            //         countItems: allProducts.length,
            //         subTotalPrice: cartTotalPrice,
            //         promocode: {},
            //         promocodeProducts: {},
            //         discount: 0,
            //         totalPrice: cartTotalPrice
            //     }
            // }
            return {
                ...state,
                items: updatedItems,
                bonusProduct: bonusProduct,
                totalRolls: totalRolls,
                countItems: allProducts.length,
                discount: discount,
                totalPrice: totalPrice,
                subTotalPrice: subTotalPrice,
            };
        }

        case "CLEAR_CART": {
            return initialState;
        }
        default:
            return state;
    }
};

export default cart;
