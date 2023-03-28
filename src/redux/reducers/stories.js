const initialState = {
    stories: null,
};

const banners = (state = initialState, action) => {
    switch (action.type) {
        case "SET_STORIES":
            return {
                ...state,
                stories: action.payload,
            };
        default:
            return state;
    }
};

export default banners;
