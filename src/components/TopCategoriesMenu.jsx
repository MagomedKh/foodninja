import React, { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { MiniCart } from "../components";
import Container from "@mui/material/Container";
import Skeleton from "@mui/material/Skeleton";
import { Link as AnimateLink } from "react-scroll";
import { _isMobile } from "../components/helpers.js";
import smoothscroll from "smoothscroll-polyfill";
import "../css/top-categories-menu.css";

export default function TopCategoriesMenu() {
    smoothscroll.polyfill();
    const stickedBarRef = useRef();
    const categoriesMenuRef = useRef();
    const { pathname } = useLocation();
    const [sticked, setSticked] = useState(false);
    const { categories, products } = useSelector(({ products }) => {
        return {
            categories: products.categories,
            products: products.items,
        };
    });

    const [showedCategories, setShowedCategories] = useState(categories);
    const [restCategories, setRestCategories] = useState([]);
    const showedCategoriesRef = useRef();
    showedCategoriesRef.current = showedCategories;
    const restCategoriesRef = useRef();
    restCategoriesRef.current = restCategories;

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [sticked]);

    useEffect(() => {
        if (!_isMobile()) {
            window.addEventListener("resize", checkFlexMenu);
            checkFlexMenu();
        }
        return () => {
            window.removeEventListener("resize", checkFlexMenu);
        };
    }, [categories, products]);

    const checkFlexMenu = () => {
        let menuWidth,
            allLi,
            allLiLength,
            breakIndex = 0;

        const wrapperWidth =
            document.querySelector(".inner-wrapper").offsetWidth;

        document.querySelector("#topCategoriesMenu").style.maxWidth = `${
            wrapperWidth - 230
        }px`;
        menuWidth = document.querySelector("#topCategoriesMenu").offsetWidth;

        allLi = document.querySelectorAll("#topCategoriesMenu li");
        allLiLength = 100;
        console.log(allLi);
        for (let i = 0; i < allLi.length; i++) {
            allLiLength += allLi[i].offsetWidth;

            if (menuWidth <= allLiLength && !breakIndex) {
                breakIndex = i;
            }
        }

        if (!_isMobile() && breakIndex)
            changeFlexMenu("decrease", allLi.length - breakIndex);
        else {
            menuWidth =
                document.querySelector("#topCategoriesMenu").offsetWidth;
            allLi = document.querySelectorAll("#topCategoriesMenu li");
            allLiLength = 0;
            for (let i = 0; i < allLi.length; i++)
                allLiLength += allLi[i].offsetWidth;

            if (menuWidth - allLiLength > 100) changeFlexMenu("increase", 1);
        }
    };
    const changeFlexMenu = (type, countEl) => {
        // decrease
        if (!_isMobile() && type === "decrease") {
            setRestCategories([
                ...restCategoriesRef.current,
                ...showedCategoriesRef.current.slice(
                    showedCategoriesRef.current.length - countEl,
                    showedCategoriesRef.current.length
                ),
            ]);
            setShowedCategories(
                showedCategoriesRef.current.slice(
                    0,
                    showedCategoriesRef.current.length - countEl
                )
            );
        } else if (!_isMobile() && type === "increase") {
            setShowedCategories([
                ...showedCategoriesRef.current,
                ...restCategoriesRef.current.slice(
                    restCategoriesRef.current.length - countEl,
                    restCategoriesRef.current.length
                ),
            ]);
            setRestCategories(
                restCategoriesRef.current.slice(
                    0,
                    restCategoriesRef.current.length - countEl
                )
            );
        }
    };

    const handleScroll = () => {
        if ((window.scrollY >= stickedBarRef.current.offsetTop) & !sticked)
            setSticked(true);
        if ((window.scrollY < stickedBarRef.current.offsetTop) & sticked)
            setSticked(false);
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

    return (
        <div
            className={`sticked-top-bar ${sticked ? "sticked" : "no-sticked"}`}
            ref={stickedBarRef}
        >
            <Container className="inner-wrapper">
                {categories ? (
                    <ul
                        id="topCategoriesMenu"
                        className="categories-menu"
                        ref={categoriesMenuRef}
                    >
                        {showedCategories.map((item) => {
                            if (
                                !Object.values(products).find((product) =>
                                    product.categories.includes(item.term_id)
                                )
                            ) {
                                return;
                            }
                            return (
                                <li
                                    key={item.term_id}
                                    className={"viewCategory"}
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
                                                _isMobile
                                                    ? scrollCategoriesMenu
                                                    : null
                                            }
                                        >
                                            {item.name}
                                        </AnimateLink>
                                    ) : (
                                        <Link
                                            to={`/category/${item.slug}`}
                                            style={{ textDecoration: "none" }}
                                            className={
                                                pathname ===
                                                `/category/${item.slug}`
                                                    ? "active"
                                                    : ""
                                            }
                                        >
                                            {item.name}
                                        </Link>
                                    )}
                                </li>
                            );
                        })}

                        {restCategories.length && (
                            <li className="flexmenu--more">
                                <div className="btn btn--action">Ещё</div>
                                <ul className="flexmenu--dropdown">
                                    {restCategories.map((item) => (
                                        <li key={item.term_id}>
                                            {pathname === "/" ? (
                                                <AnimateLink
                                                    activeClass="active"
                                                    to={`category-${item.term_id}`}
                                                    spy={true}
                                                    smooth={true}
                                                    offset={-70}
                                                    duration={500}
                                                >
                                                    {item.name}
                                                </AnimateLink>
                                            ) : (
                                                <Link
                                                    to={`/category/${item.slug}`}
                                                    style={{
                                                        textDecoration: "none",
                                                    }}
                                                >
                                                    {item.name}
                                                </Link>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        )}
                    </ul>
                ) : (
                    <Skeleton variant="text" animation="wave" />
                )}
                <MiniCart />
            </Container>
        </div>
    );
}
