import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
    getDay,
    getHours,
    getTime,
    isAfter,
    isBefore,
    isWithinInterval,
    set,
    startOfDay,
} from "date-fns";

export const _declension = (value, words) => {
    value = Math.abs(value) % 100;
    var num = value % 10;
    if (value > 10 && value < 20) return words[2];
    if (num > 1 && num < 5) return words[1];
    if (num === 1) return words[0];
    return words[2];
};

export const _isMobile = () => {
    return window.innerWidth < 900 ? true : false;
};

export const _getDomain = () => {
    return window.location.hostname === "localhost" ||
        window.location.hostname === "192.168.2.48"
        ? "dev.foodninja.pro"
        : window.location.hostname;
};

export const _getPlatform = () => {
    return window.currentPlatform !== undefined
        ? window.currentPlatform
        : "site";
};

export const _getMobileType = () => {
    return window.mobileType !== undefined ? window.mobileType : "android";
};

export const _clone = (object) => {
    if (typeof object != "object") {
        return object;
    }
    if (!object) {
        return object;
    }
    var r = object instanceof Array ? [] : {};
    for (var i in object) {
        if (object.hasOwnProperty(i)) {
            r[i] = _clone(object[i]);
        }
    }
    return r;
};

export const _checkPromocode = ({
    promocode,
    items,
    cartTotal,
    config,
    typeDelivery,
    isInitial,
    categories,
}) => {
    if (Object.keys(promocode).length) {
        let status;
        let alert;
        let errors = [];

        //Проверка на отключенные промокоды
        if (config?.CONFIG_disable_promocodes === "on") {
            status = "error";
            alert = "Промокод отменен";
        }

        // Текущее время
        const currentTime = parseInt(new Date().getTime() / 1000);

        // Проверка даты
        if (
            (promocode.startDate && promocode.startDate > currentTime) ||
            (promocode.endDate && currentTime > promocode.endDate)
        ) {
            status = "error";
            alert = "Промокод отменен, т.к. время действия истекло.";
            errors.push({
                code: "expired",
                message: "Время действия промокода истекло",
            });
        }

        // Проверка дня рождения

        if (
            promocode.type === "birthday" &&
            promocode.birthdayDayLimitBefore &&
            promocode.birthdayDayLimitAfter
        ) {
            const currentDate = new Date();
            const backDate = new Date(currentTime);
            backDate.setDate(
                currentDate.getDate() - promocode.birthdayDayLimitBefore
            );
            const futureDate = new Date(currentTime);
            futureDate.setDate(
                currentDate.getDate() + promocode.birthdayDayLimitAfter
            );
            if (
                currentTime > futureDate.getTime() ||
                currentTime < backDate.getTime()
            ) {
                status = "error";
                alert = `Промокод отменен, т.к. действует только ${promocode.birthdayDayLimitBefore} день до и ${promocode.birthdayDayLimitAfter} день после дня рождения.`;
                errors.push({
                    code: "birthday",
                    message: `Промокод действует только ${promocode.birthdayDayLimitBefore} день до и ${promocode.birthdayDayLimitAfter} день после дня рождения.`,
                });
            }
        }

        // Проверка времени
        if (promocode.startTime && promocode.endTime) {
            const isTimeAfterMidnight =
                parseInt(promocode.startTime.slice(0, 2)) >
                parseInt(promocode.endTime.slice(0, 2));

            const promocodeStartTime = set(new Date(), {
                hours: parseInt(promocode.startTime.slice(0, 2)),
                minutes: parseInt(promocode.startTime.slice(3)),
                seconds: 0,
                milliseconds: 0,
            });
            const promocodeEndTime = set(new Date(), {
                hours: isTimeAfterMidnight
                    ? 23
                    : parseInt(promocode.endTime.slice(0, 2)),
                minutes: isTimeAfterMidnight
                    ? 59
                    : parseInt(promocode.endTime.slice(3)),
                seconds: 0,
                milliseconds: 0,
            });

            const promocodeAfterMidnightEndTime = set(new Date(), {
                hours: parseInt(promocode.endTime.slice(0, 2)),
                minutes: parseInt(promocode.endTime.slice(3)),
                seconds: 0,
                milliseconds: 0,
            });

            const isWithinPromocodeTime = () => {
                try {
                    return isWithinInterval(new Date(), {
                        start: promocodeStartTime,
                        end: promocodeEndTime,
                    });
                } catch (error) {
                    console.log(
                        `${error.message}, Something wrong in promocode time interval`
                    );
                    return false;
                }
            };

            const isWithinAfterMidnightTime = () => {
                try {
                    return isWithinInterval(new Date(), {
                        start: startOfDay(new Date()),
                        end: promocodeAfterMidnightEndTime,
                    });
                } catch (error) {
                    console.log(
                        `${error.message}, Something wrong in promocode after midnight interval`
                    );
                    return false;
                }
            };

            const timeStatus =
                isWithinPromocodeTime() ||
                (isTimeAfterMidnight && isWithinAfterMidnightTime());

            if (!timeStatus) {
                status = "error";
                alert = "Промокод отменен, т.к. в текущее время не действует.";
                errors.push({
                    code: "time",
                    message: `Промокод действует с ${promocode.startTime} до ${promocode.endTime}`,
                });
            }
        }
        // Проверка дней недели

        if (promocode.days && promocode.days.length === 7) {
            const todayDayOfWeek =
                getDay(new Date()) === 0 ? 6 : getDay(new Date()) - 1;
            const isPromocodeAvailable = promocode.days[todayDayOfWeek] === 1;
            if (!isPromocodeAvailable) {
                status = "error";
                alert = "Промокод отменен, т.к. не действует сегодня";
                errors.push({
                    code: "days",
                    message: "Промокод не действует сегодня",
                });
            }
        }

        // Проверка типа доставки
        if (typeDelivery) {
            if (
                promocode.typeDelivery === "delivery" &&
                typeDelivery !== "delivery"
            ) {
                status = "error";
                alert = "Промокод отменен, т.к. действует только на доставку.";
                errors.push({
                    code: "delivery",
                    message: "Промокод действует только на доставку.",
                });
            }
            if (promocode.typeDelivery === "self" && typeDelivery !== "self") {
                status = "error";
                alert =
                    "Промокод отменен, т.к. действует только при самовывозе.";
                errors.push({
                    code: "selfDelivery",
                    message: "Промокод действует только при самовывозе.",
                });
            }
        }

        // Проверка платформы
        // if (promocode.platform) {
        //     const currentPlatform = _getPlatform();
        //     if (promocode.platform[currentPlatform] !== "on")
        //         return {
        //             status: "error",
        //             message:
        //                 "Промокод отменен, т.к. не действует на данной платформе.",
        //         };
        // }

        // Проверка категорий

        if (
            promocode.categories?.length &&
            promocode.categories_hardmode === "yes"
        ) {
            // Исключение категорий
            if (promocode.excludeCategories) {
                let hasExcludeCategory = false;
                Object.values(items).forEach((product) => {
                    if (
                        product["items"][0].id ==
                        promocode.promocodeProducts?.id
                    ) {
                        return;
                    }
                    const inCategories = product["items"][0].categories.filter(
                        (item) => promocode.categories.includes(item)
                    );
                    if (inCategories.length) hasExcludeCategory = true;
                });

                if (hasExcludeCategory) {
                    if (categories) {
                        const categoryNames = promocode.categories
                            ?.map((id) => {
                                const category = categories?.find(
                                    (category) => category.term_id === id
                                );
                                if (category) {
                                    return `«${category.name}»`;
                                }
                            })
                            .filter((el) => el);
                        errors.push({
                            code: "excludeCategory",
                            message: `Промокод не действует с товарами из категорий: ${categoryNames?.join(
                                ", "
                            )}`,
                        });
                    } else {
                        errors.push({
                            code: "excludeCategory",
                            message: `Промокод действует с другими товарами.`,
                        });
                    }

                    status = "error";
                    alert =
                        "Промокод отменен, т.к. не действует с выбранными товарами.";
                }
            }

            // Только указанные категории
            if (
                !promocode.excludeCategories &&
                promocode.categories_hardmode === "yes"
            ) {
                let notInCategory = false;
                Object.values(items).forEach((product) => {
                    if (
                        product["items"][0].id ==
                        promocode.promocodeProducts?.id
                    ) {
                        return;
                    }
                    const inCategories = product["items"][0].categories.filter(
                        (item) => promocode.categories.includes(item)
                    );
                    if (!inCategories.length) notInCategory = true;
                });

                if (notInCategory) {
                    if (categories) {
                        const categoryNames = promocode.categories
                            ?.map((id) => {
                                const category = categories?.find(
                                    (category) => category.term_id === id
                                );
                                if (category) {
                                    return `«${category.name}»`;
                                }
                            })
                            .filter((el) => el);
                        errors.push({
                            code: "onlyCategories",
                            message: `Промокод действует только с товарами из категорий: ${categoryNames?.join(
                                ", "
                            )}`,
                        });
                    } else {
                        errors.push({
                            code: "onlyCategories",
                            message: `Промокод действует с другими товарами.`,
                        });
                    }
                    status = "error";
                    alert =
                        "Промокод отменен, т.к. действует с другими товарами.";
                }
            }
        }

        let hasProduct = false;
        if (promocode.type === "fixed_product" && !isInitial) {
            Object.values(items).forEach((productsArray) => {
                productsArray["items"].forEach((product) => {
                    if (promocode.promocodeProducts.type === "variations") {
                        if (
                            product.type === "variations" &&
                            product.variant.variant_id ==
                                promocode.promocodeProducts.variant
                                    .variant_id &&
                            (product.options._promocode_price ||
                                product.options._promocode_price == 0)
                        )
                            hasProduct = true;
                    } else if (promocode.promocodeProducts.id === product.id) {
                        hasProduct = true;
                    }
                });
            });
            if (!hasProduct) {
                status = "error";
                alert = "Промокод отменен, т.к. нет нужного товара.";
                errors.push({
                    code: "notInCart",
                    message: `Товар по промокоду: «${promocode.promocodeProducts?.title}», отсутствует в корзине`,
                });
            }
        }

        // Проверка товаров по скидке
        if (
            promocode.excludeSaleProduct &&
            promocode.categories_hardmode === "yes"
        ) {
            let hasSale = false;
            Object.values(items).forEach((product) => {
                if (
                    product["items"][0].options._sale_price &&
                    parseInt(product["items"][0].options._regular_price) >
                        parseInt(product["items"][0].options._sale_price)
                ) {
                    // Если промокод добавляет товар по скидке, исключаем его из проверки
                    if (
                        product["items"][0].id ==
                            promocode.promocodeProducts?.id &&
                        product["items"].length === 1
                    ) {
                    } else {
                        hasSale = true;
                    }
                }
            });
            const productWithSale = Object.values(items).find((el) => {
                if (
                    el.items[0].options._sale_price ||
                    el.items[0].variant?._sale_price
                ) {
                    // Если промокод добавляет товар по скидке, исключаем его из проверки
                    if (
                        el.items[0].id == promocode.promocodeProducts?.id &&
                        el.items.length === 1
                    ) {
                        return false;
                    } else {
                        return true;
                    }
                }
            });
            if (hasSale || productWithSale) {
                status = "error";
                alert =
                    "Промокод отменен, т.к. не действует с товарами по скидке.";
                errors.push({
                    code: "hasSale",
                    message: "Промокод не действует с товарами по скидке.",
                });
            }
        } else if (
            promocode.excludeSaleProduct &&
            promocode.categories_hardmode !== "yes"
        ) {
            const productWithoutSale = Object.values(items).find(
                (el) =>
                    !el.items[0].options._sale_price &&
                    !el.items[0].variant?._sale_price
            );

            if (!productWithoutSale) {
                status = "error";
                alert =
                    "Промокод отменен, т.к. не действует с товарами по скидке.";
                errors.push({
                    code: "onlySale",
                    message: "Промокод не действует с товарами по скидке.",
                });
            }
        }

        // Проверка минимальной суммы заказа

        const promocodeDeliveryMinPrice = parseInt(promocode.coupon_min_price);
        const promocodeSelfDeliveryMinPrice =
            promocode.coupon_selfdelivery_min_price === ""
                ? promocodeDeliveryMinPrice
                : parseInt(promocode.coupon_selfdelivery_min_price);

        if (promocode.type === "fixed_product" && hasProduct)
            cartTotal =
                cartTotal -
                parseInt(promocode.promocodeProducts.options._price) +
                parseInt(promocode.productPrice);

        if (
            promocodeDeliveryMinPrice > cartTotal &&
            promocodeSelfDeliveryMinPrice > cartTotal
        ) {
            status = "error";

            if (promocodeDeliveryMinPrice === promocodeSelfDeliveryMinPrice) {
                alert =
                    "Промокод отменен, т.к. действует при заказе на сумму от " +
                    promocodeDeliveryMinPrice +
                    " ₽";
                errors.push({
                    code: "minPrice",
                    message:
                        "Минимальная сумма заказа c промокодом " +
                        promocodeDeliveryMinPrice +
                        " ₽",
                });
            } else {
                alert = `Промокод отменен, т.к. действует при заказе на сумму от 
                    ${promocodeDeliveryMinPrice} ₽. на доставку и от ${promocodeSelfDeliveryMinPrice} ₽ на самовывоз`;
                errors.push({
                    code: "minPrice",
                    message: `Минимальная сумма заказа с промокодом: ${promocodeDeliveryMinPrice} ₽ на доставку и ${promocodeSelfDeliveryMinPrice} ₽ на самовывоз`,
                });
            }
        }
        return {
            alert,
            status,
            errors,
        };
    }

    return false;
};

