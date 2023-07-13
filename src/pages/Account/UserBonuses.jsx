import React, { useState, useEffect } from "react";
import axios from "axios";
import { _getDomain } from "../../components/helpers";
import { CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";

const UserBonuses = () => {
    const user = useSelector(({ user }) => user.user);
    const bonusProgramStatus = useSelector(
        (state) => state.config.data.bonusProgramm?.status === "active"
    );

    const [userBonuses, setUserBonuses] = useState(0);
    const [loading, setLoading] = useState(bonusProgramStatus ? false : true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (bonusProgramStatus) {
            if (user.bonuses) {
                setUserBonuses(parseInt(user.bonuses));
            }
        } else {
            if (user.token && user.phone) {
                setLoading(true);
                axios
                    .post(
                        "https://" +
                            _getDomain() +
                            "/?rest-api=getFrontpadBonuses",
                        {
                            token: user.token,
                            phone: user.phone,
                        }
                    )
                    .then((resp) => {
                        if (resp.data.status === "success") {
                            if (resp.data.user?.bonuses > 0) {
                                setUserBonuses(resp.data.user?.bonuses);
                            }
                        } else {
                            setError(true);
                        }
                        setLoading(false);
                    });
            }
        }
    }, [bonusProgramStatus]);

    return (
        <div className="user-bonuses-info">
            {!error ? (
                <>
                    На вашем счету{" "}
                    {loading ? (
                        <CircularProgress size={14} />
                    ) : (
                        <span className="main-color">{userBonuses}</span>
                    )}
                    <span> бонусов.</span>
                    <br />1 бонус ={" "}
                    <span className="main-color">1 &#8381;</span>
                </>
            ) : (
                <span>
                    Не удалось получить баланс бонусов. Попробуйте позже.
                </span>
            )}
        </div>
    );
};

export default UserBonuses;
