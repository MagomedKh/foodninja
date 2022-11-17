import React, { useState, useEffect } from "react";
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

const CategoryPage = () => {
    const { pathname } = useLocation();

    const { products, categories } = useSelector(({ products }) => {
        return {
            products: products.items,
            categories: products.categories,
        };
    });

    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState(
        [].concat.apply([], Object.values(products))
    );
    const [activeCategoryTags, setActiveCategoryTags] = useState({});

    const currentCategory = categories.find(
        (el) =>
            el.slug ===
            pathname
                .split("/")
                .filter((element) => element)
                .at(-1)
    );

    useEffect(() => {
        if (currentCategory) {
            const temp = [].concat
                .apply([], Object.values(products))
                .filter((el) =>
                    el.categories.includes(currentCategory.term_id)
                );
            setAllProducts(temp);
        }
    }, [currentCategory]);

    const handleFilter = (filteredProducts) => {
        if (filteredProducts) {
            setFilteredProducts(filteredProducts);
        } else {
            setFilteredProducts([].concat.apply([], Object.values(products)));
        }
    };

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
                <h1>{currentCategory.name}</h1>
                <SearchBar
                    products={allProducts}
                    dontShowList
                    dontShowButton
                    handleFilter={handleFilter}
                />
                {_isCategoryDisabled(currentCategory) ? (
                    <Alert severity="error" sx={{ mb: 1 }}>
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
                <div className="product-grid-list">
                    {filteredProducts ? (
                        filteredProducts
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
            <FooterBonuses />
            <Footer />
        </Box>
    );
};

export default CategoryPage;
