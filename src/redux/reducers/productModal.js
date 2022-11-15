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
                    modificatorsAmount: 0,
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
        default:
            return state;
    }
};

export default productModal;
