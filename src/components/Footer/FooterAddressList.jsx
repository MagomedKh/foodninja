import { useSelector } from "react-redux";
import { Divider } from "@mui/material";
import { getDay } from "date-fns";

const FooterAddressList = () => {
    const { config } = useSelector(({ config }) => {
        return {
            config: config.data,
        };
    });

    const phones = config.CONFIG_home_phones
        ? config.CONFIG_home_phones.split(";")
        : [];

    // Получаем сегодняшний день недели
    const currentDayOfWeek =
        getDay(new Date()) === 0 ? 6 : getDay(new Date()) - 1;

    return (
        <>
            <div className="footer--town">
                {config && config.CONFIG_town ? (
                    <span>{config.CONFIG_town}</span>
                ) : null}
            </div>
            <div className="footer--adress-list">
                <div className="footer--adress-list-title">Точки продаж:</div>
                <div className="footer--adress">
                    <div>{config.CONFIG_address}</div>
                    <div>
                        {phones &&
                            phones.map(
                                (phone, index) =>
                                    phone.replace(/\D+/g, "") && (
                                        <div key={index}>
                                            <a
                                                href={`tel:${config.CONFIG_format_phone.replace(
                                                    /[^0-9]/g,
                                                    ""
                                                )}`}
                                            >
                                                {phone}
                                            </a>
                                        </div>
                                    )
                            )}
                    </div>
                    {config.CONFIG_format_start_work &&
                    config.CONFIG_format_end_work ? (
                        <div>
                            Сегодня с {config.CONFIG_format_start_work} до{" "}
                            {config.CONFIG_format_end_work}
                        </div>
                    ) : (
                        <div>Сегодня закрыто</div>
                    )}
                    {config.CONFIG_filials?.length ? (
                        <Divider
                            sx={{
                                my: "6px",
                                borderColor: "#3c3b3b",
                                width: "200px",
                            }}
                        />
                    ) : null}
                </div>
                {config.CONFIG_filials?.map((el, index, arr) => (
                    <div className="footer--adress" key={index}>
                        <div>{el.address}</div>
                        <div>
                            {el.phones?.map((phone, key) => (
                                <div key={index}>
                                    <a
                                        href={`tel:${config.CONFIG_format_phone.replace(
                                            /[^0-9]/g,
                                            ""
                                        )}`}
                                    >
                                        {phone}
                                    </a>
                                </div>
                            ))}
                        </div>
                        {
                            // Если у филиала свой график работы
                            el.workingTime ? (
                                el.workingTime[currentDayOfWeek][0] &&
                                el.workingTime[currentDayOfWeek][1] ? (
                                    <div>
                                        Сегодня с{" "}
                                        {el.workingTime[currentDayOfWeek][0]} до{" "}
                                        {el.workingTime[currentDayOfWeek][1]}
                                    </div>
                                ) : (
                                    <div>Сегодня закрыто</div>
                                )
                            ) : // Если график работы филиала совпадает с основным
                            config.CONFIG_format_start_work &&
                              config.CONFIG_format_end_work ? (
                                <div>
                                    Сегодня с {config.CONFIG_format_start_work}{" "}
                                    до {config.CONFIG_format_end_work}
                                </div>
                            ) : (
                                <div>Сегодня закрыто</div>
                            )
                        }
                        {index === arr.length - 1 ? null : (
                            <Divider
                                sx={{
                                    my: "6px",
                                    borderColor: "#3c3b3b",
                                    width: "200px",
                                }}
                            />
                        )}
                    </div>
                ))}
            </div>
        </>
    );
};

export default FooterAddressList;
