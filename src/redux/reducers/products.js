const initialState = {
    items: [],
    addon_items: [],
    recommend_items: [],
    bonuses_items: [],
    categories: [],
    productsIsLoading: false,
    categoriesIsLoading: false,
}

const products = ( state = initialState, action) => {
    switch (action.type) {
        case 'SET_PRODUCTS':
            return {
                ...state, 
                items: action.payload,
                productsIsLoading: true
            }        
        case 'SET_ADDON_PRODUCTS':
            return {
                ...state, 
                addon_items: action.payload,
            }        
        case 'SET_RECOMMEND_PRODUCTS':
            return {
                ...state, 
                recommend_items: action.payload,
            }        
        case 'SET_BONUSES_PRODUCTS':
            return {
                ...state, 
                bonuses_items: action.payload,
            }
        case 'SET_CATEGORIES':
            return {
                ...state, 
                categories: action.payload,
                categoriesIsLoading: true
            }
    
        default:
            return state
    }
};

export default products;