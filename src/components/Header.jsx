import {useSelector, useDispatch} from 'react-redux';
import '../css/header.css';
import Drawer from '@mui/material/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import React, { useState, useCallback } from 'react';
import Skeleton from '@material-ui/core/Skeleton';
import {setCurrentPage} from '../redux/actions/pages';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import {setTownModal} from '../redux/actions/config';
import {setOpenModalAuth} from '../redux/actions/user';
import {Link, useNavigate} from 'react-router-dom';
import {_isMobile, _getPlatform} from './helpers.js';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Cookies from 'universal-cookie';
import WeClosed from './WeClosed';

function Header(){

  const [activeTopMenu, setActiveTopMenu] = useState(5792);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openChooseTown, setOpenChooseTown] = useState(false);
  const cookies = new Cookies();
  const currentTown = cookies.get('currentTown');


  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  }; 
  const dispatch = useDispatch();
  const {configStatus, config, topMenu, currentPage, user} = useSelector( ({config, pages, user}) => {
    return {
      configStatus: config.status,
      config: config.data,
      topMenu: pages.topMenu,
      currentPage: pages.currentPage,
      user: user.user
    }
  });
  
  const navigate = useNavigate();
  const hadleClickAccount = useCallback(() => {
      if( mobileMenuOpen ) setMobileMenuOpen(!mobileMenuOpen);
      dispatch(setCurrentPage('/account'));
      navigate('/account', {replace: true});
  }, [navigate]);

  const openAuthModalBtnClick = () => {
    dispatch(setOpenModalAuth(true));
  };  
  
  const handleClickTopMenu = item => {
    if( mobileMenuOpen ) setMobileMenuOpen(!mobileMenuOpen);
    dispatch(setCurrentPage(item.url));
    setActiveTopMenu(item.id);
  }  
  
  const handleOpenTownModal = () => {
    dispatch(setTownModal(true));
  }
  
  const stepperPage = ['/cart', '/checkout', 'order-complete']
  const steps = [
    'Корзина',
    'Оформление заказа',
    'Заказ принят',
  ];

  return (
    <div>
      <WeClosed />

      <AppBar position="static" className="header-bar">
        <Container maxWidth="lg">
            <Toolbar className="header-wrapper">
                { _getPlatform() === 'vk' ? <a target="_blank" href={`https://vk.com/club${config.CONFIG_vk_group_id}`}><img src={config.CONFIG_company_logo_main} className="header-logo" alt="Логотип"/></a>
                : <Link onClick={() => dispatch(setCurrentPage('/'))} to="/"><img src={config.CONFIG_company_logo_main} className="header-logo" alt="Логотип"/></Link> }
                
              
                { _isMobile() && (
                  <div className="header-mobile-menu">
                    <MenuIcon onClick={toggleMobileMenu}/>
                    
                    <Drawer
                      anchor="left"
                      open={mobileMenuOpen}
                      onClose={toggleMobileMenu}
                      className="mobile-menu"
                    >
                    <div className="mobile-menu-wrapper">
                      <div className="mobile-menu--header">
                        <IconButton
                          color="inherit"
                          onClick={toggleMobileMenu}
                          className="minicart--close"
                        ><CloseIcon /></IconButton>  
                        <img src={config.CONFIG_company_logo_footer} className="header-logo" alt="Логотип"/>
                      </div>

                      { config.towns !== undefined &&  config.towns.length ? (
                        <div className="mobile-menu--choose-town" onClick={handleOpenTownModal}>
                          <LocationOnIcon />
                          <div>
                            <b className="choosenTown">{ config ? config.CONFIG_town : <Skeleton variant="text" animation="wave" />}</b><br />
                            <small>Изменить</small>
                          </div>
                        </div>
                      ) : '' }

                      { topMenu && (
                        <ul>
                          { topMenu.map( (item, index) => <li key={item.id}>
                              { item.target === '_blank' ? (
                                <a href={item.url} target="_blank" title={item.title}>{item.title}</a>
                              ) : (
                                <Link onClick={() => handleClickTopMenu(item)} className={ item.id === activeTopMenu ? 'active' : '' } to={item.url}>{item.title}</Link>
                              ) }
                            </li> ) }
                        </ul>
                      ) }

                      { config.CONFIG_auth_type !== 'noauth' &&
                      <div className="mobile-menu--user-account-button">
                        { !user.token ? <Button onClick={openAuthModalBtnClick} className="btn--action" variant="contained" sx={{width: 1}}>Войти</Button> : <Button className="btn--action" onClick={hadleClickAccount} variant="contained" sx={{width: 1}}>Личный кабинет</Button> }
                      </div> }


                      <div className="mobile-menu--contacts">
                        <svg xmlns="http://www.w3.org/2000/svg" className="icn" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 512.006 512.006" xmlSpace="preserve"><g><g><g><path d="M502.05,407.127l-56.761-37.844L394.83,335.65c-9.738-6.479-22.825-4.355-30.014,4.873l-31.223,40.139     c-6.707,8.71-18.772,11.213-28.39,5.888c-21.186-11.785-46.239-22.881-101.517-78.23c-55.278-55.349-66.445-80.331-78.23-101.517     c-5.325-9.618-2.822-21.683,5.888-28.389l40.139-31.223c9.227-7.188,11.352-20.275,4.873-30.014l-32.6-48.905L104.879,9.956     C98.262,0.03,85.016-2.95,74.786,3.185L29.95,30.083C17.833,37.222,8.926,48.75,5.074,62.277     C-7.187,106.98-9.659,205.593,148.381,363.633s256.644,155.56,301.347,143.298c13.527-3.851,25.055-12.758,32.194-24.876     l26.898-44.835C514.956,426.989,511.976,413.744,502.05,407.127z"/><path d="M291.309,79.447c82.842,0.092,149.977,67.226,150.069,150.069c0,4.875,3.952,8.828,8.828,8.828     c4.875,0,8.828-3.952,8.828-8.828c-0.102-92.589-75.135-167.622-167.724-167.724c-4.875,0-8.828,3.952-8.828,8.828     C282.481,75.494,286.433,79.447,291.309,79.447z"/><path d="M291.309,132.412c53.603,0.063,97.04,43.501,97.103,97.103c0,4.875,3.952,8.828,8.828,8.828     c4.875,0,8.828-3.952,8.828-8.828c-0.073-63.349-51.409-114.686-114.759-114.759c-4.875,0-8.828,3.952-8.828,8.828     C282.481,128.46,286.433,132.412,291.309,132.412z"/><path d="M291.309,185.378c24.365,0.029,44.109,19.773,44.138,44.138c0,4.875,3.952,8.828,8.828,8.828     c4.875,0,8.828-3.952,8.828-8.828c-0.039-34.111-27.682-61.754-61.793-61.793c-4.875,0-8.828,3.952-8.828,8.828     C282.481,181.426,286.433,185.378,291.309,185.378z"/></g></g></g></svg>
												<div>
													<a className="info" href={ ( _getPlatform() === 'android' || _getPlatform() === 'ios' ) ? `#` : `tel:${ config ? config.CONFIG_format_phone : ''}` }>{ config ? config.CONFIG_format_phone : <Skeleton variant="text" animation="wave" />}</a>
												</div>
                      </div>
                      
                      <div className="header-work">
                        <svg xmlns="http://www.w3.org/2000/svg" className="icn" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" xmlSpace="preserve"><g><g><path d="M347.216,301.211l-71.387-53.54V138.609c0-10.966-8.864-19.83-19.83-19.83c-10.966,0-19.83,8.864-19.83,19.83v118.978 c0,6.246,2.935,12.136,7.932,15.864l79.318,59.489c3.569,2.677,7.734,3.966,11.878,3.966c6.048,0,11.997-2.717,15.884-7.952 C357.766,320.208,355.981,307.775,347.216,301.211z"/></g></g><g><g><path d="M256,0C114.833,0,0,114.833,0,256s114.833,256,256,256s256-114.833,256-256S397.167,0,256,0z M256,472.341 c-119.275,0-216.341-97.066-216.341-216.341S136.725,39.659,256,39.659c119.295,0,216.341,97.066,216.341,216.341 S375.275,472.341,256,472.341z"/></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
                        <div>
                          <div className="title">Мы работаем</div>
                          <div className="info">
                          { config ? (
                            `с ${config.CONFIG_format_start_work} до ${config.CONFIG_format_end_work}`
                          ) : <Skeleton variant="text" animation="wave" /> }
                          </div>
                        </div>
                      </div>
                    </div>
                  </Drawer>
                </div>
                )}


                { !stepperPage.includes(currentPage) ? (
                <div className="standart-header">
                  <div className="header-phone">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icn" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 512.006 512.006" xmlSpace="preserve"><g><g><g><path d="M502.05,407.127l-56.761-37.844L394.83,335.65c-9.738-6.479-22.825-4.355-30.014,4.873l-31.223,40.139     c-6.707,8.71-18.772,11.213-28.39,5.888c-21.186-11.785-46.239-22.881-101.517-78.23c-55.278-55.349-66.445-80.331-78.23-101.517     c-5.325-9.618-2.822-21.683,5.888-28.389l40.139-31.223c9.227-7.188,11.352-20.275,4.873-30.014l-32.6-48.905L104.879,9.956     C98.262,0.03,85.016-2.95,74.786,3.185L29.95,30.083C17.833,37.222,8.926,48.75,5.074,62.277     C-7.187,106.98-9.659,205.593,148.381,363.633s256.644,155.56,301.347,143.298c13.527-3.851,25.055-12.758,32.194-24.876     l26.898-44.835C514.956,426.989,511.976,413.744,502.05,407.127z"/><path d="M291.309,79.447c82.842,0.092,149.977,67.226,150.069,150.069c0,4.875,3.952,8.828,8.828,8.828     c4.875,0,8.828-3.952,8.828-8.828c-0.102-92.589-75.135-167.622-167.724-167.724c-4.875,0-8.828,3.952-8.828,8.828     C282.481,75.494,286.433,79.447,291.309,79.447z"/><path d="M291.309,132.412c53.603,0.063,97.04,43.501,97.103,97.103c0,4.875,3.952,8.828,8.828,8.828     c4.875,0,8.828-3.952,8.828-8.828c-0.073-63.349-51.409-114.686-114.759-114.759c-4.875,0-8.828,3.952-8.828,8.828     C282.481,128.46,286.433,132.412,291.309,132.412z"/><path d="M291.309,185.378c24.365,0.029,44.109,19.773,44.138,44.138c0,4.875,3.952,8.828,8.828,8.828     c4.875,0,8.828-3.952,8.828-8.828c-0.039-34.111-27.682-61.754-61.793-61.793c-4.875,0-8.828,3.952-8.828,8.828     C282.481,181.426,286.433,185.378,291.309,185.378z"/></g></g></g></svg>
                    <div>
                        { ( config.towns !== undefined && config.towns.length ) ? (
                          <div className="title">
                            Ваш город <b className="choosenTown" onClick={handleOpenTownModal}>{ config ? config.CONFIG_town : <Skeleton variant="text" animation="wave" />}</b>
                          </div>
                        ) : (
                          <div className="title">
                            Доставка еды <b className="choosenTown">{ config ? config.CONFIG_town : <Skeleton variant="text" animation="wave" />}</b>
                          </div>
                        ) }
                        <a className="info" href={ ( _getPlatform() === 'android' || _getPlatform() === 'ios' ) ? `#` : `tel:${ config ? config.CONFIG_format_phone : ''}` }>{ config ? config.CONFIG_format_phone : <Skeleton variant="text" animation="wave" />}</a>
                    </div>
                  </div>
                  <div className="header-work">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icn" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" xmlSpace="preserve"><g><g><path d="M347.216,301.211l-71.387-53.54V138.609c0-10.966-8.864-19.83-19.83-19.83c-10.966,0-19.83,8.864-19.83,19.83v118.978 c0,6.246,2.935,12.136,7.932,15.864l79.318,59.489c3.569,2.677,7.734,3.966,11.878,3.966c6.048,0,11.997-2.717,15.884-7.952 C357.766,320.208,355.981,307.775,347.216,301.211z"/></g></g><g><g><path d="M256,0C114.833,0,0,114.833,0,256s114.833,256,256,256s256-114.833,256-256S397.167,0,256,0z M256,472.341 c-119.275,0-216.341-97.066-216.341-216.341S136.725,39.659,256,39.659c119.295,0,216.341,97.066,216.341,216.341 S375.275,472.341,256,472.341z"/></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
                    <div>
                        <div className="title">Мы работаем</div>
                        <div className="info">
                          { config ? (
                            `с ${config.CONFIG_format_start_work} до ${config.CONFIG_format_end_work}`
                          ) : <Skeleton variant="text" animation="wave" /> }
                        </div>
                    </div>
                  </div>
                  { ( !_isMobile() && config.CONFIG_auth_type !== 'noauth' ) && (
                    <div className="header--right-col">
                      <div className="header-login">
                          { !user.token ? <Button onClick={openAuthModalBtnClick} className="btn--action" variant="contained">Войти</Button> : <Button className="btn--action" onClick={hadleClickAccount} variant="contained">Личный кабинет</Button> }
                      </div>
                    </div>
                  ) }
                </div>
                ) : !_isMobile() && (
                  <div className="stepper-header">
                    <Stepper activeStep={stepperPage.indexOf(currentPage)} alternativeLabel>
                      {steps.map((label) => (
                        <Step key={label}>
                          <StepLabel className="step-label">{label}</StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                  </div>
                ) }
            </Toolbar>
        </Container>
      </AppBar>
      
      { !stepperPage.includes(currentPage) && !_isMobile() ? (
      <div className="top-menu">
        <Container>
          { topMenu ? (
            <ul>
              { topMenu.map( (item, index) => <li key={item.id}>
                  { item.target === '_blank' ? (
                    <a href={item.url} target="_blank" title={item.title}>{item.title}</a>
                   ) : (
                    <Link onClick={() => handleClickTopMenu(item)} className={ item.id === activeTopMenu ? 'active' : '' } to={item.url}>{item.title}</Link>
                  ) }
                </li> ) }
            </ul>
          ) : <Skeleton variant="text" animation="wave" /> }
        </Container>
      </div>
      ) : '' }
    </div>
  );
}

export default Header;