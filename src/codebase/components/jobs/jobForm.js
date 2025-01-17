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

function Job({ props, ID, operation }) {
    const { APIPath, userName } = useContext(Context);
    const [isSubmitionCompleted, setSubmitionCompleted] = useState(false);
    const resetButtonRef = useRef(null);
    const [data, setData] = useState({ data: [] });
    const [name, setName] = useState('');
    const [apiLoading, setApiLoading] = useState(false);

    const [companiesData, setCompaniesData] = useState({ data: [] });
    const [companyId, setCompanyId] = useState('');

    const [vendorsData, setVendorsData] = useState({ data: [] });
    const [vendorId, setVendorId] = useState('');

    const [iPsData, setIPsData] = useState({ data: [] });
    const [iPId, setIPId] = useState('');

    const [clientsData, setClientsData] = useState({ data: [] });
    const [clientId, setClientId] = useState('');

    const [employeesData, setEmployeesData] = useState({ data: [] });
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
        let apiUrl = APIPath + "/getjobdetails/" + ID;
        console.log(apiUrl)
        fetch(apiUrl)
            .then(response => response.json())
            .then(
                async (result) => {
                    if (result.error) {
                        console.log("RequestData:On error return: setting empty")
                        setData({});
                    }
                    else {
                        await getCompaniesList();
                        await getVendorsList();
                        await getIPsList();
                        await getClientsList();
                        await getEmployeesList();
                        setData(result);
                        setName(result.data[0].jobName);
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setData({});
                    console.log("RequestData:On JUST error: API call failed")
                    setApiLoading(false);
                }
            )
    }

    const getCompaniesList = async () => {
        setApiLoading(true);
        setCompaniesData({ data: [] });
        let apiUrl = APIPath + "/getcompanies"
        fetch(apiUrl)
            .then(response => response.json())
            .then(
                (result) => {
                    if (result.error) {
                        console.log("RequestData:On error return: setting empty")
                        setCompaniesData({ data: [] });
                    }
                    else {
                        setCompaniesData(result);
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setCompaniesData({ data: [] });
                    console.log("RequestData:On JUST error: API call failed")
                    setApiLoading(false);
                }
            )
    }
    const handleCompanyIdChange = (event) => {
        setCompanyId(event.target.value);
    };

    const getVendorsList = async () => {
        setApiLoading(true);
        setVendorsData({ data: [] });
        let apiUrl = APIPath + "/getvendors"
        fetch(apiUrl)
            .then(response => response.json())
            .then(
                (result) => {
                    if (result.error) {
                        console.log("RequestData:On error return: setting empty")
                        setVendorsData({ data: [] });
                    }
                    else {
                        setVendorsData(result);
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setVendorsData({ data: [] });
                    console.log("RequestData:On JUST error: API call failed")
                    setApiLoading(false);
                }
            )
    }
    const handleVendorIdChange = (event) => {
        setVendorId(event.target.value);
    };

    const getIPsList = async () => {
        setApiLoading(true);
        setIPsData({ data: [] });
        let apiUrl = APIPath + "/getimplementationpartners"
        fetch(apiUrl)
            .then(response => response.json())
            .then(
                (result) => {
                    if (result.error) {
                        console.log("RequestData:On error return: setting empty")
                        setIPsData({ data: [] });
                    }
                    else {
                        setIPsData(result);
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setIPsData({ data: [] });
                    console.log("RequestData:On JUST error: API call failed")
                    setApiLoading(false);
                }
            )
    }
    const handleIPIdChange = (event) => {
        setIPId(event.target.value);
    };

    const getClientsList = async () => {
        setApiLoading(true);
        setClientsData({ data: [] });
        let apiUrl = APIPath + "/getclients"
        fetch(apiUrl)
            .then(response => response.json())
            .then(
                (result) => {
                    if (result.error) {
                        console.log("RequestData:On error return: setting empty")
                        setClientsData({ data: [] });
                    }
                    else {
                        setClientsData(result);
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setClientsData({ data: [] });
                    console.log("RequestData:On JUST error: API call failed")
                    setApiLoading(false);
                }
            )
    }
    const handleClientIdChange = (event) => {
        setClientId(event.target.value);
    };
    const getEmployeesList = async () => {
        setApiLoading(true);
        setEmployeesData({ data: [] });
        let apiUrl = APIPath + "/getemployees"
        fetch(apiUrl)
            .then(response => response.json())
            .then(
                (result) => {
                    if (result.error) {
                        console.log("RequestData:On error return: setting empty")
                        setEmployeesData({ data: [] });
                    }
                    else {
                        setEmployeesData(result);
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setEmployeesData({ data: [] });
                    console.log("RequestData:On JUST error: API call failed")
                    setApiLoading(false);
                }
            )
    }
    const handleEmployeeIdChange = (event) => {
        setEmployeeId(event.target.value);
    };

    useEffect(() => {
        if (operation === "View" || operation === "Edit") {
            getDetails();
        }
        if (operation === "New") {
            getCompaniesList();
            getVendorsList();
            getIPsList();
            getClientsList();
            getEmployeesList();
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
                    <div className="spinner"></div>Loading...
                </>
                :
                <Formik
                    enableReinitialize
                    initialValues={{
                        Id: name ? ID : 'This will be auto-generated once you save',
                        jobName: name ? data.data[0].jobName : '',
                        companyId: name ? data.data[0].companyId : '',
                        employeeId: name ? data.data[0].employeeId : '',
                        vendorId: name ? data.data[0].vendorId : '',
                        implementationPartnerId: name ? data.data[0].implementationPartnerId : '',
                        clientId: name ? data.data[0].clientId : '',
                        rate: name ? data.data[0].rate : '',
                        deductionPercentage: name ? data.data[0].deductionPercentage : '',
                        deductionFlat: name ? data.data[0].deductionFlat : '',
                        jobTitle: name ? data.data[0].jobTitle : '',
                        jobStartDate: name ? data.data[0].jobStartDate : '',
                        jobEndDate: name ? data.data[0].jobEndDate : '',
                        timesheetsPeriod: name ? data.data[0].timesheetsPeriod : '',
                        invoicePeriod: name ? data.data[0].invoicePeriod : '',
                        notes: name ? data.data[0].notes : '',
                        createdBy: userName,
                    }}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                        var finalAPI = APIPath + "/addjob";
                        if (operation === "Edit") {
                            finalAPI = APIPath + "/updatejob";
                        }
                        setSubmitionCompleted(false);
                        setSubmitting(true);
                        axios.post(finalAPI,
                            values,
                            {
                                headers: {
                                    'Access-Control-Allow-Origin': '*',
                                    'Content-Type': 'application/json',
                                }
                            },
                        ).then((resp) => {
                            setSubmitting(false);
                            setSubmitionCompleted(true);
                            if (resp.data.STATUS === "FAIL")
                                showSnackbar('error', "Error saving Job data");
                            else
                                showSnackbar('success', "Job data saved");
                            resetForm();
                        }).catch(function (error) {
                            setSubmitting(false);
                            console.log(error);
                            setSubmitionCompleted(true);
                            showSnackbar('error', "Error saving Job data");
                        });
                    }}

                    validationSchema={Yup.object().shape({
                        jobName: Yup.string()
                            .required('jobName Required'),
                        companyId: Yup.string()
                            .required('company name Required'),
                        employeeId: Yup.string()
                            .required('employee name Required'),
                        clientId: Yup.string()
                            .required('client name Required'),
                        implementationPartnerId: Yup.string()
                            .required('implementation Partner name Required'),
                        rate: Yup.number()
                            .typeError('Must be a number')
                            .required('rate Required').test('is-decimal', 'Must be a decimal number', (value) =>
                                (value + "").match(/^\d+(\.\d+)?$/)
                            ),
                        deductionPercentage: Yup.number()
                            .typeError('Must be a number')
                            .required('deductionPercentage Required').test('is-decimal', 'Must be a decimal number', (value) =>
                                (value + "").match(/^\d+(\.\d+)?$/)
                            ),
                        deductionFlat: Yup.number()
                            .typeError('Must be a number')
                            .required('deductionFlat Required').test('is-decimal', 'Must be a decimal number', (value) =>
                                (value + "").match(/^\d+(\.\d+)?$/)
                            ),
                        jobTitle: Yup.string()
                            .required('job Title (Role) Required'),
                        jobStartDate: Yup.string()
                            .required('jobStartDate Required'),
                        // jobEndDate: Yup.string()
                        //     .required('jobEndDate Required'),
                        timesheetsPeriod: Yup.string()
                            .required('Timesheet Collection Required'),
                        invoicePeriod: Yup.string()
                            .required('Invoice frequency Required'),
                        notes: Yup.string()
                            .required('notes Required'),
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
                            <form onSubmit={handleSubmit}>
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
                                <Stack direction="row" spacing={2} className='mt-4'>
                                    <TextField
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        id="companyId"
                                        name="companyId"
                                        select
                                        label="Company Name"
                                        value={values.companyId}
                                        onChange={handleChange}
                                        // onChange={(event) => {
                                        //     handleChange(event);
                                        //     //handleCompanyIdChange(event);
                                        // }}
                                        onBlur={handleBlur}
                                        helperText={(errors.companyId && touched.companyId) && errors.companyId}
                                    >
                                        {companiesData.data.map((item, index) => (
                                            <MenuItem key={index} value={item.Id}>
                                                {item.Name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                    <TextField
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        id="vendorId"
                                        name="vendorId"
                                        select
                                        label="Vendor Name"
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
                                </Stack>
                                <Stack direction="row" spacing={2} className='mt-6'>
                                    <TextField
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        id="implementationPartnerId"
                                        name="implementationPartnerId"
                                        select
                                        label="Implementation Partner Name"
                                        value={values.implementationPartnerId}
                                        onChange={(event) => {
                                            handleChange(event);
                                            handleIPIdChange(event);
                                        }}
                                        onBlur={handleBlur}
                                        helperText={(errors.implementationPartnerId && touched.implementationPartnerId) && errors.implementationPartnerId}
                                    >
                                        {iPsData.data.map((item, index) => (
                                            <MenuItem key={index} value={item.Id}>
                                                {item.Name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                    <TextField
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        id="clientId"
                                        name="clientId"
                                        select
                                        label="Client Name"
                                        value={values.clientId}
                                        onChange={(event) => {
                                            handleChange(event);
                                            handleClientIdChange(event);
                                        }}
                                        onBlur={handleBlur}
                                        helperText={(errors.clientId && touched.clientId) && errors.clientId}
                                    >
                                        {clientsData.data.map((item, index) => (
                                            <MenuItem key={index} value={item.Id}>
                                                {item.Name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Stack>
                                <TextField
                                    size="small"
                                    margin="normal"
                                    fullWidth
                                    id="employeeId"
                                    name="employeeId"
                                    select
                                    label="Employee ID - Employee Name - Employee Type"
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
                                <TextField
                                    size="small"
                                    margin="normal"
                                    fullWidth
                                    id="jobName"
                                    name="jobName"
                                    label="Job Name (Example: Client name - Vendor Name)"
                                    value={values.jobName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    helperText={(errors.jobName && touched.jobName) && errors.jobName}
                                />
                                <TextField
                                    size="small"
                                    margin="normal"
                                    fullWidth
                                    id="rate"
                                    name="rate"
                                    label="Rate"
                                    value={values.rate}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    helperText={(errors.rate && touched.rate) && errors.rate}
                                />
                                <Stack direction="row" spacing={2} className='mt-4'>
                                    <TextField
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        id="deductionPercentage"
                                        name="deductionPercentage"
                                        label="Deduction Percentage"
                                        value={values.deductionPercentage}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        helperText={(errors.deductionPercentage && touched.deductionPercentage) && errors.deductionPercentage}
                                    />
                                    <TextField
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        id="deductionFlat"
                                        name="deductionFlat"
                                        label="Deduction Flat (make this zero if above % is entered)"
                                        value={values.deductionFlat}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        helperText={(errors.deductionFlat && touched.deductionFlat) && errors.deductionFlat}
                                    />
                                </Stack>
                                <TextField
                                    size="small"
                                    margin="normal"
                                    fullWidth
                                    id="jobTitle"
                                    name="jobTitle"
                                    label="Job Title (Role)"
                                    value={values.jobTitle}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    helperText={(errors.jobTitle && touched.jobTitle) && errors.jobTitle}
                                />
                                <Stack direction="row" spacing={2} className="flex items-center pl-2 mt-4">

                                    <div className='flex-1'>Job Start Date:
                                        {ID ?
                                            <span className='px-2 bg-gray-500 mx-2 text-white'>{values.jobStartDate}</span>
                                            : <></>
                                        }
                                    </div>
                                    <TextField
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        className='flex-1'
                                        id="jobStartDate"
                                        name="jobStartDate"
                                        type="date"
                                        value={values.jobStartDate}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        helperText={(errors.jobStartDate && touched.jobStartDate) && errors.jobStartDate}
                                    />
                                </Stack>
                                <Stack direction="row" spacing={2} className="flex items-center pl-2 mt-6">

                                    <div className='flex-1'>Job End Date:
                                        {ID ?
                                            <span className='px-2 bg-gray-500 mx-2 text-white'>{values.jobEndDate}</span>
                                            : <></>
                                        }
                                    </div>
                                    <TextField
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        className='flex-1'
                                        id="jobEndDate"
                                        name="jobEndDate"
                                        type="date"
                                        value={values.jobEndDate}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        helperText={(errors.jobEndDate && touched.jobEndDate) && errors.jobEndDate}
                                    />
                                </Stack>
                                <Stack direction="row" spacing={2} className='mt-8'>
                                    <TextField
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        id="timesheetsPeriod"
                                        name="timesheetsPeriod"
                                        select
                                        label="Timesheet Collection"
                                        value={values.timesheetsPeriod}
                                        onChange={(event) => {
                                            handleChange(event);
                                        }}
                                        onBlur={handleBlur}
                                        helperText={(errors.timesheetsPeriod && touched.timesheetsPeriod) && errors.timesheetsPeriod}
                                    >
                                        {configData.timesheetsPeriods.map((item, index) => (
                                            <MenuItem key={index} value={item.name}>
                                                {item.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                    <TextField
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        id="invoicePeriod"
                                        name="invoicePeriod"
                                        select
                                        label="Invoice Frequency"
                                        value={values.invoicePeriod}
                                        onChange={(event) => {
                                            handleChange(event);
                                        }}
                                        onBlur={handleBlur}
                                        helperText={(errors.invoicePeriod && touched.invoicePeriod) && errors.invoicePeriod}
                                    >
                                        {configData.invoicePeriods.map((item, index) => (
                                            <MenuItem key={index} value={item.name}>
                                                {item.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Stack>
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
                                <Stack direction="row" spacing={2} className='float-right'>
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

export default Job;