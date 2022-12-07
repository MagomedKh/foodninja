import React, { forwardRef } from "react";
import { useSelector } from "react-redux";
import {
    Box,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    FormHelperText,
} from "@mui/material";
import {
    isToday,
    isWithinInterval,
    eachDayOfInterval,
    format,
    compareAsc,
    addMinutes,
    addDays,
    set,
    getDayOfYear,
    getTime,
    getDay,
    roundToNearestMinutes,
    endOfDay,
    getUnixTime,
    fromUnixTime,
} from "date-fns";
import DiscountIcon from "@mui/icons-material/Discount";

const PreorderForm = forwardRef(
    (
        {
            preorderDate,
            preorderTime,
            handlePreorderDateChange,
            handlePreorderTimeChange,
            asSoonAsPosible,
            error,
            helperText,
        },
        ref
    ) => {
        const { promocode } = useSelector((state) => state.cart);

        const { config } = useSelector(({ config }) => {
            return {
                config: config.data,
            };
        });

        // Получаем выбранный пользователем день недели (0 = понедельник)
        const preorderDayOfWeek =
            getDay(preorderDate) === 0 ? 6 : getDay(preorderDate) - 1;

        // Получаем доступное время для заказа в выбранный день
        const preorderOrderingTime = config.orderingTime[preorderDayOfWeek] || [
            config.CONFIG_schedule_ordering_start,
            config.CONFIG_schedule_ordering_end,
        ];

        // Устанавливаем начальное время для заказа в формате даты
        let startWorkDate = set(new Date(), {
            hours: preorderOrderingTime[0].slice(0, 2),
            minutes: preorderOrderingTime[0].slice(3, 5),
            seconds: 0,
            milliseconds: 0,
        });

        // Устанавливаем конечное время для заказа в формате даты
        let endWorkDate = set(new Date(), {
            hours: preorderOrderingTime[1].slice(0, 2),
            minutes: preorderOrderingTime[1].slice(3, 5),
            seconds: 0,
            milliseconds: 0,
        });

        // Если уже выбранное время после смены даты не входит в доступный интервал, сбрасываем время
        if (
            preorderTime &&
            !isWithinInterval(preorderTime, {
                start: startWorkDate,
                end: endWorkDate,
            })
        ) {
            handlePreorderTimeChange("");
        }

        // Если заказ на сегодня, прибавляем к начальному времени минимальную задержку перед заказом
        if (isToday(preorderDate)) {
            startWorkDate = addMinutes(
                new Date(),
                config.CONFIG_time_order_delay
            );
            startWorkDate = roundToNearestMinutes(startWorkDate, {
                nearestTo: 30,
            });
        }

        // Создаем массив доступных времён для заказа в интервале
        const hoursArray = [];
        while (compareAsc(startWorkDate, endWorkDate) < 1) {
            hoursArray.push(startWorkDate);
            startWorkDate = addMinutes(startWorkDate, 30);
        }

        // Проверяем чтобы последнее доступное время не переходило на следующий день
        const endOfTheDay = endOfDay(new Date());
        if (compareAsc(hoursArray.at(-1), endOfTheDay) == 1) {
            hoursArray.pop();
        }

        // Ссоздаем массив недоступных для заказ дней недели
        const unavailableDays = config.orderingTime
            .map((el, inx) => {
                if (!el[0] || !el[1]) {
                    return inx;
                }
            })
            .filter((el) => {
                if (el || el === 0) return true;
            });

        // Создаем массив доступных дней для заказа из ближайших 30
        const datesArray = [];
        let currentDay = new Date();
        const forwardDay = addDays(currentDay, 30);
        while (compareAsc(currentDay, forwardDay) < 1) {
            const currentDayOfWeek =
                getDay(currentDay) === 0 ? 6 : getDay(currentDay) - 1;
            if (!unavailableDays.includes(currentDayOfWeek)) {
                datesArray.push(currentDay);
            }
            currentDay = addDays(currentDay, 1);
        }

        // Ссоздаем массив недоступных для заказ дней недели у действующего промокода
        const unavailablePromocodeDays = promocode.days
            ?.map((el, inx) => {
                if (!el) {
                    return inx;
                }
            })
            .filter((el) => {
                if (el || el === 0) return true;
            });

        return (
            <Box sx={{ display: "flex" }}>
                <FormControl sx={{ minWidth: 120 }} size="small" error={error}>
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
                                sx={{
                                    justifyContent: "center",
                                }}
                            >
                                Как можно скорее
                            </MenuItem>
                        )}

                        {datesArray.map((el) => {
                            // Блокируем дни, недоступные по действующему промокоду
                            const disabled =
                                unavailablePromocodeDays?.includes(
                                    getDay(el) === 0 ? 6 : getDay(el) - 1
                                ) || getUnixTime(el) > promocode.endDate;
                            return (
                                <MenuItem
                                    key={getDayOfYear(el)}
                                    value={getDayOfYear(el)}
                                    sx={{
                                        justifyContent: "center",
                                        flexDirection: "column",
                                    }}
                                    divider
                                    disabled={disabled}
                                >
                                    {format(el, "d MMMM")}
                                    {disabled && (
                                        <div style={{ fontSize: "12px" }}>
                                            Недоступно с промокодом
                                        </div>
                                    )}
                                </MenuItem>
                            );
                        })}
                    </Select>
                    <FormHelperText>{helperText}</FormHelperText>
                </FormControl>

                {!asSoonAsPosible && preorderDate ? (
                    <FormControl
                        sx={{ minWidth: 120, ml: 1 }}
                        size="small"
                        error={error}
                    >
                        <InputLabel id="preorder-time-select-label">
                            Время
                        </InputLabel>
                        <Select
                            label="Время"
                            labelId="preorder-time-select-label"
                            id="preorder-time-select"
                            defaultValue={""}
                            value={preorderTime ? preorderTime : ""}
                            onChange={(e) => {
                                handlePreorderTimeChange(e.target.value);
                            }}
                            autoWidth
                            MenuProps={{
                                PaperProps: { sx: { maxHeight: 500 } },
                            }}
                        >
                            {hoursArray.map((el) => {
                                // Блокируем часы, недоступные по действующему промокоду
                                // const currentUnixTime = getUnixTime(el);

                                // const disabled =
                                //     currentUnixTime > promocode.endTime ||
                                //     currentUnixTime < promocode.startTime;
                                return (
                                    <MenuItem
                                        key={getTime(el)}
                                        value={getTime(el)}
                                        divider
                                        // disabled={disabled}
                                    >
                                        {format(el, "H:mm")}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                ) : null}
            </Box>
        );
    }
);

export default PreorderForm;
