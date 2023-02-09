import * as React from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Container, Grid } from "@mui/material";
import { _getPlatform } from "../helpers";
import FooterAddressList from "./FooterAddressList";
import FooterMenu from "./FooterMenu";
import FooterSocialLinks from "./FooterSocialLinks";
import "../../css/footer.css";

export default function Footer() {
    const { pathname } = useLocation();
    const { config } = useSelector(({ config }) => {
        return {
            config: config.data,
        };
    });

    if (_getPlatform() !== "site") return <div className="footer-space"></div>;

    return (
        <div className="footer">
            <Container className="footer--container">
                {pathname === "/" && (
                    <div className="about">
                        <h1>{config.siteTitle}</h1>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: config.CONFIG_footer_text,
                            }}
                        ></div>
                        <hr className="about-divider" />
                    </div>
                )}

                <Grid container spacing={5}>
                    <Grid item sm={12} md={4} sx={{ width: 1 }}>
                        {config.CONFIG_type_footer !== "one" &&
                            config.CONFIG_type_footer !== "two" && (
                                <>
                                    <img
                                        src={config.CONFIG_company_logo_footer}
                                        className="footer--logo"
                                        alt="Логотип"
                                    />
                                    <FooterAddressList />
                                </>
                            )}

                        {(config.CONFIG_type_footer === "one" ||
                            config.CONFIG_type_footer === "two") && (
                            <FooterMenu />
                        )}
                    </Grid>
                    <Grid item sm={12} md={4} sx={{ width: 1 }}>
                        {config.CONFIG_type_footer !== "one" &&
                            config.CONFIG_type_footer !== "two" && (
                                <FooterMenu />
                            )}

                        {config.CONFIG_type_footer === "one" && (
                            <FooterAddressList />
                        )}

                        {config.CONFIG_type_footer === "two" && (
                            <>
                                <img
                                    src={config.CONFIG_company_logo_footer}
                                    className="footer--logo"
                                    alt="Логотип"
                                />
                                <FooterSocialLinks />
                            </>
                        )}
                    </Grid>
                    <Grid
                        item
                        sm={12}
                        md={4}
                        sx={{ width: 1 }}
                        className="right-col"
                    >
                        {config.CONFIG_type_footer !== "one" &&
                            config.CONFIG_type_footer !== "two" && (
                                <>
                                    <h4>
                                        <a
                                            href={`tel:${config.CONFIG_format_phone}`}
                                        >
                                            {config.CONFIG_format_phone}
                                        </a>
                                    </h4>
                                    <FooterSocialLinks />
                                </>
                            )}

                        {config.CONFIG_type_footer === "one" && (
                            <>
                                <img
                                    src={config.CONFIG_company_logo_footer}
                                    className="footer--logo"
                                    alt="Логотип"
                                />
                                <h4>
                                    <a
                                        href={`tel:${config.CONFIG_format_phone}`}
                                    >
                                        {config.CONFIG_format_phone}
                                    </a>
                                </h4>
                                <FooterSocialLinks />
                            </>
                        )}

                        {config.CONFIG_type_footer === "two" && (
                            <>
                                <h4>
                                    <a
                                        href={`tel:${config.CONFIG_format_phone}`}
                                    >
                                        {config.CONFIG_format_phone}
                                    </a>
                                </h4>
                                <FooterAddressList />
                            </>
                        )}
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
