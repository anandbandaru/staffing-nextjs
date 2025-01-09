import React, { useContext, useEffect, useState } from "react";
import './balance.css';
import 'react-tooltip/dist/react-tooltip.css';
import { Context } from "../../context/context";
import axios from 'axios';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';

const Balance = () => {

    const { refreshBalance, freecurrencyapi, freecurrencyapi_key } = useContext(Context);
    const [apiLoading, setApiLoading] = useState(false);
    const [balance, setBalance] = useState(0.00);
    const [usd, setUsd] = useState('');
    const [inr, setInr] = useState(null);
    const [errorCurrency, setErrorCurrency] = useState(false);

    //page title
    useEffect(() => {
        // USE BELOW TO REFRESH FROM ANTOHER COMPONENT
        //setRefreshBalance(!refreshBalance);
        setApiLoading(true);
        setTimeout(() => {
            setApiLoading(false);
            let usdValue = 1;
            setUsd(usdValue);
            convertCurrency(usdValue);
            console.log("LOADED BALANCE")
        }, 5000);
    }, [refreshBalance]);

    const convertCurrency = async () => {
        try {
            setApiLoading(true);
            const response = await axios.get(freecurrencyapi, {
                params: {
                    apikey: freecurrencyapi_key,
                    base_currency: 'USD',
                    currencies: 'INR'
                }
            });
            const exchangeRate = response.data.data.INR;
            setInr((usd * exchangeRate).toFixed(2));
            setErrorCurrency(false);
            setApiLoading(false);
        } catch (error) {
            console.error('Error fetching exchange rate:', error);
            setErrorCurrency(true);
            setApiLoading(false);
        }
    };


    return (
        <div className="balanceHolder">
            {apiLoading ? (
                <div>
                    <div className="spinner my-1 mx-4">
                    </div>
                </div>
            ) : (
                <span>
                    <span>BALANCE:</span> $ {usd} - (₹ {!errorCurrency ? inr : <ReportProblemOutlinedIcon className="error mb-2" fontSize="small" />})
                </span>
            )}

        </div>
    )
}
export default Balance;