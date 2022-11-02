import React, { useState, useEffect } from "react";
import { Dialog } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { setTownModal } from "../redux/actions/config";
import "../css/choose-town.css";
import { _isMobile } from "./helpers";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { Slide, TextField } from "@mui/material";
import Cookies from "universal-cookie";
import Fuse from "fuse.js";

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

    const cookies = new Cookies();
    const currentTown = cookies.get("currentTown");
    const fuse = new Fuse(config.data.towns, {
        keys: ["name"],
        minMatchCharLength: 1,
        threshold: 0.2,
    });

    const inputChangeHandler = (event) => {
        setInputValue(event.target.value);
        if (!event.target.value) {
            setFilteredTowns(null);
            return;
        }
        const temp = fuse.search(event.target.value);
        setFilteredTowns(temp);
    };

    const renderedTownsName = filteredTowns
        ? filteredTowns.map((value, index) => (
              <div key={index} className="town-link">
                  <a href={`https://${value.item.url}/?saveTown=true`}>
                      {value.item.name}
                  </a>
              </div>
          ))
        : config.data.towns.map((value, index) => (
              <div key={index} className="town-link">
                  <a href={`https://${value.url}/?saveTown=true`}>
                      {value.name}
                  </a>
              </div>
          ));

    useEffect(() => {
        if (config.status && currentTown === undefined)
            dispatch(setTownModal(true));

        return dispatch(setTownModal(false));
    }, [config.status]);

    const handleAlertClose = () => {
        dispatch(setTownModal(false));
    };

    let dialogProps = { open: config.openTownModal, maxWidth: "md" };
    if (_isMobile()) {
        dialogProps.TransitionComponent = Transition;
        dialogProps.fullScreen = true;
        dialogProps.scroll = "body";
    }

    return (
        <div className="choose-town--block">
            {config.data.towns ? (
                <Dialog maxWidth="md" {...dialogProps}>
                    <div className="modal-alert--wrapper choose-town">
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleAlertClose}
                            aria-label="close"
                            className="modal-close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <h2>Выберите город</h2>
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
                        </div>
                        {renderedTownsName}
                    </div>
                </Dialog>
            ) : (
                ""
            )}
        </div>
    );
}
