const initialState = {
    availableTime: {
        0: {
            timestamp: new Date().getTime(),
            title: 'Как можно быстрее'
        }
    }
}

const orderTime = ( state = initialState, action) => {
    switch (action.type) {
        case 'SET_ORDER_TIME':
            return {
                ...state, 
                availableTime: action.payload
            }

        default:
            return state
    }
};

export default orderTime;