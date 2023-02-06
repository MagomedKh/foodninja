import { _clone } from "../../components/helpers";

const initialState = {
    openModalAuth: false,
    user: {
        id: "",
        phone: "",
        name: "",
        email: "",
        vk: "",
        token: "",
        bonuses: 0,
        dayBirthday: null,
        monthBirthday: null,
    },
};

const user = (state = initialState, action) => {
    switch (action.type) {
        case "SAVE_LOGIN":
        case "LOGIN":
            return {
                ...state,
                user: action.payload,
            };

        case "LOGOUT":
            return initialState;
        case "SET_OPEN_AUTH_MODAL":
            return {
                ...state,
                openModalAuth: action.payload,
            };
        case "ADD_NEW_ADDRESS":
            const newUser = _clone(state.user);
            newUser.addresses.push(action.payload);
            return {
                ...state,
                user: newUser,
            };
        default:
            return state;
    }
};

export default user;
