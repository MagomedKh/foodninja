import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { _isMobile, _getDomain, _getPlatform } from "./helpers.js";
import { useNavigate, useLocation } from "react-router-dom";
import { setOpenModalAuth, login, saveLogin } from "../redux/actions/user";
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
import bridge from "@vkontakte/vk-bridge";
import { Connect, ConnectEvents } from "@vkontakte/superappkit";

const Transition = React.forwardRef(function Transition(props, ref) {
   return <Slide direction="up" ref={ref} {...props} />;
});

export default function AuthModal() {
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
   const inputPhone = React.useRef();
   const isVKPhoneReject = React.useRef(false);
   const phoneLoginBtn = React.useRef();
   const VKIDAuthWrapper = React.useRef();
   const [loading, setLoading] = React.useState();
   const [error, setError] = React.useState(null);
   const [authPhone, setAuthPhone] = React.useState();
   const [isAuthPhoneCode, setIsAuthPhoneCode] = React.useState(false);
   const [authPhoneCode, setAuthPhoneCode] = React.useState(["", "", "", ""]);
   const [verifyPhone, setVerifyPhone] = React.useState(false);
   const [recallInterval, setRecallInterval] = React.useState(false);
   const [recallTimer, setRecallTimer] = React.useState(30);
   const [recallActive, setRecallActive] = React.useState(false);
   const [token, setToken] = React.useState("");
   const [refreshReCaptcha, setRefreshReCaptcha] = useState(false);
   const [VKUserData, setVKUserData] = useState({});
   const [isVKBtnRendered, setIsVKBtnRendered] = useState(false);

   const oneTapButton = Connect.buttonOneTapAuth({
      callback: (event) => {
         const { type } = event;

         if (!type) {
            return;
         }
         console.log(event.payload);
         switch (type) {
            // case ConnectEvents.OneTapAuthEventsSDK.LOGIN_SUCCESS: // = 'VKSDKOneTapAuthLoginSuccess'
            //    return;
            //    setLoading(true);
            //    axios
            //       .get(
            //          "https://" +
            //             _getDomain() +
            //             "/?rest-api=loginByPhoneCode&phone=" +
            //             phone +
            //             "&code=" +
            //             code +
            //             "&platform=" +
            //             _getPlatform(),
            //          { mode: "no-cors" }
            //       )
            //       .then((resp) => {
            //          console.log(resp.data);
            //          if (resp.data.status === "success") {
            //             dispatch(login(resp.data.user));
            //             setError(null);
            //             if (pathname === "/cart" || miniCartOpen) {
            //                navigate("/checkout", { replace: true });
            //             }
            //             dispatch(closeMiniCart());
            //             dispatch(setOpenModalAuth(false));
            //             dispatch(closeMobileMenu());

            //             if (
            // !resp.data.user.name ||
            //    !resp.data.user.vk ||
            //    !resp.data.user.dayBirthday ||
            //    !resp.data.user.monthBirthday)
            // {
            //                axios
            //                   .post(
            //                      "https://" +
            //                         _getDomain() +
            //                         "/?rest-api=saveLogin",
            //                      {
            //                         ...resp.data.user,

            //                         name:
            //                            resp.data.user.name || VKUserData.name,
            //                         vk: resp.data.user.vk || VKUserData.vk,
            //                         dayBirthday:
            //                            resp.data.user.dayBirthday ||
            //                            VKUserData.dayBirthday,
            //                         monthBirthday:
            //                            resp.data.user.monthBirthday ||
            //                            VKUserData.monthBirthday,
            //                      }
            //                   )
            //                   .then((resp) => {
            //                      console.log(resp);
            //                      dispatch(saveLogin(resp.data.user));
            //                   });

            //                bridge
            //                   .send("VKWebAppStorageGet", {
            //                      keys: ["notificationsPermission"],
            //                   })
            //                   .then((data) => {
            //                      data.keys[0].key ===
            //                         "notificationsPermission" ||
            //                         setTimeout(() => {
            //                            bridge
            //                               .send("VKWebAppAllowNotifications")
            //                               .then((data) => {
            //                                  data.result &&
            //                                     bridge.send(
            //                                        "VKWebAppStorageSet",
            //                                        {
            //                                           key: "notificationsPermission",
            //                                        }
            //                                     );
            //                               });
            //                         }, 1000);
            //                   });
            //             }
            //          } else
            //             setError({
            //                status: resp.data.status,
            //                message: resp.data.text,
            //             });
            //          setLoading(false);
            //       });
            //    return;
            // Для этих событий нужно открыть полноценный VK ID чтобы
            // пользователь дорегистрировался или подтвердил телефон
            case ConnectEvents.OneTapAuthEventsSDK.FULL_AUTH_NEEDED: //  = 'VKSDKOneTapAuthFullAuthNeeded'
            case ConnectEvents.OneTapAuthEventsSDK.PHONE_VALIDATION_NEEDED: // = 'VKSDKOneTapAuthPhoneValidationNeeded'
            case ConnectEvents.ButtonOneTapAuthEventsSDK.SHOW_LOGIN: // = 'VKSDKButtonOneTapAuthShowLogin'
            // url - строка с url, на который будет произведён редирект после авторизации.
            // state - состояние вашего приложение или любая произвольная строка, которая будет добавлена к url после авторизации.
            // return Connect.redirectAuth({
            //    url: "https://...",
            //    state: "dj29fnsadjsd82...",
            // });
            // Пользователь перешел по кнопке "Войти другим способом"
            case ConnectEvents.ButtonOneTapAuthEventsSDK.SHOW_LOGIN_OPTIONS: // = 'VKSDKButtonOneTapAuthShowLoginOptions'
               // Параметр screen: phone позволяет сразу открыть окно ввода телефона в VK ID
               // Параметр url: ссылка для перехода после авторизации. Должен иметь https схему. Обязательный параметр.
               return Connect.redirectAuth({
                  screen: "phone",
                  url: "https://...",
               });
         }

         return;
      },

      options: {
         showAlternativeLogin: false,
         showAgreements: true,
         displayMode: "default",
         langId: 0,
         buttonSkin: "primary",
         buttonStyles: {
            borderRadius: 20,
            height: 55,
         },
      },
   });

   useEffect(() => {
      if (openModalAuth) {
         setTimeout(() => {
            const inputPhoneHtmlEl = inputPhone.current.children[1].children[0];
            if (!inputPhoneHtmlEl.value.length && !isVKPhoneReject.current) {
               bridge.send("VKWebAppGetPhoneNumber").then((res) => {});
            }
         });
      } else setIsVKBtnRendered(false);

      if (!isVKBtnRendered && openModalAuth) {
         setTimeout(() => {
            if (VKIDAuthWrapper.current) {
               VKIDAuthWrapper.current.innerHTML = "";
               VKIDAuthWrapper.current.append(oneTapButton.getFrame());
               oneTapButton.authReadyPromise.then(() => {
                  setIsVKBtnRendered(true);
               });
            }
         });
      }
   }, [openModalAuth]);

   useEffect(() => {
      if (isAuthPhoneCode) {
         oneTapButton.getFrame().remove();
         setIsVKBtnRendered(false);
      } else {
         if (!isVKBtnRendered) {
            setTimeout(() => {
               if (VKIDAuthWrapper.current) {
                  VKIDAuthWrapper.current.innerHTML = "";
                  VKIDAuthWrapper.current.append(oneTapButton.getFrame());
                  oneTapButton.authReadyPromise.then(() => {
                     setIsVKBtnRendered(true);
                  });
               }
            });
         }
      }
   }, [isAuthPhoneCode]);

   useEffect(() => {
      bridge.send("VKWebAppGetUserInfo").then((vkUserInfo) => {
         const existingVkData = {};

         existingVkData.name = vkUserInfo.first_name || "";

         existingVkData.vk = vkUserInfo.id
            ? "https://vk.com/id" + vkUserInfo.id
            : "";

         existingVkData.dayBirthday = vkUserInfo.bdate?.split(".")[0] || "";
         existingVkData.monthBirthday = vkUserInfo.bdate?.split(".")[1] || "";

         console.log("setVKUserData - ", existingVkData);
         setVKUserData(existingVkData);
      });
   }, []);

   useEffect(() => {
      openModalAuth
         ? setTimeout(() => {
              window.addEventListener("click", closeModalOnOutClick);
           })
         : window.removeEventListener("click", closeModalOnOutClick);
   }, [openModalAuth]);

   const closeModalOnOutClick = useCallback((e) => {
      console.log(e);
      if (
         !e.target.closest(".auth-modal") &&
         !e.target.className.includes("phone-auth--change-number")
      ) {
         handleClose();
      }
   }, []);

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
                  _getPlatform() +
                  "&test=1",
               { mode: "no-cors" }
            )
            .then((resp) => {
               if (resp.data.status === "success") {
                  setIsAuthPhoneCode(true);
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

      setIsAuthPhoneCode(!isAuthPhoneCode);
   };

   const handleCodeChange = (e, inputIndex) => {
      const { value } = e.target;

      if (
         /^[0-9]*$/.test(value) &&
         (authPhoneCode[inputIndex] + value).length === 1 &&
         !loading
      ) {
         const newData = [...authPhoneCode];
         newData[inputIndex] = value;
         setAuthPhoneCode(newData);

         const nextSibling = inputCode.current.find(
            (input) => input.value === ""
         );

         if (nextSibling && value !== "") {
            nextSibling.focus();
         }

         if (newData.every((value) => value !== "")) {
            const phone = getNumbersValue(authPhone);
            setLoading(true);
            axios
               .get(
                  "https://" +
                     _getDomain() +
                     "/?rest-api=loginByPhoneCode&phone=" +
                     phone +
                     "&code=" +
                     newData.join("") +
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

                     if (
                        _getPlatform() === "vk" &&
                        (!resp.data.user.name ||
                           !resp.data.user.vk ||
                           !resp.data.user.dayBirthday ||
                           !resp.data.user.monthBirthday)
                     ) {
                        axios
                           .post(
                              "https://" +
                                 _getDomain() +
                                 "/?rest-api=saveLogin",
                              {
                                 ...resp.data.user,

                                 name: resp.data.user.name || VKUserData.name,
                                 vk: resp.data.user.vk || VKUserData.vk,
                                 dayBirthday:
                                    resp.data.user.dayBirthday ||
                                    VKUserData.dayBirthday,
                                 monthBirthday:
                                    resp.data.user.monthBirthday ||
                                    VKUserData.monthBirthday,
                              }
                           )
                           .then((resp) => {
                              console.log(resp);
                              dispatch(saveLogin(resp.data.user));
                           });

                        bridge
                           .send("VKWebAppStorageGet", {
                              keys: ["notificationsPermission"],
                           })
                           .then((data) => {
                              data.keys[0].key === "notificationsPermission" ||
                                 setTimeout(() => {
                                    bridge
                                       .send("VKWebAppAllowNotifications")
                                       .then((data) => {
                                          data.result &&
                                             bridge.send("VKWebAppStorageSet", {
                                                key: "notificationsPermission",
                                             });
                                       });
                                 }, 2000);
                           });
                     }
                  } else
                     setError({
                        status: resp.data.status,
                        message: resp.data.text,
                     });
                  setLoading(false);
               });
         }
      }
   };

   const handleEnterCode = (e, inputIndex) => {
      if (
         e.code === "Backspace" &&
         inputIndex !== 0 &&
         inputCode.current[inputIndex].value === ""
      ) {
         const previousInput = inputCode.current[inputIndex - 1];
         previousInput.focus();

         const newData = [...authPhoneCode];
         newData[inputIndex - 1] = "";
         setAuthPhoneCode(newData);
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

      if (e.key === "Enter") {
         phoneLoginBtn.current.click();
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
                  <CircularProgress variant="determinate" />
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
                     disabled={isAuthPhoneCode}
                     onKeyDown={handlePhoneKeyDown}
                     onInput={handlePhoneInput}
                     onPaste={handlePhonePaste}
                     label="Номер телефона"
                     className="phone-input phone-mask"
                     value={authPhone ? authPhone : ""}
                     type={_isMobile() ? "text" : "text"}
                     id="user-phone"
                     ref={inputPhone}
                  />
                  {!isAuthPhoneCode ? (
                     <div id="recaptcha-container">
                        <Button
                           variant="button"
                           onClick={handleAuth}
                           className="btn--action auth-btn"
                           disabled={
                              !verifyPhone || error?.status === "error_captcha"
                           }
                           ref={phoneLoginBtn}
                        >
                           Войти
                        </Button>
                        <div className="vkid-auth-wrapper">
                           <p className="auth-modal--secondary-text">или</p>
                           {!isVKBtnRendered && (
                              <CircularProgress
                                 className="vkid-btn-loader"
                                 color="vk"
                              />
                           )}
                           <div ref={VKIDAuthWrapper}></div>
                        </div>
                     </div>
                  ) : (
                     <div>
                        <div className="auth-modal--info">
                           На ваш номер будет совершен звонок. Для входа введите
                           4 последние цифры этого номера.
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
                              ref={(ref) => (inputCode.current[0] = ref)}
                              onChange={(e) => handleCodeChange(e, 0)}
                              value={authPhoneCode[0]}
                              onKeyDown={(e) => handleEnterCode(e, 0)}
                              autoComplete="off"
                              name="code-1"
                              autoFocus
                           />
                           <input
                              type={_isMobile() ? "number" : "text"}
                              className="verify-code code-2"
                              ref={(ref) => (inputCode.current[1] = ref)}
                              onChange={(e) => handleCodeChange(e, 1)}
                              value={authPhoneCode[1]}
                              onKeyDown={(e) => handleEnterCode(e, 1)}
                              autoComplete="off"
                              name="code-2"
                           />
                           <input
                              type={_isMobile() ? "number" : "text"}
                              className="verify-code code-3"
                              ref={(ref) => (inputCode.current[2] = ref)}
                              onChange={(e) => handleCodeChange(e, 2)}
                              value={authPhoneCode[2]}
                              onKeyDown={(e) => handleEnterCode(e, 2)}
                              autoComplete="off"
                              name="code-3"
                           />
                           <input
                              type={_isMobile() ? "number" : "text"}
                              className="verify-code code-4"
                              ref={(ref) => (inputCode.current[3] = ref)}
                              onChange={(e) => handleCodeChange(e, 3)}
                              value={authPhoneCode[3]}
                              onKeyDown={(e) => handleEnterCode(e, 3)}
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

                        {config.CONFIG_auth_type === "robocallwithsms" ? (
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
