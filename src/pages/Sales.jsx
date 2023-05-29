import React, { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { _isMobile } from "../components/helpers.js";
import {
    Card,
    CardContent,
    CardMedia,
    CardActionArea,
    Container,
    Slide,
    Typography,
    Grid,
} from "@mui/material";
import { Header, Footer, SaleModal } from "../components";
import useActiveSale from "../hooks/useActiveSale.js";
import "../css/sale.css";

export default function Sales() {
    const { sales } = useSelector(({ pages }) => {
        return {
            sales: pages.sales,
        };
    });

    const {
        activeSale,
        saleOpenModal,
        handleCloseSaleModal,
        handleSetActiveSale,
    } = useActiveSale();

    return (
        <>
            <Header />
            <Container>
                <h1>Акции</h1>
                {typeof sales !== "undefined" && sales.length ? (
                    <div className="sales-wrapper">
                        <Grid container spacing={4}>
                            {sales.map((sale, index) => (
                                <Grid item sm={12} md={4} key={sale.saleID}>
                                    <Card
                                        className="sale"
                                        onClick={() =>
                                            handleSetActiveSale(sale)
                                        }
                                    >
                                        <CardActionArea
                                            sx={{
                                                height: "100%",
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "start",
                                            }}
                                        >
                                            <CardMedia
                                                component="img"
                                                image={sale.saleImg}
                                                alt={sale.saleTitle}
                                            />
                                            <CardContent sx={{ flexGrow: 1 }}>
                                                <div className="sale--content-inner-wrapper">
                                                    <Typography
                                                        gutterBottom
                                                        variant="h5"
                                                        component="div"
                                                    >
                                                        {sale.saleTitle}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        <div
                                                            className="sale--short-content"
                                                            dangerouslySetInnerHTML={{
                                                                __html: sale.saleContent,
                                                            }}
                                                        ></div>
                                                    </Typography>
                                                    <div className="sale--fade">
                                                        <span>Подробнее</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                        <SaleModal
                            saleOpenModal={saleOpenModal}
                            activeSale={activeSale}
                            handleCloseSaleModal={handleCloseSaleModal}
                        />
                    </div>
                ) : (
                    <p>Акции не найдены.</p>
                )}
            </Container>
            <Footer />
        </>
    );
}
