import React from "react";
import "../css/we-closed.css";
import useWorkingStatus from "../hooks/useWorkingStatus";

export default function WeClosed() {
    const workingStatus = useWorkingStatus();

    if (workingStatus) return null;

    return (
        <div className="deliveryStatus">
            <div className="deliveryClosed">
                <div className="main-color">Сейчас мы закрыты.</div>
                <div>Вы можете оформить предзаказ ко времени.</div>
            </div>
        </div>
    );
}
