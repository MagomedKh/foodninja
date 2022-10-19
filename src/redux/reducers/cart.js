import {_clone} from '../../components/helpers';

const initialState = {
    items: {},
    bonusProduct: {},
    totalRolls: 0,
    freeAddons: {},
    promocode: {},
    promocodeProducts: {},
    discount: 0,
    subTotalPrice: 0,
    countItems: 0,
    totalPrice: 0
}

const getTotalPrice = products => products.reduce( (total, item) => total + parseInt(item.options._price), 0);
const getProductsRollsCount = products => products.reduce( (total, item) => !isNaN(parseInt(item.options.count_rolls)) ? total + parseInt(item.options.count_rolls) : total, 0);
const getTotalRollsCount = ( cartProducts, state ) => {
    let totalRolls = getProductsRollsCount(cartProducts);
    // console.log(getProductsRollsCount(Object.values(state.promocodeProducts)));
    // totalRolls += Object.values(state.bonusProduct).length ? !isNaN(parseInt(state.bonusProduct.options.count_rolls)) ? parseInt(state.bonusProduct.options.count_rolls) : 0 : 0;
    // totalRolls += Object.values(state.promocodeProducts).length ? getProductsRollsCount(Object.values(state.promocodeProducts)) : 0;
    return totalRolls;
}

