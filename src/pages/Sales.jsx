import React from "react";
import { useSelector } from "react-redux";
import { _isMobile } from "../components/helpers.js";
import Container from "@mui/material/Container";
import { Grid } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea } from "@mui/material";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { Header, Footer } from "../components";
import "../css/sale.css";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function Sales() {
    const { sales } = useSelector(({ pages }) => {
        return {
            sales: pages.sales,
        };
    });

    const [activeSale, setActiveSale] = React.useState(false);
    const [saleOpenModal, setSaleOpenModal] = React.useState(false);

    const handleCloseSaleModal = () => {
        setSaleOpenModal(false);
    };
    const handleSetActiveSale = (sale) => {
        setSaleOpenModal(true);
        setActiveSale(sale);
    };

    let dialogSaleProps = { open: saleOpenModal, maxWidth: "md" };
    if (_isMobile()) {
        dialogSaleProps.TransitionComponent = Transition;
        dialogSaleProps.fullScreen = true;
    }
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
                        {activeSale && (
                            <Dialog
                                {...dialogSaleProps}
                                className="sale-dialog"
                                sx={{
                                    "& .MuiPaper-root": {
                                        borderRadius: _isMobile()
                                            ? "0px"
                                            : "15px",
                                    },
                                }}
                            >
                                <IconButton
                                    edge="start"
                                    color="inherit"
                                    onClick={handleCloseSaleModal}
                                    aria-label="close"
                                    className="modal-close"
                                >
                                    <CloseIcon />
                                </IconButton>
                                <div className="sale-modal">
                                    <img
                                        className="sale--img"
                                        src={activeSale.saleImg}
                                        alt={activeSale.saleTitle}
                                    />

                                    <h2 className="sale-modal--title">
                                        {activeSale.saleTitle}
                                    </h2>

                                    <div
                                        className="sale--content"
                                        dangerouslySetInnerHTML={{
                                            __html: activeSale.saleContent,
                                        }}
                                    ></div>
                                </div>
                            </Dialog>
                        )}
                    </div>
                ) : (
                    <p>Акции не найдены.</p>
                )}
            </Container>
            <Footer />
        </>
    );
}
