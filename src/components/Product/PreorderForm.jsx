import React, { useState, forwardRef } from "react";
import { useSelector } from "react-redux";
import { Box, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import TextField from "@mui/material/TextField";
import ru from "date-fns/locale/ru";
import {
    isToday,
    format,
    compareAsc,
    add,
    addMinutes,
    addHours,
    set,
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

        const [open, setOpen] = useState(false);

        return (
            <Box sx={{ mr: 2, display: "flex" }}>
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={ru}>
                    <DatePicker
                        disablePast
                        label="Выберите дату"
                        disableMaskedInput
                        inputFormat="dd MMM yyyy"
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                inputProps={{
                                    ...params.inputProps,
                                    readOnly: true,
                                    placeholder: "дд.мм.гггг",
                                }}
                                onClick={() => setOpen(true)}
                            />
                        )}
                        PaperProps={{
                            sx: {
                                "& .MuiPickersDay-root": {
                                    "&.Mui-selected": {
                                        backgroundColor: "primary.main",
                                    },
                                },
                            },
                        }}
                        value={preorderDate}
                        onChange={(newDate) => {
                            if (!newDate) {
                                return;
                            }
                            handlePreorderDateChange(newDate);
                        }}
                        open={open}
                        onOpen={() => setOpen(true)}
                        onClose={() => setOpen(false)}
                        shouldDisableDate={(date) => {
                            if (
                                compareAsc(
                                    date,
                                    add(new Date(), { days: 30 })
                                ) == 1
                            ) {
                                return true;
                            }
                        }}
                    />
                </LocalizationProvider>
                <FormControl sx={{ minWidth: 120, ml: 1 }}>
                    <InputLabel id="preorder-time-select-label">
                        Время
                    </InputLabel>
                    <Select
                        label="Время"
                        labelId="preorder-time-select-label"
                        id="preorder-time-select"
                        value={preorderTime ? preorderTime : ""}
                        disabled={!preorderDate}
                        onChange={(e) => {
                            handlePreorderTimeChange(e.target.value);
                        }}
                        autoWidth
                    >
                        {isToday(preorderDate) ? (
                            <MenuItem
                                key={getTime(new Date())}
                                value={getTime(
                                    set(new Date(), {
                                        seconds: 0,
                                        milliseconds: 0,
                                    })
                                )}
                            >
                                Как можно скорее
                            </MenuItem>
                        ) : null}
                        {hoursArray.map((el) => (
                            <MenuItem key={getTime(el)} value={getTime(el)}>
                                {format(el, "k:mm")}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
        );
    }
);

export default PreorderForm;
