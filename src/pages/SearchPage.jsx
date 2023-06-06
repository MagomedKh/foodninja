import React from "react";
import { useSelector } from "react-redux";
import { Container, Box } from "@mui/material";
import {
    Header,
    Footer,
    FooterBonuses,
    SearchBar,
    TopCategoriesMenu,
    MobileMiniCart,
    ProductModal,
} from "../components";
import { _isMobile } from "../components/helpers";

const SearchPage = () => {
    const { products } = useSelector(({ products }) => {
        return {
            products: products.items,
        };
    });

    const { config } = useSelector(({ config }) => {
        return {
            config: config.data,
        };
    });

    const productsForSearch = [].concat
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

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            <Header />
            <TopCategoriesMenu />
            <Container sx={{ flexGrow: "1" }}>
                <h1>Поиск товаров</h1>
                <SearchBar products={productsForSearch} />
            </Container>
            <div className="screen-footer">
                {_isMobile() ? <MobileMiniCart /> : ""}
                <FooterBonuses />
            </div>
            <ProductModal />
            <Footer />
        </Box>
    );
};

export default SearchPage;
