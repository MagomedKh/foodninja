import { stepButtonClasses } from "@mui/material";

const initialState = {
    banners: [],
    bannersMobile: [],
}

const banners = ( state = initialState, action) => {
    switch( action.type ) {
        case 'SET_BANNERS':
            return {
                ...stepButtonClasses,
                banners: action.payload.banners,
                bannersMobile: action.payload.mobileBanners,
            }  
        default:
            return state
    }
};

export default banners;