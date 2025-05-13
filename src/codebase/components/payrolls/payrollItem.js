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
import { Visibility } from '@mui/icons-material';
import Menu from '@mui/material/Menu';
import PaidRoundedIcon from '@mui/icons-material/PaidRounded';
import IconButton from '@mui/material/IconButton';

function PayrollItem({ props, MM_YYYY, operation, ID, empID, empName, empDisabled, index, MM_YYYY_Data }) {
    const { APIPath, userName } = useContext(Context);
    const [isSubmitionCompleted, setSubmitionCompleted] = useState(false);
    const resetButtonRef = useRef(null);
    const [apiLoading, setApiLoading] = useState(false);
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
    const [jobRate, setJobRate] = useState(0.00);

    const [sPayData, setSPayData] = useState({ data: [] });
    const [standardPay, setStandardPay] = useState(0.00);

    const [checkHoursData, setCheckHoursData] = useState({ data: [] });
    const [savedInvoiceHours, setSavedInvoiceHours] = useState(0.00);
    const [paidPayrollHours, setPaidPayrollHours] = useState(0.00);
    const [expensesForJob, setExpensesForJob] = useState(0.00);
    const [holdHours, setHoldHours] = useState(0.00);

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
        GetCheckHoursForJobId(event.target.value);
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
    const GetCheckHoursForJobId = async (myJobId) => {
        setApiLoading(true);
        setCheckHoursData({ data: [] });
        setSavedInvoiceHours(0.00);
        setPaidPayrollHours(0.00);
        setExpensesForJob(0.00);
        setHoldHours(0.00);
        let apiUrl = APIPath + "/getcheckhoursforjobid/" + myJobId;
        fetch(apiUrl, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
            }
        })
            .then(response => response.json())
            .then(
                async (result) => {
                    if (result.error) {
                        setCheckHoursData({ data: [] });
                    }
                    else {
                        setCheckHoursData(result);
                        if (result.data.length > 0) {
                            setSavedInvoiceHours(result.data[0].savedInvoiceHours);
                            setPaidPayrollHours(result.data[0].paidPayrollHours);
                            setExpensesForJob(result.data[0].expensesForJob);
                            setHoldHours(result.data[0].holdHours);
                        }
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setCheckHoursData({ data: [] });
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

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

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
                    Id: MM_YYYY_Data ? ID : 'This will be auto-generated once you save',
                    payroll_MM_YYYY: MM_YYYY_Data ? MM_YYYY_Data.payroll_MM_YYYY : MM_YYYY,
                    employeeId: MM_YYYY_Data ? MM_YYYY_Data.employeeId : empID,
                    standardPay: MM_YYYY_Data ? MM_YYYY_Data.standardPay : standardPay,
                    jobId: MM_YYYY_Data ? MM_YYYY_Data.jobId : jobId,
                    rate: MM_YYYY_Data ? MM_YYYY_Data.rate : jobRate,
                    hours: MM_YYYY_Data ? MM_YYYY_Data.hours : 0.00,
                    checkHours: MM_YYYY_Data ? MM_YYYY_Data.checkHours : checkHoursData.data[0] ? checkHoursData.data[0].checkHours : 0.00,
                    savedInvoiceHours: MM_YYYY_Data ? MM_YYYY_Data.savedInvoiceHours : checkHoursData.data[0] ? checkHoursData.data[0].savedInvoiceHours : 0.00,
                    paidInvoiceHours: MM_YYYY_Data ? MM_YYYY_Data.paidInvoiceHours : checkHoursData.data[0] ? checkHoursData.data[0].paidPayrollHours : 0.00,
                    expensesForJob: MM_YYYY_Data ? MM_YYYY_Data.expensesForJob : checkHoursData.data[0] ? checkHoursData.data[0].expensesForJob : 0.00,
                    holdHours: MM_YYYY_Data ? MM_YYYY_Data.holdHours : checkHoursData.data[0] ? checkHoursData.data[0].holdHours : 0.00,
                    beforeTaxAmount: MM_YYYY_Data ? MM_YYYY_Data.beforeTaxAmount : 0.00,
                    taxAmount: MM_YYYY_Data ? MM_YYYY_Data.taxAmount : 0.00,
                    netPayAmount: MM_YYYY_Data ? MM_YYYY_Data.netPayAmount : 0.00,
                    employerExpense: MM_YYYY_Data ? MM_YYYY_Data.employerExpense : 0.00,
                    checkNumber: MM_YYYY_Data ? MM_YYYY_Data.checkNumber : "",
                    payDate: MM_YYYY_Data ? MM_YYYY_Data.payDate : "",
                    createdBy: MM_YYYY_Data ? MM_YYYY_Data.createdBy : userName,
                    updatedBy: MM_YYYY_Data ? MM_YYYY_Data.updatedBy : userName,
                    status: MM_YYYY_Data ? MM_YYYY_Data.status : "",
                    paidDate: MM_YYYY_Data ? MM_YYYY_Data.paidDate : "",
                    paidBy: MM_YYYY_Data ? MM_YYYY_Data.paidBy : userName,
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
                    jobId: Yup.string()
                        .required('jobId Required'),
                    standardPay: Yup.string()
                        .required('standard Pay Required'),
                    hours: Yup.string()
                        .required('Hours Required'),
                    beforeTaxAmount: Yup.string()
                        .required('beforeTaxAmount Required'),
                    taxAmount: Yup.string()
                        .required('taxAmount Required'),
                    netPayAmount: Yup.string()
                        .required('netPayAmount Required'),
                    employerExpense: Yup.string()
                        .required('employerExpense Required'),
                    checkNumber: Yup.string()
                        .required('checkNumber Required'),
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
                        <div className='div_PayrollFormContainer'>
                            <form onSubmit={handleSubmit} className='PayrollFormContainer' >

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
                                                {<div className={(empDisabled) ? 'rag-red-bg badgeSpan inline-block' : 'badgeSpan inline-block'}>
                                                    {(empDisabled) ? "DISABLED" : ""}
                                                </div>}
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
                                                    className='txtSmallrate'
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
                                                    className='txtSmallStandardPay'
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
                                            <td className='td_Hours' >
                                                <Stack direction="row" spacing={0} className=''>
                                                    <TextField
                                                        className='txtSmallHours'
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
                                                    <Button
                                                        id="basic-button"
                                                        aria-controls={open ? 'basic-menu' : undefined}
                                                        aria-haspopup="true"
                                                        size='small'
                                                        aria-expanded={open ? 'true' : undefined}
                                                        onClick={handleClick}
                                                    >
                                                        <Visibility size='small' />
                                                    </Button>
                                                    <Menu
                                                        id="basic-menu"
                                                        anchorEl={anchorEl}
                                                        open={open}
                                                        onClose={handleClose}
                                                        MenuListProps={{
                                                            'aria-labelledby': 'basic-button',
                                                        }}
                                                    >
                                                        {/* <MenuItem onClick={handleClose}>savedInvoiceHours</MenuItem>
                                                        <MenuItem onClick={handleClose}>paidPayrollHours</MenuItem>
                                                        <MenuItem onClick={handleClose}>expensesForJob</MenuItem>
                                                        <MenuItem onClick={handleClose}>holdHours</MenuItem> */}
                                                        <table className='hoursCheckTable'>
                                                            <tbody>
                                                                <tr>
                                                                    <td>
                                                                        Saved Invoice Hours
                                                                    </td>
                                                                    <td>
                                                                        {values.savedInvoiceHours}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        Paid Invoice Hours
                                                                    </td>
                                                                    <td>
                                                                        {values.paidInvoiceHours}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        Employee Expenses
                                                                    </td>
                                                                    <td>
                                                                        {values.expensesForJob}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        Hold Hours
                                                                    </td>
                                                                    <td>
                                                                        {values.holdHours}
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </Menu>
                                                </Stack>
                                            </td>
                                            <td className='td_BeforeTax'>
                                                <TextField
                                                    className='txtSmallBeforeTax'
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
                                                    className='txtSmallTax'
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
                                                    className='txtSmallNetPay'
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
                                                    className='txtSmallEmployerExpense'
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
                                                    className='txtSmallCheck'
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
                                                    id="payDate"
                                                    name="payDate"
                                                    type="date"
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
                                                                        <PaidRoundedIcon className="mr-1" />
                                                                        Paid
                                                                    </Button>
                                                                </>
                                                            )}
                                                        </>
                                                    )}
                                                </Stack>
                                                {/* {Object.keys(errors).length > 0 && (
                                                    <div className="error-summary bg-red-500 my-4 p-2 text-white rounded-md">
                                                        <span className='error-summary-heading' >Validation Errors:</span>
                                                        <ul>
                                                            {Object.keys(errors).map((key) => (
                                                                <li key={key}><KeyboardArrowRightOutlinedIcon />{errors[key]}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )} */}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>



                            </form>
                        </div>
                    );
                }}
            </Formik >
        </>
    );
}

export default PayrollItem;