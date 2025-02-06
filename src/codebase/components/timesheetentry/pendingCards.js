import React, { useState, useContext, useRef } from 'react';
import { Context } from "../../context/context";
import { Formik, FieldArray } from 'formik';
import { Button, Typography, Box, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import TimesheetEntryDialog from './timesheetentryDialog';
import { differenceInDays } from 'date-fns';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TimesheetEntryMetadata from './timesheetentryMetadata';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import TimesheetAudit from '../timesheets/timesheetAudit';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import CustomSnackbar from "../snackbar/snackbar";
import axios from 'axios';
import emailjs from 'emailjs-com';

const TimesheetEntryForm = ({ data, onFormSubmitSuccess, mode }) => {
    const { APIPath, userName } = useContext(Context);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedTimesheet, setSelectedTimesheet] = useState(null);
    const form = useRef();

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

    const handleOpenDialog = (timesheet) => {
        setSelectedTimesheet(timesheet);
        console.log(timesheet);
        setOpenDialog(true);
    };

    const handleCloseDialog = (event, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setOpenDialog(false);
        setSelectedTimesheet(null);
    };

    const sendReminder = (tn, eid, tf, tt, tjn, pemail) => {
        console.log(tn);
        console.log(eid);
        console.log(tf);
        console.log(tt);
        console.log(tjn);

        // Create a virtual form element
        const form = document.createElement('form');

        // Create and append input elements to the form
        const subjectInput = document.createElement('input');
        subjectInput.setAttribute('type', 'hidden');
        subjectInput.setAttribute('name', 'user_email');
        subjectInput.setAttribute('value', pemail);
        form.appendChild(subjectInput);

        const i_tn = document.createElement('input');
        i_tn.setAttribute('type', 'hidden');
        i_tn.setAttribute('name', 'tn');
        i_tn.setAttribute('value', tn);
        form.appendChild(i_tn);

        const i_eid = document.createElement('input');
        i_eid.setAttribute('type', 'hidden');
        i_eid.setAttribute('name', 'eid');
        i_eid.setAttribute('value', eid);
        form.appendChild(i_eid);

        const i_tf = document.createElement('input');
        i_tf.setAttribute('type', 'hidden');
        i_tf.setAttribute('name', 'tf');
        i_tf.setAttribute('value', tf);
        form.appendChild(i_tf);

        const i_tt = document.createElement('input');
        i_tt.setAttribute('type', 'hidden');
        i_tt.setAttribute('name', 'tt');
        i_tt.setAttribute('value', tt);
        form.appendChild(i_tt);

        const i_tjn = document.createElement('input');
        i_tjn.setAttribute('type', 'hidden');
        i_tjn.setAttribute('name', 'tjn');
        i_tjn.setAttribute('value', tjn);
        form.appendChild(i_tjn);

        emailjs.sendForm('service_68p81qk', 'template_ekt8k16', form, 'r6Fya2Opl9134qi3r')
            .then((result) => {
                showSnackbar('success', "Reminder email sent to: " + pemail);
                console.log("sendReminder");
            }, (error) => {
                showSnackbar('error', "Error sending email to user");
            });
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

    const uniqueJobNames = [...new Set(data.map(item => item.jobName))];

    const getStatusClassName = (status) => {
        switch (status) {
            case 'Rejected':
                return 'rag-red-bg badgeSpan';
            case 'Pending':
                return 'rag-orange-bg badgeSpan';
            case 'SentBack':
                return 'rag-yellow-bg badgeSpan';
            default:
                return 'badgeSpan';
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
                    <Box className='w-[1200px] md:w-[1000px] sm:w-[700px] m-0'>
                        <Tabs className='mt-4 rounded-md '>
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
                                    <TabPanel key={tabIndex} className="w-full bg-slate-200">

                                        <TimesheetEntryMetadata timesheet={jobDetails} />

                                        <FieldArray name="timesheets">
                                            {({ remove, push }) => (
                                                <Box
                                                    className='p-4'
                                                    sx={{
                                                        display: 'grid',
                                                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                                                        gap: 1,
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
                                                                        <div title="Pending days" className='badgeSpan rag-graylight-bg absolute right-2 top-2' sx={{ color: 'text.secondary', fontSize: 11 }}>
                                                                            {timesheet.daysPending}
                                                                        </div>
                                                                        <div title="Mode" className='badgeSpan bg-orange-400 absolute right-2 bottom-3.5' sx={{ color: 'text.secondary', fontSize: 11 }}>
                                                                            MODE: {mode}
                                                                        </div>
                                                                        <Typography variant="h5" component="div">
                                                                            {timesheet.timesheetNumber}
                                                                        </Typography>
                                                                        <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
                                                                            <span className={getStatusClassName(timesheet.status)}>{timesheet.status}</span>
                                                                        </Typography>
                                                                        <Typography variant="body2">
                                                                            <span className=''>Start Date: {timesheet.startDate}</span>
                                                                            <br />
                                                                            <span className=''>End Date: {timesheet.endDate}</span>
                                                                        </Typography>
                                                                    </CardContent>
                                                                    <div className='bg-blue-100 m-0'>
                                                                        {mode === "Edit" && (
                                                                            <IconButton aria-label="SUBMIT" title="SUBMIT" color="primary"
                                                                                className='ml-2'
                                                                                onClick={() => handleOpenDialog(timesheet)}
                                                                            >
                                                                                <ExitToAppOutlinedIcon />
                                                                            </IconButton>
                                                                        )}
                                                                        {timesheet.existingRecordId !== 0 && (
                                                                            <TimesheetAudit ID={timesheet.existingRecordId} timesheetNumber={timesheet.timesheetNumber} operation="View" doLoading={true} />
                                                                        )}
                                                                        {mode === "View" && (
                                                                            <>
                                                                                <IconButton aria-label="VIEW" title="VIEW" color="primary"
                                                                                    className='ml-2'
                                                                                    onClick={() => handleOpenDialog(timesheet)}
                                                                                >
                                                                                    <RemoveRedEyeOutlinedIcon />
                                                                                </IconButton>
                                                                                <IconButton aria-label="REMINDER" title="REMINDER" color="primary"
                                                                                    className='ml-2'
                                                                                    onClick={() =>
                                                                                        sendReminder(timesheet.timesheetNumber,
                                                                                            timesheet.employeeID,
                                                                                            timesheet.startDate,
                                                                                            timesheet.endDate,
                                                                                            timesheet.jobName,
                                                                                            timesheet.personalEmail,
                                                                                            timesheet.applicationEmail
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <NotificationsActiveOutlinedIcon />
                                                                                </IconButton>
                                                                            </>
                                                                        )}
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
                                <DialogTitle className="text-pink-600 w-[900px]" sx={{ m: 0, p: 1 }} id="customized-dialog-title">
                                    {selectedTimesheet.existingRecordId === 0 ? "SUBMIT" : "EDIT & SUBMIT"} Timesheet: {selectedTimesheet.timesheetNumber}
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
                                        existingId={selectedTimesheet.existingRecordId}
                                        timesheet={selectedTimesheet}
                                        onClose={handleCloseDialog}
                                        onFormSubmitSuccess={onFormSubmitSuccess}
                                        operation={selectedTimesheet.existingRecordId !== 0 ? "Edit" : "New"}
                                        viewOnlyMode={mode === "View" ? 1 : 0}
                                    />
                                </DialogContent>
                            </BootstrapDialog>
                        )}
                    </Box>
                )}
            </Formik>
        </>
    );
};

export default TimesheetEntryForm;