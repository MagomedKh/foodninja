import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Container } from '@material-ui/core'
import { Skeleton } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {_getDomain} from '../components/helpers.js';
import { clearCart } from '../redux/actions/cart';

export default function Contacts() {

    const dispatch = useDispatch();
    const {mainLoading} = useSelector( ({config}) => {
        return {
            mainLoading: config.status
        }
    });

    const [pageStatus, setPageStatus] = React.useState('loading');
    const [pageTitle, setPageTitle] = React.useState();
    const [pageContent, setpageContent] = React.useState();
    const currentUrl = window.location.pathname;

    React.useEffect(() => {
        console.log(mainLoading, pageStatus)
        if( mainLoading && pageStatus !== 'loaded' ) {
            axios.get(
                'https://'+_getDomain()+'/?rest-api=getPage&path='+currentUrl.slice(1), 
                { mode: 'no-cors'}
            ).then((resp) => {
               if( resp.data.status === 'success' ) {
                    setPageTitle(resp.data.pageTitle);
                    setpageContent(resp.data.pageContent);
                    setPageStatus('loaded');
               } else 
                    setPageStatus('error');

            });
            dispatch(clearCart());
        }
    }, [mainLoading]);

    return (
        <Container className="order-complete-page">
            { pageStatus === 'loading' ? (
                <div className="pageInner">
                    <h1><Skeleton variant="text" animation="wave" sx={{width: 0.5}} /></h1>
                    <Skeleton variant="text" animation="wave" sx={{width: 0.5}} />
                    <Skeleton variant="text" animation="wave" sx={{width: 0.25}} />
                    <Skeleton variant="text" animation="wave" sx={{width: 0.15}} />
                    <Skeleton variant="text" animation="wave" sx={{width: 0.45}} />
                    <Skeleton variant="text" animation="wave" sx={{width: 0.55}} />
                    <Skeleton variant="text" animation="wave" sx={{width: 0.15}} />
                    <Skeleton variant="text" animation="wave" sx={{width: 0.15}} />
                    <Skeleton variant="text" animation="wave" sx={{width: 0.25}} />
                    <Skeleton variant="text" animation="wave" sx={{width: 0.35}} />
                    <Skeleton variant="text" animation="wave" sx={{width: 0.35}} />
                    <Skeleton variant="text" animation="wave" sx={{width: 0.25}} />
                    <Skeleton variant="text" animation="wave" sx={{width: 0.15}} />
                    <Skeleton variant="text" animation="wave" sx={{width: 0.5}} />
                    <Skeleton variant="text" animation="wave" sx={{width: 0.25}} />
                    <Skeleton variant="text" animation="wave" sx={{width: 0.15}} />
                    <Skeleton variant="text" animation="wave" sx={{width: 0.45}} />
                    <Skeleton variant="text" animation="wave" sx={{width: 0.55}} />
                    <Skeleton variant="text" animation="wave" sx={{width: 0.15}} />                    
                    <Skeleton variant="text" animation="wave" sx={{width: 0.45}} />
                    <Skeleton variant="text" animation="wave" sx={{width: 0.65}} />
                    <Skeleton variant="text" animation="wave" sx={{width: 0.60}} />
                    <Skeleton variant="text" animation="wave" sx={{width: 0.55}} />
                </div>
            ) : pageStatus === 'error' ? (
                <div className="pageInner">
                    <h1 className="pageTitle">Заказ принят</h1>
                    <div className="pageContent">
                        <p>Ваш заказ принят.</p>
                        <p>Оператор свяжется с вами в ближайшее время для подтверждения заказа.</p>
                        <p><Link className="btn btn--action" to="/">На главную страницу</Link></p>
                    </div>
                </div>
            ) : (
                <div className="pageInner">
                    <h1 className="pageTitle">{pageTitle}</h1>
                    <div className="pageContent" dangerouslySetInnerHTML={{__html: pageContent}}></div>
                    <p><Link className="btn btn--action" to="/">На главную страницу</Link></p>
                </div>
            ) }
        </Container>
    )
}