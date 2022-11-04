import * as React from "react";
import Dialog from "@mui/material/Dialog";
import { setOpenBonusesModal } from "../redux/actions/bonusesProductsModal";
import { useDispatch, useSelector } from "react-redux";
import { addBonusProductToCart } from "../redux/actions/cart";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import "../css/footer-bonuses.css";
import Slide from "@mui/material/Slide";
import { _isMobile } from "./helpers";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function BonusesProductsModal() {
    const dispatch = useDispatch();

    const {
        bonuses_items,
        cartTotalPrice,
        userCartBonusProduct,
        openBonusesProductsModal,
    } = useSelector(({ products, cart, bonusesProductsModal }) => {
        return {
            bonuses_items: products.bonuses_items,
            userCartBonusProduct: cart.bonusProduct,
            cartTotalPrice: cart.totalPrice,
            openBonusesProductsModal:
                bonusesProductsModal.openBonusesProductsModal,
        };
    });
    const { data: config } = useSelector((state) => state.config);

    const [bonusesItemsLocal, setBonusesItemsLocal] = useState(bonuses_items);

    const setBonusesContentActive = (item) => {
        setBonusesItemsLocal(
            bonusesItemsLocal.map((unit) => {
                if (unit.id === item.id) return { ...unit, moreContent: true };
                return unit;
            })
        );
    };
    const setBonusesContentNoActive = (item) => {
        setBonusesItemsLocal(
            bonusesItemsLocal.map((unit) => {
                if (unit.id === item.id) return { ...unit, moreContent: false };
                return unit;
            })
        );
    };

    const handleClose = () => {
        dispatch(setOpenBonusesModal(false));
    };

    const handleChooseBonusProduct = (item) => {
        dispatch(addBonusProductToCart(item));
    };

    const handleBonusesHandler = () => {
        dispatch(setOpenBonusesModal(true));
    };

    let maxBonusesPrice = 0;
    if (bonuses_items.length)
        bonuses_items.forEach((element) => {
            if (element.limit > maxBonusesPrice)
                maxBonusesPrice = element.limit;
        });

    let dialogProps = { open: openBonusesProductsModal, maxWidth: "md" };
    if (_isMobile()) {
        dialogProps.TransitionComponent = Transition;
        dialogProps.fullScreen = true;
        dialogProps.scroll = "body";
    }

    if (
        config.CONFIG_free_products_program_status !== "on" ||
        !bonuses_items ||
        !bonuses_items.length
    ) {
        return null;
    }
    return (
        <div>
            <div className="footer-bonuses">
                <Container className="footer-bonuses__container">
                    <div
                        className="footer-bonuses__info"
                        onClick={handleBonusesHandler}
                    >
                        Выбери подарок
                    </div>
                    <div className="footer-bonuses__points">
                        <div
                            className="footer-bonuses__points-bg"
                            style={{
                                width: `${
                                    cartTotalPrice
                                        ? (cartTotalPrice / maxBonusesPrice) *
                                          100
                                        : 0
                                }%`,
                            }}
                        ></div>
                        {bonuses_items.map((item) => (
                            <div
                                key={item.id}
                                className="footer-bonuses__point"
                                style={{
                                    left: `${
                                        (item.limit / maxBonusesPrice) * 100
                                    }%`,
                                }}
                            >
                                <div className="footer-bonuses__point-block">
                                    {item.limit}
                                    <span className="footer-bonuses__point-valute">
                                        ₽
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Container>
            </div>

            <Dialog
                maxWidth="md"
                fullWidth
                onClose={handleClose}
                {...dialogProps}
            >
                <div className="modal-alert--wrapper">
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                        className="modal-close"
                    >
                        <CloseIcon />
                    </IconButton>
                    <h2 className="modal-alert--title">Выберите подарок</h2>
                    <div className="bonuses-modal__carts">
                        <Grid container spacing={1}>
                            {bonusesItemsLocal &&
                                bonusesItemsLocal.map((item, index) => (
                                    <Grid
                                        key={item.id}
                                        item
                                        sm={12}
                                        md={4}
                                        sx={{ width: 1 }}
                                    >
                                        <div
                                            className={`bonuses-modal__cart product product-item ${
                                                userCartBonusProduct.id ===
                                                item.id
                                                    ? "bonuses-modal__cart-active"
                                                    : ""
                                            }`}
                                            key={`${index}_${item.title}`}
                                        >
                                            <div className="product--image ">
                                                <img
                                                    src={item.img}
                                                    alt={item.title}
                                                />
                                            </div>
                                            <div className="bonuses-modal__cart-price">
                                                <strike>
                                                    {item.options._price} ₽
                                                </strike>{" "}
                                                <span className="main-color">
                                                    Бесплатно
                                                </span>
                                            </div>
                                            <div className="bonuses-modal__cart-title">
                                                {item.title}
                                            </div>
                                            <div
                                                className={`bonuses-modal__cart-content ${
                                                    item.moreContent
                                                        ? "bonuses-modal__cart-content--mod"
                                                        : ""
                                                }`}
                                                dangerouslySetInnerHTML={{
                                                    __html: item.content,
                                                }}
                                            ></div>
                                            <div className="bonuses-modal__cart-info">
                                                <div className="bonuses-modal__cart-cost">
                                                    от {item.limit} ₽
                                                </div>
                                                <div className="bonuses-modal__detail-wrapper">
                                                    {!item.moreContent && (
                                                        <div
                                                            className="bonuses-modal__cart-detail"
                                                            onClick={() =>
                                                                setBonusesContentActive(
                                                                    item
                                                                )
                                                            }
                                                        >
                                                            Подробнее
                                                        </div>
                                                    )}
                                                    {item.moreContent && (
                                                        <div
                                                            className="bonuses-modal__cart-detail"
                                                            onClick={() =>
                                                                setBonusesContentNoActive(
                                                                    item
                                                                )
                                                            }
                                                        >
                                                            Свернуть
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {cartTotalPrice >= item.limit &&
                                                userCartBonusProduct.id !==
                                                    item.id && (
                                                    <Button
                                                        variant="button"
                                                        className="btn btn--action"
                                                        sx={{ width: 1, mt: 2 }}
                                                        onClick={() =>
                                                            handleChooseBonusProduct(
                                                                item
                                                            )
                                                        }
                                                    >
                                                        Выбрать
                                                    </Button>
                                                )}
                                            {cartTotalPrice >= item.limit &&
                                                userCartBonusProduct.id ===
                                                    item.id && (
                                                    <Button
                                                        variant="button"
                                                        className="btn btn--action"
                                                        sx={{ width: 1, mt: 2 }}
                                                        onClick={() =>
                                                            handleChooseBonusProduct(
                                                                {}
                                                            )
                                                        }
                                                    >
                                                        Отменить
                                                    </Button>
                                                )}
                                            {cartTotalPrice < item.limit && (
                                                <Button
                                                    disabled
                                                    variant="button"
                                                    sx={{ width: 1, mt: 2 }}
                                                    className="btn btn--outline"
                                                >
                                                    Не хватает{" "}
                                                    {item.limit -
                                                        cartTotalPrice}{" "}
                                                    ₽
                                                </Button>
                                            )}
                                        </div>
                                    </Grid>
                                ))}
                        </Grid>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
