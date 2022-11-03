import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import "../css/system-alerts.css";
import { IconButton, Snackbar, Slide } from "@mui/material";
import { updateAlerts } from "../redux/actions/systemAlerts";
import CloseIcon from "@mui/icons-material/Close";
import { _isMobile } from "./helpers";

function TransitionRight(props) {
    return <Slide {...props} direction="right" />;
}

export default function SystemAlerts({ initStatus = false }) {
    const dispatch = useDispatch();
    const { alerts } = useSelector(({ systemAlerts }) => {
        return {
            alerts: systemAlerts,
        };
    });

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        dispatch(
            updateAlerts({
                open: false,
                message: "",
            })
        );
    };

    return (
        <Snackbar
            open={alerts.open}
            anchorOrigin={{
                vertical: _isMobile() ? "top" : "bottom",
                horizontal: "left",
            }}
            autoHideDuration={6000}
            onClose={handleClose}
            TransitionComponent={TransitionRight}
            message={alerts.message}
            key="TransitionRight"
            action={
                <React.Fragment>
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        sx={{ p: 0.5 }}
                        onClick={handleClose}
                    >
                        <CloseIcon />
                    </IconButton>
                </React.Fragment>
            }
        />
    );
}
