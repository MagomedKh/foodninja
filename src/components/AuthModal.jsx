import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { _isMobile, _getDomain, _getPlatform } from "./helpers.js";
import { useNavigate, useLocation } from "react-router-dom";
import { setOpenModalAuth, login } from "../redux/actions/user";
import { closeMobileMenu } from "../redux/actions/header";
import { closeMiniCart } from "../redux/actions/miniCart";
import {
    Alert,
    Button,
    IconButton,
    CircularProgress,
    Dialog,
    Slide,
    TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "../css/auth-modal.css";
import axios from "axios";
import { GoogleReCaptcha } from "react-google-recaptcha-v3";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function AuthModal() {
    const firstInput = useRef();
    const secondInput = useRef();
    const thirdInput = useRef();
    const fourthInput = useRef();
    const dispatch = useDispatch();
    const { pathname } = useLocation();

    const { data: config } = useSelector((state) => state.config);

    const { openModalAuth } = useSelector(({ user }) => {
        return {
            openModalAuth: user.openModalAuth,
        };
    });

    const { miniCartOpen } = useSelector((state) => state.miniCart);

    const authType = "verify-code";
    const inputCode = React.useRef([]);
    const [loading, setLoading] = React.useState();
    const [error, setError] = React.useState(null);
    const [authPhone, setAuthPhone] = React.useState();
    const [authPhoneCode, setAuthPhoneCode] = React.useState(false);
    const [verifyPhone, setVerifyPhone] = React.useState(false);
    const [recallInterval, setRecallInterval] = React.useState(false);
    const [recallTimer, setRecallTimer] = React.useState(30);
    const [recallActive, setRecallActive] = React.useState(false);
    const [token, setToken] = React.useState("");
    const [refreshReCaptcha, setRefreshReCaptcha] = useState(false);

    const startRecallTimer = () => {
        stopRecallTimer();
        setRecallActive(true);
        setRecallInterval(
            setInterval(() => {
                setRecallTimer((prevTimer) => --prevTimer);
            }, 1000)
        );
    };
    const stopRecallTimer = () => {
        setRecallActive(false);
        setRecallTimer(30);
        if (recallInterval) clearInterval(recallInterval);
    };
    if (recallActive && recallTimer < 1) {
        stopRecallTimer();
    }

    let dialogAuthProps = { open: openModalAuth };
    if (_isMobile()) {
        dialogAuthProps.TransitionComponent = Transition;
        dialogAuthProps.fullScreen = true;
    }

    const navigate = useNavigate();

    const handleClose = () => {
        dispatch(setOpenModalAuth(false));
    };

    const handleAuth = (e) => {
        if (verifyPhone) {
            const phone = getNumbersValue(authPhone);

            setLoading(true);
            axios
                .get(
                    "https://" +
                        _getDomain() +
                        "/?rest-api=verifyCodeRobocall&phone=" +
                        phone +
                        "&recaptchaResponse=" +
                        token +
                        "&platform=" +
                        _getPlatform(),
                    { mode: "no-cors" }
                )
                .then((resp) => {
                    if (resp.data.status === "success") {
                        setAuthPhoneCode(true);
                        setError(null);
                        startRecallTimer();
                    } else
                        setError({
                            status: resp.data.status,
                            message: resp.data.text,
                        });
                    setLoading(false);
                });
            setRefreshReCaptcha((r) => !r);
        } else {
        }
    };

    const handleRecall = (e) => {
        if (verifyPhone) {
            const phone = getNumbersValue(authPhone);
            setLoading(true);
            setError(null);
            axios
                .get(
                    "https://" +
                        _getDomain() +
                        "/?rest-api=verifyCodeRobocallAgain&phone=" +
                        phone +
                        "&recaptchaResponse=" +
                        token +
                        "&platform=" +
                        _getPlatform(),
                    { mode: "no-cors" }
                )
                .then((resp) => {
                    setLoading(false);
                    startRecallTimer();
                    resp.data.status === "error" &&
                        setError({
                            status: resp.data.status,
                            message: resp.data.text,
                        });
                });
            setRefreshReCaptcha((r) => !r);
        } else {
        }
    };

    const handleResms = (e) => {
        if (verifyPhone) {
            const phone = getNumbersValue(authPhone);
            setLoading(true);
            setError(null);
            axios
                .get(
                    "https://" +
                        _getDomain() +
                        "/?rest-api=verifyCodeSms&phone=" +
                        phone +
                        "&recaptchaResponse=" +
                        token +
                        "&platform=" +
                        _getPlatform(),
                    { mode: "no-cors" }
                )
                .then((resp) => {
                    setLoading(false);
                    startRecallTimer();
                    resp.data.status === "error" &&
                        setError({
                            status: resp.data.status,
                            message: resp.data.text,
                        });
                });
            setRefreshReCaptcha((r) => !r);
        } else {
        }
    };

    const handleChangeNumber = () => {
        if (recallInterval) clearInterval(recallInterval);

        setAuthPhoneCode(!authPhoneCode);
    };

    const handleEnterSymbol = (e, field) => {
        const nextSibling = field?.current.nextSibling;
        if (nextSibling !== null && e.target.value) {
            nextSibling.focus();
        }
    };

    const handleEnterLastSymbol = (e, field) => {
        const codeInputs = document.querySelectorAll(
            ".phone-auth-wrapper .verify-code"
        );
        const code = Array.from(codeInputs).reduce(
            (codeSum, element) => codeSum + element.value.toString(),
            ""
        );

        if (code.length === 4) {
            const phone = getNumbersValue(authPhone);
            setLoading(true);
            axios
                .get(
                    "https://" +
                        _getDomain() +
                        "/?rest-api=loginByPhoneCode&phone=" +
                        phone +
                        "&code=" +
                        code +
                        "&platform=" +
                        _getPlatform(),
                    { mode: "no-cors" }
                )
                .then((resp) => {
                    console.log(resp.data);
                    if (resp.data.status === "success") {
                        dispatch(login(resp.data.user));
                        setError(null);
                        if (pathname === "/cart" || miniCartOpen) {
                            navigate("/checkout", { replace: true });
                        }
                        dispatch(closeMiniCart());
                        dispatch(setOpenModalAuth(false));
                        dispatch(closeMobileMenu());
                    } else
                        setError({
                            status: resp.data.status,
                            message: resp.data.text,
                        });
                    setLoading(false);
                });
        }
    };

    const getNumbersValue = function (input) {
        return input.replace(/\D/g, "");
    };
    const handlePhonePaste = function (e) {
        var input = e.target,
            inputNumbersValue = getNumbersValue(input.value);
        var pasted = e.clipboardData || window.clipboardData;
        if (pasted) {
            var pastedText = pasted.getData("Text");
            if (/\D/g.test(pastedText)) {
                input.value = inputNumbersValue;
                return;
            }
        }
    };
    const handlePhoneInput = function (e) {
        var input = e.target,
            inputNumbersValue = getNumbersValue(input.value),
            selectionStart = input.selectionStart,
            formattedInputValue = "";

        if (!inputNumbersValue) {
            return (input.value = "");
        }

        if (input.value.length !== selectionStart) {
            if (e.data && /\D/g.test(e.data)) {
                input.value = inputNumbersValue;
            }
            return;
        }

        if (["7", "8", "9"].indexOf(inputNumbersValue[0]) > -1) {
            if (inputNumbersValue[0] === "9")
                inputNumbersValue = "7" + inputNumbersValue;
            var firstSymbols = inputNumbersValue[0] === "8" ? "8" : "+7";
            formattedInputValue = input.value = firstSymbols + " ";
            if (inputNumbersValue.length > 1) {
                formattedInputValue += "(" + inputNumbersValue.substring(1, 4);
            }
            if (inputNumbersValue.length >= 5) {
                formattedInputValue += ") " + inputNumbersValue.substring(4, 7);
            }
            if (inputNumbersValue.length >= 8) {
                formattedInputValue += "-" + inputNumbersValue.substring(7, 9);
            }
            if (inputNumbersValue.length >= 10) {
                formattedInputValue += "-" + inputNumbersValue.substring(9, 11);
            }
        } else {
            formattedInputValue = "+" + inputNumbersValue.substring(0, 16);
        }
        input.value = formattedInputValue;
        setAuthPhone(formattedInputValue);
        inputNumbersValue.length >= 11
            ? setVerifyPhone(true)
            : setVerifyPhone(false);
    };
    const handlePhoneKeyDown = function (e) {
        var inputValue = e.target.value.replace(/\D/g, "");
        if (e.keyCode === 8 && inputValue.length === 1) {
            e.target.value = "";
        }
    };

    const onVerify = useCallback((token) => {
        setToken(token);
    }, []);

    return (
        <Dialog
            {...dialogAuthProps}
            sx={{
                "& .MuiPaper-root": {
                    borderRadius: _isMobile() ? "0px" : "20px",
                },
            }}
        >
            <div className="auth-modal">
                {loading && (
                    <div className="loader-wrapper">
                        <CircularProgress />
                    </div>
                )}
                <h2 className="auth-modal--title">Авторизация</h2>
                {config.CONFIG_auth_type === "noauth" ? null : (
                    <GoogleReCaptcha
                        onVerify={onVerify}
                        refreshReCaptcha={refreshReCaptcha}
                    />
                )}
                <IconButton
                    edge="start"
                    color="inherit"
                    onClick={handleClose}
                    aria-label="close"
                    className="modal-close"
                >
                    <CloseIcon />
                </IconButton>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        <div>{error.message}</div>
                        {error?.status === "error_captcha" ? (
                            <Button
                                variant="button"
                                className=" btn--action"
                                onClick={() => window.location.reload()}
                                sx={{
                                    width: "100%",
                                    maxHeight: "34px",
                                    mt: "8px",
                                }}
                            >
                                Обновить
                            </Button>
                        ) : null}
                    </Alert>
                )}

                {authType === "verify-code" ? (
                    <div className="phone-auth-wrapper">
                        <TextField
                            disabled={authPhoneCode}
                            onKeyDown={handlePhoneKeyDown}
                            onInput={handlePhoneInput}
                            onPaste={handlePhonePaste}
                            label="Номер телефона"
                            className="phone-input phone-mask"
                            value={authPhone ? authPhone : ""}
                            type={_isMobile() ? "text" : "text"}
                            id="user-phone"
                        />

                        {!authPhoneCode ? (
                            <div id="recaptcha-container">
                                <Button
                                    variant="button"
                                    onClick={handleAuth}
                                    className="btn--action auth-btn"
                                    disabled={
                                        !verifyPhone ||
                                        error?.status === "error_captcha"
                                    }
                                >
                                    Войти
                                </Button>
                            </div>
                        ) : (
                            <div>
                                <div className="auth-modal--info">
                                    На ваш номер будет совершен звонок. Для
                                    входа введите 4 последние цифры этого
                                    номера.
                                </div>

                                <Button
                                    variant="text"
                                    onClick={handleChangeNumber}
                                    className="phone-auth--change-number btn--action"
                                >
                                    Изменить
                                </Button>
                                <div className="phone-auth--code">
                                    <input
                                        type={_isMobile() ? "number" : "text"}
                                        className="verify-code code-1"
                                        ref={firstInput}
                                        maxlength={1}
                                        onChange={(e) =>
                                            handleEnterSymbol(e, firstInput)
                                        }
                                        data-code-number="1"
                                        autoComplete="off"
                                        name="code-1"
                                    />
                                    <input
                                        type={_isMobile() ? "number" : "text"}
                                        className="verify-code code-2"
                                        ref={secondInput}
                                        maxlength={1}
                                        onChange={(e) =>
                                            handleEnterSymbol(e, secondInput)
                                        }
                                        data-code-number="2"
                                        autoComplete="off"
                                        name="code-2"
                                    />
                                    <input
                                        type={_isMobile() ? "number" : "text"}
                                        className="verify-code code-3"
                                        ref={thirdInput}
                                        maxlength={1}
                                        onChange={(e) =>
                                            handleEnterSymbol(e, thirdInput)
                                        }
                                        data-code-number="3"
                                        autoComplete="off"
                                        name="code-3"
                                    />
                                    <input
                                        type={_isMobile() ? "number" : "text"}
                                        className="verify-code code-4"
                                        ref={fourthInput}
                                        maxlength={1}
                                        onChange={(e) =>
                                            handleEnterLastSymbol(
                                                e,
                                                fourthInput
                                            )
                                        }
                                        data-code-number="4"
                                        autoComplete="off"
                                        name="code-4"
                                    />
                                </div>

                                <Button
                                    variant="button"
                                    disabled={recallActive}
                                    onClick={handleRecall}
                                    className="phone-auth--recall btn--action"
                                    sx={{ width: 1 }}
                                >
                                    Повторный звонок
                                    {recallActive && (
                                        <span className="recall-timout">
                                            через {recallTimer} сек.
                                        </span>
                                    )}
                                </Button>

                                <div className="auth-modal--info">
                                    <b>Не поступил звонок?</b>
                                    <br />
                                    Проверьте правильность номера телефона.
                                </div>

                                {config.CONFIG_auth_type ===
                                "robocallwithsms" ? (
                                    <Button
                                        variant="button"
                                        disabled={recallActive}
                                        onClick={handleResms}
                                        className="phone-auth--resms btn--gray"
                                        sx={{ width: 1, mt: 2 }}
                                    >
                                        Запросить смс
                                        {recallActive && (
                                            <span className="resms-timout">
                                                через {recallTimer} сек.
                                            </span>
                                        )}
                                    </Button>
                                ) : null}
                            </div>
                        )}
                    </div>
                ) : (
                    authType === "" && <div className="code-auth-wrapper"></div>
                )}

                <div className="auth-modal--footer">
                    <small>
                        Используя сервис, вы принимаете правила{" "}
                        <a href="/privacy" target="_blank">
                            политики конфиденциальности
                        </a>{" "}
                        и{" "}
                        <a href="/offert" target="_blank">
                            договора публичной оферты
                        </a>
                        .
                    </small>
                </div>
            </div>
        </Dialog>
    );
}
