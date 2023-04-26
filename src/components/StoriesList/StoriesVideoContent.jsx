import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import ReactPlayer from "react-player/youtube";

const StoriesVideoContent = React.forwardRef(
    ({ story, pause, play, updateStoryDuration, active, paused }, ref) => {
        const playerRef = useRef(null);

        useEffect(() => {
            if (active) {
                pause();
            }
            if (!active && playerRef.current.getCurrentTime() !== 0) {
                playerRef.current.seekTo(0, "seconds");
            }
        }, [active]);

        return (
            <div className="story-container">
                <Box
                    className="stories--background"
                    sx={{
                        backgroundImage: `url(${story.url})`,
                    }}
                />
                <ReactPlayer
                    ref={playerRef}
                    url={story.url}
                    loop={true}
                    muted={true}
                    playsinline={true}
                    playing={active && !paused}
                    onReady={() => {
                        updateStoryDuration(
                            playerRef.current.getDuration() * 1000
                        );
                        play();
                    }}
                    onStart={play}
                    onPlay={play}
                    onPause={pause}
                    onBuffer={pause}
                    onBufferEnd={play}
                    config={{
                        youtube: {
                            playerVars: {
                                controls: 0,
                                fs: 0,
                                iv_load_policy: 3,
                                modestbranding: 1,
                                rel: 0,
                                disablekb: 1,
                                showinfo: 0,
                            },
                        },
                    }}
                    width={"100%"}
                    height={"100%"}
                />
                {/* <iframe
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/fqI-feIYfhY?controls=0"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    autoPlay="1"
                    controls="0"
                ></iframe> */}
                {/* <video
                    src={"https://www.youtube.com/embed/fqI-feIYfhY"}
                    playsInline
                    autoPlay
                    ref={ref}
                    className="stories-video"
                    onCanPlay={onVideoCanPlay}
                /> */}
            </div>
        );
    }
);

export default StoriesVideoContent;
