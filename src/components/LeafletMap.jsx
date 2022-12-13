import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getDay } from "date-fns";

const LeafletMap = () => {
    const mapElement = useRef(null);

    const { config } = useSelector(({ config }) => {
        return {
            config: config.data,
        };
    });

    useEffect(() => {
        if (!mapElement.current) {
            return;
        }

        const map = L.map(mapElement.current).setView(
            [config.CONFIG_latitude, config.CONFIG_longitude],
            17
        );

        L.tileLayer(
            "http://tile2.maps.2gis.com/tiles?x={x}&y={y}&z={z}",
            {}
        ).addTo(map);
        map.attributionControl.setPrefix("");

        // Стилизуем кастомную метку
        const svgTemplate = `
            <svg width="30" height="48" viewBox="0 0 30 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.0363806" d="M15 46.9999C16.6569 46.9999 18 46.3284 18 45.4999C18 44.6715 16.6569 43.9999 15 43.9999C13.3431 43.9999 12 44.6715 12 45.4999C12 46.3284 13.3431 46.9999 15 46.9999Z" fill="black"></path><path opacity="0.0363806" d="M15 47.9999C17.4853 47.9999 19.5 46.8807 19.5 45.4999C19.5 44.1192 17.4853 42.9999 15 42.9999C12.5147 42.9999 10.5 44.1192 10.5 45.4999C10.5 46.8807 12.5147 47.9999 15 47.9999Z" fill="black"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M15 45.8836H15.8824C15.8824 29.2177 20.7768 23.7974 27.9874 23.7974H28.3297C29.0779 21.5907 30 17.9915 30 15.0004C30 7.1439 23.7679 0.000366211 15 0.000366211C6.23206 0.000366211 0 7.1439 0 15.0004C0 17.9915 0.922059 21.5907 1.67029 23.7974H2.01265C9.22412 23.7974 14.1176 29.2177 14.1176 45.8836H15Z" fill="url(#czar-a)"></path><defs><linearGradient id="czar-a" x1="15" y1="22.942" x2="15" y2="0.000366211" gradientUnits="userSpaceOnUse"><stop stop-color="#1B89EE"></stop><stop offset="1" stop-color="#3198EC"></stop></linearGradient></defs></svg>`;
        const icon = L.divIcon({
            className: "marker",
            html: svgTemplate,
            iconSize: [30, 48],
            iconAnchor: [15, 48],
            popupAnchor: [0, -48],
        });

        // Добавляем метку основного адреса на карту
        const marker = L.marker(
            [config.CONFIG_latitude, config.CONFIG_longitude],
            {
                icon: icon,
            }
        ).addTo(map);

        // Определяем график работы основного адреса
        const mainSchedule =
            config.CONFIG_format_start_work && config.CONFIG_format_end_work
                ? `Сегодня с ${config.CONFIG_format_start_work} до 
                    ${config.CONFIG_format_end_work}`
                : "Сегодня закрыто";

        // Добавляем попап к метке основного адреса
        marker.bindPopup(`<b>${config.CONFIG_address}</b><br>${mainSchedule}`);

        // Определяем текущий день недели
        const currentDayOfWeek =
            getDay(new Date()) === 0 ? 6 : getDay(new Date()) - 1;

        // Добавляем метки филиалов на карту
        config.CONFIG_filials.forEach((el) => {
            if (el.latitude && el.longitude) {
                const marker = L.marker([el.latitude, el.longitude], {
                    icon: icon,
                }).addTo(map);

                // Определяем график работы
                const filialSchedule = el.workingTime
                    ? el.workingTime[currentDayOfWeek][0] &&
                      el.workingTime[currentDayOfWeek][1]
                        ? `Сегодня с ${el.workingTime[currentDayOfWeek][0]} до 
                        ${el.workingTime[currentDayOfWeek][1]}`
                        : "Сегодня закрыто"
                    : // Если график работы филиала совпадает с основным
                    config.CONFIG_format_start_work &&
                      config.CONFIG_format_end_work
                    ? `Сегодня с 
                    ${config.CONFIG_format_start_work} 
                    до 
                    ${config.CONFIG_format_end_work}`
                    : "Сегодня закрыто";

                // Добавляем попап к метке филиала
                marker.bindPopup(`<b>${el.address}</b><br>${filialSchedule}`);
            }
        });

        // const polygon = L.polygon(
        //     [
        //         [55.459694, 65.34954],
        //         [55.442621, 65.283805],
        //         [55.430477, 65.339735],
        //         [55.443874, 65.368874],
        //     ],
        //     { color: "red" }
        // ).addTo(map);
        // polygon.bindPopup("I am a polygon.");
    }, []);

    return <div style={{ height: "100%" }} ref={mapElement} />;
};
export default LeafletMap;
