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
import clsx from "clsx";

const UserAddressesList = ({
    deliveryAddress,
    handleChooseDeliveryAddress,
}) => {
    const user = useSelector(({ user }) => user.user);

    const config = useSelector(({ config }) => config.data);

    const [collapsed, setCollapsed] = useState(true);

    const userAddresses =
        (user?.addresses && Object.values(user.addresses)) || [];

    const addressesWithFormat = userAddresses
        .map((address, index) => {
            if (
                config.deliveryZones.deliveryPriceType === "areaPrice" &&
                !address.coordinates
            ) {
                return null;
            }
            let formateAddress;
            if (!address.formate) {
                formateAddress = address.street + ", д. " + address.home;
                formateAddress += address.porch
                    ? ", под. " + address.porch
                    : "";
                formateAddress += address.floor
                    ? ", этаж " + address.floor
                    : "";
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
                    disableTypography
                    label={
                        <div className="user-address-label">
                            {address.label && <span>{address.label}</span>}
                            <span
                                className={clsx(address.label && "with-label")}
                            >
                                {address.formate || formateAddress}
                            </span>
                        </div>
                    }
                />
            );
        })
        .filter((el) => el);

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
                <span
                    onClick={() => setCollapsed((state) => !state)}
                    className="show-more"
                >
                    {collapsed ? "Показать все адреса" : "Свернуть"}
                </span>
            ) : null}

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
