const initialState = {
    open: false,
    message: '',
}

const systemAlerts = ( state = initialState, action) => {
    switch( action.type ) {
        case 'UPDATE_ALERTS':
            return {
                open: action.payload.open,
                message: action.payload.message,
            }  
        default:
            return state
    }
};

export default systemAlerts;