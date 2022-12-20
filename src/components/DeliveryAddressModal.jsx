import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenDeliveryModal } from "../redux/actions/deliveryAddressModal";
import {
    Alert,
    Button,
    Collapse,
    Checkbox,
    Dialog,
    IconButton,
    Slide,
    ToggleButtonGroup,
    ToggleButton,
    Zoom,
    Grid,
    TextField,
    FormControlLabel,
    InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ClearIcon from "@mui/icons-material/Clear";
import { _isMobile } from "./helpers";
import {
    Map,
    SearchControl,
    withYMaps,
    Placemark,
    ZoomControl,
    GeolocationControl,
    FullscreenControl,
} from "react-yandex-maps";
import "../css/deliveryAddressModal.css";
import { borderRadius } from "@mui/system";
import { addNewAddress } from "../redux/actions/user";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const connectedWithYmaps = (Wrapped) => {
    return withYMaps(Wrapped, true, ["geocode", "SuggestView"]);
};

const DeliveryAddressModal = ({ ymaps }) => {
    const dispatch = useDispatch();
    const mapRef = useRef(null);
    const placemarkRef = useRef(null);
    const { modalOpen } = useSelector((state) => state.deliveryAddressModal);
    const { data: config } = useSelector((state) => state.config);

    const [searchInputValue, setSearchInputValue] = useState("");
    const [area, setArea] = useState(null);
    const [street, setStreet] = useState(null);
    const [home, setHome] = useState(null);
    const [apartment, setApartment] = useState(null);
    const [porch, setPorch] = useState(null);
    const [floor, setFloor] = useState(null);
    const [formate, setFormate] = useState(null);
    const [coordinates, setCoordinates] = useState(null);
    const [detachedHouse, setDetachedHouse] = useState(false);

    let dialogProps = { open: modalOpen, maxWidth: "md" };
    if (_isMobile()) {
        dialogProps.TransitionComponent = Transition;
        dialogProps.fullScreen = true;
        dialogProps.scroll = "body";
    }

    const handleClose = () => {
        dispatch(setOpenDeliveryModal(false));
    };

    const inputChangeHandler = (value) => {
        setSearchInputValue(value);
        if (value) {
            const myGeocoder = ymaps.geocode(value);
        }
    };

    const getAddress = useCallback((coords) => {
        // placemarkRef.current.properties.set("iconCaption", "поиск...");
        ymaps.geocode(coords).then(function (res) {
            var firstGeoObject = res.geoObjects.get(0);

            parseAddress(firstGeoObject);
            // placemarkRef.current.properties.set({
            //     // Формируем строку с данными об объекте.
            //     iconCaption: [
            //         // Название населенного пункта или вышестоящее административно-территориальное образование.
            //         firstGeoObject.getLocalities().length
            //             ? firstGeoObject.getLocalities()
            //             : firstGeoObject.getAdministrativeAreas(),
            //         // Получаем путь до топонима, если метод вернул null, запрашиваем наименование здания.
            //         firstGeoObject.getThoroughfare() ||
            //             firstGeoObject.getPremise(),
            //     ]
            //         .filter(Boolean)
            //         .join(", "),
            //     // В качестве контента балуна задаем строку с адресом объекта.
            //     balloonContent: firstGeoObject.getAddressLine(),
            // });
            setSearchInputValue(firstGeoObject.getAddressLine());
            setCoordinates(coords);
        });
    }, []);

    const loadSuggest = (ymaps) => {
        mapRef.current.controls.remove("routeEditor");
        const suggestView = new ymaps.SuggestView("suggest1");
        suggestView.events.add("select", (e) => {
            setSearchInputValue(e.get("item").value);
            confirmSerachHandler(e.get("item").value);
        });
        mapRef.current.events.add("click", function (e) {
            var coords = e.get("coords");
            placemarkRef.current.geometry.setCoordinates(coords);
            getAddress(coords);
        });
    };

    const confirmSerachHandler = useCallback((value) => {
        ymaps.geocode(value, { results: 1 }).then((res) => {
            // Выбираем первый результат геокодирования.
            const firstGeoObject = res.geoObjects.get(0);

            // Координаты геообъекта.
            const coords = firstGeoObject.geometry.getCoordinates();
            setCoordinates(coords);

            parseAddress(firstGeoObject);

            // Область видимости геообъекта.
            const bounds = firstGeoObject.properties.get("boundedBy");

            placemarkRef.current.geometry.setCoordinates(coords);
            mapRef.current.setBounds(bounds, {
                // Проверяем наличие тайлов на данном масштабе.
                checkZoomRange: true,
            });
        });
    }, []);

    const parseAddress = (geoObject) => {
        // Получаем район
        const area = geoObject.getLocalities();
        let formattedArea = "";
        if (area.length) {
            area.forEach((el, inx, array) => {
                if (el) {
                    formattedArea += el;
                    if (inx != array.length - 1) {
                        formattedArea += ", ";
                    }
                }
            });
            setArea(formattedArea);
        } else {
            setArea(null);
        }
        // Получаем улицу
        const street = geoObject.getThoroughfare();
        if (street) {
            setStreet(street);
        } else {
            setStreet(null);
        }
        // Получаем номер дома
        const home = geoObject.getPremiseNumber();
        if (home) {
            setHome(home);
        } else {
            setHome(null);
        }
        // Получаем строку адреса
        let addressLine = "";
        [formattedArea, street, home].forEach((el, inx, array) => {
            if (el) {
                addressLine += el;
                if (inx != array.length - 1) {
                    addressLine += ", ";
                }
            }
        });

        if (addressLine) {
            setFormate(addressLine);
        } else {
            setFormate(null);
        }
    };

    const clearInputHandler = () => {
        inputChangeHandler("");
        setCoordinates(null);
        placemarkRef.current.geometry.setCoordinates(null);
    };

    const addAddressHandler = () => {
        const newAddress = {
            area,
            street,
            home,
            apartment,
            porch,
            floor,
            formate,
        };
        dispatch(addNewAddress(newAddress));
    };

    return (
        <Dialog
            {...dialogProps}
            className={"delivery-address-modal__dialog"}
            fullWidth
        >
            <div className={"delivery-address-modal__wrapper"}>
                <IconButton
                    edge="start"
                    color="inherit"
                    onClick={handleClose}
                    aria-label="close"
                    className="modal-close"
                    sx={{ zIndex: 1 }}
                >
                    <CloseIcon />
                </IconButton>
                <TextField
                    size="small"
                    label="Введите улицу и дом"
                    value={searchInputValue}
                    onChange={(e) => {
                        inputChangeHandler(e.target.value);
                    }}
                    onKeyPress={(e) => {
                        if (e.key === "Enter") {
                            confirmSerachHandler(searchInputValue);
                        }
                    }}
                    InputProps={{
                        endAdornment: searchInputValue ? (
                            <IconButton
                                aria-label="delete"
                                onClick={clearInputHandler}
                            >
                                <ClearIcon />
                            </IconButton>
                        ) : null,
                    }}
                    sx={{
                        mb: 2,

                        "& fieldset": {
                            borderRadius: "20px",
                        },
                        width: "100%",
                    }}
                    id="suggest1"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            sx={{ p: 0, mr: 1 }}
                            checked={detachedHouse}
                            onChange={(event) =>
                                setDetachedHouse(event.target.checked)
                            }
                        />
                    }
                    label="Частный дом"
                    sx={{ mb: 2, ml: 0 }}
                />
                <Collapse in={!detachedHouse}>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item mobilexs={12} mobilesm={6} mobilemd={3}>
                            <TextField
                                size="small"
                                label="Квартира"
                                sx={{
                                    minWidth: "100px",
                                    "& fieldset": {
                                        borderRadius: "20px",
                                    },
                                    width: "100%",
                                }}
                                className="delivery-address-modal__sub-address"
                            />
                        </Grid>
                        <Grid item mobilexs={12} mobilesm={6} mobilemd={3}>
                            <TextField
                                size="small"
                                label="Подъезд"
                                sx={{
                                    "& fieldset": {
                                        borderRadius: "20px",
                                    },
                                    width: "100%",
                                }}
                                className="delivery-address-modal__sub-address"
                            />
                        </Grid>
                        <Grid item mobilexs={12} mobilesm={6} mobilemd={3}>
                            <TextField
                                size="small"
                                label="Этаж"
                                sx={{
                                    "& fieldset": {
                                        borderRadius: "20px",
                                    },
                                    width: "100%",
                                }}
                                className="delivery-address-modal__sub-address"
                            />
                        </Grid>
                        <Grid item mobilexs={12} mobilesm={6} mobilemd={3}>
                            <TextField
                                size="small"
                                label="Домофон"
                                sx={{
                                    "& fieldset": {
                                        borderRadius: "20px",
                                    },
                                    width: "100%",
                                }}
                                className="delivery-address-modal__sub-address"
                            />
                        </Grid>
                    </Grid>
                </Collapse>
                {/* <div
                    id={"yandex-map"}
                    className={"delivery-address-modal__map-container"}
                ></div> */}
                <Map
                    defaultState={{
                        center: [
                            config.CONFIG_latitude,
                            config.CONFIG_longitude,
                        ],
                        zoom: 9,
                    }}
                    className={"delivery-address-modal__map-container"}
                    onLoad={(ymaps) => loadSuggest(ymaps)}
                    modules={["SuggestView"]}
                    instanceRef={mapRef}
                    options={{ suppressMapOpenBlock: true }}
                >
                    <Placemark instanceRef={placemarkRef} />
                    <ZoomControl />
                    <GeolocationControl />
                    <FullscreenControl />
                </Map>
                <Button
                    className="btn--action"
                    sx={{ width: 1, mt: 2 }}
                    variant="button"
                    onClick={addAddressHandler}
                >
                    Сохранить адрес
                </Button>
            </div>
        </Dialog>
    );
};

export default connectedWithYmaps(DeliveryAddressModal);
