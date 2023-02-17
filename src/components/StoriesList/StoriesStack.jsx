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

const StoriesStack = ({ stack, handleOpenPrevStack, handleOpenNextStack }) => {
    const videoRef = useRef(null);
    const longPressRef = useRef(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const [seeMoreOpened, setSeeMoreOpened] = useState(false);

    let timerId;

    useEffect(() => {
        setCurrentIndex(0);
        if (seeMoreOpened) {
            setSeeMoreOpened(false);
        }
        if (paused) {
            setPaused(false);
        }
    }, [stack]);

    const onMouseDown = () => {
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
    return (
        <Box
            className="stories-stack-container"
            sx={
                _isMobile()
                    ? {
                          height: "100vh",
                          width: "100vw",
                          maxWidth: "480px",
                      }
                    : {}
            }
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
                        interval={
                            videoRef.current
                                ? videoRef.current.duration * 1000
                                : 5000
                        }
                        key={index}
                        stack={stack}
                    />
                ))}
            </Box>
            <div className="story-container">
                <Box
                    className="stories--background"
                    sx={{
                        backgroundImage: `url(${stack.stories[currentIndex].url})`,
                    }}
                />
                {stack.stories[currentIndex].type === "video" ? (
                    <video
                        src={stack.stories[currentIndex].url}
                        playsInline
                        autoPlay
                        ref={videoRef}
                        className="stories-video"
                    />
                ) : (
                    <img src={stack.stories[currentIndex].url} />
                )}
            </div>
            <div className="navigation-panels-container">
                <div
                    className="left-panel"
                    onMouseUp={playPrevStory}
                    onMouseDown={onMouseDown}
                ></div>
                <div
                    className="right-panel"
                    onMouseUp={playNextStory}
                    onMouseDown={onMouseDown}
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
