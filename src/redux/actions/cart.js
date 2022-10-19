export const addProductToCart = (product) => ({
    type: 'ADD_PRODUCT_TO_CART',
    payload: product
});

export const addBonusProductToCart = (product) => ({
    type: 'ADD_BONUS_PRODUCT_TO_CART',
    payload: product
});

export const decreaseProductInCart = (product) => ({
    type: 'DECREASE_PRODUCT_IN_CART',
    payload: product
});

export const removeProductFromCart = (product) => ({
    type: 'REMOVE_PRODUCT_FROM_CART',
    payload: product
});

export const addPromocode = (promocode) => ({
    type: 'ADD_PROMOCODE',
    payload: promocode
});

export const removePromocode = () => ({
    type: 'REMOVE_PROMOCODE'
});

export const clearCart = () => ({
    type: 'CLEAR_CART'
});