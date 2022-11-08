const initialState = {
    topMenu: [],
    bottomMenu: [],
    pages: [],
    sales: [],
};

const pages = (state = initialState, action) => {
    switch (action.type) {
        case "SET_TOP_MENU":
            return {
                ...state,
                topMenu: action.payload,
            };
        case "SET_BOTTOM_MENU":
            return {
                ...state,
                bottomMenu: action.payload,
            };
        case "SET_PAGES":
            return {
                ...state,
                pages: action.payload,
            };
        case "SET_SALES":
            return {
                ...state,
                sales: action.payload,
            };

        default:
            return state;
    }
};

export default pages;
