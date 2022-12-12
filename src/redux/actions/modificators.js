export const addProductModificator = (modificator) => ({
    type: "ADD_PRODUCT_MODIFICATOR",
    payload: modificator,
});

export const decreaseProductModificator = (modificator) => ({
    type: "DECREASE_PRODUCT_MODIFICATOR",
    payload: modificator,
});

export const addEmptyRequiredCategory = (categoryId) => ({
    type: "ADD_EMPTY_REQUIRED_CATEGORY",
    payload: categoryId,
});

export const deleteEmptyRequiredCategory = (categoryId) => ({
    type: "DELETE_EMPTY_REQUIRED_CATEGORY",
    payload: categoryId,
});

export const clearModificators = () => ({
    type: "CLEAR_MODIFICATORS",
});
