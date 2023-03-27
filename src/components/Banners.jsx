import React, { useState, useCallback } from "react";
import "../css/banners.css";
import { useSelector } from "react-redux";
import { Container } from "@mui/material";
import { _isMobile } from "./helpers.js";
import { Swiper, SwiperSlide } from "swiper/react/swiper-react";
import { Autoplay, Navigation, Pagination } from "swiper";
import "swiper/swiper.min.css";
import "swiper/modules/navigation/navigation.min.css";
import "swiper/modules/pagination/pagination.min.css";
import { SaleModal } from "./";

export default function Footer() {
    const { sales } = useSelector(({ pages }) => {
        return {
            sales: pages.sales,
        };
    });

    const { banners, bannersMobile } = useSelector(({ banners }) => {
        return {
            banners: banners.banners,
            bannersMobile: banners.bannersMobile,
        };
    });

    const [activeSale, setActiveSale] = useState(false);
    const [saleOpenModal, setSaleOpenModal] = useState(false);

    const handleCloseSaleModal = useCallback(() => {
        setSaleOpenModal(false);
    }, []);

    const handleSetActiveSale = useCallback((sale) => {
        setSaleOpenModal(true);
        setActiveSale(sale);
    }, []);

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

    let swiperProps = { pagination: true, slidesPerView: 1 };
    if (_isMobile()) {
        swiperProps.spaceBetween = 30;
        if (bannersMobile.autoplay) {
            swiperProps.autoplay = {
                delay: bannersMobile.autoplay,
            };
        }
    } else {
        swiperProps.navigation = true;
        if (banners.autoplay) {
            swiperProps.autoplay = {
                delay: banners.autoplay,
            };
        }
    }

    return (
        <Container>
            {!_isMobile() && banners.banners && banners.banners.length ? (
                <div className="banners-wrapper">
                    <Swiper
                        {...swiperProps}
                        modules={[Autoplay, Navigation, Pagination]}
                        className="banners-swiper"
                    >
                        {banners.banners.map((banner, key) => (
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
                                    <img src={banner.img} alt={banner.alt} />
                                )}
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            ) : _isMobile() &&
              bannersMobile.banners &&
              bannersMobile.banners.length ? (
                <div className="mobile-banners-wrapper">
                    <Swiper
                        {...swiperProps}
                        modules={[Autoplay, Pagination]}
                        className="bannersMobile-swiper"
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
                                    <img src={banner.img} alt={banner.alt} />
                                )}
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            ) : (
                ""
            )}
            <SaleModal
                saleOpenModal={saleOpenModal}
                activeSale={activeSale}
                handleCloseSaleModal={handleCloseSaleModal}
            />
        </Container>
    );
}
