import React, {
    useState,
    useMemo,
    useCallback,
    useEffect,
    useRef,
} from "react";
import { Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SeeMoreCollapsed from "./SeeMoreCollapsed";
import SeeMoreContent from "./SeeMoreContent";
import { _isMobile } from "../helpers";
import StoriesProgressBar from "./StoriesProgressBar";
import StoriesContent from "./StoriesContent";
import StoriesVideoContent from "./StoriesVideoContent";
import StoriesImageContent from "./StoriesImageContent";

const StoriesStack = ({
    stack,
    handleOpenPrevStack,
    handleOpenNextStack,
    handleClose,
    active,
}) => {
    const stackContainerRef = useRef(null);
    const videoRef = useRef(null);
    const longPressRef = useRef(false);
    const targetPressRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [seeMoreOpened, setSeeMoreOpened] = useState(false);
    const [duration, setDuration] = useState(5000);

    const [paused, setPaused] = useState(false);

    const pause = useCallback(() => {
        setPaused(true);
    }, []);

    const play = useCallback(() => {
        setPaused(false);
    }, []);

    let timerId;

    useEffect(() => {
        if (active && paused) {
            play();
        }
        longPressRef.current = false;
    }, [active]);

    useEffect(() => {
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
    }, []);

    const onMouseDown = (event) => {
        targetPressRef.current = event.target;
        event.stopPropagation();
        timerId = setTimeout(() => {
            longPressRef.current = true;
            pause();
            if (videoRef.current) {
                videoRef.current.pause();
            }
        }, 200);
    };

    const autoPlayNextStory = (event) => {
        clearTimeout(timerId);
        if (longPressRef.current) {
            longPressRef.current = false;
            targetPressRef.current = null;
            play();
            if (videoRef.current) {
                videoRef.current.play();
            }
            return;
        }
        if (paused) {
            play();
        }

        if (currentIndex === stack.stories.length - 1) {
            // setCurrentIndex(0);
            handleOpenNextStack();
        } else {
            setCurrentIndex((oldIndex) => {
                return oldIndex + 1;
            });
        }
        targetPressRef.current = null;
    };

    const playNextStory = (event) => {
        clearTimeout(timerId);
        if (longPressRef.current) {
            longPressRef.current = false;
            targetPressRef.current = null;
            play();
            if (videoRef.current) {
                videoRef.current.play();
            }
            return;
        }
        if (paused) {
            play();
        }

        if (_isMobile()) {
            if (currentIndex === stack.stories.length - 1) {
                // setCurrentIndex(0);
                handleOpenNextStack();
            } else {
                setCurrentIndex((oldIndex) => {
                    return oldIndex + 1;
                });
            }
            targetPressRef.current = null;
        } else {
            if (event?.target === targetPressRef.current) {
                if (currentIndex === stack.stories.length - 1) {
                    // setCurrentIndex(0);
                    handleOpenNextStack();
                } else {
                    setCurrentIndex((oldIndex) => {
                        return oldIndex + 1;
                    });
                }
                targetPressRef.current = null;
            }
        }
    };

    const playPrevStory = (event) => {
        clearTimeout(timerId);
        if (longPressRef.current) {
            longPressRef.current = false;
            targetPressRef.current = null;
            play();
            if (videoRef.current) {
                videoRef.current.play();
            }
            return;
        }
        if (paused) {
            play();
        }

        if (_isMobile()) {
            if (currentIndex === 0) {
                setCurrentIndex(0);
                handleOpenPrevStack();
            } else {
                setCurrentIndex((oldIndex) => {
                    return oldIndex - 1;
                });
            }
            targetPressRef.current = null;
        } else {
            if (event?.target === targetPressRef.current) {
                if (currentIndex === 0) {
                    setCurrentIndex(0);
                    handleOpenPrevStack();
                } else {
                    setCurrentIndex((oldIndex) => {
                        return oldIndex - 1;
                    });
                }
                targetPressRef.current = null;
            }
        }
    };

    const openSeeMore = () => {
        if (
            stack.stories[currentIndex].link &&
            stack.stories[currentIndex].usePopup !== "active"
        ) {
            pause();
            window.open(stack.stories[currentIndex].link, "_blank");
        } else {
            setSeeMoreOpened(true);
            pause();
            if (videoRef.current) {
                videoRef.current.pause();
            }
        }
    };

    const closeSeeMore = () => {
        setSeeMoreOpened(false);
        if (active) {
            play();
            if (videoRef.current) {
                videoRef.current.play();
            }
        }
    };

    const updateStoryDuration = useCallback((duration) => {
        setDuration(duration);
    }, []);

    return (
        <Box
            className="stories-stack-container"
            sx={
                _isMobile()
                    ? {
                          height: "100vh",
                          width: "100vw",
                          borderRadius: 0,
                      }
                    : {
                          //   transform: active ? "" : "scale(0.85)",
                          //   transition: "transform 0.3s",
                      }
            }
            ref={stackContainerRef}
        >
            {active && (
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
                            playNextStory={autoPlayNextStory}
                            interval={duration}
                            key={index}
                            stack={stack}
                            videoRef={videoRef}
                        />
                    ))}
                </Box>
            )}
            {active && (
                <IconButton
                    edge="start"
                    color="white"
                    onClick={handleClose}
                    aria-label="close"
                    className="stories--modal-close"
                    sx={{ width: "1.5em", height: "1.5em" }}
                >
                    <CloseIcon />
                </IconButton>
            )}
            {stack.stories[currentIndex].type === "video" ? (
                <StoriesVideoContent
                    active={active}
                    story={stack.stories[currentIndex]}
                    pause={pause}
                    play={play}
                    paused={paused}
                    updateStoryDuration={updateStoryDuration}
                />
            ) : (
                <StoriesImageContent
                    story={stack.stories[currentIndex]}
                    pause={pause}
                    play={play}
                    updateStoryDuration={updateStoryDuration}
                />
            )}
            {/* <StoriesContent
                story={stack.stories[currentIndex]}
                ref={videoRef}
                pause={pause}
                play={play}
                updateStoryDuration={updateStoryDuration} 
            />*/}
            {active && (
                <div className="navigation-panels-container">
                    <div
                        className="left-panel"
                        onMouseDown={_isMobile() ? null : onMouseDown}
                        onMouseUp={_isMobile() ? null : playPrevStory}
                        onTouchStart={_isMobile() ? onMouseDown : null}
                        onTouchEnd={_isMobile() ? playPrevStory : null}
                    ></div>
                    <div
                        className="right-panel"
                        onMouseDown={_isMobile() ? null : onMouseDown}
                        onMouseUp={_isMobile() ? null : playNextStory}
                        onTouchStart={_isMobile() ? onMouseDown : null}
                        onTouchEnd={_isMobile() ? playNextStory : null}
                    ></div>
                </div>
            )}
            {(active && stack.stories[currentIndex].usePopup) ||
            (active && stack.stories[currentIndex].link) ? (
                <SeeMoreCollapsed openSeeMore={openSeeMore} />
            ) : null}
            {stack.stories[currentIndex].usePopup && (
                <SeeMoreContent
                    closeSeeMore={closeSeeMore}
                    seeMoreOpened={seeMoreOpened}
                    title={stack.stories[currentIndex].title}
                    description={stack.stories[currentIndex].description}
                    link={stack.stories[currentIndex].link}
                    active={active}
                />
            )}
        </Box>
    );
};

export default React.memo(StoriesStack);
