import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { closeMobileMenu } from "../../redux/actions/header";

const HeaderTopMenu = ({ pages }) => {
    const dispatch = useDispatch();

    const [activeTopMenu, setActiveTopMenu] = useState(5792);

    const { mobileMenuOpen } = useSelector((state) => state.header);

    const handleClickTopMenu = (item) => {
        if (mobileMenuOpen) {
            dispatch(closeMobileMenu());
        }
        setActiveTopMenu(item.id);
    };

    return (
        <ul>
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
                            onClick={() => handleClickTopMenu(item)}
                            className={
                                item.id === activeTopMenu ? "active" : ""
                            }
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
