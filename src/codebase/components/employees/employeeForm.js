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
import Chip from '@mui/material/Chip';
import CustomSnackbar from "../snackbar/snackbar";


function EmployeeForm({ props, ID, operation }) {
    const { APIPath, userName } = useContext(Context);
    const [isSubmitionCompleted, setSubmitionCompleted] = useState(false);
    const [formSubmitionAPIError, setFormSubmitionAPIError] = useState(false);
    const [formSubmitionAPIErrorMessage, setFormSubmitionAPIErrorMessage] = useState("");
    const resetButtonRef = useRef(null);
    const [data, setData] = useState({ data: [] });
    const [fileTypesData, setFileTypesData] = useState({ data: [] });
    const [managersData, setManagersData] = useState({ data: [] });
    const [firstName, setFirstName] = useState('');
    const [apiLoading, setApiLoading] = useState(false);
    const [apiLoadingError, setApiLoadingError] = useState(false);
    const [dataAPIError, setDataAPIError] = useState("");

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
        let apiUrl = APIPath + "/getemployeedetails/" + ID;
        console.log(apiUrl)
        fetch(apiUrl)
            .then(response => response.json())
            .then(
                (result) => {
                    //console.log(result);
                    if (result.error) {
                        console.log("RequestData:On error return: setting empty")
                        setDataAPIError(result.error.code + " - " + result.error.message);
                        setData({});
                        setApiLoadingError(true);
                    }
                    else {
                        setData(result);
                        setFirstName(result.data[0].firstName);
                        //alert(firstName);
                        setDataAPIError(result.total === 0 ? "No Employees information present." : "ok");
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setData({});
                    console.log("RequestData:On JUST error: API call failed")
                    setDataAPIError("RequestData:On JUST error: API call failed");
                    setApiLoading(false);
                    setApiLoadingError(true);
                }
            )
    }
    const getFileTypesList = () => {
        setApiLoading(true);
        setFileTypesData({ data: [] });
        let apiUrl = APIPath + "/masterdata/filetypes"
        fetch(apiUrl)
            .then(response => response.json())
            .then(
                (result) => {
                    //console.log(result);
                    if (result.error) {
                        console.log("RequestData:On error return: setting empty")
                        setDataAPIError(result.error.code + " - " + result.error.message);
                        setFileTypesData({});
                        setApiLoadingError(true);
                    }
                    else {
                        setFileTypesData(result);
                        setDataAPIError(result.total == 0 ? "No Owners information present." : "ok");
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setFileTypesData({});
                    console.log("RequestData:On JUST error: API call failed")
                    setDataAPIError("RequestData:On JUST error: API call failed");
                    setApiLoading(false);
                    setApiLoadingError(true);
                }
            )
    }
    const getManagersList = () => {
        setApiLoading(true);
        setFileTypesData({ data: [] });
        let apiUrl = APIPath + "/getemployees"
        fetch(apiUrl)
            .then(response => response.json())
            .then(
                (result) => {
                    //console.log(result);
                    if (result.error) {
                        console.log("RequestData:On error return: setting empty")
                        setDataAPIError(result.error.code + " - " + result.error.message);
                        setManagersData({});
                        setApiLoadingError(true);
                    }
                    else {
                        setManagersData(result);
                        setDataAPIError(result.total == 0 ? "No Employees information present." : "ok");
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setManagersData({});
                    console.log("RequestData:On JUST error: API call failed")
                    setDataAPIError("RequestData:On JUST error: API call failed");
                    setApiLoading(false);
                    setApiLoadingError(true);
                }
            )
    }
    useEffect(() => {
        if (operation === "View" || operation === "Edit") {
            getDetails();
        }
        if (operation === "New" || operation === "Edit") {
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
                    enableReinitialize
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
                        OFF_WifeOf: firstName ? data.data[0].OFF_WifeOf : '',
                        OFF_ManagerID: firstName ? data.data[0].OFF_ManagerID : '',
                        IDType: firstName ? data.data[0].IDType : '',
                        IDNumber: firstName ? data.data[0].IDNumber : '',
                        SSN: firstName ? data.data[0].SSN : '',
                        notes: firstName ? data.data[0].notes : '',
                        Disabled: firstName ? data.data[0].Disabled : false,
                        createdBy: userName,
                    }}
                    onSubmit={(values, { setSubmitting }) => {
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
                                }
                            },
                        ).then((resp) => {
                            setSubmitting(false);
                            setSubmitionCompleted(true);
                            setFormSubmitionAPIError(false);
                            showSnackbar('success', "Owner data saved");
                        }).catch(function (error) {
                            setSubmitting(false);
                            console.log(error);
                            setSubmitionCompleted(true);
                            setFormSubmitionAPIErrorMessage(error);
                            setFormSubmitionAPIError(true);
                            showSnackbar('error', "Error saving Owner data");
                        });
                    }}

                    validationSchema={Yup.object().shape({
                        firstName: Yup.string()
                            .required('Required'),
                        lastName: Yup.string()
                            .required('Required'),
                        IDNumber: Yup.string()
                            .required('Required'),
                            OFF_ManagerID: Yup.string()
                                .required('Required'),
                        SSN: Yup.string()
                            .required('Required'),
                        address: Yup.string()
                            .required('Required'),
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
                                    )): []}
                                </TextField>
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
                                    {isSubmitionCompleted && !formSubmitionAPIError ? (
                                        <Chip label="Data saved" color="success" />
                                    ) : (
                                        formSubmitionAPIError && <Chip label={formSubmitionAPIErrorMessage} color="error" />
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