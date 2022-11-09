import * as React from "react";
import { useSelector } from "react-redux";
import { Drawer } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { _getMobileType } from "./helpers";
import { addDays } from "date-fns";
import Cookies from "universal-cookie";
import "../css/install-app.css";

export default function InstallApp({ initStatus = false }) {
    const cookies = new Cookies();

    const { icon, linkIos, linkAndroid, installText } = useSelector(
        ({ config }) => {
            return {
                icon: config.data.CONFIG_company_favicon,
                linkIos: config.data.CONFIG_APPSTORE,
                linkAndroid: config.data.CONFIG_GPLAY,
                installText: config.data.CONFIG_mobile_install_text,
            };
        }
    );

    let [open, setOpen] = React.useState(true);
    const mobileType = _getMobileType();

    const refusedToInstallApp = cookies.get("refusedToInstallApp");

    if (refusedToInstallApp) {
        return null;
    }

    const handleClose = () => {
        cookies.set("refusedToInstallApp", "true", {
            path: "/",
            expires: addDays(new Date(), 1),
        });
        setOpen(!open);
    };
    let linkApp;

    if (mobileType == "android" && linkAndroid) {
        linkApp = linkAndroid;
    } else if (mobileType == "ios" && linkIos) {
        linkApp = linkIos;
    } else open = false;

    return (
        <React.Fragment key="bottom">
            <Drawer
                anchor="bottom"
                open={open}
                onClose={handleClose}
                className="install-app--panel"
            >
                <div className="install-app--inner">
                    <img className="install-app--icon" src={icon} />
                    <h4 className="install-app--title">
                        Скачай мобильное приложение
                    </h4>
                    <CloseIcon
                        className="install-app--close"
                        onClick={handleClose}
                    />
                    {installText ? (
                        <div
                            className="install-app--text"
                            dangerouslySetInnerHTML={{ __html: installText }}
                        ></div>
                    ) : (
                        <div className="install-app--text">
                            <ul>
                                <li>Заказывай вкусняшки в один клик</li>
                                <li>Копи и списывай бонусы</li>
                                <li>Получай персональные скидки и акции</li>
                            </ul>
                        </div>
                    )}
                    <a
                        href={linkApp}
                        target="_blank"
                        className="btn btn-lg btn--action w-100 t-center"
                    >
                        Установить приложение
                    </a>
                </div>
            </Drawer>
        </React.Fragment>
    );
}
