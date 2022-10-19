export const setConfig = (config) => ({
    type: 'SET_CONFIG',
    payload: config
});

export const setMainLoading = (status) => ({
    type: 'SET_STATUS',
    payload: status
});

export const setTownModal = (status) => ({
    type: 'SET_TOWN_MODAL',
    payload: status
});