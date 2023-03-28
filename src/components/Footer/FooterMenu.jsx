import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

const FooterMenu = () => {
    const { bottomMenu, topMenu } = useSelector(({ pages }) => {
        return {
            topMenu: pages.topMenu,
            bottomMenu: pages.bottomMenu,
        };
    });

    const handleClickPage = (item) => {
        window.scrollTo(0, 0);
    };

    if (bottomMenu)
        return (
            <ul>
                {bottomMenu.map((item, index) => (
                    <li key={item.id}>
                        {item.target === "_blank" ? (
                            <a
                                href={item.url}
                                target="_blank"
                                rel="noreferrer"
                                title={item.title}
                            >
                                {item.title}
                            </a>
                        ) : (
                            <Link
                                onClick={() => handleClickPage(item)}
                                to={item.url}
                            >
                                {item.title}
                            </Link>
                        )}
                    </li>
                ))}
            </ul>
        );

    return (
        <ul>
            {topMenu.map((item, index) => (
                <li key={item.id}>
                    {item.target === "_blank" ? (
                        <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            title={item.title}
                        >
                            {item.title}
                        </a>
                    ) : (
                        <Link
                            onClick={() => handleClickPage(item)}
                            to={item.url}
                        >
                            {item.title}
                        </Link>
                    )}
                </li>
            ))}
        </ul>
    );
};

export default FooterMenu;
