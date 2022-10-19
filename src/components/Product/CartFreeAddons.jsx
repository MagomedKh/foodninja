import React from 'react'
import {useSelector} from 'react-redux';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import '../../css/cart.css';


export default function CartFreeAddons() {

    const { delimiter, totalRolls, sauceImg, vasabiImg, imbirImg } = useSelector( ({config, cart}) => {
        return {
            delimiter: config.data.CONFIG_count_rolls_for_free_addons,
            sauceImg: config.data.CONFIG_free_sauce_image,
            vasabiImg: config.data.CONFIG_free_vasabi_image,
            imbirImg: config.data.CONFIG_free_imbir_image,
            totalRolls: cart.totalRolls
        }
    } );

    let countAddons = 0;
    if( delimiter ) {
        countAddons = parseInt( totalRolls / delimiter );
        ( totalRolls % delimiter ) && countAddons++;
    }


    return (
        <div>
            { countAddons ? (
                <div className="cart--free-addons">
                    <div className="cart--product">
                
                        <div className="cart--product-image">
                            <img src={sauceImg} alt="Соевый соус" />
                        </div>

                        <div className="cart--product-inner">
                            <div className="cart--product-name">
                                Соевый соус
                            </div>

                            <div className="product--quantity">
                                {countAddons} шт.
                            </div>

                            <div className="cart--product-result">
                                Бесплатно
                            </div>

                        </div> 
                    </div> 
                    <div className="cart--product">
                        <div className="cart--product-image">
                            <img src={vasabiImg} alt="Васаби" />
                        </div>

                        <div className="cart--product-inner">
                            <div className="cart--product-name">
                                Васаби
                            </div>

                            <div className="product--quantity">
                                {countAddons} шт.
                            </div>

                            <div className="cart--product-result">
                                Бесплатно
                            </div>

                        </div> 
                    </div> 
                    <div className="cart--product">
                        
                        <div className="cart--product-image">
                            <img src={imbirImg} alt="Имбирь" />
                        </div>

                        <div className="cart--product-inner">
                            <div className="cart--product-name">
                                Имбирь
                            </div>

                            <div className="product--quantity">
                                {countAddons} шт.
                            </div>

                            <div className="cart--product-result">
                                Бесплатно
                            </div>

                        </div> 
                    </div> 
                </div>
            ) : '' }
        </div>
    );
}
