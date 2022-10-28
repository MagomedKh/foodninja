const initialState = {
    storedInputValue: null,
};

const search = (state = initialState, action) => {
    switch (action.type) {
        case "SET_STORED_INPUT_VALUE":
            return {
                ...state,
                storedInputValue: action.payload,
            };
        default:
            return state;
    }
};

export default search;
