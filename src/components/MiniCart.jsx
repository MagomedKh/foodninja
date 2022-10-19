import React, { useEffect } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import Drawer from '@mui/material/Drawer';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {useNavigate} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import '../css/minicart.css';
import emptyCartImg from '../img/empty-cart.svg';
import MiniCartProduct from '../components/Product/MiniCartProduct';
import MiniCartBonusProduct from '../components/Product/MiniCartBonusProduct';
import PromocodeMiniCartProduct from '../components/Product/PromocodeMiniCartProduct';
import {setCurrentPage} from '../redux/actions/pages';
import {setOpenModalAuth} from '../redux/actions/user';
import MiniCartFreeAddons from './Product/MiniCartFreeAddons';
import {_checkPromocode, _isMobile} from '../components/helpers.js';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import { FreeMode, Navigation } from "swiper";
import ReccomendProduct from '../components/Product/ReccomendProduct';
import AddonProductMini from '../components/Product/AddonProductMini';
import { Promocode } from '../components';
import MiniCartReccomends from './MiniCartRecommends';
import CartBonusesProducts from './CartBonusesProducts';
import { updateAlerts } from '../redux/actions/systemAlerts';
import { removePromocode } from '../redux/actions/cart';

function MiniCart() {
    const [miniCartOpen, setMiniCartState] = React.useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { config, cart, items, cartProducts, cartSubTotalPrice, promocode, cartTotalPrice, cartCountItems, promocodeProducts, recommend_items, addon_items, userCartBonusProduct, user } = useSelector( ({config, cart, products, user}) => {
        return {
            config: config.data, 
            cart: cart,
            items: products.items,
            cartProducts: cart.items,
            promocode: cart.promocode,
            cartTotalPrice: cart.totalPrice,
            cartSubTotalPrice: cart.subTotalPrice,
            cartCountItems: cart.countItems,
            promocodeProducts: cart.promocodeProducts,
            recommend_items: products.recommend_items,
            addon_items: products.addon_items,
            userCartBonusProduct: cart.bonusProduct,
            user: user.user
        }
    });
    const toggleMiniCartState = () => {
        setMiniCartState(!miniCartOpen);
    };

    const handleClickTopMenu = () => {
        window.scrollTo(0, 0);
        dispatch(setCurrentPage('/cart'));
    }

    function _declension(value, words){  
        value = Math.abs(value) % 100; 
        var num = value % 10;
        if(value > 10 && value < 20) return words[2]; 
        if(num > 1 && num < 5) return words[1];
        if(num === 1) return words[0]; 
        return words[2];
    }

    
    const handleMakeOrder = () => {
        // Проверка авторизации
        if( !user.token && config.CONFIG_auth_type !== 'noauth' )
            dispatch(setOpenModalAuth(true));  
        else {
            dispatch(setCurrentPage('/checkout'));
            window.scrollTo(0, 0);
            navigate('/checkout', {replace: true});  
        }
    } 

    if( promocode ) {
        const resultCheckPromocode = _checkPromocode(promocode, cartProducts, cartSubTotalPrice);
        if( resultCheckPromocode.status === 'error' ) {
            dispatch(removePromocode());
            dispatch(updateAlerts({
                open: true,
                message: resultCheckPromocode.message
            }));
        }
    }

    return (
        <div className="minicart--wrapper">
            <button className="btn--action minicart" onClick={toggleMiniCartState} >
                <ShoppingCartIcon className="minicart--cart-icon" />
                <div className="minicart--separator"></div>
                <div className="minicart--topcart--total">
                    <span className="minicart--topcart--count-item">{cartCountItems} {_declension(cartCountItems, ['товар', 'товара', 'товаров'])}</span>
                    <span className="minicart--topcart--price-total">{cartTotalPrice.toLocaleString('ru-RU')} &#8381;</span>
                </div>
            </button>
            <Drawer
                anchor="right"
                open={miniCartOpen}
                onClose={toggleMiniCartState}
            >
                    { cartCountItems && cartProducts ? ( 
                        <div className="minicart--inner">
                            <div className="minicart--product-list">
                                <h2 className="minicart--inner-title">
                                    Корзина 
                                    <IconButton
                                        color="inherit"
                                        onClick={toggleMiniCartState}
                                        className="minicart--close"
                                    ><CloseIcon /></IconButton>  
                                </h2>

                                { ( config.CONFIG_cart_info_text !== undefined && config.CONFIG_cart_info_text ) && (
                                    <Alert className="minicart--text-info" severity="info" sx={{mb: 2, mr: 2, ml: 2}} ><div dangerouslySetInnerHTML={{__html: config.CONFIG_cart_info_text}}></div></Alert>
                                ) }
                                { Object.keys(cartProducts).map( (key, index) => 
                                    items[key] && items[key].type !== undefined && items[key].type === 'variations' ? cartProducts[key].items.map( (keyVariantProduct, indexVariantProduct) => 
                                        <MiniCartProduct key={indexVariantProduct} productIndex={indexVariantProduct} productCart={cartProducts[key].items[indexVariantProduct]} productCount={1} productTotalPrice={cartProducts[key].items[indexVariantProduct].options._price} /> 
                                    ) : <MiniCartProduct key={cartProducts[key].items[0].id} productIndex={0} productCart={cartProducts[key].items[0]} productCount={cartProducts[key].items.length} productTotalPrice={cartProducts[key].totalPrice} /> 
                                ) }

                                {/* { Object.keys(promocodeProducts).map( (key, index) => items[key] !== undefined &&
                                    <PromocodeMiniCartProduct productCart={promocodeProducts[key]} productCount="1" productTotalPrice={promocode.productPrice} />
                                ) } */}
                                
                                { userCartBonusProduct.id && (
                                    <MiniCartBonusProduct productCart={userCartBonusProduct} productCount={1} productTotalPrice={userCartBonusProduct.options._price} />
                                ) }

                                <MiniCartFreeAddons />

                                <CartBonusesProducts minicart={true} />

                                <MiniCartReccomends />

                                <div className="minicart--total-wrapper">
                                    <div className="minicart--promocode">
                                        <Promocode />
                                    </div>

                                    { cart.discount ? (
                                        <div className="minicart--subtotal-price">
                                            <div className="price">Сумма заказа <span className="money">{cart.subTotalPrice.toLocaleString('ru-RU')} &#8381;</span></div>
                                            <div className="promocode">
                                                <span>Промокод <span className="main-color">{promocode.code}</span></span> 

                                                { promocode.type === 'percent' ?
                                                    <span className="money main-color">-{promocode.amount}%</span>
                                                : <span className="money main-color">-{cart.discount.toLocaleString('ru-RU')} &#8381;</span> }
                                            </div>
                                        </div>  
                                    ) : ''}

                                    <div className="minicart--total-block">
                                        <span className="minicart--total-title">Итого</span>
                                        <span className="minicart--total-price">{cartTotalPrice.toLocaleString('ru-RU')} &#8381;</span>
                                    </div>

                                    { config.CONFIG_order_min_price ? cartTotalPrice < config.CONFIG_order_min_price ? (
                                        <>
                                            <Alert severity="error" sx={{mb: 1}}>Минимальная сумма для заказа - {config.CONFIG_order_min_price} ₽</Alert>
                                            <Button disabled variant="button" onClick={handleMakeOrder} className="btn--action" sx={{mt: 2}}>Оформить заказ</Button>
                                        </>
                                    ) : <Button variant="button" onClick={handleMakeOrder} className="btn--action" sx={{mt: 2}}>Оформить заказ</Button>
                                    : <Button variant="button" onClick={handleMakeOrder} className="btn--action" sx={{mt: 2}}>Оформить заказ</Button> }
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="minicart--inner">
                            <div className="minicart--empty">
                                <img src={emptyCartImg} className="minicart--empty-logo" alt="Логотип"/>
                                <h4>Ой, пусто!</h4>
                                <div className="minicart--empty-text">Добавьте товары в корзину.</div>
                            </div>
                        </div>
                    ) }
            </Drawer>
        </div>
    )
}

export default MiniCart