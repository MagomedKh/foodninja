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
   const [authPhoneCode, setAuthPhoneCode] = React.useState(false);
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
      // Не обязательный параметр с настройками отображения OneTap
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
               bridge
                  .send("VKWebAppGetPhoneNumber", {})
                  .then((res) => {
                     handlePhoneInput({
                        target: {
                           value: res.phone_number,
                           selectionStart: 11,
                        },
                     });
                     phoneLoginBtn.current.click();
                  })
                  .catch((er) => {
                     if (er.error_data.error_reason === "User denied") {
                        isVKPhoneReject.current = true;
                        // inputPhoneHtmlEl.focus();
                     }
                  });
            }
            // inputPhoneHtmlEl.focus();
            // authPhoneCode && document.querySelector(".code-1")?.focus();
         });
      } else setIsVKBtnRendered(false);
      console.log("openModalAuth", openModalAuth);
      if (!isVKBtnRendered) {
         setTimeout(() => {
            VKIDAuthWrapper.current?.append(oneTapButton.getFrame());
            if (VKIDAuthWrapper.current) {
               oneTapButton.authReadyPromise.then(() => {
                  VKIDAuthWrapper.current.classList.remove(
                     "vkid-auth-wrapper--hidden"
                  );
                  setIsVKBtnRendered(true);
               });
            }
         });
      }
   }, [openModalAuth]);

   useEffect(() => {
      if (authPhoneCode) {
         setTimeout(() => {
            // document.querySelector(".code-1")?.focus();
         });
         oneTapButton.getFrame().remove();
         setIsVKBtnRendered(false);
      } else {
         setTimeout(() => {
            VKIDAuthWrapper.current?.append(oneTapButton.getFrame());
            if (VKIDAuthWrapper.current) {
               oneTapButton.authReadyPromise.then(() => {
                  VKIDAuthWrapper.current.classList.remove(
                     "vkid-auth-wrapper--hidden"
                  );
                  setIsVKBtnRendered(true);
               });
            }
         });
      }
   }, [authPhoneCode]);

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

   const handleEnterCode = (e, field) => {
      const codeInputs = document.querySelectorAll(
         ".phone-auth-wrapper .verify-code"
      );
      const code = Array.from(codeInputs).reduce(
         (codeSum, element) => codeSum + element.value.toString(),
         ""
      );
      const nextSibling = document.querySelector(".code-" + (code.length + 1));
      if (nextSibling !== null && e.code !== "Backspace") {
         nextSibling.focus();
      }

      // const previousInput = document.querySelector(".code-" + code.length);
      // console.log(e.target.getAttribute("data-code-number"));
      // // console.log(code.length);
      // console.log(e.target.value);
      // if (
      //    e.code === "Backspace" &&
      //    code.length > 0 &&
      //    // e.target.getAttribute("data-code-number") !== "4" &&
      //    // code.length !== 3 &&
      //    previousInput !== null
      // ) {
      //    previousInput.focus();
      //    previousInput.value = "";
      // }

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

                  if (
                     _getPlatform() === "vk" &&
                     (!resp.data.user.name ||
                        !resp.data.user.vk ||
                        !resp.data.user.dayBirthday ||
                        !resp.data.user.monthBirthday)
                  ) {
                     axios
                        .post(
                           "https://" + _getDomain() + "/?rest-api=saveLogin",
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
                              }, 1000);
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
                     disabled={authPhoneCode}
                     onKeyDown={handlePhoneKeyDown}
                     onInput={handlePhoneInput}
                     onPaste={handlePhonePaste}
                     label="Номер телефона"
                     className="phone-input phone-mask"
                     value={authPhone ? authPhone : ""}
                     type={_isMobile() ? "text" : "text"}
                     id="user-phone"
                     ref={inputPhone}
                     // autoFocus
                  />
                  {!authPhoneCode ? (
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
                        <div
                           id="vkid-wrapper"
                           ref={VKIDAuthWrapper}
                           className="vkid-auth-wrapper vkid-auth-wrapper--hidden"
                        >
                           <p className="auth-modal--secondary-text">или</p>
                           {!isVKBtnRendered && (
                              <div>
                                 <CircularProgress
                                    className="vkid-btn-loader"
                                    color="vk"
                                 />
                              </div>
                           )}
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
                              ref={inputCode[1]}
                              onKeyUp={(e) => handleEnterCode(e, inputCode[1])}
                              data-code-number="1"
                              autoComplete="off"
                              name="code-1"
                              maxLength="1"
                              autoFocus
                           />
                           <input
                              type={_isMobile() ? "number" : "text"}
                              className="verify-code code-2"
                              ref={inputCode[2]}
                              onKeyUp={(e) => handleEnterCode(e, inputCode[2])}
                              data-code-number="2"
                              autoComplete="off"
                              name="code-2"
                              maxLength="1"
                           />
                           <input
                              type={_isMobile() ? "number" : "text"}
                              className="verify-code code-3"
                              ref={inputCode[3]}
                              onKeyUp={(e) => handleEnterCode(e, inputCode[3])}
                              data-code-number="3"
                              autoComplete="off"
                              name="code-3"
                              maxLength="1"
                           />
                           <input
                              type={_isMobile() ? "number" : "text"}
                              className="verify-code code-4"
                              ref={inputCode[4]}
                              onKeyUp={(e) => handleEnterCode(e, inputCode[4])}
                              data-code-number="4"
                              autoComplete="off"
                              name="code-4"
                              maxLength="1"
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
