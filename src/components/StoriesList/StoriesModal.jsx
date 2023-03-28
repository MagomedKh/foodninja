import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react/swiper-react";
import { EffectCoverflow } from "swiper";
import { Dialog } from "@mui/material";
import { _clone, _isMobile } from "../helpers";
import "../../css/stories.css";
import StoriesStack from "./StoriesStack";

const StoriesModal = ({
    open,
    handleClose,
    localStories,
    openedStackIndex,
    handleStackChange,
}) => {
    const [swiper, setSwiper] = useState();

    const handleOpenNextStack = useCallback(() => {
        if (swiper.activeIndex === localStories.length - 1) {
            handleClose();
        } else swiper.slideNext();
    }, [swiper]);

    const handleOpenPrevStack = useCallback(() => {
        swiper.slidePrev();
    }, [swiper]);
    return (
        <Dialog
            open={open}
            fullScreen
            BackdropProps={{
                style: { backgroundColor: "rgba(0,0,0,0.8)" },
            }}
            sx={{
                "& .MuiPaper-root": {
                    backgroundColor: "unset",
                    // width: "100",
                    // borderRadius: _isMobile() ? "0px" : "20px",
                },
            }}
            className={"stories--dialog"}
        >
            <Swiper
                slidesPerView="auto"
                spaceBetween={_isMobile() ? 0 : 50}
                centeredSlides={true}
                initialSlide={openedStackIndex}
                className="stories-swiper"
                modules={[EffectCoverflow]}
                effect={_isMobile() ? "slide" : "coverflow"}
                coverflowEffect={{
                    rotate: 0,
                    stretch: 25,
                    scale: 0.85,
                    depth: 0,
                    modifier: 1,
                    slideShadows: false,
                }}
                onSlideChange={(swiper) => {
                    handleStackChange(swiper.activeIndex);
                }}
                slideToClickedSlide={true}
                preventClicksPropagation={false}
                touchStartPreventDefault={false}
                onSwiper={(swiper) => setSwiper(swiper)}
            >
                {localStories.map((stack) => (
                    <SwiperSlide key={stack.id}>
                        {({ isActive }) => (
                            <StoriesStack
                                stack={stack}
                                handleOpenPrevStack={handleOpenPrevStack}
                                handleOpenNextStack={handleOpenNextStack}
                                active={isActive}
                                handleClose={handleClose}
                            />
                        )}
                    </SwiperSlide>
                ))}
            </Swiper>
        </Dialog>
    );
};

export default StoriesModal;
