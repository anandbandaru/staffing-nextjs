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

function Invoice({ props, ID, operation }) {
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

    const [vendorsData, setVendorsData] = useState({ data: [] });
    const [vendorId, setVendorId] = useState('');

    const [jobsData, setJobsData] = useState({ data: [] });
    const [jobId, setJobId] = useState('');
    const [rate, setRate] = useState(0.00);

    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [startYear, setStartYear] = useState('');

    const [employeeId, setEmployeeId] = useState('');

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
        let apiUrl = APIPath + "/getinvoicedetails/" + ID;
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
                        await getVendorsList();
                        await getJobsList();
                        setName(result.data[0].Id);
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

    const getVendorsList = async () => {
        setApiLoading(true);
        setVendorsData({ data: [] });
        let apiUrl = APIPath + "/getactivevendors"
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
                        setVendorsData({ data: [] });
                    }
                    else {
                        setVendorsData(result);
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setVendorsData({ data: [] });
                    // console.log("RequestData:On JUST error: API call failed")
                    setApiLoading(false);
                }
            )
    }
    const handleVendorIdChange = async (event) => {
        setVendorId(event.target.value);
        console.log("VENDOR: " + event.target.value);

        if (operation === "New")
            await getJobsList(event.target.value);
    };

    const getJobsList = async (selectedvid) => {
        setJobsData({ data: [] });
        let apiUrl = APIPath + "/getjobsbyvendor/" + selectedvid
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
                        if (result.total === 0) {
                            showSnackbar('error', "No Jobs present for the selected Vendor");
                        }
                        else {
                            showSnackbar('success_1', "Jobs fetched for the vendor based on Active employees");
                        }
                    }
                },
                (error) => {
                    setJobsData({ data: [] });
                }
            )
    }
    const handleJobIdChange = (employeeId, jobId, invoicePeriod, setFieldValue, rate) => {
        setJobId(jobId);
        setEmployeeId(employeeId);
        // Update the invoiceNumber field with the desired format
        let valToSet = `CUST-INV-E:${employeeId}-J:${jobId}-${invoicePeriod}-`
        setInvoiceNumber(valToSet);
        setFieldValue('invoiceNumber', valToSet);
        setRate(rate);
        setFieldValue('rate', rate);
    };

    const handleJobStartDateChange = (event, setFieldValue) => {
        const year = event.target.value.split('-')[0];
        setStartYear(year);
        console.log("StartDate: " + year);
        setFieldValue('invoiceNumber', invoiceNumber + year + "-");
    };


    useEffect(() => {
        if (operation === "View" || operation === "Edit") {
            getDetails();
        }
        if (operation === "New") {
            getVendorsList();
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
                        employeeId: name ? data.data[0].employeeId : employeeId,
                        jobId: name ? data.data[0].jobId : jobId,
                        invoiceNumber: name ? data.data[0].invoiceNumber : invoiceNumber,
                        timesheetNumber: 'T-CUSTOM-NOT_PRESENT',
                        startDate: name ? data.data[0].startDate : '',
                        endDate: name ? data.data[0].endDate : '',
                        vendorId: name ? data.data[0].vendorId : vendorId,
                        totalHours: name ? data.data[0].totalHours : '',
                        rate: name ? data.data[0].rate : rate,
                        createdBy: userName,
                        invoiceDate: name ? data.data[0].invoiceDate : '',
                        userNotes: name ? data.data[0].userNotes : '',
                    }}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                        var finalAPI = APIPath + "/addcustominvoice";
                        if (operation === "Edit") {
                            finalAPI = APIPath + "/updateinvoice";
                        }
                        setSubmitionCompleted(false);
                        setSubmitting(true);
                        const updatedValues = {
                            ...values,
                            totalAmount: values.rate * values.totalHours,
                            otherAmount: 0.00,
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
                                showSnackbar('error', "Error saving Invoice data");
                            else
                                showSnackbar('success', "Invoice data saved");
                            resetForm();
                        }).catch(function (error) {
                            setSubmitting(false);
                            // console.log(error);
                            setSubmitionCompleted(true);
                            showSnackbar('error', "Error saving Invoice data");
                        });
                    }}

                    validationSchema={Yup.object().shape({
                        vendorId: Yup.string()
                            .required('Vendor Required'),
                        jobId: Yup.string()
                            .required('Job Required'),
                        invoiceDate: Yup.string()
                            .required('Invoice Date Required'),
                        totalHours: Yup.number()
                            .required('Total Hours Must be a number'),
                        startDate: Yup.string()
                            .required('Start Date Required'),
                        userNotes: Yup.string()
                            .required('Notes Required'),
                        endDate: Yup.string()
                            .required('End Date Required')
                            .test('is-greater', 'End Date must be later than Start Date', function (value) {
                                const { startDate } = this.parent;
                                return startDate && value ? new Date(value) > new Date(startDate) : true;
                            }),
                        invoiceNumber: Yup.string()
                            .required('Invoice Number is required'),
                        rate: Yup.number()
                            .typeError('Must be a number')
                            .required('Rate Required').test('is-decimal', 'Must be a decimal number', (value) =>
                                (value + "").match(/^\d+(\.\d+)?$/)
                            ),
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
                            handleReset,
                            setFieldValue
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
                                <TextField
                                    size="small"
                                    margin="normal"
                                    fullWidth
                                    id="vendorId"
                                    name="vendorId"
                                    select
                                    label="Vendor"
                                    value={values.vendorId}
                                    onChange={(event) => {
                                        handleChange(event);
                                        handleVendorIdChange(event);
                                    }}
                                    onBlur={handleBlur}
                                    helperText={(errors.vendorId && touched.vendorId) && errors.vendorId}
                                >
                                    {vendorsData.data.map((item, index) => (
                                        <MenuItem key={index} value={item.Id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <TextField
                                    size="small"
                                    margin="normal"
                                    fullWidth
                                    id="jobId"
                                    name="jobId"
                                    select
                                    label="Job Id"
                                    value={values.jobId}
                                    onChange={(event) => {
                                        handleChange(event);
                                        const selectedJobId = event.target.value;
                                        const selectedJob = jobsData.data.find(job => job.jobId === selectedJobId);
                                        if (selectedJob) {
                                            const employeeId = selectedJob.employeeId;
                                            const jobId = selectedJob.jobId;
                                            const invoicePeriod = selectedJob.invoicePeriod;
                                            const rate = selectedJob.rate;
                                            handleJobIdChange(employeeId, jobId, invoicePeriod, setFieldValue, rate);
                                        } else {
                                            console.error('Selected job not found in jobsData');
                                        }
                                    }}
                                    onBlur={handleBlur}
                                    helperText={(errors.jobId && touched.jobId) && errors.jobId}
                                >
                                    {jobsData.data.map((item, index) => (
                                        <MenuItem key={index} value={item.jobId}
                                            employeeid={item.employeeId}
                                            invoiceperiod={item.invoicePeriod}
                                            jobid={item.jobId}
                                            startdate={item.startDate}>
                                            {item.jobName} - {'(EMPLOYEE: ' + item.employeeFull + ')'} -
                                            <span className='bg-slate-500 text-white px-2'>{'(INVOICE PERIOD: ' + item.invoicePeriod + ')'}</span>
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <Stack direction="row" spacing={2} className="flex items-center pl-2 mt-4">
                                    <div className='flex-1'>Invoice Date:
                                    </div>
                                    <TextField
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        className='flex-1'
                                        id="invoiceDate"
                                        name="invoiceDate"
                                        type="date"
                                        value={values.invoiceDate}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        helperText={(errors.invoiceDate && touched.invoiceDate) && errors.invoiceDate}
                                    />
                                </Stack>
                                <Stack direction="row" spacing={2} className="flex items-center pl-2 mt-4">
                                    <div className='flex-1'>Start Date:
                                    </div>
                                    <TextField
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        className='flex-1'
                                        id="startDate"
                                        name="startDate"
                                        type="date"
                                        value={values.startDate}
                                        // onChange={handleChange}
                                        onChange={(event) => {
                                            handleChange(event);
                                            handleJobStartDateChange(event, setFieldValue);
                                        }}
                                        onBlur={handleBlur}
                                        helperText={(errors.startDate && touched.startDate) && errors.startDate}
                                    />
                                </Stack>
                                <Stack direction="row" spacing={2} className="flex items-center pl-2 mt-4">
                                    <div className='flex-1'>End Date:
                                    </div>
                                    <TextField
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        className='flex-1'
                                        id="endDate"
                                        name="endDate"
                                        type="date"
                                        value={values.endDate}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        helperText={(errors.endDate && touched.endDate) && errors.endDate}
                                    />
                                </Stack>
                                <TextField
                                    size="small"
                                    margin="normal"
                                    fullWidth
                                    id="invoiceNumber"
                                    name="invoiceNumber"
                                    label="Invoice Number"
                                    value={values.invoiceNumber}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    helperText={(errors.invoiceNumber && touched.invoiceNumber) && errors.invoiceNumber}
                                />
                                <TextField
                                    size="small"
                                    margin="normal"
                                    fullWidth
                                    id="rate"
                                    name="rate"
                                    type="number"
                                    label="Rate"
                                    value={values.rate ? values.rate : rate}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    helperText={(errors.rate && touched.rate) && errors.rate}
                                />
                                <TextField
                                    size="small"
                                    margin="normal"
                                    fullWidth
                                    id="totalHours"
                                    name="totalHours"
                                    type="number"
                                    label="Total Hours"
                                    value={values.totalHours}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    helperText={(errors.totalHours && touched.totalHours) && errors.totalHours}
                                />
                                <TextField
                                    className=""
                                    size="small"
                                    margin="normal"
                                    fullWidth
                                    id="userNotes"
                                    name="userNotes"
                                    label="Notes"
                                    multiline
                                    rows={2}
                                    value={values.userNotes}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    helperText={(errors.userNotes && touched.userNotes) && errors.userNotes}
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
                                            <Button color="primary" variant="contained" type="submit" disabled={isSubmitting && !isSubmitionCompleted}>
                                                <SaveOutlinedIcon className="mr-1" />
                                                Update
                                            </Button>
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
                                                <Button color="primary" variant="contained" type="submit" disabled={isSubmitting && !isSubmitionCompleted}>
                                                    <SaveOutlinedIcon className="mr-1" />
                                                    Save
                                                </Button>
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

export default Invoice;