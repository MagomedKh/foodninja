import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    setDeliveryZone,
    setOpenDeliveryModal,
} from "../redux/actions/deliveryAddressModal";
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

const storedZones = {
    deliveryPriceType: "areaPrice",
    apiKey: "234234",
    fixedDeliveryPrice: "333",
    orderMinPrice: "444",
    zones: [
        {
            name: "123",
            coordinates: [
                [
                    [55.43995012085324, 65.26888799830488],
                    [55.41300619253212, 65.29772710963302],
                    [55.42843287488746, 65.35471868678144],
                    [55.45380538371965, 65.31695318385178],
                    [55.43995012085324, 65.26888799830488],
                ],
            ],
            fillColor: "#ff5722",
            strokeColor: "#aa0000",
            deliveryPrice: "111",
            orderMinPrice: "111",
            freeDeliveryOrder: "111",
        },
        {
            name: "345",
            coordinates: [
                [
                    [55.45550906658794, 65.32364656783855],
                    [55.43091856119513, 65.35935213424479],
                    [55.447509083295515, 65.41188051559244],
                    [55.4658480941341, 65.35969545699874],
                    [55.45550906658794, 65.32364656783855],
                ],
                [
                    [55.453167776713514, 65.34149935104169],
                    [55.439507470585156, 65.3638153300456],
                    [55.44828964119679, 65.391624473112],
                    [55.45921582345922, 65.36347200729166],
                    [55.453167776713514, 65.34149935104169],
                ],
            ],
            fillColor: "#917269",
            strokeColor: "#241f4d",
            deliveryPrice: "222",
            orderMinPrice: "22",
            freeDeliveryOrder: "22",
        },
    ],
};

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const connectedWithYmaps = (Wrapped) => {
    return withYMaps(Wrapped, true, ["geocode", "SuggestView"]);
};

