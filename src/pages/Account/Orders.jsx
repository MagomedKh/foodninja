import React, { useState, useEffect } from "react";
import { Grid, Pagination, Skeleton } from "@mui/material";
import { useSelector } from "react-redux";
import { UserOrder } from "../../components";
import axios from "axios";
import { _clone, _getDomain, _getPlatform } from "../../components/helpers.js";

export default function Orders() {
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
    const [pageStatus, setPageStatus] = useState("loading");
    const [pages, setPageCountPages] = useState(0);
    const [activePage, setActivePage] = useState(1);
    const [userOrders, setUserOrders] = useState();
    const [disableRepeatButtons, setDisableRepeatButtons] = useState(false);

    useEffect(() => {
        const request = axios.CancelToken.source();
        if (mainLoading && pageStatus !== "loaded") {
            axios
                .post(
                    "https://" +
                        _getDomain() +
                        "/?rest-api=getUserOrders" +
                        "&platform=" +
                        _getPlatform(),
                    {
                        phone: user.phone,
                        token: user.token,
                        page: 1,
                    },
                    { cancelToken: request.token }
                )
                .then((resp) => {
                    if (resp.data.status === "success") {
                        setUserOrders(resp.data.orders);
                        setPageStatus("loaded");
                        setPageCountPages(resp.data.pages);
                    }
                })
                .catch((err) => {});
        }
        return () => {
            request.cancel();
        };
    }, [mainLoading]);

    const handleChangePage = (e, p) => {
        setPageStatus("loading");
        setActivePage(p);
        axios
            .post(
                "https://" +
                    _getDomain() +
                    "/?rest-api=getUserOrders" +
                    "&platform=" +
                    _getPlatform(),
                {
                    phone: user.phone,
                    token: user.token,
                    page: p,
                }
            )
            .then((resp) => {
                if (resp.data.status === "success") {
                    setUserOrders(resp.data.orders);
                    setPageStatus("loaded");
                    setPageCountPages(resp.data.pages);
                }
            });
    };

    return (
        <div>
            {pageStatus === "loading" ? (
                <div className="pageInner">
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={6} lg={4} sx={{ width: 1 }}>
                            <Skeleton
                                className="user-order-skeleton"
                                variant="rectangular"
                                animation="wave"
                                height={287}
                                width="100%"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} lg={4} sx={{ width: 1 }}>
                            <Skeleton
                                className="user-order-skeleton"
                                variant="rectangular"
                                height={287}
                                width="100%"
                                animation="wave"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} lg={4} sx={{ width: 1 }}>
                            <Skeleton
                                className="user-order-skeleton"
                                variant="rectangular"
                                height={287}
                                width="100%"
                                animation="wave"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} lg={4} sx={{ width: 1 }}>
                            <Skeleton
                                className="user-order-skeleton"
                                variant="rectangular"
                                height={287}
                                width="100%"
                                animation="wave"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} lg={4} sx={{ width: 1 }}>
                            <Skeleton
                                className="user-order-skeleton"
                                variant="rectangular"
                                height={287}
                                width="100%"
                                animation="wave"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} lg={4} sx={{ width: 1 }}>
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
                                {Object.values(userOrders).map((order) => (
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
                                ))}
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
                    page={activePage}
                    onChange={handleChangePage}
                    count={pages}
                    sx={{ mt: 4 }}
                />
            ) : (
                ""
            )}
        </div>
    );
}
