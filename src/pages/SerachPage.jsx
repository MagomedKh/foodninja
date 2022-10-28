import React, { useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import Fuse from "fuse.js";
import {
    Container,
    TextField,
    Stack,
    Autocomplete,
    Box,
} from "@material-ui/core";
import { Header, Footer } from "../components";
import SearchBar from "../components/SearchBar";
import { _getPlatform } from "../components/helpers";

const SearchPage = () => {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            <Header />
            <Container sx={{ flexGrow: "1" }}>
                <h1>Поиск товаров</h1>
                <SearchBar size="normal" />
            </Container>
            <Footer />
        </Box>
    );
};

export default SearchPage;
