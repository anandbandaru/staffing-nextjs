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
import FormSlider from '../slider/formSlider';

function Expense({ props, ID, operation }) {
    const { APIPath, userName } = useContext(Context);
    const [isSubmitionCompleted, setSubmitionCompleted] = useState(false);
    const resetButtonRef = useRef(null);
    const [data, setData] = useState({ data: [] });
    const [name, setName] = useState('');
    const [apiLoading, setApiLoading] = useState(false);
    // Default width
    const [formWidth, setFormWidth] = useState(700);
    const handleSliderChange = (event, newValue) => {
        setFormWidth(newValue);
    };

    const [expenseTypesData, setExpenseTypesData] = useState({ data: [] });
    const [expenseTypeId, setExpenseTypeId] = useState('');

    const [companiesData, setCompaniesData] = useState({ data: [] });
    const [companyId, setCompanyId] = useState('');

    const [employeesData, setEmployeesData] = useState({ data: [] });
    const [employeeId, setEmployeeId] = useState('');

    const [jobsData, setJobsData] = useState({ data: [] });
    const [jobId, setJobId] = useState('');
    const [jobRate, setJobRate] = useState(0);
    const [jobHoursDeducted, setJobHoursDeducted] = useState(0);
    const [amount, setAmount] = useState(0);

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
    const getDetails = () => {
        setApiLoading(true);
        setData({});
        let apiUrl = APIPath + "/getexpensedetails/" + ID;
        // console.log(apiUrl)
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
                        setData({});
                    }
                    else {
                        await getExpenseTypesList();
                        await getCompaniesList();
                        await getEmployeesList();
                        await getJobsList();
                        setName(result.data[0].Id);
                        setEmployeeId(result.data[0].employeeId);
                        setJobId(result.data[0].jobId);
                        setJobRate(result.data[0].jobRate);
                        setJobHoursDeducted(result.data[0].jobHoursDeducted);
                        setAmount(result.data[0].amount);
                        setCompanyId(result.data[0].companyId);
                        setData(result);
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setData({});
                    setName('');
                    // console.log("RequestData:On JUST error: API call failed")
                    setApiLoading(false);
                }
            )
    }

    const getExpenseTypesList = async () => {
        setApiLoading(true);
        setExpenseTypesData({ data: [] });
        let apiUrl = APIPath + "/getexpensetypes"
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
                        setExpenseTypesData({ data: [] });
                    }
                    else {
                        setExpenseTypesData(result);
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setExpenseTypesData({ data: [] });
                    // console.log("RequestData:On JUST error: API call failed")
                    setApiLoading(false);
                }
            )
    }
    const handleExpenseTypeIdChange = (event) => {
        setExpenseTypeId(event.target.value);
    };

    const getCompaniesList = async () => {
        setApiLoading(true);
        setCompaniesData({ data: [] });
        let apiUrl = APIPath + "/getcompanies"
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
                        setCompaniesData({ data: [] });
                    }
                    else {
                        setCompaniesData(result);
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setCompaniesData({ data: [] });
                    // console.log("RequestData:On JUST error: API call failed")
                    setApiLoading(false);
                }
            )
    }
    const handleCompanyIdChange = (event) => {
        setCompanyId(event.target.value);
    };

    const getEmployeesList = async () => {
        setApiLoading(true);
        setEmployeesData({ data: [] });
        let apiUrl = APIPath + "/getemployees"
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
                        setEmployeesData({ data: [] });
                    }
                    else {
                        setEmployeesData(result);
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setEmployeesData({ data: [] });
                    // console.log("RequestData:On JUST error: API call failed")
                    setApiLoading(false);
                }
            )
    }
    const handleEmployeeIdChange = (event) => {
        setJobId('');
        setEmployeeId(event.target.value);
        setJobRate(0);
        setJobHoursDeducted(0);
    };

    const getJobsList = async () => {
        setApiLoading(true);
        setJobsData({ data: [] });
        let apiUrl = APIPath + "/getalljobsforexpenses"
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
        setJobHoursDeducted((amount / job.rate).toFixed(2));
    };
    const handleAmountChange = (event) => {
        const amt = parseFloat(event.target.value);
        setAmount(amt);
        setJobHoursDeducted((amt / parseFloat(jobRate) || 0).toFixed(2));
    };

    useEffect(() => {
        if (operation === "View" || operation === "Edit") {
            getDetails();
        }
        if (operation === "New") {
            getExpenseTypesList();
            getCompaniesList();
            getEmployeesList();
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
            {apiLoading ?
                <>
                    <div className="spinner"></div>Loading data from database....
                </>
                :
                <Formik
                    enableReinitialize
                    initialValues={{
                        Id: name ? ID : 'This will be auto-generated once you save',
                        expenseTypeId: name ? data.data[0].expenseTypeId : '',
                        amount: name ? data.data[0].amount : '',
                        currencyType: name ? data.data[0].currencyType : 'USD',
                        category: name ? data.data[0].category : '',
                        companyId: name ? data.data[0].companyId : '',
                        employeeId: name ? data.data[0].employeeId : '',
                        notes: name ? data.data[0].notes : '',
                        jobId: name ? data.data[0].jobId : '',
                        jobRate: name ? data.data[0].jobRate : '',
                        jobHoursDeducted: name ? data.data[0].jobHoursDeducted : '',
                        createdBy: userName,
                        expenseDate: name ? data.data[0].expenseDate : new Date().toISOString().split('T')[0],
                        referenceAmount: name ? data.data[0].referenceAmount : '',
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
                        expenseTypeId: Yup.string()
                            .required('expense Type Required'),
                        currencyType: Yup.string()
                            .required('currency Type Required'),
                        category: Yup.string()
                            .required('category Required'),
                        amount: Yup.number()
                            .typeError('Must be a number')
                            .required('amount Required').test('is-decimal', 'Must be a decimal number', (value) =>
                                (value + "").match(/^\d+(\.\d+)?$/)
                            ),
                        notes: Yup.string()
                            .required('notes Required'),
                        companyId: Yup.string().nullable().when('category', {
                            is: 'Company',
                            then: () => Yup.string().required('companyId Required'),
                            otherwise: () => Yup.string().nullable()
                        }),
                        employeeId: Yup.string().nullable().when('category', {
                            is: 'Employee',
                            then: () => Yup.string().required('employeeId Required'),
                            otherwise: () => Yup.string().nullable()
                        }),
                        jobId: Yup.string().nullable().when('category', {
                            is: 'Employee',
                            then: () => Yup.string().required('Job Id Required'),
                            otherwise: () => Yup.string().nullable()
                        }),
                        expenseDate: Yup.string()
                            .required('expense Date Required'),
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
                                <FormSlider value={formWidth} onChange={handleSliderChange} />
                                <TextField
                                    size="small"
                                    margin="normal"
                                    fullWidth
                                    id="Id"
                                    name="Id"
                                    label="Id"
                                    disabled
                                    value={values.Id}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <table className='w-full'>
                                    <tbody>
                                        <tr>
                                            <td className='text-right pr-4 pt-4'>
                                                <div>Expense Date</div>
                                            </td>
                                            <td>
                                                <TextField
                                                    size="small"
                                                    margin="normal"
                                                    fullWidth
                                                    className='flex-1'
                                                    id="expenseDate"
                                                    name="expenseDate"
                                                    type="date"
                                                    value={values.expenseDate}
                                                    onChange={handleChange}
                                                    // onChange={(event) => {
                                                    //     handleChange(event);
                                                    //     setReceivedDate(event.target.value);
                                                    // }}
                                                    onBlur={handleBlur}
                                                    helperText={(errors.expenseDate && touched.expenseDate) && errors.expenseDate}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='text-right pr-4 pt-4'>
                                                <div>Reference Amount</div>
                                            </td>
                                            <td>
                                                <TextField
                                                    size="small"
                                                    margin="normal"
                                                    fullWidth
                                                    className='flex-1'
                                                    id="referenceAmount"
                                                    name="referenceAmount"
                                                    type="number"
                                                    value={values.referenceAmount}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    helperText={(errors.referenceAmount && touched.referenceAmount) && errors.referenceAmount}
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <TextField
                                    size="small"
                                    margin="normal"
                                    fullWidth
                                    id="expenseTypeId"
                                    name="expenseTypeId"
                                    select
                                    label="Expense Type"
                                    value={values.expenseTypeId}
                                    onChange={(event) => {
                                        handleChange(event);
                                        handleExpenseTypeIdChange(event);
                                    }}
                                    onBlur={handleBlur}
                                    helperText={(errors.expenseTypeId && touched.expenseTypeId) && errors.expenseTypeId}
                                >
                                    {expenseTypesData.data.map((item, index) => (
                                        <MenuItem key={index} value={item.Id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <TextField
                                    size="small"
                                    margin="normal"
                                    fullWidth
                                    id="currencyType"
                                    name="currencyType"
                                    select
                                    label="Currency Type"
                                    value={values.currencyType}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    helperText={(errors.currencyType && touched.currencyType) && errors.currencyType}
                                >
                                    {configData.currencyTypes.map((item, index) => (
                                        <MenuItem key={index} value={item.name}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <TextField
                                    size="small"
                                    margin="normal"
                                    fullWidth
                                    id="category"
                                    name="category"
                                    select
                                    label="Category"
                                    value={values.category}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    helperText={(errors.category && touched.category) && errors.category}
                                >
                                    {configData.expenseCategories.map((item, index) => (
                                        <MenuItem key={index} value={item.name}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                {values.category === 'Company' && (
                                    <TextField
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        id="companyId"
                                        name="companyId"
                                        select
                                        label="Company Id"
                                        value={values.companyId}
                                        onChange={(event) => {
                                            handleChange(event);
                                            handleCompanyIdChange(event);
                                        }}
                                        onBlur={handleBlur}
                                        helperText={(errors.companyId && touched.companyId) && errors.companyId}
                                    >
                                        {companiesData.data.map((item, index) => (
                                            <MenuItem key={index} value={item.Id}>
                                                {item.Name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                                {values.category === 'Employee' && (
                                    <>
                                        <TextField
                                            size="small"
                                            margin="normal"
                                            fullWidth
                                            id="employeeId"
                                            name="employeeId"
                                            select
                                            label="Employee Id"
                                            value={values.employeeId}
                                            onChange={(event) => {
                                                handleChange(event);
                                                handleEmployeeIdChange(event);
                                            }}
                                            onBlur={handleBlur}
                                            helperText={(errors.employeeId && touched.employeeId) && errors.employeeId}
                                        >
                                            {employeesData.data.map((item, index) => (
                                                <MenuItem key={index} value={item.Id}>
                                                    {item.Id} - {item.firstName} {item.lastName} - {item.employeeType}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                        {employeeId && (
                                            <TextField
                                                size="small"
                                                margin="normal"
                                                fullWidth
                                                id="jobId"
                                                name="jobId"
                                                select
                                                label="Job"
                                                value={values.jobId ? values.jobId : jobId}
                                                onChange={(event) => {
                                                    handleChange(event);
                                                    handleJobIdChange(event);
                                                }}
                                                onBlur={handleBlur}
                                                helperText={(errors.jobId && touched.jobId) && errors.jobId}
                                            >
                                                {jobsData.data
                                                    .filter((job) => job.employeeId === employeeId)
                                                    .map((item, index) => (
                                                        <MenuItem key={index} value={item.jobId}>
                                                            Job ID: {item.jobId} - {item.jobTitle} - {item.jobName} - Rate: ( {item.rate} )
                                                        </MenuItem>
                                                    ))}
                                            </TextField>
                                        )}
                                    </>
                                )}
                                <TextField
                                    size="small"
                                    margin="normal"
                                    fullWidth
                                    type='number'
                                    id="amount"
                                    name="amount"
                                    label="Amount"
                                    value={values.amount ? values.amount : amount}
                                    // onChange={handleChange}
                                    onChange={(event) => {
                                        handleChange(event);
                                        handleAmountChange(event);
                                    }}
                                    onBlur={handleBlur}
                                    helperText={(errors.amount && touched.amount) && errors.amount}
                                />
                                {(values.category === 'Employee' && employeeId) && (
                                    <Stack direction="row" spacing={2} className='float-right mt-2'>
                                        <div className='hoursDeductedTitleDiv'>Approximate hours deducted based on amount:</div>
                                        <div className='hoursDeductedDiv'>{jobHoursDeducted}</div>
                                    </Stack>
                                )}
                                <TextField
                                    size="small"
                                    margin="normal"
                                    fullWidth
                                    id="notes"
                                    name="notes"
                                    label="Notes"
                                    multiline
                                    rows={4}
                                    value={values.notes}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    helperText={(errors.notes && touched.notes) && errors.notes}
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
                                            <Button
                                                ref={resetButtonRef}
                                                variant="outlined"
                                                color="warning"
                                                onClick={handleReset}
                                                disabled={!dirty || (isSubmitting && !isSubmitionCompleted)}
                                            >
                                                Reset
                                            </Button>
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

export default Expense;