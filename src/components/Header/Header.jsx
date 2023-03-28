import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { setTownModal } from "../../redux/actions/config";
import { setOpenModalAuth } from "../../redux/actions/user";
import { closeMobileMenu, openMobileMenu } from "../../redux/actions/header";
import { _isMobile, _getPlatform } from "../helpers.js";
import {
    AppBar,
    Button,
    Container,
    Divider,
    Drawer,
    IconButton,
    Step,
    Stepper,
    StepLabel,
    Skeleton,
    Toolbar,
} from "@mui/material";
import "../../css/header.css";
import HeaderMobileMenu from "./HeaderMobileMenu";
import { ReactComponent as HeaderPhoneIcon } from "../../img/header-phone.svg";
import { ReactComponent as HeaderClockIcon } from "../../img/header-clock.svg";
import HeaderTopMenu from "./HeaderTopMenu";
import clsx from "clsx";

function Header() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    useEffect(() => dispatch(closeMobileMenu()), [dispatch]);

    const { config, topMenu, user, headerType } = useSelector(
        ({ config, pages, user }) => {
            return {
                configStatus: config.status,
                config: config.data,
                topMenu: pages.topMenu,
                user: user.user,
                headerType: config.data.CONFIG_type_header,
            };
        }
    );
    const { mobileMenuOpen } = useSelector((state) => state.header);

    const hadleClickAccount = useCallback(() => {
        if (mobileMenuOpen) {
            dispatch(closeMobileMenu());
        }
        navigate("/account", { replace: true });
    }, [navigate, dispatch, mobileMenuOpen]);

    const openAuthModalBtnClick = () => {
        dispatch(setOpenModalAuth(true));
    };

    const handleOpenTownModal = () => {
        dispatch(setTownModal(true));
    };

    const stepperPage = ["/cart", "/checkout", "order-complete"];
    const steps = ["Корзина", "Оформление заказа", "Заказ принят"];

    return (
        <div>
            <AppBar position="static" className="header-bar">
                <Container maxWidth="lg">
                    <Toolbar
                        className={clsx(
                            "header-wrapper",
                            headerType === "one" && "one-type"
                        )}
                    >
                        {headerType === "one" &&
                        !stepperPage.includes(pathname) ? (
                            <div></div>
                        ) : (
                            <div className="header-logo-wrapper">
                                <Link to="/" className="header-logo-link">
                                    <img
                                        src={config.CONFIG_company_logo_main}
                                        className="header-logo"
                                        alt="Логотип"
                                    />
                                </Link>
                            </div>
                        )}

                        {_isMobile() && (
                            <HeaderMobileMenu
                                handleOpenTownModal={handleOpenTownModal}
                                hadleClickAccount={hadleClickAccount}
                                openAuthModalBtnClick={openAuthModalBtnClick}
                            />
                        )}

                        {!stepperPage.includes(pathname) ? (
                            <div className="standart-header">
                                <div className="header-phone">
                                    <HeaderPhoneIcon className="icn" />
                                    <div className="header-phone--content">
                                        {config.towns &&
                                        config.towns.length &&
                                        config.towns.length > 1 &&
                                        _getPlatform() !== "vk" ? (
                                            <div className="title">
                                                Ваш город{" "}
                                                <b
                                                    className="choosenTown"
                                                    style={{
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={
                                                        handleOpenTownModal
                                                    }
                                                >
                                                    {config ? (
                                                        config.CONFIG_town
                                                    ) : (
                                                        <Skeleton
                                                            variant="text"
                                                            animation="wave"
                                                        />
                                                    )}
                                                </b>
                                            </div>
                                        ) : (
                                            <div className="title">
                                                Доставка еды{" "}
                                                <b className="choosenTown">
                                                    {config ? (
                                                        config.CONFIG_town
                                                    ) : (
                                                        <Skeleton
                                                            variant="text"
                                                            animation="wave"
                                                        />
                                                    )}
                                                </b>
                                            </div>
                                        )}
                                        <a
                                            className="info"
                                            href={`tel:${config.CONFIG_format_phone.replace(
                                                /[^0-9]/g,
                                                ""
                                            )}`}
                                        >
                                            {config ? (
                                                config.CONFIG_format_phone
                                            ) : (
                                                <Skeleton
                                                    variant="text"
                                                    animation="wave"
                                                />
                                            )}
                                        </a>
                                    </div>
                                </div>

                                {headerType !== "one" ? (
                                    <div className="header-work">
                                        <HeaderClockIcon className="icn" />
                                        <div className="info-wrapper">
                                            {config &&
                                            config.CONFIG_format_start_work &&
                                            config.CONFIG_format_end_work ? (
                                                <>
                                                    <div className="title">
                                                        Мы работаем
                                                    </div>
                                                    <div className="info">
                                                        {`с ${config.CONFIG_format_start_work} до ${config.CONFIG_format_end_work}`}
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="info">
                                                    Сегодня мы не работаем
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : null}

                                {headerType === "one" ? (
                                    <div className="header-logo-wrapper">
                                        <Link
                                            to="/"
                                            className="header-logo-link"
                                        >
                                            <img
                                                src={
                                                    config.CONFIG_company_logo_main
                                                }
                                                className="header-logo"
                                                alt="Логотип"
                                            />
                                        </Link>
                                    </div>
                                ) : null}

                                {!_isMobile() &&
                                    config.CONFIG_auth_type !== "noauth" && (
                                        <div className="header--right-col">
                                            <div className="header-login">
                                                {!user.token ? (
                                                    <Button
                                                        onClick={
                                                            openAuthModalBtnClick
                                                        }
                                                        className="btn--action"
                                                        variant="contained"
                                                    >
                                                        Войти
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        className="btn--action"
                                                        onClick={
                                                            hadleClickAccount
                                                        }
                                                        variant="contained"
                                                    >
                                                        Личный кабинет
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                            </div>
                        ) : (
                            !_isMobile() && (
                                <div className="stepper-header">
                                    <Stepper
                                        activeStep={stepperPage.indexOf(
                                            pathname
                                        )}
                                        alternativeLabel
                                    >
                                        {steps.map((label) => (
                                            <Step key={label}>
                                                <StepLabel className="step-label">
                                                    {label}
                                                </StepLabel>
                                            </Step>
                                        ))}
                                    </Stepper>
                                </div>
                            )
                        )}
                    </Toolbar>
                </Container>
            </AppBar>

            {!stepperPage.includes(pathname) && !_isMobile() ? (
                <div className="top-menu">
                    <Container>
                        {topMenu ? (
                            <HeaderTopMenu pages={topMenu} />
                        ) : (
                            <Skeleton variant="text" animation="wave" />
                        )}
                    </Container>
                </div>
            ) : (
                ""
            )}
        </div>
    );
}

export default Header;
