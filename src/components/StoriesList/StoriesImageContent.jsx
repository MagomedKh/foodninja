import React, {
    useState,
    useMemo,
    useCallback,
    useEffect,
    useRef,
} from "react";
import { Box, CircularProgress } from "@mui/material";

const StoriesImageContent = ({ story, pause, play, updateStoryDuration }) => {
    return (
        <div className="story-container">
            <Box
                className="stories--background"
                sx={{
                    backgroundImage: `url(${story.url})`,
                }}
            />
            <img src={story.url} />
        </div>
    );
};
export default StoriesImageContent;
