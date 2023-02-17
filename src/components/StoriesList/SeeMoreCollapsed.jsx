import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";

const SeeMoreCollapsed = ({ openSeeMore, action, videoRef }) => {
    return (
        <div
            className="see-more-collapsed--container"
            onClick={() => {
                openSeeMore();
                // if (videoRef.current) {
                //     videoRef.current.pause();
                // }
            }}
        >
            <FontAwesomeIcon icon={faAngleUp} />
            <span>Узнать больше</span>
        </div>
    );
};

export default SeeMoreCollapsed;
