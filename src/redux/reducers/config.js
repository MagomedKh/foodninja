const initialState = {
    data: {},
    status: false,
    openTownModal: false
}

const config = ( state = initialState, action) => {
    switch (action.type) {
        case 'SET_CONFIG':
            return {
                ...state, 
                data: action.payload
            }        
        case 'SET_STATUS':
            return {
                ...state, 
                status: action.payload
            }        
        case 'SET_TOWN_MODAL':
            return {
                ...state, 
                openTownModal: action.payload
            }
        default:
            return state
    }
};

export default config;