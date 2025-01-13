import React, { useContext, useEffect, useState } from "react";
import './balance.css';
import { Context } from "../../context/context";
import axios from 'axios';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';

const Balance = () => {
    const { APIPath, refreshBalance, freecurrencyapi, freecurrencyapi_key, todoOpen } = useContext(Context);
    const [apiLoading, setApiLoading] = useState(false);
    const [usd, setUsd] = useState('');
    const [inr, setInr] = useState(null);
    const [exchangeRate, setExchangeRate] = useState(null);
    const [errorCurrency, setErrorCurrency] = useState(false);

    const fetchBalance = async () => {
        setApiLoading(true);
        try {
            const response = await fetch(`${APIPath}/getbalance`);
            const result = await response.json();
            if (result.error) {
                setUsd(0);
            } else {
                setUsd(result.BALANCE);
            }
            convertCurrency(result.BALANCE);
        } catch (error) {
            setUsd(0);
            convertCurrency(0);
        } finally {
            setApiLoading(false);
        }
    };
    useEffect(() => {
        // USE BELOW TO REFRESH FROM ANTOHER COMPONENT //setRefreshBalance(!refreshBalance);
        fetchBalance();
    }, [APIPath, refreshBalance]);

    const convertCurrency = async (usdValue) => {
        try {
            const response = await axios.get(freecurrencyapi, {
                params: {
                    apikey: freecurrencyapi_key,
                    base_currency: 'USD',
                    currencies: 'INR'
                }
            });
            const exchangeRate = response.data.data.INR;
            setExchangeRate(`Exchange rate:: ${exchangeRate.toFixed(2)}`);
            setInr((usdValue * exchangeRate).toFixed(2));
            setErrorCurrency(false);
        } catch (error) {
            console.error('Error fetching exchange rate:', error);
            setErrorCurrency(true);
        }
    };

    return (
        <div className={`balanceHolder ${todoOpen ? '' : 'balanceHolderFull'}`}>
            {apiLoading ? (
                <div className="spinner my-1 mx-4"></div>
            ) : (
                <span
                    onClick={fetchBalance}
                    title={`Click to reload balance & calculate INR as per latest exchange rate - ${exchangeRate}`}>
                    <span>BALANCE:</span> $ {usd} = (₹ {!errorCurrency ? inr : <ReportProblemOutlinedIcon className="error mb-2" fontSize="small" />})
                </span>
            )}
        </div>
    );
};

export default Balance;