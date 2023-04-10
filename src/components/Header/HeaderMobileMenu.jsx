import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { closeMobileMenu, openMobileMenu } from "../../redux/actions/header";
import { setTownModal } from "../../redux/actions/config";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button, Divider, Drawer, IconButton, Skeleton } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { _getPlatform } from "../helpers";
import HeaderTopMenu from "./HeaderTopMenu";
import clsx from "clsx";

const HeaderMobileMenu = ({
    activeTopMenu,
    handleClickTopMenu,
    handleOpenTownModal,
    hadleClickAccount,
    openAuthModalBtnClick,
}) => {
    const dispatch = useDispatch();

    const { mobileMenuOpen } = useSelector((state) => state.header);
    const { config, topMenu, user, mobileMenuType } = useSelector(
        ({ config, pages, user }) => {
            return {
                configStatus: config.status,
                config: config.data,
                topMenu: pages.topMenu,
                user: user.user,
                mobileMenuType: config.data.CONFIG_type_mobile_menu,
            };
        }
    );

    const toggleMobileMenu = () => {
        if (!mobileMenuOpen) {
            dispatch(openMobileMenu());
        } else {
            dispatch(closeMobileMenu());
        }
    };

    return (
        <div className="header-mobile-menu">
            <MenuIcon onClick={toggleMobileMenu} />

            <Drawer
                anchor="left"
                open={mobileMenuOpen}
                onClose={toggleMobileMenu}
                className={clsx(
                    "mobile-menu",
                    mobileMenuType === "one" && "white"
                )}
            >
                <div className="mobile-menu-wrapper">
                    <div className="mobile-menu--header">
                        <IconButton
                            color="inherit"
                            onClick={toggleMobileMenu}
                            className="minicart--close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <div className="header-logo-wrapper">
                            <img
                                src={
                                    mobileMenuType === "one"
                                        ? config.CONFIG_company_logo_main
                                        : config.CONFIG_company_logo_footer
                                }
                                className="header-logo"
                                alt="Логотип"
                            />
                        </div>
                    </div>

                    <Divider
                        sx={{
                            bgcolor:
                                mobileMenuType === "one"
                                    ? "rgba(0, 0, 0, 0.12)"
                                    : "#333",
                            my: "10px",
                        }}
                    />

                    {config.towns &&
                    config.towns.length &&
                    _getPlatform() !== "vk" ? (
                        <>
                            <div
                                className="mobile-menu--choose-town"
                                onClick={
                                    config.towns.length > 1
                                        ? handleOpenTownModal
                                        : null
                                }
                            >
                                <LocationOnIcon />
                                <div>
                                    <b
                                        className="choosenTown"
                                        style={
                                            config.towns.length > 1
                                                ? {
                                                      cursor: "pointer",
                                                  }
                                                : null
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
                                    <br />
                                    {config.towns.length > 1 ? (
                                        <small>Изменить</small>
                                    ) : null}
                                </div>
                            </div>
                            <Divider
                                sx={{
                                    bgcolor:
                                        mobileMenuType === "one"
                                            ? "rgba(0, 0, 0, 0.12)"
                                            : "#333",
                                    my: "10px",
                                }}
                            />
                        </>
                    ) : (
                        ""
                    )}

                    {topMenu && <HeaderTopMenu pages={topMenu} />}

                    {config.CONFIG_auth_type !== "noauth" && (
                        <div className="mobile-menu--user-account-button">
                            {!user.token ? (
                                <Button
                                    onClick={openAuthModalBtnClick}
                                    className="btn--action"
                                    variant="contained"
                                    sx={{ width: 1 }}
                                >
                                    Войти
                                </Button>
                            ) : (
                                <Button
                                    className="btn--action"
                                    onClick={() => {
                                        hadleClickAccount();
                                        toggleMobileMenu();
                                    }}
                                    variant="contained"
                                    sx={{ width: 1 }}
                                >
                                    Личный кабинет
                                </Button>
                            )}
                        </div>
                    )}

                    <Divider
                        sx={{
                            bgcolor:
                                mobileMenuType === "one"
                                    ? "rgba(0, 0, 0, 0.12)"
                                    : "#333",
                            my: "10px",
                        }}
                    />

                    <div className="mobile-menu--contacts">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icn"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            version="1.1"
                            id="Capa_1"
                            x="0px"
                            y="0px"
                            viewBox="0 0 512.006 512.006"
                            xmlSpace="preserve"
                        >
                            <g>
                                <g>
                                    <g>
                                        <path d="M502.05,407.127l-56.761-37.844L394.83,335.65c-9.738-6.479-22.825-4.355-30.014,4.873l-31.223,40.139     c-6.707,8.71-18.772,11.213-28.39,5.888c-21.186-11.785-46.239-22.881-101.517-78.23c-55.278-55.349-66.445-80.331-78.23-101.517     c-5.325-9.618-2.822-21.683,5.888-28.389l40.139-31.223c9.227-7.188,11.352-20.275,4.873-30.014l-32.6-48.905L104.879,9.956     C98.262,0.03,85.016-2.95,74.786,3.185L29.95,30.083C17.833,37.222,8.926,48.75,5.074,62.277     C-7.187,106.98-9.659,205.593,148.381,363.633s256.644,155.56,301.347,143.298c13.527-3.851,25.055-12.758,32.194-24.876     l26.898-44.835C514.956,426.989,511.976,413.744,502.05,407.127z" />
                                        <path d="M291.309,79.447c82.842,0.092,149.977,67.226,150.069,150.069c0,4.875,3.952,8.828,8.828,8.828     c4.875,0,8.828-3.952,8.828-8.828c-0.102-92.589-75.135-167.622-167.724-167.724c-4.875,0-8.828,3.952-8.828,8.828     C282.481,75.494,286.433,79.447,291.309,79.447z" />
                                        <path d="M291.309,132.412c53.603,0.063,97.04,43.501,97.103,97.103c0,4.875,3.952,8.828,8.828,8.828     c4.875,0,8.828-3.952,8.828-8.828c-0.073-63.349-51.409-114.686-114.759-114.759c-4.875,0-8.828,3.952-8.828,8.828     C282.481,128.46,286.433,132.412,291.309,132.412z" />
                                        <path d="M291.309,185.378c24.365,0.029,44.109,19.773,44.138,44.138c0,4.875,3.952,8.828,8.828,8.828     c4.875,0,8.828-3.952,8.828-8.828c-0.039-34.111-27.682-61.754-61.793-61.793c-4.875,0-8.828,3.952-8.828,8.828     C282.481,181.426,286.433,185.378,291.309,185.378z" />
                                    </g>
                                </g>
                            </g>
                        </svg>
                        <div>
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
                                    <Skeleton variant="text" animation="wave" />
                                )}
                            </a>
                        </div>
                    </div>

                    <div className="header-work">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icn"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            x="0px"
                            y="0px"
                            viewBox="0 0 512 512"
                            xmlSpace="preserve"
                        >
                            <g>
                                <g>
                                    <path d="M347.216,301.211l-71.387-53.54V138.609c0-10.966-8.864-19.83-19.83-19.83c-10.966,0-19.83,8.864-19.83,19.83v118.978 c0,6.246,2.935,12.136,7.932,15.864l79.318,59.489c3.569,2.677,7.734,3.966,11.878,3.966c6.048,0,11.997-2.717,15.884-7.952 C357.766,320.208,355.981,307.775,347.216,301.211z" />
                                </g>
                            </g>
                            <g>
                                <g>
                                    <path d="M256,0C114.833,0,0,114.833,0,256s114.833,256,256,256s256-114.833,256-256S397.167,0,256,0z M256,472.341 c-119.275,0-216.341-97.066-216.341-216.341S136.725,39.659,256,39.659c119.295,0,216.341,97.066,216.341,216.341 S375.275,472.341,256,472.341z" />
                                </g>
                            </g>
                            <g></g>
                            <g></g>
                            <g></g>
                            <g></g>
                            <g></g>
                            <g></g>
                            <g></g>
                            <g></g>
                            <g></g>
                            <g></g>
                            <g></g>
                            <g></g>
                            <g></g>
                            <g></g>
                            <g></g>
                        </svg>
                        <div>
                            {config &&
                            config.CONFIG_format_start_work &&
                            config.CONFIG_format_end_work ? (
                                <>
                                    <div className="title">
                                        Сегодня работаем
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
                </div>
            </Drawer>
        </div>
    );
};

export default HeaderMobileMenu;
