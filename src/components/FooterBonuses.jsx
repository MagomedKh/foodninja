import React, { useState, useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { setOpenBonusesModal } from "../redux/actions/bonusesProductsModal";
import { addBonusProductToCart } from "../redux/actions/cart";
import {
    Button,
    Container,
    Dialog,
    Divider,
    Grid,
    IconButton,
    Slide,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FooterBonusesGift from "../img/footer-bonuses-gift.svg";
import { _isMobile } from "./helpers";
import "../css/footer-bonuses.css";

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
        promocode,
    } = useSelector(({ products, cart, bonusesProductsModal }) => {
        return {
            bonuses_items: products.bonuses_items,
            userCartBonusProduct: cart.bonusProduct,
            cartTotalPrice: cart.totalPrice,
            openBonusesProductsModal:
                bonusesProductsModal.openBonusesProductsModal,
            promocode: cart.promocode,
        };
    }, shallowEqual);
    const { CONFIG_free_products_program_status } = useSelector((state) => {
        return state.config.data;
    }, shallowEqual);

    const [bonusesItemsLocal, setBonusesItemsLocal] = useState(null);

    useEffect(() => {
        if (bonuses_items) {
            setBonusesItemsLocal(bonuses_items);
        }
    }, [bonuses_items]);

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
        dispatch(setOpenBonusesModal(false));
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
    return (
        <div>
            <Slide
                direction="up"
                in={
                    CONFIG_free_products_program_status === "on" &&
                    bonuses_items &&
                    bonuses_items.length &&
                    !Object.keys(promocode).length
                }
                mountOnEnter
                unmountOnExit
            >
                <div className="footer-bonuses">
                    <Container className="footer-bonuses__container">
                        <div
                            className="footer-bonuses__info"
                            onClick={handleBonusesHandler}
                        >
                            Выбери подарок
                            <img
                                src={FooterBonusesGift}
                                alt={"FooterBonusesGift"}
                                style={{ marginLeft: 10 }}
                            />
                        </div>

                        <Divider
                            orientation="vertical"
                            sx={{
                                borderColor: "#fff",
                                height: "40px",
                                borderWidth: "1px",
                            }}
                        />

                        <div className="footer-bonuses__points">
                            <div
                                className="footer-bonuses__points-bg"
                                style={{
                                    width: `${
                                        cartTotalPrice
                                            ? (cartTotalPrice /
                                                  maxBonusesPrice) *
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
            </Slide>

            <Dialog
                maxWidth="md"
                fullWidth
                onClose={handleClose}
                {...dialogProps}
                className="bonuses-modal--dialog"
                sx={{
                    "& .MuiPaper-root": {
                        borderRadius: _isMobile() ? "0px" : "20px",
                    },
                }}
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
                    <Container disableGutters={!_isMobile()}>
                        <div className="bonuses-modal__carts">
                            <Grid container spacing={1}>
                                {bonusesItemsLocal?.length &&
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
                                                <div className="bonuses-modal__inner-wrapper">
                                                    <div className="bonuses-modal__cart-title">
                                                        {item.title}
                                                    </div>
                                                    <div className="bonuses-modal__cart-price">
                                                        <strike>
                                                            {
                                                                item.options
                                                                    ._price
                                                            }{" "}
                                                            ₽
                                                        </strike>{" "}
                                                        <span className="main-color">
                                                            Бесплатно
                                                        </span>
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

                                                    {cartTotalPrice >=
                                                        item.limit &&
                                                        userCartBonusProduct.id !==
                                                            item.id && (
                                                            <Button
                                                                variant="button"
                                                                className="btn btn--action"
                                                                sx={{
                                                                    width: 1,
                                                                    mt: 2,
                                                                }}
                                                                onClick={() =>
                                                                    handleChooseBonusProduct(
                                                                        item
                                                                    )
                                                                }
                                                            >
                                                                Выбрать
                                                            </Button>
                                                        )}
                                                    {cartTotalPrice >=
                                                        item.limit &&
                                                        userCartBonusProduct.id ===
                                                            item.id && (
                                                            <Button
                                                                variant="button"
                                                                className="btn btn--action"
                                                                sx={{
                                                                    width: 1,
                                                                    mt: 2,
                                                                }}
                                                                onClick={() =>
                                                                    handleChooseBonusProduct(
                                                                        {}
                                                                    )
                                                                }
                                                            >
                                                                Отменить
                                                            </Button>
                                                        )}
                                                    {cartTotalPrice <
                                                        item.limit && (
                                                        <Button
                                                            disabled
                                                            variant="button"
                                                            sx={{
                                                                width: 1,
                                                                mt: 2,
                                                            }}
                                                            className="btn btn--outline"
                                                        >
                                                            Не хватает{" "}
                                                            {item.limit -
                                                                cartTotalPrice}{" "}
                                                            ₽
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                            {_isMobile() &&
                                            index !==
                                                bonusesItemsLocal.length - 1 ? (
                                                <Divider
                                                    sx={{ borderColor: "#eee" }}
                                                />
                                            ) : null}
                                        </Grid>
                                    ))}
                            </Grid>
                        </div>
                    </Container>
                </div>
            </Dialog>
        </div>
    );
}
