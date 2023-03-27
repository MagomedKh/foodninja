import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Dialog } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { setTownModal } from "../redux/actions/config";
import "../css/choose-town.css";
import { _isMobile, _getDomain, _getPlatform } from "./helpers";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { Slide, TextField } from "@mui/material";
import Cookies from "universal-cookie";
import Fuse from "fuse.js";
import { addMinutes } from "date-fns";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function ChooseTown() {
    const dispatch = useDispatch();

    const { config } = useSelector(({ config }) => {
        return {
            config: config,
        };
    });

    const [inputValue, setInputValue] = useState("");
    const [filteredTowns, setFilteredTowns] = useState(null);
    const [redirect, setRedirect] = useState(false);

    const cookies = useMemo(() => new Cookies(), []);
    const currentTown = cookies.get("currentSite");
    const chooseTownShown = cookies.get("chooseTownShown");
    const fuse = new Fuse(config.data.towns, {
        keys: ["name"],
        minMatchCharLength: 1,
        threshold: 0.2,
    });

    useEffect(() => {
        if (
            config.data.CONFIG_main_site_choose_town === "on" ||
            (!chooseTownShown &&
                config.data.towns &&
                config.data.towns.length > 1 &&
                ((config.status &&
                    _getDomain() === config.data.baseDomain &&
                    config.data.CONFIG_always_choose_town === "on" &&
                    window.location.href !==
                        `https://${config.data.baseDomain}/?saveTown=true`) ||
                    (config.status &&
                        _getDomain() === config.data.baseDomain &&
                        config.data.CONFIG_always_choose_town !== "on" &&
                        !currentTown)))
        ) {
            dispatch(setTownModal(true));
            cookies.set("chooseTownShown", "true", {
                path: "/",
                expires: addMinutes(new Date(), 30),
            });
        } else {
            dispatch(setTownModal(false));
        }
    }, [config.status]);

    useEffect(() => {
        if (redirect && !config.openTownModal) {
            setRedirect(false);
            window.location.href = redirect;
        }
    }, [redirect]);

    const inputChangeHandler = useCallback((event) => {
        setInputValue(event.target.value);
        if (!event.target.value) {
            setFilteredTowns(groupedTowns);
            return;
        }
        const temp = fuse.search(event.target.value).map((el) => el.item);
        setFilteredTowns(groupTowns(temp));
    }, []);

    useEffect(() => {
        setFilteredTowns(groupedTowns);
    }, [config.data.towns]);

    const groupTowns = useCallback((arr) => {
        const map = arr.reduce((acc, val) => {
            if (val.name) {
                let char = val.name.charAt(0).toUpperCase();
                acc[char] = [].concat(acc[char] || [], val);
                return acc;
            } else return acc;
        }, {});
        const res = Object.keys(map).map((el) => ({
            letter: el,
            towns: map[el],
        }));
        const sortedRes = res.sort((a, b) => {
            if (a.letter < b.letter) {
                return -1;
            }
            if (a.letter > b.letter) {
                return 1;
            }
            return 0;
        });
        return sortedRes;
    }, []);

    const groupedTowns = useMemo(() => {
        if (config.data.towns) {
            const initial = groupTowns(config.data.towns);
            return initial;
        }
    }, [config.data.towns]);

    const renderedTownsName =
        filteredTowns &&
        filteredTowns.map((group, index) => {
            return (
                <div className="town-group" key={index}>
                    <span className="town-letter">{group.letter}</span>
                    {group.towns.map((town, index) => (
                        <div
                            className="town-link"
                            onClick={() => {
                                _getPlatform() === "vk"
                                    ? setRedirect(
                                          `https://${town.url}/?rest-api=vk_start`
                                      )
                                    : setRedirect(
                                          `https://${town.url}/?saveTown=true&platform=getPlatform()`
                                      );
                                handleAlertClose();
                            }}
                            key={index}
                        >
                            {town.name}
                        </div>
                    ))}
                </div>
            );
        });

    const handleAlertClose = useCallback(() => {
        dispatch(setTownModal(false));
    }, []);

    let dialogProps = { open: config.openTownModal, maxWidth: "md" };
    if (_isMobile()) {
        if (
            !config.data.CONFIG_main_site_choose_town ||
            config.data.CONFIG_main_site_choose_town !== "on"
        ) {
            dialogProps.TransitionComponent = Transition;
        }

        dialogProps.fullScreen = true;
        dialogProps.scroll = "body";
    }

    return (
        <div className="choose-town--block">
            {config.data.towns ? (
                <Dialog
                    maxWidth="md"
                    {...dialogProps}
                    sx={{
                        "& .MuiPaper-root": {
                            borderRadius: _isMobile() ? "0px" : "20px",
                        },
                    }}
                    onClose={(event, reason) => {
                        if (
                            reason === "escapeKeyDown" &&
                            config.data.CONFIG_main_site_choose_town !== "on"
                        ) {
                            handleAlertClose();
                        }
                    }}
                >
                    <div className="modal-alert--wrapper choose-town">
                        {config.data.CONFIG_main_site_choose_town ===
                        "on" ? null : (
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={handleAlertClose}
                                aria-label="close"
                                className="modal-close"
                            >
                                <CloseIcon />
                            </IconButton>
                        )}
                        <img
                            src={config.data.CONFIG_company_logo_main}
                            className="choose-town--logo"
                            alt="Логотип"
                        />
                        <div className="modal-alert--inner">
                            <TextField
                                size="small"
                                label="Поиск города"
                                value={inputValue}
                                onChange={inputChangeHandler}
                                sx={{
                                    mb: 2,
                                    "& fieldset": {
                                        borderRadius: "20px",
                                    },
                                }}
                                fullWidth
                            />
                            {renderedTownsName}
                        </div>
                    </div>
                </Dialog>
            ) : (
                ""
            )}
        </div>
    );
}