const DeliveryAddressModal = ({ ymaps, choosenAddress }) => {
    const dispatch = useDispatch();
    const mapRef = useRef();
    const placemarkRef = useRef(null);
    const { modalOpen } = useSelector((state) => state.deliveryAddressModal);
    const { data: config } = useSelector((state) => state.config);

    const [errors, setErrors] = useState(null);
    const [searchInputValue, setSearchInputValue] = useState("");
    const [area, setArea] = useState("");
    const [street, setStreet] = useState("");
    const [home, setHome] = useState("");
    const [apartment, setApartment] = useState("");
    const [porch, setPorch] = useState("");
    const [floor, setFloor] = useState("");
    const [formate, setFormate] = useState(null);
    const [coordinates, setCoordinates] = useState(null);
    const [detachedHouse, setDetachedHouse] = useState(false);

    let dialogProps = { open: modalOpen, maxWidth: "md", keepMounted: true };
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
    useEffect(() => {
        if (mapRef.current && choosenAddress) {
            if (choosenAddress.coordinates) {
                let choosenZone = null;
                mapRef.current.geoObjects.each((zone) => {
                    if (
                        zone.geometry.getType() === "Polygon" &&
                        zone.geometry.contains(choosenAddress.coordinates)
                    ) {
                        choosenZone = {
                            name: zone.options._options.name,
                            deliveryPrice: zone.options._options.deliveryPrice,
                            orderMinPrice: zone.options._options.orderMinPrice,
                            freeDeliveryOrder:
                                zone.options._options.freeDeliveryOrder,
                        };
                    }
                });
                if (choosenZone) {
                    dispatch(setDeliveryZone(choosenZone));
                } else {
                    dispatch(setDeliveryZone(null));
                }
            } else {
                dispatch(setDeliveryZone(null));
            }
        }
    }, [choosenAddress, mapRef]);

    useEffect(() => {
        if (choosenAddress && choosenAddress.coordinates) {
            getAddress(choosenAddress.coordinates);
            placemarkRef.current.geometry.setCoordinates(
                choosenAddress.coordinates
            );
        } else {
            clearInputHandler();
        }
    }, [choosenAddress]);

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
            validateFields({
                value: coords,
                name: "coordinates",
            });
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
        storedZones.zones.forEach((zone) => {
            const myPolygon = new ymaps.Polygon(
                [...zone.coordinates],
                {},
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
            myPolygon.events.add("click", function (e) {
                var coords = e.get("coords");
                placemarkRef.current.geometry.setCoordinates(coords);
                getAddress(coords);
                if (myPolygon.geometry.contains(coords)) {
                    console.log(zone.name);
                }
            });
            myPolygon.options._options.name = zone.name;
            myPolygon.options._options.deliveryPrice = zone.deliveryPrice;
            myPolygon.options._options.orderMinPrice = zone.orderMinPrice;
            myPolygon.options._options.freeDeliveryOrder =
                zone.freeDeliveryOrder;
            // Добавляем многоугольник на карту.
            mapRef.current.geoObjects.add(myPolygon);
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
            validateFields({
                value: coords,
                name: "coordinates",
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
        validateFields({
            value: home,
            name: "home",
        });
    };

    const clearInputHandler = () => {
        inputChangeHandler("");
        setCoordinates(null);
        if (placemarkRef.current) {
            placemarkRef.current.geometry.setCoordinates(null);
        }
    };

    const addAddressHandler = () => {
        // Проходим валидацию
        if (!validateFields()) {
            console.log("err");
            return;
        }
        // Получаем строку адреса
        let addressLine = "";
        if (area) {
            addressLine += `${area}, `;
        }
        if (street) {
            addressLine += `${street}, `;
        }
        if (home) {
            addressLine += `${home}`;
        }
        if (apartment) {
            addressLine += `, кв. ${apartment}`;
        }
        if (porch) {
            addressLine += `, под. ${porch}`;
        }
        if (floor) {
            addressLine += `, этаж ${floor}`;
        }
        const newAddress = {
            area,
            street,
            home,
            apartment,
            porch,
            floor,
            formate: addressLine,
            coordinates,
        };
        dispatch(addNewAddress(newAddress));
        dispatch(setOpenDeliveryModal(false));
        clearInputHandler();
    };

    const validateFields = (field) => {
        let temp = { ...errors };
        if (field) {
            if (field.name === "apartment" && field.name in temp) {
                temp.apartment =
                    !detachedHouse && !field.value
                        ? "Укажите номер квартиры"
                        : "";
            }
            if (field.name === "coordinates" && field.name in temp) {
                temp.coordinates = !field.value ? "Укажите точку на карте" : "";
            }
            if (field.name === "home" && field.name in temp) {
                temp.home = !home ? "Укажите номер дома" : "";
            }
        } else {
            temp.apartment =
                !detachedHouse && !apartment ? "Укажите номер квартиры" : "";
            temp.coordinates = !coordinates ? "Укажите точку на карте" : "";
            temp.home = !home ? "Укажите номер дома" : "";
        }

        setErrors({ ...temp });
        return Object.values(temp).every((el) => el == "");
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
                    error={!!errors?.coordinates || !!errors?.home}
                    helperText={errors?.coordinates || errors?.home}
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
                            onChange={(event) => {
                                validateFields({
                                    value: apartment,
                                    name: "apartment",
                                });
                                setDetachedHouse(event.target.checked);
                            }}
                        />
                    }
                    label="Частный дом"
                    sx={{ mb: 2, ml: 0 }}
                />
                <Collapse in={!detachedHouse}>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item mobilexs={12} mobilesm={12} mobilemd={4}>
                            <TextField
                                size="small"
                                label="Квартира"
                                value={apartment}
                                onChange={(e) => {
                                    validateFields({
                                        value: e.target.value,
                                        name: "apartment",
                                    });
                                    setApartment(e.target.value);
                                }}
                                error={!!errors?.apartment}
                                helperText={errors?.apartment}
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
                        <Grid item mobilexs={12} mobilesm={12} mobilemd={4}>
                            <TextField
                                size="small"
                                label="Подъезд"
                                value={porch}
                                onChange={(e) => {
                                    setPorch(e.target.value);
                                }}
                                sx={{
                                    "& fieldset": {
                                        borderRadius: "20px",
                                    },
                                    width: "100%",
                                }}
                                className="delivery-address-modal__sub-address"
                            />
                        </Grid>
                        <Grid item mobilexs={12} mobilesm={12} mobilemd={4}>
                            <TextField
                                size="small"
                                label="Этаж"
                                value={floor}
                                onChange={(e) => {
                                    setFloor(e.target.value);
                                }}
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
                        zoom: 16,
                    }}
                    className={"delivery-address-modal__map-container"}
                    onLoad={(ymaps) => loadSuggest(ymaps)}
                    modules={["SuggestView", "Polygon"]}
                    instanceRef={mapRef}
                    options={{
                        suppressMapOpenBlock: true,
                        yandexMapDisablePoiInteractivity: true,
                    }}
                >
                    <Placemark instanceRef={placemarkRef} />
                    <ZoomControl />
                    <GeolocationControl />
                    <FullscreenControl />
                </Map>
                {errors && !Object.values(errors).every((el) => el == "") && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        Заполните все необходимые поля
                    </Alert>
                )}
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
