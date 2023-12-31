import React, { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Container } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react/swiper-react";
import { Autoplay, Navigation, Pagination } from "swiper";
import useActiveSale from "../hooks/useActiveSale";
import { SaleModal } from "./";
import { _isMobile } from "./helpers.js";
import clsx from "clsx";
import "swiper/swiper.min.css";
import "swiper/modules/pagination/pagination.min.css";
import "swiper/modules/navigation/navigation.min.css";
import "../css/banners.css";

export default function Footer() {
    const { sales } = useSelector(({ pages }) => {
        return {
            sales: pages.sales,
        };
    });

    const { banners, bannersMobile, bannerType } = useSelector(
        ({ banners, config }) => {
            return {
                banners: banners.banners,
                bannersMobile: banners.bannersMobile,
                bannerType: config.data.CONFIG_type_slider,
            };
        }
    );

    const [swiper, setSwiper] = useState();

    const {
        activeSale,
        saleOpenModal,
        handleCloseSaleModal,
        handleSetActiveSale,
    } = useActiveSale();

    const handleBannerClick = useCallback((link) => {
        const pathnameArray = link.split("/").filter((element) => element);
        if (
            pathnameArray.includes("sales") &&
            pathnameArray.findIndex((el) => el === "sales") <
                pathnameArray.length - 1
        ) {
            const sale = sales.find(
                (sale) =>
                    sale.saleStrID === pathnameArray[pathnameArray.length - 1]
            );
            if (sale) {
                handleSetActiveSale(sale);
            }
        } else if (pathnameArray.includes(window.location.hostname)) {
            window.location.href = link;
        } else {
            window.open(link, "_blank");
        }
    }, []);

    if (!banners) {
        return null;
    }
    let swiperProps = {
        pagination: true,
        slidesPerView: 1,
        modules: [Autoplay, Pagination],
    };
    if (_isMobile()) {
        if (bannerType === "fullwidth") {
            swiperProps.spaceBetween = 15;
        } else {
            swiperProps.spaceBetween = 32;
        }
        if (bannersMobile.autoplay) {
            swiperProps.autoplay = {
                delay: bannersMobile.autoplay,
            };
        }
    } else {
        swiperProps.modules.push(Navigation);
        swiperProps.navigation = true;
        if (banners.autoplay) {
            swiperProps.autoplay = {
                delay: banners.autoplay,
            };
        }
        if (bannerType === "fullwidth") {
            swiperProps.spaceBetween = 32;
        }
    }

    if (!banners) {
        return null;
    }

    return (
        <>
            {!_isMobile() && banners.banners && banners.banners.length ? (
                <div className="banners-wrapper">
                    <Container>
                        <Swiper
                            {...swiperProps}
                            className={clsx(
                                "banners-swiper",
                                bannerType === "fullwidth" && "fullwidth"
                            )}
                            onSwiper={(swiper) => setSwiper(swiper)}
                        >
                            {banners.banners.map((banner, key) => (
                                <SwiperSlide key={key} className="banner-slide">
                                    {({ isPrev, isNext }) => {
                                        return (
                                            <img
                                                src={banner.img}
                                                alt={banner.alt}
                                                style={{
                                                    cursor: banner.link
                                                        ? "pointer"
                                                        : "auto",
                                                }}
                                                onClick={() => {
                                                    if (isNext) {
                                                        swiper.slideNext();
                                                    } else if (isPrev) {
                                                        swiper.slidePrev();
                                                    } else if (banner.link) {
                                                        handleBannerClick(
                                                            banner.link
                                                        );
                                                    }
                                                }}
                                            />
                                        );
                                    }}
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </Container>
                </div>
            ) : _isMobile() &&
              bannersMobile.banners &&
              bannersMobile.banners.length ? (
                <div className="mobile-banners-wrapper">
                    <Container>
                        <Swiper
                            {...swiperProps}
                            className={clsx(
                                "bannersMobile-swiper",
                                bannerType === "fullwidth" && "fullwidth"
                            )}
                        >
                            {bannersMobile.banners.map((banner, key) => (
                                <SwiperSlide key={key} className="banner-slide">
                                    {banner.link ? (
                                        <img
                                            src={banner.img}
                                            alt={banner.alt}
                                            style={{ cursor: "pointer" }}
                                            onClick={() =>
                                                handleBannerClick(banner.link)
                                            }
                                        />
                                    ) : (
                                        <img
                                            src={banner.img}
                                            alt={banner.alt}
                                        />
                                    )}
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </Container>
                </div>
            ) : (
                ""
            )}
            <SaleModal
                saleOpenModal={saleOpenModal}
                activeSale={activeSale}
                handleCloseSaleModal={handleCloseSaleModal}
            />
        </>
    );
}
