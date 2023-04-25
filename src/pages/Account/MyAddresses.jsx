import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveAddresses } from "../../redux/actions/user";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { Collapse, Grid, Slide, Snackbar } from "@mui/material";
import { TransitionGroup } from "react-transition-group";
import LoadingButton from "@mui/lab/LoadingButton";
import { AccountUserAddress } from "../../components";
import axios from "axios";
import { _clone, _getDomain } from "../../components/helpers";
import "../../css/my-addresses.css";

const MyAddresses = () => {
    const dispatch = useDispatch();
    const listContainerRef = useRef(null);

    const userPhone = useSelector((state) => state.user.user.phone);
    const userToken = useSelector((state) => state.user.user.token);
    const userAddresses = useSelector((state) => state.user.user.addresses);

    const [addresses, setAddresses] = useState(
        userAddresses.map((el, index) => {
            return { ...el, id: `item-${index}` };
        })
    );
    const [loading, setLoading] = useState(false);
    const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);

    const reorder = (list, startIndex, endIndex) => {
        const result = _clone(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    const onDragEnd = ({ destination, source }) => {
        if (!destination) return;

        const newAddresses = reorder(
            addresses,
            source.index,
            destination.index
        );

        setAddresses(newAddresses);
    };

    const onDelete = (index) => {
        const result = _clone(addresses);
        result.splice(index, 1);
        setAddresses(result);
    };

    const onEdit = (index, value) => {
        const result = _clone(addresses);
        result[index].label = value;
        setAddresses(result);
    };

    const hadleSaveAddresses = () => {
        setLoading(true);
        if (!Array.isArray(addresses)) {
            console.log("Сохраняемый список не является массивом");
            return;
        }
        axios
            .post("https://" + _getDomain() + "/?rest-api=saveAddresses", {
                phone: userPhone,
                token: userToken,
                addresses: addresses,
            })
            .then((resp) => {
                setLoading(false);
                setSuccessSnackbarOpen(true);
                dispatch(saveAddresses(addresses));
            });
    };

    return (
        <div className="addresses-list">
            <Grid container>
                <Grid item xs={12} md={6} ref={listContainerRef}>
                    {addresses.length ? (
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="droppable">
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >
                                        <TransitionGroup>
                                            {addresses.map((address, index) => (
                                                <Collapse key={address.id}>
                                                    <AccountUserAddress
                                                        address={address}
                                                        index={index}
                                                        onDelete={onDelete}
                                                        onEdit={onEdit}
                                                    />
                                                </Collapse>
                                            ))}

                                            {provided.placeholder}
                                        </TransitionGroup>
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    ) : (
                        <Slide in={true} container={listContainerRef.current}>
                            <div className="addresses-list--item addresses-list--placeholder">
                                У вас пока нет сохранённых адресов
                            </div>
                        </Slide>
                    )}
                    <div className="addresses-list--save-button-container">
                        <LoadingButton
                            loading={loading}
                            onClick={hadleSaveAddresses}
                            className="btn--action"
                            variant="button"
                        >
                            Сохранить
                        </LoadingButton>
                    </div>
                </Grid>
            </Grid>
            <Snackbar
                open={successSnackbarOpen}
                autoHideDuration={4000}
                onClose={() => {
                    setSuccessSnackbarOpen(false);
                }}
                message="Адреса успешно сохранены!"
            />
        </div>
    );
};

export default MyAddresses;
