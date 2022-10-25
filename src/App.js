import React from 'react';
import {Route, Routes} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {setProducts, setCategories, setAddonProducts, setRecommendProducts, setBonusesProducts} from './redux/actions/products';
import {setConfig, setMainLoading} from './redux/actions/config';
import {setOrderTime} from './redux/actions/orderTime';
import {setGateways} from './redux/actions/gateways';
import {setBanners} from './redux/actions/banners';
import {logout, login} from './redux/actions/user';
import {setTopMenu, setBottomMenu, setPages, setSales, setCurrentPage} from './redux/actions/pages';
import {Header, ProductModal, Footer, AuthModal, BigLoader, Maintenance, InstallApp, ChooseTown, SystemAlerts} from './components';
import {Cart, Home, Sales, Contacts, Account, Orders, Checkout, Page, OrderComplete, Product} from './pages';
import axios from 'axios';
import './fonts/cera/CeraRoundProMedium.woff2';
import './fonts/cera/CeraRoundProBold.woff2';
import './App.css';
import { createGlobalStyle } from 'styled-components';
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import {_getDomain, _getPlatform, _isMobile} from './components/helpers';


function App () {
	const dispatch = useDispatch();
	const {user, config} = useSelector( ({user, config}) => {
		return {
			user: user.user,
			config: config.data
		}
	});

  	React.useEffect(() => {
		dispatch(setCurrentPage(window.location.pathname));
		dispatch(setMainLoading(false));
		axios.get('https://'+_getDomain()+'/?rest-api=base_init', { mode: 'no-cors'}).then((resp) => {
			dispatch(setCategories(resp.data.categories));
			dispatch(setConfig(resp.data.config));
			dispatch(setTopMenu(resp.data.top_menu));
			dispatch(setBottomMenu(resp.data.bottom_menu));
			dispatch(setPages(resp.data.pages));
			dispatch(setSales(resp.data.sales));
			dispatch(setProducts(resp.data.products));
			dispatch(setAddonProducts(resp.data.addon_products));
			dispatch(setRecommendProducts(resp.data.recommend_products));
			dispatch(setBonusesProducts(resp.data.bonuses_products));
			dispatch(setGateways(resp.data.gateways));
			dispatch(setOrderTime(resp.data.availableTimeOrder));
			dispatch(setBanners(resp.data.banners));
		}).then(() => {
			if( user.token && user.phone )
				axios.get(
				'https://'+_getDomain()+'/?rest-api=checkLogin&token='+user.token+'&phone='+user.phone, 
				{ mode: 'no-cors'}).then((resp) => {
					resp.data.status === 'success' ? dispatch(login(resp.data.user)) : dispatch(logout(true));
					dispatch(setMainLoading(true));
				});
			else
				dispatch(setMainLoading(true));	
		});
	}, []);

	const mainColor = config ? config.CONFIG_main_color !== undefined ?  config.CONFIG_main_color : '#000' : '#000';
	const secondColor = config ? config.CONFIG_second_color !== undefined ? config.CONFIG_second_color : '#000' : '#000';

	const MainTheme = createGlobalStyle`
	:root {
		--main-color: ${ mainColor.match( /#[a-f0-9]{6}\b/gi ) ? mainColor : '#000' };
		--sec-color: ${ secondColor.match( /#[a-f0-9]{6}\b/gi ) ? secondColor : '#000' };
	}`;

	const foodninja = createTheme({
		palette: {
		  primary: {
			light: '#757ce8',
			main: mainColor.match( /#[a-f0-9]{6}\b/gi ) ? mainColor : '#000',
			dark: '#002884',
			contrastText: '#fff',
		  },
		  secondary: {
			light: '#ff7961',
			main: secondColor.match( /#[a-f0-9]{6}\b/gi ) ? secondColor : '#000',
			dark: '#ba000d',
			contrastText: '#000',
		  },
		},
		typography: {
		  "fontFamily": `"Cera","sans-serif"`
		}
	});

	return (
		<ThemeProvider theme={foodninja}>
			<MainTheme />
			{ ( config !== undefined && Object.keys(config).length ) ? (
				<div>
					{ config.site_status === 'closed' ? (
						<Maintenance />
					) : (
					<div>
						<Header />
						<Routes>
							<Route exact path="/" element={<Home/>} />
							<Route path="/product/*" element={<Product/>} />
							<Route exact path="/cart" element={<Cart/>} />
							<Route exact path="/checkout" element={<Checkout/>} />
							<Route exact path="/sales" element={<Sales/>} />
							<Route exact path="/contacts" element={<Contacts/>} />
							<Route exact path="/account" element={<Account/>} />
							<Route exact path="/account/orders" element={<Orders/>} />
							<Route exact path="/order-complete" element={<OrderComplete/>} />
							<Route path="*" element={<Page/>} />
						</Routes>
						{ _getPlatform() === 'site' ? (
							<Footer />
						) : (
							<div className="footer-space"></div>
						) }
						<ProductModal />
						<AuthModal />
						<SystemAlerts />
						{ ( config.towns !== undefined && config.towns.length && _getPlatform() !== 'vk' ) ? (
							<ChooseTown />
						) : '' }
						{  _getPlatform() === 'site' && _isMobile() ? (
							<InstallApp />
						) : '' }
					</div>
					) }
				</div>
			) : (
				<BigLoader initStatus={true} />
			) }
		</ThemeProvider>
	);
}

export default App;