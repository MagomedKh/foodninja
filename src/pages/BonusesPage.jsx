import React, { useState, useEffect } from "react";
import { Box, Container } from "@mui/material";
import { Footer, Header } from "../components";
import { useSelector } from "react-redux";

const BonusesPage = () => {
    const {
        useBonusesLimit,
        specifiedСategories,
        excludeCategories,
        disableMinPrice,
        allowWithPromocode,
        allowWithBonusProduct,
        allowWithDiscountProducts,
    } = useSelector(
        ({
            config: {
                data: { bonusProgramm },
            },
        }) => {
            return {
                useBonusesLimit: bonusProgramm.paymentPercent,
                specifiedСategories: bonusProgramm.paymentCategories,
                excludeCategories:
                    bonusProgramm.paymentExcludeCategories === "yes",
                allowWithPromocode:
                    bonusProgramm.paymentDisableWithPromocode !== "active",
                allowWithBonusProduct:
                    bonusProgramm.paymentDisableWithBonusProduct !== "active",
                allowWithDiscountProducts:
                    bonusProgramm.paymentDisableWithSaleProduct !== "active",
            };
        }
    );

    const { deliveryCashback, selfDeliveryCashback } = useSelector(
        ({
            config: {
                data: { bonusProgramm },
            },
        }) => {
            return {
                deliveryCashback: bonusProgramm.deliveryPercent,
                selfDeliveryCashback: bonusProgramm.selfDeliveryPercent,
            };
        }
    );

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            <Header />
            <Container sx={{ flexGrow: "1" }}>
                <h1>Бонусная программа</h1>
                <AccrueInfo
                    deliveryCashback={deliveryCashback}
                    selfDeliveryCashback={selfDeliveryCashback}
                />
                <div>
                    Бонусами можно оплатить до{" "}
                    <span className="main-color">{useBonusesLimit}%</span> от
                    общей суммы заказа
                </div>
                <AdditionalAccrueInfo />
            </Container>
            <Footer />
        </Box>
    );
};

export default BonusesPage;

const AccrueInfo = ({ deliveryCashback, selfDeliveryCashback }) => {
    if (deliveryCashback && selfDeliveryCashback) {
        if (deliveryCashback === selfDeliveryCashback) {
            return (
                <div>
                    Возвращаем{" "}
                    <span className="main-color">{deliveryCashback}%</span> от
                    каждого заказа бонусами.
                </div>
            );
        } else {
            return (
                <div>
                    Возвращаем бонусами{" "}
                    <span className="main-color">{deliveryCashback}%</span> от
                    каждого заказа на доставку и{" "}
                    <span className="main-color">{selfDeliveryCashback}%</span>{" "}
                    — от заказа навынос.
                </div>
            );
        }
    } else if (deliveryCashback && !selfDeliveryCashback) {
        return (
            <div>
                Возвращаем бонусами{" "}
                <span className="main-color">{deliveryCashback}%</span> от
                каждого заказа на доставку.
            </div>
        );
    } else if (!deliveryCashback && selfDeliveryCashback) {
        return (
            <div>
                Возвращаем бонусами{" "}
                <span className="main-color">{selfDeliveryCashback}%</span> от
                каждого заказа навынос.
            </div>
        );
    }
    return <div></div>;
};

const AdditionalAccrueInfo = () => {
    const productCategories = useSelector((state) => state.products.categories);
    const {
        specifiedСategories,
        excludeCategories,
        allowWithPromocode,
        allowWithBonusProduct,
        allowWithDiscountProducts,
        allowWithBonuses,
    } = useSelector(
        ({
            config: {
                data: { bonusProgramm },
            },
        }) => {
            return {
                specifiedСategories: bonusProgramm.categories,
                excludeCategories: bonusProgramm.excludeCategories === "yes",
                allowWithPromocode: bonusProgramm.allowPromocode === "active",
                allowWithBonusProduct:
                    bonusProgramm.allowBonusProduct === "active",
                allowWithDiscountProducts:
                    bonusProgramm.allowSaleProduct === "active",
                allowWithBonuses: bonusProgramm.allowWithBonuses === "active",
            };
        }
    );
    if (
        !specifiedСategories.length &&
        allowWithPromocode &&
        allowWithBonusProduct &&
        allowWithDiscountProducts &&
        allowWithBonuses
    ) {
        return null;
    }

    const specifiedСategoriesNames = [];
    if (specifiedСategories.length) {
        specifiedСategories.forEach((specifiedСategoryId) => {
            const category = productCategories.find(
                (productCategory) =>
                    productCategory.term_id === specifiedСategoryId
            );
            if (category) {
                specifiedСategoriesNames.push(`«${category.name}»`);
            }
        });
    }

    return (
        <div>
            <h3>Дополнительные условия начисления бонусов</h3>
            {specifiedСategoriesNames.length ? (
                excludeCategories ? (
                    <div>
                        Бонусы не начисляются на товары следующих категорий:{" "}
                        {specifiedСategoriesNames.join(", ")}.
                    </div>
                ) : (
                    <div>
                        Бонусы начисляются на товары следующих категорий:{" "}
                        {specifiedСategoriesNames.join(", ")}.
                    </div>
                )
            ) : null}
            {!allowWithPromocode ? (
                <div>Бонусы не начисляются с примененным промокодом</div>
            ) : null}
        </div>
    );
};
