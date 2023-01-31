import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
    setProducts,
    setCategories,
    setAddonProducts,
    setRecommendProducts,
    setBonusesProducts,
} from "./redux/actions/products";
import { setConfig, setMainLoading } from "./redux/actions/config";
import { setGateways } from "./redux/actions/gateways";
import { setBanners } from "./redux/actions/banners";
import { removeProductFromCart } from "./redux/actions/cart";
import { logout, login } from "./redux/actions/user";
import {
    setTopMenu,
    setBottomMenu,
    setPages,
    setSales,
} from "./redux/actions/pages";
import {
    ProductModal,
    AuthModal,
    BigLoader,
    Maintenance,
    InstallApp,
    SystemAlerts,
    ChooseTown,
    WeClosed,
} from "./components";
import {
    Cart,
    Home,
    Sales,
    Contacts,
    Account,
    Orders,
    Checkout,
    Page,
    OrderComplete,
    Product,
    CategoryPage,
    SearchPage,
} from "./pages";
import axios from "axios";
import "./fonts/cera/CeraRoundProMedium.woff2";
import "./fonts/cera/CeraRoundProBold.woff2";
import "./App.css";
import { createGlobalStyle } from "styled-components";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
    _getDomain,
    _getPlatform,
    _isCategoryDisabled,
    _isMobile,
} from "./components/helpers";
import { ru } from "date-fns/locale";
import { setDefaultOptions } from "date-fns";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { Container } from "@mui/material";

const MainTheme = createGlobalStyle`
	:root {
		--main-color: ${(props) =>
            props.mainColor.match(/#[a-f0-9]{6}\b/gi)
                ? props.mainColor
                : "#000"};
        
		--sec-color: ${(props) =>
            props.secondColor.match(/#[a-f0-9]{6}\b/gi)
                ? props.secondColor
                : "#000"};
	}`;

