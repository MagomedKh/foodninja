import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react/swiper-react";
import { FreeMode, Navigation } from "swiper";
import { Container, Slide } from "@mui/material";
import StoriesSlide from "./StoriesSlide";
import SeeMoreContent from "./SeeMoreContent";
import StoriesModal from "./StoriesModal";
import Cookies from "universal-cookie";
import { _clone, _isMobile } from "../helpers";
import { addDays } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import "../../css/stories.css";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const StoriesList = () => {
    const cookies = useMemo(() => new Cookies(), []);

    const viewedStories = cookies.get("viewedStories") || [];

    const stories = useSelector((state) => state.stories.stories);

    const [localStories, setLocalStories] = useState(null);
    const [storiesDialogOpen, setStoriesDialogOpen] = useState(false);
    const [openedStackIndex, setOpenedStackIndex] = useState(false);

    const sortStacks = useCallback((oldStacks) => {
        return oldStacks.sort((a, b) => {
            return a.isViewed === b.isViewed ? 0 : a.isViewed ? 1 : -1;
        });
    }, []);

    useEffect(() => {
        if (stories?.length) {
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
            const stacksWithViewedProp = withSeeMoreStacks.map((stack) => {
                return {
                    ...stack,
                    isViewed: viewedStories?.includes(stack.id),
                };
            });
            const sortedStacks = sortStacks(stacksWithViewedProp);

            setLocalStories(sortedStacks);
        }
    }, [stories]);

    useEffect(() => {
        if (
            localStories &&
            (openedStackIndex === 0 || openedStackIndex > 0) &&
            !localStories[openedStackIndex].isViewed
        ) {
            const temp = localStories.map((el) => _clone(el));

            temp[openedStackIndex].isViewed = true;

            if (!viewedStories?.includes(temp[openedStackIndex].id)) {
                const newViewedStories = [
                    ...viewedStories,
                    temp[openedStackIndex].id,
                ];
                cookies.set("viewedStories", newViewedStories, {
                    path: "/",
                    expires: addDays(new Date(), 30),
                });
            }
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

    const handleStackChange = (index) => {
        setOpenedStackIndex(index);
    };

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
        <Container sx={{ paddingTop: _isMobile() ? "16px" : 0 }}>
            <div className="stories-list--container">
                <Swiper
                    slidesPerView="auto"
                    spaceBetween={_isMobile() ? 10 : 20}
                    freeMode={true}
                    navigation={{
                        prevEl: ".stories-list--left-arrow",
                        nextEl: ".stories-list--right-arrow",
                    }}
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
                <FontAwesomeIcon
                    icon={faAngleLeft}
                    className="stories-list--left-arrow"
                />
                <FontAwesomeIcon
                    icon={faAngleRight}
                    className="stories-list--right-arrow"
                />
            </div>
            {storiesDialogOpen && openedStackIndex >= 0 ? (
                <StoriesModal
                    open={storiesDialogOpen && openedStackIndex >= 0}
                    localStories={localStories}
                    handleClose={handleClose}
                    openedStackIndex={openedStackIndex}
                    handleStackChange={handleStackChange}
                />
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
