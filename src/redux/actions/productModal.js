export const setModalProduct = (product) => ({
    type: "SET_MODAL_PRODUCT",
    payload: product,
});

export const clearModalProduct = () => ({
    type: "CLEAR_MODAL_PRODUCT",
});

export const setOpenModal = (openModal) => ({
    type: "SET_OPEN_MODAL",
    payload: openModal,
});

export const addProductModificator = (modificator) => ({
    type: "ADD_PRODUCT_MODIFICATOR",
    payload: modificator,
});

export const decreaseProductModificator = (modificator) => ({
    type: "DECREASE_PRODUCT_MODIFICATOR",
    payload: modificator,
});
