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
import { setStories } from "./redux/actions/stories";
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
import { createGlobalStyle, css } from "styled-components";
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
import { Box, Container } from "@mui/material";
import {
    CeraFont,
    ManropeFont,
    NunitoFont,
    FiraSansFont,
    PTSansFont,
    RubikFont,
} from "./fonts/index";

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
	}
    ${(props) => {
        switch (props.font) {
            case "cera":
                return CeraFont;
            case "manrope":
                return ManropeFont;
            case "nunito":
                return NunitoFont;
            case "firasans":
                return FiraSansFont;
            case "ptsans":
                return PTSansFont;
            case "rubik":
                return RubikFont;
            default:
                return CeraFont;
        }
    }}
    `;

function App() {
    const dispatch = useDispatch();
    setDefaultOptions({ locale: ru });

    const { user } = useSelector((state) => state.user);
    const { config, status, siteBackgroundColor } = useSelector(
        ({ config }) => {
            return {
                config: config.data,
                status: config.status,
                siteBackgroundColor: config.data.CONFIG_background_color,
            };
        },
        shallowEqual
    );
    const { categories, items: products } = useSelector(
        (state) => state.products,
        shallowEqual
    );
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
                dispatch(setStories(resp.data.stories));
            });
    }, [dispatch]);

    // Создаем массив айдишников недоступных на данное время категорий
    useEffect(() => {
        if (categories && status && products) {
            const disabledCategoriesArr = categories.filter(
                (category) => _isCategoryDisabled(category).disabled
            );
            const disabledCategoriesInx = disabledCategoriesArr.map(
                (category) => category.term_id
            );

            const allCartProducts = [].concat.apply(
                [],
                Object.values(cartItems).map((obj) => obj.items)
            );
            // Удаляем товары с недоступными категориями, товары с измененной ценой и удалённые товары
            allCartProducts.forEach((product) => {
                if (product.type === "simple") {
                    let productPrice = parseInt(product.options._price);
                    if (product.modificatorsAmount) {
                        productPrice -= parseInt(product.modificatorsAmount);
                    }
                    if (
                        product.categories?.some((id) =>
                            disabledCategoriesInx.includes(id)
                        ) ||
                        !products[product.id] ||
                        productPrice !=
                            parseInt(products[product.id].options._price)
                    ) {
                        dispatch(
                            removeProductFromCart({
                                ...product,
                                disabled: true,
                            })
                        );
                    }
                } else if (product.type === "variations") {
                    if (
                        product.categories?.some((id) =>
                            disabledCategoriesInx.includes(id)
                        ) ||
                        !products[product.id] ||
                        !products[product.id]?.variants[
                            product.variant.variant_id
                        ] ||
                        product.variant.price !=
                            products[product.id].variants[
                                product.variant.variant_id
                            ].price
                    ) {
                        dispatch(
                            removeProductFromCart({
                                ...product,
                                disabled: true,
                            })
                        );
                    }
                }
            });
        }
    }, [categories, products, status]);

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
    }, [dispatch]);

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
            fontFamily: "inherit",
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
            <MainTheme
                mainColor={mainColor}
                secondColor={secondColor}
                font={config.CONFIG_type_font}
            />
            {config !== undefined && Object.keys(config).length ? (
                <div>
                    <GoogleReCaptchaProvider
                        reCaptchaKey={window.recaptchaToken}
                    >
                        <Box
                            sx={
                                siteBackgroundColor &&
                                siteBackgroundColor !== "default"
                                    ? { bgcolor: siteBackgroundColor }
                                    : {}
                            }
                        >
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
                        </Box>
                    </GoogleReCaptchaProvider>
                </div>
            ) : (
                <BigLoader initStatus={true} />
            )}
        </ThemeProvider>
    );
}

export default App;
