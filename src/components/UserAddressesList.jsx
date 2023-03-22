import React, { useState, useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
    Alert,
    Button,
    Container,
    Collapse,
    Dialog,
    Divider,
    FormControlLabel,
    IconButton,
    Grid,
    MenuItem,
    Radio,
    RadioGroup,
    Switch,
    Select,
    Slider,
    Slide,
    TextField,
    ToggleButtonGroup,
    ToggleButton,
} from "@mui/material";

const UserAddressesList = ({
    deliveryAddress,
    handleChooseDeliveryAddress,
}) => {
    const user = useSelector(({ user }) => user.user);

    const config = useSelector(({ config }) => config.data);

    const [collapsed, setCollapsed] = useState(true);

    const reversedAddresses = Object.values(user.addresses).reverse();

    const addressesWithCoords = reversedAddresses.filter((address) => {
        if (
            config.deliveryZones.deliveryPriceType === "areaPrice" &&
            !address.coordinates
        ) {
            return false;
        }
        return true;
    });

    const addressesWithFormat = addressesWithCoords.map((address, index) => {
        let formateAddress;
        if (!address.formate) {
            formateAddress = address.street + ", д. " + address.home;
            formateAddress += address.porch ? ", под. " + address.porch : "";
            formateAddress += address.floor ? ", этаж " + address.floor : "";
            formateAddress += address.apartment
                ? ", кв. " + address.apartment
                : "";
        }
        return (
            <FormControlLabel
                key={index}
                className="custom-radio"
                value={index}
                control={<Radio size="small" />}
                label={address.formate || formateAddress}
            />
        );
    });

    const firstAddresses = addressesWithFormat.slice(0, 5);

    const collapsedAddresses = addressesWithFormat.slice(5);

    return (
        <RadioGroup
            value={deliveryAddress}
            aria-labelledby="deliveryAddress-label"
            name="deliveryAddress"
            onChange={handleChooseDeliveryAddress}
            sx={{
                "& .MuiFormControlLabel-root": {
                    alignItems: "start",
                },
            }}
        >
            {firstAddresses}

            {collapsedAddresses.length ? (
                <Collapse
                    in={!collapsed}
                    sx={{
                        "& .MuiCollapse-wrapperInner": {
                            display: "flex",
                            flexDirection: "column",
                        },
                    }}
                >
                    {collapsedAddresses}
                </Collapse>
            ) : null}
            {collapsedAddresses.length ? (
                <span
                    onClick={() => setCollapsed((state) => !state)}
                    className="show-more"
                >
                    {collapsed ? "Показать все адреса" : "Свернуть"}
                </span>
            ) : null}
            <FormControlLabel
                className="custom-radio new-address"
                value="new"
                control={<Radio size="small" />}
                label="Новый адрес"
            />
        </RadioGroup>
    );
};

export default UserAddressesList;
