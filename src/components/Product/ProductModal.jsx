import * as React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {_isMobile} from '../../components/helpers.js';
import {addProductToCart, decreaseProductInCart} from '../../redux/actions/cart';
import {setModalProduct, setOpenModal} from '../../redux/actions/productModal';
import AddonProductModal from '../../components/Product/AddonProductModal';
import Button from '@material-ui/core/Button';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import '../../css/product-modal.css';
import Zoom from '@mui/material/Zoom';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import { ButtonGroup, ToggleButtonGroup, ToggleButton } from '@material-ui/core';
import soon from "../../img/photo-soon.svg";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ProductModal() {
  const dispatch = useDispatch();

  const {productModal, openProductModal, addon_products, cartProducts} = useSelector( ({productModal, products, cart}) => {
    return {
      productModal: productModal.productModal,
      openProductModal: productModal.openProductModal,
      addon_products: products.addon_items,
      cartProducts: cart.items
    }
  });
  const [choosenAttributes, setChoosenAttributes] = React.useState({});
  const [activeVariant, setActiveVariant] = React.useState(false);
  const [wrongVariant, setWrongVariant] = React.useState(false);
  
  React.useEffect(() => {
    let dataAttributes = {};
    if( productModal.type === 'variations' && productModal.attributes ) {
      Object.keys(productModal.attributes).forEach( (value, index) => {
        dataAttributes[index] = Object.values(productModal.attributes)[index].options[0];
      });
      setChoosenAttributes(dataAttributes);
    }
    if( productModal.type === 'variations' && productModal.variants ) {
      let shouldSkip = false;
      let foundVariant = false;
      Object.values(productModal.variants).forEach( (variant, indexVariant) => {
        let checkVariant = true;
        if ( shouldSkip ) {
          return;
        }
        Object.values(variant.attributes).forEach( (attr, attrIndex) => {
          if( dataAttributes[attrIndex] !== attr )
            checkVariant =  false;
          
        });
        if( checkVariant ) {
          setActiveVariant(variant);
          shouldSkip = foundVariant = true;
        }
      });
      if( foundVariant )
        setWrongVariant(false);
      else 
        setWrongVariant(true);

    }
    
    return
  }, [productModal]);



  const handleChooseAttribute = (attribute, value) => {
    let dataAttributes = choosenAttributes;
    dataAttributes[attribute] = value;
    setChoosenAttributes({...choosenAttributes, dataAttributes});
    let shouldSkip = false;
    let foundVariant = false;
    Object.values(productModal.variants).forEach( (variant, indexVariant) => {
      let checkVariant = true;
      if ( shouldSkip ) {
        return;
      }
      Object.values(variant.attributes).forEach( (attr, attrIndex) => {
        if( dataAttributes[attrIndex] !== attr )
          checkVariant =  false;
        
      });
      if( checkVariant ) {
        setActiveVariant(variant);
        shouldSkip = foundVariant = true;
      }
    });
    if( foundVariant )
      setWrongVariant(false);
    else 
      setWrongVariant(true);
  };

  const handleClose = () => {
    dispatch(setModalProduct(false));
    setActiveVariant(false);
    dispatch(setOpenModal(false));
  };
  const handleAddProduct = (productModal) =>{
    dispatch(addProductToCart(productModal))
    handleClose();
  }  
  const handleAddVariantProduct = () => {
    let product = productModal;
    product.options._price = activeVariant.price;
    product.variant = activeVariant;
    dispatch(addProductToCart(product))
    handleClose();
  }    
  const handleDecreaseProduct = (productModal) =>{
    dispatch(decreaseProductInCart(productModal));
  }

  let dialogProps = {"open": openProductModal, "maxWidth": "md" };
  if( _isMobile() ) {
    dialogProps.TransitionComponent = Transition;
    dialogProps.fullScreen = true;
    dialogProps.scroll = "body";
  }

  return (
    <Dialog
      {...dialogProps}
    > { productModal ? 
      <div className="product-modal-wrapper">
        <IconButton
          edge="start"
          color="inherit"
          onClick={handleClose}
          aria-label="close"
          className="modal-close"
        ><CloseIcon /></IconButton>
        <div className="product-modal">
          <div className="product-modal--image">
            <Zoom in={true}><img src={ activeVariant ? activeVariant.img : productModal.img ? productModal.img : soon } alt={productModal.title}/></Zoom>
          </div>
          <div className="product-modal--info">
            <div className="product-modal--scrolling">
            <h2 className="product-modal--title">{productModal.title}</h2>

            { productModal.type === 'variations' ? (
              <>
                { (activeVariant && activeVariant.description) ?
                  <div className="product-modal--description" data-product-id={productModal.id} dangerouslySetInnerHTML={{__html: activeVariant.description}}></div>
                : <div className="product-modal--description" data-product-id={productModal.id} dangerouslySetInnerHTML={{__html: productModal.content.replace(/\n/g,"<br />")}}></div>}

                <div className="product-modal--attributes">
                  { Object.values(productModal.attributes).map( (attribute, keyAttr) => (
                    <div className="product-modal--attribute" key={keyAttr}>
                      <div className="attribute--name">{attribute.name}</div>
                      <ToggleButtonGroup
                        color="primary"
                        value={choosenAttributes[keyAttr]}
                        exclusive
                        className="attribute--variations"
                      >
                        { Object.values(attribute.options).map( (opt, key) => (
                          <ToggleButton className="btn--variation" onClick={() => handleChooseAttribute(keyAttr, opt)} key={key} value={opt}>{opt}</ToggleButton >
                        ) )}
                      </ToggleButtonGroup>
                    </div>
                  )) }
                  </div>  
                </>            
              ) : <div className="product-modal--description" data-product-id={productModal.id} dangerouslySetInnerHTML={{__html: productModal.content.replace(/\n/g,"<br />")}}></div>}

              { wrongVariant ? (
                  <Collapse sx={{mt: 1}} in={true}>
                    <Alert severity="error" className="alert--wrong-variant">
                        Данный вариант недоступен
                    </Alert>
                </Collapse>
              ) : '' }

              { !wrongVariant ? (
              <div className="product-modal--buying">
                <div className="product-modal--price">
                  { activeVariant ? activeVariant.price : productModal.options._price} &#8381;
                </div>
                <div className="product-modal--stats">
                  { productModal.type !== 'variations' &&
                    <>
                      { productModal.options.weight ? <div className="weight">{productModal.options.weight} гр.</div> : '' }
                      { productModal.options.count_rolls ? <div className="count-rolls">{productModal.options.count_rolls} шт.</div> : '' }
                    </>
                  }
                </div>
                { productModal.type === 'variations' ? (
                  <Button variant="button" className="btn--action btn-buy" onClick={handleAddVariantProduct}>Хочу</Button>
                ) : !cartProducts[productModal.id] ? (
                  <Button variant="button" className="btn--action btn-buy" onClick={() => handleAddProduct(productModal)}>Хочу</Button>
                ) : (
                  <div className="product-modal--quantity">
                    <Button className="btn--default product-decrease" onClick={() => handleDecreaseProduct(productModal)}>-</Button>
                    <input className="quantity" type="text" readOnly value={cartProducts[productModal.id].items.length} data-product_id={productModal.id} />
                    <Button className="btn--default product-add" onClick={() => handleAddProduct(productModal)}>+</Button>
                  </div>
                )  }
              </div>
              ) : '' }

              { addon_products.length ? ( 
                <div className="addon-products">
                  <h3 className="addon-products--title">Соусы и дополнения</h3>
                  <div className="addon-products--grid-list">
                  { addon_products.map( (product) => 
                    <AddonProductModal key={product.id} product={product} />
                  ) }
                  </div>
                </div>
              ) : '' }
            </div>
          </div>
        </div>
      </div>
      : '' }
    </Dialog>
  );
}
