import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import {
    getDay,
    isAfter,
    isBefore,
    isWithinInterval,
    set,
    toDate,
} from "date-fns";

const useWorkingStatus = () => {
    const workingTime = useSelector((state) => state.config.data.workingTime);

    const { CONFIG_maintenance_strStart, CONFIG_maintenance_strEnd } =
        useSelector((state) => state.config.data);

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

    const todayEndWorkTime = workingTime?.[todayDayOfWeek][1]
        ? set(new Date(), {
              hours: workingTime[todayDayOfWeek][1].slice(0, 2),
              minutes: workingTime[todayDayOfWeek][1].slice(3, 5),
              seconds: 0,
              milliseconds: 0,
          })
        : null;

    const workingStatus =
        workingTime.length &&
        todayStartWorkTime &&
        todayEndWorkTime &&
        isBefore(todayStartWorkTime, new Date()) &&
        isAfter(todayEndWorkTime, new Date());

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
