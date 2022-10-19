const initialState = {
    topMenu: [],
    bottomMenu: [],
    pages: [],
    sales: [],
    currentPage: '/'
}

const pages = ( state = initialState, action) => {
    switch (action.type) {
        case 'SET_TOP_MENU':
            return {
                ...state, 
                topMenu: action.payload
            }          
        case 'SET_BOTTOM_MENU':
            return {
                ...state, 
                bottomMenu: action.payload
            }         
        case 'SET_PAGES':
            return {
                ...state,
                pages: action.payload
            }           
        case 'SET_SALES':
            return {
                ...state,
                sales: action.payload
            }        
        case 'SET_CURRENT_PAGE':
            return {
                ...state, 
                currentPage: action.payload
            }
    
        default:
            return state
    }
};

export default pages;