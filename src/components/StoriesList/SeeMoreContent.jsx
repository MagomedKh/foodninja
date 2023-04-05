import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Slide, Box, Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

const SeeMoreContent = ({
    closeSeeMore,
    seeMoreOpened,
    description,
    title,
    link,
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
                    <div className="see-more--inner-wrapper">
                        <h2>{title}</h2>
                        <div className="see-more--content-body">
                            {description}
                        </div>
                    </div>
                    {link ? (
                        <div className="see-more--inner-link-container">
                            <Button
                                className="see-more-collapsed--button"
                                variant="contained"
                                onClick={() => {
                                    window.open(link, "_blank");
                                }}
                            >
                                Подробнее
                            </Button>
                        </div>
                    ) : null}
                </div>
            </Box>
        </Slide>
    );
};

export default SeeMoreContent;
