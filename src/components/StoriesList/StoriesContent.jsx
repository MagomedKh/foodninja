import React, {
    useState,
    useMemo,
    useCallback,
    useEffect,
    useRef,
} from "react";
import { Box, CircularProgress } from "@mui/material";

const StoriesContent = React.forwardRef(
    ({ story, pause, play, updateStoryDuration }, ref) => {
        const [loading, setLoading] = useState(true);
        useEffect(() => {
            pause();
        }, [story]);
        const onVideoCanPlay = () => {
            updateStoryDuration(ref.current.duration * 1000);
            setLoading(false);
            play();
        };

        const onImageLoaded = () => {
            updateStoryDuration(2000);
            setLoading(false);
            play();
        };
        return (
            <div className="story-container">
                <Box
                    className="stories--background"
                    sx={{
                        backgroundImage: `url(${story.url})`,
                    }}
                />
                {loading ? (
                    <Box
                        sx={{
                            width: "100%",
                            height: "100%",
                            zIndex: "10",
                            backgroundColor: "black",
                            position: "absolute",
                            left: 0,
                            top: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <CircularProgress
                            disableShrink
                            sx={{
                                animationDuration: "550ms",
                            }}
                        />
                    </Box>
                ) : null}
                {story.type === "video" ? (
                    <video
                        src={story.url}
                        playsInline
                        autoPlay
                        ref={ref}
                        className="stories-video"
                        onCanPlay={onVideoCanPlay}
                    />
                ) : (
                    <img src={story.url} onLoad={onImageLoaded} />
                )}
            </div>
        );
    }
);

export default StoriesContent;
