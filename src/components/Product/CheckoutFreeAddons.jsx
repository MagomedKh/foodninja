import React from 'react'
import {useSelector} from 'react-redux';
import '../../css/checkout.css';


export default function CheckoutFreeAddons() {

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
                <div className="free-addons">
                    <div className="checkout--product" >
                
                        <div className="checkout--product-name">
                            Соевый соус x {countAddons} шт.
                        </div>

                        <div className="checkout--product-result">
                            Бесплатно
                        </div>
                    </div>
                    <div className="checkout--product" >
                        <div className="checkout--product-name">
                            Васаби x {countAddons} шт.
                        </div>

                        <div className="checkout--product-result">
                            Бесплатно
                        </div>
                    </div>                 
                    <div className="checkout--product" >
                        <div className="checkout--product-name">
                            Имбирь x {countAddons} шт.
                        </div>

                        <div className="checkout--product-result">
                            Бесплатно
                        </div>
                    </div>
                </div>
            ) : '' }
        </div>
    );
}
