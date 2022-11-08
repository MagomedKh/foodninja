const initialState = {
    miniCartOpen: false,
};

const miniCart = (state = initialState, action) => {
    switch (action.type) {
        case "CLOSE_MINI_CART":
            return {
                ...state,
                miniCartOpen: false,
            };
        case "OPEN_MINI_CART":
            return {
                ...state,
                miniCartOpen: true,
            };
        default:
            return state;
    }
};

export default miniCart;
