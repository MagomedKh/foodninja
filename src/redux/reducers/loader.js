const initialState = {
    status: false
}

const loader = ( state = initialState, action) => {
    switch (action.type) {       
        case 'SET_SHOW_LOADER':
            console.log(1);
            return {
                ...state,
                status: action.payload
            }
        default:
            return state
    }
};

export default loader;