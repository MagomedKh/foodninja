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
    Dialog,
    IconButton,
    Slide,
    Switch,
    Grid,
    TextField,
    FormControlLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ClearIcon from "@mui/icons-material/Clear";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { _isMobile } from "./helpers";
import {
    Map,
    withYMaps,
    Placemark,
    ZoomControl,
    GeolocationControl,
    FullscreenControl,
} from "react-yandex-maps";
import "../css/deliveryAddressModal.css";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const connectedWithYmaps = (Wrapped) => {
    return withYMaps(Wrapped, true, ["geocode", "SuggestView"]);
};

const DeliveryAddressModal = ({
    ymaps,
    choosenAddress,
    onYandexApiError,
    handleChooseZoneDeliveryAddress,
}) => {
    const dispatch = useDispatch();
    const mapRef = useRef(null);
    const placemarkRef = useRef(null);
    const { modalOpen } = useSelector((state) => state.deliveryAddressModal);
    const { data: config } = useSelector((state) => state.config);

    const [map, setMap] = useState(null);
    const [errors, setErrors] = useState(null);
    const [searchInputValue, setSearchInputValue] = useState("");
    const [area, setArea] = useState("");
    const [street, setStreet] = useState("");
    const [home, setHome] = useState("");
    const [apartment, setApartment] = useState("");
    const [porch, setPorch] = useState("");
    const [floor, setFloor] = useState("");
    const [coordinates, setCoordinates] = useState(null);
    const [detachedHouse, setDetachedHouse] = useState(false);
    const [isAddressInZone, setIsAddressInZone] = useState(true);

    // Initial state
    useEffect(() => {
        if (mapRef.current && choosenAddress && placemarkRef.current) {
            if (choosenAddress.coordinates) {
                getAddress(choosenAddress.coordinates);
                placemarkRef.current.geometry.setCoordinates(
                    choosenAddress.coordinates
                );
            } else {
                clearInputHandler();
            }
            if (choosenAddress.apartment) {
                setApartment(choosenAddress.apartment);
            } else {
                setApartment("");
            }
            if (choosenAddress.floor) {
                setFloor(choosenAddress.floor);
            } else {
                setFloor("");
            }
            if (choosenAddress.porch) {
                setPorch(choosenAddress.porch);
            } else {
                setPorch("");
            }
            if (choosenAddress.detachedHouse) {
                setDetachedHouse(true);
            } else {
                setDetachedHouse(false);
            }
        } else {
            clearInputHandler();
            setApartment("");
            setFloor("");
            setPorch("");
            setDetachedHouse(false);
        }
    }, [choosenAddress, map, placemarkRef.current]);

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
        if (mapRef.current) {
            if (choosenAddress && choosenAddress.coordinates) {
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
    }, [choosenAddress, map]);

    const getAddress = useCallback((coords) => {
        // placemarkRef.current.properties.set("iconCaption", "поиск...");
        ymaps
            .geocode(coords)
            .then(function (res) {
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
            })
            .catch((error) => onYandexApiError(true));
    }, []);

    const loadSuggest = (ymaps) => {
        mapRef.current.controls.remove("routeEditor");

        // Начальная проверка ответа сервера yandex API
        ymaps
            .geocode("Москва")
            .then(function (res) {})
            .catch((error) => onYandexApiError(true));

        config.deliveryZones.zones.forEach((zone) => {
            const myPolygon = new ymaps.Polygon(
                [...zone.coordinates],
                {
                    hintContent: `Заказ от ${zone.orderMinPrice} ₽<br> Бесплатная доставка от ${zone.freeDeliveryOrder} ₽`,
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
            myPolygon.events.add("click", function (e) {
                var coords = e.get("coords");
                placemarkRef.current.geometry.setCoordinates(coords);
                getAddress(coords);
            });
            myPolygon.options._options.name = zone.name;
            myPolygon.options._options.deliveryPrice = zone.deliveryPrice;
            myPolygon.options._options.orderMinPrice = zone.orderMinPrice;
            myPolygon.options._options.freeDeliveryOrder =
                zone.freeDeliveryOrder;
            // Добавляем многоугольник на карту.
            mapRef.current.geoObjects.add(myPolygon);
        });

        // Блок подсказок для строки поиска
        const suggestView = new ymaps.SuggestView("suggest1", {
            // Приоритет для адресов в прямоугольнике, охватывающем все зоны доставки
            boundedBy: mapRef.current.geoObjects.getBounds(),
        });
        suggestView.events.add("select", (e) => {
            setSearchInputValue(e.get("item").value);
            confirmSerachHandler(e.get("item").value);
        });

        // Событие клика по карте определяет адрес
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

    const handleDetachedChange = (checked) => {
        setDetachedHouse(checked);
        if (checked) {
            setApartment("");
            setFloor("");
            setPorch("");
        }
    };

    const addAddressHandler = () => {
        // Проходим валидацию
        let choosenZone = null;
        if (coordinates) {
            mapRef.current.geoObjects.each((zone) => {
                if (
                    zone.geometry.getType() === "Polygon" &&
                    zone.geometry.contains(coordinates)
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
        }
        setIsAddressInZone(!!choosenZone);
        if (!validateFields() || !choosenZone) {
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
            detachedHouse,
        };

        handleChooseZoneDeliveryAddress(newAddress);
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

    let dialogProps = { open: modalOpen, maxWidth: "md", keepMounted: true };
    if (_isMobile()) {
        dialogProps.TransitionComponent = Transition;
        dialogProps.fullScreen = true;
        dialogProps.scroll = "body";
    }

    return (
        <Dialog
            {...dialogProps}
            className={"delivery-address-modal--dialog"}
            fullWidth
        >
            <div className="delivery-address-modal--wrapper">
                <div className="delivery-address-modal--title-container">
                    <h3>Доставка</h3>
                    <div className="delivery-address-modal--town">
                        <LocationOnIcon sx={{ color: "var(--main-color)" }} />
                        {config.CONFIG_town}
                    </div>
                </div>
                <TextField
                    size="small"
                    label="Введите улицу и дом"
                    value={searchInputValue}
                    multiline={_isMobile()}
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
                        width: "100%",
                        mb: 2,
                        "& fieldset": {
                            borderRadius: "20px",
                        },
                        flexGrow: 1,
                    }}
                    id="suggest1"
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={detachedHouse}
                            onChange={(event) => {
                                validateFields({
                                    value: apartment,
                                    name: "apartment",
                                });
                                handleDetachedChange(event.target.checked);
                            }}
                        />
                    }
                    label="Частный дом"
                    sx={{
                        mb: 2,
                        ml: 0,
                    }}
                />
                <Collapse in={!detachedHouse}>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
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
                                className="delivery-address-modal--sub-address"
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
                                className="delivery-address-modal--sub-address"
                            />
                        </Grid>
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
                                className="delivery-address-modal--sub-address"
                            />
                        </Grid>
                    </Grid>
                </Collapse>
                {/* <div
                    id={"yandex-map"}
                    className={"delivery-address-modal--map-container"}
                ></div> */}
                <Map
                    defaultState={{
                        center: config.deliveryZones.mapCenter || [
                                config.CONFIG_latitude,
                                config.CONFIG_longitude,
                            ] || [55.76, 37.64],
                        zoom: config.deliveryZones.mapZoom || 13,
                    }}
                    className={"delivery-address-modal--map-container"}
                    onLoad={(ymaps) => {
                        setMap(ymaps);
                        loadSuggest(ymaps);
                    }}
                    modules={["SuggestView", "Polygon", "geoObject.addon.hint"]}
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
                {!isAddressInZone && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        Выбранный адрес не попадает ни в одну зону доставки
                    </Alert>
                )}
                <div className="delivery-address-modal--buttons-container">
                    <Button
                        className="btn--outline-dark"
                        variant="button"
                        onClick={handleClose}
                    >
                        Закрыть
                    </Button>
                    <Button
                        className="btn--action"
                        variant="button"
                        onClick={addAddressHandler}
                    >
                        Подтвердить адрес
                    </Button>
                </div>
            </div>
        </Dialog>
    );
};

export default connectedWithYmaps(DeliveryAddressModal);
