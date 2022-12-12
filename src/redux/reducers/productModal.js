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

        default:
            return state;
    }
};

export default productModal;
