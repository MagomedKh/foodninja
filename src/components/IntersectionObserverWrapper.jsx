import React, {
    useState,
    useEffect,
    useMemo,
    useCallback,
    useRef,
} from "react";
import OverflowMenu from "./OverflowMenu";
import "intersection-observer";

const IntersectionObserverWrapper = React.forwardRef(({ children }, ref) => {
    const navRef = useRef(null);

    const [visibilityMap, setVisibilityMap] = useState({});

    const handleIntersection = (entries) => {
        const updatedEntries = {};
        entries.forEach((entry) => {
            const targetid = entry.target.dataset.targetid;
            // Проверяем видим ли элемент в контейнере
            if (entry.isIntersecting) {
                updatedEntries[targetid] = true;
            } else {
                updatedEntries[targetid] = false;
            }
        });
        // Обновляем стейт
        setVisibilityMap((prev) => ({
            ...prev,
            ...updatedEntries,
        }));
    };

    useEffect(() => {
        const observer = new IntersectionObserver(handleIntersection, {
            root: navRef.current,
            threshold: 1,
            rootMargin: "0px -65px 0px 0px",
        });
        // Добавляем observer к каждому дочернему элементу, у которого есть data-targetid
        Array.from(navRef.current.children).forEach((item) => {
            if (item.dataset.targetid) {
                observer.observe(item);
            }
        });

        return () => {
            observer.disconnect();
        };
    }, [children]);
    return (
        <ul
            className="categories-menu"
            ref={(node) => {
                navRef.current = node;
                ref.current = node;
            }}
        >
            {React.Children.map(children, (child) => {
                return React.cloneElement(child, {
                    className: !!visibilityMap[child.props["data-targetid"]]
                        ? "visible"
                        : "invisible",
                });
            })}
            <OverflowMenu visibilityMap={visibilityMap}>
                {children}
            </OverflowMenu>
        </ul>
    );
});

export default IntersectionObserverWrapper;
