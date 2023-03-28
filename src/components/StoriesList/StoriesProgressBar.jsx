import React, { useState, useEffect } from "react";
import { LinearProgress, Box } from "@mui/material";

const StoriesProgressBar = ({
    currentIndex,
    storyIndex,
    paused,
    playNextStory,
    interval,
    stack,
    videoRef,
}) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        setProgress(0);
    }, [stack]);

    useEffect(() => {
        let timer;
        if (currentIndex === storyIndex && !paused) {
            timer = setTimeout(() => {
                playNextStory();
            }, interval * ((100 - progress) / 100));
        }
        return () => {
            clearTimeout(timer);
        };
    }, [paused, currentIndex, progress, interval]);

    useEffect(() => {
        let timer;
        if (currentIndex === storyIndex && !paused) {
            if (progress >= 100) {
                setProgress(0);
            }
            timer = setInterval(() => {
                setProgress((oldProgress) => {
                    if (oldProgress >= 100) {
                        clearInterval(timer);
                        return 100;
                    }
                    return oldProgress + 100 / (interval / 100);
                });
            }, 100);
        }

        if (paused) {
            clearInterval(timer);
        }

        if (storyIndex < currentIndex) {
            setProgress(100);
        }

        if (storyIndex > currentIndex) {
            setProgress(0);
        }

        return () => {
            clearInterval(timer);
        };
    }, [currentIndex, paused, interval]);

    return (
        <Box
            sx={{
                width: `${100 / stack.stories.length}%`,
                ml: storyIndex === 0 ? "0" : "4px",
            }}
        >
            <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                    "& .MuiLinearProgress-bar":
                        currentIndex > storyIndex
                            ? {
                                  transform: "translateX(0%)",
                                  transition: "none",
                              }
                            : currentIndex <= storyIndex && progress === 0
                            ? {
                                  transition: "none",
                              }
                            : {
                                  transition: "transform .2s linear",
                              },
                    "&.MuiLinearProgress-root": {
                        height: "3px",
                        backgroundColor: "#fff",
                    },
                }}
            />
        </Box>
    );
};

export default StoriesProgressBar;
