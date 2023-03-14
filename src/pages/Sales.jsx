import React, { useState, useCallback } from "react";
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
import "../css/sale.css";

export default function Sales() {
    const { sales } = useSelector(({ pages }) => {
        return {
            sales: pages.sales,
        };
    });

    const [activeSale, setActiveSale] = useState(false);
    const [saleOpenModal, setSaleOpenModal] = useState(false);

    const handleCloseSaleModal = useCallback(() => {
        setSaleOpenModal(false);
    }, []);

    const handleSetActiveSale = useCallback((sale) => {
        window.location.hash = "sale-modal";
        setSaleOpenModal(true);
        setActiveSale(sale);
    }, []);

    return (
        <>
            <Header />
            <Container>
                <h1>Акции</h1>
                {typeof sales !== "undefined" && sales.length ? (
                    <div className="sales-wrapper">
                        <Grid container spacing={4}>
                            {sales.map((sale, index) => (
                                <Grid item sm={12} md={4}>
                                    <Card
                                        className="sale"
                                        onClick={() =>
                                            handleSetActiveSale(sale)
                                        }
                                    >
                                        <CardActionArea>
                                            <CardMedia
                                                component="img"
                                                image={sale.saleImg}
                                                alt={sale.saleTitle}
                                            />
                                            <CardContent>
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
