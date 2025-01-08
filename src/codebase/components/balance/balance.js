import React, { useContext, useEffect, useState } from "react";
import './balance.css';
import 'react-tooltip/dist/react-tooltip.css';
import { Context } from "../../context/context";

const Balance = () => {

    const { refreshBalance } = useContext(Context);
    const [apiLoading, setApiLoading] = useState(false);
    const [balance, setBalance] = useState(0.00);

    //page title
    useEffect(() => {
        // USE BELOW TO REFRESH FROM ANTOHER COMPONENT
        //setRefreshBalance(!refreshBalance);
        console.log("LOADING BAL")
        setApiLoading(true);
        setTimeout(() => {
            setApiLoading(false);
            setBalance(1232.21);
            console.log("LOADED BAL")
        }, 5000);
    }, [refreshBalance]);


    return (
        <div className="balanceHolder">
            {apiLoading ? (
                <span>loading...</span>
            ) : (
                <span>
                    $ {balance}
                </span>
            )}

        </div>
    )
}
export default Balance;