import React from 'react';
import { useFormik, FormikProvider, Form } from 'formik';
import * as Yup from 'yup';
import { Grid, TextField, Typography, Button, DialogActions, Stack } from '@mui/material';
import { format, addDays, differenceInDays } from 'date-fns';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

const validationSchema = Yup.object().shape({
    hours: Yup.array().of(
        Yup.number()
            .min(1, 'Minimum 1 hour')
            .max(24, 'Maximum 24 hours')
            .required('Hours are required')
    )
});

const TimesheetEntryDialog = ({ timesheet, onClose }) => {

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

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

    const getDayOfWeek = (date) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[new Date(date).getDay()];
    };

    const totalHours = formik.values.hours.reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0);

    return (
        <FormikProvider value={formik}>
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
                    </Stack>
                    <Stack direction="row" spacing={2} className='mt-8 mb-4'>
                        
                        <TableContainer component={Paper}>
                            <Table size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell align="left">Title</StyledTableCell>
                                        <StyledTableCell align="right">Value</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">JOB ID</TableCell>
                                        <TableCell align="right">{timesheet.jobID}</TableCell>
                                    </TableRow>
                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">Job Timesheet Type</TableCell>
                                        <TableCell align="right">
                                            <span className='badgeSpan rag-blue-bg'>{timesheet.jobType}</span>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">Job Start Date</TableCell>
                                        <TableCell align="right">{timesheet.jobStartDate}</TableCell>
                                    </TableRow>
                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">Job End Date</TableCell>
                                        <TableCell align="right">{timesheet.jobEndDate}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <TableContainer component={Paper}>
                            <Table size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell align="left">Title</StyledTableCell>
                                        <StyledTableCell align="right">Value</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">JOB TITLE</TableCell>
                                        <TableCell align="right">{timesheet.jobTitle}</TableCell>
                                    </TableRow>
                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">Client</TableCell>
                                        <TableCell align="right">{timesheet.clientName}</TableCell>
                                    </TableRow>
                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">Implementation Partner</TableCell>
                                        <TableCell align="right">{timesheet.implementationPartnerName}</TableCell>
                                    </TableRow>
                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">Vendor</TableCell>
                                        <TableCell align="right">{timesheet.vendorName}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Stack>
                </div>

                <Stack direction="row" spacing={1} className='mb-1'>

                </Stack>

                <Grid container spacing={0} >
                    {formik.values.hours.map((hour, hourIndex) => (
                        <Grid key={hourIndex} className='timeHoursItem'>
                            <div className='dayOfWeek'>
                                {getDayOfWeek(addDays(new Date(timesheet.startDate), hourIndex))}
                            </div>
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
                    <Stack direction="row" spacing={2} className='mt-10'>
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
                            disabled={formik.isSubmitting}
                        >
                            Submit
                        </Button>
                    </Stack>
                </DialogActions>
            </Form>
        </FormikProvider>
    );
};

export default TimesheetEntryDialog;