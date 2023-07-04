import React from "react";
import { Box, Container } from "@mui/material";
import { Link } from "react-router-dom";
import { Footer, Header } from "../components";

export default function NotFound() {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            <Header />
            <Container sx={{ flexGrow: 1 }}>
                <h1>Страница не найдена</h1>
                <p>
                    Вернитесь на <Link to="/">главную страницу</Link>.
                </p>
            </Container>
            <Footer />
        </Box>
    );
}
