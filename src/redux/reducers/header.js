const initialState = {
    mobileMenuOpen: false,
};

const header = (state = initialState, action) => {
    switch (action.type) {
        case "CLOSE_MOBILE_MENU":
            return {
                ...state,
                mobileMenuOpen: false,
            };
        case "OPEN_MOBILE_MENU":
            return {
                ...state,
                mobileMenuOpen: true,
            };
        default:
            return state;
    }
};

export default header;
