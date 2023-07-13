import { createStore, combineReducers } from "redux";
import productsReducer from "./reducers/products";
import configReducer from "./reducers/config";
import configBanners from "./reducers/banners";
import configSystemAlerts from "./reducers/systemAlerts";
import gatewaysReducer from "./reducers/gateways";
import pagesReducer from "./reducers/pages";
import cartReducer from "./reducers/cart";
import orderTimeReducer from "./reducers/orderTime";
import userReducer from "./reducers/user";
import productModalReducer from "./reducers/productModal";
import loaderReducer from "./reducers/loader";
import bonusesProductsModalReducer from "./reducers/bonusesProductsModal";
import search from "./reducers/serach";
import header from "./reducers/header";
import miniCart from "./reducers/miniCart";
import deliveryAddressModal from "./reducers/deliveryAddressModal";
import stories from "./reducers/stories";
import autoDiscounts from "./reducers/autoDiscounts";

const rootReducer = combineReducers({
    products: productsReducer,
    config: configReducer,
    banners: configBanners,
    systemAlerts: configSystemAlerts,
    gateways: gatewaysReducer,
    user: userReducer,
    cart: cartReducer,
    orderTime: orderTimeReducer,
    pages: pagesReducer,
    loader: loaderReducer,
    bonusesProductsModal: bonusesProductsModalReducer,
    productModal: productModalReducer,
    search: search,
    header: header,
    miniCart: miniCart,
    deliveryAddressModal: deliveryAddressModal,
    stories: stories,
    autoDiscounts: autoDiscounts,
});

const saveState = (state) => {
    try {
        const serialisedState = JSON.stringify(state);
        window.localStorage.setItem("foodNinjaStore", serialisedState);
    } catch (err) {}
};

const loadState = () => {
    try {
        const serialisedState = JSON.parse(
            window.localStorage.getItem("foodNinjaStore")
        );

        if (!serialisedState) return undefined;
        serialisedState.config.status = false;

        // Закрываем открытые модалки
        if (serialisedState.productModal?.openProductModal) {
            serialisedState.productModal.openProductModal = false;
            serialisedState.productModal.productModal = false;
        }
        if (serialisedState.miniCart?.miniCartOpen) {
            serialisedState.miniCart.miniCartOpen = false;
        }
        if (serialisedState.bonusesProductsModal?.openBonusesProductsModal) {
            serialisedState.bonusesProductsModal.openBonusesProductsModal = false;
        }
        if (serialisedState.user?.openModalAuth) {
            serialisedState.user.openModalAuth = false;
        }
        return serialisedState;
    } catch (err) {
        return undefined;
    }
};

const oldState = loadState();
const store = createStore(
    rootReducer,
    oldState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

store.subscribe(() => {
    saveState(store.getState());
});

window.store = store;

export default store;
