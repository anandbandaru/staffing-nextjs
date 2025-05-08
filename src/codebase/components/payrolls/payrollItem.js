import React, { useState, useContext, useRef, useEffect } from 'react';
import configData from "../../../CONFIG_RELEASE.json";
import { Context } from "../../context/context";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import Stack from '@mui/material/Stack';
import CustomSnackbar from "../snackbar/snackbar";
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';

function PayrollItem({ props, MM_YYYY, operation }) {
    const { APIPath, userName } = useContext(Context);
    const [isSubmitionCompleted, setSubmitionCompleted] = useState(false);
    const resetButtonRef = useRef(null);
    const [data, setData] = useState({ data: [] });
    const [name, setName] = useState('');
    const [apiLoading, setApiLoading] = useState(false);
    // Default width
    const [formWidth, setFormWidth] = useState(700);

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
                <Formik
                    enableReinitialize
                    initialValues={{
                        Id: name ? ID : 'This will be auto-generated once you save',
                        payroll_MM_YYYY: name ? data.data[0].payroll_MM_YYYY : MM_YYYY,
                    }}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                        var finalAPI = APIPath + "/addexpense";
                        if (operation === "Edit") {
                            finalAPI = APIPath + "/updateexpense";
                        }
                        setSubmitionCompleted(false);
                        setSubmitting(true);

                        const updatedValues = {
                            ...values,
                            jobRate: values.jobRate || jobRate,
                            jobHoursDeducted: jobRate == 0 ? 0 : jobHoursDeducted
                        };

                        axios.post(finalAPI,
                            updatedValues,
                            {
                                headers: {
                                    'Access-Control-Allow-Origin': '*',
                                    'Content-Type': 'application/json',
                                    'ngrok-skip-browser-warning': 'true'
                                }
                            },
                        ).then((resp) => {
                            setSubmitting(false);
                            setSubmitionCompleted(true);
                            if (resp.data.STATUS === "FAIL")
                                showSnackbar('error', "Error saving Expense data");
                            else
                                showSnackbar('success', "Expense data saved");

                            setAmount(0);
                            resetForm();
                        }).catch(function (error) {
                            setSubmitting(false);
                            // console.log(error);
                            setSubmitionCompleted(true);
                            showSnackbar('error', "Error saving Expense data");
                        });
                    }}

                    validationSchema={Yup.object().shape({
                        payroll_MM_YYYY: Yup.string()
                            .required('payroll_MM_YYYY Type Required'),
                    })}
                >
                    {(props) => {
                        const {
                            values,
                            touched,
                            errors,
                            dirty,
                            isSubmitting,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            handleReset
                        } = props;
                        return (
                            <form onSubmit={handleSubmit} style={{ maxWidth: `${formWidth}px`, margin: '0 auto' }}>
                                <TextField
                                    size="small"
                                    margin="normal"
                                    fullWidth
                                    id="MM_YYYY"
                                    name="MM_YYYY"
                                    label="MM_YYYY"
                                    disabled
                                    value={values.MM_YYYY}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                
                                {Object.keys(errors).length > 0 && (
                                    <div className="error-summary bg-red-500 my-4 p-2 text-white rounded-md">
                                        <span className='error-summary-heading' >Validation Errors:</span>
                                        <ul>
                                            {Object.keys(errors).map((key) => (
                                                <li key={key}><KeyboardArrowRightOutlinedIcon />{errors[key]}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                <Stack direction="row" spacing={2} className='float-right mt-2'>
                                    {operation === "Edit" ? (
                                        isSubmitting ? (
                                            <div className="spinner"></div>
                                        ) : (
                                            <>
                                                {((values.category === 'Employee' && jobId) || (values.category !== 'Employee')) && (
                                                    <Button color="primary" variant="contained" type="submit" disabled={isSubmitting && !isSubmitionCompleted}>
                                                        <SaveOutlinedIcon className="mr-1" />
                                                        Update
                                                    </Button>
                                                )}
                                            </>
                                        )
                                    ) : (
                                        <>
                                            {isSubmitting ? (
                                                <div className="spinner"></div>
                                            ) : (
                                                <>
                                                    {((values.category === 'Employee' && jobId) || (values.category !== 'Employee')) && (
                                                        <Button color="primary" variant="contained" type="submit" disabled={isSubmitting && !isSubmitionCompleted}>
                                                            <SaveOutlinedIcon className="mr-1" />
                                                            Save
                                                        </Button>
                                                    )}
                                                </>
                                            )}
                                        </>
                                    )}
                                </Stack>
                            </form>
                        );
                    }}
                </Formik>
            }

        </>
    );
}

export default PayrollItem;