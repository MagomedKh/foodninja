import { Container } from '@mui/material';
import React from 'react';
import {useSelector} from 'react-redux';
import '../css/maintenance.css';

function Maintenance(){

    const {config} = useSelector( ({config}) => {
    return {
        config: config.data,
    }
    });

    return (
        <div className="maintenance-wrapper">
            <Container>
                <div className="maintenance-logo">
                    <img src={config.CONFIG_company_logo_main} className="header-logo" alt="Логотип"/>
                </div>

                <h1 className="maintenance-title">{config.CONFIG_maintenance_title}</h1>
           
                <div className="maintenance-description">{config.CONFIG_maintenance_text}</div>
            </Container>
        </div>
    );
}

export default Maintenance;