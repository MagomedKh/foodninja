export const saveLogin = (user) => ({
    type: "SAVE_LOGIN",
    payload: user,
});

export const login = (user) => ({
    type: "LOGIN",
    payload: user,
});

export const logout = () => ({
    type: "LOGOUT",
});

export const setOpenModalAuth = (openModalAuth) => ({
    type: "SET_OPEN_AUTH_MODAL",
    payload: openModalAuth,
});

export const addNewAddress = (address) => ({
    type: "ADD_NEW_ADDRESS",
    payload: address,
});
