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
import { _isMobile } from "./helpers";
import "../css/footer-bonuses.css";
import { getTotalPrice } from "../redux/reducers/cart";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function BonusesProductsModal() {
    const dispatch = useDispatch();

    const {
        bonuses_items,
        userCartBonusProduct,
        openBonusesProductsModal,
        promocode,
        cartProducts,
        productCategories,
    } = useSelector(({ products, cart, bonusesProductsModal }) => {
        return {
            bonuses_items: products.bonuses_items,
            userCartBonusProduct: cart.bonusProduct,
            cartProducts: cart.items,
            openBonusesProductsModal:
                bonusesProductsModal.openBonusesProductsModal,
            promocode: cart.promocode,
            productCategories: products.categories,
        };
    }, shallowEqual);
    const {
        CONFIG_free_products_program_status,
        CONFIG_promocode_with_bonus_program,
        CONFIG_bonuses_not_allowed_categories: disabledCategories,
        CONFIG_bonuses_not_allowed_categories_hardmode: bonusesHardmod,
    } = useSelector((state) => {
        return state.config.data;
    }, shallowEqual);

    const [bonusesItemsLocal, setBonusesItemsLocal] = useState(null);

    const allProducts = [].concat.apply(
        [],
        Object.values(cartProducts).map((obj) => obj.items)
    );

    const productsWithoutCategories = allProducts.filter((product) => {
        if (disabledCategories?.length) {
            if (
                product.categories?.some((category) =>
                    disabledCategories.includes(category)
                )
            ) {
                return false;
            }
        }
        return true;
    });

    const bonusesDisabledByCategory =
        bonusesHardmod === "yes" &&
        !!allProducts.find((product) => {
            if (disabledCategories?.length) {
                if (
                    product.categories?.some((category) =>
                        disabledCategories.includes(category)
                    )
                ) {
                    return true;
                }
            }
            return false;
        });

    const disabledCategoriesNames = disabledCategories
        .map((id) => {
            const category = productCategories.find(
                (category) => category.term_id === id
            );
            if (category) {
                return `"${category.name}"`;
            } else {
                return "";
            }
        })
        .filter((el) => el);

    const cartTotalPrice = getTotalPrice(productsWithoutCategories);

    const bonusesDisabled = useMemo(
        () =>
            CONFIG_free_products_program_status !== "on" ||
            !bonuses_items ||
            !bonuses_items.length ||
            (CONFIG_promocode_with_bonus_program !== "on" &&
                promocode &&
                Object.keys(promocode).length > 0),
        [
            promocode,
            bonuses_items,
            CONFIG_free_products_program_status,
            CONFIG_promocode_with_bonus_program,
        ]
    );

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
        if (cartTotalPrice < item.limit) {
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
                            {bonusesDisabledByCategory && (
                                <Alert severity="info" sx={{ my: 2 }}>
                                    Товары из категории:{" "}
                                    {disabledCategoriesNames.join(", ")} нельзя
                                    использовать вместе со шкалой подарков.
                                </Alert>
                            )}
                            {disabledCategories?.length &&
                                !bonusesDisabledByCategory && (
                                    <Alert severity="info" sx={{ my: 2 }}>
                                        Товары из категории:{" "}
                                        {disabledCategoriesNames.join(", ")} не
                                        участвуют в шкале подарков.
                                    </Alert>
                                )}
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
                                                            src={item.img}
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
