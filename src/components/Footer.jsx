import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Container, Grid, Divider } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faMapLocationDot,
    faPhone,
    faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import {
    faInstagram,
    faOdnoklassniki,
    faFacebookF,
} from "@fortawesome/free-brands-svg-icons";
import VKsvg from "../img/Vk-svg";
import AppStoreIcon from "../img/app-store-bage-white.svg";
import GooglePlayIcon from "../img/google-play-bage-white.svg";
import { _getPlatform } from "./helpers";
import "../css/footer.css";
import { getDay } from "date-fns";

export default function Footer() {
    const { pathname } = useLocation();
    const { config, topMenu, bottomMenu } = useSelector(
        ({ config, pages, products }) => {
            return {
                config: config.data,
                topMenu: pages.topMenu,
                bottomMenu: pages.bottomMenu,
            };
        }
    );

    const phones = config.CONFIG_home_phones
        ? config.CONFIG_home_phones.split(";")
        : [];

    const handleClickPage = (item) => {
        window.scrollTo(0, 0);
    };
    if (_getPlatform() !== "site") return <div className="footer-space"></div>;

    // Получаем сегодняшний день недели
    const currentDayOfWeek =
        getDay(new Date()) === 0 ? 6 : getDay(new Date()) - 1;

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
                        <img
                            src={config.CONFIG_company_logo_footer}
                            className="header-logo"
                            alt="Логотип"
                        />
                        <div className="footer--town">
                            {config && config.CONFIG_town ? (
                                <span>{config.CONFIG_town}</span>
                            ) : null}
                        </div>
                        <div className="footer--adress-list">
                            <div className="footer--adress-list-title">
                                Точки продаж:
                            </div>
                            <div className="footer--adress">
                                <div>{config.CONFIG_address}</div>
                                <div>
                                    {phones &&
                                        phones.map(
                                            (phone, index) =>
                                                phone.replace(/\D+/g, "") && (
                                                    <div key={index}>
                                                        <a
                                                            href={
                                                                _getPlatform() ===
                                                                    "android" ||
                                                                _getPlatform() ===
                                                                    "ios"
                                                                    ? `#`
                                                                    : `tel:${phone.replace(
                                                                          /\D+/g,
                                                                          ""
                                                                      )}`
                                                            }
                                                        >
                                                            {phone}
                                                        </a>
                                                    </div>
                                                )
                                        )}
                                </div>
                                {config.CONFIG_format_start_work &&
                                config.CONFIG_format_end_work ? (
                                    <div>
                                        Сегодня с{" "}
                                        {config.CONFIG_format_start_work} до{" "}
                                        {config.CONFIG_format_end_work}
                                    </div>
                                ) : (
                                    <div>Сегодня закрыто</div>
                                )}
                                {config.CONFIG_filials?.length ? (
                                    <Divider
                                        sx={{
                                            my: "6px",
                                            borderColor: "#3c3b3b",
                                            width: "200px",
                                        }}
                                    />
                                ) : null}
                            </div>
                            {config.CONFIG_filials?.map((el, index, arr) => (
                                <div className="footer--adress" key={index}>
                                    <div>{el.address}</div>
                                    <div>
                                        {el.phones?.map((phone, key) => (
                                            <div key={index}>
                                                <a
                                                    href={
                                                        _getPlatform() ===
                                                            "android" ||
                                                        _getPlatform() === "ios"
                                                            ? `#`
                                                            : `tel:${phone.replace(
                                                                  /\D+/g,
                                                                  ""
                                                              )}`
                                                    }
                                                >
                                                    {phone}
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                    {
                                        // Если у филиала свой график работы
                                        el.workingTime ? (
                                            el.workingTime[
                                                currentDayOfWeek
                                            ][0] &&
                                            el.workingTime[
                                                currentDayOfWeek
                                            ][1] ? (
                                                <div>
                                                    Сегодня с{" "}
                                                    {
                                                        el.workingTime[
                                                            currentDayOfWeek
                                                        ][0]
                                                    }{" "}
                                                    до{" "}
                                                    {
                                                        el.workingTime[
                                                            currentDayOfWeek
                                                        ][1]
                                                    }
                                                </div>
                                            ) : (
                                                <div>Сегодня закрыто</div>
                                            )
                                        ) : // Если график работы филиала совпадает с основным
                                        config.CONFIG_format_start_work &&
                                          config.CONFIG_format_end_work ? (
                                            <div>
                                                Сегодня с{" "}
                                                {
                                                    config.CONFIG_format_start_work
                                                }{" "}
                                                до{" "}
                                                {config.CONFIG_format_end_work}
                                            </div>
                                        ) : (
                                            <div>Сегодня закрыто</div>
                                        )
                                    }
                                    {index === arr.length - 1 ? null : (
                                        <Divider
                                            sx={{
                                                my: "6px",
                                                borderColor: "#3c3b3b",
                                                width: "200px",
                                            }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </Grid>
                    <Grid item sm={12} md={4} sx={{ width: 1 }}>
                        {bottomMenu ? (
                            <ul>
                                {bottomMenu.map((item, index) => (
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
                        ) : (
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

                        <div className="contacts--social-links">
                            {config.CONFIG_vk && (
                                <a
                                    href={config.CONFIG_vk}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <div className="footer--icon">
                                        <VKsvg />
                                    </div>
                                </a>
                            )}
                            {config.CONFIG_fb && (
                                <a
                                    href={config.CONFIG_fb}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <div className="footer--icon">
                                        <FontAwesomeIcon icon={faFacebookF} />
                                    </div>
                                </a>
                            )}
                            {config.CONFIG_instagram && (
                                <a
                                    href={config.CONFIG_instagram}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <div className="footer--icon">
                                        <FontAwesomeIcon icon={faInstagram} />
                                    </div>
                                </a>
                            )}
                            {config.CONFIG_ok && (
                                <a
                                    href={config.CONFIG_ok}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <div className="footer--icon">
                                        <FontAwesomeIcon
                                            icon={faOdnoklassniki}
                                        />
                                    </div>
                                </a>
                            )}
                        </div>
                        {config.CONFIG_APPSTORE && (
                            <div className="contacts--appstore mobile-apps">
                                <a
                                    href={config.CONFIG_APPSTORE}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <img src={AppStoreIcon} alt="iOS APP" />
                                </a>
                            </div>
                        )}
                        {config.CONFIG_GPLAY && (
                            <div className="contacts--googleplay mobile-apps">
                                <a
                                    href={config.CONFIG_GPLAY}
                                    target="_blank"
                                    rel="noreferrer"
                                >
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
