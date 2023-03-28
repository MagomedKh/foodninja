import * as React from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Container, Divider, Grid } from "@mui/material";
import { _getPlatform } from "../helpers";
import FooterAddressList from "./FooterAddressList";
import FooterMenu from "./FooterMenu";
import FooterSocialLinks from "./FooterSocialLinks";
import "../../css/footer.css";
import clsx from "clsx";

export default function Footer() {
    const { pathname } = useLocation();
    const { config, footerType } = useSelector(({ config }) => {
        return {
            config: config.data,
            footerType: config.data.CONFIG_type_footer,
        };
    });

    if (_getPlatform() !== "site") return <div className="footer-space"></div>;

    return (
        <div className={clsx("footer", footerType === "one" && "white")}>
            <Container className="footer--container">
                {pathname === "/" && (
                    <>
                        <div className="about">
                            {footerType === "one" ? (
                                <Divider
                                    sx={{
                                        my: "6px",
                                        borderColor:
                                            footerType === "one"
                                                ? "rgba(0, 0, 0, 0.12)"
                                                : "#3c3b3b",
                                    }}
                                />
                            ) : null}
                            <h1>{config.siteTitle}</h1>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: config.CONFIG_footer_text,
                                }}
                            ></div>
                        </div>
                        {footerType === "one" ? null : (
                            <hr className="about-divider" />
                        )}
                    </>
                )}
                {footerType === "one" ? (
                    <Divider
                        sx={{
                            mb: "3rem",
                            borderColor:
                                footerType === "one"
                                    ? "rgba(0, 0, 0, 0.12)"
                                    : "#3c3b3b",
                        }}
                    />
                ) : null}

                <Grid container spacing={5}>
                    <Grid item sm={12} md={4} sx={{ width: 1 }}>
                        <img
                            src={
                                footerType === "one"
                                    ? config.CONFIG_company_logo_main
                                    : config.CONFIG_company_logo_footer
                            }
                            className="footer--logo"
                            alt="Логотип"
                        />
                        <FooterAddressList />
                    </Grid>
                    <Grid item sm={12} md={4} sx={{ width: 1 }}>
                        <FooterMenu />
                    </Grid>
                    <Grid
                        item
                        sm={12}
                        md={4}
                        sx={{ width: 1 }}
                        className="right-col"
                    >
                        <h4>
                            <a href={`tel:${config.CONFIG_format_phone}`}>
                                {config.CONFIG_format_phone}
                            </a>
                        </h4>
                        <FooterSocialLinks />
                    </Grid>
                </Grid>

                <div className="footer-copyright">
                    <Grid container spacing={5}>
                        {!config.CONFIG_active_no_whitelabel && (
                            <Grid
                                item
                                sm={12}
                                md={4}
                                sx={{ width: 1 }}
                                className="right-col"
                            >
                                <div className="creators">
                                    Работает на платформе{" "}
                                    <a
                                        href="https://foodninja.pro"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        FoodNinja
                                    </a>
                                </div>
                            </Grid>
                        )}
                    </Grid>
                </div>
            </Container>
        </div>
    );
}
