import React from "react";
import { Button } from "@mui/material";
import errorCat from "../img/cat-error.svg";
import "./../css/error-boundary.css";

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    // componentDidCatch(error, errorInfo) {
    //     console.log(error, errorInfo);
    // }

    refreshHandler = () => {
        window.localStorage.clear();
        document.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-page__wrapper">
                    <img
                        src={errorCat}
                        className="error-page__image"
                        alt="Ошибка"
                    />
                    <h4 className="error-page__title">
                        Упс! Что-то пошло не так
                    </h4>
                    <Button
                        onClick={this.refreshHandler}
                        className="error-page__refresh-btn"
                        variant="contained"
                    >
                        Обновить данные
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
