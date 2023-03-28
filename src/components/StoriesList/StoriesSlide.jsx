import React, { useState, useEffect, useCallback, useMemo } from "react";

const StoriesSlide = ({ stack, stackIndex, handleOpenStack }) => {
    return (
        <div
            className={`stories-slide--read-wrapper ${
                stack.isViewed ? "viewed" : ""
            }`}
            onClick={() => handleOpenStack(stackIndex)}
        >
            <div className="stories-slide--container">
                <img src={stack.previewImage} />
            </div>
        </div>
    );
};

export default StoriesSlide;
