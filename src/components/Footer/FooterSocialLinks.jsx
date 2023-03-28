import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faInstagram,
    faOdnoklassniki,
    faFacebookF,
} from "@fortawesome/free-brands-svg-icons";
import VKsvg from "../../img/Vk-svg";
import AppStoreIcon from "../../img/app-store-bage-white.svg";
import GooglePlayIcon from "../../img/google-play-bage-white.svg";

const FooterSocialLinks = () => {
    const { config } = useSelector(({ config }) => {
        return {
            config: config.data,
        };
    });
    return (
        <>
            <div className="contacts--social-links">
                {config.CONFIG_vk && (
                    <a href={config.CONFIG_vk} target="_blank" rel="noreferrer">
                        <div className="footer--icon">
                            <VKsvg />
                        </div>
                    </a>
                )}
                {config.CONFIG_fb && (
                    <a href={config.CONFIG_fb} target="_blank" rel="noreferrer">
                        <div className="footer--icon">
                            <FontAwesomeIcon icon={faFacebookF} />
                        </div>
                    </a>
                )}
                {config.CONFIG_instagram && (
                    <a
                        href={config.CONFIG_instagram}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <div className="footer--icon">
                            <FontAwesomeIcon icon={faInstagram} />
                        </div>
                    </a>
                )}
                {config.CONFIG_ok && (
                    <a href={config.CONFIG_ok} target="_blank" rel="noreferrer">
                        <div className="footer--icon">
                            <FontAwesomeIcon icon={faOdnoklassniki} />
                        </div>
                    </a>
                )}
            </div>

            {config.CONFIG_APPSTORE && (
                <div className="contacts--appstore mobile-apps">
                    <a
                        href={config.CONFIG_APPSTORE}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <img src={AppStoreIcon} alt="iOS APP" />
                    </a>
                </div>
            )}
            {config.CONFIG_GPLAY && (
                <div className="contacts--googleplay mobile-apps">
                    <a
                        href={config.CONFIG_GPLAY}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <img src={GooglePlayIcon} alt="Android APP" />
                    </a>
                </div>
            )}
        </>
    );
};

export default FooterSocialLinks;
