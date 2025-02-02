import React from 'react';
import { useFormik, FormikProvider, Form } from 'formik';
import * as Yup from 'yup';
import { Grid, TextField, Typography, Button, DialogActions } from '@mui/material';
import { format, addDays, differenceInDays } from 'date-fns';
import axios from 'axios';

const validationSchema = Yup.object().shape({
    hours: Yup.array().of(
        Yup.number()
            .min(1, 'Minimum 1 hour')
            .max(24, 'Maximum 24 hours')
            .required('Hours are required')
    )
});

const TimesheetEntryDialog = ({ timesheet, onClose }) => {
    const formik = useFormik({
        initialValues: {
            hours: Array(differenceInDays(new Date(timesheet.endDate), new Date(timesheet.startDate)) + 1).fill('')
        },
        validationSchema,
        onSubmit: (values) => {
            values.hours.forEach((hour, index) => {
                const date = format(addDays(new Date(timesheet.startDate), index), 'yyyy-MM-dd');
                axios.post('/api/timesheets', {
                    employeeID: timesheet.employeeID,
                    jobID: timesheet.jobID,
                    startDate: date,
                    endDate: date,
                    hours: hour,
                    createdBy: timesheet.createdBy
                })
                .then(response => {
                    console.log('Timesheet submitted:', response.data);
                })
                .catch(error => {
                    console.error('Error submitting timesheet:', error);
                });
            });
            onClose();
        }
    });

    return (
        <FormikProvider value={formik}>
            <Form className='w-full' style={{ maxWidth: `1300px`, margin: '0 auto' }}>
                <Grid container spacing={1}>
                    {formik.values.hours.map((hour, hourIndex) => (
                        <Grid item  key={hourIndex}>
                            <div className='titleDate'>
                                {format(addDays(new Date(timesheet.startDate), hourIndex), 'yyyy-MM-dd')}
                            </div>
                            <TextField
                                label="Hours"
                                name={`hours.${hourIndex}`}
                                value={formik.values.hours[hourIndex]}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.hours?.[hourIndex] && Boolean(formik.errors.hours?.[hourIndex])}
                                helperText={formik.touched.hours?.[hourIndex] && formik.errors.hours?.[hourIndex]}
                                type="number"
                                inputProps={{ min: 1, max: 24 }}
                                size="small"
                            />
                        </Grid>
                    ))}
                </Grid>
                <DialogActions>
                    <Button onClick={onClose} color="secondary" 
                        variant="contained">
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={formik.handleSubmit}
                        disabled={formik.isSubmitting}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Form>
        </FormikProvider>
    );
};

export default TimesheetEntryDialog;