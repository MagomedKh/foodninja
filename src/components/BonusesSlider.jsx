import React, { useState, useEffect } from "react";
import { Alert, Collapse, Slider } from "@mui/material";

const BonusesSlider = ({
    maxValue,
    orderBonusesLimit,
    usedBonuses,
    handleChangeUsedBonuses,
}) => {
    const [localValue, setLocalValue] = useState(0);

    useEffect(() => {
        if (localValue !== usedBonuses) {
            setLocalValue(usedBonuses);
        }
    }, [usedBonuses]);

    return (
        <>
            <Slider
                value={localValue}
                onChange={(e, value) => {
                    setLocalValue(value);
                }}
                onChangeCommitted={(e, value) => {
                    if (value > maxValue) {
                        setLocalValue(maxValue);
                        handleChangeUsedBonuses(maxValue);
                    } else {
                        handleChangeUsedBonuses(value);
                    }
                }}
                aria-label="Default"
                valueLabelDisplay="auto"
                min={0}
                max={orderBonusesLimit}
                key={usedBonuses}
                marks={[{ value: maxValue, label: maxValue }]}
                valueLabelFormat={(value) => {
                    if (value > maxValue) {
                        return "Невозможно";
                    }
                    return value;
                }}
                sx={{ mb: "20px" }}
            />
            <div>
                <Collapse
                    in={
                        usedBonuses === maxValue &&
                        maxValue !== orderBonusesLimit
                    }
                >
                    <Alert severity="info" sx={{ mb: 2 }}>
                        Оплатить бонусами можно только сумму сверх минимального
                        заказа
                    </Alert>
                </Collapse>
            </div>
        </>
    );
};

export default BonusesSlider;
