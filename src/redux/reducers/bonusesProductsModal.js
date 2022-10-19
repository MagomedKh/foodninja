const initialState = {
  openBonusesProductsModal: false
}

const bonusesProductsModal = ( state = initialState, action) => {
 
  switch (action.type) {
      case 'SET_OPEN_BONUSES_MODAL':
          return {
              ...state, 
              openBonusesProductsModal: action.payload
          }
      default:
          return state
  }
};

export default bonusesProductsModal;