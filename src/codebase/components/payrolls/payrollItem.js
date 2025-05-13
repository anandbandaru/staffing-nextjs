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
import { Autocomplete } from '@mui/material';

function PayrollItem({ props, MM_YYYY, operation, ID, empID, empName, empDisabled, index }) {
    const { APIPath, userName } = useContext(Context);
    const [isSubmitionCompleted, setSubmitionCompleted] = useState(false);
    const resetButtonRef = useRef(null);
    const [data, setData] = useState({ data: [] });
    const [name, setName] = useState('');
    const [apiLoading, setApiLoading] = useState(false);
    // Default width
    const [formWidth, setFormWidth] = useState(1400);

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

    const [jobsData, setJobsData] = useState({ data: [] });
    const [jobId, setJobId] = useState('');
    const [jobRate, setJobRate] = useState(0);
    const [sPayData, setSPayData] = useState({ data: [] });
    const [standardPay, setStandardPay] = useState('');

    const getJobsList = async () => {
        setApiLoading(true);
        setJobsData({ data: [] });
        let apiUrl = APIPath + "/getjobsbyemployee/" + empID;
        fetch(apiUrl, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
            }
        })
            .then(response => response.json())
            .then(
                async (result) => {
                    if (result.error) {
                        // console.log("RequestData:On error return: setting empty")
                        setJobsData({ data: [] });
                    }
                    else {
                        setJobsData(result);
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setJobsData({ data: [] });
                    // console.log("RequestData:On JUST error: API call failed")
                    setApiLoading(false);
                }
            )
    }
    const handleJobIdChange = (event) => {
        setJobId(event.target.value);
        const job = jobsData.data.find((item) => item.jobId === event.target.value);
        setJobRate(job.rate);
        GetLastStandardPayByJobId(event.target.value);
    };
    const GetLastStandardPayByJobId = async (myJobId) => {
        setApiLoading(true);
        setSPayData({ data: [] });
        setStandardPay(0.00);
        let apiUrl = APIPath + "/getlaststandardpaybyjobid/" + myJobId;
        fetch(apiUrl, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
            }
        })
            .then(response => response.json())
            .then(
                async (result) => {
                    if (result.error) {
                        setSPayData({ data: [] });
                    }
                    else {
                        setSPayData(result);
                        if (result.data.length > 0) {
                            setStandardPay(result.data[0].standardPay);
                        }
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setSPayData({ data: [] });
                    setApiLoading(false);
                }
            )
    }

    useEffect(() => {
        if (operation === "View" || operation === "Edit") {
            //getDataForMMYYYY();
        } else if (operation === "New") {
            setApiLoading(false);
            getJobsList();
        }
    }, []);

    return (
        <>
            <CustomSnackbar
                open={snackbarOpen}
                handleClose={handleSnackbarClose}
                severity={snackbarSeverity}
                message={snackbarMessage}
            />
                <Formik
                    enableReinitialize
                    initialValues={{
                        Id: name ? ID : 'This will be auto-generated once you save',
                        payroll_MM_YYYY: name ? data.data[0].payroll_MM_YYYY : MM_YYYY,
                        employeeId: name ? data.data[0].employeeId : empID,
                        standardPay: name ? data.data[0].standardPay : standardPay,
                        jobId: name ? data.data[0].jobId : jobId,
                        rate: name ? data.data[0].rate : jobRate,
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
                            // jobRate: values.jobRate || jobRate,
                            // jobHoursDeducted: jobRate == 0 ? 0 : jobHoursDeducted
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
                            .required('payroll MM YYYY Required'),
                        standardPay: Yup.string()
                            .required('standard Pay Required'),
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
                            <form onSubmit={handleSubmit} className='justify-start place-items-start items-start' style={{ maxWidth: `${formWidth}px`, margin: '0 0' }}>

                                <table className='payrollTable my-2'>
                                    {index === 0 && (
                                        <thead>
                                            <tr>
                                                <th>
                                                    <h2 className='text-sm font-bold'>Employee</h2>
                                                </th>
                                                <th>
                                                    <h2 className='text-sm font-bold'>Job</h2>
                                                </th>
                                                <th>
                                                    <h2 className='text-sm font-bold'>Rate</h2>
                                                </th>
                                                <th>
                                                    <h2 className='text-sm font-bold'>Standard Pay</h2>
                                                </th>
                                                <th>
                                                    <h2 className='text-sm font-bold'>Hours</h2>
                                                </th>
                                                <th>
                                                    <h2 className='text-sm font-bold'>Before Tax</h2>
                                                </th>
                                                <th>
                                                    <h2 className='text-sm font-bold'>Tax</h2>
                                                </th>
                                                <th>
                                                    <h2 className='text-sm font-bold'>NetPay</h2>
                                                </th>
                                                <th>
                                                    <h2 className='text-sm font-bold'>Employer Expense</h2>
                                                </th>
                                                <th>
                                                    <h2 className='text-sm font-bold'>Check #</h2>
                                                </th>
                                                <th>
                                                    <h2 className='text-sm font-bold'>Pay Date</h2>
                                                </th>
                                                <th>
                                                    <h2 className='text-sm font-bold'>Actions</h2>
                                                </th>
                                            </tr>
                                        </thead>
                                    )}
                                    <tbody>
                                        <tr>
                                            <td className='td_Employee'>
                                                {apiLoading ?
                                                    <>
                                                        <div className="spinner"></div>Loading data from database....
                                                    </> :
                                                    <>
                                                        {empID + " - " + empName}
                                                    </>
                                                }
                                            </td>
                                            <td className='td_Job'>
                                                <TextField
                                                    size="small"
                                                    className='ddSmall'
                                                    margin="normal"
                                                    id="jobId"
                                                    name="jobId"
                                                    variant="standard"
                                                    fullWidth
                                                    select
                                                    value={values.jobId ? values.jobId : jobId}
                                                    onChange={(event) => {
                                                        handleChange(event);
                                                        handleJobIdChange(event);
                                                    }}
                                                    onBlur={handleBlur}
                                                    helperText={(errors.jobId && touched.jobId) && errors.jobId}
                                                >
                                                    {jobsData.data
                                                        //.filter((job) => job.employeeId === empID)
                                                        .map((item, index) => (
                                                            <MenuItem key={index} value={item.jobId}>
                                                                {item.jobTitle}
                                                                {/* - {item.jobName} */}
                                                            </MenuItem>
                                                        ))}
                                                </TextField>
                                            </td>
                                            <td className='td_Rate'>
                                                <TextField
                                                    className='txtSmall'
                                                    variant="standard"
                                                    size="small"
                                                    margin="normal"
                                                    type='number'
                                                    id="rate"
                                                    name="rate"
                                                    value={values.rate ? values.rate : jobRate}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    helperText={(errors.rate && touched.rate) && errors.rate}
                                                />
                                            </td>
                                            <td className='td_StandardPay'>
                                                <TextField
                                                    className='txtSmall'
                                                    variant="standard"
                                                    size="small"
                                                    margin="normal"
                                                    type='number'
                                                    id="standardPay"
                                                    name="standardPay"
                                                    value={values.standardPay ? values.standardPay : standardPay}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    helperText={(errors.standardPay && touched.standardPay) && errors.standardPay}
                                                />
                                            </td>
                                            <td className='td_Hours'>
                                                <TextField
                                                    className='txtSmall'
                                                    variant="standard"
                                                    size="small"
                                                    margin="normal"
                                                    type='number'
                                                    id="hours"
                                                    name="hours"
                                                    value={values.hours}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    helperText={(errors.hours && touched.hours) && errors.hours}
                                                />
                                            </td>
                                            <td className='td_BeforeTax'>
                                                <TextField
                                                    className='txtSmall'
                                                    variant="standard"
                                                    size="small"
                                                    margin="normal"
                                                    type='number'
                                                    id="beforeTaxAmount"
                                                    name="beforeTaxAmount"
                                                    value={values.beforeTaxAmount}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    helperText={(errors.beforeTaxAmount && touched.beforeTaxAmount) && errors.beforeTaxAmount}
                                                />
                                            </td>
                                            <td className='td_Tax'>
                                                <TextField
                                                    className='txtSmall'
                                                    variant="standard"
                                                    size="small"
                                                    margin="normal"
                                                    type='number'
                                                    id="taxAmount"
                                                    name="taxAmount"
                                                    value={values.taxAmount}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    helperText={(errors.taxAmount && touched.taxAmount) && errors.taxAmount}
                                                />
                                            </td>
                                            <td className='td_NetPay'>
                                                <TextField
                                                    className='txtSmall'
                                                    variant="standard"
                                                    size="small"
                                                    margin="normal"
                                                    type='number'
                                                    id="netPayAmount"
                                                    name="netPayAmount"
                                                    value={values.netPayAmount}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    helperText={(errors.netPayAmount && touched.netPayAmount) && errors.netPayAmount}
                                                />
                                            </td>
                                            <td className='td_EmployerExpense'>
                                                <TextField
                                                    className='txtSmall'
                                                    variant="standard"
                                                    size="small"
                                                    margin="normal"
                                                    type='number'
                                                    id="employerExpense"
                                                    name="employerExpense"
                                                    value={values.employerExpense}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    helperText={(errors.employerExpense && touched.employerExpense) && errors.employerExpense}
                                                />
                                            </td>
                                            <td className='td_Check'>
                                                <TextField
                                                    className='txtSmall'
                                                    variant="standard"
                                                    size="small"
                                                    margin="normal"
                                                    type='number'
                                                    id="checkNumber"
                                                    name="checkNumber"
                                                    value={values.checkNumber}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    helperText={(errors.checkNumber && touched.checkNumber) && errors.checkNumber}
                                                />
                                            </td>
                                            <td className='td_PayDate'>
                                                <TextField
                                                    className='txtSmall'
                                                    variant="standard"
                                                    size="small"
                                                    margin="normal"
                                                    type='number'
                                                    id="payDate"
                                                    name="payDate"
                                                    value={values.payDate}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    helperText={(errors.payDate && touched.payDate) && errors.payDate}
                                                />
                                            </td>
                                            <td className='td_Actions'>
                                                <Stack direction="row" spacing={0} className=''>
                                                    {operation === "Edit" ? (
                                                        isSubmitting ? (
                                                            <div className="spinner"></div>
                                                        ) : (
                                                            <>
                                                                <Button size='small' color="primary" variant="contained" type="submit"
                                                                    disabled={isSubmitting && !isSubmitionCompleted}>
                                                                    <SaveOutlinedIcon className="mr-1" />
                                                                    Update
                                                                </Button>
                                                            </>
                                                        )
                                                    ) : (
                                                        <>
                                                            {isSubmitting ? (
                                                                <div className="spinner"></div>
                                                            ) : (
                                                                <>
                                                                    <Button size='small' color="primary" variant="contained" type="submit"
                                                                        disabled={isSubmitting && !isSubmitionCompleted || empDisabled}>
                                                                        <SaveOutlinedIcon className="mr-1" />
                                                                        Save
                                                                    </Button>
                                                                    <div className='mr-2'></div>
                                                                    <Button size='small' color="secondary" variant="contained"
                                                                        disabled={isSubmitting && !isSubmitionCompleted || empDisabled}
                                                                        onClick={() => {
                                                                            handleReset();
                                                                        }}>
                                                                        <SaveOutlinedIcon className="mr-1" />
                                                                        Paid
                                                                    </Button>
                                                                </>
                                                            )}
                                                        </>
                                                    )}
                                                </Stack>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

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

                            </form>
                        );
                    }}
                </Formik>
        </>
    );
}

export default PayrollItem;