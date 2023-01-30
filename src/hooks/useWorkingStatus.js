import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { getDay, isAfter, isBefore, set } from "date-fns";

const useWorkingStatus = () => {
    const workingTime = useSelector((state) => state.config.data.workingTime);

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

    return workingStatus;
};

export default useWorkingStatus;
