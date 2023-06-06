import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import {
    Product,
    ProductModal,
    MobileMiniCart,
    Banners,
    FooterBonuses,
    Header,
    Footer,
    SubscribeSnackbar,
    ScrollToTop,
    StoriesList,
} from "../components";
import SearchBar from "../components/SearchBar";
import TopCategoriesMenu from "../components/TopCategoriesMenu";
import { Alert, Box, Button, Container, Skeleton } from "@mui/material";
import {
    _clone,
    _isMobile,
    _isCategoryDisabled,
    _getPlatform,
} from "../components/helpers.js";

export default function Home() {
    const { config } = useSelector(({ config }) => {
        return {
            config: config.data,
        };
    });
    const { products, categories, productLayout } = useSelector(
        ({ products, config }) => {
            return {
                products: products.items,
                categories: products.categories,
                productLayout: config.data.CONFIG_type_products,
            };
        }
    );
    const [activeCategoryTags, setActiveCategoryTags] = useState({});

    const handleClickCategoryTag = (categoryID, tagID) => {
        let tmpArray = _clone(activeCategoryTags);

        if (!tmpArray[categoryID] || !tmpArray[categoryID].includes(tagID)) {
            tmpArray[categoryID] = [tagID];
        } else {
            delete tmpArray[categoryID];
        }

        setActiveCategoryTags(tmpArray);
    };

    const productsForSearch = useMemo(() => {
        if (config.CONFIG_searching_disable) {
            return null;
        }
        return [].concat
            .apply([], Object.values(products))
            .filter((product) => {
                if (
                    product.categories.length === 1 &&
                    product.categories.includes(
                        parseInt(config.CONFIG_bonuses_category)
                    )
                ) {
                    return false;
                } else if (
                    product.categories.every((el) =>
                        config.CONFIG_exclude_categories.includes(el)
                    )
                ) {
                    return false;
                }
                return true;
            });
    }, [products, config.CONFIG_searching_disable]);

    const getDisabledCategoryAlert = (category) => {
        const result = _isCategoryDisabled(category);
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
        <>
            <Header />
            <div className="home">
                {config.CONFIG_type_slider === "stories" ? (
                    <StoriesList />
                ) : (
                    <Banners />
                )}

                <TopCategoriesMenu />

                <Container>
                    {config.CONFIG_searching_disable ? null : (
                        <SearchBar
                            dontShowList={true}
                            products={productsForSearch}
                        />
                    )}
                    {categories ? (
                        categories.map((item, index) => {
                            if (
                                !Object.values(products).find((product) =>
                                    product.categories.includes(item.term_id)
                                )
                            ) {
                                return;
                            }
                            return (
                                <div
                                    key={`container-category-${item.term_id}`}
                                    id={`category-${item.term_id}`}
                                    className={`category-${item.term_id} product--category-container`}
                                >
                                    <h2 key={`title-${item.term_id}`}>
                                        {item.name}
                                    </h2>

                                    {getDisabledCategoryAlert(item)}

                                    {Object.values(item.tags).length ? (
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
                                            {item.tags &&
                                                Object.values(item.tags).map(
                                                    (tag, tagIndex) => (
                                                        <Button
                                                            key={`tag-${tag.term_id}`}
                                                            variant="button"
                                                            className={`btn btn--tag ${
                                                                activeCategoryTags.hasOwnProperty(
                                                                    item.term_id
                                                                )
                                                                    ? activeCategoryTags[
                                                                          item
                                                                              .term_id
                                                                      ].includes(
                                                                          tag.term_id
                                                                      )
                                                                        ? "btn--tag-active btn--action"
                                                                        : ""
                                                                    : ""
                                                            }`}
                                                            sx={{
                                                                mr: 1,
                                                                mb: 1,
                                                                px: 1,
                                                                bgcolor: "#fff",
                                                            }}
                                                            onClick={() =>
                                                                handleClickCategoryTag(
                                                                    item.term_id,
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

                                    <div
                                        key={`grid-${item.term_id}`}
                                        className="product-grid-list"
                                    >
                                        {products ? (
                                            Object.values(products)
                                                .sort((product1, product2) =>
                                                    product1["order"] >
                                                    product2["order"]
                                                        ? 1
                                                        : -1
                                                )
                                                .map((product) =>
                                                    product.categories.includes(
                                                        item.term_id
                                                    ) ? (
                                                        activeCategoryTags.hasOwnProperty(
                                                            item.term_id
                                                        ) &&
                                                        activeCategoryTags[
                                                            item.term_id
                                                        ].length ? (
                                                            Object.values(
                                                                product.tags
                                                            ).filter(
                                                                (productTag) =>
                                                                    activeCategoryTags[
                                                                        item
                                                                            .term_id
                                                                    ].includes(
                                                                        productTag.term_id
                                                                    )
                                                            ).length ? (
                                                                <Product
                                                                    key={
                                                                        product.id
                                                                    }
                                                                    product={
                                                                        product
                                                                    }
                                                                    disabled={
                                                                        _isCategoryDisabled(
                                                                            item
                                                                        )
                                                                            .disabled
                                                                    }
                                                                />
                                                            ) : (
                                                                ""
                                                            )
                                                        ) : (
                                                            <Product
                                                                key={product.id}
                                                                product={
                                                                    product
                                                                }
                                                                category={item}
                                                                disabled={
                                                                    _isCategoryDisabled(
                                                                        item
                                                                    ).disabled
                                                                }
                                                            />
                                                        )
                                                    ) : (
                                                        ""
                                                    )
                                                )
                                        ) : (
                                            <Skeleton
                                                variant="text"
                                                animation="wave"
                                            />
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <Skeleton variant="text" animation="wave" />
                    )}
                </Container>

                <ProductModal />

                <SubscribeSnackbar />

                <div className="screen-footer">
                    {_isMobile() ? <MobileMiniCart /> : ""}
                    {_isMobile() ? null : <ScrollToTop />}

                    <FooterBonuses />
                </div>
            </div>
            <Footer />
        </>
    );
}
