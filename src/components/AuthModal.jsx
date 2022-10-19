import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {_isMobile, _getDomain} from './helpers.js';
import {useNavigate} from 'react-router-dom';
import {setOpenModalAuth, login} from '../redux/actions/user';
import {setCurrentPage} from '../redux/actions/pages';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@material-ui/core/Button';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import '../css/auth-modal.css';
import TextField from '@mui/material/TextField';
import axios from 'axios';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function AuthModal() {
	const dispatch = useDispatch();

	const authType = 'verify-code';
	const inputCode = React.useRef([]);
	const [loading, setLoading] = React.useState();
	const [error, setError] = React.useState();
	const [authPhone, setAuthPhone] = React.useState();
	const [authPhoneCode, setAuthPhoneCode] = React.useState(false);
	const [verifyPhone, setVerifyPhone] = React.useState(false);

	const [recallInterval, setRecallInterval] = React.useState(false);
	const [recallTimer, setRecallTimer] = React.useState(30);
	const [recallActive, setRecallActive] = React.useState(false); ;


	const startRecallTimer = () => {
		stopRecallTimer();
		setRecallActive(true);
		setRecallInterval(setInterval(() => {
			setRecallTimer(prevTimer => --prevTimer);
		} , 1000));
	}
	const stopRecallTimer = () => {
		setRecallActive(false);
		setRecallTimer(30);
		if( recallInterval ) 
		clearInterval(recallInterval);
	}
	if( recallActive && recallTimer < 1 ) {
		stopRecallTimer();
	}

	const {openModalAuth, currentPage} = useSelector( ({user, pages}) => {
		return {
			openModalAuth: user.openModalAuth,
			currentPage: pages.currentPage
		}
	});

  	let dialogAuthProps = {"open": openModalAuth };
  	if( _isMobile() ) {
		dialogAuthProps.TransitionComponent = Transition;
		dialogAuthProps.fullScreen = true;
  	}

	const navigate = useNavigate();

	const handleClose = () => {
		dispatch(setOpenModalAuth(false));
	};

	const handleAuth = (e) => {
		if( verifyPhone ) {

			const phone = getNumbersValue(authPhone);

			setLoading(true);
			axios.get(
				'https://'+_getDomain()+'/?rest-api=verifyCodeRobocall&phone='+phone,
				{ mode: 'no-cors'}
				).then((resp) => {
					if( resp.data.status === 'success' ) {
						setAuthPhoneCode(true); 
						setError('');
						startRecallTimer();
					 } else setError(resp.data.text);
					setLoading(false);
				}
			);
		} else {

		}
	};	
	
	const handleRecall = (e) => {
		if( verifyPhone ) {
			const phone = getNumbersValue(authPhone);
			setLoading(true);
			setError('');
			axios.get(
				'https://'+_getDomain()+'/?rest-api=verifyCodeRobocallAgain&phone='+phone,
				{ mode: 'no-cors'}
				).then((resp) => {
					setLoading(false);
					startRecallTimer();
					resp.data.status === 'error' && setError(resp.data.text);
				}
			);
		} else {

		}
	};	
	




	const handleChangeNumber = () => {
		if( recallInterval ) 
			clearInterval(recallInterval);

		setAuthPhoneCode(!authPhoneCode);
	}; 
	
	const handleEnterCode = (e, field) => {
		console.log(111);
		const codeInputs = document.querySelectorAll('.phone-auth-wrapper .verify-code');
		const code = Array.from(codeInputs).reduce( (codeSum, element) => codeSum + element.value.toString(), '');

		const nextSibling = document.querySelector('.code-'+(code.length+1));
		if (nextSibling !== null) {
            nextSibling.focus();
        }		

		if( code.length === 4 ) {
			const phone = getNumbersValue(authPhone);
			setLoading(true);
			axios.get(
				'https://'+_getDomain()+'/?rest-api=loginByPhoneCode&phone='+phone+'&code='+code,
				{ mode: 'no-cors'}
				).then((resp) => {
					console.log(resp.data);
					if( resp.data.status === 'success' ) {
						dispatch(login(resp.data.user));
						setError(false);
						if( currentPage === '/cart' ) {
							dispatch(setCurrentPage('/checkout'));
							navigate('/checkout', {replace: true});  
						}
						dispatch(setOpenModalAuth(false));
					} else setError(resp.data.text);
					setLoading(false);
				}
			);
		}
	}
	

	const getNumbersValue = function (input) {
		return input.replace(/\D/g, '');
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

		if (["7", "8", "9"].indexOf(inputNumbersValue[0]) > -1) {
			if (inputNumbersValue[0] === "9") inputNumbersValue = "7" + inputNumbersValue;
			var firstSymbols = (inputNumbersValue[0] === "8") ? "8" : "+7";
			formattedInputValue = input.value = firstSymbols + " ";
			if (inputNumbersValue.length > 1) {
				formattedInputValue += '(' + inputNumbersValue.substring(1, 4);
			}
			if (inputNumbersValue.length >= 5) {
				formattedInputValue += ') ' + inputNumbersValue.substring(4, 7);
			}
			if (inputNumbersValue.length >= 8) {
				formattedInputValue += '-' + inputNumbersValue.substring(7, 9);
			}
			if (inputNumbersValue.length >= 10) {
				formattedInputValue += '-' + inputNumbersValue.substring(9, 11);
			}
		} else {
			formattedInputValue = '+' + inputNumbersValue.substring(0, 16);
		}
		input.value = formattedInputValue;
		setAuthPhone(formattedInputValue);
		inputNumbersValue.length >= 11 ? setVerifyPhone(true) : setVerifyPhone(false);
	}
	const handlePhoneKeyDown = function (e) {
		var inputValue = e.target.value.replace(/\D/g, '');
		if (e.keyCode === 8 && inputValue.length === 1) {
			e.target.value = "";
		}
	}

	return (
		<Dialog
			{...dialogAuthProps}
		>
			<div className="auth-modal">
				{ loading &&
					<div className="loader-wrapper">
						<CircularProgress />
					</div>
				}
				<h2 className="auth-modal--title">Авторизация</h2>
				<IconButton
					edge="start"
					color="inherit"
					onClick={handleClose}
					aria-label="close"
					className="modal-close"
				><CloseIcon /></IconButton>

				{ error && 
					<Alert severity="error" sx={{mb: 2}}>{error}</Alert>
				}

				{ authType === 'verify-code' ? (
					<div className="phone-auth-wrapper">
						<TextField 
							disabled={authPhoneCode} 
							onKeyDown={handlePhoneKeyDown} 
							onInput={handlePhoneInput} 
							onPaste={handlePhonePaste} 
							label="Номер телефона" 
							className="phone-input phone-mask"
							value={ authPhone ? authPhone : '' }
							type={ _isMobile() ? 'text' : 'text' }
							id="user-phone" />

						{ !authPhoneCode ? (
							<Button 
								variant="button" 
								onClick={handleAuth} 
								className="btn--action auth-btn" 
								disabled={!verifyPhone}>Войти</Button>
						) : (
							<div>
								<div className="auth-modal--info">На ваш номер будет совершен звонок. Для входа введите 4 последние цифры этого номера.</div>

								<Button 
									variant="text" 
									onClick={handleChangeNumber} 
									className="phone-auth--change-number btn--action">Изменить</Button>
								<div className="phone-auth--code">
									<input type={ _isMobile() ? 'number' : 'text' } className="verify-code code-1" ref={inputCode[1]} onKeyUp={e => handleEnterCode(e, inputCode[1])} data-code-number="1" autoComplete="off" name="code-1" />
									<input type={ _isMobile() ? 'number' : 'text' } className="verify-code code-2" ref={inputCode[2]} onKeyUp={e => handleEnterCode(e, inputCode[2])} data-code-number="2" autoComplete="off" name="code-2" />
									<input type={ _isMobile() ? 'number' : 'text' } className="verify-code code-3" ref={inputCode[3]} onKeyUp={e => handleEnterCode(e, inputCode[3])} data-code-number="3" autoComplete="off" name="code-3" />
									<input type={ _isMobile() ? 'number' : 'text' } className="verify-code code-4" ref={inputCode[4]} onKeyUp={e => handleEnterCode(e, inputCode[4])} data-code-number="4" autoComplete="off" name="code-4" />
								</div>

								<Button
									variant="button" 
									disabled={recallActive}
									onClick={handleRecall} 
									className="phone-auth--recall btn--action"
									sx={{width: 1, mb: 2}}>
									
										Повторный звонок 
										{ recallActive && (
											<span className="recall-timout">
												через {recallTimer} сек.
											</span>
										) }
								</Button>
							</div>
						) }
					</div>
				) : authType === '' &&
					<div className="code-auth-wrapper">


					</div>
				}

				<div className="auth-modal--footer">
					<small>Используя сервис, вы принимаете правила <a href="/privacy" target="_blank">политики конфиденциальности</a> и <a href="/offert" target="_blank">договора публичной оферты</a>.</small>
				</div>
			</div>
		</Dialog>
	);
}
