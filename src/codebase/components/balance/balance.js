import React, { useContext, useEffect, useState } from "react";
import './balance.css';
import 'react-tooltip/dist/react-tooltip.css';
import { Context } from "../../context/context";
import axios from 'axios';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import { Tooltip } from 'react-tooltip';

const Balance = () => {
    const { APIPath, refreshBalance, freecurrencyapi, freecurrencyapi_key } = useContext(Context);
    const [apiLoading, setApiLoading] = useState(false);
    const [usd, setUsd] = useState('');
    const [inr, setInr] = useState(null);
    const [exchangeRate, setExchangeRate] = useState(null);
    const [errorCurrency, setErrorCurrency] = useState(false);

    useEffect(() => {
         // USE BELOW TO REFRESH FROM ANTOHER COMPONENT //setRefreshBalance(!refreshBalance);
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
            setExchangeRate(`Exchange rate: ${exchangeRate.toFixed(2)}`);
            setInr((usdValue * exchangeRate).toFixed(2));
            setErrorCurrency(false);
        } catch (error) {
            console.error('Error fetching exchange rate:', error);
            setErrorCurrency(true);
        }
    };

    return (
        <div className="balanceHolder">
            <Tooltip id="my-tooltip-api-exchange" className="tooltip-example" />
            {apiLoading ? (
                <div className="spinner my-1 mx-4"></div>
            ) : (
                <span
                    data-tooltip-id="my-tooltip-api-exchange"
                    data-tooltip-html={exchangeRate}>
                    <span>BALANCE:</span> $ {usd} - (₹ {!errorCurrency ? inr : <ReportProblemOutlinedIcon className="error mb-2" fontSize="small" />})
                </span>
            )}
        </div>
    );
};

export default Balance;