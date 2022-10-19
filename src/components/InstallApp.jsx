import { Drawer } from '@mui/material';
import * as React from 'react';
import { useSelector } from 'react-redux';
import "../css/install-app.css";
import { _getMobileType } from './helpers';
import CloseIcon from '@mui/icons-material/Close';


export default function InstallApp( {initStatus = false} ) {

    const {icon, linkIos, linkAndroid, installText} = useSelector( ({config}) => {
        return {
            icon: config.data.CONFIG_company_favicon,
            linkIos: config.data.CONFIG_APPSTORE,
            linkAndroid: config.data.CONFIG_GPLAY,
            installText: config.data.CONFIG_mobile_install_text
        }
    });

    let [open, setOpen] = React.useState(true);
    const mobileType = _getMobileType();

    const handleClose = () => {
        setOpen(!open);
    }
    let linkApp;
    console.log(mobileType);
    if( mobileType == 'android' && linkAndroid ) {
        linkApp = linkAndroid;
    } else if( mobileType == 'ios' && linkIos ) {
        linkApp = linkIos;
    } else open = false;

    return (
        <React.Fragment key="bottom">
            <Drawer            
                anchor="bottom"
                open={open}
                onClose={handleClose}
                className="install-app--panel">
                <div className="install-app--inner">
                    <img className="install-app--icon" src={icon} />
                    <h4 className="install-app--title">Скачай мобильное приложение {mobileType}</h4>
                    <CloseIcon className="install-app--close" onClick={handleClose}/>
                    { installText ? (
                        <div className="install-app--text" dangerouslySetInnerHTML={{__html: installText}}></div>
                    ) : (
                        <div className="install-app--text">
                            <ul>
                                <li>Заказывай вкусняшки в один клик</li>
                                <li>Копи и списывай бонусы</li>
                                <li>Получай персональные скидки и акции</li>
                            </ul>
                        </div>
                    ) }
                    <a href={linkApp} target="_blank" className="btn btn-lg btn--action w-100 t-center">Установить приложение</a>
                </div>
            </Drawer>
        </React.Fragment>
    );
}