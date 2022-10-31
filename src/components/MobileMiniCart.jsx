import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Drawer from "@mui/material/Drawer";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import "../css/minicart.css";
import MiniCartProduct from "../components/Product/MiniCartProduct";
import { setCurrentPage } from "../redux/actions/pages";
import { _declension } from "./helpers.js";
import { _isMobile } from "./helpers.js";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function MobileMiniCart() {
    const [miniCartOpenDialog, setMiniCartDialog] = React.useState(false);
    const drawerBleeding = 56;
    const dispatch = useDispatch();

    const { cartProducts, cartTotalPrice, cartCountItems, bonuses_items } =
        useSelector(({ cart, products }) => {
            return {
                bonuses_items: products.bonuses_items,
                cartProducts: cart.items,
                cartTotalPrice: cart.totalPrice,
                cartCountItems: cart.countItems,
            };
        });

    const toggleMiniCartDialog = () => {
        setMiniCartDialog(!miniCartOpenDialog);
    };

    const handleClickToCart = () => {
        dispatch(setCurrentPage("/cart"));
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
                className="minicart-mobile"
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