export const _isCategoryDisabled = (category) => {
    let disabled = false;
    let message = "";
    let disabledByTime = false;
    let disabledByDays = false;

    if (!category.useTimeLimit) {
        return { disabled, message };
    }

    // Проверяем на доступность по времени
    if (category.timeLimitStart && category.timeLimitEnd) {
        const isTimeAfterMidnight =
            parseInt(category.timeLimitStart.slice(0, 2)) >
            parseInt(category.timeLimitEnd.slice(0, 2));

        const timeLimitStart = set(new Date(), {
            hours: category.timeLimitStart.slice(0, 2),
            minutes: category.timeLimitStart.slice(3, 5),
            seconds: 0,
        });

        const timeLimitEnd = set(new Date(), {
            hours: isTimeAfterMidnight ? 23 : category.timeLimitEnd.slice(0, 2),
            minutes: isTimeAfterMidnight
                ? 59
                : category.timeLimitEnd.slice(3, 5),
            seconds: 0,
        });

        const timeLimitEndAfterMidnight = set(new Date(), {
            hours: category.timeLimitEnd.slice(0, 2),
            minutes: category.timeLimitEnd.slice(3, 5),
            seconds: 0,
        });

        const isWithinLimitInterval = () => {
            try {
                if (
                    isWithinInterval(new Date(), {
                        start: timeLimitStart,
                        end: timeLimitEnd,
                    })
                ) {
                    return true;
                } else {
                    return false;
                }
            } catch (error) {
                console.log(
                    `${error.message}, Something wrong in category time interval`
                );
                return true;
            }
        };

        const isWithinAfterMidnightInterval = () => {
            try {
                if (
                    isTimeAfterMidnight &&
                    isWithinInterval(new Date(), {
                        start: startOfDay(new Date()),
                        end: timeLimitEndAfterMidnight,
                    })
                ) {
                    return true;
                } else {
                    return false;
                }
            } catch (error) {
                console.log(
                    `${error.message}, Something wrong in category time interval`
                );
                return false;
            }
        };

        if (!isWithinLimitInterval() && !isWithinAfterMidnightInterval()) {
            disabledByTime = true;
        }
    }
    // Проверяем на доступность по дням недели
    if (category.days && category.days.length) {
        const currentDayOfWeek =
            getDay(new Date()) === 0 ? 6 : getDay(new Date()) - 1;
        if (category.days[currentDayOfWeek] == 0) {
            disabledByDays = true;
        }
    }
    if (disabledByDays) {
        const localDaysOfWeek = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];
        const availableDays = category.days
            .map((day, index) => {
                if (day === 1) {
                    return localDaysOfWeek[index];
                } else {
                    return null;
                }
            })
            .filter((el) => el)
            .join(", ");
        message = `Товары из данной категории можно заказать в ${availableDays}`;
        disabled = true;

        if (category.timeLimitStart && category.timeLimitEnd) {
            message += ` c ${category.timeLimitStart} до ${category.timeLimitEnd}`;
            return { disabled, message };
        }
    }
    if (disabledByTime) {
        disabled = true;
        message = `Товары из данной категории можно заказать c ${category.timeLimitStart} до ${category.timeLimitEnd}`;
        if (category.days && category.days.length) {
            const localDaysOfWeek = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];
            const availableDays = category.days
                .map((day, index) => {
                    if (day === 1) {
                        return localDaysOfWeek[index];
                    } else {
                        return null;
                    }
                })
                .filter((el) => el);
            const availableDaysString = availableDays.join(", ");
            if (availableDays.length < 7) {
                message = `Товары из данной категории можно заказать в ${availableDaysString} c ${category.timeLimitStart} до ${category.timeLimitEnd}`;
            }
        }
        return { disabled, message };
    }
    return { disabled, message };
};

export const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        if (pathname === "/search") {
            document.documentElement.scrollTo({
                top: 0,
                left: 0,
                behavior: "instant", // Optional if you want to skip the scrolling animation
            });
        }
    }, [pathname]);

    return null;
};
