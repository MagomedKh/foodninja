import React, { useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { saveLogin, logout, setOpenModalAuth } from "../../redux/actions/user";
import { Alert, Container } from "@mui/material";
import { Link } from "react-router-dom";
import {
    Button,
    Box,
    Dialog,
    IconButton,
    MenuItem,
    Slide,
    TextField,
    FormControl,
    FormHelperText,
    Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Header, Footer } from "../../components";
import LoadingButton from "@mui/lab/LoadingButton";
import {} from "@mui/material/TextField";
import axios from "axios";
import { _getDomain, _isMobile } from "../../components/helpers.js";
import "../../css/account.css";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const formatingStrPhone = (inputNumbersValue) => {
    var formattedPhone = "";
    if (["7", "8", "9"].indexOf(inputNumbersValue[0]) > -1) {
        if (inputNumbersValue[0] === "9")
            inputNumbersValue = "7" + inputNumbersValue;
        var firstSymbols = inputNumbersValue[0] === "8" ? "8" : "+7";
        formattedPhone = firstSymbols + " ";
        if (inputNumbersValue.length > 1) {
            formattedPhone += "(" + inputNumbersValue.substring(1, 4);
        }
        if (inputNumbersValue.length >= 5) {
            formattedPhone += ") " + inputNumbersValue.substring(4, 7);
        }
        if (inputNumbersValue.length >= 8) {
            formattedPhone += "-" + inputNumbersValue.substring(7, 9);
        }
        if (inputNumbersValue.length >= 10) {
            formattedPhone += "-" + inputNumbersValue.substring(9, 11);
        }
    } else {
        formattedPhone = "+" + inputNumbersValue.substring(0, 16);
    }
    return formattedPhone;
};

const getNumbersValue = function (input) {
    return input.replace(/\D/g, "");
};

export default function Account() {
    const dispatch = useDispatch();
    const { user, config } = useSelector(({ user, config }) => {
        return {
            user: user.user,
            config: config.data,
        };
    }, shallowEqual);

    const [value, setValue] = React.useState("settings");
    const [loading, setLoading] = React.useState(false);
    const [loadingDelete, setLoadingDelete] = React.useState(false);
    const [validate, setValidate] = React.useState(true);
    const [userName, setUserName] = React.useState("");
    const [userEmail, setUserEmail] = React.useState(
        user.email ? user.email : ""
    );
    const [dayBirthday, setDayBirthday] = React.useState(null);
    const [monthBirthday, setMonthBirthday] = React.useState(null);
    const [userVK, setUserVK] = React.useState(user.vk ? user.vk : "");
    const [openModal, setOpenModal] = React.useState(false);
    const [userPhone, setUserPhone] = React.useState("");
    const handleChangeTab = (event, value) => {
        setValue(value);
    };

    useEffect(() => {
        if (user.dayBirthday) {
            setDayBirthday(user.dayBirthday);
        }
        if (user.monthBirthday) {
            setMonthBirthday(user.monthBirthday - 1);
        }
    }, [user.dayBirthday, user.monthBirthday]);

    useEffect(() => {
        if (user.phone) {
            setUserPhone(formatingStrPhone(user.phone));
        }
    }, [user.phone]);

    useEffect(() => {
        if (user.name) {
            setUserName(user.name);
        }
    }, [user.name]);

    const handleChangeName = (e) => {
        setUserName(e.target.value);
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

        formattedInputValue = formatingStrPhone(inputNumbersValue);
        input.value = formattedInputValue;
        setUserPhone(formattedInputValue);
    };
    const handlePhoneKeyDown = function (e) {
        var inputValue = e.target.value.replace(/\D/g, "");
        if (e.keyCode === 8 && inputValue.length === 1) {
            e.target.value = "";
        }
    };
    const handleEmailInput = (e) => {
        setUserEmail(e.target.value);
    };

    const handleBirthDayChange = (e) => {
        setDayBirthday(e.target.value);
        if (!monthBirthday) {
            setMonthBirthday(0);
        }
    };

    const handleBirthMonthChange = (e) => {
        setMonthBirthday(e.target.value);
        if (!dayBirthday) {
            setDayBirthday(1);
        }
    };

    const handleVKInput = (e) => {
        setUserVK(e.target.value);
    };

    const handleSaveUser = () => {
        setValidate(true);
        (!userName || getNumbersValue(userPhone).length != 11) &&
            setValidate(false);

        if (validate) {
            setLoading(true);

            axios
                .post("https://" + _getDomain() + "/?rest-api=saveLogin", {
                    name: userName,
                    phone: getNumbersValue(userPhone),
                    email: userEmail,
                    vk: userVK,
                    token: user.token,
                    dayBirthday,
                    monthBirthday: monthBirthday + 1,
                })
                .then((resp) => {
                    console.log(resp);
                    setLoading(false);
                    setLoadingDelete(false);
                    dispatch(saveLogin(resp.data.user));
                });
        }
    };

    const handleDeleteUser = () => {
        setLoadingDelete(true);

        axios
            .post("https://" + _getDomain() + "/?rest-api=deleteLogin", {
                name: userName,
                phone: getNumbersValue(userPhone),
                token: user.token,
            })
            .then((resp) => {
                setLoadingDelete(false);
                dispatch(logout());
            });
    };

    const toogleModalDeleting = () => {
        setOpenModal(!openModal);
    };

    const handleClickLogout = () => {
        dispatch(logout());
    };

    const handleOpenAuthModal = () => {
        dispatch(setOpenModalAuth(true));
    };

    const userNameProps = {
        error: !userName && !validate ? true : false,
        helperText:
            !userName && !validate
                ? "Поле обязательно для заполнения"
                : "Как к вам обращаться?",
    };
    const userPhoneProps = {
        error:
            getNumbersValue(userPhone).length !== 11 && !validate
                ? true
                : false,
        helperText:
            getNumbersValue(userPhone).length !== 11 && !validate
                ? "Номер указан неверно"
                : "С вами свяжется оператор для уточнения заказа",
    };

    let dialogProps = { open: openModal, maxWidth: "md" };
    if (_isMobile()) {
        dialogProps.TransitionComponent = Transition;
        dialogProps.fullScreen = true;
        dialogProps.scroll = "body";
    }

    function getAllDaysInMonth(year, month = 0) {
        const date = new Date(year, month, 1);

        const dates = [];

        while (date.getMonth() == month) {
            dates.push(date.getDate());
            date.setDate(date.getDate() + 1);
        }

        if (
            !user.dayBirthday &&
            monthBirthday &&
            !dates.includes(dayBirthday)
        ) {
            setDayBirthday(1);
        }

        return dates;
    }

    return (
        <>
            <Header />
            <Container>
                <h1>Личный кабинет</h1>

                {user.token ? (
                    <div>
                        <div className="account-menu">
                            <Link
                                variant="button"
                                to="/account"
                                className="btn btn--action"
                            >
                                Настройки
                            </Link>
                            <Link
                                variant="button"
                                to="/account/orders"
                                className="btn btn--outline-dark"
                            >
                                Заказы
                            </Link>
                        </div>

                        <Grid container spacing={4}>
                            <Grid item sm={12} md={5}>
                                <TextField
                                    id="userName"
                                    label="Ваше имя"
                                    onInput={handleChangeName}
                                    value={userName}
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
                                    value={userPhone}
                                    sx={{ width: 1, mb: 4 }}
                                    {...userPhoneProps}
                                />

                                {/* <TextField 
								id="userPhone" 
								label="E-mail" 
								onInput={handleEmailInput} 
								value={ userEmail }
								sx={{ width: 1, mb: 4 }} />                     */}

                                <FormControl sx={{ width: 1, mb: 4 }}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexWrap: "nowrap",
                                        }}
                                    >
                                        <TextField
                                            id="userBirthDay"
                                            value={
                                                dayBirthday ? dayBirthday : ""
                                            }
                                            select
                                            disabled={!!user.dayBirthday}
                                            label="День"
                                            sx={{
                                                width: 0.3,
                                                minWidth: "80px",
                                                border: "none",
                                                mr: "10px",
                                            }}
                                            SelectProps={{
                                                MenuProps: {
                                                    PaperProps: {
                                                        sx: {
                                                            maxHeight: "200px",
                                                        },
                                                    },
                                                },
                                            }}
                                            onChange={handleBirthDayChange}
                                        >
                                            {getAllDaysInMonth(
                                                2022,
                                                monthBirthday
                                                    ? monthBirthday
                                                    : 0
                                            ).map((el) => (
                                                <MenuItem key={el} value={el}>
                                                    {el}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                        <TextField
                                            id="userBirthMonth"
                                            value={
                                                monthBirthday ||
                                                monthBirthday == 0
                                                    ? monthBirthday
                                                    : ""
                                            }
                                            select
                                            disabled={!!user.monthBirthday}
                                            label="Месяц"
                                            sx={{ width: 0.7 }}
                                            onChange={handleBirthMonthChange}
                                            SelectProps={{
                                                MenuProps: {
                                                    PaperProps: {
                                                        sx: {
                                                            maxHeight: "200px",
                                                        },
                                                    },
                                                },
                                            }}
                                        >
                                            <MenuItem value={0}>
                                                Январь
                                            </MenuItem>
                                            <MenuItem value={1}>
                                                Февраль
                                            </MenuItem>
                                            <MenuItem value={2}>Март</MenuItem>
                                            <MenuItem value={3}>
                                                Апрель
                                            </MenuItem>
                                            <MenuItem value={4}>Май</MenuItem>
                                            <MenuItem value={5}>Июнь</MenuItem>
                                            <MenuItem value={6}>Июль</MenuItem>
                                            <MenuItem value={7}>
                                                Август
                                            </MenuItem>
                                            <MenuItem value={8}>
                                                Сентябрь
                                            </MenuItem>
                                            <MenuItem value={9}>
                                                Октябрь
                                            </MenuItem>
                                            <MenuItem value={10}>
                                                Ноябрь
                                            </MenuItem>
                                            <MenuItem value={11}>
                                                Декабрь
                                            </MenuItem>
                                        </TextField>
                                    </Box>
                                    <FormHelperText
                                        id="userBirthday-helper-text"
                                        disabled={!!user.dayBirthday}
                                    >
                                        {!!user.dayBirthday ? (
                                            <div>Ваш день рождения</div>
                                        ) : (
                                            <>
                                                <div>
                                                    Выберите ваш день рождения
                                                </div>
                                                <div>
                                                    Указать дату можно только
                                                    один раз
                                                </div>
                                            </>
                                        )}
                                    </FormHelperText>
                                </FormControl>

                                <TextField
                                    id="userPhone"
                                    label="Профиль ВКонтакте"
                                    onInput={handleVKInput}
                                    value={userVK}
                                    sx={{ width: 1, mb: 4 }}
                                />
                            </Grid>

                            {config.CONFIG_bonuses_program_status && (
                                <Grid item sm={12} md={5}>
                                    <div className="user-bonuses-info">
                                        <h2>Бонусы</h2>
                                        <p>
                                            На вашем счету{" "}
                                            <span className="main-color">
                                                {user.bonuses}
                                            </span>{" "}
                                            бонусов.
                                            <br />1 бонус ={" "}
                                            <span className="main-color">
                                                1 &#8381;
                                            </span>
                                        </p>
                                        <p>
                                            Вы можете оплатить ими до{" "}
                                            <span className="main-color">
                                                {
                                                    config.CONFIG_bonus_program_order_limit
                                                }
                                                %
                                            </span>{" "}
                                            от общей суммы заказа.
                                        </p>
                                    </div>
                                </Grid>
                            )}
                        </Grid>

                        <LoadingButton
                            loading={loading}
                            sx={{ mr: 1.5 }}
                            className="btn--action"
                            variant="button"
                            onClick={handleSaveUser}
                        >
                            Сохранить
                        </LoadingButton>
                        <Button
                            className="btn--outline-dark"
                            variant="button"
                            onClick={handleClickLogout}
                            sx={{ mr: 1.5 }}
                        >
                            Выйти
                        </Button>
                        <hr className="account-separator" />
                        <div className="deleting-account">
                            <button
                                className="btn--delete-account"
                                onClick={toogleModalDeleting}
                            >
                                Удалить аккаунт
                            </button>
                        </div>

                        <Dialog maxWidth="md" {...dialogProps}>
                            <div className="modal-alert--wrapper">
                                <IconButton
                                    edge="start"
                                    color="inherit"
                                    onClick={toogleModalDeleting}
                                    aria-label="close"
                                    className="modal-close"
                                >
                                    <CloseIcon />
                                </IconButton>
                                <h2 className="modal-alert--title">
                                    Удаление аккаунта
                                </h2>
                                <div className="modal-alert--inner">
                                    Вы уверены что хотите удалить аккаунт?
                                    <Alert
                                        severity="error"
                                        sx={{ mt: 1.5, mb: 1.5 }}
                                    >
                                        Все данные будут удалены безвозвратно.
                                    </Alert>
                                    <LoadingButton
                                        loading={loadingDelete}
                                        sx={{ mr: 1.5 }}
                                        className="btn--outline-dark"
                                        variant="button"
                                        onClick={handleDeleteUser}
                                    >
                                        Удалить
                                    </LoadingButton>
                                    <Button
                                        variant="button"
                                        className="btn btn--action"
                                        onClick={toogleModalDeleting}
                                    >
                                        Отмена
                                    </Button>
                                </div>
                            </div>
                        </Dialog>
                    </div>
                ) : (
                    <div className="auth">
                        <p>Вы не авторизованы.</p>
                        <p>
                            <button
                                className="btn--auth"
                                onClick={handleOpenAuthModal}
                            >
                                Авторизуйтесь
                            </button>
                            , чтобы войти в личный кабинет.
                        </p>
                    </div>
                )}
            </Container>
            <Footer />
        </>
    );
}
