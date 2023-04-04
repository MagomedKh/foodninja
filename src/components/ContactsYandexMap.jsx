import { getDay } from "date-fns";
import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { Map, ZoomControl, FullscreenControl } from "react-yandex-maps";

const ContactsYandexMap = () => {
    const mapRef = useRef(null);

    const { data: config } = useSelector((state) => state.config);

    const onMapLoad = (ymaps) => {
        mapRef.current.controls.remove("routeEditor");

        // Добавляем зоны доставки на карту
        config.deliveryZones.zones.forEach((zone, index) => {
            if (zone.disableZone) {
                return;
            }
            let balloonContent = "";
            if (zone.orderMinPrice) {
                balloonContent += `Минимальная сумма заказа от ${zone.orderMinPrice} ₽<br>`;
            }
            if (zone.deliveryPrice) {
                balloonContent += `Стоимость доставки ${zone.deliveryPrice} ₽<br>`;
            }
            if (zone.freeDeliveryOrder) {
                balloonContent += `Бесплатная доставка от ${zone.freeDeliveryOrder} ₽<br>`;
            }
            if (zone.deliveryTime) {
                balloonContent += `Время доставки  от ${zone.deliveryTime} мин.`;
            }
            const myPolygon = new ymaps.Polygon(
                [...zone.coordinates],
                {
                    balloonContent: balloonContent,
                },
                {
                    // Цвет заливки.
                    fillColor: zone.fillColor || "#00FF00",
                    // Цвет обводки.
                    fillOpacity: 0.5,
                    // Цвет контура.
                    strokeColor: zone.strokeColor || "#aa0000",
                    // Ширина обводки.
                    strokeWidth: 2,
                }
            );
            // Добавляем многоугольник на карту.
            mapRef.current.geoObjects.add(myPolygon);
        });

        // Определяем график работы основного адреса
        const mainSchedule =
            config.CONFIG_format_start_work && config.CONFIG_format_end_work
                ? `Сегодня с ${config.CONFIG_format_start_work} до 
                    ${config.CONFIG_format_end_work}`
                : "Сегодня закрыто";

        const mainPlacemarkBalloonContent = `<b>${config.CONFIG_address}</b><br>${mainSchedule}`;

        const mainPlacemark = new ymaps.Placemark(
            [config.CONFIG_latitude, config.CONFIG_longitude],
            {
                balloonContent: mainPlacemarkBalloonContent,
            }
        );

        mapRef.current.geoObjects.add(mainPlacemark);

        // Определяем текущий день недели
        const currentDayOfWeek =
            getDay(new Date()) === 0 ? 6 : getDay(new Date()) - 1;

        // // Добавляем метки филиалов на карту
        config.CONFIG_filials.forEach((filial) => {
            if (filial.latitude && filial.longitude) {
                // Определяем график работы филиала
                const filialSchedule = filial.workingTime
                    ? filial.workingTime[currentDayOfWeek][0] &&
                      filial.workingTime[currentDayOfWeek][1]
                        ? `Сегодня с ${filial.workingTime[currentDayOfWeek][0]} до 
                        ${filial.workingTime[currentDayOfWeek][1]}`
                        : "Сегодня закрыто"
                    : // Если график работы филиала совпадает с основным
                    config.CONFIG_format_start_work &&
                      config.CONFIG_format_end_work
                    ? `Сегодня с 
                    ${config.CONFIG_format_start_work} 
                    до 
                    ${config.CONFIG_format_end_work}`
                    : "Сегодня закрыто";

                const filialPlacemarkBalloonContent = `<b>${filial.address}</b><br>${filialSchedule}`;

                const filialPlacemark = new ymaps.Placemark(
                    [filial.latitude, filial.longitude],
                    {
                        balloonContent: filialPlacemarkBalloonContent,
                    }
                );

                mapRef.current.geoObjects.add(filialPlacemark);
            }
        });
    };
    return (
        <Map
            defaultState={{
                center: config.deliveryZones.mapCenter || [
                        config.CONFIG_latitude,
                        config.CONFIG_longitude,
                    ] || [55.76, 37.64],
                zoom: config.deliveryZones.mapZoom || 13,
            }}
            className={"contacts--map"}
            onLoad={(ymaps) => {
                onMapLoad(ymaps);
            }}
            modules={["Placemark", "Polygon", "geoObject.addon.balloon"]}
            instanceRef={mapRef}
            options={{
                suppressMapOpenBlock: true,
                yandexMapDisablePoiInteractivity: true,
            }}
        >
            <ZoomControl />
            <FullscreenControl />
        </Map>
    );
};

export default ContactsYandexMap;
