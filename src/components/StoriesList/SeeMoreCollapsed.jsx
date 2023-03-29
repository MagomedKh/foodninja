import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@mui/material";

const SeeMoreCollapsed = ({ openSeeMore, action, videoRef }) => {
    return (
        <div className="see-more-collapsed--container">
            <Button
                className="see-more-collapsed--button"
                variant="contained"
                onClick={() => {
                    openSeeMore();
                    // if (videoRef.current) {
                    //     videoRef.current.pause();
                    // }
                }}
            >
                Узнать больше
            </Button>
        </div>
    );
};

export default SeeMoreCollapsed;