const cart = ( state = initialState, action) => {
    switch (action.type) {
        case 'ADD_PROMOCODE': {
            switch (action.payload.type) {
                case 'percent':{
                    const discount = parseInt(state.subTotalPrice/100*action.payload.amount);
                    const allProducts = [].concat.apply([], Object.values(state.items).map( obj => obj.items ));
                    const totalPrice = getTotalPrice(allProducts);
                    return {
                        ...state, 
                        discount: discount,
                        promocode: action.payload,
                        subTotalPrice: totalPrice,
                        totalPrice: totalPrice-discount
                    }
                }           
                case 'fixed_cart':{
                    const discount = action.payload.amount;
                    const allProducts = [].concat.apply([], Object.values(state.items).map( obj => obj.items ));
                    const totalPrice = getTotalPrice(allProducts);
                    return {
                        ...state, 
                        discount: discount,
                        promocode: action.payload,
                        subTotalPrice: totalPrice,
                        totalPrice: totalPrice-discount
                    }
                }               
                case 'fixed_product':{
                    const discount = action.payload.promocodeProducts.options._price-action.payload.productPrice;

                    // Добавляем в корзину если товара нет
                    if( !state.items[action.payload.promocodeProducts.id] ) {
                        const updatedItems = {
                            ...state.items,
                            [action.payload.promocodeProducts.id]: {
                                items: [action.payload.promocodeProducts],
                                totalPrice: getTotalPrice([action.payload.promocodeProducts])
                            }
                        }

                        const allProducts = [].concat.apply([], Object.values(updatedItems).map( obj => obj.items ));
                        const totalPrice = getTotalPrice(allProducts);

                        return {
                            ...state,
                            items: updatedItems,
                            discount: discount,
                            promocode: action.payload,
                            promocodeProducts: action.payload.promocodeProducts,
                            subTotalPrice: totalPrice,
                            totalPrice: totalPrice-discount
                        }
                    } else {
                        // Вариативные товары
                        if( action.payload.promocodeProducts.type === 'variations'  ) {
                            let find = false;
                            state.items[action.payload.promocodeProducts.id].items.forEach( element => {
                                if( element.variant.variant_id === action.payload.promocodeProducts.variant.variant_id )
                                    find = true;
                            });

                            if( !find ) {
                                let buffItems;
                                buffItems = [...state.items[action.payload.promocodeProducts.id].items];
                                buffItems.push(_clone(action.payload.promocodeProducts));
                                let newItems = buffItems;
        
                                const updatedItems = {
                                    ...state.items,
                                    [action.payload.promocodeProducts.id]: {
                                        items: newItems,
                                        totalPrice: getTotalPrice(newItems)
                                    }
                                }

                                const allProducts = [].concat.apply([], Object.values(updatedItems).map( obj => obj.items ));
                                const totalPrice = getTotalPrice(allProducts);
        
                                return {
                                    ...state,
                                    items: updatedItems,
                                    discount: discount,
                                    promocode: action.payload,
                                    promocodeProducts: action.payload.promocodeProducts,
                                    subTotalPrice: totalPrice,
                                    totalPrice: totalPrice-discount,
                                }
                            } else {
                                const allProducts = [].concat.apply([], Object.values(state.items).map( obj => obj.items ));
                                const totalPrice = getTotalPrice(allProducts);
                                return {
                                    ...state,
                                    discount: discount,
                                    promocode: action.payload,
                                    promocodeProducts: action.payload.promocodeProducts,
                                    subTotalPrice: totalPrice,
                                    totalPrice: totalPrice-discount,
                                }
                            }
                        } else {
                            const allProducts = [].concat.apply([], Object.values(state.items).map( obj => obj.items ));
                            const totalPrice = getTotalPrice(allProducts);
                            return {
                                ...state,
                                discount: discount,
                                promocode: action.payload,
                                promocodeProducts: action.payload.promocodeProducts,
                                subTotalPrice: totalPrice,
                                totalPrice: totalPrice-discount,
                            }
                        }
                    }
                }
            }
        }           
        case 'REMOVE_PROMOCODE': {
            const allProducts = [].concat.apply([], Object.values(state.items).map( obj => obj.items ));
            const totalRolls = getTotalRollsCount(allProducts, state);
            return {
                ...state, 
                totalRolls: totalRolls,
                discount: 0,
                promocode: {},
                promocodeProducts: {},
                totalPrice: getTotalPrice(allProducts),
                subTotalPrice: getTotalPrice(allProducts)
            }
        }        
        case 'ADD_BONUS_PRODUCT_TO_CART': {
            return {
                ...state, 
                bonusProduct: action.payload,
            }
        }
        case 'ADD_PRODUCT_TO_CART': {
            let newItems;
            if( action.payload.variant ) {
                if( !state.items[action.payload.id] )
                    newItems = [_clone(action.payload)];
                else {
                    let buffItems;
                    buffItems = [...state.items[action.payload.id].items];
                    buffItems.push(_clone(action.payload));
                    newItems = buffItems;
                }
            } else {
                newItems = !state.items[action.payload.id] 
                ? [action.payload]
                : [...state.items[action.payload.id].items, action.payload]
            }
            
            const updatedItems = {
                ...state.items,
                [action.payload.id]: {
                    items: newItems,
                    totalPrice: getTotalPrice(newItems)
                }
            }
            const allProducts = [].concat.apply([], Object.values(updatedItems).map( obj => obj.items ));
            const totalRolls = getTotalRollsCount(allProducts, state);

            // if( state.promocode && !_checkPromocode(state.promocode, updatedItems, getTotalPrice(allProducts) ) ) {
            //     const bonusProduct = state.bonusProduct 
            //     return {
            //         ...state, 
            //         items: updatedItems,
            //         totalRolls: totalRolls,
            //         bonusProduct: bonusProduct,
            //         countItems: allProducts.length,
            //         subTotalPrice: getTotalPrice(allProducts),
            //         promocode: {},         
            //         promocodeProducts: {},
            //         discount: 0,  
            //         totalPrice: getTotalPrice(allProducts)
            //     }
            // }

            return {
                ...state, 
                items: updatedItems,
                totalRolls: totalRolls,
                countItems: allProducts.length,
                totalPrice: getTotalPrice(allProducts)-state.discount,
                subTotalPrice: getTotalPrice(allProducts)
            }
        }
        case 'DECREASE_PRODUCT_IN_CART': {
            const oldItems = state.items[action.payload.id].items;
            const newItems = oldItems.length > 1 ? state.items[action.payload.id].items.slice(1) : oldItems;
            const updatedItems = {
                ...state.items,
                [action.payload.id]: {
                    items: newItems,
                    totalPrice: getTotalPrice(newItems)
                }
            }
            if( oldItems.length === 1 ) delete updatedItems[action.payload.id]

            const allProducts = [].concat.apply([], Object.values(updatedItems).map( obj => obj.items ));
            const totalRolls = getTotalRollsCount(allProducts, state);
            const cartTotalPrice = getTotalPrice(allProducts);
            const bonusProduct = state.bonusProduct 
            ? cartTotalPrice >= state.bonusProduct.limit 
                ? state.bonusProduct : {}
            : {}


            // if( state.promocode && !_checkPromocode(state.promocode, updatedItems, cartTotalPrice ) ) {
               
            //     return {
            //         ...state, 
            //         items: updatedItems,
            //         totalRolls: totalRolls,
            //         bonusProduct: bonusProduct,
            //         countItems: allProducts.length,
            //         subTotalPrice: cartTotalPrice,
            //         promocode: {},         
            //         promocodeProducts: {},
            //         discount: 0,  
            //         totalPrice: cartTotalPrice
            //     }
            // }
            return {
                ...state, 
                items: updatedItems,
                totalRolls: totalRolls,
                bonusProduct: bonusProduct,
                countItems: allProducts.length,
                subTotalPrice: cartTotalPrice,            
                totalPrice: cartTotalPrice-state.discount
            }
        }        
        case 'REMOVE_PRODUCT_FROM_CART': {
            const updatedItems = state.items;

            if( action.payload.variant ) {              
                const indexVar = Object.values(updatedItems[action.payload.id].items).findIndex( ( element ) => element.variant.variant_id === action.payload.variant.variant_id );
                updatedItems[action.payload.id].items.splice(indexVar, 1);
                if( !updatedItems[action.payload.id].items.length )
                    delete updatedItems[action.payload.id];
            } else
                delete updatedItems[action.payload.id];


            const allProducts = [].concat.apply([], Object.values(updatedItems).map( obj => obj.items ));
            const totalRolls = getTotalRollsCount(allProducts, state);
            const cartTotalPrice = getTotalPrice(allProducts);
            const bonusProduct = state.bonusProduct 
            ? cartTotalPrice >= state.bonusProduct.limit 
                ? state.bonusProduct : {}
            : {}


            // if( state.promocode && !_checkPromocode(state.promocode, updatedItems, cartTotalPrice ) ) {
               
            //     return {
            //         ...state, 
            //         items: updatedItems,
            //         totalRolls: totalRolls,
            //         bonusProduct: bonusProduct,
            //         countItems: allProducts.length,
            //         subTotalPrice: cartTotalPrice,
            //         promocode: {},         
            //         promocodeProducts: {},
            //         discount: 0,  
            //         totalPrice: cartTotalPrice
            //     }
            // }
            return {
                ...state, 
                items: updatedItems,
                bonusProduct: bonusProduct,
                totalRolls: totalRolls,
                countItems: allProducts.length,
                subTotalPrice: cartTotalPrice,            
                totalPrice: cartTotalPrice-state.discount
            }
        }

        case 'CLEAR_CART': {
            return initialState
        }
        default:
            return state
    }
};

export default cart;