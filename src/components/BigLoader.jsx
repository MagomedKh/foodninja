import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import "../css/loader.css";

export default function BigLoader({ initStatus = false }) {
    return (
        <div>
            <div className="mainloader">
                <div className="loader-inner">
                    <img
                        src={window.mainLogo}
                        className="loader-logo"
                        alt="Логотип"
                    />
                    <br />
                    <CircularProgress color="inherit" />
                    <div className="loader-text">Загрузка</div>
                </div>
            </div>
        </div>
    );
}
