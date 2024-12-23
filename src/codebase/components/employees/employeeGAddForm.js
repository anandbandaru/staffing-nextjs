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
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import CustomSnackbar from "../snackbar/snackbar";

function EmployeeGAddForm({ formType, employeeID }) {
    const { APIPath, userName } = useContext(Context);
    const [isSubmitionCompleted, setSubmitionCompleted] = useState(false);
    const [formSubmitionAPIError, setFormSubmitionAPIError] = useState(false);
    const [formSubmitionAPIErrorMessage, setFormSubmitionAPIErrorMessage] = useState("");
    const resetButtonRef = useRef(null);
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

    const getInitialValues = () => {
        switch (formType) {
            case 'I94':
                return {
                    Id: 'This will be auto-generated once you save',
                    employeeID: employeeID,
                    i94Number: '',
                    i94ExpiryDate: '',
                    notes: '',
                    createdBy: userName
                };
            case 'Dependent':
                return {
                    Id: 'This will be auto-generated once you save',
                    employeeID: employeeID,
                    fullName: '',
                    dependentType: '',
                    notes: '',
                    createdBy: userName
                };
            case 'Visa':
                return {
                    Id: 'This will be auto-generated once you save',
                    employeeID: employeeID,
                    visaNumber: '',
                    visaExpiryDate: '',
                    visaIssueDate: '',
                    visaType: '',
                    notes: '',
                    createdBy: userName
                };
            case 'Passport':
                return {
                    Id: 'This will be auto-generated once you save',
                    employeeID: employeeID,
                    passportNumber: '',
                    passportExpiryDate: '',
                    passportIssueDate: '',
                    notes: '',
                    createdBy: userName
                };
            default:
                return {};
        }
    };

    const getValidationSchema = () => {
        switch (formType) {
            case 'I94':
                return Yup.object().shape({
                    i94Number: Yup.string().required('i94Number Required'),
                    i94ExpiryDate: Yup.string().required('i94ExpiryDate Required'),
                    notes: Yup.string().required('notes Required'),
                });
            case 'Dependent':
                return Yup.object().shape({
                    fullName: Yup.string().required('Full Name Required'),
                    dependentType: Yup.string().required('Dependent Type Required'),
                    notes: Yup.string().required('notes Required'),
                });
            case 'Visa':
                return Yup.object().shape({
                    visaNumber: Yup.string().required('Visa Number Required'),
                    visaExpiryDate: Yup.string().required('Visa Expiry Date Required'),
                    visaIssueDate: Yup.string().required('Visa Issue Date Required'),
                    visaType: Yup.string().required('Visa Type Required'),
                    notes: Yup.string().required('notes Required'),
                });
            case 'Passport':
                return Yup.object().shape({
                    passportNumber: Yup.string().required('Passport Number Required'),
                    passportExpiryDate: Yup.string().required('Passport Expiry Date Required'),
                    passportIssueDate: Yup.string().required('Passport Issue Date Required'),
                    notes: Yup.string().required('notes Required'),
                });
            default:
                return Yup.object().shape({});
        }
    };

    const getAPIEndpoint = () => {
        switch (formType) {
            case 'I94':
                return APIPath + "/addi94";
            case 'Dependent':
                return APIPath + "/adddependent";
            case 'Visa':
                return APIPath + "/addvisa";
            case 'Passport':
                return APIPath + "/addpassport";
            default:
                return '';
        }
    };

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
                    <div className="spinner"></div>
                </>
                :
                <Formik
                    enableReinitialize
                    initialValues={getInitialValues()}
                    onSubmit={(values, { setSubmitting }) => {
                        var finalAPI = getAPIEndpoint();
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
                            if (resp.data.STATUS === "FAIL")
                                showSnackbar('error', "Error saving data");
                            else
                                showSnackbar('success', "Data saved");
                        })
                            .catch(function (error) {
                                console.log(error);
                                setSubmitionCompleted(true);
                                setFormSubmitionAPIErrorMessage(error);
                                setFormSubmitionAPIError(true);
                                showSnackbar('error', "Error saving data");
                            });
                    }}

                    validationSchema={getValidationSchema()}
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
                                    id="employeeID"
                                    name="employeeID"
                                    label="Employee ID"
                                    disabled
                                    value={values.employeeID}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {formType === 'I94' && (
                                    <>
                                        <TextField
                                            size="small"
                                            margin="normal"
                                            fullWidth
                                            id="i94Number"
                                            name="i94Number"
                                            label="I94 Number"
                                            value={values.i94Number}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            helperText={(errors.i94Number && touched.i94Number) && errors.i94Number}
                                        />
                                        <Stack direction="row" spacing={2} className="flex items-center pl-2 mt-4">
                                            <div className='flex-1'>I94 Expiry Date:
                                                {employeeID ?
                                                    <span className='px-2 bg-gray-500 mx-2 text-white'>{values.i94ExpiryDate}</span>
                                                    : <></>
                                                }
                                            </div>
                                            <TextField
                                                size="small"
                                                margin="normal"
                                                fullWidth
                                                className='flex-1'
                                                id="i94ExpiryDate"
                                                name="i94ExpiryDate"
                                                type="date"
                                                value={values.i94ExpiryDate}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                helperText={(errors.i94ExpiryDate && touched.i94ExpiryDate) && errors.i94ExpiryDate}
                                            />
                                        </Stack>
                                    </>
                                )}
                                {formType === 'Dependent' && (
                                    <>
                                        <TextField
                                            size="small"
                                            margin="normal"
                                            fullWidth
                                            id="fullName"
                                            name="fullName"
                                            label="Full Name"
                                            value={values.fullName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            helperText={(errors.fullName && touched.fullName) && errors.fullName}
                                        />
                                        <TextField
                                            size="small"
                                            margin="normal"
                                            fullWidth
                                            id="dependentType"
                                            name="dependentType"
                                            label="Dependent Type"
                                            select
                                            value={values.dependentType}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            helperText={(errors.dependentType && touched.dependentType) && errors.dependentType}
                                        >
                                            {configData.dependentTypes.map((item, index) => (
                                                <MenuItem key={index} value={item.name}>
                                                    {item.name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </>
                                )}
                                {formType === 'Visa' && (
                                    <>
                                        <TextField
                                            size="small"
                                            margin="normal"
                                            fullWidth
                                            id="visaNumber"
                                            name="visaNumber"
                                            label="Visa Number"
                                            value={values.visaNumber}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            helperText={(errors.visaNumber && touched.visaNumber) && errors.visaNumber}
                                        />
                                        <Stack direction="row" spacing={2} className="flex items-center pl-2 mt-4">
                                            <div className='flex-1'>Visa Issue Date:
                                                {employeeID ?
                                                    <span className='px-2 bg-gray-500 mx-2 text-white'>{values.visaIssueDate}</span>
                                                    : <></>
                                                }
                                            </div>
                                            <TextField
                                                size="small"
                                                margin="normal"
                                                fullWidth
                                                className='flex-1'
                                                id="visaIssueDate"
                                                name="visaIssueDate"
                                                type="date"
                                                value={values.visaIssueDate}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                helperText={(errors.visaIssueDate && touched.visaIssueDate) && errors.visaIssueDate}
                                            />
                                        </Stack>
                                        <Stack direction="row" spacing={2} className="flex items-center pl-2 mt-4">
                                            <div className='flex-1'>Visa Expiry Date:
                                                {employeeID ?
                                                    <span className='px-2 bg-gray-500 mx-2 text-white'>{values.visaExpiryDate}</span>
                                                    : <></>
                                                }
                                            </div>
                                            <TextField
                                                size="small"
                                                margin="normal"
                                                fullWidth
                                                className='flex-1'
                                                id="visaExpiryDate"
                                                name="visaExpiryDate"
                                                type="date"
                                                value={values.visaExpiryDate}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                helperText={(errors.visaExpiryDate && touched.visaExpiryDate) && errors.visaExpiryDate}
                                            />
                                        </Stack>
                                        <TextField
                                            size="small"
                                            margin="normal"
                                            fullWidth
                                            id="visaType"
                                            name="visaType"
                                            label="Visa Type"
                                            select
                                            value={values.visaType}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            helperText={(errors.visaType && touched.visaType) && errors.visaType}
                                            >
                                                {configData.visaTypes.map((item, index) => (
                                                    <MenuItem key={index} value={item.name}>
                                                        {item.name}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                    </>
                                )}
                                {formType === 'Passport' && (
                                    <>
                                        <TextField
                                            size="small"
                                            margin="normal"
                                            fullWidth
                                            id="passportNumber"
                                            name="passportNumber"
                                            label="Passport Number"
                                            value={values.passportNumber}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            helperText={(errors.passportNumber && touched.passportNumber) && errors.passportNumber}
                                        />
                                        <Stack direction="row" spacing={2} className="flex items-center pl-2 mt-4">
                                            <div className='flex-1'>Passport Issue Date:
                                                {employeeID ?
                                                    <span className='px-2 bg-gray-500 mx-2 text-white'>{values.passportIssueDate}</span>
                                                    : <></>
                                                }
                                            </div>
                                            <TextField
                                                size="small"
                                                margin="normal"
                                                fullWidth
                                                className='flex-1'
                                                id="passportIssueDate"
                                                name="passportIssueDate"
                                                type="date"
                                                value={values.passportIssueDate}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                helperText={(errors.passportIssueDate && touched.passportIssueDate) && errors.passportIssueDate}
                                            />
                                        </Stack>
                                        <Stack direction="row" spacing={2} className="flex items-center pl-2 mt-4">
                                            <div className='flex-1'>Passport Expiry Date:
                                                {employeeID ?
                                                    <span className='px-2 bg-gray-500 mx-2 text-white'>{values.i94ExpiryDate}</span>
                                                    : <></>
                                                }
                                            </div>
                                            <TextField
                                                size="small"
                                                margin="normal"
                                                fullWidth
                                                className='flex-1'
                                                id="passportExpiryDate"
                                                name="passportExpiryDate"
                                                type="date"
                                                value={values.passportExpiryDate}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                helperText={(errors.passportExpiryDate && touched.passportExpiryDate) && errors.passportExpiryDate}
                                            />
                                        </Stack>
                                    </>
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
                                <Stack direction="row" spacing={2} className='float-right'>
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

export default EmployeeGAddForm;