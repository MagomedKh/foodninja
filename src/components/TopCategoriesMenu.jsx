import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeMobileMenu, openMobileMenu } from "../redux/actions/header";
import { Link, useLocation } from "react-router-dom";
import { IntersectionObserverWrapper, MiniCart } from "../components";
import Container from "@mui/material/Container";
import Skeleton from "@mui/material/Skeleton";
import { Link as AnimateLink } from "react-scroll";
import { _isCategoryDisabled, _isMobile } from "../components/helpers.js";
import smoothscroll from "smoothscroll-polyfill";
import MenuIcon from "@mui/icons-material/Menu";
import clsx from "clsx";
import "../css/top-categories-menu.css";

export default function TopCategoriesMenu() {
    smoothscroll.polyfill();
    const dispatch = useDispatch();
    const stickedBarRef = useRef();
    const categoriesMenuRef = useRef();
    const stickyDetector = useRef();
    const { pathname } = useLocation();

    const { categories, products, categoriesMenuType } = useSelector(
        ({ products, config }) => {
            return {
                categories: products.categories,
                products: products.items,
                categoriesMenuType: config.data.CONFIG_type_categories,
            };
        }
    );
    const { mobileMenuOpen } = useSelector((state) => state.header);

    const [sticked, setSticked] = useState(false);
    const [availableCategories, setAvailableCategories] = useState(null);

    useEffect(() => {
        if (categories) {
            const temp = categories
                .map((item) => {
                    if (
                        _isCategoryDisabled(item).disabled &&
                        item.limit_type !== "block"
                    ) {
                        return null;
                    }
                    if (
                        Object.values(products).find((product) =>
                            product.categories.includes(item.term_id)
                        )
                    ) {
                        return item;
                    }
                })
                .filter((item) => item);
            setAvailableCategories(temp);
        }
    }, [categories, products]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [sticked]);

    const handleScroll = () => {
        if ((window.scrollY >= stickyDetector.current.offsetTop) & !sticked) {
            setSticked(true);
        }
        if ((window.scrollY < stickyDetector.current.offsetTop) & sticked) {
            setSticked(false);
        }
    };

    const scrollCategoriesMenu = () => {
        const activeCategory = document.querySelector(
            ".sticked-top-bar .active"
        );

        if (activeCategory) {
            const activeCategoryContainer = activeCategory.parentElement;
            categoriesMenuRef.current.scrollTo({
                left:
                    activeCategoryContainer.offsetLeft -
                    categoriesMenuRef.current.offsetWidth / 2 +
                    activeCategoryContainer.offsetWidth / 2,
                behavior: "smooth",
            });
        }
    };

    const toggleMobileMenu = () => {
        if (!mobileMenuOpen) {
            dispatch(openMobileMenu());
        } else {
            dispatch(closeMobileMenu());
        }
    };

    if (_isMobile()) {
        return (
            <>
                <div ref={stickyDetector}></div>
                <div
                    className={clsx("sticked-top-bar", {
                        sticked: sticked,
                        white: categoriesMenuType === "one",
                        filled: categoriesMenuType === "two",
                    })}
                    ref={stickedBarRef}
                >
                    <Container className="inner-wrapper">
                        {availableCategories ? (
                            <ul
                                className="categories-menu"
                                ref={categoriesMenuRef}
                            >
                                {_isMobile() ? (
                                    <li>
                                        <a className="menu-icon">
                                            <MenuIcon
                                                onClick={toggleMobileMenu}
                                            />
                                        </a>
                                    </li>
                                ) : null}
                                {availableCategories.map((item) => {
                                    return (
                                        <li
                                            key={item.term_id}
                                            className="viewCategory"
                                            data-targetid={item.term_id}
                                        >
                                            {pathname === "/" ? (
                                                <AnimateLink
                                                    activeClass="active"
                                                    to={`category-${item.term_id}`}
                                                    spy={true}
                                                    smooth={true}
                                                    offset={-70}
                                                    duration={500}
                                                    onSetActive={
                                                        scrollCategoriesMenu
                                                    }
                                                >
                                                    {item.name}
                                                </AnimateLink>
                                            ) : (
                                                <Link
                                                    to={`/category/${item.slug}`}
                                                    style={{
                                                        textDecoration: "none",
                                                    }}
                                                    className={clsx(
                                                        pathname ===
                                                            `/category/${item.slug}` &&
                                                            "active"
                                                    )}
                                                >
                                                    {item.name}
                                                </Link>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <Skeleton variant="text" animation="wave" />
                        )}
                        <MiniCart />
                    </Container>
                </div>
            </>
        );
    }

    return (
        <>
            <div ref={stickyDetector}></div>
            <div
                className={clsx("sticked-top-bar", {
                    sticked: sticked,
                    white: categoriesMenuType === "one",
                    filled: categoriesMenuType === "two",
                })}
                ref={stickedBarRef}
            >
                <Container className="inner-wrapper">
                    {availableCategories ? (
                        <IntersectionObserverWrapper ref={categoriesMenuRef}>
                            {availableCategories.map((item) => {
                                return (
                                    <li
                                        key={item.term_id}
                                        className="viewCategory"
                                        data-targetid={item.term_id}
                                    >
                                        {pathname === "/" ? (
                                            <AnimateLink
                                                activeClass="active"
                                                to={`category-${item.term_id}`}
                                                spy={true}
                                                smooth={true}
                                                offset={-70}
                                                duration={500}
                                                hashSpy={true}
                                                spyThrottle={500}
                                            >
                                                {item.name}
                                            </AnimateLink>
                                        ) : (
                                            <Link
                                                to={`/category/${item.slug}`}
                                                style={{
                                                    textDecoration: "none",
                                                }}
                                                className={clsx(
                                                    pathname ===
                                                        `/category/${item.slug}` &&
                                                        "active"
                                                )}
                                            >
                                                {item.name}
                                            </Link>
                                        )}
                                    </li>
                                );
                            })}
                        </IntersectionObserverWrapper>
                    ) : (
                        <Skeleton variant="text" animation="wave" />
                    )}
                    <MiniCart />
                </Container>
            </div>
        </>
    );
}
