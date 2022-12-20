import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenDeliveryModal } from "../redux/actions/deliveryAddressModal";
import {
    Alert,
    Button,
    Collapse,
    Dialog,
    IconButton,
    Slide,
    ToggleButtonGroup,
    ToggleButton,
    Zoom,
    Grid,
    TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { _isMobile } from "./helpers";
import { Map, SearchControl, withYMaps, Placemark } from "react-yandex-maps";
import "../css/deliveryAddressModal.css";
import { borderRadius } from "@mui/system";

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

    const [searchInputValue, setSearchInputValue] = useState("");
    const [coordinates, setCoordinates] = useState(null);

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
        placemarkRef.current.properties.set("iconCaption", "поиск...");
        ymaps.geocode(coords).then(function (res) {
            var firstGeoObject = res.geoObjects.get(0);

            placemarkRef.current.properties.set({
                // Формируем строку с данными об объекте.
                iconCaption: [
                    // Название населенного пункта или вышестоящее административно-территориальное образование.
                    firstGeoObject.getLocalities().length
                        ? firstGeoObject.getLocalities()
                        : firstGeoObject.getAdministrativeAreas(),
                    // Получаем путь до топонима, если метод вернул null, запрашиваем наименование здания.
                    firstGeoObject.getThoroughfare() ||
                        firstGeoObject.getPremise(),
                ]
                    .filter(Boolean)
                    .join(", "),
                // В качестве контента балуна задаем строку с адресом объекта.
                balloonContent: firstGeoObject.getAddressLine(),
            });
            setSearchInputValue(firstGeoObject.getAddressLine());
            confirmSerachHandler(firstGeoObject.getAddressLine());
        });
    }, []);

    const loadSuggest = (ymaps) => {
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
            // Область видимости геообъекта.
            const bounds = firstGeoObject.properties.get("boundedBy");
            setCoordinates(coords);

            // Получаем район
            const area = firstGeoObject.getLocalities().length
                ? firstGeoObject.getLocalities()
                : firstGeoObject.getAdministrativeAreas();
            // Получаем улицу
            const street = firstGeoObject.getThoroughfare();
            // Получаем номер дома
            const house = firstGeoObject.getPremiseNumber();
            // Получаем строку адресу
            const address = firstGeoObject.getAddressLine();

            console.log(area, street, house, address);

            // Если метка уже создана – просто передвигаем ее.
            // if (placemarkRef.current) {
            //     placemarkRef.current.geometry.setCoordinates(coords);
            // }
            // mapRef.current.setBounds(bounds, {
            //     // Проверяем наличие тайлов на данном масштабе.
            //     checkZoomRange: true,
            // });
        });
    }, []);

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
                    sx={{
                        mb: 3,
                        "& fieldset": {
                            borderRadius: "20px",
                        },
                        width: "100%",
                    }}
                    id="suggest1"
                />
                {/* <div
                    id={"yandex-map"}
                    className={"delivery-address-modal__map-container"}
                ></div> */}
                <Map
                    defaultState={{ center: [55.75, 37.57], zoom: 9 }}
                    className={"delivery-address-modal__map-container"}
                    onLoad={(ymaps) => loadSuggest(ymaps)}
                    modules={["SuggestView"]}
                    instanceRef={mapRef}
                >
                    <Placemark instanceRef={placemarkRef} />
                </Map>
            </div>
        </Dialog>
    );
};

export default connectedWithYmaps(DeliveryAddressModal);
