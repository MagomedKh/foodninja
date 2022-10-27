import React, { useState, useEffect } from 'react'
import {useDispatch, useSelector} from 'react-redux';
import {addProductToCart, decreaseProductInCart, removeProductFromCart} from '../../redux/actions/cart';
import {setModalProduct, setOpenModal} from '../../redux/actions/productModal';
import {Button} from '@material-ui/core';
import '../../css/product.css';
import LazyLoad from 'react-lazyload';
import { _getPlatform, _checkCartProduct } from '../helpers';
import PlaceholderImageProduct from './PlaceholderImageProduct';
import GroupIcon from '@mui/icons-material/Group';
import soon from '../../img/photo-soon.svg';

export default function Product({product, category}) {

  const dispatch = useDispatch();

  const [disabled, setDisabled] = useState(false)

  useEffect(()=>{
    if (!_checkCartProduct(product, category)) {
      setDisabled(true)
      dispatch(removeProductFromCart(product))
    } else {
      setDisabled(false)
    }
  },[category.disabled])

  const { cartProducts, lazyloadImg, categoryNew, categoryHit, logoImg} = useSelector( ({cart, config}) => {
    return {
      logoImg: config.data.CONFIG_company_logo_main,
      cartProducts: cart.items,
      categoryNew: config.data.CONFIG_new_category,
      categoryHit: config.data.CONFIG_hit_category,
      lazyloadImg: config.data.CONFIG_company_logo_preview_product
    }
  });

  
  const openModalBtnClick = () => {
    dispatch(setModalProduct({...product, disabled: disabled}));
    dispatch(setOpenModal(true));
  };
  
  const handleAddProduct = () => {
    dispatch(addProductToCart(product));
  }    
  const handleDecreaseProduct = () =>{
    dispatch(decreaseProductInCart(product));
  }

  return (
      <div className="product product-item" >
        <div className="product--labels-wrapper">
          { product.options._count_peoples && 
            <div className="product--label peoples"><GroupIcon />{product.options._count_peoples}</div>
          }
          { product.categories.includes(parseInt(categoryHit)) && (
            <div className="product--label hit">ХИТ</div>
          ) }
          { product.categories.includes(parseInt(categoryNew)) && (
            <div className="product--label new">NEW</div>
          ) }
          {/* { product.tags && (
            <div className="product--stickers">
                { Object.values(product.tags).map( (tag) =>
                  <div 
                    className="product--label peoples"
                    style={{backgroundColor: tag.tag_color ? tag.tag_color : '#F3F3F3', color: tag.tag_font_color ? tag.tag_font_color : '#000000'}}>
                    {tag.name}
                  </div>
                ) }
            </div>
          ) } */}
        </div>
        <div className="product--image" onClick={openModalBtnClick}>
          { _getPlatform() === 'vk' ? <img alt={product.title} src={product.img} />
          : <LazyLoad height={210} placeholder={<PlaceholderImageProduct />} debounce={100}>
              <img alt={product.title} src={ product.img ? product.img : soon } style={{ filter: disabled ? "grayscale(1)":""}}/>
            </LazyLoad> }
        </div>
    
        <div className="product--inner-wrapper">
          <h4 className="product--title" onClick={openModalBtnClick}>{product.title}</h4>
          <div className="product--description" onClick={openModalBtnClick} dangerouslySetInnerHTML={{__html: product.content}}></div>
          <div className="short-fade">
            <span onClick={openModalBtnClick} className="action" data-product-id={product.id}></span>
          </div>
          <div className="product--buying">
            <div className="product--price">
              { product.type === 'variations' ? ( 
                <span className="product--standart-price">от {product.options._price} ₽</span>
              ) : parseInt(product.options._regular_price) > parseInt(product.options._price) ?
                <span className="product--sales">
                  <span className="product--old-price">{product.options._regular_price} ₽</span>
                  <span className="product--sale-price main-color">{product.options._price} ₽</span>
                </span>
              : 
                <span className="product--standart-price">{product.options._price} ₽</span>
              }
            </div>
            <div className="product--info">
              { product.options.weight ? <div className="weight">{product.options.weight} гр.</div> : '' }
              { product.options.count_rolls ? <div className="count-rolls">{product.options.count_rolls} шт.</div> : '' }
            </div>
            { product.type === 'variations' ? (
              <Button variant="button" className="btn--action btn-buy" onClick={openModalBtnClick} disabled={disabled}>Выбрать</Button>
            ) : !cartProducts[product.id] ? (
              <Button variant="button" className="btn--action btn-buy" onClick={handleAddProduct} disabled={disabled}>Хочу</Button>
            ) : (
              <div className="product--quantity">
                <Button className="btn--default product-decrease" onClick={handleDecreaseProduct} disabled={disabled}>-</Button>
                <input className="quantity" type="text" readOnly value={cartProducts[product.id].items.length} data-product_id={product.id} />
                <Button className="btn--default product-add" onClick={handleAddProduct} disabled={disabled}>+</Button>
              </div>
            ) }
          </div>
        </div>
      </div>
    );
}
