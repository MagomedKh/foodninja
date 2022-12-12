const initialState = {
    choosenModificators: [],
    emptyModificatorCategories: [],
    modificatorsAmount: 0,
    modificatorsCondition: true,
};

const modificators = (state = initialState, action) => {
    switch (action.type) {
        case "ADD_PRODUCT_MODIFICATOR": {
            const existModificatorInx = state.choosenModificators.findIndex(
                (el) => el.id === action.payload.id
            );
            const updatedModificators = [...state.choosenModificators];
            if (existModificatorInx >= 0) {
                updatedModificators[existModificatorInx].count++;
            } else {
                updatedModificators.push(action.payload);
            }
            const updatedModificatorsAmount =
                state.modificatorsAmount + action.payload.options._price;
            return {
                ...state,
                choosenModificators: updatedModificators,
                modificatorsAmount: updatedModificatorsAmount,
            };
        }
        case "DECREASE_PRODUCT_MODIFICATOR": {
            const existModificatorInx = state.choosenModificators.findIndex(
                (el) => el.id === action.payload.id
            );
            const updatedModificators = [...state.choosenModificators];
            if (existModificatorInx >= 0) {
                updatedModificators[existModificatorInx].count--;
                if (updatedModificators[existModificatorInx].count <= 0) {
                    updatedModificators.splice(existModificatorInx, 1);
                }
            }
            const updatedModificatorsAmount =
                state.modificatorsAmount - action.payload.options._price;
            return {
                ...state,
                choosenModificators: updatedModificators,
                modificatorsAmount: updatedModificatorsAmount,
            };
        }
        case "ADD_EMPTY_REQUIRED_CATEGORY": {
            const newEmptyModificatorCategories = state
                .emptyModificatorCategories?.length
                ? [...state.emptyModificatorCategories]
                : [];
            if (!newEmptyModificatorCategories.includes(action.payload)) {
                newEmptyModificatorCategories.push(action.payload);
            }
            return {
                ...state,
                emptyModificatorCategories: newEmptyModificatorCategories,
                modificatorsCondition: !newEmptyModificatorCategories.length,
            };
        }
        case "DELETE_EMPTY_REQUIRED_CATEGORY": {
            const newEmptyModificatorCategories = state
                .emptyModificatorCategories?.length
                ? [...state.emptyModificatorCategories]
                : [];
            const requiredModificatorInx =
                newEmptyModificatorCategories.findIndex(
                    (el) => el === action.payload
                );
            newEmptyModificatorCategories.splice(requiredModificatorInx, 1);

            return {
                ...state,
                emptyModificatorCategories: newEmptyModificatorCategories,
                modificatorsCondition: !newEmptyModificatorCategories.length,
            };
        }
        case "CLEAR_MODIFICATORS": {
            return {
                ...state,
                choosenModificators: [],
                emptyModificatorCategories: [],
                modificatorsAmount: 0,
                modificatorsCondition: true,
            };
        }

        default:
            return state;
    }
};

export default modificators;
