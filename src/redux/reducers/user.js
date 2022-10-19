const initialState = {
    openModalAuth: false,
    user: {
        id: '',
        phone: '',
        name: '',
        email: '',
        vk: '',
        token: '',
        bonuses: 0
    }
}

const user = ( state = initialState, action) => {
    switch( action.type ) {
        case 'SAVE_LOGIN': 
        case 'LOGIN': 
           return {
               ...state,
               user: action.payload
           } 

        case 'LOGOUT':
            return initialState
        case 'SET_OPEN_AUTH_MODAL':
            return {
                ...state,
                openModalAuth: action.payload
            }  
        default:
            return state
    }
};

export default user;