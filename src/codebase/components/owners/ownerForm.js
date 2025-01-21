import React, { useState, useContext, useRef, useEffect } from 'react';
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

function OwnerForm({ props, ID, operation }) {
    const { APIPath } = useContext(Context);
    const [isSubmitionCompleted, setSubmitionCompleted] = useState(false);
    const resetButtonRef = useRef(null);
    const [data, setData] = useState({ data: [] });
    const [fileTypesData, setFileTypesData] = useState({ data: [] });
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

    const getDetails = () => {
        setApiLoading(true);
        let apiUrl = APIPath + "/getownerdetails/" + ID;
        // console.log(apiUrl)
        fetch(apiUrl)
            .then(response => response.json())
            .then(
                (result) => {
                    //// console.log(result);
                    if (result.error) {
                        // console.log("RequestData:On error return: setting empty")
                        setData({});
                    }
                    else {
                        setData(result);
                        setFirstName(result.data[0].firstName);
                        //alert(firstName);
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
    const getFileTypesList = () => {
        setApiLoading(true);
        setFileTypesData({ data: [] });
        let apiUrl = APIPath + "/masterdata/filetypes"
        fetch(apiUrl)
            .then(response => response.json())
            .then(
                (result) => {
                    //// console.log(result);
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
    useEffect(() => {
        if (operation === "View" || operation === "Edit") {
            getDetails();
        }
        if (operation === "New" || operation === "Edit") {
            getFileTypesList();
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
                        email: firstName ? data.data[0].email : '',
                        phone1: firstName ? data.data[0].phone1 : '',
                        phone2: firstName ? data.data[0].phone2 : '',
                        IDType: firstName ? data.data[0].IDType : '',
                        IDNumber: firstName ? data.data[0].IDNumber : '',
                        SSN: firstName ? data.data[0].SSN : '',
                        Address: firstName ? data.data[0].Address : '',
                        Disabled: firstName ? data.data[0].Disabled : false,
                    }}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                        var finalAPI = APIPath + "/addowner";
                        if (operation === "Edit") {
                            finalAPI = APIPath + "/updateowner";
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
                                showSnackbar('error', "Error saving Owner data");
                            else
                                showSnackbar('success', "Owner data saved");
                                resetForm();
                        }).catch(function (error) {
                            setSubmitting(false);
                            // console.log(error);
                            setSubmitionCompleted(true);
                            showSnackbar('error', "Error saving Owner data");
                        });
                    }}

                    validationSchema={Yup.object().shape({
                        firstName: Yup.string()
                            .required('firstName Required'),
                        lastName: Yup.string()
                            .required('lastName Required'),
                        email: Yup.string()
                            .email()
                            .required('email Required'),
                        phone1: Yup.string()
                            .required('phone1 Required'),
                        IDNumber: Yup.string()
                            .required('IDNumber Required'),
                        SSN: Yup.string()
                            .required('SSN Required'),
                        Address: Yup.string()
                            .required('Address Required'),
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
                                    id="email"
                                    name="email"
                                    label="Email"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    helperText={(errors.email && touched.email) && errors.email}
                                />
                                <Stack direction="row" spacing={2} className='mt-2'>
                                    <TextField
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        id="phone1"
                                        name="phone1"
                                        label="Phone 1"
                                        value={values.phone1}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        helperText={(errors.phone1 && touched.phone1) && errors.phone1}
                                    />
                                    <TextField
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        id="phone2"
                                        name="phone2"
                                        label="Phone 2"
                                        value={values.phone2}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        helperText={(errors.phone2 && touched.phone2) && errors.phone2}
                                    />
                                </Stack>
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
                                    id="Address"
                                    name="Address"
                                    label="Address"
                                    multiline
                                    rows={2}
                                    value={values.Address}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    helperText={(errors.Address && touched.Address) && errors.Address}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            id="Disabled"
                                            name="Disabled"
                                            label="Disabled"
                                            // value={values.Disabled}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            // helperText={(errors.Disabled && touched.Disabled) && errors.Disabled}
                                            checked={values.Disabled} />
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

export default OwnerForm;