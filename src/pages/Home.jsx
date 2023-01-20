import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
    Product,
    MobileMiniCart,
    Banners,
    FooterBonuses,
    Header,
    Footer,
    SubscribeSnackbar,
} from "../components";
import SearchBar from "../components/SearchBar";
import TopCategoriesMenu from "../components/TopCategoriesMenu";
import { Alert, Button, Container, Skeleton } from "@mui/material";
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
    const { products, categories } = useSelector(({ products }) => {
        return {
            products: products.items,
            categories: products.categories,
        };
    });
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

    const productsForSearch = [].concat
        .apply([], Object.values(products))
        .filter((product) => {
            if (
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

    return (
        <>
            <Header />
            <div className="home">
                <Banners />

                <TopCategoriesMenu />

                <Container>
                    <SearchBar
                        dontShowList={true}
                        products={productsForSearch}
                    />
                    {categories ? (
                        categories.map((item, index) => (
                            <div
                                key={`container-category-${item.term_id}`}
                                id={`category-${item.term_id}`}
                                className={`category-${item.term_id} product--category-container`}
                            >
                                <h2 key={`title-${item.term_id}`}>
                                    {item.name}
                                </h2>

                                {_isCategoryDisabled(item) ? (
                                    <Alert severity="error" sx={{ mb: 1 }}>
                                        Товары из данной категории доступны с{" "}
                                        {item.timeLimitStart} до{" "}
                                        {item.timeLimitEnd}
                                    </Alert>
                                ) : null}

                                <div className="product--category-tags-container">
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
                                                                  item.term_id
                                                              ].includes(
                                                                  tag.term_id
                                                              )
                                                                ? "btn--tag-active btn--action"
                                                                : ""
                                                            : ""
                                                    }`}
                                                    sx={{ mr: 1, mb: 1, px: 1 }}
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
                                </div>

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
                                                        ).filter((productTag) =>
                                                            activeCategoryTags[
                                                                item.term_id
                                                            ].includes(
                                                                productTag.term_id
                                                            )
                                                        ).length ? (
                                                            <Product
                                                                key={product.id}
                                                                product={
                                                                    product
                                                                }
                                                            />
                                                        ) : (
                                                            ""
                                                        )
                                                    ) : (
                                                        <Product
                                                            key={product.id}
                                                            product={product}
                                                            category={item}
                                                            disabled={_isCategoryDisabled(
                                                                item
                                                            )}
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
                        ))
                    ) : (
                        <Skeleton variant="text" animation="wave" />
                    )}
                </Container>

                {_isMobile() ? <MobileMiniCart /> : ""}

                <SubscribeSnackbar />

                <FooterBonuses />
            </div>
            <Footer />
        </>
    );
}
