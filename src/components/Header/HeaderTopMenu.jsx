import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { closeMobileMenu } from "../../redux/actions/header";
import clsx from "clsx";

const HeaderTopMenu = ({ pages }) => {
    const dispatch = useDispatch();
    const { pathname } = useLocation();

    const { mobileMenuOpen } = useSelector((state) => state.header);

    const handleClickTopMenu = () => {
        if (mobileMenuOpen) {
            dispatch(closeMobileMenu());
        }
    };

    const currentPage = pages.find((el) => el.url === pathname);

    return (
        <ul className={"test"}>
            {pages.map((item, index) => (
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
                            onClick={() => handleClickTopMenu()}
                            className={clsx(
                                item.id === currentPage?.id && "active"
                            )}
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

export default HeaderTopMenu;
