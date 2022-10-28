import * as React from 'react';
import { useSelector } from 'react-redux';
import "../css/we-closed.css";

export default function WeClosed( {initStatus = false} ) {

    const { config } = useSelector( ({config}) => {
        return {
            config: config.data
        }
    });

    const status = config.CONFIG_work_status !== undefined ? config.CONFIG_work_status : 'open' ;

    return (
        <div className="deliveryStatus">
            { status == 'closed' && (
                <div className="deliveryClosed">
                    <div className="main-color">Сейчас мы закрыты.</div>
                    <div>Вы можете оформить предзаказ ко времени.</div>
                </div>
            )  }
        </div>
    );
}