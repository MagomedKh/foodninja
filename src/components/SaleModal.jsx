import React from "react";
import { Dialog, IconButton, Slide } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { _isMobile } from "./helpers";
import "../css/sale.css";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const SaleModal = ({ saleOpenModal, activeSale, handleCloseSaleModal }) => {
    let dialogSaleProps = { open: saleOpenModal, maxWidth: "md" };
    if (_isMobile()) {
        dialogSaleProps.TransitionComponent = Transition;
        dialogSaleProps.fullScreen = true;
    }

    if (!activeSale) {
        return null;
    }

    return (
        <Dialog
            {...dialogSaleProps}
            className="sale-dialog"
            sx={{
                "& .MuiPaper-root": {
                    borderRadius: _isMobile() ? "0px" : "15px",
                },
            }}
        >
            <IconButton
                edge="start"
                color="inherit"
                onClick={handleCloseSaleModal}
                aria-label="close"
                className="modal-close"
            >
                <CloseIcon />
            </IconButton>
            <div className="sale-modal--container">
                <div className="sale-modal">
                    <img
                        className="sale--img"
                        src={activeSale.saleImg}
                        alt={activeSale.saleTitle}
                    />

                    <h2 className="sale-modal--title">
                        {activeSale.saleTitle}
                    </h2>

                    <div
                        className="sale--content"
                        dangerouslySetInnerHTML={{
                            __html: activeSale.saleContent,
                        }}
                    ></div>
                </div>
            </div>
        </Dialog>
    );
};

export default SaleModal;
