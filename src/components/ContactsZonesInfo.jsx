import React from "react";
import { useSelector } from "react-redux";
import { Divider, Grid } from "@mui/material";

const ContactsZonesInfo = () => {
    const zones = useSelector(({ config }) => config.data.deliveryZones?.zones);
    const showZonesInfo = useSelector(
        ({ config }) =>
            config.data.CONFIG_contact_map_show_deliveryZones === "active"
    );

    const contactsMapType = useSelector(
        ({ config }) => config.data.CONFIG_contact_map_type
    );

    if (
        contactsMapType !== "deliveryZones" ||
        !zones ||
        !zones.length ||
        !showZonesInfo
    ) {
        return null;
    }

    return (
        <div className="contacts-zones-info">
            <h4>Зоны доставки</h4>
            <div className="contacts-zones-info--zones-container">
                {zones.map((zone) => {
                    if (zone.disableZone) {
                        return;
                    }
                    return (
                        <div className="contacts-zones-info--zone">
                            <div className="zone-inner-wrapper">
                                <div className="zone-header">
                                    <div
                                        className="zone-color"
                                        style={{
                                            backgroundColor: zone.fillColor,
                                        }}
                                    />
                                    <div className="zone-title">
                                        <span>{zone.name}</span>
                                        {zone.deliveryTime ? (
                                            <span>
                                                , доставка от{" "}
                                                {zone.deliveryTime} мин.
                                            </span>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="zone-body">
                                    {zone.orderMinPrice ? (
                                        <div className="zone-body--col">
                                            <div className="zone-body--col-title">
                                                Минимальный заказ
                                            </div>
                                            <div className="zone-body--col-value">
                                                {zone.orderMinPrice} ₽
                                            </div>
                                        </div>
                                    ) : null}
                                    {zone.deliveryPrice ? (
                                        <>
                                            <Divider
                                                orientation="vertical"
                                                flexItem
                                                sx={{
                                                    borderWidth: "1px",
                                                    m: "16px 10px 4px 10px",
                                                }}
                                            />
                                            <div className="zone-body--col">
                                                <div className="zone-body--col-title">
                                                    Стоимость доставки
                                                </div>
                                                <div className="zone-body--col-value">
                                                    {zone.deliveryPrice} ₽
                                                </div>
                                            </div>
                                        </>
                                    ) : null}
                                    {zone.freeDeliveryOrder ? (
                                        <>
                                            <Divider
                                                orientation="vertical"
                                                flexItem
                                                sx={{
                                                    borderWidth: "1px",
                                                    m: "16px 16px 4px 16px",
                                                }}
                                            />
                                            <div className="zone-body--col">
                                                <div className="zone-body--col-title">
                                                    Бесплатная доставка
                                                </div>
                                                <div className="zone-body--col-value">
                                                    от {zone.freeDeliveryOrder}{" "}
                                                    ₽
                                                </div>
                                            </div>
                                        </>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ContactsZonesInfo;
