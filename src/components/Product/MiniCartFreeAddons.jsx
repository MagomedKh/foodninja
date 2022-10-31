import React from "react";
import { useSelector } from "react-redux";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";

export default function MiniCartFreeAddons() {
    const { delimiter, totalRolls, sauceImg, vasabiImg, imbirImg } =
        useSelector(({ config, cart }) => {
            return {
                delimiter: config.data.CONFIG_count_rolls_for_free_addons,
                sauceImg: config.data.CONFIG_free_sauce_image,
                vasabiImg: config.data.CONFIG_free_vasabi_image,
                imbirImg: config.data.CONFIG_free_imbir_image,
                totalRolls: cart.totalRolls,
            };
        });

    let countAddons = 0;
    if (delimiter) {
        countAddons = parseInt(totalRolls / delimiter);
        totalRolls % delimiter && countAddons++;
    }

    return (
        <div>
            {countAddons ? (
                <div>
                    <h4 className="minicart--free-addons-title">
                        Бесплатные добавки
                    </h4>
                    <div className="minicart--product free-addon">
                        <div className="minicart--product-info">
                            <div className="minicart--product-image">
                                <img src={sauceImg} alt="Соевый соус" />
                            </div>
                            <div className="minicart--product-inner">
                                <div className="minicart--product-name">
                                    Соевый соус x{" "}
                                    <span className="count-free-addons">
                                        {countAddons} шт.
                                    </span>
                                </div>
                                <span className="main-color">FREE</span>
                            </div>
                        </div>
                    </div>
                    <div className="minicart--product free-addon">
                        <div className="minicart--product-info">
                            <div className="minicart--product-image">
                                <img src={vasabiImg} alt="Васаби" />
                            </div>
                            <div className="minicart--product-inner">
                                <div className="minicart--product-name">
                                    Васаби x{" "}
                                    <span className="count-free-addons">
                                        {countAddons} шт.
                                    </span>
                                </div>
                                <span className="main-color">FREE</span>
                            </div>
                        </div>
                    </div>
                    <div className="minicart--product free-addon">
                        <div className="minicart--product-info">
                            <div className="minicart--product-image">
                                <img src={imbirImg} alt="Имбирь" />
                            </div>
                            <div className="minicart--product-inner">
                                <div className="minicart--product-name">
                                    Имбирь x{" "}
                                    <span className="count-free-addons">
                                        {countAddons} шт.
                                    </span>
                                </div>
                                <span className="main-color">FREE</span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                ""
            )}
        </div>
    );
}
