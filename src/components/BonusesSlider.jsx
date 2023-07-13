import React, { useState, useEffect } from "react";
import { Alert, Box, Collapse, Slider, Stack } from "@mui/material";

const BonusesSlider = ({
    maxValue,
    usedBonuses,
    handleChangeUsedBonuses,
    disabled,
}) => {
    const [localValue, setLocalValue] = useState(0);

    useEffect(() => {
        if (localValue !== usedBonuses) {
            setLocalValue(usedBonuses);
        }
    }, [usedBonuses]);

    return (
        <>
            <Stack
                spacing={2}
                direction="row"
                alignItems="center"
                sx={{ mb: "10px" }}
            >
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
                    max={maxValue}
                    disabled={disabled}
                    key={usedBonuses}
                    sx={{
                        "& .MuiSlider-valueLabel": {
                            bgcolor: "#000",
                        },
                    }}
                />
                {maxValue ? (
                    <Box sx={{ color: "rgba(0, 0, 0, 0.6)" }}>{maxValue}</Box>
                ) : null}
            </Stack>
        </>
    );
};

export default BonusesSlider;
