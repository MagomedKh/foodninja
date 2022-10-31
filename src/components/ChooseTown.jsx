import * as React from "react";
import { Dialog } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { setTownModal } from "../redux/actions/config";
import "../css/choose-town.css";
import { _isMobile } from "./helpers";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Slide from "@mui/material/Slide";
import Cookies from "universal-cookie";

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
    const cookies = new Cookies();
    const currentTown = cookies.get("currentTown");

    React.useEffect(() => {
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
                        <h2 className="modal-alert--title">Выберите город</h2>
                        <div className="modal-alert--inner">
                            {config.data.towns.map((value, index) => (
                                <div key={index} className="town-link">
                                    <a
                                        href={`https://${value.url}/?saveTown=true`}
                                    >
                                        {value.name}
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </Dialog>
            ) : (
                ""
            )}
        </div>
    );
}
