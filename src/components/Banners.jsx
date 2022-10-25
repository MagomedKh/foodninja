import * as React from 'react';
import "../css/banners.css";
import {useSelector} from 'react-redux';
import Container from '@mui/material/Container';
import {_isMobile} from './helpers.js';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import { Autoplay, Navigation, Pagination } from "swiper";
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


	let swiperProps = {"pagination": true, "slidesPerView": 1 };
	if( _isMobile() ) {
        swiperProps.spaceBetween = 30;
        if( bannersMobile.autoplay ) {
            swiperProps.autoplay = {
                delay: bannersMobile.autoplay
            } 
        }
	} else {
        swiperProps.navigation = true;
        if( banners.autoplay ) {
            swiperProps.autoplay = {
                delay: banners.autoplay
            } 
        }
    }


	return (
		<Container>
            { !_isMobile() && banners.banners && banners.banners.length ? (
                <div className="banners-wrapper">
                    <Swiper
                        {...swiperProps}
                        modules={[Autoplay, Navigation, Pagination]}
                        className="banners-swiper"
                    >{ banners.banners.map( (banner, key) =>
                        <SwiperSlide key={key} className="banner-slide">
                            { banner.link ? <a href={banner.link} >
                                <img src={banner.img} alt={banner.alt} />
                            </a>
                        : <img src={banner.img} alt={banner.alt} /> }
                        </SwiperSlide>
                    ) }
                    </Swiper>
                </div>
            ) : _isMobile() && bannersMobile.banners && bannersMobile.banners.length ? (
                <div className="mobile-banners-wrapper">
                    <Swiper
                        {...swiperProps}
                        modules={[Autoplay, Pagination]}
                        className="bannersMobile-swiper"
                    >{ bannersMobile.banners.map( (banner, key) =>
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