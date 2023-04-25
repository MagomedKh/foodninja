import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import MenuIcon from "@mui/icons-material/Menu";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import { TextField } from "@mui/material";
import BootstrapTooltip from "./BootstrapTooltip";
import clsx from "clsx";
import "../css/my-addresses.css";

const AccountUserAddress = ({ address, index, onDelete, onEdit }) => {
    const [editMode, setEditMode] = useState(false);
    const [inputValue, setInputValue] = useState(
        address.label ? address.label : ""
    );

    let formattedAddress = "";
    if (address.formate) {
        formattedAddress = address.formate;
    } else {
        formattedAddress = address.street + ", д. " + address.home;
        formattedAddress += address.porch ? ", под. " + address.porch : "";
        formattedAddress += address.floor ? ", этаж " + address.floor : "";
        formattedAddress += address.apartment
            ? ", кв. " + address.apartment
            : "";
    }

    return (
        <Draggable draggableId={address.id} index={index}>
            {(provided, snapshot) => (
                <div
                    className={clsx(
                        snapshot.isDragging && "dragging",
                        "addresses-list--item"
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                >
                    <div className="addresses-list--item-inner-wrapper">
                        <div
                            {...provided.dragHandleProps}
                            className="addresses-list--drag-svg-container"
                        >
                            <MenuIcon className="addresses-list--drag-svg" />
                        </div>
                        {editMode ? (
                            <TextField
                                size="small"
                                placeholder="Название, например «Дом»"
                                value={inputValue}
                                onChange={(event) => {
                                    setInputValue(event.target.value);
                                }}
                                multiline
                                sx={{ width: "100%" }}
                            />
                        ) : (
                            <div className="addresses-list--name-container">
                                {address.label && <span>{address.label}</span>}
                                <span
                                    className={clsx(
                                        "addresses-list--address-name",
                                        address.label && "with-label"
                                    )}
                                >
                                    {formattedAddress}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="addresses-list--buttons-container">
                        {editMode ? (
                            <CheckIcon
                                onClick={() => {
                                    onEdit(index, inputValue);
                                    setEditMode(false);
                                }}
                                color="success"
                                className="addresses-list--save-svg"
                            />
                        ) : (
                            <BootstrapTooltip
                                placement="top"
                                title="Добавить название"
                            >
                                <EditIcon
                                    className="addresses-list--edit-svg"
                                    onClick={() => setEditMode(true)}
                                />
                            </BootstrapTooltip>
                        )}
                        <BootstrapTooltip placement="top" title="Удалить">
                            <DeleteIcon
                                className="addresses-list--delete-svg"
                                onClick={() => onDelete(index)}
                            />
                        </BootstrapTooltip>
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default AccountUserAddress;
