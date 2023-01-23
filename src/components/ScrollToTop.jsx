import React, { useState, useEffect } from "react";
import { Zoom } from "@mui/material";
import { animateScroll } from "react-scroll";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
const ScrollToTop = () => {
    const scroll = animateScroll;

    const [showToTopBtn, setShowToTopBtn] = useState(false);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [showToTopBtn]);

    const handleToTopButton = () => {
        scroll.scrollToTop({ duration: 800 });
    };

    const handleScroll = () => {
        if (window.scrollY >= 600 && !showToTopBtn) {
            setShowToTopBtn(true);
        } else if (window.scrollY < 600 && showToTopBtn) {
            setShowToTopBtn(false);
        }
    };

    return (
        <Zoom in={showToTopBtn} timeout={300}>
            <div className="scroll-to-top-btn" onClick={handleToTopButton}>
                <FontAwesomeIcon icon={faAngleUp} />
            </div>
        </Zoom>
    );
};

export default ScrollToTop;
