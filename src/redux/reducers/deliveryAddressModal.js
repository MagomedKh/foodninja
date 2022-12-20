const initialState = {
    modalOpen: false,
};

const deliveryAddressModal = (state = initialState, action) => {
    switch (action.type) {
        case "SET_OPEN_DELIVERY_MODAL":
            return {
                ...state,
                modalOpen: action.payload,
            };
        default:
            return state;
    }
};

export default deliveryAddressModal;
