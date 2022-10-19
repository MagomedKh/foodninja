const initialState = {
    gateways: {}
}

const gateways = ( state = initialState, action) => {
    switch (action.type) {
        case 'SET_GATEWAYS':
            return {
                ...state, 
                gateways: action.payload
            }

        default:
            return state
    }
};

export default gateways;