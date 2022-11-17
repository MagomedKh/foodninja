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
} from "../components";
import { _isMobile } from "../components/helpers";

const SearchPage = () => {
    const { products } = useSelector(({ products }) => {
        return {
            products: products.items,
        };
    });

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            <Header />
            <TopCategoriesMenu />
            <Container sx={{ flexGrow: "1" }}>
                <h1>Поиск товаров</h1>
                <SearchBar
                    products={[].concat.apply([], Object.values(products))}
                />
            </Container>
            {_isMobile() ? <MobileMiniCart /> : ""}
            <FooterBonuses />
            <Footer />
        </Box>
    );
};

export default SearchPage;
