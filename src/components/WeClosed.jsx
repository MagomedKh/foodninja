import React, { useState, useEffect } from "react";
import { Dialog, IconButton, Slide } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useWorkingStatus from "../hooks/useWorkingStatus";
import { _isMobile } from "./helpers";
import catSleep from "../img/cat-sleep.svg";
import "../css/we-closed.css";
import { useSelector } from "react-redux";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function WeClosed() {
    const { workingStatus, maintenanceStatus } = useWorkingStatus();

    const {
        CONFIG_maintenance_text,
        CONFIG_maintenance_title,
        CONFIG_maintenance_type,
    } = useSelector((state) => state.config.data);

    const [openWeClosedModal, setOpenWeClosedModal] = useState(false);

    useEffect(() => {
        if (!workingStatus || !maintenanceStatus) {
            setOpenWeClosedModal(true);
        }
    }, [workingStatus, maintenanceStatus]);

    const handleModalClose = () => {
        setOpenWeClosedModal(false);
    };

    if (workingStatus && maintenanceStatus) return null;

    let dialogProps = { open: openWeClosedModal, maxWidth: "md" };
    if (_isMobile()) {
        dialogProps.TransitionComponent = Transition;
        dialogProps.fullScreen = true;
        dialogProps.scroll = "body";
    }
    return (
        <Dialog
            maxWidth="md"
            {...dialogProps}
            sx={{
                "& .MuiPaper-root": {
                    borderRadius: _isMobile() ? "0px" : "20px",
                },
            }}
        >
            <div className="modal-alert--wrapper we-closed-modal">
                {!maintenanceStatus &&
                CONFIG_maintenance_type !== "canViewSite" ? null : (
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleModalClose}
                        aria-label="close"
                        className="modal-close"
                    >
                        <CloseIcon />
                    </IconButton>
                )}
                <img src={catSleep} className="cat-sleep-img" />
                <h2 className="main-color">
                    {!maintenanceStatus && CONFIG_maintenance_title
                        ? CONFIG_maintenance_title
                        : "Сейчас мы закрыты."}
                </h2>
                <div>
                    {!maintenanceStatus
                        ? CONFIG_maintenance_text
                        : "Вы можете оформить предзаказ ко времени."}
                </div>
            </div>
        </Dialog>

        // <div className="deliveryStatus">
        //     <div className="deliveryClosed">
        //         <div className="main-color">Сейчас мы закрыты.</div>
        //         <div>Вы можете оформить предзаказ ко времени.</div>
        //     </div>
        // </div>
    );
}
