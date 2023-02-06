const initialState = {
    modalOpen: false,
    deliveryZone: null,
};

const deliveryAddressModal = (state = initialState, action) => {
    switch (action.type) {
        case "SET_OPEN_DELIVERY_MODAL":
            return {
                ...state,
                modalOpen: action.payload,
            };

        case "SET_DELIVERY_ZONE":
            return {
                ...state,
                deliveryZone: action.payload,
            };

        default:
            return state;
    }
};

export default deliveryAddressModal;
