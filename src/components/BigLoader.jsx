import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Typing from "../img/Typing";
import Bricks from "../img/Bricks";
import Eater from "../img/Eater";
import Ripple from "../img/Ripple";
import Progress from "../img/Progress";
import "../css/loader.css";

export default function BigLoader({ initStatus = false }) {
    const mainColor = window.mainColor;
    const secondColor = window.secondColor;

    return (
        <div>
            <div className="mainloader">
                <div className="loader-inner">
                    {window.typeLoader === "bricks" ? (
                        <Bricks
                            mainColor={mainColor}
                            secondColor={secondColor}
                        />
                    ) : window.typeLoader === "eater" ? (
                        <Eater
                            mainColor={mainColor}
                            secondColor={secondColor}
                        />
                    ) : window.typeLoader === "ripple" ? (
                        <Ripple
                            mainColor={mainColor}
                            secondColor={secondColor}
                        />
                    ) : window.typeLoader === "progress" ? (
                        <Progress
                            mainColor={mainColor}
                            secondColor={secondColor}
                        />
                    ) : (
                        <Typing mainColor={mainColor} />
                    )}
                </div>
            </div>
        </div>
    );
}
