import React, { useMemo } from "react";

const OverflowMenu = ({ children, visibilityMap }) => {
    const shouldShowMenu = useMemo(
        () => Object.values(visibilityMap).some((v) => v === false),
        [visibilityMap]
    );
    if (!shouldShowMenu) {
        return null;
    }
    return (
        <div className="flexmenu--more">
            <div className="btn btn--action">Ещё</div>
            <ul className="flexmenu--dropdown">
                {React.Children.map(children, (child) => {
                    if (!visibilityMap[child.props["data-targetid"]]) {
                        return child;
                    }
                    return null;
                })}
            </ul>
        </div>
    );
};

export default OverflowMenu;
