const initialState = {
    autoDiscounts: null,
};

const autoDiscounts = (state = initialState, action) => {
    switch (action.type) {
        case "SET_AUTO_DISCOUNTS":
            return {
                ...state,
                autoDiscounts: action.payload,
            };
        default:
            return state;
    }
};

export default autoDiscounts;
