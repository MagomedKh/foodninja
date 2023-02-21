import React, {
    useState,
    useMemo,
    useCallback,
    useEffect,
    useRef,
} from "react";
import { Box } from "@mui/material";
import SeeMoreCollapsed from "./SeeMoreCollapsed";
import SeeMoreContent from "./SeeMoreContent";
import { _isMobile } from "../helpers";
import StoriesProgressBar from "./StoriesProgressBar";
import StoriesContent from "./StoriesContent";

const StoriesStack = ({ stack, handleOpenPrevStack, handleOpenNextStack }) => {
    const stackContainerRef = useRef(null);
    const videoRef = useRef(null);
    const longPressRef = useRef(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const [seeMoreOpened, setSeeMoreOpened] = useState(false);
    const [duration, setDuration] = useState(2000);

    let timerId;

    useEffect(() => {
        setCurrentIndex(0);
        if (seeMoreOpened) {
            setSeeMoreOpened(false);
        }
        if (paused) {
            setPaused(false);
        }
        if (_isMobile()) {
            const appHeight = () => {
                if (stackContainerRef.current) {
                    stackContainerRef.current.style.height = `${window.innerHeight}px`;
                    stackContainerRef.current.style.width = `${window.innerWidth}px`;
                }
            };
            window.addEventListener("resize", appHeight);
            appHeight();
        }
    }, [stack]);

    // useEffect(()=> {
    //     if (stack.stories[currentIndex].type === "video") {

    //     }
    // },[currentIndex, stack])

    const onMouseDown = (event) => {
        // if (_isMobile()) {
        //     event.preventDefault();
        // }
        event.stopPropagation();
        timerId = setTimeout(() => {
            longPressRef.current = true;
            setPaused(true);
            if (videoRef.current) {
                videoRef.current.pause();
            }
        }, 200);
    };

    const playNextStory = useCallback(() => {
        clearTimeout(timerId);
        if (longPressRef.current) {
            longPressRef.current = false;
            setPaused(false);
            if (videoRef.current) {
                videoRef.current.play();
            }
            return;
        }
        if (paused) {
            setPaused(false);
        }
        if (currentIndex === stack.stories.length - 1) {
            setCurrentIndex(0);
            handleOpenNextStack();
        } else {
            setCurrentIndex((oldIndex) => {
                return oldIndex + 1;
            });
        }
    }, [paused, currentIndex, stack]);

    const playPrevStory = useCallback(() => {
        clearTimeout(timerId);
        if (longPressRef.current) {
            longPressRef.current = false;
            setPaused(false);
            if (videoRef.current) {
                videoRef.current.play();
            }
            return;
        }
        if (paused) {
            setPaused(false);
        }

        if (currentIndex === 0) {
            setCurrentIndex(0);
            handleOpenPrevStack();
        } else {
            setCurrentIndex((oldIndex) => {
                return oldIndex - 1;
            });
        }
    }, [paused, currentIndex, stack]);

    const openSeeMore = () => {
        setSeeMoreOpened(true);
        setPaused(true);
        if (videoRef.current) {
            videoRef.current.pause();
        }
    };

    const closeSeeMore = () => {
        setSeeMoreOpened(false);
        setPaused(false);
        if (videoRef.current) {
            videoRef.current.play();
        }
    };

    const pause = () => {
        setPaused(true);
    };

    const play = () => {
        setPaused(false);
    };

    const updateStoryDuration = (duration) => {
        setDuration(duration);
    };

    return (
        <Box
            className="stories-stack-container"
            sx={
                _isMobile()
                    ? {
                          height: "100vh",
                          width: "100vw",
                          maxWidth: "480px",
                          borderRadius: 0,
                      }
                    : {}
            }
            ref={stackContainerRef}
        >
            <Box
                className="progress-bar-container"
                sx={{
                    opacity: paused ? "0" : "1",
                    transition: "opacity, 0.3s",
                }}
            >
                {stack.stories.map((story, index) => (
                    <StoriesProgressBar
                        storyIndex={index}
                        currentIndex={currentIndex}
                        paused={paused}
                        playNextStory={playNextStory}
                        interval={duration}
                        key={index}
                        stack={stack}
                        videoRef={videoRef}
                    />
                ))}
            </Box>
            <StoriesContent
                story={stack.stories[currentIndex]}
                ref={videoRef}
                pause={pause}
                play={play}
                updateStoryDuration={updateStoryDuration}
            />
            <div className="navigation-panels-container">
                <div
                    className="left-panel"
                    onMouseDown={_isMobile() ? null : onMouseDown}
                    onMouseUp={_isMobile() ? null : playPrevStory}
                    onTouchStart={onMouseDown}
                    onTouchEnd={playPrevStory}
                ></div>
                <div
                    className="right-panel"
                    onMouseDown={_isMobile() ? null : onMouseDown}
                    onMouseUp={_isMobile() ? null : playNextStory}
                    onTouchStart={onMouseDown}
                    onTouchEnd={playNextStory}
                ></div>
            </div>
            {stack.stories[currentIndex].seeMore ? (
                <SeeMoreCollapsed openSeeMore={openSeeMore} />
            ) : null}
            {seeMoreOpened && (
                <Box
                    sx={{
                        position: "absolute",
                        height: "100%",
                        width: "100%",
                        zIndex: "9999",
                    }}
                >
                    <SeeMoreContent
                        closeSeeMore={closeSeeMore}
                        seeMoreOpened={seeMoreOpened}
                    />
                </Box>
            )}
        </Box>
    );
};

export default StoriesStack;
