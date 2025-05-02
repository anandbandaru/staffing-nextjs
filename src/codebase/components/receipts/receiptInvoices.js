import React, { useState, useContext, useRef, useEffect } from 'react';
import { Context } from "../../context/context";
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import Stack from '@mui/material/Stack';
import CustomSnackbar from "../snackbar/snackbar";
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import FormSlider from '../slider/formSlider';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import { IconButton } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';

function ReceiptInvoices({ receiptId }) {
    const { APIPath, userName } = useContext(Context);
    const [apiLoading, setApiLoading] = useState(false);
    // Default width
    const [formWidth, setFormWidth] = useState(1000);
    const [invoicesData, setInvoicesData] = useState({ data: [] });
    const [invoiceId, setInvoiceId] = useState('');

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const showSnackbar = (severity, message) => {
        setSnackbarSeverity(severity);
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    const getInvoicesForReceipt = async () => {
        setApiLoading(true);
        let apiUrl = APIPath + "/getreceiptinvoices/" + receiptId
        fetch(apiUrl, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
            }
        })
            .then(response => response.json())
            .then(
                async (result) => {
                    if (result.error) {
                        setInvoicesData({ data: [] });
                    }
                    else {
                        setInvoicesData(result);
                        showSnackbar('success', "Invoices loaded successfully");
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setInvoicesData({ data: [] });
                    setApiLoading(false);
                }
            )
    }
    const [ranOnceC, setRanOnceC] = useState(1);
    const [ranOnce, setRanOnce] = useState(false);
    useEffect(() => {
        console.log("useEffect called with COUNTER:", ranOnceC);
        if (!ranOnce) {
            setRanOnce(true);
            setRanOnceC(ranOnceC + 1);
            getInvoicesForReceipt();
        }
    }, [receiptId]);

    return (
        <>
            <CustomSnackbar
                open={snackbarOpen}
                handleClose={handleSnackbarClose}
                severity={snackbarSeverity}
                message={snackbarMessage}
            />
            {apiLoading ?
                <>
                    <div className="spinner"></div>Loading data from database....
                </>
                :
                <div className='pt-4 div_InvoiceTableHolderView '>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
                        <thead>
                            <tr style={{ backgroundColor: "#f2f2f2" }}>
                                <th >Vendor Invoice Number</th>
                                <th >Employee Name</th>
                                <th >Vendor Name</th>
                                <th >Start Date</th>
                                <th >End Date</th>
                                <th >Total Amount</th>
                                <th >Total Hours</th>
                                <th >Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoicesData.data.map((item) => (
                                <tr key={item.Id} style={{ backgroundColor: item.Id === invoiceId ? "#e6f7ff" : "#fff" }}>
                                    <td >{item.vendorInvoiceNumber}</td>
                                    <td >{item.employeeName}</td>
                                    <td >{item.vendorName}</td>
                                    <td >{item.startDate}</td>
                                    <td >{item.endDate}</td>
                                    <td >{item.totalAmount}</td>
                                    <td >{item.totalHours}</td>
                                    <td >{item.rate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            }

        </>
    );
}

export default ReceiptInvoices;