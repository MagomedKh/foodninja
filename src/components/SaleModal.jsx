import React, { useCallback, useEffect } from "react";
import { Dialog, IconButton, Slide } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { _getPlatform, _isMobile } from "./helpers";
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

   const urlChangeEventListener = () => {
      let url = new URL(window.location.href);
      if (!url.searchParams.has("sale_id")) {
         handleCloseSaleModal();
      }
   };

   useEffect(() => {
      if (saleOpenModal) {
         window.addEventListener("popstate", urlChangeEventListener);
      }
      return () => {
         window.removeEventListener("popstate", urlChangeEventListener);
      };
   }, [saleOpenModal]);

   useEffect(() => {
      saleOpenModal
         ? setTimeout(() => {
              window.addEventListener("click", closeModalOnOutClick);
           })
         : window.removeEventListener("click", closeModalOnOutClick);
   }, [saleOpenModal]);

   const closeModalOnOutClick = useCallback((e) => {
      if (!e.target.closest(".sale-modal")) {
         handleCloseSaleModal();
      }
   }, []);

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
         onClose={(event, reason) => {
            if (reason === "escapeKeyDown") {
               handleCloseSaleModal();
            }
         }}
      >
         <IconButton
            edge="start"
            color="inherit"
            onClick={handleCloseSaleModal}
            aria-label="close"
            className="modal-close"
            sx={
               _getPlatform !== "vk" && _isMobile()
                  ? {
                       right: "17px",
                       left: "unset",
                    }
                  : {}
            }
         >
            <CloseIcon />
         </IconButton>
         <div className="sale-modal--container">
            <div className="sale-modal">
               <h2 className="sale-modal--title">{activeSale.saleTitle}</h2>

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
