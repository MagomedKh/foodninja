import React, { useEffect } from 'react'
import {useDispatch, useSelector} from 'react-redux';
import {addProductToCart, decreaseProductInCart} from '../../redux/actions/cart';
import Button from '@material-ui/core/Button';
import '../../css/product.css';
import '../../css/addon-product.css';
import soon from '../../img/photo-soon.svg';

export default function AddonProductMini({product}) {

  const dispatch = useDispatch();

  const { cartProducts } = useSelector( ({cart}) => {
    return {
      cartProducts: cart.items
    }
  });

  
  const handleAddProduct = () =>{
    dispatch(addProductToCart(product))
  }    
  const handleDecreaseProduct = () =>{
    dispatch(decreaseProductInCart(product));
  }

  return (
      <div className="addon-product--mini">

        <div className='addon-product--mini-inner'>
          <div className="addon-product--image">
            <img className="lazyload-image" src={product.img ? product.img : soon} alt={product.title}/>
          </div>
          <h2 className="addon-product--title-mini">{product.title}</h2>
        </div>
    
        <div className="addon-product--mini-btn--wrapper">
            { !cartProducts[product.id] ? (
              <Button className="btn--outline btn-buy addon-product--mini-inner--btn" onClick={handleAddProduct}>
                <div className="">{product.options._price.toLocaleString('ru-RU')} &#8381;</div>
              </Button>
            ) : (
              <div className="product--quantity product--quantity--mini">
                <Button className="btn--default product-decrease" onClick={handleDecreaseProduct}>-</Button>
                <input className="quantity" type="text" readOnly value={cartProducts[product.id].items.length} />
                <Button className="btn--default product-add" onClick={handleAddProduct}>+</Button>
              </div>
            ) }
        </div>
      </div>
    );
}