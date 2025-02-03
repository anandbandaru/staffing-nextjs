import React, { useState, useContext } from 'react';
import { useFormik, FormikProvider, Form } from 'formik';
import * as Yup from 'yup';
import { Grid, TextField, Typography, Button, Stack } from '@mui/material';
import { format, addDays, differenceInDays } from 'date-fns';
import axios from 'axios';
import TimesheetEntryMetadata from './timesheetentryMetadata';
import { Context } from "../../context/context";
import CustomSnackbar from "../snackbar/snackbar";

const validationSchema = Yup.object().shape({
    hours: Yup.array().of(
        Yup.number()
            .min(0, 'Minimum 0 hour')
            .max(24, 'Maximum 24 hours')
            .required('Hours are required')
    ),
    userNotes: Yup.string()
});

const TimesheetEntryDialog = ({ timesheet, onClose, onFormSubmitSuccess }) => {

    const { APIPath, userName } = useContext(Context);
    const [isSubmitionCompleted, setSubmitionCompleted] = useState(false);
    const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);

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

    const formik = useFormik({
        initialValues: {
            hours: Array(differenceInDays(new Date(timesheet.endDate), new Date(timesheet.startDate)) + 1).fill(''),
            userNotes: ''
        },
        validationSchema,
        onSubmit: (values, { setSubmitting }) => {
            setSubmitting(true);
            setSubmitionCompleted(false);
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
            axios.post(finalAPI, {
                employeeID: timesheet.employeeID,
                jobID: timesheet.jobID,
                entries: timesheetEntries,
                userNotes: values.userNotes,
                createdBy: userName
            })
                .then((resp) => {
                    setSubmitting(false);
                    setSubmitionCompleted(true);
                    if (resp.data.STATUS === "FAIL") {
                        setIsSubmitSuccess(false);
                        showSnackbar('error', "Error saving Timesheet data");
                    } else {
                        setIsSubmitSuccess(true);
                        showSnackbar('success', "Timesheet data saved");
                        onFormSubmitSuccess();  // Call the callback function
                    }
                })
                .catch(function (error) {
                    setSubmitting(false);
                    setIsSubmitSuccess(false);
                    setSubmitionCompleted(true);
                    showSnackbar('error', "Error saving Timesheet data");
                });
        }
    });

    const getDayOfWeek = (date) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[new Date(date).getDay()];
    };
    const getDayClass = (date) => {
        const day = new Date(date).getDay();
        return day === 0 || day === 6 ? 'weekendDay' : 'weekday';
    };
    const totalHours = formik.values.hours.reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0);

    return (
        <FormikProvider value={formik}>
            <CustomSnackbar
                open={snackbarOpen}
                handleClose={handleSnackbarClose}
                severity={snackbarSeverity}
                message={snackbarMessage}
            />
            <Form className='w-full' style={{ maxWidth: `1300px`, margin: '0 auto' }}>

                <div className='badgeSpan rag-red-bg mb-4' sx={{ color: 'text.secondary', fontSize: 16 }}>
                    Days pending: {timesheet.daysPending}
                </div>
                <div>
                    <Stack direction="row" spacing={2} className='mt-8 mb-0'>
                        <Typography variant="h5" component="div">
                            {timesheet.timesheetNumber}
                        </Typography>
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
                                {format(addDays(new Date(timesheet.startDate), hourIndex), 'yyyy-MM-dd')}
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
                                disabled={isSubmitSuccess}
                            />
                        </Grid>
                    ))}
                </Grid>
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
                    disabled={isSubmitSuccess}
                />
            </Form>
        </FormikProvider>
    );
};

export default TimesheetEntryDialog;