import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { ReactComponent as TypingLoader } from "../img/Typing.svg";
import { ReactComponent as BricksLoader } from "../img/Bricks.svg";
import { ReactComponent as EaterLoader } from "../img/Eater.svg";
import { ReactComponent as RippleLoader } from "../img/Ripple.svg";
import { ReactComponent as ProgressLoader } from "../img/Progress.svg";
import "../css/loader.css";

export default function BigLoader({ initStatus = false }) {
    const color = window.mainColor;

    return (
        <div>
            <div className="mainloader">
                <div className="loader-inner">
                    {window.typeLoader === "bricks" ? (
                        <BricksLoader />
                    ) : window.typeLoader === "eater" ? (
                        <EaterLoader />
                    ) : window.typeLoader === "ripple" ? (
                        <RippleLoader />
                    ) : window.typeLoader === "progress" ? (
                        <ProgressLoader />
                    ) : (
                        <TypingLoader />
                    )}
                </div>
            </div>
        </div>
    );
}
