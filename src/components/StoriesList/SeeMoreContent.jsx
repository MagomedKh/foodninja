import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Slide } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

const SeeMoreContent = ({ closeSeeMore, seeMoreOpened }) => {
    const [open, setOpen] = useState(true);

    const video = document.querySelector(".stories-video");

    useEffect(() => {
        setOpen(true);
    }, []);

    const handleClose = () => {
        setOpen(false);
        if (video) {
            video.play();
        }
    };

    const handleEnd = () => {
        closeSeeMore();
    };

    return (
        <Slide in={open} direction="up" onExited={handleEnd}>
            <div className="see-more">
                <div
                    className="see-more--close-container"
                    onClick={handleClose}
                >
                    <div>Скрыть</div>
                    <FontAwesomeIcon icon={faAngleDown} />
                </div>
                <h2>Гарантия качества</h2>
                <div className="see-more--content-body">
                    <div>
                        Мы всегда на твоей стороне и в ответе за качество нашей
                        продукции!
                    </div>
                    <div>
                        <a href="https://vk.com/food.ninja">
                            Заходи к нам в группу!
                        </a>
                    </div>
                </div>
            </div>
        </Slide>
    );
};

export default SeeMoreContent;
