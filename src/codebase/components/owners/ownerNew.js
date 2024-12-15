import React, { useState, useContext, useRef, useEffect } from 'react';
import { Context } from "../../context/context";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import {
    Formik
} from 'formik';
import * as Yup from 'yup';
// import { DisplayFormikState } from './formikHelper';
import axios from 'axios';
import MenuItem from '@mui/material/MenuItem';
import IDTypes from "../staticdata/idtypes";
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';

function OwnerNew({ props, ownerID, operation }) {
    const { APIPath } = useContext(Context);
    const [isSubmitionCompleted, setSubmitionCompleted] = useState(false);
    const [formSubmitionAPIError, setFormSubmitionAPIError] = useState(false);
    const [formSubmitionAPIErrorMessage, setFormSubmitionAPIErrorMessage] = useState("");
    const resetButtonRef = useRef(null);
    const [data, setData] = useState({ data: [] });
    const [firstName, setFirstName] = useState('');
    const [apiLoading, setApiLoading] = useState(true);
    const [apiLoadingError, setApiLoadingError] = useState(false);
    const [dataAPIError, setDataAPIError] = useState("");

    const getOwnerDetails = () => {
        let apiUrl = APIPath + "/getownerdetails/" + ownerID
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
                        setDataAPIError(result.total === 0 ? "No Owners information present." : "ok");
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
    useEffect(() => {
        if (operation === "View" || operation === "Edit") {
            getOwnerDetails();
        }
    }, [firstName]);

    return (
        <>
            {apiLoading && operation !== "New" ?
                <>
                    <div className="spinner"></div>
                </>
                :
                <Formik
                    enableReinitialize
                    initialValues={{
                        firstName: firstName ? data.data[0].firstName : '',
                        lastName: firstName ? data.data[0].lastName : '',
                        email: firstName ? data.data[0].email : '',
                        phone1: firstName ? data.data[0].phone1 : '',
                        phone2: firstName ? data.data[0].phone2 : '',
                        IDType: firstName ? data.data[0].IDType : '',
                        IDNumber: firstName ? data.data[0].IDNumber : '',
                        SSN: firstName ? data.data[0].SSN : '',
                        Address: firstName ? data.data[0].Address : '',
                        Disabled: firstName ? data.data[0].Disabled : '',
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        var finalAPI = APIPath + "/addOwner";
                        if (operation === "Edit") {
                            finalAPI = APIPath + "/updateOwner";
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
                            setSubmitionCompleted(true);
                            setFormSubmitionAPIError(false);
                            console.log("RESETTING NOW")
                            if (resetButtonRef.current) {
                                resetButtonRef.current.click();
                                console.log("RESETTING DONE")
                            }
                        })
                            .catch(function (error) {
                                console.log(error);
                                setSubmitionCompleted(true);
                                setFormSubmitionAPIErrorMessage(error);
                                setFormSubmitionAPIError(true);
                            });
                    }}

                    validationSchema={Yup.object().shape({
                        // firstName: Yup.string().required('Required').min(2, 'Should be of minimum 2 characters length'),
                        // lastName: Yup.string().required('Required').min(2, 'Should be of minimum 2 characters length'),
                        // email: Yup.string().email().required('Required'),
                        // phone1: Yup.string().required('Required').min(10, 'Should be of minimum 10 characters length'),
                        // IDNumber: Yup.string().required('Required').min(5, 'Should be of minimum 5 characters length'),
                        // Address: Yup.string().required('Required').min(8, 'Should be of minimum 8 characters length'),
                        firstName: Yup.string()
                            .required('Required'),
                        lastName: Yup.string()
                            .required('Required'),
                        email: Yup.string()
                            .email()
                            .required('Required'),
                        phone1: Yup.string()
                            .required('Required'),
                        IDNumber: Yup.string()
                            .required('Required'),
                        SSN: Yup.string()
                            .required('Required'),
                        Address: Yup.string()
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
                            handleReset,
                            setFieldValue
                        } = props;
                        return (
                            <form onSubmit={handleSubmit}>
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
                                    id="email"
                                    name="email"
                                    label="Email"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    helperText={(errors.email && touched.email) && errors.email}
                                />
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
                                    {IDTypes.map((item, index) => (
                                        <MenuItem key={index} value={item.value}>
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
                                    id="Address"
                                    name="Address"
                                    label="Address"
                                    multiline
                                    rows={4}
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
                                            value={values.Disabled}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            helperText={(errors.Disabled && touched.Disabled) && errors.Disabled}
                                            defaultChecked={values.Disabled} />
                                    }
                                    label="Disabled"
                                />
                                <Stack direction="row" spacing={2} className='float-right'>
                                    <div>
                                        {ownerID}:{operation}
                                    </div>
                                    {/* <Button variant="contained" color="secondary" disabled={isSubmitting && !isSubmitionCompleted}>Cancel</Button> */}

                                    {operation === "Edit" ?
                                        <Button color="primary" variant="contained" type="submit" disabled={isSubmitting && !isSubmitionCompleted}>
                                            <SaveOutlinedIcon className="mr-1" />
                                            Update
                                        </Button>
                                        : <>
                                            <Button
                                                ref={resetButtonRef}
                                                variant="outlined"
                                                color="warning"
                                                onClick={handleReset}
                                                disabled={!dirty || isSubmitting && !isSubmitionCompleted}
                                            >
                                                Reset
                                            </Button>
                                            <Button color="primary" variant="contained" type="submit" disabled={isSubmitting && !isSubmitionCompleted}>
                                                <SaveOutlinedIcon className="mr-1" />
                                                Save
                                            </Button>
                                        </>
                                    }
                                    {isSubmitionCompleted && !formSubmitionAPIError ?
                                        <Chip label="Data saved" color="success" />
                                        :
                                        <>
                                            {formSubmitionAPIError ?
                                                <Chip label={formSubmitionAPIErrorMessage} color="error" />
                                                : <></>}
                                        </>
                                    }
                                </Stack>
                            </form>
                        );
                    }}
                </Formik>
            }

        </>
    );
}

export default OwnerNew;