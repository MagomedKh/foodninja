import * as React from "react";
import "../css/footer.css";
import { useDispatch, useSelector } from "react-redux";
import Container from "@mui/material/Container";
import { setCurrentPage } from "../redux/actions/pages";
import Grid from "@mui/material/Grid";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faVk,
    faOdnoklassnikiSquare,
} from "@fortawesome/free-brands-svg-icons";
import AppStoreIcon from "../img/app-store-bage-white.svg";
import GooglePlayIcon from "../img/google-play-bage-white.svg";
import { _getPlatform } from "./helpers";

export default function Footer() {
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const { config, topMenu, currentPage } = useSelector(
        ({ config, pages, products }) => {
            return {
                config: config.data,
                topMenu: pages.topMenu,
                currentPage: pages.currentPage,
            };
        }
    );

    const handleClickPage = (item) => {
        dispatch(setCurrentPage(item.url));
        window.scrollTo(0, 0);
    };
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
                        <hr />
                    </div>
                )}

                <Grid container spacing={5}>
                    <Grid item sm={12} md={4} sx={{ width: 1 }}>
                        <img
                            src={config.CONFIG_company_logo_footer}
                            className="header-logo"
                            alt="Логотип"
                        />
                    </Grid>
                    <Grid item sm={12} md={4} sx={{ width: 1 }}>
                        <h4>Страницы</h4>
                        {topMenu && (
                            <ul>
                                {topMenu.map((item, index) => (
                                    <li key={item.id}>
                                        {item.target === "_blank" ? (
                                            <a
                                                href={item.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                title={item.title}
                                            >
                                                {item.title}
                                            </a>
                                        ) : (
                                            <Link
                                                onClick={() =>
                                                    handleClickPage(item)
                                                }
                                                to={item.url}
                                            >
                                                {item.title}
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Grid>
                    {/* <Grid item sm={12} md={4} sx={{ width: 1 }}>
						<h4>Категории товаров</h4>

						{ categories && (
							<ul className="categories-menu">
								{categories.map( (item, index) => <li key={item.term_id}>
									<AnimateLink
									    activeClass="active"
										to={`category-${item.term_id}`}
										spy={true}
										smooth={true}
										offset={-70}
										duration={500}
									>{item.name}</AnimateLink>
								</li> )} 
							</ul> 
							)
						}
					</Grid>					 */}
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

                        {config.CONFIG_vk && (
                            <div className="contacts--vk footer--icon">
                                <FontAwesomeIcon icon={faVk} />{" "}
                                <a href={config.CONFIG_vk}>
                                    {config.CONFIG_vk.replace("https://", "")}
                                </a>
                            </div>
                        )}
                        {config.CONFIG_fb && (
                            <div className="contacts--fb footer--icon">
                                <a href={config.CONFIG_fb}>
                                    {config.CONFIG_fb.replace("https://", "")}
                                </a>
                            </div>
                        )}
                        {config.CONFIG_instagram && (
                            <div className="contacts--instagram footer--icon">
                                <a href={config.CONFIG_instagram}>
                                    {config.CONFIG_instagram.replace(
                                        "https://",
                                        ""
                                    )}
                                </a>
                            </div>
                        )}
                        {config.CONFIG_ok && (
                            <div className="contacts--ok footer--icon">
                                <FontAwesomeIcon icon={faOdnoklassnikiSquare} />{" "}
                                <a href={config.CONFIG_ok}>
                                    {config.CONFIG_ok.replace("https://", "")}
                                </a>
                            </div>
                        )}
                        {config.CONFIG_APPSTORE && (
                            <div className="contacts--appstore mobile-apps">
                                <a href={config.CONFIG_APPSTORE}>
                                    <img src={AppStoreIcon} alt="iOS APP" />
                                </a>
                            </div>
                        )}
                        {config.CONFIG_GPLAY && (
                            <div className="contacts--googleplay mobile-apps">
                                <a href={config.CONFIG_GPLAY}>
                                    <img
                                        src={GooglePlayIcon}
                                        alt="Android APP"
                                    />
                                </a>
                            </div>
                        )}
                    </Grid>
                </Grid>

                <div className="footer-copyright">
                    <Grid container spacing={5}>
                        <Grid
                            item
                            sm={12}
                            md={8}
                            sx={{ width: 1 }}
                            className={
                                config.CONFIG_active_no_whitelabel &&
                                `right-col`
                            }
                        >
                            {new Date().getFullYear()} © Все права защищены.
                            Служба доставки еды{" "}
                            <a href="/" title={config.siteTitle}>
                                {config.CONFIG_company_name}
                            </a>
                        </Grid>
                        {!config.CONFIG_active_no_whitelabel && (
                            <Grid
                                item
                                sm={12}
                                md={4}
                                sx={{ width: 1 }}
                                className="right-col"
                            >
                                <div className="creators">
                                    Платформа FoodNinja от{" "}
                                    <a
                                        href="https://iqmd.ru"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        IQ Media
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
