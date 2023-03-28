import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Slide, Box } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

const SeeMoreContent = ({
    closeSeeMore,
    seeMoreOpened,
    description,
    title,
    active,
}) => {
    const video = document.querySelector(".stories-video");

    // useEffect(() => {
    //     setOpen(true);
    // }, []);

    useEffect(() => {
        if (!active && seeMoreOpened) {
            closeSeeMore();
        }
    }, [active]);

    return (
        <Slide in={seeMoreOpened} direction="up">
            <Box
                sx={{
                    position: "absolute",
                    height: "100%",
                    width: "100%",
                    zIndex: "9999",
                }}
            >
                <div className="see-more">
                    <div
                        className="see-more--close-container"
                        onClick={closeSeeMore}
                    >
                        <div>Скрыть</div>
                        <FontAwesomeIcon icon={faAngleDown} />
                    </div>
                    <h2>{title}</h2>
                    <div className="see-more--content-body">{description}</div>
                </div>
            </Box>
        </Slide>
    );
};

export default SeeMoreContent;
