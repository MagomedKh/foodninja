import React, { forwardRef, useEffect, useMemo } from "react";
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
    getHours,
    getMinutes,
    isEqual,
    startOfDay,
} from "date-fns";
import useWorkingStatus from "../../hooks/useWorkingStatus";

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
        const {
            workingStatus,
            maintenanceStatus,
            maintenanceDateStart,
            maintenanceDateEnd,
        } = useWorkingStatus();

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

        // Если конец сегодняшнего дня переходит на след. день, конец дня устанавливается в 23:59
        const isTodayWorkAfterMidnight =
            parseInt(todayOrderingTime[0].slice(0, 2)) >=
            parseInt(todayOrderingTime[1].slice(0, 2));

        // Устанавливаем конечное время для заказа сегодня
        let todayEndWorkTime = set(new Date(), {
            hours: isTodayWorkAfterMidnight
                ? 23
                : todayOrderingTime[1].slice(0, 2),
            minutes: isTodayWorkAfterMidnight
                ? 59
                : todayOrderingTime[1].slice(3, 5),
            seconds: 0,
            milliseconds: 0,
        });

        useEffect(() => {
            if (
                workingStatus &&
                maintenanceStatus &&
                !isAfter(new Date(), todayEndWorkTime)
            ) {
                handlePreorderDateChange("Как можно скорее");
            }
        }, [workingStatus, maintenanceStatus]);

        // Устанавливаем начальное время для заказа в формате даты
        let startWorkDate = set(new Date(), {
            hours: preorderOrderingTime[0].slice(0, 2),
            minutes: preorderOrderingTime[0].slice(3, 5),
            seconds: 0,
            milliseconds: 0,
        });

        // Если конец дня предзаказа переходит на след. день, конец дня устанавливается в 23:59
        const isPreorderWorkAfterMidnight =
            parseInt(preorderOrderingTime[0].slice(0, 2)) >=
            parseInt(preorderOrderingTime[1].slice(0, 2));

        // Устанавливаем конечное время для заказа в формате даты
        let endWorkDate = set(new Date(), {
            hours: isPreorderWorkAfterMidnight
                ? 23
                : preorderOrderingTime[1].slice(0, 2),
            minutes: isPreorderWorkAfterMidnight
                ? 59
                : preorderOrderingTime[1].slice(3, 5),
            seconds: 0,
            milliseconds: 0,
        });

        // Если конец прошлого дня переходит на сегодняшний, учитываем это время
        const dayBeforeDayOfWeek =
            preorderDayOfWeek === 0 ? 6 : preorderDayOfWeek - 1;

        // Получаем доступное время для заказа в предыдущий перед выбранным днем
        const dayBeforeOrderingTime = config.orderingTime[
            dayBeforeDayOfWeek
        ] || [
            config.CONFIG_schedule_ordering_start,
            config.CONFIG_schedule_ordering_end,
        ];

        const isDayBeforeWorkAfterMidnight =
            parseInt(dayBeforeOrderingTime[0].slice(0, 2)) >=
            parseInt(dayBeforeOrderingTime[1].slice(0, 2));

        const dayBeforeAfterMidnightEndWorkTime = set(new Date(), {
            hours: dayBeforeOrderingTime[1].slice(0, 2),
            minutes: dayBeforeOrderingTime[1].slice(3, 5),
            seconds: 0,
            milliseconds: 0,
        });

        // Если уже выбранное время после смены даты не входит в доступный интервал, сбрасываем время
        if (preorderTime) {
            if (
                !isWithinInterval(preorderTime, {
                    start: isToday(preorderDate) ? new Date() : startWorkDate,
                    end: endWorkDate,
                })
            ) {
                if (!isDayBeforeWorkAfterMidnight) {
                    handlePreorderTimeChange("");
                } else if (
                    !isWithinInterval(preorderTime, {
                        start: startOfDay(new Date()),
                        end: dayBeforeAfterMidnightEndWorkTime,
                    })
                ) {
                    handlePreorderTimeChange("");
                }
            }
        }

        // Если заказ на сегодня, устанавливаем начальное время от текущего времени
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

        // Создаем массив доступных времён для заказа
        const hoursArray = [];

        // Добавляем в массив время работы вчерашнего дня после полуночи
        if (isDayBeforeWorkAfterMidnight) {
            let tempDate;

            // Если выбран сегодняшний день, добавляем часы в промежутке от текущего времени до конца вчерашнего рабочего дня
            if (isToday(preorderDate)) {
                tempDate = new Date();
                if (config.CONFIG_time_order_delay) {
                    tempDate = addMinutes(
                        new Date(),
                        config.CONFIG_time_order_delay
                    );
                }
                tempDate = roundToNearestMinutes(tempDate, {
                    nearestTo: 30,
                    roundingMethod: "ceil",
                });
            }
            // Если выбран не сегодняшний день, добавляем часы в промежутке от полуночи до конца вчерашнего рабочего дня
            else {
                tempDate = startOfDay(new Date());
            }

            while (
                compareAsc(tempDate, dayBeforeAfterMidnightEndWorkTime) < 1
            ) {
                hoursArray.push(tempDate);
                tempDate = addMinutes(tempDate, 30);
            }
        }

        // Добавляем в массив сегодняшнее время работы
        if (preorderOrderingTime[0] && preorderOrderingTime[1]) {
            while (compareAsc(startWorkDate, endWorkDate) < 1) {
                hoursArray.push(startWorkDate);
                startWorkDate = addMinutes(startWorkDate, 30);
            }
        }

        // Проверяем чтобы последнее доступное время не переходило на следующий день
        if (
            compareAsc(
                hoursArray[hoursArray.length - 1],
                endOfDay(new Date())
            ) == 1
        ) {
            hoursArray.pop();
        }

        // Создаем массив недоступных для заказа дней недели, проверкой есть ли в этот день доступное время
        const unavailableDays = config.orderingTime
            ?.map((el, inx) => {
                // Добавляем к промежутку доступного времени, время работы вчерашнего дня после полуночи
                const dayBeforeDayOfWeek = inx === 0 ? 6 : inx - 1;

                const dayBeforeOrderingTime = config.orderingTime[
                    dayBeforeDayOfWeek
                ] || [
                    config.CONFIG_schedule_ordering_start,
                    config.CONFIG_schedule_ordering_end,
                ];

                const isDayBeforeWorkAfterMidnight =
                    parseInt(dayBeforeOrderingTime[0].slice(0, 2)) >=
                    parseInt(dayBeforeOrderingTime[1].slice(0, 2));

                if ((!el[0] || !el[1]) && !isDayBeforeWorkAfterMidnight) {
                    return inx;
                }
            })
            .filter((el) => {
                if (el || el === 0) return true;
            });

        // Создаем массив доступных дней для заказа из ближайших 30
        // Добавляем к промежутку доступного времени, время работы вчерашнего дня после полуночи
        const yesterdayDayOfWeek =
            todayDayOfWeek === 0 ? 6 : todayDayOfWeek - 1;

        const yesterdayOrderingTime = config.orderingTime[
            yesterdayDayOfWeek
        ] || [
            config.CONFIG_schedule_ordering_start,
            config.CONFIG_schedule_ordering_end,
        ];

        const isYesterdayWorkAfterMidnight =
            parseInt(yesterdayOrderingTime[0].slice(0, 2)) >=
            parseInt(yesterdayOrderingTime[1].slice(0, 2));

        const yesterdayAfterMidnightEndWorkTime = set(new Date(), {
            hours: yesterdayOrderingTime[1].slice(0, 2),
            minutes: yesterdayOrderingTime[1].slice(3, 5),
            seconds: 0,
            milliseconds: 0,
        });

        const datesArray = eachDayOfInterval({
            start:
                // Определяем, нужно ли добавлять в массив сегодняшний день
                isBefore(
                    addMinutes(new Date(), config.CONFIG_time_order_delay),
                    todayEndWorkTime
                ) ||
                (isYesterdayWorkAfterMidnight &&
                    isBefore(
                        addMinutes(new Date(), config.CONFIG_time_order_delay),
                        yesterdayAfterMidnightEndWorkTime
                    ))
                    ? new Date()
                    : addDays(new Date(), 1),
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
                        sx={{
                            bgcolor: "#fff",
                        }}
                    >
                        {!workingStatus ||
                        !maintenanceStatus ||
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
                                ) ||
                                (promocode.endDate &&
                                    getUnixTime(el) > promocode.endDate);

                            // Блокируем выходные дни
                            const currentDayOfWeek =
                                getDay(el) === 0 ? 6 : getDay(el) - 1;
                            const disabledBySchedule =
                                unavailableDays?.includes(currentDayOfWeek);

                            // Блокируем дни закрытия сайта
                            const disabledByMaintenance =
                                (isAfter(el, maintenanceDateStart) ||
                                    isEqual(el, maintenanceDateStart)) &&
                                isBefore(
                                    set(el, { hours: 23, minutes: 50 }),
                                    maintenanceDateEnd
                                );

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
                                        disabledBySchedule ||
                                        disabledByMaintenance
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
                            sx={{
                                bgcolor: "#fff",
                            }}
                        >
                            {hoursArray.map((el) => {
                                // Блокируем часы, недоступные по действующему промокоду
                                let disabledByPromocode = false;
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
                                        disabledByPromocode = true;
                                    }
                                }

                                // Блокируем часы закрытия сайта
                                let disabledByMaintenance = false;

                                if (
                                    getDayOfYear(preorderDate) ===
                                        getDayOfYear(maintenanceDateStart) &&
                                    getDayOfYear(preorderDate) ===
                                        getDayOfYear(maintenanceDateEnd)
                                ) {
                                    const maintenanceStartTime = set(
                                        new Date(),
                                        {
                                            hours: getHours(
                                                maintenanceDateStart
                                            ),
                                            minutes:
                                                getMinutes(
                                                    maintenanceDateStart
                                                ),
                                            seconds: 0,
                                            milliseconds: 0,
                                        }
                                    );
                                    const maintenanceEndTime = set(new Date(), {
                                        hours: getHours(maintenanceDateEnd),
                                        minutes: getMinutes(maintenanceDateEnd),
                                        seconds: 0,
                                        milliseconds: 0,
                                    });
                                    try {
                                        if (
                                            isWithinInterval(el, {
                                                start: maintenanceStartTime,
                                                end: maintenanceEndTime,
                                            })
                                        ) {
                                            disabledByMaintenance = true;
                                        }
                                    } catch (error) {
                                        console.log(
                                            `${error.message}, Something wrong in maintenance interval`
                                        );
                                    }
                                } else if (
                                    getDayOfYear(preorderDate) ===
                                    getDayOfYear(maintenanceDateStart)
                                ) {
                                    const maintenanceStartTime = set(
                                        new Date(),
                                        {
                                            hours: getHours(
                                                maintenanceDateStart
                                            ),
                                            minutes:
                                                getMinutes(
                                                    maintenanceDateStart
                                                ),
                                            seconds: 0,
                                            milliseconds: 0,
                                        }
                                    );
                                    if (isAfter(el, maintenanceStartTime)) {
                                        disabledByMaintenance = true;
                                    }
                                } else if (
                                    getDayOfYear(preorderDate) ===
                                    getDayOfYear(maintenanceDateEnd)
                                ) {
                                    const maintenanceEndTime = set(new Date(), {
                                        hours: getHours(maintenanceDateEnd),
                                        minutes: getMinutes(maintenanceDateEnd),
                                        seconds: 0,
                                        milliseconds: 0,
                                    });
                                    if (isBefore(el, maintenanceEndTime)) {
                                        disabledByMaintenance = true;
                                    }
                                }
                                return (
                                    <MenuItem
                                        key={getTime(el)}
                                        value={getTime(el)}
                                        divider
                                        disabled={
                                            disabledByPromocode ||
                                            disabledByMaintenance
                                        }
                                        sx={{
                                            justifyContent: "center",
                                            flexDirection: "column",
                                        }}
                                    >
                                        {format(el, "H:mm")}
                                        {disabledByPromocode && (
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
