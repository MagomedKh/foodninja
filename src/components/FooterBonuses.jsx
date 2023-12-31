import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { setOpenBonusesModal } from "../redux/actions/bonusesProductsModal";
import { addBonusProductToCart } from "../redux/actions/cart";
import {
    Alert,
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
import soon from "../img/photo-soon.svg";
import { _isMobile } from "./helpers";
import "../css/footer-bonuses.css";
import useBonusProducts from "../hooks/useBonusProducts";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function BonusesProductsModal() {
    const dispatch = useDispatch();

    const { bonuses_items, userCartBonusProduct, openBonusesProductsModal } =
        useSelector(({ products, cart, bonusesProductsModal }) => {
            return {
                bonuses_items: products.bonuses_items,
                userCartBonusProduct: cart.bonusProduct,
                openBonusesProductsModal:
                    bonusesProductsModal.openBonusesProductsModal,
            };
        }, shallowEqual);

    const {
        cartTotalPrice,
        bonusesHardmod,
        disabledCategories,
        disabledCategoriesNames,
        bonusesDisabled,
        bonusesDisabledByCategory,
        bonusesDisabledByPromocode,
    } = useBonusProducts();

    const [bonusesItemsLocal, setBonusesItemsLocal] = useState(null);

    useEffect(() => {
        if (bonuses_items) {
            setBonusesItemsLocal(bonuses_items);
        }
    }, [bonuses_items]);

    useEffect(() => {
        if (bonusesDisabled && openBonusesProductsModal) {
            dispatch(setOpenBonusesModal(false));
        }
    }, [bonusesDisabled]);

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

    if (!openBonusesProductsModal && window.location.hash === "bonuses-modal") {
        window.history.replaceState(
            "",
            document.title,
            window.location.pathname
        );
    }

    const hashEventListener = (event) => {
        if (!window.location.hash && event.oldURL.includes("#bonuses-modal")) {
            handleClose();
        }
    };

    useEffect(() => {
        window.addEventListener("hashchange", hashEventListener);
        return () => {
            window.removeEventListener("hashchange", hashEventListener);
        };
    }, []);

    const handleClose = () => {
        if (window.location.hash === "#bonuses-modal") {
            window.history.replaceState(
                "",
                document.title,
                window.location.pathname
            );
        }
        dispatch(setOpenBonusesModal(false));
    };

    const handleChooseBonusProduct = (item) => {
        if (
            cartTotalPrice < item.limit ||
            bonusesDisabledByCategory ||
            bonusesDisabledByPromocode
        ) {
            return;
        }
        dispatch(addBonusProductToCart(item));
        dispatch(setOpenBonusesModal(false));
    };

    const handleBonusesHandler = () => {
        window.location.hash = "bonuses-modal";
        dispatch(setOpenBonusesModal(true));
    };

    let maxBonusesPrice = 0;
    if (bonuses_items.length)
        bonuses_items.forEach((element) => {
            if (element.limit > maxBonusesPrice)
                maxBonusesPrice = element.limit;
        });

    let dialogProps = {
        open: openBonusesProductsModal,
        maxWidth: "md",
    };
    if (_isMobile()) {
        dialogProps.TransitionComponent = Transition;
        dialogProps.fullScreen = true;
        dialogProps.scroll = "body";
    }

    return (
        <div>
            <Slide
                direction="up"
                in={!bonusesDisabled}
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
                onClose={(event, reason) => {
                    if (reason === "escapeKeyDown") {
                        handleClose();
                    }
                }}
                {...dialogProps}
                className="bonuses-modal--dialog"
                sx={{
                    "& .MuiDialog-paper": {
                        borderRadius: _isMobile() ? "0px" : "20px",
                    },
                }}
            >
                <div className="modal-alert--wrapper bonuses-modal--wrapper">
                    <div className="bonuses-modal--inner-wrapper">
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
                            {bonusesDisabledByPromocode ? (
                                <Alert severity="error" sx={{ my: 2 }}>
                                    Бонусные товары нельзя выбрать при
                                    использовании промокода.
                                </Alert>
                            ) : null}
                            {bonusesHardmod && disabledCategories?.length ? (
                                <Alert severity="error" sx={{ my: 2 }}>
                                    Товары из категории:{" "}
                                    {disabledCategoriesNames.join(", ")} нельзя
                                    использовать вместе со шкалой подарков.
                                </Alert>
                            ) : null}
                            {!bonusesHardmod && disabledCategories?.length ? (
                                <Alert severity="error" sx={{ my: 2 }}>
                                    Товары из категории:{" "}
                                    {disabledCategoriesNames.join(", ")} не
                                    участвуют в шкале подарков.
                                </Alert>
                            ) : null}
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
                                                    <div
                                                        className="product--image "
                                                        onClick={() => {
                                                            userCartBonusProduct.id ===
                                                            item.id
                                                                ? handleChooseBonusProduct(
                                                                      {}
                                                                  )
                                                                : handleChooseBonusProduct(
                                                                      item
                                                                  );
                                                        }}
                                                    >
                                                        <img
                                                            src={
                                                                item.img
                                                                    ? item.img
                                                                    : soon
                                                            }
                                                            alt={item.title}
                                                        />
                                                    </div>
                                                    <div className="bonuses-modal__inner-wrapper">
                                                        <div
                                                            className="bonuses-modal__cart-title"
                                                            onClick={() => {
                                                                userCartBonusProduct.id ===
                                                                item.id
                                                                    ? handleChooseBonusProduct(
                                                                          {}
                                                                      )
                                                                    : handleChooseBonusProduct(
                                                                          item
                                                                      );
                                                            }}
                                                        >
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
                                                                от {item.limit}{" "}
                                                                ₽
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
                                                                    disabled={
                                                                        bonusesDisabledByPromocode ||
                                                                        bonusesDisabledByCategory
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
                                                    bonusesItemsLocal.length -
                                                        1 ? (
                                                    <Divider
                                                        sx={{
                                                            borderColor: "#eee",
                                                        }}
                                                    />
                                                ) : null}
                                            </Grid>
                                        ))}
                                </Grid>
                            </div>
                        </Container>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
