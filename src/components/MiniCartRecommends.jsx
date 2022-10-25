import React from 'react'
import {useSelector, useDispatch} from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import {_isMobile} from '../components/helpers.js';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import { FreeMode, Navigation } from "swiper";
import MiniCartReccomendProduct from '../components/Product/MiniCartReccomendProduct';
import AddonProductMini from '../components/Product/AddonProductMini';
import addonImg from '../img/addons.jpg';

export default function MiniCartReccomends() {

    const [miniCartAddonOpen, setMiniCartAddonOpen] = React.useState(false);
    const [miniCartAddonOpenFirst, setMiniCartAddonOpenFirst] = React.useState(true);

    const dispatch = useDispatch();
    const { cartProducts, config, recommend_items, addon_items, currentPage } = useSelector( ({config, cart, products, pages}) => {
        return {
            cartProducts: cart.items,
            config: config.data,
            currentPage: pages.currentPage,
            recommend_items: products.recommend_items,
            addon_items: products.addon_items,
        }
    });

    const miniCartAddonOpenHandler = () => {
        if( currentPage == '/cart' )
            document.body.style.overflow = miniCartAddonOpen ? "initial": "hidden";

        console.log(miniCartAddonOpen);
        setMiniCartAddonOpen(!miniCartAddonOpen);
        setMiniCartAddonOpenFirst(false);
    }
    return (
        <div>
            { recommend_items.length ? (
                <div className="minicart--recommend-products">
                    <h4 className="minicart--recommends-title">Рекомендуем к заказу</h4>

                    <Swiper
                        slidesPerView="auto"
                        spaceBetween={30}
                        freeMode={true}
                        navigation={true}
                        modules={[FreeMode, Navigation]}
                        className="reccomend-products-swiper"
                    >
                        <SwiperSlide className="reccomend-slide reccomend-addons-slide reccomend-slide--mini">
                            <div className="reccomend-slide--addons-wrapper recommend-product" onClick={miniCartAddonOpenHandler}>
                                <img className="lazyload-image" src={addonImg} />
                                <div className="reccomend-slide--addons-title">Дополнения</div>
                            </div>
                        </SwiperSlide>
                        
                    { recommend_items.map( (product) => {
                        if( !cartProducts[product.id] ) return (
                            <SwiperSlide key={product.id} className="reccomend-slide reccomend-slide--mini">
                                <MiniCartReccomendProduct key={product.id} product={product} />
                            </SwiperSlide>
                        )
                    } ) }
                    </Swiper>
                </div> 
            ) : '' }

            { addon_items.length ? (
                <div className={`minicart--addons-backdrop ${ miniCartAddonOpen && "active"} ${ miniCartAddonOpenFirst && "no-animate"}`}>
                    <div className={`minicart--addon-products-modal ${ miniCartAddonOpen && "active"} ${ miniCartAddonOpenFirst && "no-animate"}`}>
                            <IconButton
                                color="inherit"
                                onClick={miniCartAddonOpenHandler}
                                className="minicart--addon-products__minicart-close"
                            ><CloseIcon /></IconButton>  

                        <div className="minicart--addon-products__minicart-title">Соусы и дополнения</div>

                        <div className="popup-addons-wrapper">
                            { addon_items.map( (product) =>
                                <div key={product.id}>
                                    <AddonProductMini 
                                        key={product.id}
                                        product={product}
                                        miniCartAddonOpen={miniCartAddonOpen}
                                    />
                                </div>
                            ) }
                        </div>
                    </div>
                </div> 
            ) : '' }
        </div>
    );
}