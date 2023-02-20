import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import {
    getDay,
    isAfter,
    isBefore,
    isWithinInterval,
    set,
    startOfDay,
    toDate,
} from "date-fns";

const useWorkingStatus = () => {
    const workingTime = useSelector((state) => state.config.data.workingTime);

    const { CONFIG_maintenance_strStart, CONFIG_maintenance_strEnd } =
        useSelector((state) => {
            return {
                CONFIG_maintenance_strStart:
                    state.config.data.CONFIG_maintenance_strStart ||
                    "01.01.1970 00:00",
                CONFIG_maintenance_strEnd:
                    state.config.data.CONFIG_maintenance_strEnd ||
                    "01.02.1970 00:00",
            };
        });

    const maintenanceDateStart = set(new Date(), {
        year: CONFIG_maintenance_strStart.slice(6, 10),
        month: parseInt(CONFIG_maintenance_strStart.slice(3, 5)) - 1,
        date: CONFIG_maintenance_strStart.slice(0, 2),
        hours: CONFIG_maintenance_strStart.slice(11, 13),
        minutes: CONFIG_maintenance_strStart.slice(14),
        seconds: 0,
        milliseconds: 0,
    });
    const maintenanceDateEnd = set(new Date(), {
        year: CONFIG_maintenance_strEnd.slice(6, 10),
        month: parseInt(CONFIG_maintenance_strEnd.slice(3, 5)) - 1,
        date: CONFIG_maintenance_strEnd.slice(0, 2),
        hours: CONFIG_maintenance_strEnd.slice(11, 13),
        minutes: CONFIG_maintenance_strEnd.slice(14),
        seconds: 0,
        milliseconds: 0,
    });
    const todayDayOfWeek = useMemo(
        () => (getDay(new Date()) === 0 ? 6 : getDay(new Date()) - 1),
        []
    );

    const todayStartWorkTime = workingTime?.[todayDayOfWeek][0]
        ? set(new Date(), {
              hours: workingTime[todayDayOfWeek][0].slice(0, 2),
              minutes: workingTime[todayDayOfWeek][0].slice(3, 5),
              seconds: 0,
              milliseconds: 0,
          })
        : null;

    // Если конец дня переходит на след. день, конец рабочего дня устанавливается в 23:59
    const isTodayWorkAfterMidnight =
        parseInt(workingTime?.[todayDayOfWeek][0].slice(0, 2)) >=
        parseInt(workingTime?.[todayDayOfWeek][1].slice(0, 2));

    const todayEndWorkTime = workingTime?.[todayDayOfWeek][1]
        ? set(new Date(), {
              hours: isTodayWorkAfterMidnight
                  ? 23
                  : workingTime[todayDayOfWeek][1].slice(0, 2),
              minutes: isTodayWorkAfterMidnight
                  ? 59
                  : workingTime[todayDayOfWeek][1].slice(3, 5),
              seconds: isTodayWorkAfterMidnight ? 59 : 0,
              milliseconds: 0,
          })
        : null;

    // Если конец прошлого дня переходит на сегодняшний, учитываем это время
    const yesterdayDayOfWeek = useMemo(
        () => (todayDayOfWeek === 0 ? 6 : todayDayOfWeek - 1),
        []
    );
    const isYesterdayWorkAfterMidnight =
        parseInt(workingTime?.[yesterdayDayOfWeek][0].slice(0, 2)) >=
        parseInt(workingTime?.[yesterdayDayOfWeek][1].slice(0, 2));

    const yesterdayAfterMidnightEndWorkTime = isYesterdayWorkAfterMidnight
        ? set(new Date(), {
              hours: workingTime?.[yesterdayDayOfWeek][1].slice(0, 2),
              minutes: workingTime?.[yesterdayDayOfWeek][1].slice(3, 5),
              seconds: 0,
              milliseconds: 0,
          })
        : null;

    const workingStatus =
        workingTime.length &&
        ((todayStartWorkTime &&
            todayEndWorkTime &&
            isWithinInterval(new Date(), {
                start: todayStartWorkTime,
                end: todayEndWorkTime,
            })) ||
            (yesterdayAfterMidnightEndWorkTime &&
                isWithinInterval(new Date(), {
                    start: startOfDay(new Date()),
                    end: yesterdayAfterMidnightEndWorkTime,
                })));

    const maintenanceStatus = !isWithinInterval(new Date(), {
        start: maintenanceDateStart,
        end: maintenanceDateEnd,
    });

    return {
        workingStatus,
        maintenanceStatus,
        maintenanceDateStart,
        maintenanceDateEnd,
    };
};

export default useWorkingStatus;
