import React, { useState, useContext, useRef, useEffect } from 'react';
import { Context } from "../../context/context";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import Stack from '@mui/material/Stack';
import CustomSnackbar from "../snackbar/snackbar";
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';

function Job({ props, ID, operation }) {
    const { APIPath, userName } = useContext(Context);
    const [isSubmitionCompleted, setSubmitionCompleted] = useState(false);
    const resetButtonRef = useRef(null);
    const [data, setData] = useState({ data: [] });
    const [name, setName] = useState('');
    const [apiLoading, setApiLoading] = useState(false);

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
        let apiUrl = APIPath + "/getjobdetails/" + ID;
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
                        setName(result.data[0].jobName);
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
                        jobName: name ? data.data[0].jobName : '',
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
                    onSubmit={(values, { setSubmitting }) => {
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
                        employeeId: Yup.string()
                            .required('employeeId Required'),
                        clientId: Yup.string()
                            .required('clientId Required'),
                        rate: Yup.string()
                            .required('rate Required'),
                        deductionPercentage: Yup.string()
                            .required('deductionPercentage Required'),
                        deductionFlat: Yup.string()
                            .required('deductionFlat Required'),
                        jobTitle: Yup.string()
                            .required('jobTitle Required'),
                        jobStartDate: Yup.string()
                            .required('jobStartDate Required'),
                        jobEndDate: Yup.string()
                            .required('jobEndDate Required'),
                        timesheetsPeriod: Yup.string()
                            .required('timesheetsPeriod Required'),
                        invoicePeriod: Yup.string()
                            .required('invoicePeriod Required'),
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
                                <Stack direction={"row"} spacing={1}>
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
                                        id="jobName"
                                        name="jobName"
                                        label="Job Name"
                                        value={values.jobName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        helperText={(errors.jobName && touched.jobName) && errors.jobName}
                                    />
                                </Stack>
                                <Stack direction={"row"} spacing={1} className='mt-4'>
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
                                    <Stack direction="row" spacing={2} className="flex items-center pl-2 mt-4">

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
                                        <h3>Validation Errors:</h3>
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