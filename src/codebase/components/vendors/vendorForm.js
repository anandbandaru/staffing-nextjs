import React, { useState, useContext, useRef, useEffect } from 'react';
import { Context } from "../../context/context";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import Stack from '@mui/material/Stack';
import CustomSnackbar from "../snackbar/snackbar";
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import InputMask from 'react-input-mask';

function VendorForm({ props, ID, operation }) {
    const { APIPath, userName } = useContext(Context);
    const [isSubmitionCompleted, setSubmitionCompleted] = useState(false);
    const resetButtonRef = useRef(null);
    const [data, setData] = useState({ data: [] });
    const [name, setName] = useState('');
    const [apiLoading, setApiLoading] = useState(true);

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
        let apiUrl = APIPath + "/getvendordetails/" + ID;
        console.log(apiUrl)
        fetch(apiUrl)
            .then(response => response.json())
            .then(
                (result) => {
                    //console.log(result);
                    if (result.error) {
                        console.log("RequestData:On error return: setting empty")
                        setData({});
                    }
                    else {
                        setData(result);
                        setName(result.data[0].name);
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
    useEffect(() => {
        if (operation === "View" || operation === "Edit") {
            getDetails();
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
                        Id: name ? ID : 'This will be auto-generated once you save',
                        name: name ? data.data[0].name : '',
                        address: name ? data.data[0].address : '',
                        city: name ? data.data[0].city : '',
                        state: name ? data.data[0].state : '',
                        zip: name ? data.data[0].zip : '',
                        country: name ? data.data[0].country : '',
                        email: name ? data.data[0].email : '',
                        EIN: name ? data.data[0].EIN : '',
                        phone: name ? data.data[0].phone : '',
                        accountsEmail: name ? data.data[0].accountsEmail : '',
                        accountsManagerEmail: name ? data.data[0].accountsManagerEmail : '',
                        salesEmail: name ? data.data[0].salesEmail : '',
                        salesManagerEmail: name ? data.data[0].salesManagerEmail : '',
                        notes: name ? data.data[0].notes : '',
                        disabled: name ? data.data[0].disabled : false,
                        createdBy: userName,
                        modifiedBy: userName,
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        var finalAPI = APIPath + "/addvendor";
                        if (operation === "Edit") {
                            finalAPI = APIPath + "/updatevendor";
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
                            if (resp.data.STATUS === "FAIL")
                                showSnackbar('error', "Error saving Vendor data - " + resp.data.ERROR.MESSAGE);
                                if(resp.data.ERROR.MESSAGE.includes("Violation of UNIQUE KEY constraint 'UQ_EIN'"))
                                    showSnackbar('error', "You tried inserting Duplicate EIN");
                            else
                                showSnackbar('success', "Vendor data saved");
                        })
                            .catch(function (error) {
                                console.log(error);
                                setSubmitionCompleted(true);
                                showSnackbar('error', "Error saving Vendor data");
                            });
                    }}

                    validationSchema={Yup.object().shape({
                        name: Yup.string()
                            .required('name Required'),
                        address: Yup.string()
                            .required('address Required'),
                        city: Yup.string()
                            .required('city Required'),
                        state: Yup.string()
                            .required('state Required'),
                        zip: Yup.string()
                            .required('zip Required'),
                        country: Yup.string()
                            .required('country Required'),
                        email: Yup.string()
                            .email()
                            .required('email Required'),
                        EIN: Yup.string()
                            .matches(/^\d{2}-\d{7}$/, 'EIN must be in the format 12-3456789')
                            .required('EIN Required'),
                        phone: Yup.string()
                            .required('phone Required'),
                        accountsEmail: Yup.string()
                            .email(),
                        accountsManagerEmail: Yup.string()
                            .email(),
                        salesEmail: Yup.string()
                            .email(),
                        salesManagerEmail: Yup.string()
                            .email(),
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
                                    id="name"
                                    name="name"
                                    label="Name"
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    helperText={(errors.name && touched.name) && errors.name}
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
                                <Stack direction="row" spacing={2}>
                                    <TextField
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        id="city"
                                        name="city"
                                        label="City"
                                        value={values.city}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        helperText={(errors.city && touched.city) && errors.city}
                                    />
                                    <TextField
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        id="state"
                                        name="state"
                                        label="State"
                                        value={values.state}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        helperText={(errors.state && touched.state) && errors.state}
                                    />
                                    <TextField
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        id="zip"
                                        name="zip"
                                        label="Zip"
                                        value={values.zip}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        helperText={(errors.zip && touched.zip) && errors.zip}
                                    />
                                    <TextField
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        id="country"
                                        name="country"
                                        label="Country"
                                        value={values.country}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        helperText={(errors.country && touched.country) && errors.country}
                                    />
                                </Stack>
                                <Stack direction="row" spacing={2} className='mt-4'>
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
                                        id="phone"
                                        name="phone"
                                        label="phone"
                                        value={values.phone}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        helperText={(errors.phone && touched.phone) && errors.phone}
                                    />
                                </Stack>
                                <InputMask
                                    mask="99-9999999"
                                    value={values.EIN}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                >
                                    {() => (
                                        <TextField
                                            size="small"
                                            margin="normal"
                                            fullWidth
                                            id="EIN"
                                            name="EIN"
                                            label="EIN"
                                            value={values.EIN}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            helperText={(errors.EIN && touched.EIN) && errors.EIN}
                                        />
                                    )}
                                </InputMask>
                                <Stack direction="row" spacing={2} className='mt-4'>
                                    <TextField
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        id="accountsEmail"
                                        name="accountsEmail"
                                        label="Accounts Email"
                                        value={values.accountsEmail}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        helperText={(errors.accountsEmail && touched.accountsEmail) && errors.accountsEmail}
                                    />
                                    <TextField
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        id="accountsManagerEmail"
                                        name="accountsManagerEmail"
                                        label="Accounts Manager Email"
                                        value={values.accountsManagerEmail}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        helperText={(errors.accountsManagerEmail && touched.accountsManagerEmail) && errors.accountsManagerEmail}
                                    />
                                </Stack>
                                <Stack direction="row" spacing={2} className='mt-4'>
                                    <TextField
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        id="salesEmail"
                                        name="salesEmail"
                                        label="Sales Email"
                                        value={values.salesEmail}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        helperText={(errors.salesEmail && touched.salesEmail) && errors.salesEmail}
                                    />
                                    <TextField
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        id="salesManagerEmail"
                                        name="salesManagerEmail"
                                        label="Sales Manager Email"
                                        value={values.salesManagerEmail}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        helperText={(errors.salesManagerEmail && touched.salesManagerEmail) && errors.salesManagerEmail}
                                    />
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
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            id="disabled"
                                            name="disabled"
                                            label="Disabled"
                                            // value={values.Disabled}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
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
                                <Stack direction="row" spacing={2} className='float-right mt-2'>
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
                                                disabled={!dirty || (isSubmitting && !isSubmitionCompleted)}
                                            >
                                                Reset
                                            </Button>
                                            <Button color="primary" variant="contained" type="submit" disabled={isSubmitting && !isSubmitionCompleted}>
                                                <SaveOutlinedIcon className="mr-1" />
                                                Save
                                            </Button>
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

export default VendorForm;