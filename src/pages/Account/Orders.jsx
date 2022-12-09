import React from "react";
import { Button, Container, Skeleton } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setOpenModalAuth } from "../../redux/actions/user";
import {
    addBonusProductToCart,
    addProductToCart,
    addPromocode,
    clearCart,
} from "../../redux/actions/cart";
import { Header, Footer } from "../../components";
import Grid from "@mui/material/Grid";
import axios from "axios";
import { _getDomain } from "../../components/helpers.js";

export default function Orders() {
    const dispatch = useDispatch();
    const { user, mainLoading, products, bonuses_products } = useSelector(
        ({ user, config, products }) => {
            return {
                products: products.items,
                bonuses_products: products.bonuses_items,
                user: user.user,
                mainLoading: config.status,
            };
        }
    );
    const [pageStatus, setPageStatus] = React.useState("loading");
    const [pages, setPageCountPages] = React.useState(0);
    const [activePage, setActivePage] = React.useState(1);
    const [userOrders, setUserOrders] = React.useState();

    React.useEffect(() => {
        if (mainLoading && pageStatus !== "loaded") {
            axios
                .post("https://" + _getDomain() + "/?rest-api=getUserOrders", {
                    phone: user.phone,
                    token: user.token,
                    page: 1,
                })
                .then((resp) => {
                    if (resp.data.status === "success") {
                        setUserOrders(resp.data.orders);
                        setPageStatus("loaded");
                        setPageCountPages(resp.data.pages);
                    }
                });
        }
    }, [mainLoading]);

    const handleOpenAuthModal = () => {
        dispatch(setOpenModalAuth(true));
    };

    const navigate = useNavigate();
    const handleRepeatOrder = (order) => {
        dispatch(clearCart());
        Object.values(order.products).forEach((item) => {
            if (
                products[item.id] !== undefined &&
                item.price === item.total_price
            )
                dispatch(addProductToCart(products[item.id]));
        });

        if (order.bonusProduct.id !== undefined) {
            Object.values(bonuses_products).forEach((item) => {
                if (item.id === order.bonusProduct.id)
                    dispatch(addBonusProductToCart(item));
            });
        }

        if (order.promocode.code !== undefined)
            dispatch(addPromocode(order.promocode));

        navigate("/checkout", { replace: true });
    };

    const handleToggleOrderInfo = (orderID) => {
        setUserOrders(
            Object.values(userOrders).map((order) => {
                if (order.ID === orderID)
                    return {
                        ...order,
                        fullInfo:
                            order.fullInfo !== undefined
                                ? !order.fullInfo
                                : true,
                    };

                return order;
            })
        );
    };

    const handleChangePage = (e, p) => {
        setPageStatus("loading");
        setActivePage(p);
        axios
            .post("https://" + _getDomain() + "/?rest-api=getUserOrders", {
                phone: user.phone,
                token: user.token,
                page: p,
            })
            .then((resp) => {
                if (resp.data.status === "success") {
                    setUserOrders(resp.data.orders);
                    setPageStatus("loaded");
                    setPageCountPages(resp.data.pages);
                }
            });
    };

    return (
        <>
            <Header />
            <Container>
                <h1>Личный кабинет</h1>

                <div className="account-menu button-group">
                    <Link
                        variant="button"
                        to="/account"
                        className="btn btn--outline-dark"
                    >
                        Настройки
                    </Link>
                    <Link
                        variant="button"
                        to="/account/orders"
                        className="btn btn--action"
                    >
                        Заказы
                    </Link>
                </div>

                {user.token ? (
                    <div>
                        {pageStatus === "loading" ? (
                            <div className="pageInner">
                                <Grid container spacing={4}>
                                    <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                        lg={4}
                                        sx={{ width: 1 }}
                                    >
                                        <Skeleton
                                            className="user-order-skeleton"
                                            variant="rectangular"
                                            animation="wave"
                                            height={287}
                                            width="100%"
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                        lg={4}
                                        sx={{ width: 1 }}
                                    >
                                        <Skeleton
                                            className="user-order-skeleton"
                                            variant="rectangular"
                                            height={287}
                                            width="100%"
                                            animation="wave"
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                        lg={4}
                                        sx={{ width: 1 }}
                                    >
                                        <Skeleton
                                            className="user-order-skeleton"
                                            variant="rectangular"
                                            height={287}
                                            width="100%"
                                            animation="wave"
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                        lg={4}
                                        sx={{ width: 1 }}
                                    >
                                        <Skeleton
                                            className="user-order-skeleton"
                                            variant="rectangular"
                                            height={287}
                                            width="100%"
                                            animation="wave"
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                        lg={4}
                                        sx={{ width: 1 }}
                                    >
                                        <Skeleton
                                            className="user-order-skeleton"
                                            variant="rectangular"
                                            height={287}
                                            width="100%"
                                            animation="wave"
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                        lg={4}
                                        sx={{ width: 1 }}
                                    >
                                        <Skeleton
                                            className="user-order-skeleton"
                                            variant="rectangular"
                                            height={287}
                                            width="100%"
                                            animation="wave"
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                        ) : (
                            <div>
                                {userOrders ? (
                                    <div>
                                        <Grid
                                            container
                                            spacing={4}
                                            className="account--orders"
                                        >
                                            {Object.values(userOrders).map(
                                                (order) => (
                                                    <Grid
                                                        key={order.ID}
                                                        item
                                                        xs={12}
                                                        sm={6}
                                                        lg={4}
                                                        sx={{ width: 1 }}
                                                    >
                                                        <div className="account--user-order">
                                                            <div className="account--user-order--header">
                                                                <div className="account--user-order--time">
                                                                    {order.time}
                                                                </div>
                                                                <div className="account--user-order--status">
                                                                    {
                                                                        order.status
                                                                    }
                                                                </div>
                                                            </div>

                                                            {order.typeDelivery ===
                                                            "delivery" ? (
                                                                <div className="account--user-order--delivery">
                                                                    <div className="account--user-order--delivery-type">
                                                                        Доставка
                                                                    </div>
                                                                    <div className="account--user-order--delivery-address">
                                                                        {
                                                                            order.addressDelivery
                                                                        }
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="account--user-order--delivery">
                                                                    <div className="account--user-order--delivery-type">
                                                                        Самовывоз
                                                                    </div>
                                                                    <div className="account--user-order--delivery-address">
                                                                        {
                                                                            order.selfDelivery
                                                                        }
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {order.products && (
                                                                <div
                                                                    className={`account--user-order--products ${
                                                                        order.fullInfo !==
                                                                            undefined &&
                                                                        order.fullInfo
                                                                            ? "active"
                                                                            : "no-active"
                                                                    }`}
                                                                >
                                                                    {Object.values(
                                                                        order.products
                                                                    ).map(
                                                                        (
                                                                            product,
                                                                            index
                                                                        ) => {
                                                                            if (
                                                                                (order.fullInfo !==
                                                                                    undefined &&
                                                                                    !order.fullInfo &&
                                                                                    index <=
                                                                                        2) ||
                                                                                order.fullInfo ===
                                                                                    undefined ||
                                                                                (order.fullInfo !==
                                                                                    undefined &&
                                                                                    order.fullInfo)
                                                                            ) {
                                                                                return (
                                                                                    <div
                                                                                        className="account--user-order--product"
                                                                                        key={`${order.ID}-${product.id}-${index}`}
                                                                                    >
                                                                                        <div>
                                                                                            <div className="account--user-order--product-name">
                                                                                                {
                                                                                                    product.name
                                                                                                }
                                                                                            </div>
                                                                                            {product
                                                                                                .modificators
                                                                                                .length ? (
                                                                                                <div className="account--user-order--product-modificators">
                                                                                                    +
                                                                                                    {product.modificators.map(
                                                                                                        (
                                                                                                            el,
                                                                                                            inx,
                                                                                                            array
                                                                                                        ) =>
                                                                                                            inx !==
                                                                                                            array.length -
                                                                                                                1 ? (
                                                                                                                <span
                                                                                                                    key={
                                                                                                                        el.id
                                                                                                                    }
                                                                                                                    className="account--user-order--product-modificator"
                                                                                                                >
                                                                                                                    {" "}
                                                                                                                    {
                                                                                                                        el.title
                                                                                                                    }{" "}
                                                                                                                    {
                                                                                                                        el.count
                                                                                                                    }{" "}
                                                                                                                    шт.,
                                                                                                                </span>
                                                                                                            ) : (
                                                                                                                <span
                                                                                                                    key={
                                                                                                                        el.id
                                                                                                                    }
                                                                                                                    className="account--user-order--product-modificator"
                                                                                                                >
                                                                                                                    {" "}
                                                                                                                    {
                                                                                                                        el.title
                                                                                                                    }{" "}
                                                                                                                    {
                                                                                                                        el.count
                                                                                                                    }
                                                                                                                    шт.
                                                                                                                </span>
                                                                                                            )
                                                                                                    )}
                                                                                                </div>
                                                                                            ) : null}
                                                                                        </div>
                                                                                        <div className="account--user-order--product-price">
                                                                                            {product.total_price !==
                                                                                            product.price ? (
                                                                                                <>
                                                                                                    <span className="default-price">
                                                                                                        {
                                                                                                            product.price
                                                                                                        }{" "}
                                                                                                        ₽
                                                                                                    </span>
                                                                                                    <span className="sale-price">
                                                                                                        {
                                                                                                            product.total_price
                                                                                                        }{" "}
                                                                                                        ₽
                                                                                                    </span>
                                                                                                </>
                                                                                            ) : (
                                                                                                `${product.total_price} ₽`
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                );
                                                                            } else {
                                                                                return null;
                                                                            }
                                                                        }
                                                                    )}

                                                                    {order
                                                                        .bonusProduct
                                                                        .id !==
                                                                        undefined && (
                                                                        <div
                                                                            className="account--user-order--product"
                                                                            key={
                                                                                order
                                                                                    .bonusProduct
                                                                                    .id
                                                                            }
                                                                        >
                                                                            <div className="account--user-order--product-name">
                                                                                {
                                                                                    order
                                                                                        .bonusProduct
                                                                                        .name
                                                                                }
                                                                            </div>
                                                                            <div className="account--user-order--product-price main-color">
                                                                                Подарок
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}

                                                            {Object.values(
                                                                order.products
                                                            ).length > 3 && (
                                                                <div
                                                                    className="account--user-order--product-toggle-more"
                                                                    onClick={() =>
                                                                        handleToggleOrderInfo(
                                                                            order.ID
                                                                        )
                                                                    }
                                                                >
                                                                    {order.fullInfo !==
                                                                        undefined &&
                                                                    order.fullInfo
                                                                        ? "Скрыть"
                                                                        : "Подробнее"}
                                                                </div>
                                                            )}

                                                            {order.promocode
                                                                .code !==
                                                                undefined &&
                                                            order.subtotal -
                                                                parseInt(
                                                                    order.total
                                                                ) >
                                                                0 ? (
                                                                <>
                                                                    <div className="account--user-order--subtotal">
                                                                        <b>
                                                                            Сумма
                                                                            заказа:
                                                                        </b>{" "}
                                                                        <b>
                                                                            {
                                                                                order.subtotal
                                                                            }{" "}
                                                                            ₽
                                                                        </b>
                                                                    </div>

                                                                    <div className="account--user-order--promocode">
                                                                        <b>
                                                                            Промокод{" "}
                                                                            <span className="main-color">
                                                                                {
                                                                                    order
                                                                                        .promocode
                                                                                        .code
                                                                                }
                                                                            </span>
                                                                            :
                                                                        </b>
                                                                        <div className="account--user-order--promocode-discount main-color">
                                                                            -{" "}
                                                                            {order.subtotal -
                                                                                parseInt(
                                                                                    order.total
                                                                                )}{" "}
                                                                            ₽
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                ""
                                                            )}
                                                            <div className="account--user-order--total">
                                                                <b>Итого:</b>{" "}
                                                                <b>
                                                                    {
                                                                        order.total
                                                                    }{" "}
                                                                    ₽
                                                                </b>
                                                            </div>

                                                            <Button
                                                                variant="button"
                                                                className="btn btn--dark repeat-order"
                                                                onClick={() =>
                                                                    handleRepeatOrder(
                                                                        order
                                                                    )
                                                                }
                                                            >
                                                                Повторить заказ
                                                            </Button>
                                                        </div>
                                                    </Grid>
                                                )
                                            )}
                                        </Grid>

                                        {pages ? (
                                            <Pagination
                                                defaultPage={activePage}
                                                onChange={handleChangePage}
                                                sx={{ mt: 4 }}
                                                count={pages}
                                            />
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                ) : (
                                    <div className="account--no-rders">
                                        Вы еще не совершали заказов
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="auth">
                        <p>Вы не авторизованы.</p>
                        <p>
                            <Link
                                className="main-color"
                                onClick={handleOpenAuthModal}
                            >
                                Авторизуйтесь
                            </Link>
                            , чтобы войти в личный кабинет.
                        </p>
                    </div>
                )}
            </Container>
            <Footer />
        </>
    );
}
