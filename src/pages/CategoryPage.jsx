import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Alert, Button, Box, Container, Skeleton } from "@mui/material";
import {
    Header,
    Footer,
    TopCategoriesMenu,
    MobileMiniCart,
    Product,
    SearchBar,
    FooterBonuses,
} from "../components";
import { _isMobile, _clone, _isCategoryDisabled } from "../components/helpers";
import { getTime, set } from "date-fns";

const CategoryPage = () => {
    const { pathname } = useLocation();

    const { products, categories, bonuses_items } = useSelector(
        ({ products }) => {
            return {
                products: products.items,
                categories: products.categories,
                bonuses_items: products.bonuses_items,
            };
        }
    );

    const [activeCategoryTags, setActiveCategoryTags] = useState({});

    const currentCategory = categories.find(
        (el) => el.slug === pathname.slice(10)
    );

    const handleClickCategoryTag = (categoryID, tagID) => {
        let tmpArray = _clone(activeCategoryTags);
        if (!tmpArray.hasOwnProperty(categoryID))
            tmpArray[categoryID] = [tagID];
        else if (!tmpArray[categoryID].includes(tagID))
            tmpArray[categoryID].push(tagID);
        else if (tmpArray[categoryID].includes(tagID))
            tmpArray[categoryID] = tmpArray[categoryID].filter(
                (tag) => tag !== tagID
            );

        setActiveCategoryTags(tmpArray);
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            <Header />
            <TopCategoriesMenu />
            <Container sx={{ flexGrow: "1" }}>
                <div style={{ display: "flex" }}>
                    <SearchBar dontShowList={true} size={"small"} />
                </div>
                <h1>{currentCategory.name}</h1>
                {_isCategoryDisabled(currentCategory) ? (
                    <Alert
                        severity="error"
                        sx={{ width: "fit-content", mb: 1 }}
                    >
                        Товары из данной категории доступны с{" "}
                        {currentCategory.timeLimitStart} до{" "}
                        {currentCategory.timeLimitEnd}
                    </Alert>
                ) : null}
                {currentCategory.tags &&
                    Object.values(currentCategory.tags).map((tag, tagIndex) => (
                        <Button
                            key={`tag-${tag.term_id}`}
                            variant="button"
                            className={`btn btn--tag ${
                                activeCategoryTags.hasOwnProperty(
                                    currentCategory.term_id
                                )
                                    ? activeCategoryTags[
                                          currentCategory.term_id
                                      ].includes(tag.term_id)
                                        ? "btn--tag-active"
                                        : ""
                                    : ""
                            }`}
                            sx={{ mr: 1, mb: 1 }}
                            onClick={() =>
                                handleClickCategoryTag(
                                    currentCategory.term_id,
                                    tag.term_id
                                )
                            }
                        >
                            {tag.name}
                        </Button>
                    ))}
                <div>
                    {products ? (
                        Object.values(products)
                            .sort((product1, product2) =>
                                product1["order"] > product2["order"] ? 1 : -1
                            )
                            .map((product) =>
                                product.categories.includes(
                                    currentCategory.term_id
                                ) ? (
                                    activeCategoryTags.hasOwnProperty(
                                        currentCategory.term_id
                                    ) &&
                                    activeCategoryTags[currentCategory.term_id]
                                        .length ? (
                                        Object.values(product.tags).filter(
                                            (productTag) =>
                                                activeCategoryTags[
                                                    currentCategory.term_id
                                                ].includes(productTag.term_id)
                                        ).length ? (
                                            <Product
                                                key={product.id}
                                                product={product}
                                            />
                                        ) : (
                                            ""
                                        )
                                    ) : (
                                        <Product
                                            key={product.id}
                                            product={product}
                                            disabled={_isCategoryDisabled(
                                                currentCategory
                                            )}
                                        />
                                    )
                                ) : (
                                    ""
                                )
                            )
                    ) : (
                        <Skeleton variant="text" animation="wave" />
                    )}
                </div>
            </Container>
            {_isMobile() ? <MobileMiniCart /> : ""}
            {bonuses_items !== undefined && bonuses_items.length ? (
                <FooterBonuses />
            ) : (
                ""
            )}
            <Footer />
        </Box>
    );
};

export default CategoryPage;
