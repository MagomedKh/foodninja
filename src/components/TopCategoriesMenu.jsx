import React, { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { IntersectionObserverWrapper, MiniCart } from "../components";
import Container from "@mui/material/Container";
import Skeleton from "@mui/material/Skeleton";
import { Link as AnimateLink } from "react-scroll";
import { _isMobile } from "../components/helpers.js";
import smoothscroll from "smoothscroll-polyfill";
import clsx from "clsx";
import "../css/top-categories-menu.css";

export default function TopCategoriesMenu() {
    smoothscroll.polyfill();
    const stickedBarRef = useRef();
    const categoriesMenuRef = useRef();
    const { pathname } = useLocation();
    const [sticked, setSticked] = useState(false);
    const { categories, products, categoriesMenuType } = useSelector(
        ({ products, config }) => {
            return {
                categories: products.categories,
                products: products.items,
                categoriesMenuType: config.data.CONFIG_type_categories,
            };
        }
    );

    const [categoriesWithProducts, setCategoriesWithProducts] = useState(null);

    useEffect(() => {
        if (categories) {
            const temp = categories
                .map((item) => {
                    if (
                        Object.values(products).find((product) =>
                            product.categories.includes(item.term_id)
                        )
                    ) {
                        return item;
                    }
                })
                .filter((item) => item);
            setCategoriesWithProducts(temp);
        }
    }, [categories, products]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [sticked]);

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

    if (_isMobile()) {
        return (
            <div
                className={clsx("sticked-top-bar", {
                    sticked: sticked,
                    white: categoriesMenuType === "one",
                    filled: categoriesMenuType === "two",
                })}
                ref={stickedBarRef}
            >
                <Container className="inner-wrapper">
                    {categoriesWithProducts ? (
                        <ul
                            className={"categories-menu"}
                            ref={categoriesMenuRef}
                        >
                            {categoriesWithProducts.map((item) => {
                                return (
                                    <li
                                        key={item.term_id}
                                        className={"viewCategory"}
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
                        </ul>
                    ) : (
                        <Skeleton variant="text" animation="wave" />
                    )}
                    <MiniCart />
                </Container>
            </div>
        );
    }

    return (
        <div
            className={clsx("sticked-top-bar", {
                sticked: sticked,
                white: categoriesMenuType === "one",
                filled: categoriesMenuType === "two",
            })}
            ref={stickedBarRef}
        >
            <Container className="inner-wrapper">
                {categoriesWithProducts ? (
                    <IntersectionObserverWrapper ref={categoriesMenuRef}>
                        {categoriesWithProducts.map((item) => {
                            return (
                                <li
                                    key={item.term_id}
                                    className={"viewCategory"}
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
                                        >
                                            {item.name}
                                        </AnimateLink>
                                    ) : (
                                        <Link
                                            to={`/category/${item.slug}`}
                                            style={{
                                                textDecoration: "none",
                                            }}
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
                    </IntersectionObserverWrapper>
                ) : (
                    <Skeleton variant="text" animation="wave" />
                )}
                <MiniCart />
            </Container>
        </div>
    );
}
