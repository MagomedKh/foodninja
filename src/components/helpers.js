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
        let message;
        let errors = [];

        //Проверка на отключенные промокоды
        if (config?.CONFIG_disable_promocodes === "on") {
            status = "error";
            message = "Промокод отменен";
        }

        // Текущее время
        const currentTime = parseInt(new Date().getTime() / 1000);

        // Проверка даты
        if (
            (promocode.startDate && promocode.startDate > currentTime) ||
            (promocode.endDate && currentTime > promocode.endDate)
        ) {
            status = "error";
            message = "Промокод отменен, т.к. время действия истекло.";
            errors.push("Время действия промокода истекло");
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
                message = `Промокод отменен, т.к. действует только ${promocode.birthdayDayLimitBefore} день до и ${promocode.birthdayDayLimitAfter} день после дня рождения.`;
                errors.push(
                    `Промокод действует только ${promocode.birthdayDayLimitBefore} день до и ${promocode.birthdayDayLimitAfter} день после дня рождения.`
                );
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
                message =
                    "Промокод отменен, т.к. в текущее время не действует.";
                errors.push(
                    `Промокод действует с ${promocode.startTime} до ${promocode.endTime}`
                );
            }
        }
        // Проверка дней недели

        if (promocode.days && promocode.days.length === 7) {
            const todayDayOfWeek =
                getDay(new Date()) === 0 ? 6 : getDay(new Date()) - 1;
            const isPromocodeAvailable = promocode.days[todayDayOfWeek] === 1;
            if (!isPromocodeAvailable) {
                status = "error";
                message = "Промокод отменен, т.к. не действует сегодня";
                errors.push("Промокод не действует сегодня");
            }
        }

        // Проверка типа доставки
        if (typeDelivery) {
            if (
                promocode.typeDelivery === "delivery" &&
                typeDelivery !== "delivery"
            ) {
                status = "error";
                message =
                    "Промокод отменен, т.к. действует только на доставку.";
                errors.push("Промокод действует только на доставку.");
            }
            if (promocode.typeDelivery === "self" && typeDelivery !== "self") {
                status = "error";
                message =
                    "Промокод отменен, т.к. действует только при самовывозе.";
                errors.push("Промокод действует только при самовывозе.");
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
                        errors.push(
                            `Промокод не действует с товарами из категорий: ${categoryNames?.join(
                                ", "
                            )}`
                        );
                    } else {
                        errors.push(`Промокод действует с другими товарами.`);
                    }

                    status = "error";
                    message =
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
                        errors.push(
                            `Промокод действует только с товарами из категорий: ${categoryNames?.join(
                                ", "
                            )}`
                        );
                    } else {
                        errors.push(`Промокод действует с другими товарами.`);
                    }
                    status = "error";
                    message =
                        "Промокод отменен, т.к. действует с другими товарами.";
                }
            }
        }

        if (promocode.type === "fixed_product" && !isInitial) {
            let hasProduct = false;

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
                message = "Промокод отменен, т.к. нет нужного товара.";
                errors.push("Товар по промокоду отсутствует в корзине");
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
                )
                    hasSale = true;
            });
            const productWithSale = Object.values(items).find(
                (el) =>
                    el.items[0].options._sale_price ||
                    el.items[0].variant?._sale_price
            );
            if (hasSale || productWithSale) {
                status = "error";
                message =
                    "Промокод отменен, т.к. не действует с товарами по скидке.";
                errors.push("Промокод не действует с товарами по скидке.");
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
                message =
                    "Промокод отменен, т.к. не действует с товарами по скидке.";
                errors.push("Промокод не действует с товарами по скидке.");
            }
        }

        // Проверка минимальной суммы заказа
        // if (promocode.type === "fixed_product")
        //     cartTotal =
        //         cartTotal -
        //         parseInt(promocode.promocodeProducts.options._price) +
        //         parseInt(promocode.productPrice);

        // if (
        //     parseInt(promocode.minimumPrice) &&
        //     parseInt(promocode.minimumPrice) > cartTotal
        // ) {
        //     return {
        //         status: "error",
        //         message:
        //             "Промокод отменен, т.к. действует при заказе на сумму от " +
        //             promocode.minimumPrice +
        //             " ₽.",
        //     };
        // }
        return {
            message,
            status,
            errors,
        };
    }

    return false;
};

export const _isCategoryDisabled = (category) => {
    if (
        !category.useTimeLimit ||
        !category.timeLimitStart ||
        !category.timeLimitEnd
    ) {
        return false;
    }
    const currentTime = getTime(new Date());

    const timeLimitStart = set(new Date(), {
        hours: category.timeLimitStart.slice(0, 2),
        minutes: category.timeLimitStart.slice(3, 5),
        seconds: 0,
    });

    const timeLimitEnd = set(new Date(), {
        hours: category.timeLimitEnd.slice(0, 2),
        minutes: category.timeLimitEnd.slice(3, 5),
        seconds: 0,
    });

    if (currentTime < timeLimitStart || currentTime > timeLimitEnd) {
        return true;
    }
    return false;
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
