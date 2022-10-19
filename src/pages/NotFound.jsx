import React from 'react';
import Container from '@mui/material/Container';
import { Link } from 'react-router-dom';

export default function NotFound() {

    return (
        <Container>
            <h1>Страница не найдена</h1>
            <p>Вернитесь на <Link to="/">главную страницу</Link>.</p>
        </Container>
    )
}
