import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import useAccrueBonuses from "../hooks/useAccrueBonuses";
import BootstrapTooltip from "./BootstrapTooltip";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const MiniCartBonuses = () => {
    const useBonusesLimit = useSelector(
        (state) => state.config.data.bonusProgramm.paymentPercent
    );

    const { deliveryAccruedBonuses, selfDeliveryAccruedBonuses } =
        useAccrueBonuses();

    const tooltipAccrueText =
        selfDeliveryAccruedBonuses && deliveryAccruedBonuses ? (
            <div>
                Начислим{" "}
                <span className="main-color">
                    +{selfDeliveryAccruedBonuses}
                </span>{" "}
                за заказ навынос или{" "}
                <span className="main-color">+{deliveryAccruedBonuses}</span> за
                заказ на доставку.
            </div>
        ) : selfDeliveryAccruedBonuses ? (
            <div>
                Начислим{" "}
                <span className="main-color">
                    +{selfDeliveryAccruedBonuses}
                </span>{" "}
                за заказ навынос.
            </div>
        ) : deliveryAccruedBonuses ? (
            <div>
                Начислим{" "}
                <span className="main-color">+{deliveryAccruedBonuses}</span> за
                заказ на доставку.
            </div>
        ) : null;

    return (
        <div className="mini-cart-bonuses">
            <div className="mini-cart-bonuses--title">
                <span>Начиcлим бонусы</span>
                <BootstrapTooltip
                    placement="top"
                    title={
                        <div className="mini-cart-bonuses--tooltip">
                            <div>{tooltipAccrueText}</div>
                            <div>
                                Бонусами можно оплатить до{" "}
                                <span className="main-color">
                                    {useBonusesLimit}%
                                </span>{" "}
                                от общей суммы заказа.
                            </div>
                            <div className="mini-cart-bonuses--tooltip-more">
                                Узнать подробнее
                            </div>
                        </div>
                    }
                >
                    <HelpOutlineIcon />
                </BootstrapTooltip>
            </div>
            <span className="main-color">
                +{deliveryAccruedBonuses || selfDeliveryAccruedBonuses}
            </span>
        </div>
    );
};

export default MiniCartBonuses;
