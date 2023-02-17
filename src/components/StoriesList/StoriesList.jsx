import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react/swiper-react";
import { FreeMode, Navigation } from "swiper";
import Cookies from "universal-cookie";
import { Container, Dialog, IconButton, Slide } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAngleRight,
    faAngleLeft,
    faAngleUp,
} from "@fortawesome/free-solid-svg-icons";
import video from "../../img/video.mp4";
import StoriesSlide from "./StoriesSlide";
import { _clone, _isMobile } from "../helpers";
import "../../css/stories.css";
import SeeMoreCollapsed from "./SeeMoreCollapsed";
import SeeMoreContent from "./SeeMoreContent";
import StoriesStack from "./StoriesStack";

const stories = [
    {
        id: 1,
        isViewed: false,
        previewImage:
            "https://dev.foodninja.pro/wp-content/uploads/2022/05/3vvbtqigsnlmk8ivukljer4rz14qank2ftsi5wlfaokz2rgdg-buemyelc7muzw_fcgkaldl793tbs9tcd65mhu_.jpg",
        stories: [
            {
                url: video,
                type: "video",
                seeMore: "yeeeas",
                seeMoreCollapsed: SeeMoreCollapsed,
            },
            {
                url: "https://dev.foodninja.pro/wp-content/uploads/2022/05/3vvbtqigsnlmk8ivukljer4rz14qank2ftsi5wlfaokz2rgdg-buemyelc7muzw_fcgkaldl793tbs9tcd65mhu_.jpg",
                type: "image",
            },
        ],
    },
    {
        id: 2,
        isViewed: false,
        previewImage:
            "https://sushi45.ru/wp-content/uploads/2020/05/dr-sajt-mobail-5.jpg",
        stories: [
            {
                url: "https://sushi45.ru/wp-content/uploads/2020/05/dr-sajt-mobail-5.jpg",
                type: "image",
                seeMore: "yeeeas",
            },
            {
                url: "https://sun9-28.userapi.com/impg/vWJUNJSnxIhBXkPJj1LzMF3AipuMELDqtFbCTQ/ikvHWPM01yo.jpg?size=1080x1080&quality=96&sign=70545fe6d3d216a1ca78de8daaf5cbae&type=album",
                type: "image",
                seeMore: "yeeeas",
            },
        ],
    },
    {
        id: 3,
        isViewed: false,
        previewImage:
            "https://sushi45.ru/wp-content/uploads/2020/05/banner-sajt-set-za-otzyv-mobile.jpg",
        stories: [
            {
                url: "https://sushi45.ru/wp-content/uploads/2020/05/banner-sajt-set-za-otzyv-mobile.jpg",
                type: "image",
            },
            {
                url: "https://dev.foodninja.pro/wp-content/uploads/2022/05/33-768x768.jpg",
                type: "image",
            },
        ],
    },
    {
        id: 4,
        isViewed: false,
        previewImage:
            "https://sushi45.ru/wp-content/uploads/2020/05/mors-sajt-mobail.jpg",
        stories: [
            {
                url: "https://sun9-14.userapi.com/impg/R1_a3wgMt3fRakmlTPx5oBfo-N-sVrSe2llSPA/zXUTCfZZOWc.jpg?size=1080x1080&quality=96&sign=de035520a9a7d79dba1d404f395a2ffb&type=album",
                type: "image",
            },
            {
                url: "https://dev.foodninja.pro/wp-content/uploads/2022/05/3vvbtqigsnlmk8ivukljer4rz14qank2ftsi5wlfaokz2rgdg-buemyelc7muzw_fcgkaldl793tbs9tcd65mhu_.jpg",
                type: "image",
            },
        ],
    },
];

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const StoriesList = () => {
    const cookies = useMemo(() => new Cookies(), []);

    const [localStories, setLocalStories] = useState(null);
    const [storiesDialogOpen, setStoriesDialogOpen] = useState(false);
    const [openedStackIndex, setOpenedStackIndex] = useState(false);

    const sortStacks = useCallback((oldStacks) => {
        return oldStacks.sort((a, b) => {
            return a.isViewed === b.isViewed ? 0 : a.isViewed ? 1 : -1;
        });
    }, []);

    useEffect(() => {
        const withSeeMoreStacks = stories.map((stack) => {
            return {
                ...stack,
                stories: stack.stories.map((story) => {
                    if (story.seeMore) {
                        return {
                            ...story,
                            seeMore: ({ close }) => (
                                <SeeMoreContent close={close} />
                            ),
                        };
                    } else {
                        return story;
                    }
                }),
            };
        });
        const sortedStacks = sortStacks(withSeeMoreStacks);

        setLocalStories(sortedStacks);
    }, []);

    useEffect(() => {
        if (
            localStories &&
            (openedStackIndex === 0 || openedStackIndex > 0) &&
            !localStories[openedStackIndex].isViewed
        ) {
            const temp = localStories.map((el) => _clone(el));
            temp[openedStackIndex].isViewed = true;
            setLocalStories(temp);
        }
    }, [openedStackIndex]);

    const handleClose = useCallback(() => {
        const sortedStacks = sortStacks(localStories);
        setLocalStories(sortedStacks);
        setStoriesDialogOpen(false);
        setOpenedStackIndex(false);
    }, [localStories]);

    const handleOpenStack = useCallback((stackId) => {
        setStoriesDialogOpen(true);
        setOpenedStackIndex(stackId);
    }, []);

    const handleOpenNextStack = useCallback(() => {
        if (openedStackIndex + 1 > stories.length - 1) {
            handleClose();
        } else {
            setOpenedStackIndex(openedStackIndex + 1);
        }
    }, [openedStackIndex]);

    const handleOpenPrevStack = useCallback(() => {
        if (openedStackIndex - 1 < 0) {
            handleClose();
        } else {
            setOpenedStackIndex(openedStackIndex - 1);
        }
    }, [openedStackIndex]);

    let dialogProps = {
        open: storiesDialogOpen && openedStackIndex >= 0,
        maxWidth: "md",
    };
    if (_isMobile()) {
        dialogProps.TransitionComponent = Transition;
        dialogProps.fullScreen = true;
        dialogProps.scroll = "body";
    }

    if (!localStories) {
        return null;
    }

    return (
        <Container>
            <div className="stories-list--container">
                <Swiper
                    slidesPerView="auto"
                    spaceBetween={20}
                    // breakpoints={{
                    //     320: {
                    //         slidesPerView: 1,
                    //         spaceBetweenSlides: 5,
                    //     },
                    //     600: {
                    //         slidesPerView: 2,
                    //         spaceBetweenSlides: 5,
                    //     },
                    //     991: {
                    //         slidesPerView: 3,
                    //         spaceBetweenSlides: 5,
                    //     },
                    //     1240: {
                    //         slidesPerView: 3,
                    //         spaceBetweenSlides: 5,
                    //     },
                    //     1600: {
                    //         slidesPerView: 4,
                    //         spaceBetweenSlides: 5,
                    //     },
                    // }}
                    freeMode={true}
                    navigation={true}
                    modules={[FreeMode, Navigation]}
                    className="stories-list--container reccomend-products-swiper"
                >
                    {localStories.map((stack, index) => (
                        <SwiperSlide
                            key={stack.id}
                            className="reccomend-slide reccomend-addons-slide reccomend-slide--mini"
                        >
                            <StoriesSlide
                                stack={stack}
                                stackIndex={index}
                                handleOpenStack={handleOpenStack}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            {storiesDialogOpen && openedStackIndex >= 0 ? (
                <Dialog
                    maxWidth="md"
                    fullWidth
                    {...dialogProps}
                    sx={{
                        "& .MuiPaper-root": {
                            width: "auto",
                            borderRadius: _isMobile() ? "0px" : "20px",
                        },
                    }}
                    className={"stories--dialog"}
                >
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                        className="modal-close"
                    >
                        <CloseIcon />
                    </IconButton>

                    <FontAwesomeIcon
                        icon={faAngleLeft}
                        className="stories--dialog-left-arrow"
                        onClick={handleOpenPrevStack}
                    />
                    {/* <StoriesContainer
                        stack={localStories[openedStackIndex]}
                        handleOpenPrevStack={handleOpenPrevStack}
                        handleOpenNextStack={handleOpenNextStack}
                    /> */}
                    <StoriesStack
                        stack={localStories[openedStackIndex]}
                        handleOpenPrevStack={handleOpenPrevStack}
                        handleOpenNextStack={handleOpenNextStack}
                    />
                    <FontAwesomeIcon
                        icon={faAngleRight}
                        className="stories--dialog-right-arrow"
                        onClick={handleOpenNextStack}
                    />
                </Dialog>
            ) : null}
        </Container>
    );
};

const Content = ({ action, isPaused, image }) => {
    useEffect(() => {
        setTimeout(() => action("play"));
    }, []);

    return <img src={image} />;
};

export default StoriesList;
