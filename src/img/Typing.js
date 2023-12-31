const Typing = ({ mainColor }) => {
    return (
        <svg
            width="150px"
            height="150px"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid"
        >
            <circle cx="27.5" cy="57.5" r="5" fill={mainColor || "#fe718d"}>
                <animate
                    attributeName="cy"
                    calcMode="spline"
                    keySplines="0 0.5 0.5 1;0.5 0 1 0.5;0.5 0.5 0.5 0.5"
                    repeatCount="indefinite"
                    values="57.5;42.5;57.5;57.5"
                    keyTimes="0;0.3;0.6;1"
                    dur="1s"
                    begin="-0.6s"
                ></animate>
            </circle>
            <circle cx="42.5" cy="57.5" r="5" fill={mainColor || "#f47e60"}>
                <animate
                    attributeName="cy"
                    calcMode="spline"
                    keySplines="0 0.5 0.5 1;0.5 0 1 0.5;0.5 0.5 0.5 0.5"
                    repeatCount="indefinite"
                    values="57.5;42.5;57.5;57.5"
                    keyTimes="0;0.3;0.6;1"
                    dur="1s"
                    begin="-0.44999999999999996s"
                ></animate>
            </circle>
            <circle cx="57.5" cy="57.5" r="5" fill={mainColor || "#f8b26a"}>
                <animate
                    attributeName="cy"
                    calcMode="spline"
                    keySplines="0 0.5 0.5 1;0.5 0 1 0.5;0.5 0.5 0.5 0.5"
                    repeatCount="indefinite"
                    values="57.5;42.5;57.5;57.5"
                    keyTimes="0;0.3;0.6;1"
                    dur="1s"
                    begin="-0.3s"
                ></animate>
            </circle>
            <circle cx="72.5" cy="57.5" r="5" fill={mainColor || "#abbd81"}>
                <animate
                    attributeName="cy"
                    calcMode="spline"
                    keySplines="0 0.5 0.5 1;0.5 0 1 0.5;0.5 0.5 0.5 0.5"
                    repeatCount="indefinite"
                    values="57.5;42.5;57.5;57.5"
                    keyTimes="0;0.3;0.6;1"
                    dur="1s"
                    begin="-0.15s"
                ></animate>
            </circle>
        </svg>
    );
};

export default Typing;
