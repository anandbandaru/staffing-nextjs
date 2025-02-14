import React, { useState, useContext, useRef, useEffect } from 'react';
import configData from "../../../CONFIG_RELEASE.json";
import { Context } from "../../context/context";
import Button from '@mui/material/Button';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import Stack from '@mui/material/Stack';
import CustomSnackbar from "../snackbar/snackbar";
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Autocomplete, TextField, MenuItem } from '@mui/material';
import JobRatesList from './jobRatesList'
import FormSlider from '../slider/formSlider';

function Job({ props, ID, operation }) {
    const { APIPath, userName, userType } = useContext(Context);
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
                    // console.log("RequestData:On JUST error: API call failed")
                    setApiLoading(false);
                }
            )
    }

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
                (result) => {
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

    const getVendorsList = async () => {
        setApiLoading(true);
        setVendorsData({ data: [] });
        let apiUrl = APIPath + "/getvendors"
        fetch(apiUrl, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
            }
        })
            .then(response => response.json())
            .then(
                (result) => {
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
    const handleVendorIdChange = (event) => {
        setVendorId(event.target.value);
    };

    const getIPsList = async () => {
        setApiLoading(true);
        setIPsData({ data: [] });
        let apiUrl = APIPath + "/getimplementationpartners"
        fetch(apiUrl, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
            }
        })
            .then(response => response.json())
            .then(
                (result) => {
                    if (result.error) {
                        // console.log("RequestData:On error return: setting empty")
                        setIPsData({ data: [] });
                    }
                    else {
                        setIPsData(result);
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setIPsData({ data: [] });
                    // console.log("RequestData:On JUST error: API call failed")
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
        fetch(apiUrl, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
            }
        })
            .then(response => response.json())
            .then(
                (result) => {
                    if (result.error) {
                        // console.log("RequestData:On error return: setting empty")
                        setClientsData({ data: [] });
                    }
                    else {
                        setClientsData(result);
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setClientsData({ data: [] });
                    // console.log("RequestData:On JUST error: API call failed")
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
        fetch(apiUrl, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
            }
        })
            .then(response => response.json())
            .then(
                (result) => {
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


    //FILE RELATED
    const [insertedJobId, setInsertedJobId] = useState(false);

    const [fileMSA, setFileMSA] = useState(null);
    const handleFileChangeMSAfile = (event) => {
        setFileMSA(event.target.files[0]);
    };
    const [filePO, setFilePO] = useState(null);
    const handleFileChangePOfile = (event) => {
        setFilePO(event.target.files[0]);
    };
    const [fileINS, setFileINS] = useState(null);
    const handleFileChangeINSfile = (event) => {
        setFileINS(event.target.files[0]);
    };

    const UploadJobFiles = async (file, fileName, componentName, moduleId, type) => {
        const formData = new FormData();
        formData.append('file', file);
        const parentFolderId = configData.GOOGLEDRIVE_FOLDERS.find(f => f.foldername === componentName).folderid;
        formData.append('parentfolderid', parentFolderId);
        formData.append('title', fileName);
        formData.append('createdBy', userName);
        formData.append('notes', fileName);
        formData.append('module', componentName);
        formData.append('moduleId', moduleId);

        try {
            const resp = await axios.post(APIPath + '/uploadfile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'ngrok-skip-browser-warning': 'true',
                },
            });

            if (resp.data.STATUS !== "SUCCESS") {
                throw new Error("ERROR: " + resp.data.ERROR.MESSAGE);
            } else {
                showSnackbar('success', type + ' - File uploaded successfully');
            }
        } catch (error) {
            showSnackbar('error', type + ' - Error while uploading: ' + error.message);
        }
    };

    function getCurrentDateTime() {
        const now = new Date();

        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        return `${month}-${day}-${year}-${hours}-${minutes}`;
    }

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
                        rate: name ? data.data[0].rate : '0',
                        deductionPercentage: name ? data.data[0].deductionPercentage : '0',
                        deductionFlat: name ? data.data[0].deductionFlat : '0',
                        jobTitle: name ? data.data[0].jobTitle : '',
                        jobStartDate: name ? data.data[0].jobStartDate : '',
                        jobEndDate: name ? data.data[0].jobEndDate : '',
                        timesheetsPeriod: name ? data.data[0].timesheetsPeriod : '',
                        invoicePeriod: name ? data.data[0].invoicePeriod : '',
                        notes: name ? data.data[0].notes : '',
                        notesRate: name ? data.data[0].notesRate : '',
                        createdBy: userName,
                    }}
                    onSubmit={async (values, { setSubmitting, resetForm }) => {
                        var finalAPI = APIPath + "/addjob";
                        if (operation === "Edit") {
                            finalAPI = APIPath + "/updatejob";
                        }
                        setSubmitionCompleted(false);
                        setSubmitting(true);
                        try {
                            const resp = await axios.post(finalAPI, values, {
                                headers: {
                                    'Access-Control-Allow-Origin': '*',
                                    'Content-Type': 'application/json',
                                    'ngrok-skip-browser-warning': 'true',
                                }
                            });
                            if (resp.data.STATUS === "FAIL") {
                                showSnackbar('error', "Error saving Job data");
                                setSubmitting(false);
                                setSubmitionCompleted(true);
                            } else {
                                setInsertedJobId(resp.data.RELATED_ID);

                                let insertedID = resp.data.RELATED_ID;
                                if (operation === "Edit")
                                    insertedID = ID;

                                let fileNameMSA = "MSA:JOB:" + insertedID + "_" + getCurrentDateTime();
                                let fileNamePO = "PO:JOB:" + insertedID + "_" + getCurrentDateTime();
                                let fileNameINS = "INSURANCE:JOB:" + insertedID + "_" + getCurrentDateTime();
                                if (fileMSA)
                                    await UploadJobFiles(fileMSA, fileNameMSA, 'JOBS', insertedID, "MSA");
                                if (filePO)
                                    await UploadJobFiles(filePO, fileNamePO, 'JOBS', insertedID, "PO");
                                if (fileINS)
                                    await UploadJobFiles(fileINS, fileNameINS, 'JOBS', insertedID, "INSURANCE");

                                setSubmitting(false);
                                setSubmitionCompleted(true);
                                showSnackbar('success', "Job data saved");
                                resetForm();
                            }
                        } catch (error) {
                            setSubmitting(false);
                            setSubmitionCompleted(true);
                            showSnackbar('error', "Error saving Job data");
                        }
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
                        rate: Yup.number().when(userType, {
                            is: 'ADMIN',
                            then: () => Yup.number()
                                .typeError('Must be a number')
                                .required('rate Required').test('is-decimal', 'Must be a decimal number', (value) =>
                                    (value + "").match(/^\d+(\.\d+)?$/)),
                            otherwise: () => Yup.number().nullable()
                        }),
                        deductionPercentage: Yup.number().when(userType, {
                            is: 'ADMIN',
                            then: () => Yup.number()
                                .typeError('Must be a number')
                                .required('deduction Percentage Required').test('is-decimal', 'Must be a decimal number', (value) =>
                                    (value + "").match(/^\d+(\.\d+)?$/)),
                            otherwise: () => Yup.number().nullable()
                        }),
                        deductionFlat: Yup.number().when(userType, {
                            is: 'ADMIN',
                            then: () => Yup.number()
                                .typeError('Must be a number')
                                .required('deduction Flat Required').test('is-decimal', 'Must be a decimal number', (value) =>
                                    (value + "").match(/^\d+(\.\d+)?$/)),
                            otherwise: () => Yup.number().nullable()
                        }),
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
                        notesRate: Yup.string().when(userType, {
                            is: 'ADMIN',
                            then: () => Yup.string()
                                .required('Rate notes Required'),
                            otherwise: () => Yup.string().nullable()
                        }),
                        MSAfile: Yup.string().when(operation, {
                            is: 'Edit',
                            then: () => Yup.string()
                                .required('MSA Document is required'),
                            otherwise: () => Yup.string().nullable()
                        }),
                        POfile: Yup.string().when(operation, {
                            is: 'Edit',
                            then: () => Yup.string()
                                .required('PO Document is required'),
                            otherwise: () => Yup.string().nullable()
                        }),
                        INSfile: Yup.string().when(operation, {
                            is: 'Edit',
                            then: () => Yup.string()
                                .required('Insurance Document is required'),
                            otherwise: () => Yup.string().nullable()
                        }),
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
                                <Autocomplete
                                    id="employeeId"
                                    options={employeesData.data}
                                    getOptionLabel={(option) => `${option.Id} - ${option.firstName} ${option.lastName} - ${option.employeeType}`}
                                    value={employeesData.data.find((item) => item.Id === values.employeeId) || null}
                                    onChange={(event, newValue) => {
                                        const fakeEvent = {
                                            target: {
                                                name: 'employeeId',
                                                value: newValue ? newValue.Id : '',
                                            },
                                        };
                                        handleChange(fakeEvent);
                                        handleEmployeeIdChange(fakeEvent);
                                    }}
                                    onBlur={handleBlur}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            size="small"
                                            margin="normal"
                                            fullWidth
                                            label="Employee ID - Employee Name - Employee Type"
                                            helperText={(errors.employeeId && touched.employeeId) && errors.employeeId}
                                        />
                                    )}
                                />
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

                                {(userType === "ADMIN" || userType === "OPERATOR") && (
                                    <div className='bg-blue-100 p-2 py-2 overflow-x-scroll'>
                                        <Tabs>
                                            <TabList className="formTabsListHolder">
                                                <Tab>Current Rate</Tab>
                                                {operation !== "New" && (
                                                    <Tab>Historical Rates</Tab>
                                                )}
                                            </TabList>

                                            <TabPanel className="px-2 py-4">
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
                                                    id="notesRate"
                                                    name="notesRate"
                                                    label="Rate Notes"
                                                    multiline
                                                    rows={2}
                                                    value={values.notesRate}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    helperText={(errors.notesRate && touched.notesRate) && errors.notesRate}
                                                />
                                            </TabPanel>
                                            {operation !== "New" && (
                                                <TabPanel className="px-2 py-1">
                                                    <JobRatesList ratesDate={data ? data.RATES : []} />
                                                </TabPanel>
                                            )}
                                        </Tabs>
                                    </div>
                                )}


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
                                <Stack direction="row" spacing={1} className='mb-6'>
                                    <div className='bg-orange-200 px-2'>MSA Document</div>
                                    <TextField
                                        className='bg-orange-100 text-white py-2 px-4 rounded-md hover:bg-blue-200 fileUploadControl'
                                        type="file"
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        id="MSAfile"
                                        name="MSAfile"
                                        disabled={isSubmitting}
                                        onChange={(event) => {
                                            handleChange(event);
                                            handleFileChangeMSAfile(event);
                                        }}
                                        onBlur={handleBlur}
                                        helperText={(errors.MSAfile && touched.MSAfile) && errors.MSAfile}
                                    />
                                </Stack>
                                <Stack direction="row" spacing={1} className='mb-6'>
                                    <div className='bg-orange-200 px-2'>PO Document</div>
                                    <TextField
                                        className='bg-orange-100 text-white py-2 px-4 rounded-md hover:bg-blue-200 fileUploadControl'
                                        type="file"
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        id="POfile"
                                        name="POfile"
                                        disabled={isSubmitting}
                                        onChange={(event) => {
                                            handleChange(event);
                                            handleFileChangePOfile(event);
                                        }}
                                        onBlur={handleBlur}
                                        helperText={(errors.POfile && touched.POfile) && errors.POfile}
                                    />
                                </Stack>
                                <Stack direction="row" spacing={1} className='mb-6'>
                                    <div className='bg-orange-200 px-2'>Insurance Document</div>
                                    <TextField
                                        className='bg-orange-100 text-white py-2 px-4 rounded-md hover:bg-blue-200 fileUploadControl'
                                        type="file"
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        id="INSfile"
                                        name="INSfile"
                                        disabled={isSubmitting}
                                        onChange={(event) => {
                                            handleChange(event);
                                            handleFileChangeINSfile(event);
                                        }}
                                        onBlur={handleBlur}
                                        helperText={(errors.INSfile && touched.INSfile) && errors.INSfile}
                                    />
                                </Stack>

                                {
                                    Object.keys(errors).length > 0 && (
                                        <div className="error-summary bg-red-500 my-4 p-2 text-white rounded-md">
                                            <span className='error-summary-heading' >Validation Errors:</span>
                                            <ul>
                                                {Object.keys(errors).map((key) => (
                                                    <li key={key}><KeyboardArrowRightOutlinedIcon />{errors[key]}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )
                                }
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
                </Formik >
            }

        </>
    );
}

export default Job;