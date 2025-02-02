import React, { useState } from 'react';
import { Formik, FieldArray } from 'formik';
import { Button, Grid, Typography, Box, Accordion, AccordionSummary, AccordionDetails, Stack, Dialog, DialogTitle, DialogContent } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import TimesheetEntryDialog from './timesheetentryDialog';
import { format, addDays, differenceInDays } from 'date-fns';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';

const TimesheetEntryForm = ({ data }) => {
    const [expanded, setExpanded] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedTimesheet, setSelectedTimesheet] = useState(null);

    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleOpenDialog = (timesheet) => {
        setSelectedTimesheet(timesheet);
        setOpenDialog(true);
    };

    const handleCloseDialog = (event, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setOpenDialog(false);
        setSelectedTimesheet(null);
    };

    //For dialog MUI
    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });
    const BootstrapDialog = styled(Dialog)(({ theme }) => ({
        '& .MuiDialogContent-root': {
            padding: theme.spacing(2),
        },
        '& .MuiDialogActions-root': {
            padding: theme.spacing(1),
        },
    }));
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    const uniqueJobNames = [...new Set(data.map(item => item.jobName))];

    return (
        <Formik
            initialValues={{
                timesheets: data.map(item => ({
                    ...item,
                    hours: Array(differenceInDays(new Date(item.endDate), new Date(item.startDate)) + 1).fill('')
                }))
            }}
            onSubmit={(values) => {
                // Handle form submission
            }}
        >
            {formik => (
                <Box className='w-[1200px] m-0'>
                    <Tabs className='mt-4 rounded-md w-[1200px]'>
                        <TabList className="timeTabsListHolder">
                            {uniqueJobNames.map((jobName, index) => (
                                <Tab key={index}>
                                    JOB: {jobName}
                                </Tab>
                            ))}
                        </TabList>
                        {uniqueJobNames.map((jobName, tabIndex) => {
                            const jobDetails = data.find(item => item.jobName === jobName);
                            return (
                                <TabPanel key={tabIndex} className="w-[1200px]">
                                    <Stack direction="row" spacing={1} className='mb-4'>
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
                                                        <TableCell align="right">{jobDetails.jobID}</TableCell>
                                                    </TableRow>
                                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                        <TableCell component="th" scope="row">Job Timesheet Type</TableCell>
                                                        <TableCell align="right">
                                                            <span className='badgeSpan rag-blue-bg'>{jobDetails.jobType}</span>
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                        <TableCell component="th" scope="row">Job Start Date</TableCell>
                                                        <TableCell align="right">{jobDetails.jobStartDate}</TableCell>
                                                    </TableRow>
                                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                        <TableCell component="th" scope="row">Job End Date</TableCell>
                                                        <TableCell align="right">{jobDetails.jobEndDate}</TableCell>
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
                                                        <TableCell align="right">{jobDetails.jobTitle}</TableCell>
                                                    </TableRow>
                                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                        <TableCell component="th" scope="row">Client</TableCell>
                                                        <TableCell align="right">{jobDetails.clientName}</TableCell>
                                                    </TableRow>
                                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                        <TableCell component="th" scope="row">Implementation Partner</TableCell>
                                                        <TableCell align="right">{jobDetails.implementationPartnerName}</TableCell>
                                                    </TableRow>
                                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                        <TableCell component="th" scope="row">Vendor</TableCell>
                                                        <TableCell align="right">{jobDetails.vendorName}</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Stack>
                                    <FieldArray name="timesheets">
                                        {({ remove, push }) => (
                                            <Box
                                                sx={{
                                                    width: '100%',
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))',
                                                    gap: 2,
                                                }}
                                            >
                                                {formik.values.timesheets
                                                    .filter(timesheet => timesheet.jobName === jobName)
                                                    .map((timesheet, index) => (
                                                        <div key={index} className='bg-slate-100 relative'>
                                                            <Card variant="outlined">
                                                                <CardContent key={index} className='bg-slate-100'>
                                                                    <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                                                                        TIMESHEET ID
                                                                    </Typography>
                                                                    <div className='badgeSpan rag-graylight-bg absolute left-2 bottom-4' sx={{ color: 'text.secondary', fontSize: 11 }}>
                                                                        Days pending: {timesheet.daysPending}
                                                                    </div>
                                                                    <Typography variant="h5" component="div">
                                                                        {timesheet.timesheetNumber}
                                                                    </Typography>
                                                                    <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
                                                                        <span className='rag-red-bg badgeSpan'>{timesheet.status}</span>
                                                                    </Typography>
                                                                    <Typography variant="body2">
                                                                        <span className=''>Start Date: {timesheet.startDate}</span>
                                                                        <br />
                                                                        <span className=''>End Date: {timesheet.endDate}</span>
                                                                    </Typography>
                                                                </CardContent>
                                                                <div className='bg-purple-300 float-right m-2'>
                                                                    <Button
                                                                        size='small'
                                                                        variant="contained"
                                                                        color="primary"
                                                                        onClick={() => handleOpenDialog(timesheet)}
                                                                    >
                                                                        Open & Submit
                                                                    </Button>
                                                                </div>
                                                            </Card>
                                                        </div>
                                                    ))}
                                            </Box>
                                        )}
                                    </FieldArray>
                                </TabPanel>
                            );
                        })}
                    </Tabs>
                    {selectedTimesheet && (

                        <BootstrapDialog
                            fullScreen
                            className="myFullScreenDialog"
                            onClose={handleCloseDialog}
                            TransitionComponent={Transition}
                            aria-labelledby="customized-dialog-title"
                            open={openDialog}
                        >
                            <DialogTitle className="text-pink-600" sx={{ m: 0, p: 1 }} id="customized-dialog-title">
                                Timesheet Entry
                            </DialogTitle>
                            <IconButton
                                aria-label="close"
                                onClick={handleCloseDialog}
                                sx={{
                                    position: 'absolute',
                                    right: 8,
                                    top: 8,
                                    color: (theme) => theme.palette.grey[500],
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                            <DialogContent dividers>
                                <TimesheetEntryDialog
                                    timesheet={selectedTimesheet}
                                    onClose={handleCloseDialog}
                                />
                            </DialogContent>
                        </BootstrapDialog>
                    )}
                </Box>
            )}
        </Formik>
    );
};

export default TimesheetEntryForm;