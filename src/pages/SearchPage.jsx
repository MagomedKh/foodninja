import React from "react";
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
    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            <Header />
            <TopCategoriesMenu />
            <Container sx={{ flexGrow: "1" }}>
                <h1>Поиск товаров</h1>
                <SearchBar size="normal" />
            </Container>
            {_isMobile() ? <MobileMiniCart /> : ""}
            <FooterBonuses />
            <Footer />
        </Box>
    );
};

export default SearchPage;
