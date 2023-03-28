import React, { useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { setOpenModalAuth } from "../../redux/actions/user";
import { Container, Tab } from "@mui/material";
import { Header, Footer } from "../../components";
import { _getDomain, _isMobile } from "../../components/helpers.js";
import "../../css/account.css";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Orders from "./Orders";
import UserSettings from "./UserSettings";

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
        <>
            <Header />
            <Container>
                <h1>Личный кабинет</h1>

                {user.token ? (
                    <TabContext value={activeTab}>
                        <TabList
                            onChange={handleChange}
                            sx={{
                                overflow: "visible",
                                "& .MuiTab-root": {
                                    overflow: "visible !important",
                                },
                                "& .MuiTabs-scroller": {
                                    overflow: "visible !important",
                                },
                                "& .MuiTabs-indicator": {
                                    display: "none",
                                },
                                "& .Mui-selected": {
                                    borderRadius: "8px 8px 0 0",
                                    backgroundColor: "#fff",
                                    boxShadow: "0 0 20px rgb(0 0 0 / 10%)",
                                    clipPath: "inset(-50px -56px 0px -73px)",
                                },
                            }}
                        >
                            <Tab
                                disableRipple
                                label="Настройки"
                                value="settings"
                            />
                            <Tab disableRipple label="Заказы" value="orders" />
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
        </>
    );
}
