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

function ClientForm({ props, ID, operation }) {
    const { APIPath } = useContext(Context);
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
        let apiUrl = APIPath + "/getclientdetails/" + ID;
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
                        setName(result.data[0].Name);
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
                        Name: name ? data.data[0].Name : '',
                        Address: name ? data.data[0].Address : '',
                        Emails: name ? data.data[0].Emails : '',
                        Notes: name ? data.data[0].Notes : '',
                        Disabled: name ? data.data[0].Disabled : false,
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        var finalAPI = APIPath + "/addclient";
                        if (operation === "Edit") {
                            finalAPI = APIPath + "/updateclient";
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
                                showSnackbar('error', "Error saving Client data");
                            else
                                showSnackbar('success', "Client data saved");
                        })
                            .catch(function (error) {
                                console.log(error);
                                setSubmitionCompleted(true);
                                showSnackbar('error', "Error saving Client data");
                            });
                    }}

                    validationSchema={Yup.object().shape({
                        Name: Yup.string()
                            .required('Required'),
                        Address: Yup.string()
                            .required('Required'),
                        Emails: Yup.string()
                            .required('Required'),
                        Notes: Yup.string()
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
                                <TextField
                                    size="small"
                                    margin="normal"
                                    fullWidth
                                    id="Emails"
                                    name="Emails"
                                    label="Emails"
                                    multiline
                                    rows={4}
                                    value={values.Emails}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    helperText={(errors.Emails && touched.Emails) && errors.Emails}
                                />
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
                                <Stack direction="row" spacing={2} className='float-right'>
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
                                                disabled={!dirty ||(isSubmitting && !isSubmitionCompleted)}
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

export default ClientForm;