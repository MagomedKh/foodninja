import React from "react";
import { useSelector } from "react-redux";
import { Container } from "@material-ui/core";
import { Grid } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faMapLocationDot,
    faPhone,
    faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import {
    faVk,
    faOdnoklassnikiSquare,
} from "@fortawesome/free-brands-svg-icons";
import { Header, Footer } from "../components";
import "../css/contacts.css";
import { _getPlatform } from "../components/helpers";

export default function Contacts() {
    const { config } = useSelector(({ config }) => {
        return {
            config: config.data,
        };
    });

    const phones = config.CONFIG_home_phones
        ? config.CONFIG_home_phones.split(";")
        : [];

    return (
        <>
            <Header />
            <Container className="contacts-page">
                <h1>Контакты</h1>

                <Grid container spacing={4}>
                    <Grid item sm={12} md={4} sx={{ width: 1 }}>
                        {config.CONFIG_address && (
                            <div className="contacts--block">
                                <h4>Адрес</h4>
                                <div className="contacts--main-address">
                                    <FontAwesomeIcon icon={faMapLocationDot} />{" "}
                                    {config.CONFIG_address}
                                </div>
                            </div>
                        )}
                        <div className="contacts--block">
                            <h4>Контактная информация</h4>
                            {phones &&
                                phones.map(
                                    (phone, index) =>
                                        phone.replace(/\D+/g, "") && (
                                            <div
                                                key={index}
                                                className="contacts--main-phone"
                                            >
                                                <FontAwesomeIcon
                                                    icon={faPhone}
                                                />{" "}
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
                                        )
                                )}
                            {config.CONFIG_email && (
                                <div className="contacts--email">
                                    <FontAwesomeIcon icon={faEnvelope} />{" "}
                                    <a
                                        href={
                                            _getPlatform() === "android" ||
                                            _getPlatform() === "ios"
                                                ? `#`
                                                : `mailto:${config.CONFIG_email}`
                                        }
                                    >
                                        {config.CONFIG_email}
                                    </a>
                                </div>
                            )}
                            {config.CONFIG_vk && (
                                <div className="contacts--vk">
                                    <FontAwesomeIcon icon={faVk} />{" "}
                                    <a href={config.CONFIG_vk}>
                                        {config.CONFIG_vk.replace(
                                            "https://",
                                            ""
                                        )}
                                    </a>
                                </div>
                            )}
                            {config.CONFIG_fb && (
                                <div className="contacts--fb">
                                    <a href={config.CONFIG_fb}>
                                        {config.CONFIG_fb.replace(
                                            "https://",
                                            ""
                                        )}
                                    </a>
                                </div>
                            )}
                            {config.CONFIG_instagram && (
                                <div className="contacts--instagram">
                                    <a href={config.CONFIG_instagram}>
                                        {config.CONFIG_instagram.replace(
                                            "https://",
                                            ""
                                        )}
                                    </a>
                                </div>
                            )}
                            {config.CONFIG_ok && (
                                <div className="contacts--ok">
                                    <FontAwesomeIcon
                                        icon={faOdnoklassnikiSquare}
                                    />{" "}
                                    <a href={config.CONFIG_ok}>
                                        {config.CONFIG_ok.replace(
                                            "https://",
                                            ""
                                        )}
                                    </a>
                                </div>
                            )}
                        </div>
                        <div className="contacts--block">
                            <h4>Время работы</h4>
                            {config && (
                                <div className="contacts--today-work">
                                    Сегодня с {config.CONFIG_format_start_work}{" "}
                                    до {config.CONFIG_format_end_work}
                                    {config.CONFIG_work_status && (
                                        <div
                                            className={`today-work--status ${config.CONFIG_work_status}`}
                                        >
                                            {config.CONFIG_work_status ===
                                            "open"
                                                ? " Сейчас открыто"
                                                : "Сейчас закрыто"}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {config.CONFIG_legalInfo && (
                            <div className="contacts--block">
                                <h4>Юридическая информация</h4>
                                {config.CONFIG_legalInfo}
                            </div>
                        )}
                    </Grid>
                    <Grid item sm={12} md={8} sx={{ width: 1 }}>
                        {config.CONFIG_contact_map_script ? (
                            <div
                                className="contacts--custom-map"
                                dangerouslySetInnerHTML={{
                                    __html: config.CONFIG_contact_map_script,
                                }}
                            ></div>
                        ) : (
                            config.CONFIG_latitude &&
                            config.CONFIG_longtude && (
                                <div className="contacts--2gis-map"></div>
                            )
                        )}
                        {config.CONFIG_contact_delivery_info && (
                            <div
                                className="contacts--delivery-info"
                                dangerouslySetInnerHTML={{
                                    __html: config.CONFIG_contact_delivery_info.replace(
                                        /\n/g,
                                        "<br />"
                                    ),
                                }}
                            ></div>
                        )}
                    </Grid>
                </Grid>
            </Container>
            <Footer />
        </>
    );
}
