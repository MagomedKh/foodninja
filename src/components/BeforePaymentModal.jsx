import React from "react";
import { Button, Dialog, IconButton, Slide } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { _isMobile } from "./helpers";
import "../css/before-payment-modal.css";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const BeforePaymentModal = ({
    openModal,
    beforePaymentConfirm,
    beforePaymentCancel,
    content,
}) => {
    let dialogProps = { open: openModal, maxWidth: "md" };
    if (_isMobile()) {
        dialogProps.TransitionComponent = Transition;
        dialogProps.scroll = "body";
    }
    return (
        <Dialog
            maxWidth="md"
            {...dialogProps}
            sx={{
                "& .MuiPaper-root": {
                    borderRadius: "20px",
                },
            }}
        >
            <div className="modal-alert--wrapper before-payment-modal">
                <IconButton
                    edge="start"
                    color="inherit"
                    onClick={beforePaymentCancel}
                    aria-label="close"
                    className="modal-close"
                >
                    <CloseIcon />
                </IconButton>
                <h2 className="main-color">Внимание</h2>
                <div
                    className="before-payment-modal--content"
                    dangerouslySetInnerHTML={{
                        __html: content,
                    }}
                ></div>
                <div className="before-payment-modal--buttons">
                    <Button
                        className="btn btn--outline-dark"
                        onClick={beforePaymentCancel}
                    >
                        Отмена
                    </Button>
                    <Button
                        variant="button"
                        className="btn btn--action"
                        onClick={beforePaymentConfirm}
                    >
                        Продолжить
                    </Button>
                </div>
            </div>
        </Dialog>
    );
};

export default BeforePaymentModal;
