const initialState = {
    productModal: false,
    openProductModal: false,
};

const productModal = (state = initialState, action) => {
    switch (action.type) {
        case "SET_MODAL_PRODUCT": {
            return {
                ...state,
                productModal: {
                    ...action.payload,
                    choosenModificators: [],
                    emptyModificatorCategories: [],
                    modificatorsAmount: 0,
                    modificatorsCondition: true,
                },
            };
        }
        case "CLEAR_MODAL_PRODUCT": {
            return {
                ...state,
                productModal: false,
            };
        }
        case "SET_OPEN_MODAL": {
            return {
                ...state,
                openProductModal: action.payload,
            };
        }
        case "ADD_PRODUCT_MODIFICATOR": {
            const existModificatorInx =
                state.productModal.choosenModificators.findIndex(
                    (el) => el.id === action.payload.id
                );
            const updatedProductModal = { ...state.productModal };
            if (existModificatorInx >= 0) {
                updatedProductModal.choosenModificators[existModificatorInx]
                    .count++;
            } else {
                updatedProductModal.choosenModificators.push(action.payload);
            }
            updatedProductModal.modificatorsAmount +=
                action.payload.options._price;
            return {
                ...state,
                productModal: updatedProductModal,
            };
        }
        case "DECREASE_PRODUCT_MODIFICATOR": {
            const existModificatorInx =
                state.productModal.choosenModificators.findIndex(
                    (el) => el.id === action.payload.id
                );
            const updatedProductModal = { ...state.productModal };
            if (existModificatorInx >= 0) {
                updatedProductModal.choosenModificators[existModificatorInx]
                    .count--;
                if (
                    updatedProductModal.choosenModificators[existModificatorInx]
                        .count <= 0
                ) {
                    updatedProductModal.choosenModificators.splice(
                        existModificatorInx,
                        1
                    );
                }
            }
            updatedProductModal.modificatorsAmount -=
                action.payload.options._price;
            return {
                ...state,
                productModal: updatedProductModal,
            };
        }
        case "ADD_EMPTY_REQUIRED_CATEGORY": {
            const updatedProductModal = { ...state.productModal };
            const newEmptyModificatorCategories = state.productModal
                .emptyModificatorCategories?.length
                ? [...state.productModal.emptyModificatorCategories]
                : [];
            if (!newEmptyModificatorCategories.includes(action.payload)) {
                newEmptyModificatorCategories.push(action.payload);
            }
            updatedProductModal.emptyModificatorCategories =
                newEmptyModificatorCategories;
            updatedProductModal.modificatorsCondition =
                !newEmptyModificatorCategories.length;

            return {
                ...state,
                productModal: updatedProductModal,
            };
        }
        case "DELETE_EMPTY_REQUIRED_CATEGORY": {
            const updatedProductModal = { ...state.productModal };
            const newEmptyModificatorCategories = state.productModal
                .emptyModificatorCategories?.length
                ? [...state.productModal.emptyModificatorCategories]
                : [];
            const requiredModificatorInx =
                newEmptyModificatorCategories.findIndex(
                    (el) => el === action.payload
                );
            newEmptyModificatorCategories.splice(requiredModificatorInx, 1);
            updatedProductModal.emptyModificatorCategories =
                newEmptyModificatorCategories;
            updatedProductModal.modificatorsCondition =
                !newEmptyModificatorCategories.length;
            return {
                ...state,
                productModal: updatedProductModal,
            };
        }

        default:
            return state;
    }
};

export default productModal;
