import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Slide } from "@mui/material";
// import { Button, CloseIcon, Dialog, IconButton } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import MiniCartProduct from "../components/Product/MiniCartProduct";
import { _declension, _isMobile } from "./helpers.js";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import "../css/minicart.css";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function MobileMiniCart() {
    const [miniCartOpenDialog, setMiniCartDialog] = React.useState(false);
    const dispatch = useDispatch();

    // const { cartProducts, cartTotalPrice } =
    //     useSelector(({ cart, products }) => {
    //         return {
    //             cartProducts: cart.items,
    //             cartTotalPrice: cart.totalPrice,
    //         };
    //     });

    const { cartCountItems, bonuses_items } = useSelector(
        ({ cart, products }) => {
            return {
                bonuses_items: products.bonuses_items,
                cartCountItems: cart.countItems,
            };
        }
    );

    // const toggleMiniCartDialog = () => {
    //     setMiniCartDialog(!miniCartOpenDialog);
    // };

    const handleClickToCart = () => {
        window.scrollTo(0, 0);
    };

    let dialogMiniCartProps = { open: miniCartOpenDialog };
    if (_isMobile()) {
        dialogMiniCartProps.TransitionComponent = Transition;
        dialogMiniCartProps.fullScreen = true;
    }

    return (
        <div
            className={
                bonuses_items !== undefined && bonuses_items.length
                    ? "minicart--wrapper active-bonuses"
                    : "minicart--wrapper"
            }
        >
            <Link
                className="minicart-mobile openCart"
                onClick={handleClickToCart}
                to={"/cart"}
            >
                <span className="minicart-mobile--count-item">
                    {cartCountItems}
                </span>

                <ShoppingCartIcon />

                {/* <span className="minicart--topcart--price-total btn btn--action">{cartTotalPrice.toLocaleString('ru-RU')} &#8381;</span> */}
            </Link>

            {/* <Dialog
				{...dialogMiniCartProps}
			>
				<h2 className="minicart-modal--title ">Корзина</h2>
				<IconButton
					edge="start"
					color="inherit"
					onClick={toggleMiniCartDialog}
					aria-label="close"
					className="modal-close mobile-minicart"
				><CloseIcon /></IconButton>

				{ cartCountItems && cartProducts ? ( 
					<div className="minicart--inner">
						<h2 className="minicart--inner-title">
							Корзина 
							<IconButton
								color="inherit"
								onClick={toggleMiniCartDialog}
								className="minicart--close"
							><CloseIcon /></IconButton>  
						</h2>
						<div className="minicart--product-list">
							{ Object.keys(cartProducts).map( (key, index) => 
								<MiniCartProduct key={cartProducts[key].items[0].id} productCart={cartProducts[key].items[0]} productCount={cartProducts[key].items.length} productTotalPrice={cartProducts[key].totalPrice} />
							) }
							<div className="minicart--total-wrapper">
								<div className="minicart--total-block">
									<span className="minicart--total-title">Сумма заказа:</span>
									<span className="minicart--total-price">{cartTotalPrice.toLocaleString('ru-RU')} &#8381;</span>
								</div>
								<Link onClick={handleClickToCart} to="/cart" className="btn--action" sx={{mt: 2}}>Оформить заказ</Link>
							</div>
						</div>
					</div>
				) : (
					<div className="minicart--inner">
						<div className="minicart--empty">
							<img src={logo} className="minicart--empty-logo" alt="Логотип"/>
							<h4>Ой, пусто!</h4>
							<div className="minicart--empty-text">Добавьте товары в корзину.</div>
						</div>
					</div>
				) }
			</Dialog> */}
        </div>
    );
}

export default MobileMiniCart;
