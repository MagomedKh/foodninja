import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { saveLogin, logout, setOpenModalAuth } from '../../redux/actions/user';
import { Alert, Container } from '@mui/material'
import {Link, useNavigate} from 'react-router-dom';
import { Dialog } from '@material-ui/core';
import Slide from '@mui/material/Slide';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import TabPanel from '@mui/lab/TabPanel';
import {Orders} from '../';
import { Button, Grid } from '@material-ui/core';
import LoadingButton from '@mui/lab/LoadingButton';
import {setCurrentPage} from '../../redux/actions/pages';
import TextField from '@mui/material/TextField';
import {} from '@mui/material/TextField';
import axios from 'axios';
import {_getDomain, _isMobile} from '../../components/helpers.js';
import '../../css/account.css';

const Transition = React.forwardRef(function Transition(props, ref) {
return <Slide direction="up" ref={ref} {...props} />;
});

const formatingStrPhone = ( inputNumbersValue ) => {
	var formattedPhone = "";
	if (["7", "8", "9"].indexOf(inputNumbersValue[0]) > -1) {
		if (inputNumbersValue[0] === "9") inputNumbersValue = "7" + inputNumbersValue;
		var firstSymbols = (inputNumbersValue[0] === "8") ? "8" : "+7";
		formattedPhone = firstSymbols + " ";
		if (inputNumbersValue.length > 1) {
			formattedPhone += '(' + inputNumbersValue.substring(1, 4);
		}
		if (inputNumbersValue.length >= 5) {
			formattedPhone += ') ' + inputNumbersValue.substring(4, 7);
		}
		if (inputNumbersValue.length >= 8) {
			formattedPhone += '-' + inputNumbersValue.substring(7, 9);
		}
		if (inputNumbersValue.length >= 10) {
			formattedPhone += '-' + inputNumbersValue.substring(9, 11);
		}
	} else {
		formattedPhone = '+' + inputNumbersValue.substring(0, 16);
	}
	return formattedPhone;
}

const getNumbersValue = function (input) {
	return input.replace(/\D/g, '');
}

