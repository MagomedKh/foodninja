import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button, Snackbar, Slide, Box, Typography } from "@mui/material";
import { _isMobile } from "./helpers";
import Cookies from "universal-cookie";
import { addDays } from "date-fns";

function TransitionRight(props) {
    return <Slide {...props} direction="right" />;
}

const SubscribeSnackbar = () => {
    const [subscribeOpen, setSubscribeOpen] = useState(false);
    const { data: config } = useSelector((state) => state.config);

    const cookies = new Cookies();

    const agreedToSubscribe = cookies.get("agreedToSubscribe");

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        cookies.set("agreedToSubscribe", "no", {
            path: "/",
            expires: addDays(new Date(), 7),
        });
        setSubscribeOpen(false);
    };

    const handleConfirm = () => {
        cookies.set("agreedToSubscribe", "yes", {
            path: "/",
            expires: addDays(new Date(), 90),
        });
        setSubscribeOpen(false);
    };

    useEffect(() => {
        const subscribeTimeout = setTimeout(() => {
            setSubscribeOpen(true);
        }, 15000);
        return () => clearTimeout(subscribeTimeout);
    }, []);

    if (
        agreedToSubscribe ||
        !config.CONFIG_vk_mailing_text ||
        !config.CONFIG_vk_mailing_link
    ) {
        return null;
    }
    return (
        <Snackbar
            open={subscribeOpen}
            anchorOrigin={{
                vertical: _isMobile() ? "top" : "bottom",
                horizontal: "left",
            }}
            onClose={handleClose}
            TransitionComponent={TransitionRight}
            message={
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Typography sx={{ fontWeight: 600, fontSize: "20px" }}>
                        {config.CONFIG_vk_mailing_title}
                    </Typography>
                    <Typography sx={{ mb: 1 }}>
                        {config.CONFIG_vk_mailing_text}
                    </Typography>
                    <Box sx={{ display: "flex", flexBasis: "0.5" }}>
                        <Button
                            variant="outlined"
                            onClick={handleClose}
                            sx={{ flexGrow: 1 }}
                        >
                            Нет
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            variant="contained"
                            sx={{ ml: 1, flexGrow: 1, flexBasis: "0.5" }}
                            href={config.CONFIG_vk_mailing_link}
                            target="_blank"
                            className="btn--action"
                        >
                            Да
                        </Button>
                    </Box>
                </Box>
            }
            key="TransitionRight"
            action={<></>}
            sx={{
                mb: 4,
                "& .MuiPaper-root": {
                    boxShadow: "0 0 20px rgb(0 0 0 / 10%)",
                    borderRadius: "15px",
                },
                "& .MuiSnackbarContent-root": {
                    backgroundColor: "#fff",
                    color: "black",
                },
                "& .MuiSnackbarContent-message": {
                    width: "100%",
                },
            }}
            className="subscribe-snackbar"
        />
    );
};

export default SubscribeSnackbar;
