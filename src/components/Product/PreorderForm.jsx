import React, { useState, forwardRef } from "react";
import { useSelector } from "react-redux";
import { Box, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import TextField from "@mui/material/TextField";
import ru from "date-fns/locale/ru";
import {
    isToday,
    eachDayOfInterval,
    format,
    compareAsc,
    add,
    addMinutes,
    addHours,
    addDays,
    set,
    getDayOfYear,
    getHours,
    getMinutes,
    getTime,
    roundToNearestMinutes,
} from "date-fns";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const PreorderForm = forwardRef(
    ({
        preorderDate,
        preorderTime,
        handlePreorderDateChange,
        handlePreorderTimeChange,
        asSoonAsPosible,
    }) => {
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

        const [open, setOpen] = useState(false);

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
                        <MenuItem
                            key={"Как можно скорее"}
                            value={"Как можно скорее"}
                            divider
                        >
                            Как можно скорее
                        </MenuItem>

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