export default function Account() {
    
	const dispatch = useDispatch();
	const {user, config} = useSelector( ({user, config}) => {
		return {
			user: user.user,
            config: config.data
		}
	});

    const [value, setValue] = React.useState('settings');
    const [loading, setLoading] = React.useState(false);
    const [loadingDelete, setLoadingDelete] = React.useState(false);
    const [validate, setValidate] = React.useState( true );
	const [userName, setUserName] = React.useState( user.name ? user.name : '' );
	const [userEmail, setUserEmail] = React.useState( user.email ? user.email : '' );
	const [userVK, setUserVK] = React.useState( user.vk ? user.vk : '' );
	const [openModal, setOpenModal] = React.useState( false );
	const [userPhone, setUserPhone] = React.useState( user.phone ? formatingStrPhone(user.phone) : '' );

    const handleChangeTab = (event, value) => {
      setValue(value);
    };

	const handleChangeName = (e) => {
		setUserName(e.target.value);
	}	
	const handlePhonePaste = function (e) {
		var input = e.target,
			inputNumbersValue = getNumbersValue(input.value);
		var pasted = e.clipboardData || window.clipboardData;
		if (pasted) {
			var pastedText = pasted.getData('Text');
			if (/\D/g.test(pastedText)) {
				input.value = inputNumbersValue;
				return;
			}
		}
	}
	const handlePhoneInput = function (e) {
		var input = e.target,
			inputNumbersValue = getNumbersValue(input.value),
			selectionStart = input.selectionStart,
			formattedInputValue = "";

		if (!inputNumbersValue) {
			return input.value = "";
		}

		if (input.value.length !== selectionStart) {
			if (e.data && /\D/g.test(e.data)) {
				input.value = inputNumbersValue;
			}
			return;
		}

		formattedInputValue = formatingStrPhone(inputNumbersValue);
		input.value = formattedInputValue;
		setUserPhone(formattedInputValue);
	}
	const handlePhoneKeyDown = function (e) {
		var inputValue = e.target.value.replace(/\D/g, '');
		if (e.keyCode === 8 && inputValue.length === 1) {
			e.target.value = "";
		}
	}
    const handleEmailInput = (e) => {
		setUserEmail(e.target.value);
	}	
    const handleVKInput = (e) => {
		setUserVK(e.target.value);
	}
    
    const handleSaveUser = () => {
		setValidate(true);
		( !userName || getNumbersValue(userPhone).length != 11 ) && setValidate(false);

		if( validate ) {
			setLoading(true);

			axios.post('https://'+_getDomain()+'/?rest-api=saveLogin',
			{
				name: userName,
				phone: getNumbersValue(userPhone),
				email: userEmail,
				vk: userVK,
				token: user.token,
			}).then((resp) => {
				setLoading(false);
				setLoadingDelete(false);
				dispatch(saveLogin(resp.data.user));
			});
		}
    }   
	
	const handleDeleteUser = () => {

		setLoadingDelete(true);

		axios.post('https://'+_getDomain()+'/?rest-api=deleteLogin',
		{
			name: userName,
			phone: getNumbersValue(userPhone),
			token: user.token,
		}).then((resp) => {
			setLoadingDelete(false);
			dispatch(logout());
		});
		
    }    
	
	const toogleModalDeleting = () => {
		setOpenModal(!openModal);
    }

    const handleClickLogout = () => {
        dispatch(logout());
    }    
    
    const handleOpenAuthModal = () => {
        dispatch(setOpenModalAuth(true));
    }

	const handleClickMenu = (url) => {
		dispatch(setCurrentPage(url));
    }

	const userNameProps = {
		error: ( !userName && !validate ) ? true : false,
		helperText: ( !userName && !validate ) ? "Поле обязательно для заполнения" : "Как к вам обращаться?",
	}
	const userPhoneProps = {
		error: ( getNumbersValue(userPhone).length !== 11 && !validate ) ? true : false,
		helperText: ( getNumbersValue(userPhone).length !== 11 && !validate ) ? "Номер указан неверно" : "С вами свяжется оператор для уточнения заказа"
	}

    let dialogProps = {"open": openModal, "maxWidth": "md" };
    if( _isMobile() ) {
        dialogProps.TransitionComponent = Transition;
        dialogProps.fullScreen = true;
        dialogProps.scroll = "body";
    }

    return (
        <Container>
            <h1>Личный кабинет</h1>

			{ user.token ? (
				<div>
					<div className="account-menu">
						<Link variant="button" onClick={() => handleClickMenu('/account')} to="/account" className="btn btn--action">Настройки</Link>
						<Link variant="button" onClick={() => handleClickMenu('/account/orders')} to="/account/orders" className="btn btn--outline-dark">Заказы</Link>
					</div>

					<Grid container spacing={4}>
						<Grid item sm={12} md={5}>
							<TextField 
								id="userName" 
								label="Ваше имя"  
								onInput={handleChangeName} 
								value={ userName }
								sx={{ width: 1, mb: 4 }} 
								{...userNameProps}
								/>
				
							<TextField 
								disabled
								id="userPhone" 
								label="Номер телефона" 
								onKeyDown={handlePhoneKeyDown} 
								onInput={handlePhoneInput} 
								onPaste={handlePhonePaste}
								value={ userPhone }
								sx={{ width: 1, mb: 4 }} 
								{...userPhoneProps} />

							{/* <TextField 
								id="userPhone" 
								label="E-mail" 
								onInput={handleEmailInput} 
								value={ userEmail }
								sx={{ width: 1, mb: 4 }} />                     */}
								
							<TextField 
								id="userPhone" 
								label="Профиль ВКонтакте" 
								onInput={handleVKInput} 
								value={ userVK }
								sx={{ width: 1, mb: 4 }} /> 
							
						</Grid>

						{ config.CONFIG_bonuses_program_status && (
								<Grid item sm={12} md={5}>
								<div className="user-bonuses-info">
									<h2>Бонусы</h2>
									<p>
										На вашем счету <span className="main-color">{user.bonuses}</span> бонусов.<br />
										1 бонус = <span className="main-color">1 &#8381;</span>
									</p>
									<p>Вы можете оплатить ими до <span className="main-color">{config.CONFIG_bonus_program_order_limit}%</span> от общей суммы заказа.</p>
								</div>
							</Grid>
						)}
					</Grid>

					<LoadingButton loading={loading} sx={{mr: 1.5}} className="btn--action" variant="button" onClick={handleSaveUser}>Сохранить</LoadingButton>
					<Button className="btn--outline-dark" variant="button" onClick={handleClickLogout} sx={{mr: 1.5}}>Выйти</Button>
					<hr className="account-separator" />
					<div className="deleting-account"><a className="btn--delete-account" onClick={toogleModalDeleting} >Удалить аккаунт</a></div>
				
					<Dialog
						maxWidth="md"
						{...dialogProps}
						>
						<div className="modal-alert--wrapper">
							<IconButton
							edge="start"
							color="inherit"
							onClick={toogleModalDeleting}
							aria-label="close"
							className="modal-close"
							><CloseIcon /></IconButton>	
							<h2 className="modal-alert--title">Удаление аккаунта</h2>
							<div className="modal-alert--inner">
								Вы уверены что хотите удалить аккаунт? 
								
								<Alert  severity="error" sx={{mt: 1.5, mb: 1.5}} >Все данные будут удалены безвозвратно.</Alert>	

								<LoadingButton loading={loadingDelete} sx={{mr: 1.5}} className="btn--outline-dark" variant="button" onClick={handleDeleteUser}>Удалить</LoadingButton>
								<Button variant="button" className="btn btn--action" onClick={toogleModalDeleting}>Отмена</Button>
							</div>
						</div>
					</Dialog>
				</div>
			) : (
				<div className="auth">
					<p>Вы не авторизованы.</p>
					<p><a className="main-color" onClick={handleOpenAuthModal}>Авторизуйтесь</a>, чтобы войти в личный кабинет.</p>
				</div>
			) }
        </Container>
    )
}
