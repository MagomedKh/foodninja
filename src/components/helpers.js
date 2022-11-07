import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getTime, set } from "date-fns";

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
    return window.location.hostname === "localhost"
        ? "demo.foodninja.pro"
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

function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time =
        date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
    return time;
}

export const _checkPromocode = (promocode, items, cartTotal, typeDelivery) => {
    if (promocode) {
        // Текущее время
        const currentTime = parseInt(new Date().getTime() / 1000);

        // Проверка даты

        if (
            (promocode.startDate && promocode.startDate > currentTime) ||
            (promocode.endDate && currentTime > promocode.endDate)
        )
            return {
                status: "error",
                message: "Промокод отменен, т.к. время действия истекло.",
            };

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
                return {
                    status: "error",
                    message: `Промокод отменен, т.к. действует только ${promocode.birthdayDayLimitBefore} день до и ${promocode.birthdayDayLimitAfter} день после дня рождения.`,
                };
            }
        }
        // Проверка времени
        if (
            promocode.startTime - 60 * 60 * 5 > currentTime ||
            currentTime > promocode.endTime - 60 * 60 * 5
        )
            return {
                status: "error",
                message: "Промокод отменен, т.к. в текущее время не действует.",
            };

        // Проверка типа доставки
        if (typeDelivery) {
            if (
                promocode.typeDelivery === "delivery" &&
                typeDelivery !== "delivery"
            )
                return {
                    status: "error",
                    message:
                        "Промокод отменен, т.к. действует только на доставку.",
                };
            if (promocode.typeDelivery === "self" && typeDelivery !== "self")
                return {
                    status: "error",
                    message:
                        "Промокод отменен, т.к. действует только при самовывозе.",
                };
        }

        // Проверка платформы
        // if(  ) {

        // }

        // Проверка категорий
        if (promocode.type === "fixed_cart" || promocode.type === "percent") {
            if (
                promocode.categories.length &&
                promocode.categories_hardmode === "yes"
            ) {
                // Исключение категорий
                if (promocode.excludeCategories) {
                    let hasExcludeCategory = false;
                    Object.values(items).forEach((product) => {
                        const inCategories = product[
                            "items"
                        ][0].categories.filter((item) =>
                            promocode.categories.includes(item)
                        );
                        if (inCategories.length) hasExcludeCategory = true;
                    });

                    if (hasExcludeCategory)
                        return {
                            status: "error",
                            message:
                                "Промокод отменен, т.к. не действует с выбранными товарами.",
                        };
                }

                // Только указанные категории
                if (
                    !promocode.excludeCategories &&
                    promocode.categories_hardmode === "yes"
                ) {
                    let notInCategory = false;
                    Object.values(items).forEach((product) => {
                        const inCategories = product[
                            "items"
                        ][0].categories.filter((item) =>
                            promocode.categories.includes(item)
                        );
                        if (!inCategories.length) notInCategory = true;
                    });

                    if (notInCategory)
                        return {
                            status: "error",
                            message:
                                "Промокод отменен, т.к. действует с другими товарами.",
                        };
                }
            }

            // Проверка товаров по скидке
            if (promocode.excludeSaleProduct) {
                let hasSale = false;
                Object.values(items).forEach((product) => {
                    if (
                        product["items"][0].options._regular_price >
                        product["items"][0].options._sale_price
                    )
                        hasSale = true;
                });
                if (hasSale)
                    return {
                        status: "error",
                        message:
                            "Промокод отменен, т.к. не действует с товарами по скидке.",
                    };
            }
        }
        if (promocode.type === "fixed_product") {
            let hasProduct = false;

            Object.values(items).forEach((productsArray) => {
                productsArray["items"].forEach((product) => {
                    if (promocode.promocodeProducts.type === "variations") {
                        if (
                            product.type === "variations" &&
                            product.variant.variant_id ==
                                promocode.promocodeProducts.variant.variant_id
                        )
                            hasProduct = true;
                    } else if (promocode.promocodeProducts.id === product.id)
                        hasProduct = true;
                });
            });
            if (!hasProduct)
                return {
                    status: "error",
                    message: "Промокод отменен, т.к. нету нужного товара.",
                };
        }

        // Проверка минимальной суммы заказа
        if (promocode.type === "fixed_product")
            cartTotal -= promocode.promocodeProducts.options._price;

        if (
            parseInt(promocode.minimumPrice) &&
            parseInt(promocode.minimumPrice) > cartTotal
        ) {
            console.log(parseInt(promocode.minimumPrice));
            console.log(cartTotal);
            return {
                status: "error",
                message:
                    "Промокод отменен, т.к. действует при заказе на сумму от " +
                    promocode.minimumPrice +
                    " ₽.",
            };
        }
    }

    return true;
};

export const _isCategoryDisabled = (category) => {
    if (!category.timeLimitStart || !category.timeLimitEnd) {
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
