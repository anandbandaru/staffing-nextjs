import React, { useState, useContext, useEffect } from 'react';
import configData from "../../../CONFIG_RELEASE.json";
import { useFormik, FormikProvider, Form } from 'formik';
import * as Yup from 'yup';
import { Grid, TextField, Typography, Button, Stack, Chip } from '@mui/material';
import { format, addDays, differenceInDays } from 'date-fns';
import axios from 'axios';
import TimesheetEntryMetadata from './timesheetentryMetadata';
import { Context } from "../../context/context";
import CustomSnackbar from "../snackbar/snackbar";
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';

const TimesheetEntryDialog = ({ existingId, timesheet, onClose, onFormSubmitSuccess, operation, viewOnlyMode }) => {

    const { APIPath, userName } = useContext(Context);
    const [isSubmitionCompleted, setSubmitionCompleted] = useState(false);
    const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
    const [insertedTimesheetId, setInsertedTimesheetId] = useState(false);

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


    const validationSchema = Yup.object().shape({
        hours: Yup.array().of(
            Yup.number()
                .min(0, 'Minimum 0 hour')
                .max(24, 'Maximum 24 hours')
                .required('Hours are required')
        ),
        userNotes: Yup.string().required('Notes are required'),
        Cfile: Yup.string().when(operation, {
            is: 'Edit',
            then: () => Yup.string()
                .required('Customer Approved timesheet Document is required'),
            otherwise: () => Yup.string().nullable()
        }),
    });

    //FILE RELATED
    const [fileC, setFileC] = useState(null);
    const handleFileChangeC = (event) => {
        setFileC(event.target.files[0]);
    };
    const [fileIPV, setFileIPV] = useState(null);
    const handleFileChangeIPV = (event) => {
        setFileIPV(event.target.files[0]);
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

    const formik = useFormik({
        initialValues: {
            hours: Array(differenceInDays(new Date(timesheet.endDate), new Date(timesheet.startDate)) + 1).fill(''),
            userNotes: ''
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true);
            setSubmitionCompleted(false);
            setIsSubmitSuccess(false);
            const totalHours = values.hours.reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0);

            if (timesheet.jobType === 'WEEKLY' && totalHours < 40) {
                const proceed = window.confirm('Total hours are less than 40 for a weekly timesheet. Do you still want to proceed?');
                if (!proceed) {
                    setSubmitting(false);
                    return;
                }
            }

            const timesheetEntries = values.hours.map((hour, index) => ({
                startDate: format(addDays(new Date(timesheet.startDate), index), 'yyyy-MM-dd'),
                endDate: format(addDays(new Date(timesheet.startDate), index), 'yyyy-MM-dd'),
                hours: hour
            }));

            var finalAPI = APIPath + "/submittimesheet";
            try {
                const resp = await axios.post(finalAPI, {
                    headers: {
                        'ngrok-skip-browser-warning': 'true',
                    }
                }, {
                    employeeID: timesheet.employeeID,
                    jobID: timesheet.jobID,
                    entries: timesheetEntries,
                    userNotes: values.userNotes,
                    createdBy: userName,
                    timesheetNumber: timesheet.timesheetNumber,
                    jobType: timesheet.jobType
                });
                if (resp.data.STATUS === "FAIL") {
                    setSubmitting(false);
                    setIsSubmitSuccess(false);
                    setSubmitionCompleted(true);
                    showSnackbar('error', "Error saving Timesheet data");
                } else {
                    setInsertedTimesheetId(resp.data.RELATED_ID);
                    let fileNameC = "CLIENT_APP_E:" + timesheet.employeeID + "-T:" + timesheet.timesheetNumber + getCurrentDateTime();
                    let fileNameIPV = "IMP_VEN_APP_E:" + timesheet.employeeID + "-T:" + timesheet.timesheetNumber + getCurrentDateTime();
                    //alert("BEFORE INTERNAL FILE UPLOAD")
                    await UploadTimesheetFiles(fileC, fileNameC, 'TIMESHEETS', resp.data.RELATED_ID, "Client Approved");
                    if (fileIPV)
                        await UploadTimesheetFiles(fileIPV, fileNameIPV, 'TIMESHEETS', resp.data.RELATED_ID, "Imp Partner/Vendor Approved");
                    //alert(resp.data.RELATED_ID); // Execute the alert statement after the API call completes
                    setIsSubmitSuccess(true);
                    setSubmitting(false);
                    setSubmitionCompleted(true);
                    showSnackbar('success', "Timesheet data saved");
                    onFormSubmitSuccess();
                }
            } catch (error) {
                setSubmitting(false);
                setIsSubmitSuccess(false);
                setSubmitionCompleted(true);
                showSnackbar('error', "Error saving Timesheet data");
            }
        }
    });

    const UploadTimesheetFiles = async (file, fileName, componentName, moduleId, type) => {
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
                    'ngrok-skip-browser-warning': 'true'
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

    const getDayOfWeek = (date) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[new Date(date).getDay()];
    };
    const getDayClass = (date) => {
        const day = new Date(date).getDay();
        return day === 0 || day === 6 ? 'weekendDay' : 'weekday';
    };
    const totalHours = formik.values.hours.reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0);
    const today = new Date();

    const getValidationErrors = () => {
        const errors = [];
        for (const key in formik.errors) {
            if (formik.errors.hasOwnProperty(key)) {
                if (Array.isArray(formik.errors[key])) {
                    formik.errors[key].forEach((error, index) => {
                        errors.push(`Error in ${key}[${index + 1}]: ${error}`);
                    });
                } else {
                    errors.push(`Error in ${key}: ${formik.errors[key]}`);
                }
            }
        }
        return errors;
    };

    useEffect(() => {
        if (operation === 'Edit' && existingId) {
            const fetchHours = async () => {
                try {
                    const response = await axios.get(`${APIPath}/gettimesheethours/${existingId}`, {
                        headers: {
                            'ngrok-skip-browser-warning': 'true',
                        }
                    });
                    const hoursData = response.data.data;
                    const updatedHours = [...formik.values.hours];
                    hoursData.forEach(({ day, hours }) => {
                        const dateIndex = differenceInDays(new Date(day), new Date(timesheet.startDate));
                        if (dateIndex >= 0 && dateIndex < updatedHours.length) {
                            updatedHours[dateIndex] = hours;
                        }
                    });
                    formik.setFieldValue('hours', updatedHours);
                } catch (error) {
                    showSnackbar('error', 'Error fetching hours data');
                }

                try {
                    const response = await axios.get(`${APIPath}/gettimesheetadmindetails/${existingId}`, {
                        headers: {
                            'ngrok-skip-browser-warning': 'true',
                        }
                    });
                    const existingNotes = response.data.data[0].userNotes;
                    let updatednotes = [...formik.values.userNotes];
                    updatednotes = existingNotes
                    formik.setFieldValue('userNotes', updatednotes);
                } catch (error) {
                    showSnackbar('error', 'Error fetching User Notes data');
                }
            };
            fetchHours();
        }
    }, [operation, existingId]);

    return (
        <FormikProvider value={formik}>
            <CustomSnackbar
                open={snackbarOpen}
                handleClose={handleSnackbarClose}
                severity={snackbarSeverity}
                message={snackbarMessage}
            />
            <Form className='w-full' style={{ maxWidth: `1300px`, margin: '0 auto' }}>
                VIEW MODE: {viewOnlyMode}
                <div>
                    <Stack direction="row" spacing={2} className='mt-0 mb-8'>
                        <Typography variant="h5" component="div">
                            EMPLOYEE NAME: <Chip label={timesheet.employeeName} color="primary" variant="outlined" />
                        </Typography>
                        <Typography variant="h5" component="div">
                            CURRENT DATE: <Chip label={today.toLocaleDateString()} color="primary" variant="outlined" />
                        </Typography>
                        <Typography variant="h5" component="div">
                            TIMESHEET ID: <Chip label={timesheet.timesheetNumber} color="primary" variant="outlined" />
                        </Typography>
                        <div className='badgeSpan rag-red-bg mb-4'
                            style={{ display: 'flex', alignItems: 'center', color: 'text.secondary', fontSize: 16 }}>
                            Days pending: {timesheet.daysPending}
                        </div>
                        <div className='badgeSpan rag-red-bg mb-4'
                            style={{ display: 'flex', alignItems: 'center', color: 'text.secondary', fontSize: 16 }}>
                            CURRENT STATUS: {timesheet.status}
                        </div>
                    </Stack>
                    <Stack direction="row" spacing={2} className='mb-0'>
                        <TextField
                            size="small"
                            margin="normal"
                            id="wes"
                            name="wes"
                            label="Timesheet Start Date"
                            disabled
                            value={timesheet.startDate}
                        />
                        <TextField
                            className='ml-4'
                            size="small"
                            margin="normal"
                            id="wed"
                            name="wed"
                            label="Timesheet End Date"
                            disabled
                            value={timesheet.endDate}
                        />
                        {existingId !== 0 &&
                            (<div className='badgeSpan rag-yellow-bg mb-4'
                                style={{ display: 'flex', alignItems: 'center', color: 'text.secondary', fontSize: 16 }}>
                                Editing existing record
                            </div>)
                        }
                    </Stack>
                    <TimesheetEntryMetadata timesheet={timesheet} />
                </div>

                <Grid container spacing={0} className='mb-4'>
                    {formik.values.hours.map((hour, hourIndex) => (
                        <Grid key={hourIndex} className={getDayClass(addDays(new Date(timesheet.startDate), hourIndex))}>
                            <div className='dayOfWeek'>
                                {getDayOfWeek(addDays(new Date(timesheet.startDate), hourIndex))}
                            </div>
                            <div className='titleDate'>
                                {format(addDays(new Date(timesheet.startDate), hourIndex), 'MM-dd-yyyy')}
                            </div>
                            <TextField
                                label="Hours"
                                fullWidth
                                name={`hours.${hourIndex}`}
                                value={formik.values.hours[hourIndex]}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.hours?.[hourIndex] && Boolean(formik.errors.hours?.[hourIndex])}
                                helperText={formik.touched.hours?.[hourIndex] && formik.errors.hours?.[hourIndex]}
                                type="number"
                                inputProps={{ min: 1, max: 24 }}
                                size="small"
                                disabled={isSubmitSuccess || formik.isSubmitting}
                            />
                            {getDayClass(addDays(new Date(timesheet.startDate), hourIndex)) === "weekendDay" && (
                                <div className='weekendDayInfo'>
                                    Enter 0 if not worked.
                                </div>
                            )}
                        </Grid>
                    ))}
                </Grid>

                {!viewOnlyMode && (
                    <>
                        <Stack direction="row" spacing={1} className='mb-6'>
                            <div className='bg-orange-200 px-6 w-[600px]'>Customer Approved Timesheet Document
                                <br />
                                <strong>{operation === "New" ? "MANDATORY" : "OPTIONAL"}</strong></div>
                            <TextField
                                className='bg-orange-100 text-white py-2 px-4 rounded-md hover:bg-blue-200 fileUploadControl'
                                type="file"
                                size="small"
                                margin="normal"
                                fullWidth
                                id="Cfile"
                                name="Cfile"
                                disabled={isSubmitSuccess || formik.isSubmitting}
                                onChange={(event) => {
                                    formik.handleChange(event);
                                    handleFileChangeC(event);
                                }}
                                onBlur={formik.handleBlur}
                                helperText={(formik.errors.Cfile && formik.touched.Cfile) && formik.errors.Cfile}
                            />
                        </Stack>

                        <Stack direction="row" spacing={1} className='mb-6'>
                            <div className='bg-gray-100 px-6 w-[600px]'>Implementation Partner \ Venfor Timesheet Document
                                <br />
                                <strong>OPTIONAL</strong>
                            </div>
                            <TextField
                                className='bg-gray-100 text-white py-2 px-4 rounded-md hover:bg-blue-200 fileUploadControl'
                                type="file"
                                size="small"
                                margin="normal"
                                fullWidth
                                id="IPVfile"
                                name="IPVfile"
                                disabled={isSubmitSuccess || formik.isSubmitting}
                                onChange={(event) => {
                                    formik.handleChange(event);
                                    handleFileChangeIPV(event);
                                }}
                                onBlur={formik.handleBlur}
                                helperText={(formik.errors.IPVfile && formik.touched.IPVfile) && formik.errors.IPVfile}
                            />
                        </Stack>
                        <TextField
                            className='mt-4'
                            label="User Notes"
                            name="userNotes"
                            multiline
                            rows={2}
                            fullWidth
                            value={formik.values.userNotes}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            disabled={isSubmitSuccess || formik.isSubmitting}
                        />
                    </>
                )}
                {!viewOnlyMode && (
                    <Stack direction="row" spacing={2} className='mt-4 float-right'>
                        <TextField
                            className='mr-4'
                            size="small"
                            margin="normal"
                            id="totalHours"
                            name="totalHours"
                            label="Total Hours"
                            disabled
                            value={totalHours}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={formik.handleSubmit}
                            disabled={formik.isSubmitting || isSubmitSuccess}
                        >
                            Submit
                        </Button>
                        {formik.isSubmitting && <div className='spinner'></div>}
                    </Stack>
                )}
                {getValidationErrors().length > 0 && (
                    <Stack direction="row" spacing={2} className='mt-4'>
                        <div className=" bg-red-500 my-4 p-2 text-white rounded-md float-left">
                            <Typography variant="h6" component="div">
                                Validation Errors:
                            </Typography>
                            <ul>
                                {getValidationErrors().map((error, index) => (
                                    <li key={index}><KeyboardArrowRightOutlinedIcon />{error}</li>
                                ))}
                            </ul>
                        </div>
                    </Stack>
                )
                }
            </Form>
        </FormikProvider>
    );
};

export default TimesheetEntryDialog;