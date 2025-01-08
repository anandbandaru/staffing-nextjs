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

function CompanyForm({ props, ID, operation }) {
    const { APIPath } = useContext(Context);
    const [isSubmitionCompleted, setSubmitionCompleted] = useState(false);
    const resetButtonRef = useRef(null);
    const [data, setData] = useState({ data: [] });
    const [itemToCheck, setItemToCheck] = useState('');
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
        let apiUrl = APIPath + "/getcompanydetails/" + ID;
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
                        setItemToCheck(result.data[0].Name);
                        //alert(firstName);
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

    const formatDate = (dateString) => {
        const apiDate = dateString;
        const date = new Date(apiDate);
        const formatted = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
        console.log("FORMATTED DATE:" + formatted)
        return formatted;
    }

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
                        Id: itemToCheck ? ID : 'This will be auto-generated once you save',
                        Name: itemToCheck ? data.data[0].Name : '',
                        Description: itemToCheck ? data.data[0].Description : '',
                        Address: itemToCheck ? data.data[0].Address : '',
                        EIN: itemToCheck ? data.data[0].EIN : '',
                        Phone: itemToCheck ? data.data[0].Phone : '',
                        Email: itemToCheck ? data.data[0].Email : '',
                        EstablishedDate: itemToCheck ? formatDate(data.data[0].EstablishedDate) : '',
                        Notes: itemToCheck ? data.data[0].Notes : '',
                        Disabled: itemToCheck ? data.data[0].Disabled : false,
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        var finalAPI = APIPath + "/addcompany";
                        if (operation === "Edit") {
                            finalAPI = APIPath + "/updatecompany";
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
                                showSnackbar('error', "Error saving data");
                            else
                                showSnackbar('success', "Data saved");
                        })
                            .catch(function (error) {
                                console.log(error);
                                setSubmitionCompleted(true);
                                showSnackbar('error', "Error saving data");
                            });
                    }}

                    validationSchema={Yup.object().shape({
                        Name: Yup.string()
                            .required('Name Required'),
                        Description: Yup.string()
                            .required('Description Required'),
                        Address: Yup.string()
                            .required('Address Required'),
                        EIN: Yup.string()
                            .required('EIN Required'),
                        Phone: Yup.string()
                            .required('Phone Required'),
                        Email: Yup.string()
                            .email()
                            .required('Email Required'),
                        EstablishedDate: Yup.string()
                            .required('EstablishedDate Required'),
                        Notes: Yup.string()
                            .required('Notes Required'),
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
                                    id="Name"
                                    name="Name"
                                    label="Name"
                                    value={values.Name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    helperText={(errors.Name && touched.Name) && errors.Name}
                                />
                                <TextField
                                    size="small"
                                    margin="normal"
                                    fullWidth
                                    id="Description"
                                    name="Description"
                                    label="Description"
                                    multiline
                                    rows={4}
                                    value={values.Description}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    helperText={(errors.Description && touched.Description) && errors.Description}
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
                                <Stack direction="row" spacing={2} className='mt-2'>
                                <TextField
                                    size="small"
                                    margin="normal"
                                    fullWidth
                                    id="Phone"
                                    name="Phone"
                                    label="Phone"
                                    value={values.Phone}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    helperText={(errors.Phone && touched.Phone) && errors.Phone}
                                />
                                <TextField
                                    size="small"
                                    margin="normal"
                                    fullWidth
                                    id="Email"
                                    name="Email"
                                    label="Email"
                                    value={values.Email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    helperText={(errors.Email && touched.Email) && errors.Email}
                                />
                                </Stack>
                                <Stack direction="row" spacing={2} className="flex items-center pl-2 mt-4">

                                    <div className='flex-1'>Established Date:
                                        {ID ?
                                            <span className='px-2 bg-gray-500 mx-2 text-white'>{values.EstablishedDate}</span>
                                            : <></>
                                        }
                                    </div>
                                    <TextField
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        className='flex-1'
                                        id="EstablishedDate"
                                        name="EstablishedDate"
                                        type="date"
                                        value={values.EstablishedDate}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        helperText={(errors.EstablishedDate && touched.EstablishedDate) && errors.EstablishedDate}
                                    />
                                </Stack>
                                <TextField
                                    size="small"
                                    margin="normal"
                                    fullWidth
                                    id="Notes"
                                    name="Notes"
                                    label="Notes"
                                    multiline
                                    rows={4}
                                    value={values.Notes}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    helperText={(errors.Notes && touched.Notes) && errors.Notes}
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
                                    {/* <div>
                                        {ID}:{operation}
                                    </div> */}
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

export default CompanyForm;