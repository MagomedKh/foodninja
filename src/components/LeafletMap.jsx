import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const LeafletMap = () => {
    const mapElement = useRef(null);

    useEffect(() => {
        if (!mapElement.current) {
            return;
        }

        const map = L.map(mapElement.current).setView(
            [55.449607, 65.354708],
            13
        );

        L.tileLayer(
            "http://tile2.maps.2gis.com/tiles?x={x}&y={y}&z={z}",
            {}
        ).addTo(map);
        map.attributionControl.setPrefix("");

        const polygon = L.polygon(
            [
                [55.459694, 65.34954],
                [55.442621, 65.283805],
                [55.430477, 65.339735],
                [55.443874, 65.368874],
            ],
            { color: "red" }
        ).addTo(map);
        polygon.bindPopup("I am a polygon.");
    }, []);

    return <div style={{ height: "100%" }} ref={mapElement} />;
};
export default LeafletMap;
