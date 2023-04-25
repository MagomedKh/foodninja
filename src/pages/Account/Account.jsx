import React, { useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { setOpenModalAuth } from "../../redux/actions/user";
import { Box, Container, Tab } from "@mui/material";
import { Header, Footer } from "../../components";
import { _getDomain, _isMobile } from "../../components/helpers.js";
import "../../css/account.css";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Orders from "./Orders";
import UserSettings from "./UserSettings";
import MyAddresses from "./MyAddresses";

export default function Account() {
    const dispatch = useDispatch();

    const { user } = useSelector(({ user }) => {
        return {
            user: user.user,
        };
    }, shallowEqual);

    const [activeTab, setActiveTab] = useState("settings");

    const handleChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleOpenAuthModal = () => {
        dispatch(setOpenModalAuth(true));
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Header />
            <Container sx={{ flexGrow: 1 }}>
                <h1>Личный кабинет</h1>

                {user.token ? (
                    <TabContext value={activeTab}>
                        <TabList
                            onChange={handleChange}
                            className="account--tab-list"
                        >
                            <Tab
                                disableRipple
                                label="Настройки"
                                value="settings"
                            />
                            <Tab disableRipple label="Заказы" value="orders" />
                            <Tab
                                disableRipple
                                label="Мои адреса"
                                value="addresses"
                            />
                        </TabList>

                        <TabPanel
                            value="settings"
                            sx={{
                                boxShadow: "0 0 20px rgb(0 0 0 / 10%)",
                                borderRadius: "0 10px 10px 10px",
                                bgcolor: "#fff",
                            }}
                        >
                            <UserSettings />
                        </TabPanel>
                        <TabPanel
                            value="orders"
                            sx={{
                                boxShadow: "0 0 20px rgb(0 0 0 / 10%)",
                                borderRadius: "10px",
                                bgcolor: "#fff",
                            }}
                        >
                            <Orders />
                        </TabPanel>
                        <TabPanel
                            value="addresses"
                            sx={{
                                boxShadow: "0 0 20px rgb(0 0 0 / 10%)",
                                borderRadius: "10px",
                                bgcolor: "#fff",
                            }}
                        >
                            <MyAddresses />
                        </TabPanel>
                    </TabContext>
                ) : (
                    <div className="auth">
                        <p>Вы не авторизованы.</p>
                        <p>
                            <a
                                className="main-color"
                                onClick={handleOpenAuthModal}
                            >
                                Авторизуйтесь
                            </a>
                            , чтобы войти в личный кабинет.
                        </p>
                    </div>
                )}
            </Container>
            <Footer />
        </Box>
    );
}
