import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Button, Box, Container, Skeleton } from "@mui/material";
import {
    Header,
    Footer,
    TopCategoriesMenu,
    MobileMiniCart,
    Product,
    ProductModal,
    SearchBar,
    FooterBonuses,
} from "../components";
import { _isMobile, _clone, _isCategoryDisabled } from "../components/helpers";

const CategoryPage = () => {
    const params = useParams();
    const navigate = useNavigate();

    const { config, productLayout } = useSelector(({ config }) => {
        return {
            config: config.data,
            productLayout: config.data.CONFIG_type_products,
        };
    });

    const { products, categories } = useSelector(
        ({ products, productModal }) => {
            return {
                products: products.items,
                categories: products.categories,
            };
        }
    );

    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState(
        [].concat.apply([], Object.values(products))
    );
    const [activeCategoryTags, setActiveCategoryTags] = useState({});

    const currentCategory = categories.find((el) => {
        return el.slug === params.categoryName;
    });

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

    if (!currentCategory) {
        if (config.CONFIG_empty_page_redirect === "on") {
            navigate("/");
        } else {
            navigate("/not-found");
        }
        return null;
    }

    const handleFilter = (filteredProducts) => {
        if (filteredProducts) {
            setFilteredProducts(filteredProducts);
        } else {
            setFilteredProducts([].concat.apply([], Object.values(products)));
        }
    };

    const handleClickCategoryTag = (categoryID, tagID) => {
        let tmpArray = _clone(activeCategoryTags);

        if (!tmpArray[categoryID] || !tmpArray[categoryID].includes(tagID)) {
            tmpArray[categoryID] = [tagID];
        } else {
            delete tmpArray[categoryID];
        }

        setActiveCategoryTags(tmpArray);
    };

    const getDisabledCategoryAlert = () => {
        const result = _isCategoryDisabled(currentCategory);
        if (result.disabled) {
            return (
                <Alert severity="error" sx={{ mb: 1 }}>
                    {result.message}
                </Alert>
            );
        }
        return null;
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <Header />
            <TopCategoriesMenu />
            <Container sx={{ flexGrow: "1" }}>
                <h1>{currentCategory.name}</h1>
                {config.CONFIG_searching_disable ? null : (
                    <SearchBar
                        products={allProducts}
                        dontShowList
                        dontShowButton
                        handleFilter={handleFilter}
                    />
                )}
                {getDisabledCategoryAlert()}
                {Object.values(currentCategory.tags).length ? (
                    <Box
                        className="product--category-tags-container"
                        sx={
                            productLayout === "one"
                                ? {
                                      mb: "8px",
                                  }
                                : {}
                        }
                    >
                        {currentCategory.tags &&
                            Object.values(currentCategory.tags).map(
                                (tag, tagIndex) => (
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
                                                    ? "btn--tag-active btn--action"
                                                    : ""
                                                : ""
                                        }`}
                                        sx={{ mr: 1, mb: 1, bgcolor: "#fff" }}
                                        onClick={() =>
                                            handleClickCategoryTag(
                                                currentCategory.term_id,
                                                tag.term_id
                                            )
                                        }
                                    >
                                        {tag.name}
                                    </Button>
                                )
                            )}
                    </Box>
                ) : null}
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
                                            disabled={
                                                _isCategoryDisabled(
                                                    currentCategory
                                                ).disabled
                                            }
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
            <ProductModal />
            <div className="screen-footer">
                {_isMobile() ? <MobileMiniCart /> : ""}
                <FooterBonuses />
            </div>
            <Footer />
        </Box>
    );
};

export default CategoryPage;
