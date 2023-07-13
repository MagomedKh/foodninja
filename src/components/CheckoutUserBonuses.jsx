import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import useAccrueBonuses from "../hooks/useAccrueBonuses";
import useBonuses from "../hooks/useBonuses";
import { Box, CircularProgress } from "@mui/material";
import BonusesSlider from "./BonusesSlider";
import BootstrapTooltip from "./BootstrapTooltip";
import { _declension, _getDomain } from "./helpers";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const CheckoutUserBonuses = ({
    usedBonuses,
    handleChangeUsedBonuses,
    typeDelivery,
    deliveryZone,
    autoDiscountAmount,
}) => {
    const user = useSelector((state) => state.user.user);
    const bonusProgramStatus = useSelector(
        (state) => state.config.data.bonusProgramm.status === "active"
    );

    const [userBonuses, setUserBonuses] = useState(0);
    const [loading, setLoading] = useState(bonusProgramStatus ? false : true);

    const { deliveryAccruedBonuses, selfDeliveryAccruedBonuses } =
        useAccrueBonuses(usedBonuses);

    const {
        useBonusesLimit,
        maxBonuses,
        disabledByPromocode,
        disabledByBonusProduct,
        disabledByDiscountProduct,
        disabledByExcludedCategory,
        disabledByOnlyCategories,
    } = useBonuses({
        userBonuses,
        typeDelivery,
        deliveryZone,
        autoDiscountAmount,
    });

    useEffect(() => {
        if (user) {
            if (bonusProgramStatus) {
                setUserBonuses(user.bonuses ? parseInt(user.bonuses) : 0);
            } else {
                if (user.token && user.phone) {
                    setLoading(true);
                    axios
                        .post(
                            "https://" +
                                _getDomain() +
                                "/?rest-api=getFrontpadBonuses",
                            {
                                token: user.token,
                                phone: user.phone,
                            }
                        )
                        .then((resp) => {
                            if (resp.data.user?.bonuses >= 0) {
                                setUserBonuses(resp.data.user?.bonuses);
                            }
                            setLoading(false);
                        });
                }
            }
        }
    }, [bonusProgramStatus]);

    useEffect(() => {
        if (usedBonuses > maxBonuses) {
            handleChangeUsedBonuses(maxBonuses);
        }
    }, [maxBonuses]);

    return (
        <div className="checkout--user-bonuses">
            <div className="checkout--bonuses-payming">
                <div className="checkout--payming-bonuses-info">
                    <span className="title">Оплата бонусами</span>
                    <BootstrapTooltip
                        placement="top"
                        title={
                            <Box sx={{ fontSize: "13px", m: "6px" }}>
                                <Box className="main-color" sx={{ mb: "6px" }}>
                                    Бонусная программа!
                                </Box>
                                {bonusProgramStatus ? (
                                    <Box sx={{ mb: "6px" }}>
                                        <div>Начислим кешбэк:</div>
                                        <div>
                                            <span className="main-color">
                                                +{deliveryAccruedBonuses}
                                            </span>{" "}
                                            за заказ на доставку
                                        </div>
                                        <div>
                                            <span className="main-color">
                                                +{selfDeliveryAccruedBonuses}
                                            </span>{" "}
                                            за заказ навынос
                                        </div>
                                    </Box>
                                ) : null}
                                <Box sx={{ mb: "6px" }}>
                                    Бонусами можно оплатить до{" "}
                                    <span className="main-color">
                                        {useBonusesLimit}%
                                    </span>{" "}
                                    от суммы заказа!
                                </Box>
                                {bonusProgramStatus ? (
                                    <a href="#">Подробнее о бонусах</a>
                                ) : null}
                            </Box>
                        }
                    >
                        <InfoOutlinedIcon className="checkout--info-icon" />
                    </BootstrapTooltip>
                </div>
                {loading ? (
                    <CircularProgress size={20} />
                ) : (
                    <span className="bonuses-price">
                        <span className="money">
                            {usedBonuses.toLocaleString("ru-RU")}
                        </span>{" "}
                        &#8381;
                    </span>
                )}
            </div>

            <BonusesSlider
                disabled={
                    disabledByPromocode ||
                    disabledByBonusProduct ||
                    disabledByDiscountProduct ||
                    disabledByExcludedCategory ||
                    disabledByOnlyCategories ||
                    maxBonuses === 0
                }
                maxValue={maxBonuses}
                handleChangeUsedBonuses={handleChangeUsedBonuses}
                usedBonuses={usedBonuses}
            />
        </div>
    );
};

export default CheckoutUserBonuses;
