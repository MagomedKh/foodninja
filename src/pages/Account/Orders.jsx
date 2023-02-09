import React, { useState } from "react";
import { Button, Container, Skeleton } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setOpenModalAuth } from "../../redux/actions/user";

import { Header, Footer, UserOrder } from "../../components";
import Grid from "@mui/material/Grid";
import axios from "axios";
import { _clone, _getDomain } from "../../components/helpers.js";

export default function Orders() {
    const dispatch = useDispatch();
    const { user, mainLoading, products, bonuses_products } = useSelector(
        ({ user, config, products, cart }) => {
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
    const [disableRepeatButtons, setDisableRepeatButtons] = useState(false);

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
                                                        <UserOrder
                                                            order={order}
                                                            setDisableRepeatButtons={
                                                                setDisableRepeatButtons
                                                            }
                                                            disableRepeatButtons={
                                                                disableRepeatButtons
                                                            }
                                                        />
                                                    </Grid>
                                                )
                                            )}
                                        </Grid>
                                    </div>
                                ) : (
                                    <div className="account--no-rders">
                                        Вы еще не совершали заказов
                                    </div>
                                )}
                            </div>
                        )}
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
