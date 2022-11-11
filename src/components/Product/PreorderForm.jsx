import React, { forwardRef } from "react";
import { useSelector } from "react-redux";
import { Box, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import {
    isToday,
    eachDayOfInterval,
    format,
    compareAsc,
    addMinutes,
    addDays,
    set,
    getDayOfYear,
    getTime,
    roundToNearestMinutes,
} from "date-fns";

const PreorderForm = forwardRef(
    (
        {
            preorderDate,
            preorderTime,
            handlePreorderDateChange,
            handlePreorderTimeChange,
            asSoonAsPosible,
        },
        ref
    ) => {
        const { config } = useSelector(({ config }) => {
            return {
                config: config.data,
            };
        });

        let startWorkDate = set(new Date(), {
            hours: config.CONFIG_schedule_ordering_start.slice(0, 2),
            minutes: config.CONFIG_schedule_ordering_start.slice(3, 5),
            seconds: 0,
            milliseconds: 0,
        });
        let endWorkDate = set(new Date(), {
            hours: config.CONFIG_schedule_ordering_end.slice(0, 2),
            minutes: config.CONFIG_schedule_ordering_end.slice(3, 5),
            seconds: 0,
            milliseconds: 0,
        });

        if (isToday(preorderDate)) {
            startWorkDate = addMinutes(
                new Date(),
                config.CONFIG_time_order_delay
            );
            startWorkDate = roundToNearestMinutes(startWorkDate, {
                nearestTo: 30,
            });
        }

        const hoursArray = [];

        while (compareAsc(startWorkDate, endWorkDate) < 1) {
            hoursArray.push(startWorkDate);
            startWorkDate = addMinutes(startWorkDate, 30);
        }

        const datesArray = eachDayOfInterval({
            start: new Date(),
            end: addDays(new Date(), 30),
        });

        return (
            <Box sx={{ display: "flex" }}>
                <FormControl sx={{ minWidth: 120 }} size="small">
                    <InputLabel id="preorder-date-select-label">
                        Дата
                    </InputLabel>
                    <Select
                        label="Дата"
                        labelId="preorder-date-select-label"
                        id="preorder-date-select"
                        value={
                            asSoonAsPosible
                                ? asSoonAsPosible
                                : preorderDate
                                ? getDayOfYear(preorderDate)
                                : ""
                        }
                        onChange={(e) => {
                            handlePreorderDateChange(e.target.value);
                        }}
                        autoWidth
                        MenuProps={{ PaperProps: { sx: { maxHeight: 500 } } }}
                    >
                        {config.CONFIG_work_status === "closed" ? null : (
                            <MenuItem
                                key={"Как можно скорее"}
                                value={"Как можно скорее"}
                                divider
                            >
                                Как можно скорее
                            </MenuItem>
                        )}

                        {datesArray.map((el) => (
                            <MenuItem
                                key={getDayOfYear(el)}
                                value={getDayOfYear(el)}
                                sx={{ justifyContent: "center" }}
                                divider
                            >
                                {format(el, "d MMMM")}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {!asSoonAsPosible && preorderDate ? (
                    <FormControl sx={{ minWidth: 120, ml: 1 }} size="small">
                        <InputLabel id="preorder-time-select-label">
                            Время
                        </InputLabel>
                        <Select
                            label="Время"
                            labelId="preorder-time-select-label"
                            id="preorder-time-select"
                            value={preorderTime ? preorderTime : ""}
                            onChange={(e) => {
                                handlePreorderTimeChange(e.target.value);
                            }}
                            autoWidth
                            MenuProps={{
                                PaperProps: { sx: { maxHeight: 500 } },
                            }}
                        >
                            {hoursArray.map((el) => (
                                <MenuItem
                                    key={getTime(el)}
                                    value={getTime(el)}
                                    divider
                                >
                                    {format(el, "k:mm")}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                ) : null}
            </Box>
        );
    }
);

export default PreorderForm;
