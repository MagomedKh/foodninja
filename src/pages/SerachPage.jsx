import React, { useState } from "react";
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
import { _getPlatform, _isMobile } from "../components/helpers";

const SearchPage = () => {
    const { bonuses_items } = useSelector(({ products }) => {
        return {
            bonuses_items: products.bonuses_items,
        };
    });
    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            <Header />
            <TopCategoriesMenu />
            <Container sx={{ flexGrow: "1" }}>
                <h1>Поиск товаров</h1>
                <SearchBar size="normal" />
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

export default SearchPage;
