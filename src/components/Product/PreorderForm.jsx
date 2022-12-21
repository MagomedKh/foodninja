import React, { forwardRef, useEffect } from "react";
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
    isBefore,
    isAfter,
    eachDayOfInterval,
} from "date-fns";

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

        // Массив локализованных дней недели для рендера
        const localDaysOfWeek = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];
        // Получаем доступное время для заказа в выбранный день
        const preorderOrderingTime = config.orderingTime[preorderDayOfWeek] || [
            config.CONFIG_schedule_ordering_start,
            config.CONFIG_schedule_ordering_end,
        ];

        // Блок для проверки рендера опций "Как можно скорее" и сегодняшней даты
        // Получаем сегодняшний день недели
        const todayDayOfWeek =
            getDay(new Date()) === 0 ? 6 : getDay(new Date()) - 1;
        //Получаем доступное время для заказа на сегодня
        const todayOrderingTime = config.orderingTime[todayDayOfWeek] || [
            config.CONFIG_schedule_ordering_start,
            config.CONFIG_schedule_ordering_end,
        ];
        // Устанавливаем конечное время для заказа сегодня
        let todayEndWorkTime = set(new Date(), {
            hours: todayOrderingTime[1].slice(0, 2),
            minutes: todayOrderingTime[1].slice(3, 5),
            seconds: 0,
            milliseconds: 0,
        });
        useEffect(() => {
            if (
                config.CONFIG_work_status !== "closed" &&
                !isAfter(new Date(), todayEndWorkTime)
            ) {
                handlePreorderDateChange("Как можно скорее");
            }
        }, [config.CONFIG_work_status]);

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

        // Если заказ на сегодня и текущее время больше начального, передвигаем начальное время
        if (isToday(preorderDate)) {
            if (isAfter(new Date(), startWorkDate)) {
                startWorkDate = new Date();
                startWorkDate = roundToNearestMinutes(startWorkDate, {
                    nearestTo: 30,
                    roundingMethod: "ceil",
                });
            }
        }

        // Если заказ на сегодня и текущее время + задержка больше начального, передвигаем начальное время
        if (isToday(preorderDate) && config.CONFIG_time_order_delay) {
            if (
                isAfter(
                    addMinutes(new Date(), config.CONFIG_time_order_delay),
                    startWorkDate
                )
            ) {
                startWorkDate = addMinutes(
                    new Date(),
                    config.CONFIG_time_order_delay
                );
                startWorkDate = roundToNearestMinutes(startWorkDate, {
                    nearestTo: 30,
                    roundingMethod: "ceil",
                });
            }
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
            ?.map((el, inx) => {
                if (!el[0] || !el[1]) {
                    return inx;
                }
            })
            .filter((el) => {
                if (el || el === 0) return true;
            });

        // Создаем массив доступных дней для заказа из ближайших 30
        const datesArray = eachDayOfInterval({
            start:
                isAfter(
                    addMinutes(new Date(), config.CONFIG_time_order_delay),
                    todayEndWorkTime
                ) || !hoursArray.length
                    ? addDays(new Date(), 1)
                    : new Date(),
            end: addDays(new Date(), 30),
        });

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
                        {config.CONFIG_work_status === "closed" ||
                        isAfter(new Date(), todayEndWorkTime) ? null : (
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
                            const disabledByPromocode =
                                unavailablePromocodeDays?.includes(
                                    getDay(el) === 0 ? 6 : getDay(el) - 1
                                ) || getUnixTime(el) > promocode.endDate;

                            // Блокируем выходные дни
                            const currentDayOfWeek =
                                getDay(el) === 0 ? 6 : getDay(el) - 1;
                            const disabledBySchedule =
                                unavailableDays?.includes(currentDayOfWeek);
                            return (
                                <MenuItem
                                    key={getDayOfYear(el)}
                                    value={getDayOfYear(el)}
                                    sx={{
                                        justifyContent: "center",
                                        flexDirection: "column",
                                    }}
                                    divider
                                    disabled={
                                        disabledByPromocode ||
                                        disabledBySchedule
                                    }
                                >
                                    <span>
                                        {format(el, "d MMMM")}
                                        {", "}
                                        {localDaysOfWeek[currentDayOfWeek]}
                                    </span>
                                    {(disabledBySchedule && (
                                        <div
                                            style={{
                                                fontSize: "12px",
                                                lineHeight: "1",
                                            }}
                                        >
                                            Нерабочий день
                                        </div>
                                    )) ||
                                        (disabledByPromocode && (
                                            <div
                                                style={{
                                                    fontSize: "12px",
                                                    lineHeight: "1",
                                                }}
                                            >
                                                Недоступно с промокодом
                                            </div>
                                        ))}
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
                                let disabled = false;
                                if (
                                    promocode &&
                                    promocode.endTime &&
                                    promocode.startTime
                                ) {
                                    const promocodeStartTime = set(new Date(), {
                                        hours: parseInt(
                                            promocode.startTime.slice(0, 2)
                                        ),
                                        minutes: parseInt(
                                            promocode.startTime.slice(3)
                                        ),
                                        seconds: 0,
                                        milliseconds: 0,
                                    });
                                    const promocodeEndTime = set(new Date(), {
                                        hours: parseInt(
                                            promocode.endTime.slice(0, 2)
                                        ),
                                        minutes: parseInt(
                                            promocode.endTime.slice(3)
                                        ),
                                        seconds: 0,
                                        milliseconds: 0,
                                    });
                                    if (
                                        isBefore(el, promocodeStartTime) ||
                                        isAfter(el, promocodeEndTime)
                                    ) {
                                        disabled = true;
                                    }
                                }
                                return (
                                    <MenuItem
                                        key={getTime(el)}
                                        value={getTime(el)}
                                        divider
                                        disabled={disabled}
                                        sx={{
                                            justifyContent: "center",
                                            flexDirection: "column",
                                        }}
                                    >
                                        {format(el, "H:mm")}
                                        {disabled && (
                                            <div
                                                style={{
                                                    fontSize: "12px",
                                                    lineHeight: "1",
                                                }}
                                            >
                                                Недоступно с промокодом
                                            </div>
                                        )}
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
