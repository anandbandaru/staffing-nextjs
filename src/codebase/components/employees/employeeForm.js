import React, { useState, useContext, useRef, useEffect } from 'react';
import configData from "../../../CONFIG_RELEASE.json";
import { Context } from "../../context/context";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import MenuItem from '@mui/material/MenuItem';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import Stack from '@mui/material/Stack';
import CustomSnackbar from "../snackbar/snackbar";
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import FormSlider from '../slider/formSlider';

function EmployeeForm({ props, ID, operation }) {
    const { APIPath, userName } = useContext(Context);
    const [isSubmitionCompleted, setSubmitionCompleted] = useState(false);
    const resetButtonRef = useRef(null);
    const [data, setData] = useState({ data: [] });
    const [fileTypesData, setFileTypesData] = useState({ data: [] });
    const [managersData, setManagersData] = useState({ data: [] });
    const [firstName, setFirstName] = useState('');
    const [apiLoading, setApiLoading] = useState(false);
    // Default width
    const [formWidth, setFormWidth] = useState(700);
    const handleSliderChange = (event, newValue) => {
        setFormWidth(newValue);
    };

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

    const getDetails = async () => {
        setApiLoading(true);
        let apiUrl = APIPath + "/getemployeedetails/" + ID;
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
                        setFirstName(result.data[0].firstName);
                        await getFileTypesList();
                        await getManagersList();
                        setData(result);
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
    const getFileTypesList = async () => {
        setApiLoading(true);
        setFileTypesData({ data: [] });
        let apiUrl = APIPath + "/masterdata/filetypes"
        // console.log(apiUrl)
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
                        setFileTypesData({});
                    }
                    else {
                        setFileTypesData(result);
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setFileTypesData({});
                    // console.log("RequestData:On JUST error: API call failed")
                    setApiLoading(false);
                }
            )
    }
    const getManagersList = async () => {
        setApiLoading(true);
        setFileTypesData({ data: [] });
        let apiUrl = APIPath + "/getemployees"
        // console.log(apiUrl)
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
                        setManagersData({});
                    }
                    else {
                        setManagersData(result);
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setManagersData({});
                    // console.log("RequestData:On JUST error: API call failed")
                    setApiLoading(false);
                }
            )
    }
    useEffect(() => {
        if (operation === "View" || operation === "Edit") {
            getDetails();
        }
        if (operation === "New") {
            getFileTypesList();
            getManagersList();
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
            {apiLoading && operation !== "New" ?
                <>
                    <div className="spinner"></div>
                </>
                :
                <Formik
                    initialValues={{
                        Id: firstName ? ID : 'This will be auto-generated once you save',
                        firstName: firstName ? data.data[0].firstName : '',
                        lastName: firstName ? data.data[0].lastName : '',
                        personalEmail: firstName ? data.data[0].personalEmail : '',
                        personalPhone: firstName ? data.data[0].personalPhone : '',
                        personalUSPhone: firstName ? data.data[0].personalUSPhone : '',
                        address: firstName ? data.data[0].address : '',
                        employeeType: firstName ? data.data[0].employeeType : '',
                        OFF_PAN: firstName ? data.data[0].OFF_PAN : '',
                        OFF_Designation: firstName ? data.data[0].OFF_Designation : '',
                        OFF_Aadhaar: firstName ? data.data[0].OFF_Aadhaar : '',
                        OFF_SonOf: firstName ? data.data[0].OFF_SonOf : '',
                        OFF_DaughterOf: firstName ? data.data[0].OFF_DaughterOf : '',
                        OFF_WifeOf: firstName ? data.data[0].OFF_WifeOf : '',
                        OFF_ManagerID: firstName ? data.data[0].OFF_ManagerID : '',
                        IDType: firstName ? data.data[0].IDType : '',
                        IDNumber: firstName ? data.data[0].IDNumber : '',
                        SSN: firstName ? data.data[0].SSN : '',
                        notes: firstName ? data.data[0].notes : '',
                        disabled: firstName ? data.data[0].disabled : false,
                        isCitizen: firstName ? data.data[0].isCitizen : '0',
                        citizenIDType: firstName ? data.data[0].citizenIDType : '',
                        citizenIDNumber: firstName ? data.data[0].citizenIDNumber : '',
                        nonCitizenIDType: firstName ? data.data[0].nonCitizenIDType : '',
                        nonCitizenIDNumber: firstName ? data.data[0].nonCitizenIDNumber : '',
                        applicationEmail: firstName ? data.data[0].applicationEmail : '',
                        createdBy: userName,
                    }}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                        var finalAPI = APIPath + "/addemployee";
                        if (operation === "Edit") {
                            finalAPI = APIPath + "/updateemployee";
                        }
                        setSubmitionCompleted(false);
                        setSubmitting(true);
                        axios.post(finalAPI,
                            values,
                            {
                                headers: {
                                    'Access-Control-Allow-Origin': '*',
                                    'Content-Type': 'application/json',
                                    'ngrok-skip-browser-warning': 'true',
                                }
                            },
                        ).then((resp) => {
                            setSubmitting(false);
                            setSubmitionCompleted(true);
                            if (resp.data.STATUS === "FAIL")
                                showSnackbar('error', "Error saving Employee data");
                            else
                                showSnackbar('success', "Employee data saved");
                            resetForm();
                        }).catch(function (error) {
                            setSubmitting(false);
                            // console.log(error);
                            setSubmitionCompleted(true);
                            showSnackbar('error', "Error saving Employee data");
                        });
                    }}
                    validationSchema={Yup.object().shape({
                        applicationEmail: Yup.string()
                            .email()
                            .matches(/^[a-zA-Z0-9._%+-]+@vsksoftwareoutlook\.onmicrosoft\.com$/, 'Invalid email format: xxxxx@vsksoftwareoutlook.onmicrosoft.com')
                            .required('Application Login Email is Required'),
                        firstName: Yup.string()
                            .required('firstName Required'),
                        lastName: Yup.string()
                            .required('lastName Required'),
                        personalEmail: Yup.string()
                            .email()
                            .required('personalEmail Required'),
                        personalUSPhone: Yup.string()
                            .required('personalUSPhone Required'),
                        employeeType: Yup.string()
                            .required('employeeType Required'),
                        isCitizen: Yup.string().when("employeeType", {
                            is: 'ONSHORE',
                            then: () => Yup.string()
                                .required("Is Citizen Required")
                        }),
                        citizenIDType: Yup.string().when(["isCitizen", "employeeType"], {
                            is: (isCitizen, employeeType) => isCitizen === '1' && employeeType === 'ONSHORE',
                            then: () => Yup.string()
                                .required("citizen ID Type Required"),
                            otherwise: () => Yup.string().nullable()
                        }),
                        citizenIDNumber: Yup.string().when(["isCitizen", "employeeType"], {
                            is: (isCitizen, employeeType) => isCitizen === '1' && employeeType === 'ONSHORE',
                            then: () => Yup.string()
                                .required("citizen ID Number Required"),
                            otherwise: () => Yup.string().nullable()
                        }),
                        nonCitizenIDType: Yup.string().when(["isCitizen", "employeeType"], {
                            is: (isCitizen, employeeType) => isCitizen === '0' && employeeType === 'ONSHORE',
                            then: () => Yup.string()
                                .required("non Citizen ID Type Required"),
                            otherwise: () => Yup.string().nullable()
                        }),
                        nonCitizenIDNumber: Yup.string().when(["isCitizen", "employeeType"], {
                            is: (isCitizen, employeeType) => isCitizen === '0' && employeeType === 'ONSHORE',
                            then: () => Yup.string()
                                .required("non Citizen ID Number Required"),
                            otherwise: () => Yup.string().nullable()
                        }),
                        OFF_PAN: Yup.string().when("employeeType", {
                            is: 'OFFSHORE',
                            then: () => Yup.string()
                                .required("OFF_PAN Required")
                        }),
                        OFF_Designation: Yup.string().when("employeeType", {
                            is: 'OFFSHORE',
                            then: () => Yup.string()
                                .required("OFF_Designation Required")
                        }),
                        OFF_Aadhaar: Yup.string().when("employeeType", {
                            is: 'OFFSHORE',
                            then: () => Yup.string()
                                .required("OFF_Aadhaar Required")
                        }),
                        OFF_SonOf: Yup.string().when("employeeType", {
                            is: 'OFFSHORE',
                            then: () => Yup.string()
                                .required("OFF_SonOf Required")
                        }),
                        OFF_DaughterOf: Yup.string().when("employeeType", {
                            is: 'OFFSHORE',
                            then: () => Yup.string()
                                .required("OFF_DaughterOf Required")
                        }),
                        OFF_WifeOf: Yup.string().when("employeeType", {
                            is: 'OFFSHORE',
                            then: () => Yup.string()
                                .required("OFF_WifeOf Required")
                        }),
                        OFF_ManagerID: Yup.string().when("employeeType", {
                            is: 'OFFSHORE',
                            then: () => Yup.string()
                                .required("OFF_ManagerID Required")
                        }),
                        IDType: Yup.string()
                            .required('IDType Required'),
                        IDNumber: Yup.string()
                            .required('IDNumber Required'),
                        SSN: Yup.string().when("employeeType", {
                            is: 'ONSHORE',
                            then: () => Yup.string()
                                .required("SSN Required")
                        }),
                        address: Yup.string()
                            .required('address Required'),
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
                                <TextField
                                    size="small"
                                    margin="normal"
                                    fullWidth
                                    id="applicationEmail"
                                    name="applicationEmail"
                                    label="Application Login Email (this would be in format xxxx@vsksoftwareoutlook.onmicrosoft.com)"
                                    color="secondary"
                                    value={values.applicationEmail}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    helperText={(errors.applicationEmail && touched.applicationEmail) && errors.applicationEmail}
                                />
                                <Stack direction="row" spacing={2} className='mt-2'>
                                    <TextField
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        id="firstName"
                                        name="firstName"
                                        label="First Name"
                                        value={values.firstName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        helperText={(errors.firstName && touched.firstName) && errors.firstName}
                                    />
                                    <TextField
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        id="lastName"
                                        name="lastName"
                                        label="Last Name"
                                        value={values.lastName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        helperText={(errors.lastName && touched.lastName) && errors.lastName}
                                    />
                                </Stack>
                                <TextField
                                    size="small"
                                    margin="normal"
                                    fullWidth
                                    id="employeeType"
                                    name="employeeType"
                                    select
                                    label="Employee Type"
                                    value={values.employeeType}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    helperText={(errors.employeeType && touched.employeeType) && errors.employeeType}
                                >
                                    {configData.employeeTypes.map((item, index) => (
                                        <MenuItem key={index} value={item.name}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <TextField
                                    size="small"
                                    margin="normal"
                                    fullWidth
                                    id="personalEmail"
                                    name="personalEmail"
                                    label="Personal Email"
                                    value={values.personalEmail}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    helperText={(errors.personalEmail && touched.personalEmail) && errors.personalEmail}
                                />
                                <Stack direction="row" spacing={2} className='mt-2'>
                                    <TextField
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        id="personalUSPhone"
                                        name="personalUSPhone"
                                        label="Personal US Phone"
                                        value={values.personalUSPhone}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        helperText={(errors.personalUSPhone && touched.personalUSPhone) && errors.personalUSPhone}
                                    />
                                    <TextField
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        id="personalPhone"
                                        name="personalPhone"
                                        label="Personal Phone"
                                        value={values.personalPhone}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        helperText={(errors.personalPhone && touched.personalPhone) && errors.personalPhone}
                                    />
                                </Stack>
                                {values.employeeType === 'ONSHORE' && (
                                    <div className="error-summary bg-blue-200 my-4 p-2 text-white rounded-md">
                                        <div className='text-black my-1'>
                                            ONSHORE employee Specific details:
                                        </div>
                                        <TextField
                                            size="small"
                                            margin="normal"
                                            fullWidth
                                            id="isCitizen"
                                            name="isCitizen"
                                            select
                                            label="Citizen"
                                            value={values.isCitizen}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            helperText={(errors.isCitizen && touched.isCitizen) && errors.isCitizen}
                                        >
                                            <MenuItem value="0">
                                                No
                                            </MenuItem>
                                            <MenuItem value="1">
                                                Yes
                                            </MenuItem>
                                        </TextField>

                                        {(values.isCitizen === '1' || values.employeeType === 'ONSHORE') && (
                                            <Stack direction="row" spacing={2} className='mt-2'>
                                                <TextField
                                                    size="small"
                                                    margin="normal"
                                                    fullWidth
                                                    id="citizenIDType"
                                                    name="citizenIDType"
                                                    select
                                                    label="Citizen ID Type"
                                                    value={values.citizenIDType}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    helperText={(errors.citizenIDType && touched.citizenIDType) && errors.citizenIDType}
                                                >
                                                    {configData.citizenIdTypes.map((item, index) => (
                                                        <MenuItem key={index} value={item.name}>
                                                            {item.name}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                                <TextField
                                                    size="small"
                                                    margin="normal"
                                                    fullWidth
                                                    id="citizenIDNumber"
                                                    name="citizenIDNumber"
                                                    label="Citizen ID Number"
                                                    value={values.citizenIDNumber}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    helperText={(errors.citizenIDNumber && touched.citizenIDNumber) && errors.citizenIDNumber}
                                                />
                                            </Stack>
                                        )}

                                        {(values.isCitizen === '0' || values.employeeType === 'ONSHORE') && (
                                            <Stack direction="row" spacing={2} className='mt-6'>
                                                <TextField
                                                    size="small"
                                                    margin="normal"
                                                    fullWidth
                                                    id="nonCitizenIDType"
                                                    name="nonCitizenIDType"
                                                    select
                                                    label="Non-Citizen ID Type"
                                                    value={values.nonCitizenIDType}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    helperText={(errors.nonCitizenIDType && touched.nonCitizenIDType) && errors.nonCitizenIDType}
                                                >
                                                    {configData.nonCitizenIdTypes.map((item, index) => (
                                                        <MenuItem key={index} value={item.name}>
                                                            {item.name}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                                <TextField
                                                    size="small"
                                                    margin="normal"
                                                    fullWidth
                                                    id="nonCitizenIDNumber"
                                                    name="nonCitizenIDNumber"
                                                    label="Non-Citizen ID Number"
                                                    value={values.nonCitizenIDNumber}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    helperText={(errors.nonCitizenIDNumber && touched.nonCitizenIDNumber) && errors.nonCitizenIDNumber}
                                                />
                                            </Stack>
                                        )}
                                    </div>
                                )}
                                {values.employeeType === 'OFFSHORE' && (
                                    <div className="error-summary bg-blue-200 my-4 p-2 text-white rounded-md">
                                        <div className='text-black my-1'>
                                            OFFSHORE employee Specific details:
                                        </div>
                                        <Stack direction="row" spacing={2} className='mt-2'>
                                            <TextField
                                                size="small"
                                                margin="normal"
                                                fullWidth
                                                id="OFF_PAN"
                                                name="OFF_PAN"
                                                label="OFFSHORE PAN"
                                                value={values.OFF_PAN}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                helperText={(errors.OFF_PAN && touched.OFF_PAN) && errors.OFF_PAN}
                                            />
                                            <TextField
                                                size="small"
                                                margin="normal"
                                                fullWidth
                                                id="OFF_Designation"
                                                name="OFF_Designation"
                                                label="OFFSHORE Designation"
                                                value={values.OFF_Designation}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                helperText={(errors.OFF_Designation && touched.OFF_Designation) && errors.OFF_Designation}
                                            />
                                        </Stack>
                                        <Stack direction="row" spacing={2} className='mt-2'>
                                            <TextField
                                                size="small"
                                                margin="normal"
                                                fullWidth
                                                id="OFF_Aadhaar"
                                                name="OFF_Aadhaar"
                                                label="OFFSHORE Aadhaar"
                                                value={values.OFF_Aadhaar}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                helperText={(errors.OFF_Aadhaar && touched.OFF_Aadhaar) && errors.OFF_Aadhaar}
                                            />
                                            <TextField
                                                size="small"
                                                margin="normal"
                                                fullWidth
                                                id="OFF_SonOf"
                                                name="OFF_SonOf"
                                                label="OFFSHORE Son Of"
                                                value={values.OFF_SonOf}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                helperText={(errors.OFF_SonOf && touched.OFF_SonOf) && errors.OFF_SonOf}
                                            />
                                        </Stack>
                                        <Stack direction="row" spacing={2} className='mt-2'>
                                            <TextField
                                                size="small"
                                                margin="normal"
                                                fullWidth
                                                id="OFF_DaughterOf"
                                                name="OFF_DaughterOf"
                                                label="OFFSHORE Daughter Of"
                                                value={values.OFF_DaughterOf}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                helperText={(errors.OFF_DaughterOf && touched.OFF_DaughterOf) && errors.OFF_DaughterOf}
                                            />
                                            <TextField
                                                size="small"
                                                margin="normal"
                                                fullWidth
                                                id="OFF_WifeOf"
                                                name="OFF_WifeOf"
                                                label="OFFSHORE Wife Of"
                                                value={values.OFF_WifeOf}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                helperText={(errors.OFF_WifeOf && touched.OFF_WifeOf) && errors.OFF_WifeOf}
                                            />
                                        </Stack>
                                        <TextField
                                            size="small"
                                            margin="normal"
                                            fullWidth
                                            id="OFF_ManagerID"
                                            name="OFF_ManagerID"
                                            select
                                            label="Offshore Manager ID"
                                            value={values.OFF_ManagerID}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            helperText={(errors.OFF_ManagerID && touched.OFF_ManagerID) && errors.OFF_ManagerID}
                                        >
                                            {managersData ? managersData.data.map((item, index) => (
                                                <MenuItem key={index} value={item.Id}>
                                                    {item.fistName} {item.lastName}
                                                </MenuItem>
                                            )) : []}
                                        </TextField>
                                    </div>
                                )}
                                <Stack direction="row" spacing={2} className='mt-6'>
                                    <TextField
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        id="IDType"
                                        name="IDType"
                                        select
                                        label="ID Type"
                                        defaultValue="12"
                                        value={values.IDType}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        helperText={(errors.IDType && touched.IDType) && errors.IDType}
                                    >
                                        {fileTypesData.data.map((item, index) => (
                                            <MenuItem key={index} value={item.Id}>
                                                {item.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                    <TextField
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        id="IDNumber"
                                        name="IDNumber"
                                        label="ID Number"
                                        value={values.IDNumber}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        helperText={(errors.IDNumber && touched.IDNumber) && errors.IDNumber}
                                    />
                                </Stack>
                                {values.employeeType === 'ONSHORE' && (
                                    <TextField
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        id="SSN"
                                        name="SSN"
                                        label="SSN"
                                        value={values.SSN}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        helperText={(errors.SSN && touched.SSN) && errors.SSN}
                                    />
                                )}
                                <TextField
                                    size="small"
                                    margin="normal"
                                    fullWidth
                                    id="address"
                                    name="address"
                                    label="Address"
                                    multiline
                                    rows={4}
                                    value={values.address}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    helperText={(errors.address && touched.address) && errors.address}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            id="disabled"
                                            name="disabled"
                                            label="Disabled"
                                            // value={values.Disabled}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            // helperText={(errors.Disabled && touched.Disabled) && errors.Disabled}
                                            checked={values.disabled} />
                                    }
                                    label="Disabled"
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

export default EmployeeForm;