import React from "react";
import { useSelector } from "react-redux";
import Container from "@mui/material/Container";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Box, Skeleton } from "@mui/material";
import axios from "axios";
import { _getDomain } from "../components/helpers.js";
import { Header, Footer } from "../components";

export default function Page() {
    const navigate = useNavigate();

    const { mainLoading } = useSelector(({ config }) => {
        return {
            mainLoading: config.status,
        };
    });

    const redirectToMainPage = useSelector(
        (state) => state.config.data.CONFIG_empty_page_redirect === "on"
    );

    const [pageStatus, setPageStatus] = React.useState("loading");
    const [pageTitle, setPageTitle] = React.useState();
    const [pageContent, setpageContent] = React.useState();
    const { pathname: currentUrl } = useLocation();

    React.useEffect(() => {
        console.log(currentUrl);
        if (mainLoading) {
            setPageStatus("loading");
            axios
                .get(
                    "https://" +
                        _getDomain() +
                        "/?rest-api=getPage&path=" +
                        currentUrl.slice(1),
                    { mode: "no-cors" }
                )
                .then((resp) => {
                    if (resp.data.status === "success") {
                        setPageTitle(resp.data.pageTitle);
                        setpageContent(resp.data.pageContent);
                        setPageStatus("loaded");
                    } else {
                        if (redirectToMainPage) {
                            navigate("/");
                        } else {
                            setPageStatus("error");
                        }
                    }
                });
        }
    }, [mainLoading, currentUrl]);

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            <Header />
            <Container sx={{ flexGrow: 1 }}>
                {pageStatus === "loading" ? (
                    <div className="pageInner">
                        <h1>
                            <Skeleton
                                variant="text"
                                animation="wave"
                                sx={{ width: 0.5 }}
                            />
                        </h1>
                        <Skeleton
                            variant="text"
                            animation="wave"
                            sx={{ width: 0.5 }}
                        />
                        <Skeleton
                            variant="text"
                            animation="wave"
                            sx={{ width: 0.25 }}
                        />
                        <Skeleton
                            variant="text"
                            animation="wave"
                            sx={{ width: 0.15 }}
                        />
                        <Skeleton
                            variant="text"
                            animation="wave"
                            sx={{ width: 0.45 }}
                        />
                        <Skeleton
                            variant="text"
                            animation="wave"
                            sx={{ width: 0.55 }}
                        />
                        <Skeleton
                            variant="text"
                            animation="wave"
                            sx={{ width: 0.15 }}
                        />
                        <Skeleton
                            variant="text"
                            animation="wave"
                            sx={{ width: 0.15 }}
                        />
                        <Skeleton
                            variant="text"
                            animation="wave"
                            sx={{ width: 0.25 }}
                        />
                        <Skeleton
                            variant="text"
                            animation="wave"
                            sx={{ width: 0.35 }}
                        />
                        <Skeleton
                            variant="text"
                            animation="wave"
                            sx={{ width: 0.35 }}
                        />
                        <Skeleton
                            variant="text"
                            animation="wave"
                            sx={{ width: 0.25 }}
                        />
                        <Skeleton
                            variant="text"
                            animation="wave"
                            sx={{ width: 0.15 }}
                        />
                        <Skeleton
                            variant="text"
                            animation="wave"
                            sx={{ width: 0.5 }}
                        />
                        <Skeleton
                            variant="text"
                            animation="wave"
                            sx={{ width: 0.25 }}
                        />
                        <Skeleton
                            variant="text"
                            animation="wave"
                            sx={{ width: 0.15 }}
                        />
                        <Skeleton
                            variant="text"
                            animation="wave"
                            sx={{ width: 0.45 }}
                        />
                        <Skeleton
                            variant="text"
                            animation="wave"
                            sx={{ width: 0.55 }}
                        />
                        <Skeleton
                            variant="text"
                            animation="wave"
                            sx={{ width: 0.15 }}
                        />
                        <Skeleton
                            variant="text"
                            animation="wave"
                            sx={{ width: 0.45 }}
                        />
                        <Skeleton
                            variant="text"
                            animation="wave"
                            sx={{ width: 0.65 }}
                        />
                        <Skeleton
                            variant="text"
                            animation="wave"
                            sx={{ width: 0.6 }}
                        />
                        <Skeleton
                            variant="text"
                            animation="wave"
                            sx={{ width: 0.55 }}
                        />
                    </div>
                ) : pageStatus === "error" ? (
                    <div className="pageInner">
                        <h1 className="pageTitle">Странице не найдена</h1>
                        <p>
                            Вернитесь на <Link to="/">главную страницу</Link>.
                        </p>
                    </div>
                ) : (
                    <div className="pageInner">
                        <h1 className="pageTitle">{pageTitle}</h1>
                        <div
                            className="pageContent"
                            dangerouslySetInnerHTML={{ __html: pageContent }}
                        ></div>
                    </div>
                )}
            </Container>
            <Footer />
        </Box>
    );
}