function App() {
    const dispatch = useDispatch();
    setDefaultOptions({ locale: ru });

    const { user } = useSelector((state) => state.user);
    const { config, status } = useSelector(({ config }) => {
        return {
            config: config.data,
            status: config.status,
        };
    }, shallowEqual);
    const { categories } = useSelector((state) => state.products, shallowEqual);
    const { items: cartItems } = useSelector(
        (state) => state.cart,
        shallowEqual
    );

    useEffect(() => {
        dispatch(setMainLoading(false));
        axios
            .get("https://" + _getDomain() + "/?rest-api=base_init", {
                mode: "no-cors",
            })
            .then((resp) => {
                dispatch(setCategories(resp.data.categories));
                dispatch(setConfig(resp.data.config));
                dispatch(setTopMenu(resp.data.top_menu));
                dispatch(setBottomMenu(resp.data.bottom_menu));
                dispatch(setPages(resp.data.pages));
                dispatch(setSales(resp.data.sales));
                dispatch(setProducts(resp.data.products));
                dispatch(setAddonProducts(resp.data.addon_products));
                dispatch(setRecommendProducts(resp.data.recommend_products));
                dispatch(setBonusesProducts(resp.data.bonuses_products));
                dispatch(setGateways(resp.data.gateways));
                dispatch(setBanners(resp.data.banners));
            });
    }, [dispatch]);

    // Создаем массив айдишников недоступных на данное время категорий
    useEffect(() => {
        if (categories && status) {
            const disabledCategoriesArr = categories.filter((category) =>
                _isCategoryDisabled(category)
            );
            const disabledCategoriesInx = disabledCategoriesArr.map(
                (category) => category.term_id
            );
            // Итерируемся по товарам в корзине и удаляем те, у которых категория недоступна
            if (disabledCategoriesInx.length) {
                const allProducts = [].concat.apply(
                    [],
                    Object.values(cartItems).map((obj) => obj.items)
                );
                allProducts.forEach((product) => {
                    if (
                        product.categories?.some((id) =>
                            disabledCategoriesInx.includes(id)
                        )
                    ) {
                        dispatch(
                            removeProductFromCart({
                                ...product,
                                disabled: true,
                            })
                        );
                    }
                });
            }
        }
    }, [categories, status]);

    useEffect(() => {
        if (user.token && user.phone)
            axios
                .get(
                    "https://" +
                        _getDomain() +
                        "/?rest-api=checkLogin&token=" +
                        user.token +
                        "&phone=" +
                        user.phone,
                    { mode: "no-cors" }
                )
                .then((resp) => {
                    resp.data.status === "success"
                        ? dispatch(login(resp.data.user))
                        : dispatch(logout(true));
                    dispatch(setMainLoading(true));
                });
        else dispatch(setMainLoading(true));
    }, [dispatch, user.token, user.phone]);

    const mainColor = config
        ? config.CONFIG_main_color !== undefined
            ? config.CONFIG_main_color
            : "#000"
        : "#000";
    const secondColor = config
        ? config.CONFIG_second_color !== undefined
            ? config.CONFIG_second_color
            : "#000"
        : "#000";

    const foodninja = createTheme({
        palette: {
            primary: {
                light: "#757ce8",
                main: mainColor.match(/#[a-f0-9]{6}\b/gi) ? mainColor : "#000",
                dark: secondColor.match(/#[a-f0-9]{6}\b/gi)
                    ? secondColor
                    : "#000",
                contrastText: "#fff",
            },
            secondary: {
                light: "#ff7961",
                main: secondColor.match(/#[a-f0-9]{6}\b/gi)
                    ? secondColor
                    : "#000",
                dark: "#ba000d",
                contrastText: "#000",
            },
            white: {
                main: "#fff",
                contrastText: "#fff",
            },
        },
        typography: {
            fontFamily: `"Cera","sans-serif"`,
            button: {
                textTransform: "none",
                fontSize: 16,
            },
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 20,
                        padding: "6px 20px !important",
                    },
                },
            },
        },
        breakpoints: {
            values: {
                xs: 0,
                sm: 600,
                md: 900,
                lg: 1200,
                xl: 1536,
                mobilexs: 0,
                mobilesm: 375,
                mobilemd: 600,
                mobilelg: 720,
                desctop: 899,
            },
        },
    });

    if (config.CONFIG_main_site_choose_town === "on") {
        return (
            <>
                <Container maxWidth="md">
                    <div className="choose-town-page_logo-wrapper">
                        <img
                            src={config.CONFIG_company_logo_main}
                            className="choose-town-page_logo"
                            alt="Логотип"
                        />
                    </div>
                    <ChooseTown />
                </Container>
            </>
        );
    }

    return (
        <ThemeProvider theme={foodninja}>
            <MainTheme mainColor={mainColor} secondColor={secondColor} />
            {config !== undefined && Object.keys(config).length ? (
                <div>
                    <GoogleReCaptchaProvider
                        reCaptchaKey={config.CONFIG_auth_recaptcha_site_token}
                    >
                        <div>
                            <Routes>
                                <Route exact path="/" element={<Home />} />
                                <Route
                                    path="/product/*"
                                    element={<Product />}
                                />
                                <Route exact path="/cart" element={<Cart />} />
                                <Route
                                    exact
                                    path="/checkout"
                                    element={<Checkout />}
                                />
                                <Route
                                    exact
                                    path="/sales"
                                    element={<Sales />}
                                />
                                <Route
                                    exact
                                    path="/contacts"
                                    element={<Contacts />}
                                />
                                <Route
                                    exact
                                    path="/account"
                                    element={<Account />}
                                />
                                <Route
                                    exact
                                    path="/account/orders"
                                    element={<Orders />}
                                />
                                <Route
                                    exact
                                    path="/order-complete"
                                    element={<OrderComplete />}
                                />
                                {config.CONFIG_searching_disable ? null : (
                                    <Route
                                        exact
                                        path="/search"
                                        element={<SearchPage />}
                                    />
                                )}
                                <Route
                                    exact
                                    path="/category/*"
                                    element={<CategoryPage />}
                                />
                                <Route path="*" element={<Page />} />
                            </Routes>
                            <ProductModal />
                            <AuthModal />
                            <SystemAlerts />
                            {_getPlatform() === "site" && _isMobile() ? (
                                <InstallApp />
                            ) : (
                                ""
                            )}
                            {config.towns !== undefined &&
                            config.towns.length &&
                            _getPlatform() !== "vk" ? (
                                <ChooseTown />
                            ) : (
                                ""
                            )}
                            <WeClosed />
                        </div>
                    </GoogleReCaptchaProvider>
                </div>
            ) : (
                <BigLoader initStatus={true} />
            )}
        </ThemeProvider>
    );
}

export default App;
