import * as React from 'react';
import "../css/banners.css";
import {useSelector} from 'react-redux';
import Container from '@mui/material/Container';
import {_isMobile} from './helpers.js';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import { Navigation, Pagination } from "swiper";
import 'swiper/swiper.min.css'
import "swiper/modules/navigation/navigation.min.css";
import "swiper/modules/pagination/pagination.min.css";

export default function Footer() {

    const {banners, bannersMobile} = useSelector( ({banners}) => {
        return {
            banners: banners.banners,
            bannersMobile: banners.bannersMobile
        }
    });

	return (
		<Container>
            { !_isMobile() && banners.length ? (
                <div className="banners-wrapper">
                    <Swiper
                        slidesPerView={1}
                        navigation={true}
                        pagination={true}
                        modules={[Navigation, Pagination]}
                        className="banners-swiper"
                    >{ banners && banners.map( (banner, key) =>
                        <SwiperSlide key={key} className="banner-slide">
                            { banner.link ? <a href={banner.link} >
                                <img src={banner.img} alt={banner.alt} />
                            </a>
                        : <img src={banner.img} alt={banner.alt} /> }
                        </SwiperSlide>
                    ) }
                    </Swiper>
                </div>
            ) : _isMobile() && bannersMobile.length ? (
                <div className="mobile-banners-wrapper">
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={30}
                        pagination={true}
                        modules={[Pagination]}
                        className="bannersMobile-swiper"
                    >{ bannersMobile && bannersMobile.map( (banner, key) =>
                        <SwiperSlide key={key} className="banner-slide">
                            { banner.link ? <a href={banner.link} >
                                <img src={banner.img} alt={banner.alt} />
                            </a>
                        : <img src={banner.img} alt={banner.alt} /> }
                        </SwiperSlide>
                    ) }
                    </Swiper>
                </div>
            ) : '' }
		</Container>
	);
}